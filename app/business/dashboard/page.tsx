"use client"

import { useAuth } from "@/lib/auth/context"
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"

export default function BusinessDashboard() {
    const { user } = useAuth()
    const businessProfile = user?.business_profile

    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-4">Business Dashboard</h1>
                    <p>Welcome back, {businessProfile?.business_name}</p>
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
