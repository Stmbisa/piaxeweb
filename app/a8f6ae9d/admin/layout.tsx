"use client";

import { AdminProtectedRoute } from "@/components/auth/admin-protected-route";
import { AdminSidebar } from "@/components/admin/sidebar";
import React from "react";

// Admin section requires dynamic rendering for authorization checks
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
        <div className="min-h-screen flex">
          <AdminSidebar />
          <main className="flex-1 w-full max-w-none p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
