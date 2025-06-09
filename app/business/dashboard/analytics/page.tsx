"use client"

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { StoreAnalytics } from "@/components/dashboard/store-analytics"

export default function BusinessAnalyticsPage() {
  return (
    <BusinessProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              View sales analytics, revenue reports, and business insights
            </p>
          </div>
          <StoreAnalytics />
        </div>
      </div>
    </BusinessProtectedRoute>
  )
}
