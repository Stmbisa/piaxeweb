"use client"

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { StaffManager } from "@/components/business/staff-manager"

export default function BusinessStaffPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Staff Management</h1>
                        <p className="text-muted-foreground">
                            Add, manage, and track your team members
                        </p>
                    </div>
                    <StaffManager />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
