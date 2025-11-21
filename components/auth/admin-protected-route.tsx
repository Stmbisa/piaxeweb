"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminProtectedRoute({
  children,
  fallback,
}: AdminProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to regular login if not authenticated
      router.push("/auth/login");
    }
    // No need to check for isAdmin - the backend will handle that with 403 errors
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
          <div className="text-center space-y-4 glass-card-enhanced p-8 animate-glass-appear">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <p className="text-muted-foreground font-medium">
              Loading admin portal...
            </p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting to login page
  }

  // Let the backend handle admin permission checks
  return <>{children}</>;
}
