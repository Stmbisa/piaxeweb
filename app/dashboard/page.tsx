"use client"

import { useAuth } from "@/lib/auth/context"
import { useEffect, useState } from "react"
import { StoreSelectionDashboard } from "@/components/dashboard/store-selection-dashboard"
import { Building2, Zap } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering since this page uses client-side authentication
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    const { isAuthenticated, isBusiness, hasStores, isLoading, checkStores } = useAuth()
    const [dashboardType, setDashboardType] = useState<"loading" | "personal" | "business" | "no-stores">("loading")
    const [mounted, setMounted] = useState(false)

    // Ensure we're mounted on the client
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const determineDashboardType = async () => {
            if (isLoading) return

            if (!isAuthenticated) {
                setDashboardType("personal")
                return
            }

            if (isBusiness || hasStores) {
                setDashboardType("business")
                return
            }

            // Check if user has stores but hasn't been detected yet
            const userHasStores = await checkStores()
            if (userHasStores) {
                setDashboardType("business")
            } else {
                setDashboardType("personal")
            }
        }

        determineDashboardType()
    }, [mounted, isAuthenticated, isBusiness, hasStores, isLoading, checkStores])

    // Show loading while mounting or determining dashboard type
    if (!mounted || dashboardType === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (dashboardType === "business") {
        return <StoreSelectionDashboard />
    }

    // Personal dashboard with proper glass theme using your color scheme
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
            {/* Subtle background glass orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Welcome to your Dashboard</h1>
                        <p className="text-lg text-muted-foreground">Manage your payments, transactions, and account settings</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quick Actions Card */}
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.1s" }}>
                            <h3 className="font-semibold mb-2 text-foreground">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground mb-4">Common tasks and shortcuts</p>
                            <div className="space-y-2">
                                <button className="glass-button text-foreground hover:text-foreground">Send Payment</button>
                                <button className="glass-button text-foreground hover:text-foreground">Request Payment</button>
                                <button className="glass-button text-foreground hover:text-foreground">View Transaction History</button>
                                <a
                                    href="/dashboard/store"
                                    className="glass-button glass-button-primary text-primary-foreground hover:text-primary-foreground"
                                >
                                    Manage Store →
                                </a>
                            </div>
                        </div>

                        {/* Business Features Card */}
                        <div className="glass-card glass-card-primary animate-glass-appear" style={{ animationDelay: "0.2s" }}>
                            <h3 className="font-semibold mb-2 text-foreground">Business Features</h3>
                            <p className="text-sm text-muted-foreground mb-4">Upgrade to business features</p>
                            <div className="space-y-2">
                                <Link
                                    href="/auth/business-register"
                                    className="glass-button glass-button-primary flex items-center justify-center text-primary-foreground hover:text-primary-foreground"
                                >
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Create Business Account
                                </Link>
                                <Link
                                    href="/auth/developer-register"
                                    className="glass-button flex items-center justify-center text-foreground hover:text-foreground"
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Developer API Access
                                </Link>
                            </div>
                        </div>

                        {/* Account Balance Card */}
                        <div className="glass-card glass-card-secondary animate-glass-appear" style={{ animationDelay: "0.3s" }}>
                            <h3 className="font-semibold mb-2 text-foreground">Account Balance</h3>
                            <p className="text-sm text-muted-foreground mb-4">Your current balance and recent activity</p>
                            <div className="text-2xl font-bold text-primary mb-2 animate-glass-shimmer">UGX 0.00</div>
                            <p className="text-xs text-muted-foreground">Last updated: Just now</p>
                        </div>

                        {/* Recent Transactions Card */}
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                            <h3 className="font-semibold mb-2 text-foreground">Recent Transactions</h3>
                            <p className="text-sm text-muted-foreground mb-4">Your latest payment activity</p>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No transactions yet</p>
                                <p className="text-xs">Start by making your first payment</p>
                            </div>
                        </div>
                    </div>

                    {/* Getting Started Section */}
                    <div className="mt-12 glass-card-large animate-glass-appear" style={{ animationDelay: "0.5s" }}>
                        <h2 className="text-2xl font-bold mb-4 text-foreground">Getting Started</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Verify Your Account</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Complete your account verification to unlock all features
                                </p>
                                <button className="glass-button glass-button-primary text-primary-foreground hover:text-primary-foreground">
                                    Start Verification
                                </button>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Add Payment Method</h3>
                                <p className="text-sm text-muted-foreground mb-4">Connect your bank account or mobile money wallet</p>
                                <button className="glass-button glass-button-secondary text-secondary-foreground hover:text-secondary-foreground">
                                    Add Payment Method
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
