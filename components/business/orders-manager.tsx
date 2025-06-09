"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Order, type Store } from "@/lib/api/shopping-inventory"
import {
    Search,
    Filter,
    Eye,
    Edit,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    DollarSign,
    Calendar,
    User,
    Phone,
    MapPin,
    RefreshCw
} from "lucide-react"

const ORDER_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    preparing: 'bg-purple-100 text-purple-700 border-purple-200',
    ready: 'bg-green-100 text-green-700 border-green-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
}

const PAYMENT_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-gray-100 text-gray-700 border-gray-200'
}

export function OrdersManager() {
    const [orders, setOrders] = useState<Order[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [selectedStore, setSelectedStore] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [paymentFilter, setPaymentFilter] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)

    const { token } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        if (!token) return

        try {
            setLoading(true)

            // Load stores first
            const storesData = await shoppingInventoryAPI.getStores(token)
            setStores(storesData)

            // Load orders for the first store if available
            if (storesData.length > 0) {
                const firstStoreId = storesData[0].id
                setSelectedStore(firstStoreId)
                await loadOrders(firstStoreId)
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast({
                title: "Error",
                description: "Failed to load orders data",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadOrders = async (storeId: string) => {
        if (!token) return

        try {
            setLoading(true)
            const params: any = {}
            if (statusFilter) params.status = statusFilter
            if (paymentFilter) params.payment_status = paymentFilter

            const ordersResponse = await shoppingInventoryAPI.getOrders(token, storeId, params)
            setOrders(ordersResponse.orders)
        } catch (error) {
            console.error('Error loading orders:', error)
            toast({
                title: "Error",
                description: "Failed to load orders",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStoreChange = async (storeId: string) => {
        setSelectedStore(storeId)
        await loadOrders(storeId)
    }

    const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
        if (!token || !selectedStore) return

        try {
            await shoppingInventoryAPI.updateOrderStatus(token, selectedStore, orderId, status)
            await loadOrders(selectedStore)
            toast({
                title: "Success",
                description: "Order status updated successfully",
            })
        } catch (error) {
            console.error('Error updating order status:', error)
            toast({
                title: "Error",
                description: "Failed to update order status",
                variant: "destructive",
            })
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer_phone.includes(searchTerm) ||
                            order.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || order.status === statusFilter
        const matchesPayment = !paymentFilter || order.payment_status === paymentFilter

        return matchesSearch && matchesStatus && matchesPayment
    })

    const getOrderStats = () => {
        const total = orders.length
        const pending = orders.filter(o => o.status === 'pending').length
        const confirmed = orders.filter(o => o.status === 'confirmed').length
        const delivered = orders.filter(o => o.status === 'delivered').length
        const totalRevenue = orders
            .filter(o => o.payment_status === 'paid')
            .reduce((sum, o) => sum + o.total_amount, 0)

        return { total, pending, confirmed, delivered, totalRevenue }
    }

    const stats = getOrderStats()

    if (loading && stores.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <p className="text-muted-foreground">Track and manage your orders</p>
                </div>
                <Button
                    onClick={() => loadOrders(selectedStore)}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Store Selection */}
            {stores.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <label htmlFor="store-select" className="font-medium">Select Store:</label>
                            <Select value={selectedStore} onValueChange={handleStoreChange}>
                                <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Choose a store" />
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
                    </CardContent>
                </Card>
            )}

            {/* Order Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                            </div>
                            <Truck className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    UGX {stats.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search orders by customer name, phone, or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Payments</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                        {filteredOrders.length} orders found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter || paymentFilter
                                    ? "Try adjusting your search criteria"
                                    : "Orders will appear here once customers start placing them"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <Package className="w-6 h-6 text-primary" />
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                                                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                    <Badge className={PAYMENT_STATUS_COLORS[order.payment_status]}>
                                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {order.customer_name}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {order.customer_phone}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>{order.items.length} items</span>
                                                    {order.delivery_address && (
                                                        <>
                                                            <span>•</span>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                <span className="truncate max-w-32">
                                                                    {order.delivery_address}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-lg">
                                                    UGX {order.total_amount.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.currency}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setShowOrderDetails(true)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>

                                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(status) => handleStatusUpdate(order.id, status as Order['status'])}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                                            <SelectItem value="preparing">Preparing</SelectItem>
                                                            <SelectItem value="ready">Ready</SelectItem>
                                                            <SelectItem value="delivered">Delivered</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowOrderDetails(false)}
                            >
                                <XCircle className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                                    <p className="font-mono">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                                    <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <Badge className={ORDER_STATUS_COLORS[selectedOrder.status]}>
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Payment</label>
                                    <Badge className={PAYMENT_STATUS_COLORS[selectedOrder.payment_status]}>
                                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold mb-3">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <p>{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p>{selectedOrder.customer_phone}</p>
                                    </div>
                                    {selectedOrder.customer_email && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                                            <p>{selectedOrder.customer_email}</p>
                                        </div>
                                    )}
                                    {selectedOrder.delivery_address && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                                            <p>{selectedOrder.delivery_address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                                            <div>
                                                <p className="font-medium">{item.product_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} × UGX {item.unit_price.toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                UGX {item.total_price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>UGX {selectedOrder.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>UGX {selectedOrder.tax_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>UGX {selectedOrder.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <h3 className="font-semibold mb-2">Notes</h3>
                                    <p className="text-muted-foreground">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
