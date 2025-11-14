import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Decode a JWT and extract its payload safely (works in browser and Node)
export function decodeJwtPayload(token?: string): any | undefined {
  if (!token) return undefined;
  const parts = token.split(".");
  if (parts.length < 2) return undefined;
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  try {
    // Prefer atob in browsers; fallback to Buffer in Node
    const jsonStr = typeof atob === "function"
      ? decodeURIComponent(
          Array.prototype.map
            .call(atob(base64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch {
    return undefined;
  }
}

// Extract Device ID (dfp) claim from a JWT if present
export function getDeviceIdFromToken(token?: string): string | undefined {
  const payload = decodeJwtPayload(token);
  if (payload && typeof payload.dfp === "string" && payload.dfp.length > 0) {
    return payload.dfp;
  }
  return undefined;
}

// Whether to send X-Device-ID header from browser. Default: false.
// Can be overridden for special environments by setting NEXT_PUBLIC_SEND_DEVICE_HEADER_IN_BROWSER=true
export const SEND_DEVICE_HEADER_IN_BROWSER =
  typeof process !== "undefined" &&
  typeof (process as any).env !== "undefined" &&
  (process as any).env.NEXT_PUBLIC_SEND_DEVICE_HEADER_IN_BROWSER === "true";

// Build device-binding headers appropriate for the current runtime
export function deviceHeadersForContext(token?: string): Record<string, string> {
  const deviceId = getDeviceIdFromToken(token);
  if (!deviceId) return {};

  const isBrowser = typeof window !== "undefined";
  if (isBrowser && !SEND_DEVICE_HEADER_IN_BROWSER) {
    // In browsers, prefer cookie; avoid custom header to prevent CORS preflight failures
    return {};
  }

  return { "X-Device-ID": deviceId };
}
