"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
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
  }, [])

  const loadStores = async () => {
    if (!token) return

    try {
      setLoading(true)
      const storesData = await shoppingInventoryAPI.getStores(token)
      setStores(storesData)

      // If there's only one store, automatically select it
      if (storesData.length === 1) {
        setSelectedStore(storesData[0])
        if (onStoreSelect) {
          onStoreSelect(storesData[0])
        }
      }
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
    setSelectedStore(store)
    if (onStoreSelect) {
      onStoreSelect(store)
    }
    // Navigate to store-specific dashboard
    router.push(`/dashboard/store?id=${store.id}`)
  }

  const handleCreateNewStore = () => {
    router.push("/business/onboard?step=store-setup")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your stores...</p>
        </div>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
        {/* Background glass orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="glass-card w-full max-w-md mx-auto text-center animate-glass-appear">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <StoreIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome to Piaxe Business!</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any stores yet. Let's create your first store to get started.
              </p>

              <button
                onClick={handleCreateNewStore}
                className="glass-button glass-button-primary w-full mb-6 flex items-center justify-center text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Store
              </button>

              <div className="text-sm text-muted-foreground">
                <p className="mb-3">With your store, you'll be able to:</p>
                <ul className="text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Manage products and inventory
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Process payments and orders
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Track sales and analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Manage customer relationships
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stores.length === 1) {
    const store = stores[0]
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
        {/* Background glass orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome to your store dashboard</h1>
              <p className="text-muted-foreground">Managing: {store.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-glass-appear"
                style={{ animationDelay: "0.1s" }}
                onClick={() => router.push(`/dashboard/store?id=${store.id}&section=products`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-blue-600" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">Add and manage your inventory</p>
                </div>
              </div>

              <div
                className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-glass-appear"
                style={{ animationDelay: "0.2s" }}
                onClick={() => router.push(`/dashboard/store?id=${store.id}&section=orders`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag className="w-8 h-8 text-green-600" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">View Orders</h3>
                  <p className="text-sm text-muted-foreground">Track and manage orders</p>
                </div>
              </div>

              <div
                className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-glass-appear"
                style={{ animationDelay: "0.3s" }}
                onClick={() => router.push(`/dashboard/store?id=${store.id}&section=analytics`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View sales and performance</p>
                </div>
              </div>
            </div>

            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.4s" }}>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <StoreIcon className="w-5 h-5" />
                  Store Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{store.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{store.contact_email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Business Hours Set</span>
                    </div>
                    <button
                      className="glass-button glass-button-secondary text-secondary-foreground flex items-center"
                      onClick={() => router.push(`/dashboard/store?id=${store.id}&section=settings`)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Store Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Multiple stores - show selection interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
      {/* Background glass orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Select a Store to Manage</h1>
            <p className="text-muted-foreground">You have {stores.length} stores. Choose one to manage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <div
                key={store.id}
                className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-glass-appear"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleStoreSelect(store)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{store.name}</h3>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                  </div>
                  {store.description && <p className="text-sm text-muted-foreground mb-4">{store.description}</p>}

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{store.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{store.contact_email}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <button className="glass-button w-full text-foreground flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Manage Store
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new store card */}
            <div
              className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-glass-appear border-dashed"
              style={{ animationDelay: `${stores.length * 0.1}s` }}
              onClick={handleCreateNewStore}
            >
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Add New Store</h4>
                <p className="text-sm text-muted-foreground">Expand your business with additional locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
