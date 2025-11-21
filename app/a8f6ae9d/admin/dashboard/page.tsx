"use client";

import { AdminDashboardOverview } from "@/components/admin/dashboard-overview";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <AdminDashboardOverview />
    </div>
  );
}
