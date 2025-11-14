"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import {
  Building2,
  Store as StoreIcon,
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Zap
} from "lucide-react"

interface DashboardStats {
  stores: number
  products: number
  orders: number
  revenue: number
  customers: number
  staff: number
}

interface RecentActivity {
  id: string
  type: 'order' | 'product' | 'customer' | 'staff'
  title: string
  description: string
  time: string
  status?: 'completed' | 'pending' | 'cancelled'
}

export function BusinessDashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    stores: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
    staff: 1
  })
  const [stores, setStores] = useState<Store[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const { user, token } = useAuth()
  const { toast } = useToast()
  const businessProfile = user?.business_profile

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!token) return

    try {
      setLoading(true)

      // Load stores
      const storesData = await shoppingInventoryAPI.getStores(token)
      setStores(storesData)

      // Calculate stats
      let totalProducts = 0
      for (const store of storesData) {
        try {
          const productsResponse = await shoppingInventoryAPI.getProducts(token, store.id)
          totalProducts += productsResponse.products.length
        } catch (error) {
          console.error(`Error loading products for store ${store.id}:`, error)
        }
      }

      setStats(prev => ({
        ...prev,
        stores: storesData.length,
        products: totalProducts
      }))

      // Mock recent activity for now
      setRecentActivity([
        {
          id: '1',
          type: 'order',
          title: 'New order received',
          description: 'Order #1234 from John Doe',
          time: '2 minutes ago',
          status: 'pending'
        },
        {
          id: '2',
          type: 'product',
          title: 'Product added',
          description: 'Coffee Beans added to inventory',
          time: '1 hour ago',
          status: 'completed'
        },
        {
          id: '3',
          type: 'customer',
          title: 'New customer registered',
          description: 'Sarah Wilson joined',
          time: '3 hours ago',
          status: 'completed'
        }
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4" />
      case 'product': return <Package className="w-4 h-4" />
      case 'customer': return <Users className="w-4 h-4" />
      case 'staff': return <Users className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-50'
      case 'product': return 'text-green-600 bg-green-50'
      case 'customer': return 'text-purple-600 bg-purple-50'
      case 'staff': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 flex items-center justify-center py-16">
        <div className="glass-card-enhanced text-center p-8 animate-glass-appear">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Loading Dashboard
          </h3>
          <p className="text-muted-foreground">Preparing your business insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4 min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      {/* Header */}
      <div className="glass-card-enhanced flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 animate-glass-appear">
        <div className="mb-2 sm:mb-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {businessProfile?.business_name || 'Business Owner'}!
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <Button variant="outline" className="glass-button flex items-center gap-1.5 hover:scale-105 transition-transform text-xs h-8 sm:h-9 flex-1 sm:flex-none px-2 sm:px-3">
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">View Reports</span>
            <span className="sm:hidden">Reports</span>
          </Button>
          <Button className="glass-button-primary flex items-center gap-1.5 hover:scale-105 transition-transform text-xs h-8 sm:h-9 flex-1 sm:flex-none px-2 sm:px-3">
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Quick Action</span>
            <span className="sm:hidden">Action</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card-primary relative overflow-hidden animate-glass-appear hover:animate-glass-pulse group cursor-pointer">
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Total Stores</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">{stats.stores}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">+12%</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">this month</span>
                </div>
              </div>
              <div className="glass-icon-button w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 bg-blue-50/50 dark:bg-blue-950/50 rounded-full group-hover:scale-110 transition-transform ml-1.5">
                <StoreIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 opacity-80"></div>
        </div>

        <div className="glass-card-secondary relative overflow-hidden animate-glass-appear hover:animate-glass-pulse group cursor-pointer" style={{ animationDelay: '0.1s' }}>
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Products</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 truncate">{stats.products}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">+5%</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">this week</span>
                </div>
              </div>
              <div className="glass-icon-button w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 bg-green-50/50 dark:bg-green-950/50 rounded-full group-hover:scale-110 transition-transform ml-1.5">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 opacity-80"></div>
        </div>

        <div className="glass-card relative overflow-hidden animate-glass-appear hover:animate-glass-pulse group cursor-pointer" style={{ animationDelay: '0.2s' }}>
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-sm sm:text-lg lg:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">UGX {stats.revenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">+18%</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
                </div>
              </div>
              <div className="glass-icon-button w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 bg-purple-50/50 dark:bg-purple-950/50 rounded-full group-hover:scale-110 transition-transform ml-1.5">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 opacity-80"></div>
        </div>

        <div className="glass-card relative overflow-hidden animate-glass-appear hover:animate-glass-pulse group cursor-pointer" style={{ animationDelay: '0.3s' }}>
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400 truncate">{stats.orders}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600 dark:text-red-400" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">-3%</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">from yesterday</span>
                </div>
              </div>
              <div className="glass-icon-button w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 bg-orange-50/50 dark:bg-orange-950/50 rounded-full group-hover:scale-110 transition-transform ml-1.5">
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 opacity-80"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: '0.4s' }}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Recent Activity
                </h3>
              </div>
              <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
                Latest updates from your business operations
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="glass-card flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:scale-105 transition-all duration-300 cursor-pointer group" style={{ animationDelay: `${0.1 * index}s` }}>
                    <div className={`p-1.5 rounded-full glass-icon-button group-hover:scale-110 transition-transform ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm truncate">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="glass-button w-full mt-2 sm:mt-3 hover:scale-105 transition-transform text-xs sm:text-sm h-8 sm:h-9">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                View All Activity
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {/* Quick Actions */}
          <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: '0.5s' }}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Button variant="outline" className="glass-button w-full justify-start hover:scale-105 transition-transform text-xs sm:text-sm h-7 sm:h-8">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  Add New Product
                </Button>
                <Button variant="outline" className="glass-button w-full justify-start hover:scale-105 transition-transform text-xs sm:text-sm h-7 sm:h-8">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  Add Staff Member
                </Button>
                <Button variant="outline" className="glass-button w-full justify-start hover:scale-105 transition-transform text-xs sm:text-sm h-7 sm:h-8">
                  <StoreIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  Create New Store
                </Button>
                <Button variant="outline" className="glass-button w-full justify-start hover:scale-105 transition-transform text-xs sm:text-sm h-7 sm:h-8">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  View Analytics
                </Button>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="glass-card-secondary animate-glass-appear" style={{ animationDelay: '0.6s' }}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Alerts & Notifications
                </h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="glass-card flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-200/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <AlertCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100 truncate">Low Stock Alert</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">3 products running low</p>
                  </div>
                </div>

                <div className="glass-card flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-green-900 dark:text-green-100 truncate">Monthly Goal</p>
                    <p className="text-xs text-green-700 dark:text-green-300">87% target achieved</p>
                  </div>
                </div>

                <div className="glass-card flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100 truncate">Upcoming Tasks</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">2 staff reviews scheduled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Performance */}
          <div className="glass-card animate-glass-appear" style={{ animationDelay: '0.7s' }}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Business Health
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="glass-card p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">Revenue Growth</span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+18%</span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full w-[75%] shadow-lg shadow-green-500/30"></div>
                  </div>
                </div>

                <div className="glass-card p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">Customer Satisfaction</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full w-[92%] shadow-lg shadow-blue-500/30"></div>
                  </div>
                </div>

                <div className="glass-card p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">Inventory Turnover</span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full w-[85%] shadow-lg shadow-purple-500/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Overview */}
      {stores.length > 0 && (
        <div className="glass-card-enhanced animate-glass-appear" style={{ animationDelay: '0.8s' }}>
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <StoreIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Stores
              </h2>
            </div>
            <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
              Manage and monitor all your store locations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {stores.map((store, index) => (
                <div key={store.id} className="glass-card-primary p-3 sm:p-4 hover:scale-105 transition-all duration-300 cursor-pointer group animate-glass-appear" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm sm:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">{store.name}</h4>
                    <Badge className="glass-button bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-xs px-1.5 py-0.5">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">{store.description}</p>
                  <p className="text-xs text-muted-foreground mb-2 truncate">{store.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">UGX Store</span>
                    <Button variant="ghost" size="sm" className="glass-icon-button group-hover:scale-110 transition-transform h-6 w-6 sm:h-7 sm:w-7 p-0">
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="glass-card-dashed p-3 sm:p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-all duration-300 cursor-pointer group animate-glass-appear min-h-[120px] sm:min-h-[140px]" style={{ animationDelay: `${0.1 * stores.length}s` }}>
                <div className="glass-icon-button p-2 sm:p-3 mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-1 text-xs sm:text-sm">Add New Store</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expand your business</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}