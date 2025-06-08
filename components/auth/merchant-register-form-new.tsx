"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/context"
import { Building2, User, Mail, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface MerchantRegistrationData {
    business_name: string
    business_type: string
    business_phone: string
    business_email: string
    business_address: string
    owner_first_name: string
    owner_last_name: string
    owner_phone: string
    owner_email: string
}

export function MerchantRegisterForm() {
    const { user, isAuthenticated, createMerchantAccount, isMerchant } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState<MerchantRegistrationData>({
        business_name: "",
        business_type: "",
        business_phone: "",
        business_email: "",
        business_address: "",
        owner_first_name: "",
        owner_last_name: "",
        owner_phone: "",
        owner_email: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [step, setStep] = useState(1) // Multi-step form

    // Redirect if user is already a merchant
    useEffect(() => {
        if (isMerchant) {
            router.push("/dashboard/store")
        }
    }, [isMerchant, router])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login?redirect=merchant-register")
        }
    }, [isAuthenticated, router])

    // Update form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                owner_first_name: user.first_name || "",
                owner_last_name: user.last_name || "",
                owner_phone: user.phone_number || "",
                owner_email: user.email || "",
            }))
        }
    }, [user])

    // Show loading if checking auth status
    if (!isAuthenticated) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Redirecting to login...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Show message if already a merchant
    if (isMerchant) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Merchant Account Active</h3>
                        <p className="text-muted-foreground mb-4">You already have a merchant account.</p>
                        <Button asChild>
                            <Link href="/dashboard/store">Go to Store Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleInputChange = (field: keyof MerchantRegistrationData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError("")
    }

    const validateStep1 = () => {
        const { business_name, business_type, business_phone, business_email, business_address } = formData

        if (!business_name.trim()) {
            setError("Business name is required")
            return false
        }
        if (!business_type) {
            setError("Please select a business type")
            return false
        }
        if (!business_phone.trim()) {
            setError("Business phone is required")
            return false
        }
        if (!business_email.trim()) {
            setError("Business email is required")
            return false
        }
        if (!business_address.trim()) {
            setError("Business address is required")
            return false
        }

        return true
    }

    const validateStep2 = () => {
        const { owner_first_name, owner_last_name, owner_phone, owner_email } = formData

        if (!owner_first_name.trim()) {
            setError("Owner first name is required")
            return false
        }
        if (!owner_last_name.trim()) {
            setError("Owner last name is required")
            return false
        }
        if (!owner_phone.trim()) {
            setError("Owner phone is required")
            return false
        }
        if (!owner_email.trim()) {
            setError("Owner email is required")
            return false
        }

        return true
    }

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2)
        }
    }

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateStep2()) {
            return
        }

        setLoading(true)
        setError("")

        try {
            await createMerchantAccount(formData)

            // Redirect to store dashboard after successful creation
            router.push("/dashboard/store?message=Merchant account created successfully!")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    const businessTypes = [
        "Retail Store",
        "Restaurant/Food Service",
        "Online Business",
        "Service Provider",
        "Manufacturing",
        "Wholesale",
        "Healthcare",
        "Education",
        "Technology",
        "Other"
    ]

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Create Business Account
                </CardTitle>
                <CardDescription>
                    Upgrade your account to start accepting payments for your business
                </CardDescription>
                <div className="flex justify-center mt-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                            1
                        </div>
                        <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                            2
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold">Business Information</h3>
                                <p className="text-sm text-muted-foreground">Tell us about your business</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name *</Label>
                                <Input
                                    id="business_name"
                                    type="text"
                                    placeholder="Enter your business name"
                                    value={formData.business_name}
                                    onChange={(e) => handleInputChange("business_name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_type">Business Type *</Label>
                                <Select
                                    value={formData.business_type}
                                    onValueChange={(value: string) => handleInputChange("business_type", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businessTypes.map((type) => (
                                            <SelectItem key={type} value={type.toLowerCase().replace(/[^a-z0-9]/g, '_')}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business_phone">Business Phone *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="business_phone"
                                            type="tel"
                                            placeholder="+256701234567"
                                            className="pl-10"
                                            value={formData.business_phone}
                                            onChange={(e) => handleInputChange("business_phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_email">Business Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="business_email"
                                            type="email"
                                            placeholder="business@example.com"
                                            className="pl-10"
                                            value={formData.business_email}
                                            onChange={(e) => handleInputChange("business_email", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_address">Business Address *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Textarea
                                        id="business_address"
                                        placeholder="Enter your business address"
                                        className="pl-10 min-h-[80px]"
                                        value={formData.business_address}
                                        onChange={(e) => handleInputChange("business_address", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="button" onClick={handleNext} className="w-full">
                                Continue to Owner Information
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold">Owner Information</h3>
                                <p className="text-sm text-muted-foreground">Verify your personal details as the business owner</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner_first_name">First Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="owner_first_name"
                                            type="text"
                                            placeholder="John"
                                            className="pl-10"
                                            value={formData.owner_first_name}
                                            onChange={(e) => handleInputChange("owner_first_name", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_last_name">Last Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="owner_last_name"
                                            type="text"
                                            placeholder="Doe"
                                            className="pl-10"
                                            value={formData.owner_last_name}
                                            onChange={(e) => handleInputChange("owner_last_name", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner_phone">Owner Phone *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="owner_phone"
                                            type="tel"
                                            placeholder="+256701234567"
                                            className="pl-10"
                                            value={formData.owner_phone}
                                            onChange={(e) => handleInputChange("owner_phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_email">Owner Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="owner_email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="pl-10"
                                            value={formData.owner_email}
                                            onChange={(e) => handleInputChange("owner_email", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-900">Account Integration</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Your business account will be linked to your existing Piaxe account ({user?.email}).
                                            You'll use the same login credentials to access both personal and business features.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                                    Back
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? "Creating Business Account..." : "Create Business Account"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Need help? </span>
                        <Link href="/support" className="text-primary hover:underline">
                            Contact Support
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
