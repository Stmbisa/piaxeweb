"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { resetMerchantPin } from "@/lib/auth/merchant-api"
import { useAuth } from "@/lib/auth/context"

export function MerchantPinResetForm() {
    const [formData, setFormData] = useState({
        current_password: "",
        new_pin: "",
        confirm_pin: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { user, isBusiness } = useAuth()

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.current_password) {
            setError("Current password is required")
            return
        }

        if (!formData.new_pin) {
            setError("New PIN is required")
            return
        }

        if (formData.new_pin.length !== 4 || !/^\d{4}$/.test(formData.new_pin)) {
            setError("PIN must be exactly 4 digits")
            return
        }

        if (formData.new_pin !== formData.confirm_pin) {
            setError("PIN confirmation does not match")
            return
        }

        setLoading(true)
        setError("")

        try {
            if (!token) {
                setError("Authentication required. Please login first.")
                return
            }

            const response = await resetMerchantPin(formData, token)

            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/auth/merchant-login?message=PIN reset successful! Please login to continue.")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "PIN reset failed")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                        <h3 className="text-lg font-semibold">PIN Reset Successful</h3>
                        <p className="text-muted-foreground">
                            Your business PIN has been reset successfully. You will be redirected to login.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Reset Business PIN
                </CardTitle>
                <CardDescription>
                    Reset your 4-digit PIN for secure transactions
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
                        <Label htmlFor="current_password">Current Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="current_password"
                                type="password"
                                placeholder="Enter your current password"
                                className="pl-10"
                                value={formData.current_password}
                                onChange={(e) => handleInputChange("current_password", e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Enter your account password for security verification
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_pin">New PIN</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="new_pin"
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                className="pl-10"
                                maxLength={4}
                                value={formData.new_pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '') // Only allow digits
                                    handleInputChange("new_pin", value)
                                }}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Choose a 4-digit PIN that you can remember easily
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_pin">Confirm New PIN</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="confirm_pin"
                                type="password"
                                placeholder="Re-enter 4-digit PIN"
                                className="pl-10"
                                maxLength={4}
                                value={formData.confirm_pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '') // Only allow digits
                                    handleInputChange("confirm_pin", value)
                                }}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Resetting PIN..." : "Reset PIN"}
                    </Button>

                    <div className="text-center text-sm">
                        <Link href="/auth/merchant-login" className="text-primary hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
