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

export function MerchantClientIdResetForm() {
    const [formData, setFormData] = useState({
        current_password: "",
    })
    const [newClientId, setNewClientId] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { token, isAuthenticated, isMerchant } = useAuth()
    const { toast } = useToast()

    // Redirect if not authenticated or not a merchant
    if (!isAuthenticated) {
        router.push('/auth/login?redirect=merchant-client-id-reset')
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

    const handleSubmit = async (e: React.FormEvent) => {
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
            // Import authAPI from the unified auth system
            const { authAPI } = await import('@/lib/auth/api')
            const response = await authAPI.resetClientId(token, formData.current_password)
            setNewClientId(response.client_id)
            setSuccess(true)

            toast({
                title: "Client ID Reset Successful",
                description: "Your new client ID has been generated.",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Client ID reset failed")
        } finally {
            setLoading(false)
        }
    }

    const copyClientId = () => {
        navigator.clipboard.writeText(newClientId)
        toast({
            title: "Copied!",
            description: "Client ID copied to clipboard",
        })
    }

    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                        <h3 className="text-lg font-semibold">Client ID Reset Successful</h3>
                        <p className="text-muted-foreground">
                            Your new client ID has been generated. Please copy and store it securely.
                        </p>
                        <div className="bg-muted p-4 rounded-md">
                            <div className="flex items-center justify-between">
                                <code className="text-sm font-mono break-all">{newClientId}</code>
                                <Button variant="ghost" size="icon" onClick={copyClientId}>
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

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Reset Client ID
                </CardTitle>
                <CardDescription>
                    Generate a new client ID for your merchant account
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
                            <strong>Warning:</strong> Resetting your client ID will invalidate the current ID.
                            Update your applications with the new client ID immediately.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Resetting Client ID..." : "Reset Client ID"}
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
