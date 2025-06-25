"use client";

import { BusinessDashboardOverview } from "@/components/business/dashboard-overview";

// The dynamic export might still be useful here if this specific page
// has content that requires it, separate from the layout.
// If not, it can be removed if the layout handles dynamic aspects.
export const dynamic = "force-dynamic";

export default function BusinessDashboardPage() {
  // useAuth and businessProfile might not be needed here anymore if not directly used by BusinessDashboardOverview
  // or if context is sufficiently provided by the layout.
  return <BusinessDashboardOverview />;
}
