"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    TrendingUp,
    ShoppingBag,
    Eye,
} from "lucide-react"

interface StoreFormData {
    name: string
    description: string
    address: string
    contact_phone: string
    contact_email: string
    business_hours?: {
        [key: string]: {
            [key: string]: string
        }
    }
    notification_preferences?: {
        [key: string]: boolean
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
        contact_phone: '',
        contact_email: '',
        business_hours: {},
        notification_preferences: {}
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

        if (!formData.name.trim() || !formData.address.trim() || !formData.contact_phone.trim() || !formData.contact_email.trim()) {
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
                contact_phone: formData.contact_phone.trim(),
                contact_email: formData.contact_email.trim(),
                business_hours: formData.business_hours || {},
                notification_preferences: formData.notification_preferences || {}
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
            contact_phone: store.contact_phone,
            contact_email: store.contact_email,
            business_hours: store.business_hours || {},
            notification_preferences: store.notification_preferences || {}
        })
    }

    const handleUpdateStore = async () => {
        if (!token || !editingStore) return

        try {
            const updatedStore = await shoppingInventoryAPI.updateStore(token, editingStore.id, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                address: formData.address.trim(),
                contact_phone: formData.contact_phone.trim(),
                contact_email: formData.contact_email.trim(),
                business_hours: formData.business_hours,
                notification_preferences: formData.notification_preferences
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
            contact_phone: '',
            contact_email: '',
            business_hours: {},
            notification_preferences: {}
        })
    }

    const handleFormDataChange = (field: string, value: any) => {
        if (field.startsWith('business_hours.')) {
            const hourField = field.replace('business_hours.', '')
            setFormData(prev => ({
                ...prev,
                business_hours: { ...prev.business_hours, [hourField]: value }
            }))
        } else if (field.startsWith('notification_preferences.')) {
            const prefField = field.replace('notification_preferences.', '')
            setFormData(prev => ({
                ...prev,
                notification_preferences: { ...prev.notification_preferences, [prefField]: value }
            }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                <div
                    className="glass-card-enhanced animate-glass-appear"
                    style={{
                        animationDelay: "0.1s",
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        padding: '24px'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                            <p className="text-2xl font-bold text-foreground">{stores.length}</p>
                        </div>
                        <StoreIcon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div
                    className="glass-card-enhanced animate-glass-appear"
                    style={{
                        animationDelay: "0.2s",
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        padding: '24px'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stores.length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div
                    className="glass-card-enhanced animate-glass-appear"
                    style={{
                        animationDelay: "0.3s",
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        padding: '24px'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Online Orders</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {stores.filter(store => store.notification_preferences?.online_orders !== false).length}
                            </p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                <div
                    className="glass-card-enhanced animate-glass-appear"
                    style={{
                        animationDelay: "0.4s",
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        padding: '24px'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Delivery Available</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {stores.filter(store => store.notification_preferences?.delivery_updates !== false).length}
                            </p>
                        </div>
                        <Globe className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Store Actions */}
            <div
                className="glass-card-enhanced animate-glass-appear"
                style={{
                    animationDelay: "0.5s",
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    padding: '24px'
                }}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search stores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64 glass-input"
                            />
                        </div>
                    </div>
                    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                        <DialogTrigger asChild>
                            <button className="glass-button-primary flex items-center gap-2 px-4 py-2">
                                <Plus className="w-4 h-4" />
                                Add New Store
                            </button>
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
                                            value={formData.contact_phone}
                                            onChange={(e) => handleFormDataChange('contact_phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="store-email">Email Address *</Label>
                                        <Input
                                            id="store-email"
                                            type="email"
                                            placeholder="store@business.com"
                                            value={formData.contact_email}
                                            onChange={(e) => handleFormDataChange('contact_email', e.target.value)}
                                        />
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
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store, index) => (
                    <div
                        key={store.id}
                        className="glass-card-enhanced animate-glass-appear hover:glass-hover transition-all duration-300"
                        style={{
                            animationDelay: `${0.6 + index * 0.1}s`,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            padding: '24px'
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-foreground">{store.name}</h3>
                            <Badge
                                className="bg-green-100 text-green-700 border-green-200"
                                style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    color: 'rgb(34, 197, 94)'
                                }}
                            >
                                Active
                            </Badge>
                        </div>
                        {store.description && (
                            <p className="text-sm text-muted-foreground mb-4">{store.description}</p>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2 text-sm">
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

                            <div
                                className="pt-3 border-t"
                                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">0</p>
                                        <p className="text-xs text-muted-foreground">Products</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">0</p>
                                        <p className="text-xs text-muted-foreground">Orders</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">UGX 0</p>
                                        <p className="text-xs text-muted-foreground">Revenue</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                {store.notification_preferences?.online_orders !== false && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            color: 'rgb(99, 102, 241)'
                                        }}
                                    >
                                        Online Orders
                                    </Badge>
                                )}
                                {store.notification_preferences?.delivery_updates !== false && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                        style={{
                                            background: 'rgba(168, 85, 247, 0.1)',
                                            border: '1px solid rgba(168, 85, 247, 0.3)',
                                            color: 'rgb(168, 85, 247)'
                                        }}
                                    >
                                        Delivery
                                    </Badge>
                                )}
                            </div>

                            {/* Manage Store Button */}
                            <div className="pt-4">
                                <button
                                    className="w-full glass-button-primary flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                                        border: '1px solid rgba(99, 102, 241, 0.4)',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)',
                                        color: 'rgb(99, 102, 241)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))';
                                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))';
                                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.2)';
                                    }}
                                    onClick={() => {
                                        // Navigate to store management page
                                        window.location.href = `/dashboard/store?id=${store.id}`;
                                    }}
                                >
                                    <StoreIcon className="w-4 h-4" />
                                    Manage Store
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between pt-2 border-t"
                                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {store.business_hours ? 'Business Hours Set' : 'Hours Not Set'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="glass-icon-button p-2"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onClick={() => handleEditStore(store)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="glass-icon-button p-2"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="glass-icon-button p-2 text-red-600 hover:text-red-700"
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '8px',
                                            backdropFilter: 'blur(10px)',
                                            color: 'rgb(239, 68, 68)'
                                        }}
                                        onClick={() => handleDeleteStore(store.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Store Card */}
                <div
                    className="glass-card-dashed animate-glass-appear hover:glass-hover transition-all duration-300 cursor-pointer"
                    style={{
                        animationDelay: `${0.6 + filteredStores.length * 0.1}s`,
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '2px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        padding: '24px'
                    }}
                    onClick={() => setShowAddForm(true)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <Plus className="w-12 h-12 text-muted-foreground/60 mb-4" />
                        <h4 className="font-semibold text-foreground mb-2">Add New Store</h4>
                        <p className="text-sm text-muted-foreground">
                            Expand your business with additional locations
                        </p>
                    </div>
                </div>
            </div>

            {filteredStores.length === 0 && searchTerm && (
                <div className="glass-card-enhanced text-center py-8">
                    <StoreIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2 text-foreground">No stores found</h3>
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
                                    value={formData.contact_phone}
                                    onChange={(e) => handleFormDataChange('contact_phone', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-store-email">Email Address *</Label>
                                <Input
                                    id="edit-store-email"
                                    type="email"
                                    placeholder="store@business.com"
                                    value={formData.contact_email}
                                    onChange={(e) => handleFormDataChange('contact_email', e.target.value)}
                                />
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
