"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth/context"
import { shoppingInventoryAPI } from "@/lib/api/shopping-inventory"
import { Building2, User, Mail, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface BusinessRegistrationData {
    business_name: string
    business_type: string
    business_phone: string
    business_email: string
    business_address: string
    website?: string
    business_hours?: {
        monday?: { open: string; close: string; closed: boolean }
        tuesday?: { open: string; close: string; closed: boolean }
        wednesday?: { open: string; close: string; closed: boolean }
        thursday?: { open: string; close: string; closed: boolean }
        friday?: { open: string; close: string; closed: boolean }
        saturday?: { open: string; close: string; closed: boolean }
        sunday?: { open: string; close: string; closed: boolean }
    }
    notification_preferences?: {
        email_notifications: boolean
        sms_notifications: boolean
        marketing_notifications: boolean
    }
}

// Map user-friendly business categories to API business types
const businessTypeMapping: Record<string, string> = {
    'retail_store': 'Retail',
    'restaurant': 'Services',
    'grocery_store': 'Retail',
    'pharmacy': 'Retail',
    'electronics': 'E-commerce',
    'fashion_clothing': 'Retail',
    'beauty_cosmetics': 'Services',
    'automotive': 'Services',
    'bookstore': 'Retail',
    'service_business': 'Services',
    'e_commerce': 'E-commerce',
    'wholesale': 'Wholesale',
    'manufacturing': 'Manufacturing',
    'other': 'Other'
}

export function BusinessRegisterForm() {
    const { user, isAuthenticated, createBusinessAccount, isBusiness, token } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState<BusinessRegistrationData>({
        business_name: "",
        business_type: "",
        business_phone: "",
        business_email: "",
        business_address: "",
        website: "",
        business_hours: {
            monday: { open: "09:00", close: "17:00", closed: false },
            tuesday: { open: "09:00", close: "17:00", closed: false },
            wednesday: { open: "09:00", close: "17:00", closed: false },
            thursday: { open: "09:00", close: "17:00", closed: false },
            friday: { open: "09:00", close: "17:00", closed: false },
            saturday: { open: "10:00", close: "16:00", closed: false },
            sunday: { open: "10:00", close: "16:00", closed: true }
        },
        notification_preferences: {
            email_notifications: true,
            sms_notifications: false,
            marketing_notifications: false
        }
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [step, setStep] = useState(1) // Multi-step form

    // Redirect if user is already a business
    useEffect(() => {
        if (isBusiness) {
            router.push("/business/dashboard")
        }
    }, [isBusiness, router])

    // Pre-fill form with user data if authenticated
    useEffect(() => {
        if (user && isAuthenticated) {
            setFormData(prev => ({
                ...prev,
                business_email: prev.business_email || user.email,
                business_phone: prev.business_phone || user.phone_number,
            }))
        }
    }, [user, isAuthenticated])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const validateStep1 = () => {
        const requiredFields = ['business_name', 'business_type']
        for (const field of requiredFields) {
            const value = formData[field as keyof BusinessRegistrationData]
            if (typeof value === 'string' && !value.trim()) {
                setError(`${field.replace('_', ' ')} is required`)
                return false
            }
        }
        return true
    }

    const validateStep2 = () => {
        const requiredFields = ['business_email', 'business_phone', 'business_address']
        for (const field of requiredFields) {
            const value = formData[field as keyof BusinessRegistrationData]
            if (typeof value === 'string' && !value.trim()) {
                setError(`${field.replace('_', ' ')} is required`)
                return false
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.business_email)) {
            setError("Please enter a valid email address")
            return false
        }

        return true
    }

    const validateStep3 = () => {
        // Business hours and notification preferences are optional but validate format if provided
        return true
    }

    const handleNext = () => {
        setError("")
        if (step === 1 && validateStep1()) {
            setStep(2)
        } else if (step === 2 && validateStep2()) {
            setStep(3)
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!isAuthenticated) {
            setError("You must be logged in to create a business account")
            return
        }

        if (!validateStep3()) return

        setLoading(true)

        try {
            // Map user-friendly business type to API business type
            const apiBusinessType = businessTypeMapping[formData.business_type] || 'Other'

            const submitData = {
                business_name: formData.business_name.trim(),
                business_type: apiBusinessType,
                business_email: formData.business_email.trim(),
                business_phone: formData.business_phone.trim(),
                business_address: formData.business_address.trim(),
            }

            // Create business account (this now creates a store automatically)
            const result = await createBusinessAccount(submitData)
            console.log('Business account created with store:', result)

            setSuccess(true)

            setTimeout(() => {
                router.push("/business/dashboard")
            }, 2000)
        } catch (err: any) {
            console.error("Business registration error:", err)
            setError(err.message || "Failed to create business account. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
                <div className="glass-card w-full max-w-md mx-4 animate-glass-appear">
                    <div className="text-center space-y-4 p-8">
                        <Building2 className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h1 className="text-xl font-bold text-foreground">Authentication Required</h1>
                        <p className="text-muted-foreground">
                            You need to be logged in to create a business account
                        </p>
                        <div className="space-y-4 pt-4">
                            <Link href="/auth/login">
                                <button className="glass-button-primary w-full px-6 py-3">
                                    Login to Continue
                                </button>
                            </Link>
                            <div className="text-center">
                                <span className="text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link href="/auth/register" className="text-primary hover:underline">
                                        Sign up
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
                <div className="glass-card w-full max-w-md mx-4 animate-glass-appear">
                    <div className="text-center space-y-4 p-8">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h1 className="text-xl font-bold text-green-600">Business Account Created!</h1>
                        <p className="text-muted-foreground">
                            Your business account has been successfully created with your main store.
                            You can now manage products, inventory, and orders from your dashboard.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center liquid-glass-bg p-4">
            <div className="glass-card-enhanced w-full max-w-2xl animate-glass-appear">
                <div className="text-center space-y-4 mb-8">
                    <Building2 className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h1 className="text-2xl font-bold text-foreground">Create Business Account</h1>
                    <p className="text-muted-foreground">
                        Set up your business to start selling products and managing inventory with Piaxe
                    </p>
                </div>
                <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step >= 1
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-white/20 text-muted-foreground border border-white/30'
                                }`}>
                                1
                            </div>
                            <div className={`w-12 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                                }`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step >= 2
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-white/20 text-muted-foreground border border-white/30'
                                }`}>
                                2
                            </div>
                            <div className={`w-12 h-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                                }`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step >= 3
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-white/20 text-muted-foreground border border-white/30'
                                }`}>
                                3
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="glass-card flex items-center space-x-2 text-red-400 p-4"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '12px'
                                }}>
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-primary mb-4">
                                    <Building2 className="w-5 h-5" />
                                    <h3 className="font-semibold">Business Information</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_name">Business Name *</Label>
                                    <Input
                                        id="business_name"
                                        name="business_name"
                                        type="text"
                                        placeholder="Your business name"
                                        value={formData.business_name}
                                        onChange={handleInputChange}
                                        required
                                        className="glass-input w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_type">Business Type *</Label>
                                    <Select value={formData.business_type} onValueChange={(value) => handleSelectChange('business_type', value)}>
                                        <SelectTrigger className="glass-input">
                                            <SelectValue placeholder="Select your business type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retail_store">Retail Store</SelectItem>
                                            <SelectItem value="restaurant">Restaurant</SelectItem>
                                            <SelectItem value="grocery_store">Grocery Store</SelectItem>
                                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="fashion_clothing">Fashion & Clothing</SelectItem>
                                            <SelectItem value="beauty_cosmetics">Beauty & Cosmetics</SelectItem>
                                            <SelectItem value="automotive">Automotive</SelectItem>
                                            <SelectItem value="bookstore">Bookstore</SelectItem>
                                            <SelectItem value="service_business">Service Business</SelectItem>
                                            <SelectItem value="e_commerce">E-commerce</SelectItem>
                                            <SelectItem value="wholesale">Wholesale</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="glass-card p-4"
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: '12px'
                                    }}>
                                    <h4 className="font-semibold text-primary mb-2">What you'll get:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Complete inventory management system</li>
                                        <li>• Customer relationship management (CRM)</li>
                                        <li>• Sales analytics and reporting</li>
                                        <li>• Payment processing integration</li>
                                        <li>• Marketing campaign tools</li>
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="glass-button-primary w-full px-6 py-3"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-primary mb-4">
                                    <Mail className="w-5 h-5" />
                                    <h3 className="font-semibold">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="business_email">Business Email *</Label>
                                        <Input
                                            id="business_email"
                                            name="business_email"
                                            type="email"
                                            placeholder="business@example.com"
                                            value={formData.business_email}
                                            onChange={handleInputChange}
                                            required
                                            className="glass-input"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_phone">Business Phone *</Label>
                                        <Input
                                            id="business_phone"
                                            name="business_phone"
                                            type="tel"
                                            placeholder="+1234567890"
                                            value={formData.business_phone}
                                            onChange={handleInputChange}
                                            required
                                            className="glass-input"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_address">Business Address *</Label>
                                    <Textarea
                                        id="business_address"
                                        name="business_address"
                                        placeholder="Enter your complete business address"
                                        value={formData.business_address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="glass-input w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website (Optional)</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        value={formData.website || ""}
                                        onChange={handleInputChange}
                                        className="glass-input"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="glass-button-secondary w-full px-6 py-3"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="glass-button-primary w-full px-6 py-3"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 text-purple-600 mb-4">
                                    <Building2 className="w-5 h-5" />
                                    <h3 className="font-semibold">Business Setup</h3>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Business Hours</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(formData.business_hours || {}).map(([day, hours]) => (
                                            <div key={day} className="flex items-center space-x-4">
                                                <div className="w-20 text-sm font-medium capitalize">
                                                    {day}
                                                </div>
                                                <Checkbox
                                                    checked={!hours.closed}
                                                    onCheckedChange={(checked) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            business_hours: {
                                                                ...prev.business_hours,
                                                                [day]: {
                                                                    ...hours,
                                                                    closed: !checked
                                                                }
                                                            }
                                                        }))
                                                    }}
                                                />
                                                <span className="text-sm mr-2">Open</span>
                                                {!hours.closed && (
                                                    <>
                                                        <Input
                                                            type="time"
                                                            value={hours.open}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    business_hours: {
                                                                        ...prev.business_hours,
                                                                        [day]: {
                                                                            ...hours,
                                                                            open: e.target.value
                                                                        }
                                                                    }
                                                                }))
                                                            }}
                                                            className="w-24"
                                                        />
                                                        <span className="text-sm">to</span>
                                                        <Input
                                                            type="time"
                                                            value={hours.close}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    business_hours: {
                                                                        ...prev.business_hours,
                                                                        [day]: {
                                                                            ...hours,
                                                                            close: e.target.value
                                                                        }
                                                                    }
                                                                }))
                                                            }}
                                                            className="w-24"
                                                        />
                                                    </>
                                                )}
                                                {hours.closed && (
                                                    <span className="text-gray-500 text-sm">Closed</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-2">✓ Default Store Setup</h4>
                                    <p className="text-sm text-green-700">
                                        A default store will be automatically created for your business using the information above. You can customize your store settings and create additional stores after registration.
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Notification Preferences</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="email_notifications"
                                                checked={formData.notification_preferences?.email_notifications || false}
                                                onCheckedChange={(checked) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        notification_preferences: {
                                                            email_notifications: !!checked,
                                                            sms_notifications: prev.notification_preferences?.sms_notifications || false,
                                                            marketing_notifications: prev.notification_preferences?.marketing_notifications || false
                                                        }
                                                    }))
                                                }}
                                            />
                                            <Label htmlFor="email_notifications" className="text-sm">
                                                Email notifications for orders and updates
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sms_notifications"
                                                checked={formData.notification_preferences?.sms_notifications || false}
                                                onCheckedChange={(checked) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        notification_preferences: {
                                                            email_notifications: prev.notification_preferences?.email_notifications || false,
                                                            sms_notifications: !!checked,
                                                            marketing_notifications: prev.notification_preferences?.marketing_notifications || false
                                                        }
                                                    }))
                                                }}
                                            />
                                            <Label htmlFor="sms_notifications" className="text-sm">
                                                SMS notifications for urgent updates
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="marketing_notifications"
                                                checked={formData.notification_preferences?.marketing_notifications || false}
                                                onCheckedChange={(checked) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        notification_preferences: {
                                                            email_notifications: prev.notification_preferences?.email_notifications || false,
                                                            sms_notifications: prev.notification_preferences?.sms_notifications || false,
                                                            marketing_notifications: !!checked
                                                        }
                                                    }))
                                                }}
                                            />
                                            <Label htmlFor="marketing_notifications" className="text-sm">
                                                Marketing and promotional updates
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-purple-900 mb-2">Ready to Launch!</h4>
                                    <p className="text-sm text-purple-700">
                                        Your business account and default store will be created automatically. You'll immediately have access to:
                                    </p>
                                    <ul className="text-sm text-purple-700 space-y-1 mt-2">
                                        <li>• Your first store with the configured business hours</li>
                                        <li>• Product and inventory management system</li>
                                        <li>• Payment processing and order tracking</li>
                                        <li>• Customer relationship management</li>
                                        <li>• Business analytics and reporting</li>
                                    </ul>
                                </div>

                                <div className="flex space-x-4">
                                    <Button
                                        type="button"
                                        onClick={handleBack}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating Business Account..." : "Create Business Account"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-6">
                            <span className="text-sm text-muted-foreground">
                                Need API access instead?{" "}
                                <Link href="/auth/developer-register" className="text-primary hover:underline">
                                    Create a developer account
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
