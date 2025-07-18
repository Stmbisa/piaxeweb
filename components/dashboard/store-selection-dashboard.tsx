"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import {
    StoreIcon,
    Plus,
    Settings,
    BarChart3,
    Package,
    ShoppingBag,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Clock,
} from "lucide-react"

interface StoreSelectionDashboardProps {
    onStoreSelect?: (store: Store) => void
}

export function StoreSelectionDashboard({ onStoreSelect }: StoreSelectionDashboardProps) {
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)

    const { user, token } = useAuth()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        loadStores()
    }, [token])

    const loadStores = async () => {
        if (!token) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const storesData = await shoppingInventoryAPI.getStores(token)
            setStores(storesData)
        } catch (error) {
            console.error("Error loading stores:", error)
            toast({
                title: "Error",
                description: "Failed to load your stores",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStoreSelect = (store: Store) => {
        if (onStoreSelect) {
            onStoreSelect(store)
        }
        router.push(`/dashboard/store?id=${store.id}`)
    }

    const handleCreateNewStore = () => {
        router.push("/business/onboard?step=store-setup")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
                <div className="glass-card text-center space-y-4 animate-glass-appear">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading your stores...</p>
                </div>
            </div>
        )
    }

    if (stores.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                    <div className="glass-card w-full max-w-md mx-auto text-center animate-glass-appear">
                        <div className="glass-icon-button w-16 h-16 mx-auto mb-6">
                            <StoreIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome to Piaxe Business!</h2>
                        <p className="text-muted-foreground mb-8">
                            You don't have any stores yet. Let's create your first store to get started.
                        </p>

                        <button
                            onClick={handleCreateNewStore}
                            className="glass-button-primary w-full mb-8 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Store
                        </button>

                        <div className="text-sm text-muted-foreground">
                            <p className="mb-4">With your store, you'll be able to:</p>
                            <ul className="text-left space-y-3">
                                {[
                                    "Manage products and inventory",
                                    "Process payments and orders",
                                    "Track sales and analytics",
                                    "Manage customer relationships",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (stores.length === 1) {
        const store = stores[0];

        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-piaxe-primary/10 rounded-full blur-3xl animate-glass-float opacity-70"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-piaxe-secondary/10 rounded-full blur-3xl animate-glass-float-delayed opacity-70"></div>

                <div className="relative z-10 p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 animate-fade-in text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Store Dashboard</h1>
                            <p className="text-lg text-muted-foreground">Managing: <span className="font-semibold text-primary">{store.name}</span></p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                            {[
                                { title: "Manage Products", icon: Package, section: "products", color: "text-piaxe-primary", delay: "0.1s" },
                                { title: "View Orders", icon: ShoppingBag, section: "orders", color: "text-green-500", delay: "0.2s" },
                                { title: "Analytics", icon: BarChart3, section: "analytics", color: "text-purple-500", delay: "0.3s" },
                            ].map((item) => (
                                <div
                                    key={item.section}
                                    className="glass-card cursor-pointer hover:shadow-2xl animate-glass-appear group"
                                    style={{ animationDelay: item.delay }}
                                    onClick={() => router.push(`/dashboard/store?id=${store.id}§ion=${item.section}`)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <item.icon className={`w-9 h-9 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
                                        <ArrowRight className="w-5 h-5 text-muted-foreground/70 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1 text-foreground">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.title === "Manage Products" ? "Add and manage your inventory" :
                                            item.title === "View Orders" ? "Track and manage customer orders" :
                                                "View sales and performance data"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5 text-foreground">
                                <StoreIcon className="w-6 h-6 text-primary" />
                                Store Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-3">
                                    {[
                                        { icon: MapPin, text: store.address },
                                        { icon: Phone, text: store.contact_phone },
                                        { icon: Mail, text: store.contact_email },
                                    ].map((info, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm text-foreground">
                                            <info.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <span>{info.text || "Not specified"}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 md:flex md:flex-col md:items-start">
                                    <div className="flex items-center gap-3 text-sm text-foreground">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>Business Hours: <span className="font-medium">Set in Settings</span></span>
                                    </div>
                                    <button
                                        className="glass-button glass-button-secondary w-full md:w-auto mt-2 flex items-center justify-center gap-2"
                                        onClick={() => router.push(`/dashboard/store?id=${store.id}§ion=settings`)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Store Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
                            <button
                                onClick={handleCreateNewStore}
                                className="glass-button hover:bg-muted/20 flex items-center justify-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4 text-foreground/80" />
                                Add Another Store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-piaxe-primary/10 rounded-full blur-3xl animate-glass-float opacity-70"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-piaxe-secondary/10 rounded-full blur-3xl animate-glass-float-delayed opacity-70"></div>

            <div className="relative z-10 p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 md:mb-12 animate-fade-in text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Select a Store</h1>
                        <p className="text-lg text-muted-foreground">You have {stores.length} stores. Choose one to manage or create a new one.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {stores.map((store, index) => (
                            <div
                                key={store.id}
                                className="glass-card cursor-pointer group animate-glass-appear flex flex-col"
                                style={{ animationDelay: `${index * 0.075}s` }}
                                onClick={() => handleStoreSelect(store)}
                            >
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-semibold text-foreground">{store.name}</h3>
                                        <span className="text-xs font-medium bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                                            Active
                                        </span>
                                    </div>
                                    {store.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{store.description}</p>}

                                    <div className="space-y-2.5 text-sm mb-6">
                                        {[
                                            { icon: MapPin, text: store.address },
                                            { icon: Phone, text: store.contact_phone },
                                        ].map((info, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5 text-muted-foreground">
                                                <info.icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{info.text || "N/A"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-[var(--glass-border-rgb)]/20">
                                    <button className="glass-button w-full text-foreground flex items-center justify-center gap-2 group-hover:glass-button-primary group-hover:text-primary-foreground">
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        Manage Store
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div
                            className="glass-card cursor-pointer hover:shadow-2xl animate-glass-appear flex flex-col items-center justify-center text-center min-h-[280px] md:min-h-[320px]"
                            style={{ animationDelay: `${stores.length * 0.075}s` }}
                            onClick={handleCreateNewStore}
                        >
                            <div className="glass-icon-button bg-primary/10 mb-6 w-16 h-16 hover:bg-primary/20">
                                <Plus className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground mb-1.5">Add New Store</h4>
                            <p className="text-sm text-muted-foreground px-2">Expand your business with another location.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}