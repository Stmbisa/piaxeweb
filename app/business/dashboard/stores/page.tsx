"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { StoreManager } from "@/components/business/store-manager"

export default function BusinessStoresPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
                {/* Background glass orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

                <div className="relative z-10 container mx-auto px-4 py-8">
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Store Management</h1>
                        <p className="text-muted-foreground">
                            Create and manage your store locations with liquid glass design
                        </p>
                    </div>
                    <StoreManager />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
