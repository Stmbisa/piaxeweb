"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
    const { token, isAuthenticated, isDeveloper } = useAuth()
    const { toast } = useToast()

    // Handle redirects in useEffect to prevent SSR issues
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=developer-api-key-reset')
            return
        }

        if (!isDeveloper) {
            router.push('/auth/developer-register')
            return
        }
    }, [isAuthenticated, isDeveloper, router])

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
            const response = await authAPI.resetDeveloperApiKey(token)
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
            const response = await authAPI.confirmDeveloperApiKeyReset(token, requestId, formData.confirmation_code)
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
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg p-4">
                <div className="glass-card-enhanced w-full max-w-md animate-glass-appear"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        padding: '24px'
                    }}>
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                        <h3 className="text-lg font-semibold text-white">API Key Reset Successful</h3>
                        <p className="text-gray-300">
                            Your new API key has been generated. Please copy and store it securely.
                        </p>
                        <div className="glass-card p-4"
                            style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px'
                            }}>
                            <div className="flex items-center justify-between">
                                <code className="text-sm font-mono break-all text-white">{newApiKey}</code>
                                <Button variant="ghost" size="icon" onClick={copyApiKey}
                                    className="hover:bg-white/10 text-white">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Button asChild className="glass-button-primary w-full">
                                <Link href="/developer/dashboard">Go to Dashboard</Link>
                            </Button>
                            <Button variant="outline" asChild className="glass-button-secondary w-full">
                                <Link href="/developers">View API Documentation</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'confirm') {
        return (
            <div className="min-h-screen flex items-center justify-center liquid-glass-bg p-4">
                <div className="glass-card-enhanced w-full max-w-md animate-glass-appear"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        padding: '24px'
                    }}>
                    <div className="text-center space-y-4 mb-6">
                        <Building2 className="w-12 h-12 mx-auto text-primary" />
                        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            Confirm API Key Reset
                        </h1>
                        <p className="text-gray-300">
                            Enter the confirmation code sent to your email
                        </p>
                    </div>

                    <form onSubmit={handleConfirmReset} className="space-y-4">
                        {error && (
                            <div className="glass-card flex items-center gap-2 p-3 text-sm text-red-400"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '8px'
                                }}>
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="confirmation_code" className="text-white">Confirmation Code</Label>
                            <Input
                                id="confirmation_code"
                                type="text"
                                placeholder="Enter 6-digit code"
                                className="glass-input"
                                value={formData.confirmation_code}
                                onChange={(e) => handleInputChange("confirmation_code", e.target.value)}
                                required
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                            <p className="text-xs text-gray-400">
                                Check your email for the confirmation code
                            </p>
                        </div>

                        <Button type="submit" disabled={loading} className="glass-button-primary w-full">
                            {loading ? "Confirming..." : "Confirm Reset"}
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('request')}
                                className="text-primary hover:underline hover:bg-white/10"
                            >
                                Back to request
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center liquid-glass-bg p-4">
            <div className="glass-card-enhanced w-full max-w-md animate-glass-appear"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    padding: '24px'
                }}>
                <div className="text-center space-y-4 mb-6">
                    <Building2 className="w-12 h-12 mx-auto text-primary" />
                    <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        Reset API Key
                    </h1>
                    <p className="text-gray-300">
                        Generate a new API key for your developer account
                    </p>
                </div>

                <form onSubmit={handleRequestReset} className="space-y-4">
                    {error && (
                        <div className="glass-card flex items-center gap-2 p-3 text-sm text-red-400"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px'
                            }}>
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="current_password" className="text-white">Current Password</Label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="current_password"
                                type="password"
                                placeholder="Enter your current password"
                                className="glass-input pl-10"
                                value={formData.current_password}
                                onChange={(e) => handleInputChange("current_password", e.target.value)}
                                required
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            Enter your account password for security verification
                        </p>
                    </div>

                    <div className="glass-card p-3"
                        style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            borderRadius: '8px'
                        }}>
                        <p className="text-sm text-yellow-300">
                            <strong>Warning:</strong> Resetting your API key will invalidate the current key.
                            Update your applications with the new key immediately.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="glass-button-primary w-full">
                        {loading ? "Requesting Reset..." : "Request API Key Reset"}
                    </Button>

                    <div className="text-center text-sm">
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
