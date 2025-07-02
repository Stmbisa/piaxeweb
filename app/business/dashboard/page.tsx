"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route";
import { BusinessDashboardOverview } from "@/components/business/dashboard-overview";
import { BusinessSidebar } from "@/components/business/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// Force dynamic rendering since this page requires authentication
export const dynamic = "force-dynamic";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const businessProfile = user?.business_profile;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BusinessProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 flex">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 md:hidden glass-button hover:scale-110 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Sidebar - hidden on mobile by default, shown as overlay when opened */}
        <BusinessSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main content - full width on mobile, adjusted for sidebar on desktop */}
        <main className="flex-1 overflow-auto">
          <BusinessDashboardOverview />
        </main>
      </div>
    </BusinessProtectedRoute>
  );
}
