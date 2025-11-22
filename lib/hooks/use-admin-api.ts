import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { getDeviceIdFromToken } from "@/lib/utils";

/**
 * Hook for making admin API calls with automatic token expiration handling
 */
export function useAdminAPI() {
  const { token, refreshAuth, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleApiError = useCallback(
    async (error: any, response?: Response): Promise<never> => {
      // Handle 401 Unauthorized - token expired or invalid
      if (response?.status === 401) {
        try {
          // Attempt to refresh the token
          await refreshAuth();
          toast({
            title: "Session refreshed",
            description: "Your session has been refreshed. Please try again.",
            variant: "default",
          });
          throw new Error("TOKEN_REFRESHED"); // Signal to retry
        } catch (refreshError) {
          // Refresh failed, logout user
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          await logout();
          router.push("/auth/login");
          throw new Error("SESSION_EXPIRED");
        }
      }

      // Handle 403 Forbidden - not authorized (not an admin)
      if (response?.status === 403) {
        toast({
          title: "Access denied",
          description: "You do not have permission to perform this action.",
          variant: "destructive",
        });
        router.push("/dashboard");
        throw new Error("ACCESS_DENIED");
      }

      // Handle other errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : response?.statusText || "An unexpected error occurred";

      throw new Error(errorMessage);
    },
    [refreshAuth, logout, router, toast]
  );

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      };

      const deviceId = getDeviceIdFromToken(token);
      if (deviceId) {
        headers["X-Device-ID"] = deviceId;
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        // Handle token expiration
        if (response.status === 401 || response.status === 403) {
          await handleApiError(new Error("Authentication failed"), response);
          // This will never return due to the throw in handleApiError
          return response;
        }

        return response;
      } catch (error) {
        // Re-throw if it's already a handled error
        if (
          error instanceof Error &&
          (error.message === "SESSION_EXPIRED" ||
            error.message === "TOKEN_REFRESHED" ||
            error.message === "ACCESS_DENIED")
        ) {
          throw error;
        }

        // Network errors or other fetch failures
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error("Network error: Please check your connection.");
        }
        throw error;
      }
    },
    [token, handleApiError]
  );

  return {
    fetchWithAuth,
    handleApiError,
  };
}
