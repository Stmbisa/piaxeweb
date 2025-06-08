"use client"

import { useState } from 'react'
import { MerchantProtectedRoute } from '@/components/auth/merchant-protected-route'
import { StoreSidebar } from '@/components/dashboard/store-sidebar'
import { InventoryManager } from '@/components/dashboard/inventory-manager'
import { CRMDashboard } from '@/components/dashboard/crm-dashboard'
import { CampaignManager } from '@/components/dashboard/campaign-manager'
import { StoreAnalytics } from '@/components/dashboard/store-analytics'
import { PaymentSettings } from '@/components/dashboard/payment-settings'

const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' },
    { id: 'customers', label: 'Customers (CRM)', icon: 'Users' },
    { id: 'campaigns', label: 'Marketing', icon: 'Megaphone' },
    { id: 'payments', label: 'Payment Settings', icon: 'CreditCard' },
]

export default function StoreDashboard() {
    const [activeSection, setActiveSection] = useState('analytics')

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'analytics':
                return <StoreAnalytics />
            case 'inventory':
                return <InventoryManager />
            case 'customers':
                return <CRMDashboard />
            case 'campaigns':
                return <CampaignManager />
            case 'payments':
                return <PaymentSettings />
            default:
                return <StoreAnalytics />
        }
    }

    return (
        <MerchantProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
                <div className="flex">
                    <StoreSidebar
                        items={sidebarItems}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                    <main className="flex-1 p-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold tracking-tight mb-2">
                                    Store Dashboard
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your business operations, inventory, and customer relationships
                                </p>
                            </div>
                            {renderActiveSection()}
                        </div>
                    </main>
                </div>
            </div>
        </MerchantProtectedRoute>
    )
}
