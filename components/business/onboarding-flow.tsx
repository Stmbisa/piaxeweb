"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI } from "@/lib/api/shopping-inventory"
import {
    Building2,
    Store,
    Users,
    Package,
    CheckCircle,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Globe,
    Camera,
    Upload
} from "lucide-react"

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ComponentType<any>
}

interface BusinessData {
    business_name: string
    business_description: string
    business_type: string
    business_category: string
    website?: string
    logo?: string
}

interface StoreData {
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

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'business-info',
        title: 'Business Information',
        description: 'Tell us about your business',
        icon: Building2
    },
    {
        id: 'store-setup',
        title: 'Store Setup',
        description: 'Create your first store',
        icon: Store
    },
    {
        id: 'staff-setup',
        title: 'Staff Management',
        description: 'Add your team members',
        icon: Users
    },
    {
        id: 'products-setup',
        title: 'Product Catalog',
        description: 'Set up your inventory',
        icon: Package
    },
    {
        id: 'complete',
        title: 'Complete',
        description: 'You\'re all set!',
        icon: CheckCircle
    }
]

const BUSINESS_TYPES = [
    'Retail Store',
    'Restaurant',
    'Grocery Store',
    'Pharmacy',
    'Electronics',
    'Fashion & Clothing',
    'Beauty & Cosmetics',
    'Automotive',
    'Bookstore',
    'Service Business',
    'Other'
]

const BUSINESS_CATEGORIES = [
    'Food & Beverage',
    'Retail & Fashion',
    'Health & Beauty',
    'Technology',
    'Professional Services',
    'Healthcare',
    'Education',
    'Entertainment',
    'Automotive',
    'Home & Garden',
    'Other'
]

export function BusinessOnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(0)
    const [businessData, setBusinessData] = useState<BusinessData>({
        business_name: '',
        business_description: '',
        business_type: '',
        business_category: '',
        website: '',
        logo: ''
    })
    const [storeData, setStoreData] = useState<StoreData>({
        name: '',
        description: '',
        address: '',
        contact_phone: '',
        contact_email: '',
        business_hours: {},
        notification_preferences: {
            online_orders: true,
            delivery_updates: false,
            inventory_alerts: true
        }
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { user, token } = useAuth()
    const { toast } = useToast()
    const router = useRouter()

    // Pre-fill with existing business data if available
    useEffect(() => {
        if (user?.business_profile) {
            setBusinessData({
                business_name: user.business_profile.business_name || '',
                business_description: '',
                business_type: user.business_profile.business_type || '',
                business_category: '',
                website: '',
                logo: ''
            })
        }
    }, [user])

    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

    const validateBusinessInfo = () => {
        if (!businessData.business_name.trim()) {
            setError('Business name is required')
            return false
        }
        if (!businessData.business_type) {
            setError('Business type is required')
            return false
        }
        if (!businessData.business_category) {
            setError('Business category is required')
            return false
        }
        return true
    }

    const validateStoreInfo = () => {
        if (!storeData.name.trim()) {
            setError('Store name is required')
            return false
        }
        if (!storeData.address.trim()) {
            setError('Store address is required')
            return false
        }
        if (!storeData.contact_phone.trim()) {
            setError('Store phone is required')
            return false
        }
        if (!storeData.contact_email.trim()) {
            setError('Store email is required')
            return false
        }
        return true
    }

    const handleNext = async () => {
        setError('')

        if (currentStep === 0 && !validateBusinessInfo()) return
        if (currentStep === 1 && !validateStoreInfo()) return

        // Save business information
        if (currentStep === 0) {
            setLoading(true)
            try {
                // Update business profile via API
                const updatedProfile = {
                    ...user?.business_profile,
                    ...businessData,
                    setup_step: 'store-setup'
                }
                // In a real app, call API to update business profile
                // await updateUser({ business_profile: updatedProfile })
                toast({
                    title: "Business information saved",
                    description: "Let's set up your first store",
                })
            } catch (err) {
                setError('Failed to save business information')
                return
            } finally {
                setLoading(false)
            }
        }

        // Create store
        if (currentStep === 1) {
            setLoading(true)
            try {
                if (!token) throw new Error('Authentication required')

                await shoppingInventoryAPI.createStore(token, {
                    name: storeData.name,
                    description: storeData.description,
                    address: storeData.address,
                    contact_phone: storeData.contact_phone,
                    contact_email: storeData.contact_email,
                    business_hours: storeData.business_hours || {},
                    notification_preferences: storeData.notification_preferences || {}
                })

                toast({
                    title: "Store created successfully",
                    description: "Your store is now ready for business",
                })
            } catch (err) {
                setError('Failed to create store')
                return
            } finally {
                setLoading(false)
            }
        }

        // Complete onboarding
        if (currentStep === ONBOARDING_STEPS.length - 2) {
            setLoading(true)
            try {
                // Mark onboarding as complete
                const updatedProfile = {
                    ...user?.business_profile,
                    setup_complete: true,
                    setup_step: 'complete'
                }
                // await updateUser({ business_profile: updatedProfile })

                toast({
                    title: "Onboarding complete!",
                    description: "Welcome to your business dashboard",
                })

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push('/business/dashboard')
                }, 2000)
            } catch (err) {
                setError('Failed to complete setup')
                return
            } finally {
                setLoading(false)
            }
        }

        setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1))
        setError('')
    }

    const handleBusinessDataChange = (field: keyof BusinessData, value: string) => {
        setBusinessData(prev => ({ ...prev, [field]: value }))
        setError('')
    }

    const handleStoreDataChange = (field: string, value: any) => {
        if (field.startsWith('business_hours.')) {
            const hourField = field.replace('business_hours.', '')
            setStoreData(prev => ({
                ...prev,
                business_hours: { ...prev.business_hours, [hourField]: value }
            }))
        } else if (field.startsWith('notification_preferences.')) {
            const prefField = field.replace('notification_preferences.', '')
            setStoreData(prev => ({
                ...prev,
                notification_preferences: { ...prev.notification_preferences, [prefField]: value }
            }))
        } else {
            setStoreData(prev => ({ ...prev, [field]: value }))
        }
        setError('')
    }

    const renderBusinessInfoStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <Building2 className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
                <p className="text-muted-foreground">This information helps us customize your experience</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                        id="business_name"
                        placeholder="Your Amazing Business"
                        value={businessData.business_name}
                        onChange={(e) => handleBusinessDataChange('business_name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="business_description">Business Description</Label>
                    <Textarea
                        id="business_description"
                        placeholder="Describe what your business does..."
                        value={businessData.business_description}
                        onChange={(e) => handleBusinessDataChange('business_description', e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="business_type">Business Type *</Label>
                    <Select value={businessData.business_type} onValueChange={(value) => handleBusinessDataChange('business_type', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent>
                            {BUSINESS_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="business_category">Business Category *</Label>
                    <Select value={businessData.business_category} onValueChange={(value) => handleBusinessDataChange('business_category', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your category" />
                        </SelectTrigger>
                        <SelectContent>
                            {BUSINESS_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="website"
                            placeholder="https://yourwebsite.com"
                            value={businessData.website}
                            onChange={(e) => handleBusinessDataChange('website', e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStoreSetupStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <Store className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Set up your first store</h2>
                <p className="text-muted-foreground">Create a store location where customers can find you</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                    <Label htmlFor="store_name">Store Name *</Label>
                    <Input
                        id="store_name"
                        placeholder="Main Store"
                        value={storeData.name}
                        onChange={(e) => handleStoreDataChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="store_description">Store Description</Label>
                    <Textarea
                        id="store_description"
                        placeholder="Describe your store location..."
                        value={storeData.description}
                        onChange={(e) => handleStoreDataChange('description', e.target.value)}
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="store_address">Store Address *</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                            id="store_address"
                            placeholder="Enter your complete store address"
                            value={storeData.address}
                            onChange={(e) => handleStoreDataChange('address', e.target.value)}
                            className="pl-10"
                            rows={2}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="store_phone">Store Phone *</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="store_phone"
                                placeholder="+256701234567"
                                value={storeData.contact_phone}
                                onChange={(e) => handleStoreDataChange('contact_phone', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="store_email">Store Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="store_email"
                                type="email"
                                placeholder="store@business.com"
                                value={storeData.contact_email}
                                onChange={(e) => handleStoreDataChange('contact_email', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold">Business Hours & Preferences</h4>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="business-hours">Business Hours (JSON format)</Label>
                            <Textarea
                                id="business-hours"
                                placeholder='{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}}'
                                value={storeData.business_hours ? JSON.stringify(storeData.business_hours, null, 2) : ''}
                                onChange={(e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value)
                                        handleStoreDataChange('business_hours', parsed)
                                    } catch {
                                        // Invalid JSON, don't update
                                    }
                                }}
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h5 className="font-medium">Notification Preferences</h5>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="online_orders"
                                checked={storeData.notification_preferences?.online_orders !== false}
                                onChange={(e) => handleStoreDataChange('notification_preferences.online_orders', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="online_orders">Online order notifications</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="delivery_updates"
                                checked={storeData.notification_preferences?.delivery_updates !== false}
                                onChange={(e) => handleStoreDataChange('notification_preferences.delivery_updates', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="delivery_updates">Delivery update notifications</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="inventory_alerts"
                                checked={storeData.notification_preferences?.inventory_alerts !== false}
                                onChange={(e) => handleStoreDataChange('notification_preferences.inventory_alerts', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="inventory_alerts">Inventory alert notifications</Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStaffSetupStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <Users className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Add your team members</h2>
                <p className="text-muted-foreground">You can add staff members later from your dashboard</p>
            </div>

            <div className="max-w-md mx-auto text-center space-y-4">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="font-semibold mb-2">Staff Management</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Add staff members to help manage your business. You can assign roles and permissions for different team members.
                    </p>
                    <Button variant="outline" className="w-full">
                        Skip for now
                    </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What you can do with staff management:</h4>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                        <li>• Add multiple staff members</li>
                        <li>• Assign different roles (Manager, Cashier, etc.)</li>
                        <li>• Set permissions for each role</li>
                        <li>• Track staff performance</li>
                        <li>• Manage work schedules</li>
                    </ul>
                </div>
            </div>
        </div>
    )

    const renderProductsSetupStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <Package className="w-16 h-16 mx-auto text-orange-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Set up your product catalog</h2>
                <p className="text-muted-foreground">You can start selling right away or add products later</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push('/business/dashboard/products')}
                    >
                        <Package className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold mb-1">Add Products Manually</h4>
                        <p className="text-sm text-muted-foreground">Add products one by one</p>
                    </div>

                    <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push('/business/dashboard/products')}
                    >
                        <Camera className="w-8 h-8 text-green-600 mb-2" />
                        <h4 className="font-semibold mb-1">Scan Barcodes</h4>
                        <p className="text-sm text-muted-foreground">Use barcode scanning</p>
                    </div>

                    <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push('/business/dashboard/inventory')}
                    >
                        <Upload className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold mb-1">Import Products</h4>
                        <p className="text-sm text-muted-foreground">Bulk upload from file</p>
                    </div>
                </div>

                <div className="text-center">
                    <Button variant="outline" className="w-full">
                        Skip for now - I'll add products later
                    </Button>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Product features you'll get:</h4>
                    <ul className="text-sm text-orange-700 space-y-1 text-left">
                        <li>• Complete inventory management</li>
                        <li>• Barcode scanning and generation</li>
                        <li>• Low stock alerts</li>
                        <li>• Product analytics</li>
                        <li>• Category management</li>
                        <li>• Bulk product import</li>
                    </ul>
                </div>
            </div>
        </div>
    )

    const renderCompleteStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Welcome to piaxis Business!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                    Your business account is set up and ready to go
                </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4">What's next?</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Access your business dashboard
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Start adding products to your store
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Invite team members
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Begin accepting payments
                        </li>
                    </ul>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Redirecting to your dashboard...
                </p>
            </div>
        </div>
    )

    if (currentStep >= ONBOARDING_STEPS.length) {
        return renderCompleteStep()
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Progress Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Business Setup</h1>
                    <span className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center mb-8 space-x-4 overflow-x-auto">
                {ONBOARDING_STEPS.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center p-4 rounded-lg min-w-[120px] ${isActive
                                ? 'bg-primary/10 border border-primary/20'
                                : isCompleted
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <div className={`p-2 rounded-full mb-2 ${isActive
                                ? 'bg-primary text-white'
                                : isCompleted
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <h4 className={`font-semibold text-sm text-center ${isActive ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-gray-600'
                                }`}>
                                {step.title}
                            </h4>
                            <p className="text-xs text-center text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Step Content */}
            <Card className="mb-8">
                <CardContent className="p-8">
                    {currentStep === 0 && renderBusinessInfoStep()}
                    {currentStep === 1 && renderStoreSetupStep()}
                    {currentStep === 2 && renderStaffSetupStep()}
                    {currentStep === 3 && renderProductsSetupStep()}
                    {currentStep === 4 && renderCompleteStep()}
                </CardContent>
            </Card>

            {/* Navigation */}
            {currentStep < ONBOARDING_STEPS.length - 1 && (
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0 || loading}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {currentStep === 1 ? 'Creating Store...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                {currentStep === ONBOARDING_STEPS.length - 2 ? 'Complete Setup' : 'Continue'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
