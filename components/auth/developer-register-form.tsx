"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/context"
import { Code, AlertCircle, CheckCircle, Briefcase, Mail, Phone, MapPin, Link as LinkIcon, Type } from "lucide-react"
import Link from "next/link"

interface MerchantRegistrationData {
    business_name: string
    email: string
    phone: string
    address: string
    website: string
    business_type: string
}

export function DeveloperRegisterForm() {
    const { isAuthenticated, createDeveloperAccount, isDeveloper, isLoading } = useAuth()
    const router = useRouter()

    const [businessName, setBusinessName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhoneState] = useState('')
    const [address, setAddress] = useState('')
    const [website, setWebsite] = useState('')
    const [businessType, setBusinessType] = useState('')

    const [currentError, setCurrentError] = useState<string | null>(null)
    const [currentSuccess, setCurrentSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (isDeveloper && isAuthenticated) {
            router.push("/developer/dashboard")
        }
    }, [isDeveloper, isAuthenticated, router])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCurrentError(null)
        setCurrentSuccess(null)

        if (!isAuthenticated) {
            setCurrentError("You must be logged in to create a developer account.")
            return
        }

        if (!businessName.trim() || !email.trim() || !phone.trim() || !address.trim() || !website.trim() || !businessType.trim()) {
            setCurrentError("All fields are required.")
            return
        }
        try {
            new URL(website)
        } catch {
            setCurrentError("Invalid website URL format.")
            return
        }
        if (!/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
            setCurrentError("Invalid phone number format.")
            return
        }

        const merchantData: MerchantRegistrationData = {
            business_name: businessName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            website: website.trim(),
            business_type: businessType.trim(),
        }

        try {
            await createDeveloperAccount(merchantData)
            setCurrentSuccess('Developer account registered successfully! Redirecting to dashboard...')

            setBusinessName('')
            setEmail('')
            setPhoneState('')
            setAddress('')
            setWebsite('')
            setBusinessType('')

            setTimeout(() => {
                router.push("/developer/dashboard")
            }, 2000)
        } catch (err: any) {
            console.error("Developer registration error:", err)
            setCurrentError(err.message || "Failed to create developer account. Please try again.")
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
                <div className="glass-card w-full max-w-md mx-4 animate-glass-appear">
                    <div className="text-center space-y-4 p-8">
                        <Code className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h1 className="text-xl font-bold text-foreground">Authentication Required</h1>
                        <p className="text-muted-foreground">
                            You need to be logged in to create a developer account.
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

    if (currentSuccess && !isDeveloper) {
        return (
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
                <div className="glass-card w-full max-w-md mx-4 animate-glass-appear">
                    <div className="text-center space-y-4 p-8">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h1 className="text-xl font-bold text-green-600">Developer Account Created!</h1>
                        <p className="text-muted-foreground">
                            {currentSuccess}
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
                    <Briefcase className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h1 className="text-2xl font-bold text-foreground">Register Your Business</h1>
                    <p className="text-muted-foreground">
                        Provide your business details to become a Piaxe Developer and access our APIs.
                    </p>
                </div>
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {currentError && (
                            <div className="glass-card flex items-center space-x-2 text-red-400 p-4"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '12px'
                                }}>
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{currentError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input
                                    id="businessName"
                                    name="business_name"
                                    type="text"
                                    placeholder="Your Company LLC"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    required
                                    className="glass-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Select value={businessType} onValueChange={setBusinessType}>
                                    <SelectTrigger className="glass-input">
                                        <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Retail">Retail</SelectItem>
                                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                                        <SelectItem value="Services">Services</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                        <SelectItem value="Crypto">Crypto</SelectItem>
                                        <SelectItem value="Gambling">Gambling</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Business Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="contact@yourcompany.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Business Phone *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={phone}
                                onChange={(e) => setPhoneState(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Business Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="123 Main St, Anytown, USA"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website URL *</Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>

                        <div className="glass-separator my-6" />

                        <button
                            type="submit"
                            className="glass-button-primary w-full px-6 py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Developer Account..." : "Create Developer Account"}
                        </button>

                        <div className="text-center mt-6">
                            <span className="text-sm text-muted-foreground">
                                Looking to sell products instead?{" "}
                                <Link href="/auth/business-register" className="text-primary hover:underline">
                                    Create a business account
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
