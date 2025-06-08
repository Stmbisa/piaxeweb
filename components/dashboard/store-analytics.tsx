"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    growth: number
    trend: 'up' | 'down'
  }
  orders: {
    total: number
    growth: number
    trend: 'up' | 'down'
  }
  customers: {
    total: number
    growth: number
    trend: 'up' | 'down'
  }
  conversion: {
    rate: number
    growth: number
    trend: 'up' | 'down'
  }
}

const mockAnalytics: AnalyticsData = {
  revenue: {
    total: 2450000,
    growth: 12.5,
    trend: 'up'
  },
  orders: {
    total: 156,
    growth: 8.3,
    trend: 'up'
  },
  customers: {
    total: 89,
    growth: -2.1,
    trend: 'down'
  },
  conversion: {
    rate: 3.2,
    growth: 5.8,
    trend: 'up'
  }
}

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Nakamura', amount: 45000, status: 'completed', time: '2 hours ago' },
  { id: 'ORD-002', customer: 'John Mukasa', amount: 28000, status: 'processing', time: '4 hours ago' },
  { id: 'ORD-003', customer: 'Grace Achieng', amount: 67000, status: 'completed', time: '6 hours ago' },
  { id: 'ORD-004', customer: 'David Ssebunya', amount: 23000, status: 'pending', time: '1 day ago' },
]

const topProducts = [
  { name: 'Ugandan Coffee Beans', sales: 234, revenue: 5850000, growth: 15.2 },
  { name: 'Organic Honey', sales: 189, revenue: 2268000, growth: 8.7 },
  { name: 'Solar Phone Charger', sales: 156, revenue: 11700000, growth: 22.1 },
  { name: 'Handwoven Basket', sales: 89, revenue: 1602000, growth: -3.2 },
]

export function StoreAnalytics() {
  const TrendIcon = ({ trend, growth }: { trend: 'up' | 'down', growth: number }) => {
    if (trend === 'up') {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />
    }
    return <ArrowDownRight className="w-4 h-4 text-red-600" />
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">UGX {mockAnalytics.revenue.total.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={mockAnalytics.revenue.trend} growth={mockAnalytics.revenue.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(mockAnalytics.revenue.growth)}`}>
                    {mockAnalytics.revenue.growth > 0 ? '+' : ''}{mockAnalytics.revenue.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
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
                <p className="text-2xl font-bold">{mockAnalytics.orders.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={mockAnalytics.orders.trend} growth={mockAnalytics.orders.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(mockAnalytics.orders.growth)}`}>
                    {mockAnalytics.orders.growth > 0 ? '+' : ''}{mockAnalytics.orders.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
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
                <p className="text-2xl font-bold">{mockAnalytics.customers.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={mockAnalytics.customers.trend} growth={mockAnalytics.customers.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(mockAnalytics.customers.growth)}`}>
                    {mockAnalytics.customers.growth > 0 ? '+' : ''}{mockAnalytics.customers.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
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
                <p className="text-2xl font-bold">{mockAnalytics.conversion.rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon trend={mockAnalytics.conversion.trend} growth={mockAnalytics.conversion.growth} />
                  <span className={`text-sm font-medium ${getGrowthColor(mockAnalytics.conversion.growth)}`}>
                    {mockAnalytics.conversion.growth > 0 ? '+' : ''}{mockAnalytics.conversion.growth}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
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
