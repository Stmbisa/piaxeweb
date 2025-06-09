"use client"

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { StoreManager } from "@/components/business/store-manager"

export default function BusinessStoresPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Store Management</h1>
                        <p className="text-muted-foreground">
                            Create and manage your store locations
                        </p>
                    </div>
                    <StoreManager />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
