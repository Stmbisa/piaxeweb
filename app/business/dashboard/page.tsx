"use client";

import { useAuth } from "@/lib/auth/context";
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route";
import { BusinessDashboardOverview } from "@/components/business/dashboard-overview";
import { BusinessSidebar } from "@/components/business/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

// Force dynamic rendering since this page requires authentication
export const dynamic = "force-dynamic";

export default function BusinessDashboard() {
  const { user } = useAuth();
  // const businessProfile = user?.business_profile; // Not directly used in this layout

  return (
    <BusinessProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 flex">
          <BusinessSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mb-4">
              {/* Example Trigger: visible on all screens for demo, customize as needed */}
              <SidebarTrigger className="p-2">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
            </div>
            <BusinessDashboardOverview />
          </main>
        </div>
      </SidebarProvider>
    </BusinessProtectedRoute>
  );
}
