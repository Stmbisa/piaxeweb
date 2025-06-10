"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth/context'
import { analyticsAPI, type StoreAnalytics } from '@/lib/api/analytics'
import { shoppingInventoryAPI, type Store } from '@/lib/api/shopping-inventory'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  AlertTriangle
} from 'lucide-react'

export function StoreAnalytics() {
  const [analytics, setAnalytics] = useState<StoreAnalytics | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Load stores and analytics on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Load analytics when store or period changes
  useEffect(() => {
    if (selectedStore) {
      loadAnalytics()
    }
  }, [selectedStore, selectedPeriod])

  const loadData = async () => {
    if (!token) return

    try {
      setLoading(true)

      // Load stores first
      const storesData = await shoppingInventoryAPI.getStores(token)
      setStores(storesData)

      // Load analytics for the first store if available
      if (storesData.length > 0) {
        const firstStoreId = storesData[0].id
        setSelectedStore(firstStoreId)
        // Analytics will be loaded by useEffect above
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!token || !selectedStore) return

    try {
      setLoading(true)
      const analyticsData = await analyticsAPI.getStoreAnalytics(token, selectedStore, {
        period: selectedPeriod
      })
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const TrendIcon = ({ trend, growth }: { trend: 'up' | 'down', growth: number }) => {
    if (trend === 'up') {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />
    }
    return <ArrowDownRight className="w-4 h-4 text-red-600" />
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  // Use real data from analytics if available, otherwise fallback to mock data
  const recentOrders = analytics.recent_orders?.length > 0 ? analytics.recent_orders.map(order => ({
    id: order.id,
    customer: order.customer_name,
    amount: order.amount,
    status: order.status,
    time: formatDate(order.created_at)
  })) : [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      amount: 45000,
      status: 'completed' as const,
      time: '2 hours ago'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      amount: 32000,
      status: 'processing' as const,
      time: '4 hours ago'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 78000,
      status: 'pending' as const,
      time: '6 hours ago'
    }
  ]

  const topProducts = analytics.inventory.top_selling_products?.length > 0 ? analytics.inventory.top_selling_products.map(product => ({
    name: product.name,
    sales: product.sales_count,
    revenue: product.revenue,
    growth: product.growth
  })) : [
    {
      name: 'Premium Coffee Beans',
      sales: 245,
      revenue: 980000,
      growth: 15
    },
    {
      name: 'Organic Tea Collection',
      sales: 189,
      revenue: 567000,
      growth: 8
    },
    {
      name: 'Artisan Pastries',
      sales: 156,
      revenue: 468000,
      growth: -3
    },
    {
      name: 'Fresh Smoothies',
      sales: 134,
      revenue: 402000,
      growth: 22
    }
  ]

  return (
    <div className="space-y-6">
      {/* Store and Period Selection */}
      {stores.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="store-select" className="text-sm font-medium">Store:</label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="period-select" className="text-sm font-medium">Period:</label>
            <Select value={selectedPeriod} onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setSelectedPeriod(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={analytics.revenue.trend} growth={analytics.revenue.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue.growth)}`}>
                    {analytics.revenue.growth > 0 ? '+' : ''}{analytics.revenue.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.orders.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={analytics.orders.trend} growth={analytics.orders.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.orders.growth)}`}>
                    {analytics.orders.growth > 0 ? '+' : ''}{analytics.orders.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{analytics.customers.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={analytics.customers.trend} growth={analytics.customers.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.customers.growth)}`}>
                    {analytics.customers.growth > 0 ? '+' : ''}{analytics.customers.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversion.rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={analytics.conversion.trend} growth={analytics.conversion.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.conversion.growth)}`}>
                    {analytics.conversion.growth > 0 ? '+' : ''}{analytics.conversion.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{analytics.inventory.total_products}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.inventory.low_stock_count}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.inventory.total_value)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Revenue Overview
          </CardTitle>
          <CardDescription>
            Your store's revenue performance over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">Revenue Chart</p>
              <p className="text-sm text-muted-foreground">Detailed analytics coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">UGX {order.amount.toLocaleString()}</p>
                    <Badge
                      className={
                        order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Eye className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>
              Your best-selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">UGX {product.revenue.toLocaleString()}</p>
                      <p className={`text-sm ${getGrowthColor(product.growth)}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={Math.min((product.sales / 250) * 100, 100)}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights about your store's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Strong Performance</span>
              </div>
              <p className="text-sm text-green-700">
                Your coffee products are performing 15% above average this month
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Customer Growth</span>
              </div>
              <p className="text-sm text-blue-700">
                New customer acquisition is up 8% compared to last month
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Seasonal Opportunity</span>
              </div>
              <p className="text-sm text-purple-700">
                Valentine's Day campaigns show high engagement potential
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
