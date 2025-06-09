"use client"

import { useAuth } from "@/lib/auth/context"
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { BusinessDashboardOverview } from "@/components/business/dashboard-overview"
import { BusinessSidebar } from "@/components/business/sidebar"

export default function BusinessDashboard() {
    const { user } = useAuth()
    const businessProfile = user?.business_profile

    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white flex">
                <BusinessSidebar />
                <main className="flex-1 overflow-auto">
                    <BusinessDashboardOverview />
                </main>
            </div>
        </BusinessProtectedRoute>
    )
}
