"use client";

/**
 * usePinProtectedRequest - Hook for making API calls that may require PIN verification
 *
 * Automatically intercepts 403 PIN_REQUIRED errors and shows PIN modal,
 * then retries the request after successful PIN verification.
 */

import { useCallback } from "react";
import { usePin, PinRequiredError } from "@/lib/auth/pin-context";

interface RequestConfig extends RequestInit {
  url: string;
}

export function usePinProtectedRequest() {
  const { handlePinRequiredError } = usePin();

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("piaxis_auth_token");
  };

  /**
   * Execute a fetch request with automatic PIN verification handling
   */
  const executeWithPin = useCallback(async <T = any>(
    config: RequestConfig
  ): Promise<T> => {
    const token = getToken();

    const execute = async (): Promise<Response> => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(config.headers as Record<string, string>),
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}${config.url}`, {
        ...config,
        headers,
      });
    };

    let response = await execute();

    // Check for PIN_REQUIRED error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));

      if (errorData.code === "PIN_REQUIRED") {
        const pinError: PinRequiredError = {
          code: "PIN_REQUIRED",
          scope: errorData.scope,
          nonce: errorData.nonce,
          message: errorData.message || "PIN required",
        };

        console.log("[usePinProtectedRequest] PIN_REQUIRED intercepted");

        // Request PIN verification
        const verified = await handlePinRequiredError(pinError);

        if (verified) {
          // PIN verified, retry the original request
          console.log("[usePinProtectedRequest] PIN verified, retrying...");
          response = await execute();
        } else {
          // PIN verification cancelled
          throw new Error("PIN verification required but was cancelled");
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }, [handlePinRequiredError]);

  /**
   * Shorthand methods
   */
  const get = useCallback(<T = any>(url: string) =>
    executeWithPin<T>({ url, method: "GET" }), [executeWithPin]);

  const post = useCallback(<T = any>(url: string, data?: any) =>
    executeWithPin<T>({ url, method: "POST", body: JSON.stringify(data) }), [executeWithPin]);

  const put = useCallback(<T = any>(url: string, data?: any) =>
    executeWithPin<T>({ url, method: "PUT", body: JSON.stringify(data) }), [executeWithPin]);

  const patch = useCallback(<T = any>(url: string, data?: any) =>
    executeWithPin<T>({ url, method: "PATCH", body: JSON.stringify(data) }), [executeWithPin]);

  const del = useCallback(<T = any>(url: string) =>
    executeWithPin<T>({ url, method: "DELETE" }), [executeWithPin]);

  return {
    executeWithPin,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}

export default usePinProtectedRequest;
