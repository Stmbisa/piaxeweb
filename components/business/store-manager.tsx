"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import {
    Store as StoreIcon,
    Plus,
    Search,
    Edit2,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Settings,
    TrendingUp,
    Package,
    ShoppingBag,
    DollarSign,
    Eye,
    MoreVertical
} from "lucide-react"

interface StoreFormData {
    name: string
    description: string
    address: string
    phone: string
    email: string
    settings: {
        currency: string
        tax_rate: number
        accepts_online_orders: boolean
        delivery_available: boolean
    }
}

export function StoreManager() {
    const [stores, setStores] = useState<Store[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingStore, setEditingStore] = useState<Store | null>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState<StoreFormData>({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        settings: {
            currency: 'UGX',
            tax_rate: 18,
            accepts_online_orders: true,
            delivery_available: false
        }
    })

    const { user, token } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        loadStores()
    }, [])

    const loadStores = async () => {
        if (!token) return

        try {
            setLoading(true)
            const storesData = await shoppingInventoryAPI.getStores(token)
            setStores(storesData)
        } catch (error) {
            console.error('Error loading stores:', error)
            toast({
                title: "Error",
                description: "Failed to load stores",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAddStore = async () => {
        if (!token) return

        if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim() || !formData.email.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        try {
            const newStore = await shoppingInventoryAPI.createStore(token, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                address: formData.address.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                settings: formData.settings
            })

            setStores(prev => [...prev, newStore])
            resetForm()
            setShowAddForm(false)

            toast({
                title: "Success",
                description: "Store created successfully",
            })
        } catch (error) {
            console.error('Error creating store:', error)
            toast({
                title: "Error",
                description: "Failed to create store",
                variant: "destructive",
            })
        }
    }

    const handleEditStore = (store: Store) => {
        setEditingStore(store)
        setFormData({
            name: store.name,
            description: store.description,
            address: store.address,
            phone: store.phone,
            email: store.email,
            settings: store.settings
        })
    }

    const handleUpdateStore = async () => {
        if (!token || !editingStore) return

        try {
            const updatedStore = await shoppingInventoryAPI.updateStore(token, editingStore.id, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                address: formData.address.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                settings: formData.settings
            })

            setStores(prev => prev.map(store =>
                store.id === editingStore.id ? updatedStore : store
            ))
            resetForm()
            setEditingStore(null)

            toast({
                title: "Success",
                description: "Store updated successfully",
            })
        } catch (error) {
            console.error('Error updating store:', error)
            toast({
                title: "Error",
                description: "Failed to update store",
                variant: "destructive",
            })
        }
    }

    const handleDeleteStore = async (storeId: string) => {
        if (!token) return

        try {
            await shoppingInventoryAPI.deleteStore(token, storeId)
            setStores(prev => prev.filter(store => store.id !== storeId))
            toast({
                title: "Success",
                description: "Store deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting store:', error)
            toast({
                title: "Error",
                description: "Failed to delete store",
                variant: "destructive",
            })
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            address: '',
            phone: '',
            email: '',
            settings: {
                currency: 'UGX',
                tax_rate: 18,
                accepts_online_orders: true,
                delivery_available: false
            }
        })
    }

    const handleFormDataChange = (field: string, value: any) => {
        if (field.startsWith('settings.')) {
            const settingField = field.replace('settings.', '')
            setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, [settingField]: value }
            }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStoreStats = async (storeId: string) => {
        if (!token) return { products: 0, orders: 0, revenue: 0 }

        try {
            const productsResponse = await shoppingInventoryAPI.getProducts(token, storeId)
            return {
                products: productsResponse.products.length,
                orders: 0, // Mock data
                revenue: 0 // Mock data
            }
        } catch (error) {
            return { products: 0, orders: 0, revenue: 0 }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading stores...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Store Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                                <p className="text-2xl font-bold">{stores.length}</p>
                            </div>
                            <StoreIcon className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stores.filter(store => store.status === 'active').length}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Online Orders</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {stores.filter(store => store.settings.accepts_online_orders).length}
                                </p>
                            </div>
                            <ShoppingBag className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Delivery Available</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {stores.filter(store => store.settings.delivery_available).length}
                                </p>
                            </div>
                            <Globe className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Store Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search stores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                </div>
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Store
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Store</DialogTitle>
                            <DialogDescription>
                                Create a new store location for your business
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="store-name">Store Name *</Label>
                                <Input
                                    id="store-name"
                                    placeholder="Main Store"
                                    value={formData.name}
                                    onChange={(e) => handleFormDataChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-description">Description</Label>
                                <Textarea
                                    id="store-description"
                                    placeholder="Describe your store location..."
                                    value={formData.description}
                                    onChange={(e) => handleFormDataChange('description', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-address">Address *</Label>
                                <Textarea
                                    id="store-address"
                                    placeholder="Enter complete store address"
                                    value={formData.address}
                                    onChange={(e) => handleFormDataChange('address', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="store-phone">Phone Number *</Label>
                                    <Input
                                        id="store-phone"
                                        placeholder="+256701234567"
                                        value={formData.phone}
                                        onChange={(e) => handleFormDataChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store-email">Email Address *</Label>
                                    <Input
                                        id="store-email"
                                        type="email"
                                        placeholder="store@business.com"
                                        value={formData.email}
                                        onChange={(e) => handleFormDataChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="font-semibold">Store Settings</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.settings.currency} onValueChange={(value) => handleFormDataChange('settings.currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                                        <Input
                                            id="tax-rate"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.settings.tax_rate}
                                            onChange={(e) => handleFormDataChange('settings.tax_rate', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="online-orders"
                                            checked={formData.settings.accepts_online_orders}
                                            onChange={(e) => handleFormDataChange('settings.accepts_online_orders', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="online-orders">Accept online orders</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="delivery-service"
                                            checked={formData.settings.delivery_available}
                                            onChange={(e) => handleFormDataChange('settings.delivery_available', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="delivery-service">Offer delivery services</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => {
                                setShowAddForm(false)
                                resetForm()
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddStore}>
                                Create Store
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                    <Card key={store.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{store.name}</CardTitle>
                                <Badge className={store.status === 'active'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                }>
                                    {store.status}
                                </Badge>
                            </div>
                            {store.description && (
                                <CardDescription>{store.description}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{store.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span>{store.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{store.email}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">0</p>
                                        <p className="text-xs text-muted-foreground">Products</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">0</p>
                                        <p className="text-xs text-muted-foreground">Orders</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{store.settings.currency} 0</p>
                                        <p className="text-xs text-muted-foreground">Revenue</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                {store.settings.accepts_online_orders && (
                                    <Badge variant="outline" className="text-xs">
                                        Online Orders
                                    </Badge>
                                )}
                                {store.settings.delivery_available && (
                                    <Badge variant="outline" className="text-xs">
                                        Delivery
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">
                                    Tax: {store.settings.tax_rate}%
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditStore(store)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDeleteStore(store.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add Store Card */}
                <Card
                    className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                    onClick={() => setShowAddForm(true)}
                >
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <Plus className="w-12 h-12 text-gray-400 mb-4" />
                        <h4 className="font-semibold text-gray-600 mb-2">Add New Store</h4>
                        <p className="text-sm text-gray-500">
                            Expand your business with additional locations
                        </p>
                    </CardContent>
                </Card>
            </div>

            {filteredStores.length === 0 && searchTerm && (
                <div className="text-center py-8">
                    <StoreIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No stores found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search terms or add a new store
                    </p>
                </div>
            )}

            {/* Edit Store Dialog */}
            <Dialog open={!!editingStore} onOpenChange={(open) => !open && setEditingStore(null)}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Store</DialogTitle>
                        <DialogDescription>
                            Update store information and settings
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-store-name">Store Name *</Label>
                            <Input
                                id="edit-store-name"
                                placeholder="Main Store"
                                value={formData.name}
                                onChange={(e) => handleFormDataChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-store-description">Description</Label>
                            <Textarea
                                id="edit-store-description"
                                placeholder="Describe your store location..."
                                value={formData.description}
                                onChange={(e) => handleFormDataChange('description', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-store-address">Address *</Label>
                            <Textarea
                                id="edit-store-address"
                                placeholder="Enter complete store address"
                                value={formData.address}
                                onChange={(e) => handleFormDataChange('address', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-store-phone">Phone Number *</Label>
                                <Input
                                    id="edit-store-phone"
                                    placeholder="+256701234567"
                                    value={formData.phone}
                                    onChange={(e) => handleFormDataChange('phone', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-store-email">Email Address *</Label>
                                <Input
                                    id="edit-store-email"
                                    type="email"
                                    placeholder="store@business.com"
                                    value={formData.email}
                                    onChange={(e) => handleFormDataChange('email', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">Store Settings</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-currency">Currency</Label>
                                    <Select value={formData.settings.currency} onValueChange={(value) => handleFormDataChange('settings.currency', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                            <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                            <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-tax-rate">Tax Rate (%)</Label>
                                    <Input
                                        id="edit-tax-rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.settings.tax_rate}
                                        onChange={(e) => handleFormDataChange('settings.tax_rate', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-online-orders"
                                        checked={formData.settings.accepts_online_orders}
                                        onChange={(e) => handleFormDataChange('settings.accepts_online_orders', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="edit-online-orders">Accept online orders</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-delivery-service"
                                        checked={formData.settings.delivery_available}
                                        onChange={(e) => handleFormDataChange('settings.delivery_available', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="edit-delivery-service">Offer delivery services</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setEditingStore(null)
                            resetForm()
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStore}>
                            Update Store
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
