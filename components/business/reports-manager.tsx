"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import {
    Download,
    FileText,
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    Users,
    ShoppingBag,
    Calendar,
    Eye,
    Filter,
    RefreshCw
} from "lucide-react"

interface ReportData {
    salesReport: {
        totalRevenue: number
        totalOrders: number
        averageOrderValue: number
        topSellingProducts: Array<{
            id: string
            name: string
            quantity: number
            revenue: number
        }>
        dailySales: Array<{
            date: string
            revenue: number
            orders: number
        }>
    }
    inventoryReport: {
        totalProducts: number
        lowStockItems: number
        outOfStockItems: number
        inventoryValue: number
        categories: Array<{
            name: string
            productCount: number
            value: number
        }>
    }
    customerReport: {
        totalCustomers: number
        newCustomers: number
        repeatCustomers: number
        topCustomers: Array<{
            name: string
            phone: string
            orderCount: number
            totalSpent: number
        }>
    }

    accountingAudit: {
        currency: string
        orderRevenue: number
        crmIncome: number
        crmExpenses: number
        incomeGap: number
        missingIncomeEntriesCount: number
        unassignedCrmEntries: number
    }
}

const REPORT_TYPES = [
    { id: 'sales', label: 'Sales Report', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'customers', label: 'Customer Report', icon: Users },
    { id: 'accounting_audit', label: 'Accounting Audit', icon: FileText },
    { id: 'comprehensive', label: 'Comprehensive Report', icon: FileText }
]

export function ReportsManager() {
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [stores, setStores] = useState<Store[]>([])
    const [selectedStore, setSelectedStore] = useState<string>('')
    const [selectedReport, setSelectedReport] = useState<string>('comprehensive')
    const [dateRange, setDateRange] = useState<string>('30')
    const [loading, setLoading] = useState(true)

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

            // Load reports for the first store if available
            if (storesData.length > 0) {
                const firstStoreId = storesData[0].id
                setSelectedStore(firstStoreId)
                await generateReports(firstStoreId)
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast({
                title: "Error",
                description: "Failed to load reports data",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const generateReports = async (storeId: string) => {
        if (!token) return

        try {
            setLoading(true)

            const now = new Date()
            const daysAgo = parseInt(dateRange)
            const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

            // Load store reports + products (inventory)
            const [productPerformance, accountingAudit, productsResponse] = await Promise.all([
                shoppingInventoryAPI.getStoreProductPerformanceReport(token, storeId, {
                    start_date: startDate.toISOString(),
                    end_date: now.toISOString(),
                    limit: 50,
                }),
                shoppingInventoryAPI.getStoreAccountingAuditReport(token, storeId, {
                    start_date: startDate.toISOString(),
                    end_date: now.toISOString(),
                    currency: "UGX",
                }),
                shoppingInventoryAPI.getProducts(token, storeId)
            ])

            const products = productsResponse.products

            // Map store product performance report into the existing "salesReport" shape
            const totalRevenue = productPerformance.overall_metrics.total_revenue
            const totalOrders = 0
            const averageOrderValue = 0
            const topSellingProducts = productPerformance.products
                .slice()
                .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
                .slice(0, 5)
                .map(p => ({
                    id: p.product_id,
                    name: p.product_name,
                    quantity: p.units_sold,
                    revenue: p.revenue,
                }))

            const dailySales: Array<{ date: string; revenue: number; orders: number }> = []

            // Generate Inventory Report
            const totalProducts = products.length
            const lowStockItems = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length
            const outOfStockItems = products.filter(p => p.stock_quantity === 0).length
            const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)

            // Category analysis
            const categoryMap = new Map<string, { productCount: number, value: number }>()
            products.forEach(product => {
                const category = product.category || 'Uncategorized'
                const existing = categoryMap.get(category) || { productCount: 0, value: 0 }
                existing.productCount += 1
                existing.value += product.price * product.stock_quantity
                categoryMap.set(category, existing)
            })

            const categories = Array.from(categoryMap.entries())
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.value - a.value)

            // Customer report currently requires an orders/customer source.
            const totalCustomers = 0
            const newCustomers = 0
            const repeatCustomers = 0
            const topCustomers: Array<{ name: string; phone: string; orderCount: number; totalSpent: number }> = []

            setReportData({
                salesReport: {
                    totalRevenue,
                    totalOrders,
                    averageOrderValue,
                    topSellingProducts,
                    dailySales
                },
                inventoryReport: {
                    totalProducts,
                    lowStockItems,
                    outOfStockItems,
                    inventoryValue,
                    categories
                },
                customerReport: {
                    totalCustomers,
                    newCustomers,
                    repeatCustomers,
                    topCustomers
                },
                accountingAudit: {
                    currency: accountingAudit.currency,
                    orderRevenue: accountingAudit.totals.order_revenue,
                    crmIncome: accountingAudit.totals.crm_income,
                    crmExpenses: accountingAudit.totals.crm_expenses,
                    incomeGap: accountingAudit.mismatch.income_gap,
                    missingIncomeEntriesCount: accountingAudit.mismatch.missing_income_entries_count,
                    unassignedCrmEntries: accountingAudit.totals.unassigned_crm_entries,
                },
            })

        } catch (error) {
            console.error('Error generating reports:', error)
            toast({
                title: "Error",
                description: "Failed to generate reports",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStoreChange = async (storeId: string) => {
        setSelectedStore(storeId)
        await generateReports(storeId)
    }

    const handleDateRangeChange = async (range: string) => {
        setDateRange(range)
        if (selectedStore) {
            await generateReports(selectedStore)
        }
    }

    const exportReport = (type: string) => {
        if (!reportData) return

        // Create CSV content based on report type
        let csvContent = ""
        const timestamp = new Date().toISOString().split('T')[0]

        switch (type) {
            case 'sales':
                csvContent = "Sales Report\n"
                csvContent += `Generated on: ${timestamp}\n\n`
                csvContent += `Total Revenue,UGX ${reportData.salesReport.totalRevenue.toLocaleString()}\n`
                csvContent += `Total Orders,${reportData.salesReport.totalOrders}\n`
                csvContent += `Average Order Value,UGX ${reportData.salesReport.averageOrderValue.toLocaleString()}\n\n`
                csvContent += "Top Selling Products\n"
                csvContent += "Product Name,Quantity Sold,Revenue\n"
                reportData.salesReport.topSellingProducts.forEach(product => {
                    csvContent += `${product.name},${product.quantity},UGX ${product.revenue.toLocaleString()}\n`
                })
                break

            case 'inventory':
                csvContent = "Inventory Report\n"
                csvContent += `Generated on: ${timestamp}\n\n`
                csvContent += `Total Products,${reportData.inventoryReport.totalProducts}\n`
                csvContent += `Low Stock Items,${reportData.inventoryReport.lowStockItems}\n`
                csvContent += `Out of Stock Items,${reportData.inventoryReport.outOfStockItems}\n`
                csvContent += `Inventory Value,UGX ${reportData.inventoryReport.inventoryValue.toLocaleString()}\n\n`
                csvContent += "Categories\n"
                csvContent += "Category,Product Count,Value\n"
                reportData.inventoryReport.categories.forEach(category => {
                    csvContent += `${category.name},${category.productCount},UGX ${category.value.toLocaleString()}\n`
                })
                break

            case 'customers':
                csvContent = "Customer Report\n"
                csvContent += `Generated on: ${timestamp}\n\n`
                csvContent += `Total Customers,${reportData.customerReport.totalCustomers}\n`
                csvContent += `New Customers,${reportData.customerReport.newCustomers}\n`
                csvContent += `Repeat Customers,${reportData.customerReport.repeatCustomers}\n\n`
                csvContent += "Top Customers\n"
                csvContent += "Name,Phone,Order Count,Total Spent\n"
                reportData.customerReport.topCustomers.forEach(customer => {
                    csvContent += `${customer.name},${customer.phone},${customer.orderCount},UGX ${customer.totalSpent.toLocaleString()}\n`
                })
                break

            case 'accounting_audit':
                csvContent = "Accounting Audit\n"
                csvContent += `Generated on: ${timestamp}\n\n`
                csvContent += `Currency,${reportData.accountingAudit.currency}\n`
                csvContent += `Order Revenue,${reportData.accountingAudit.orderRevenue}\n`
                csvContent += `CRM Income,${reportData.accountingAudit.crmIncome}\n`
                csvContent += `CRM Expenses,${reportData.accountingAudit.crmExpenses}\n`
                csvContent += `Income Gap (Orders - CRM),${reportData.accountingAudit.incomeGap}\n`
                csvContent += `Missing Income Entries (count),${reportData.accountingAudit.missingIncomeEntriesCount}\n`
                csvContent += `Unassigned CRM Entries (count),${reportData.accountingAudit.unassignedCrmEntries}\n`
                break

            default:
                csvContent = "Comprehensive Business Report\n"
                csvContent += `Generated on: ${timestamp}\n\n`
                csvContent += "SALES SUMMARY\n"
                csvContent += `Total Revenue,UGX ${reportData.salesReport.totalRevenue.toLocaleString()}\n`
                csvContent += `Total Orders,${reportData.salesReport.totalOrders}\n`
                csvContent += `Average Order Value,UGX ${reportData.salesReport.averageOrderValue.toLocaleString()}\n\n`
                csvContent += "INVENTORY SUMMARY\n"
                csvContent += `Total Products,${reportData.inventoryReport.totalProducts}\n`
                csvContent += `Low Stock Items,${reportData.inventoryReport.lowStockItems}\n`
                csvContent += `Out of Stock Items,${reportData.inventoryReport.outOfStockItems}\n`
                csvContent += `Inventory Value,UGX ${reportData.inventoryReport.inventoryValue.toLocaleString()}\n\n`
                csvContent += "CUSTOMER SUMMARY\n"
                csvContent += `Total Customers,${reportData.customerReport.totalCustomers}\n`
                csvContent += `New Customers,${reportData.customerReport.newCustomers}\n`
                csvContent += `Repeat Customers,${reportData.customerReport.repeatCustomers}\n`
                break
        }

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}_report_${timestamp}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
            title: "Success",
            description: "Report exported successfully",
        })
    }

    if (loading && stores.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Business Reports</h1>
                    <p className="text-muted-foreground">Generate and analyze business performance reports</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportReport(selectedReport)}
                        disabled={!reportData}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                    <Button
                        onClick={() => selectedStore && generateReports(selectedStore)}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Store Selection */}
                {stores.length > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <label className="text-sm font-medium mb-2 block">Select Store</label>
                            <Select value={selectedStore} onValueChange={handleStoreChange}>
                                <SelectTrigger>
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
                        </CardContent>
                    </Card>
                )}

                {/* Report Type */}
                <Card>
                    <CardContent className="p-4">
                        <label className="text-sm font-medium mb-2 block">Report Type</label>
                        <Select value={selectedReport} onValueChange={setSelectedReport}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose report type" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_TYPES.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Date Range */}
                <Card>
                    <CardContent className="p-4">
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <Select value={dateRange} onValueChange={handleDateRangeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            {/* Report Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-muted-foreground">Generating reports...</p>
                    </div>
                </div>
            ) : !reportData ? (
                <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No data available</h3>
                    <p className="text-muted-foreground">Select a store to generate reports</p>
                </div>
            ) : (
                <>
                    {/* Sales Report */}
                    {(selectedReport === 'sales' || selectedReport === 'comprehensive') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Sales Report
                                </CardTitle>
                                <CardDescription>
                                    Revenue and sales performance for the last {dateRange} days
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-800">Total Revenue</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            UGX {reportData.salesReport.totalRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">Total Orders</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {reportData.salesReport.totalOrders}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-medium text-purple-800">Avg Order Value</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            UGX {Math.round(reportData.salesReport.averageOrderValue).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Top Selling Products</h4>
                                    <div className="space-y-2">
                                        {reportData.salesReport.topSellingProducts.map((product, index) => (
                                            <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">#{index + 1}</Badge>
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {product.quantity} units sold
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">
                                                    UGX {product.revenue.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Inventory Report */}
                    {(selectedReport === 'inventory' || selectedReport === 'comprehensive') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Inventory Report
                                </CardTitle>
                                <CardDescription>
                                    Stock levels and inventory analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">Total Products</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {reportData.inventoryReport.totalProducts}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-sm font-medium text-yellow-800">Low Stock</p>
                                        <p className="text-2xl font-bold text-yellow-900">
                                            {reportData.inventoryReport.lowStockItems}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-sm font-medium text-red-800">Out of Stock</p>
                                        <p className="text-2xl font-bold text-red-900">
                                            {reportData.inventoryReport.outOfStockItems}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <p className="text-sm font-medium text-emerald-800">Inventory Value</p>
                                        <p className="text-2xl font-bold text-emerald-900">
                                            UGX {reportData.inventoryReport.inventoryValue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Categories</h4>
                                    <div className="space-y-2">
                                        {reportData.inventoryReport.categories.map((category, index) => (
                                            <div key={category.name} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                <div>
                                                    <p className="font-medium">{category.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {category.productCount} products
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    UGX {category.value.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Customer Report */}
                    {(selectedReport === 'customers' || selectedReport === 'comprehensive') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Customer Report
                                </CardTitle>
                                <CardDescription>
                                    Customer behavior and analytics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">Total Customers</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {reportData.customerReport.totalCustomers}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-800">New Customers</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {reportData.customerReport.newCustomers}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-medium text-purple-800">Repeat Customers</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {reportData.customerReport.repeatCustomers}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Top Customers</h4>
                                    <div className="space-y-2">
                                        {reportData.customerReport.topCustomers.map((customer, index) => (
                                            <div key={`${customer.name}_${customer.phone}`} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">#{index + 1}</Badge>
                                                    <div>
                                                        <p className="font-medium">{customer.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {customer.phone} • {customer.orderCount} orders
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">
                                                    UGX {customer.totalSpent.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Accounting Audit */}
                    {(selectedReport === 'accounting_audit' || selectedReport === 'comprehensive') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Accounting Audit
                                </CardTitle>
                                <CardDescription>
                                    Compare store order revenue vs CRM bookkeeping entries
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-800">Order Revenue</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {reportData.accountingAudit.currency} {Math.round(reportData.accountingAudit.orderRevenue).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">CRM Income</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {reportData.accountingAudit.currency} {Math.round(reportData.accountingAudit.crmIncome).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-medium text-purple-800">CRM Expenses</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {reportData.accountingAudit.currency} {Math.round(reportData.accountingAudit.crmExpenses).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <p className="text-sm font-medium text-amber-800">Income Gap</p>
                                        <p className="text-2xl font-bold text-amber-900">
                                            {reportData.accountingAudit.currency} {Math.round(reportData.accountingAudit.incomeGap).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/50 rounded border">
                                        <p className="text-sm font-medium">Missing income postings</p>
                                        <p className="text-lg font-semibold">
                                            {reportData.accountingAudit.missingIncomeEntriesCount}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Paid orders for this store without a matching CRM income entry
                                        </p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded border">
                                        <p className="text-sm font-medium">Unassigned CRM entries</p>
                                        <p className="text-lg font-semibold">
                                            {reportData.accountingAudit.unassignedCrmEntries}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Entries created in the period that are missing a store tag
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    )
}
