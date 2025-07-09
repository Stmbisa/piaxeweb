"use client";

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route";
import { BusinessSidebar } from "@/components/business/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

// Optional: If all child routes under /business/dashboard need dynamic rendering
// export const dynamic = "force-dynamic";

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex">
          <BusinessSidebar />
          <main className="flex-1 w-full max-w-none">{children}</main>
        </div>
      </SidebarProvider>
    </BusinessProtectedRoute>
  );
}
