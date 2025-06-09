"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginMerchant, getMerchantProfile, type MerchantLoginData } from "@/lib/auth/merchant-api"
import { useMerchantAuth } from "@/contexts/merchant-auth-context"
import { Building2, User, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

export function MerchantLoginForm() {
    const [formData, setFormData] = useState<MerchantLoginData>({
        username: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { login } = useMerchantAuth()

    const handleInputChange = (field: keyof MerchantLoginData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.username.trim()) {
            setError("Username is required")
            return
        }

        if (!formData.password) {
            setError("Password is required")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await loginMerchant(formData)

            // Get merchant profile
            const merchantProfile = await getMerchantProfile(response.access_token)

            // Use the auth context to store login state
            login(response.access_token, merchantProfile)

            // Redirect to merchant dashboard
            router.push("/dashboard/store")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Business Login
                </CardTitle>
                <CardDescription>
                    Sign in to your merchant account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="pl-10"
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="/auth/merchant-forgot-password" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                        <div className="flex gap-2">
                            <Link href="/auth/merchant-api-key-reset" className="text-primary hover:underline">
                                Reset API Key
                            </Link>
                            <span className="text-muted-foreground">|</span>
                            <Link href="/auth/merchant-client-id-reset" className="text-primary hover:underline">
                                Reset Client ID
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have a business account? </span>
                        <Link href="/auth/business-register" className="text-primary hover:underline">
                            Register your business
                        </Link>
                    </div>

                    <div className="text-center">
                        <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
                            Personal account? Sign in here
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export { MerchantLoginForm }
