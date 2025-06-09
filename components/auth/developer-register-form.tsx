"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <Code className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            You need to be logged in to create a developer account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/auth/login" passHref legacyBehavior>
                            <Button asChild className="w-full"><a href="/auth/login">Login to Continue</a></Button>
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

    if (currentSuccess && !isDeveloper) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <CardTitle className="text-green-600">Developer Account Created!</CardTitle>
                        <CardDescription>
                            {currentSuccess}
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
                    <Briefcase className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                    <CardTitle className="text-2xl font-bold">Register Your Business</CardTitle>
                    <CardDescription>
                        Provide your business details to become a Piaxe Developer and access our APIs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {currentError && (
                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{currentError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input id="businessName" name="business_name" type="text" placeholder="Your Company LLC" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Input id="businessType" name="business_type" type="text" placeholder="e.g., SaaS, E-commerce" value={businessType} onChange={(e) => setBusinessType(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Business Email *</Label>
                            <Input id="email" name="email" type="email" placeholder="contact@yourcompany.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Business Phone *</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhoneState(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Business Address *</Label>
                            <Input id="address" name="address" type="text" placeholder="123 Main St, Anytown, USA" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website URL *</Label>
                            <Input id="website" name="website" type="url" placeholder="https://yourcompany.com" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                        </div>

                        <Separator className="my-6" />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating Developer Account..." : "Create Developer Account"}
                        </Button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Looking to sell products instead?{" "}
                                <Link href="/auth/business-register" className="text-purple-600 hover:underline">
                                    Create a business account
                                </Link>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
