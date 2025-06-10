"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { CRMDashboard } from "@/components/dashboard/crm-dashboard"

export default function BusinessCustomersPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Customer Management</h1>
                        <p className="text-muted-foreground">
                            View customers, manage relationships, and track purchases
                        </p>
                    </div>
                    <CRMDashboard />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
