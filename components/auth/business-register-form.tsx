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

interface BusinessRegistrationData {
    business_name: string
    business_type: string
    business_phone: string
    business_email: string
    business_address: string
}

export function BusinessRegisterForm() {
    const { user, isAuthenticated, createBusinessAccount, isBusiness } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState<BusinessRegistrationData>({
        business_name: "",
        business_type: "",
        business_phone: "",
        business_email: "",
        business_address: "",
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
            if (!formData[field as keyof BusinessRegistrationData]?.trim()) {
                setError(`${field.replace('_', ' ')} is required`)
                return false
            }
        }
        return true
    }

    const validateStep2 = () => {
        const requiredFields = ['business_email', 'business_phone', 'business_address']
        for (const field of requiredFields) {
            if (!formData[field as keyof BusinessRegistrationData]?.trim()) {
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

    const handleNext = () => {
        setError("")
        if (step === 1 && validateStep1()) {
            setStep(2)
        }
    }

    const handleBack = () => {
        setStep(1)
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!isAuthenticated) {
            setError("You must be logged in to create a business account")
            return
        }

        if (!validateStep2()) return

        setLoading(true)

        try {
            const submitData = {
                business_name: formData.business_name.trim(),
                business_type: formData.business_type,
                business_email: formData.business_email.trim(),
                business_phone: formData.business_phone.trim(),
                business_address: formData.business_address.trim(),
            }

            await createBusinessAccount(submitData)
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <Building2 className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            You need to be logged in to create a business account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/auth/login">
                            <Button className="w-full">
                                Login to Continue
                            </Button>
                        </Link>
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link href="/auth/register" className="text-purple-600 hover:underline">
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <CardTitle className="text-green-600">Business Account Created!</CardTitle>
                        <CardDescription>
                            Your business account has been successfully created. You'll be redirected to your dashboard shortly.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <Building2 className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                    <CardTitle className="text-2xl font-bold">Create Business Account</CardTitle>
                    <CardDescription>
                        Set up your business to start selling products and managing inventory with Piaxe
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                2
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-purple-600 mb-4">
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
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_type">Business Type *</Label>
                                    <Select value={formData.business_type} onValueChange={(value) => handleSelectChange('business_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your business type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retail">Retail Store</SelectItem>
                                            <SelectItem value="restaurant">Restaurant</SelectItem>
                                            <SelectItem value="grocery">Grocery Store</SelectItem>
                                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="fashion">Fashion & Clothing</SelectItem>
                                            <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                                            <SelectItem value="automotive">Automotive</SelectItem>
                                            <SelectItem value="bookstore">Bookstore</SelectItem>
                                            <SelectItem value="service">Service Business</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-purple-900 mb-2">What you'll get:</h4>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        <li>• Complete inventory management system</li>
                                        <li>• Customer relationship management (CRM)</li>
                                        <li>• Sales analytics and reporting</li>
                                        <li>• Payment processing integration</li>
                                        <li>• Marketing campaign tools</li>
                                    </ul>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                    Continue
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-purple-600 mb-4">
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
                                        className="w-full"
                                    />
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

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Need API access instead?{" "}
                                <Link href="/auth/developer-register" className="text-purple-600 hover:underline">
                                    Create a developer account
                                </Link>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
