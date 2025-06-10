"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { CampaignManager } from "@/components/dashboard/campaign-manager"

export default function BusinessCampaignsPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Marketing Campaigns</h1>
                        <p className="text-muted-foreground">
                            Create and manage marketing campaigns for your customers
                        </p>
                    </div>
                    <CampaignManager />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
