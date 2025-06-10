"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import { StoreSidebar } from "@/components/dashboard/store-sidebar"
import { ProductsManager } from "@/components/business/products-manager"
import { OrdersManager } from "@/components/business/orders-manager"
import { StoreAnalytics } from "@/components/dashboard/store-analytics"
import { SettingsManager } from "@/components/business/settings-manager"
import { useToast } from "@/hooks/use-toast"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

const DASHBOARD_SECTIONS = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'products', label: 'Products', icon: 'Package' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBag' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
]

export default function StoreDashboard() {
    const [currentStore, setCurrentStore] = useState<Store | null>(null)
    const [activeSection, setActiveSection] = useState('overview')
    const [loading, setLoading] = useState(true)

    const { token } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    const storeId = searchParams.get('id')
    const section = searchParams.get('section') || 'overview'

    useEffect(() => {
        if (section && DASHBOARD_SECTIONS.find(s => s.id === section)) {
            setActiveSection(section)
        }
    }, [section])

    useEffect(() => {
        if (!storeId) {
            router.push('/dashboard')
            return
        }

        loadStore()
    }, [storeId])

    const loadStore = async () => {
        if (!token || !storeId) return

        try {
            setLoading(true)
            const stores = await shoppingInventoryAPI.getStores(token)
            const store = stores.find(s => s.id === storeId)

            if (!store) {
                toast({
                    title: "Store not found",
                    description: "The requested store was not found",
                    variant: "destructive",
                })
                router.push('/dashboard')
                return
            }

            setCurrentStore(store)
        } catch (error) {
            console.error('Error loading store:', error)
            toast({
                title: "Error",
                description: "Failed to load store information",
                variant: "destructive",
            })
            router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId)
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set('section', sectionId)
        router.push(newUrl.pathname + newUrl.search)
    }

    const renderActiveSection = () => {
        if (!currentStore) return null

        switch (activeSection) {
            case 'products':
                return <ProductsManager />
            case 'orders':
                return <OrdersManager />
            case 'analytics':
                return <StoreAnalytics />
            case 'settings':
                return <SettingsManager />
            default:
                return <StoreOverview store={currentStore} />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading store...</p>
                </div>
            </div>
        )
    }

    if (!currentStore) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-white flex">
            <StoreSidebar
                items={DASHBOARD_SECTIONS}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">{currentStore.name}</h1>
                        <p className="text-muted-foreground">{currentStore.description}</p>
                    </div>
                    {renderActiveSection()}
                </div>
            </main>
        </div>
    )
}

// Simple overview component for the store
function StoreOverview({ store }: { store: Store }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overview stats cards */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Orders Today</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                    <p className="text-2xl font-bold">UGX 0</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Customers</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium">Add Products</h4>
                        <p className="text-sm text-muted-foreground">Start adding products to your inventory</p>
                    </button>
                    <button className="p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium">Process Orders</h4>
                        <p className="text-sm text-muted-foreground">View and manage customer orders</p>
                    </button>
                    <button className="p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Check your sales performance</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
