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
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {businessProfile?.business_name || 'Business Owner'}!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Here's what's happening with your business today
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Reports
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Quick Action
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.stores}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">+12%</span>
                                    <span className="text-sm text-muted-foreground">from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-full">
                                <StoreIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Products</p>
                                <p className="text-3xl font-bold text-green-600">{stats.products}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">+5%</span>
                                    <span className="text-sm text-muted-foreground">this week</span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                                <p className="text-3xl font-bold text-purple-600">UGX {stats.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">+18%</span>
                                    <span className="text-sm text-muted-foreground">vs last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.orders}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-600 font-medium">-3%</span>
                                    <span className="text-sm text-muted-foreground">from yesterday</span>
                                </div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-full">
                                <ShoppingBag className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>
                                Latest updates from your business operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm">{activity.title}</h4>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(activity.status)}
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                <Eye className="w-4 h-4 mr-2" />
                                View All Activity
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Product
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="w-4 h-4 mr-2" />
                                    Add Staff Member
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <StoreIcon className="w-4 h-4 mr-2" />
                                    Create New Store
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alerts & Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Alerts & Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-900">Low Stock Alert</p>
                                        <p className="text-xs text-yellow-700">3 products are running low</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Monthly Goal</p>
                                        <p className="text-xs text-green-700">87% of revenue target achieved</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Upcoming Tasks</p>
                                        <p className="text-xs text-blue-700">2 staff reviews scheduled</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Business Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Revenue Growth</span>
                                    <span className="text-sm text-green-600 font-semibold">+18%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full w-[75%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Customer Satisfaction</span>
                                    <span className="text-sm text-blue-600 font-semibold">92%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full w-[92%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Inventory Turnover</span>
                                    <span className="text-sm text-purple-600 font-semibold">85%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full w-[85%]"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Store Overview */}
            {stores.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <StoreIcon className="w-5 h-5" />
                            Your Stores
                        </CardTitle>
                        <CardDescription>
                            Manage and monitor all your store locations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stores.map((store) => (
                                <div key={store.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">{store.name}</h4>
                                        <Badge className="bg-green-100 text-green-700">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{store.description}</p>
                                    <p className="text-xs text-muted-foreground mb-3">{store.address}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">UGX</span>
                                        <Button variant="ghost" size="sm">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer">
                                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                <h4 className="font-semibold text-gray-600">Add New Store</h4>
                                <p className="text-sm text-gray-500">Expand your business</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
