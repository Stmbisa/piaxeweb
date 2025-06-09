"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Product, type Store, type Category } from "@/lib/api/shopping-inventory"
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Package,
    Camera,
    Upload,
    Download,
    Filter,
    ScanLine,
    RefreshCw,
    MoreHorizontal,
    Star,
    Eye,
    Copy,
    X
} from "lucide-react"

const PRODUCT_STATUS_COLORS = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    out_of_stock: 'bg-red-100 text-red-700 border-red-200'
}

interface ProductFormData {
    name: string
    description: string
    price: number
    stock_quantity: number
    category: string
    sku?: string
    barcode?: string
    images: string[]
}

export function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedStore, setSelectedStore] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category: '',
        sku: '',
        barcode: '',
        images: []
    })

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

            // Load products and categories for the first store if available
            if (storesData.length > 0) {
                const firstStoreId = storesData[0].id
                setSelectedStore(firstStoreId)
                await loadProducts(firstStoreId)
                await loadCategories(firstStoreId)
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast({
                title: "Error",
                description: "Failed to load products data",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadProducts = async (storeId: string) => {
        if (!token) return

        try {
            setLoading(true)
            const params: any = {}
            if (categoryFilter) params.category = categoryFilter
            if (statusFilter) params.status = statusFilter
            if (searchTerm) params.search = searchTerm

            const productsResponse = await shoppingInventoryAPI.getProducts(token, storeId, params)
            setProducts(productsResponse.products)
        } catch (error) {
            console.error('Error loading products:', error)
            toast({
                title: "Error",
                description: "Failed to load products",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async (storeId: string) => {
        if (!token) return

        try {
            const categoriesData = await shoppingInventoryAPI.getCategories(token, storeId)
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error loading categories:', error)
        }
    }

    const handleStoreChange = async (storeId: string) => {
        setSelectedStore(storeId)
        await loadProducts(storeId)
        await loadCategories(storeId)
    }

    const handleAddProduct = async () => {
        if (!token || !selectedStore) return

        try {
            const productData = {
                ...formData,
                currency: 'UGX'
            }

            await shoppingInventoryAPI.createProduct(token, selectedStore, productData)
            await loadProducts(selectedStore)

            setShowAddForm(false)
            resetForm()

            toast({
                title: "Success",
                description: "Product added successfully",
            })
        } catch (error) {
            console.error('Error adding product:', error)
            toast({
                title: "Error",
                description: "Failed to add product",
                variant: "destructive",
            })
        }
    }

    const handleEditProduct = async () => {
        if (!token || !selectedStore || !editingProduct) return

        try {
            await shoppingInventoryAPI.updateProduct(token, selectedStore, editingProduct.id, formData)
            await loadProducts(selectedStore)

            setEditingProduct(null)
            resetForm()

            toast({
                title: "Success",
                description: "Product updated successfully",
            })
        } catch (error) {
            console.error('Error updating product:', error)
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            })
        }
    }

    const handleDeleteProduct = async (productId: string) => {
        if (!token || !selectedStore) return

        try {
            await shoppingInventoryAPI.deleteProduct(token, selectedStore, productId)
            await loadProducts(selectedStore)

            toast({
                title: "Success",
                description: "Product deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting product:', error)
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            })
        }
    }

    const handleStockUpdate = async (productId: string, newQuantity: number) => {
        if (!token || !selectedStore) return

        try {
            await shoppingInventoryAPI.updateStock(token, selectedStore, productId, newQuantity, 'set')
            await loadProducts(selectedStore)

            toast({
                title: "Success",
                description: "Stock updated successfully",
            })
        } catch (error) {
            console.error('Error updating stock:', error)
            toast({
                title: "Error",
                description: "Failed to update stock",
                variant: "destructive",
            })
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock_quantity: 0,
            category: '',
            sku: '',
            barcode: '',
            images: []
        })
    }

    const openEditForm = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            category: product.category,
            sku: product.sku || '',
            barcode: product.barcode || '',
            images: product.images
        })
        setShowAddForm(true)
    }

    const generateSKU = () => {
        const sku = 'SKU' + Math.random().toString(36).substr(2, 9).toUpperCase()
        setFormData(prev => ({ ...prev, sku }))
    }

    const simulateBarcodeScanning = () => {
        // Simulate barcode scanning - in real app, this would use camera
        const mockBarcode = Math.floor(Math.random() * 1000000000000).toString()
        setFormData(prev => ({ ...prev, barcode: mockBarcode }))
        setShowBarcodeScanner(false)
        toast({
            title: "Barcode Scanned",
            description: `Barcode ${mockBarcode} has been added to the product`,
        })
    }

    const exportProducts = () => {
        const csvContent = "Product Name,Description,Price,Stock,Category,SKU,Status\n" +
            products.map(p =>
                `"${p.name}","${p.description}",${p.price},${p.stock_quantity},"${p.category}","${p.sku || ''}","${p.status}"`
            ).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `products_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
            title: "Success",
            description: "Products exported successfully",
        })
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesCategory = !categoryFilter || product.category === categoryFilter
        const matchesStatus = !statusFilter || product.status === statusFilter

        return matchesSearch && matchesCategory && matchesStatus
    })

    const getStockStatusColor = (quantity: number) => {
        if (quantity === 0) return 'text-red-600'
        if (quantity <= 5) return 'text-yellow-600'
        return 'text-green-600'
    }

    if (loading && stores.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading products...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products Management</h1>
                    <p className="text-muted-foreground">Manage your product catalog and inventory</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={exportProducts}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button
                        onClick={() => {
                            resetForm()
                            setEditingProduct(null)
                            setShowAddForm(true)
                        }}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>
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

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                                <p className="text-2xl font-bold">{filteredProducts.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {filteredProducts.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {filteredProducts.filter(p => p.stock_quantity === 0).length}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                                <p className="text-2xl font-bold text-green-600">
                                    UGX {filteredProducts.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toLocaleString()}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search products by name, description, or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => loadProducts(selectedStore)}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        {filteredProducts.length} products found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || categoryFilter || statusFilter
                                    ? "Try adjusting your search criteria"
                                    : "Get started by adding your first product"}
                            </p>
                            <Button
                                onClick={() => {
                                    resetForm()
                                    setEditingProduct(null)
                                    setShowAddForm(true)
                                }}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                            {product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                                            {product.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="font-semibold truncate">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-lg">UGX {product.price.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${getStockStatusColor(product.stock_quantity)}`}>
                                                    {product.stock_quantity} units
                                                </p>
                                                {product.sku && (
                                                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditForm(product)}
                                                className="flex items-center gap-1"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Product Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingProduct(null)
                                    resetForm()
                                }}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product_name">Product Name *</Label>
                                    <Input
                                        id="product_name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="General">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter product description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (UGX) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="sku"
                                            value={formData.sku}
                                            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                            placeholder="Enter SKU"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generateSKU}
                                            className="flex items-center gap-1"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Generate
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="barcode">Barcode</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="barcode"
                                            value={formData.barcode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                                            placeholder="Enter barcode"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowBarcodeScanner(true)}
                                            className="flex items-center gap-1"
                                        >
                                            <ScanLine className="w-3 h-3" />
                                            Scan
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Images</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                        {formData.images.length > 0 ? (
                                            <img
                                                src={formData.images[0]}
                                                alt="Product"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <Camera className="w-6 h-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Images
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false)
                                        setEditingProduct(null)
                                        resetForm()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={editingProduct ? handleEditProduct : handleAddProduct}
                                    disabled={!formData.name || !formData.category || formData.price <= 0}
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barcode Scanner Modal */}
            {showBarcodeScanner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="text-center space-y-4">
                            <ScanLine className="w-16 h-16 mx-auto text-primary" />
                            <h3 className="text-lg font-semibold">Barcode Scanner</h3>
                            <p className="text-muted-foreground">
                                Position the barcode within the camera view to scan
                            </p>
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">Camera view would appear here</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowBarcodeScanner(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={simulateBarcodeScanning}
                                    className="flex-1"
                                >
                                    Simulate Scan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
