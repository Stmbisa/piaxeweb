"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import {
    shoppingInventoryAPI,
    type Store,
    type Product,
} from "@/lib/api/shopping-inventory"
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

function StoreDashboardContent() {
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden flex">
            {/* Background glass orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

            <StoreSidebar
                items={DASHBOARD_SECTIONS}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            <main className="flex-1 overflow-auto relative z-10">
                <div className="p-6">
                    <div className="glass-card-enhanced mb-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{currentStore.name}</h1>
                                <p className="text-muted-foreground">{currentStore.description}</p>
                            </div>
                            <button className="glass-button-primary mt-4 sm:mt-0 px-6 py-3 rounded-lg font-semibold">
                                Manage Store
                            </button>
                        </div>
                    </div>
                    {renderActiveSection()}
                </div>
            </main>
        </div>
    )
}

// Simple overview component for the store
function StoreOverview({ store }: { store: Store }) {
    const { token } = useAuth()
    const { toast } = useToast()

    const [showManualSale, setShowManualSale] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [productsLoading, setProductsLoading] = useState(false)

    const [productId, setProductId] = useState("")
    const [quantity, setQuantity] = useState("1")
    const [amount, setAmount] = useState("")
    const [notes, setNotes] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!showManualSale) return
        if (!token) return

        const run = async () => {
            try {
                setProductsLoading(true)
                const list = await shoppingInventoryAPI.getProducts(token, store.id, { limit: 100 })
                setProducts(list)
            } catch (e: any) {
                console.error(e)
                toast({
                    title: "Error",
                    description: e?.message ?? "Failed to load products",
                    variant: "destructive",
                })
            } finally {
                setProductsLoading(false)
            }
        }

        run()
    }, [showManualSale, token, store.id, toast])

    const submitManualSale = async () => {
        if (!token) {
            toast({
                title: "Not signed in",
                description: "Please sign in again.",
                variant: "destructive",
            })
            return
        }

        const q = Number.parseInt(quantity, 10)
        const a = Number.parseFloat(amount)

        if (!productId) {
            toast({
                title: "Missing product",
                description: "Select a product to sell.",
                variant: "destructive",
            })
            return
        }
        if (!Number.isFinite(q) || q <= 0) {
            toast({
                title: "Invalid quantity",
                description: "Quantity must be greater than 0.",
                variant: "destructive",
            })
            return
        }
        if (!Number.isFinite(a) || a <= 0) {
            toast({
                title: "Invalid amount",
                description: "Amount must be greater than 0.",
                variant: "destructive",
            })
            return
        }

        try {
            setSaving(true)
            const res = await shoppingInventoryAPI.recordManualCashSale(token, store.id, {
                product_id: productId,
                quantity: q,
                amount: a,
                notes: notes.trim() || undefined,
            })

            toast({
                title: "Cash sale recorded",
                description: `${res.message} (Remaining stock: ${res.inventory_quantity_available})`,
            })
            setShowManualSale(false)
            setProductId("")
            setQuantity("1")
            setAmount("")
            setNotes("")
        } catch (e: any) {
            console.error(e)
            toast({
                title: "Error",
                description: e?.message ?? "Failed to record cash sale",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overview stats cards */}
                <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: "0.1s" }}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Products</h3>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: "0.2s" }}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Orders Today</h3>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: "0.3s" }}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Revenue</h3>
                    <p className="text-2xl font-bold text-foreground">UGX 0</p>
                </div>
                <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Customers</h3>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
            </div>

            <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: "0.5s" }}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="glass-button text-left p-4 rounded-lg transition-all duration-300 hover:glass-hover">
                        <h4 className="font-medium text-foreground mb-2">Add Products</h4>
                        <p className="text-sm text-muted-foreground">Start adding products to your inventory</p>
                    </button>
                    <button className="glass-button text-left p-4 rounded-lg transition-all duration-300 hover:glass-hover">
                        <h4 className="font-medium text-foreground mb-2">Process Orders</h4>
                        <p className="text-sm text-muted-foreground">View and manage customer orders</p>
                    </button>
                    <button className="glass-button text-left p-4 rounded-lg transition-all duration-300 hover:glass-hover">
                        <h4 className="font-medium text-foreground mb-2">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Check your sales performance</p>
                    </button>

                    <button
                        onClick={() => setShowManualSale(true)}
                        className="glass-button text-left p-4 rounded-lg transition-all duration-300 hover:glass-hover"
                    >
                        <h4 className="font-medium text-foreground mb-2">Record Cash Sale</h4>
                        <p className="text-sm text-muted-foreground">Deduct stock and record an offline sale</p>
                    </button>
                </div>
            </div>

            {showManualSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="glass-card-enhanced w-full max-w-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Manual Cash Sale</h3>
                            <button
                                onClick={() => setShowManualSale(false)}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Product</label>
                                {productsLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading products...</div>
                                ) : (
                                    <select
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Quantity</label>
                                    <input
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        inputMode="numeric"
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                                        placeholder="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Amount ({store.currency})</label>
                                    <input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        inputMode="decimal"
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                                        placeholder={`e.g. 25000`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Notes (optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="e.g. Cash sale at counter"
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    onClick={() => setShowManualSale(false)}
                                    className="glass-button px-4 py-2 rounded-lg"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitManualSale}
                                    className="glass-button-primary px-4 py-2 rounded-lg font-semibold"
                                    disabled={saving || productsLoading}
                                >
                                    {saving ? "Saving..." : "Record Sale"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function StoreDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading store dashboard...</p>
                </div>
            </div>
        }>
            <StoreDashboardContent />
        </Suspense>
    )
}
