"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Key, AlertCircle, CheckCircle2, Copy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/context"
import { useToast } from "@/hooks/use-toast"
import { authAPI } from "@/lib/auth/api"

export function MerchantApiKeyResetForm() {
    const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request')
    const [formData, setFormData] = useState({
        current_password: "",
        confirmation_code: "",
    })
    const [requestId, setRequestId] = useState("")
    const [newApiKey, setNewApiKey] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { token, isAuthenticated, isMerchant } = useAuth()
    const { toast } = useToast()

    // Redirect if not authenticated or not a merchant
    if (!isAuthenticated) {
        router.push('/auth/login?redirect=merchant-api-key-reset')
        return null
    }

    if (!isMerchant) {
        router.push('/auth/merchant-register')
        return null
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError("")
    }

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.current_password) {
            setError("Current password is required")
            return
        }

        if (!token) {
            setError("Authentication required. Please login first.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await authAPI.resetMerchantApiKey(token)
            setRequestId(response.request_id)
            setStep('confirm')
            toast({
                title: "Reset Request Sent",
                description: "A confirmation code has been sent to your registered email.",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "API key reset request failed")
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.confirmation_code) {
            setError("Confirmation code is required")
            return
        }

        if (!token || !requestId) {
            setError("Invalid request. Please start over.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await authAPI.confirmApiKeyReset(token, requestId, formData.confirmation_code)
            setNewApiKey(response.api_key)
            setStep('success')
            toast({
                title: "API Key Reset Successful",
                description: "Your new API key has been generated.",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "API key reset confirmation failed")
        } finally {
            setLoading(false)
        }
    }

    const copyApiKey = () => {
        navigator.clipboard.writeText(newApiKey)
        toast({
            title: "Copied!",
            description: "API key copied to clipboard",
        })
    }

    if (step === 'success') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                        <h3 className="text-lg font-semibold">API Key Reset Successful</h3>
                        <p className="text-muted-foreground">
                            Your new API key has been generated. Please copy and store it securely.
                        </p>
                        <div className="bg-muted p-4 rounded-md">
                            <div className="flex items-center justify-between">
                                <code className="text-sm font-mono break-all">{newApiKey}</code>
                                <Button variant="ghost" size="icon" onClick={copyApiKey}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Button asChild className="w-full">
                                <Link href="/dashboard/store">Go to Dashboard</Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/developers">View API Documentation</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (step === 'confirm') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        Confirm API Key Reset
                    </CardTitle>
                    <CardDescription>
                        Enter the confirmation code sent to your email
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="confirmation_code">Confirmation Code</Label>
                            <Input
                                id="confirmation_code"
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={formData.confirmation_code}
                                onChange={(e) => handleInputChange("confirmation_code", e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Check your email for the confirmation code
                            </p>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Confirming..." : "Confirm Reset"}
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('request')}
                                className="text-primary hover:underline"
                            >
                                Back to request
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Reset API Key
                </CardTitle>
                <CardDescription>
                    Generate a new API key for your merchant account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleRequestReset} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-800">
                            <strong>Warning:</strong> Resetting your API key will invalidate the current key.
                            Update your applications with the new key immediately.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Requesting Reset..." : "Request API Key Reset"}
                    </Button>

                    <div className="text-center text-sm">
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
