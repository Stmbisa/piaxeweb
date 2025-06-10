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

export function MerchantClientIdResetForm() {
    const [formData, setFormData] = useState({
        current_password: "",
    })
    const [newClientId, setNewClientId] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { token, isAuthenticated, isDeveloper } = useAuth()
    const { toast } = useToast()

    // Handle redirects in useEffect to prevent SSR issues
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=developer-client-id-reset')
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
            const response = await authAPI.resetDeveloperClientId(token, formData.current_password)
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
                        <h3 className="text-lg font-semibold text-white">Client ID Reset Successful</h3>
                        <p className="text-gray-300">
                            Your new client ID has been generated. Please copy and store it securely.
                        </p>
                        <div className="glass-card p-4"
                             style={{
                                 background: 'rgba(0, 0, 0, 0.2)',
                                 border: '1px solid rgba(255, 255, 255, 0.1)',
                                 borderRadius: '8px'
                             }}>
                            <div className="flex items-center justify-between">
                                <code className="text-sm font-mono break-all text-white">{newClientId}</code>
                                <Button variant="ghost" size="icon" onClick={copyClientId}
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
                        Reset Client ID
                    </h1>
                    <p className="text-gray-300">
                        Generate a new client ID for your developer account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            <strong>Warning:</strong> Resetting your client ID will invalidate the current ID.
                            Update your applications with the new client ID immediately.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="glass-button-primary w-full">
                        {loading ? "Resetting..." : "Reset Client ID"}
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
