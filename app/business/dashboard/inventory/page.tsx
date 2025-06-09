"use client"

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"
import { InventoryManager } from "@/components/dashboard/inventory-manager"

export default function BusinessInventoryPage() {
    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory Management</h1>
                        <p className="text-muted-foreground">
                            Manage your products, stock levels, and inventory alerts
                        </p>
                    </div>
                    <InventoryManager />
                </div>
            </div>
        </BusinessProtectedRoute>
    )
}
