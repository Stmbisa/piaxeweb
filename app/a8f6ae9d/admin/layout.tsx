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
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Glass orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed pointer-events-none"></div>

        <div className="min-h-screen flex relative z-10">
          <AdminSidebar />
          <main className="flex-1 w-full max-w-none p-4 md:p-6 lg:p-8 animate-glass-appear">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
