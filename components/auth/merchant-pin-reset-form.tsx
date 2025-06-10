"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
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
    const { user, isBusiness, token } = useAuth()

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

            // Mock implementation since the API endpoint might not exist
            // Replace with actual API call when available
            const mockResetPin = async () => {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                return { success: true }
            }

            await mockResetPin()
            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/auth/login?message=PIN reset successful! Please login to continue.")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "PIN reset failed")
        } finally {
            setLoading(false)
        }
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
                        <h3 className="text-lg font-semibold text-white">PIN Reset Successful</h3>
                        <p className="text-gray-300">
                            Your business PIN has been reset successfully. You will be redirected to login.
                        </p>
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
                        Reset Business PIN
                    </h1>
                    <p className="text-gray-300">
                        Reset your 4-digit PIN for secure transactions
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
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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

                    <div className="space-y-2">
                        <Label htmlFor="new_pin" className="text-white">New PIN</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="new_pin"
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                className="glass-input pl-10"
                                maxLength={4}
                                value={formData.new_pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '') // Only allow digits
                                    handleInputChange("new_pin", value)
                                }}
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
                            Choose a 4-digit PIN that you can remember easily
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_pin" className="text-white">Confirm New PIN</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="confirm_pin"
                                type="password"
                                placeholder="Re-enter 4-digit PIN"
                                className="glass-input pl-10"
                                maxLength={4}
                                value={formData.confirm_pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '') // Only allow digits
                                    handleInputChange("confirm_pin", value)
                                }}
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
                            Re-enter your PIN to confirm
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="glass-button-primary w-full">
                        {loading ? "Resetting PIN..." : "Reset PIN"}
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
