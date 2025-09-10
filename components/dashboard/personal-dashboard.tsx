"use client"

import { useAuth } from "@/lib/auth/context"
import { useWallets, useTransactions, useBalance } from "@/lib/hooks/useWallets"
import { useEffect, useState } from "react"
import { StoreSelectionDashboard } from "@/components/dashboard/store-selection-dashboard"
import { CombinedDashboard } from "@/components/dashboard/combined-dashboard"
import { Building2, Zap, RefreshCw, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Force dynamic rendering since this page uses client-side authentication
export const dynamic = 'force-dynamic'

export function PersonalDashboard() {
    const { isAuthenticated, isBusiness, hasStores, isLoading: authLoading, user } = useAuth()
    const [dashboardType, setDashboardType] = useState<"loading" | "personal" | "business" | "combined">("loading")
    const [mounted, setMounted] = useState(false)
    const [hasCheckedStores, setHasCheckedStores] = useState(false)

    // Hooks for wallet data - only if authenticated
    const { wallets, isLoading: walletsLoading, refetch: refetchWallets } = useWallets()
    const { balance: ugxBalance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance("UGX")
    const { transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useTransactions({
        limit: 5,
        offset: 0
    })

    // Ensure we're mounted on the client
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted || !isAuthenticated || authLoading || hasCheckedStores) return

        const determineDashboardType = async () => {
            // If user already has business profile or stores detected, show combined view
            if (isBusiness || hasStores) {
                setDashboardType("combined")
                setHasCheckedStores(true)
                return
            }

            // Check once if user has stores
            try {
                const { shoppingInventoryAPI } = await import('../../lib/api/shopping-inventory')
                const token = localStorage.getItem('piaxis_auth_token')
                if (token) {
                    const stores = await shoppingInventoryAPI.getStores(token)
                    if (stores.length > 0) {
                        setDashboardType("combined")
                    } else {
                        setDashboardType("personal")
                    }
                }
            } catch (error) {
                console.error('Error checking stores:', error)
                setDashboardType("personal")
            }
            setHasCheckedStores(true)
        }

        determineDashboardType()
    }, [mounted, isAuthenticated, isBusiness, hasStores, authLoading, hasCheckedStores])

    const handleRefreshData = async () => {
        await Promise.all([
            refetchWallets(),
            refetchBalance(),
            refetchTransactions()
        ])
    }

    // Show loading while mounting or determining dashboard type
    if (!mounted || dashboardType === "loading" || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
                <div className="glass-card text-center space-y-4 animate-glass-appear">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    // If not authenticated and not loading, let middleware handle redirect
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
                <div className="glass-card text-center space-y-4 animate-glass-appear">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Show combined dashboard for business users (wallets + stores)
    if (dashboardType === "combined") {
        return <CombinedDashboard />
    }

    // Calculate total balance across all wallets
    const totalBalance = wallets.reduce((sum: number, wallet: any) => {
        return sum + parseFloat(wallet.balance || "0")
    }, 0)

    // Get primary wallet (UGX wallet)
    const primaryWallet = wallets.find((w: any) => w.currency_code === "UGX")

    // Personal dashboard with real data
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
            {/* Background glass orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

            <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 animate-fade-in">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4 text-foreground">
                                Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
                            </h1>
                            <p className="text-sm sm:text-lg text-muted-foreground">Manage your payments, transactions, and account settings</p>
                        </div>
                        <button
                            onClick={handleRefreshData}
                            className="glass-icon-button mt-4 sm:mt-0"
                            disabled={walletsLoading || balanceLoading || transactionsLoading}
                        >
                            <RefreshCw className={`w-5 h-5 ${walletsLoading || balanceLoading || transactionsLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Balance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {/* Primary Balance */}
                        <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.1s" }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-primary-foreground/80">Primary Balance</h3>
                                <Wallet className="w-5 h-5 text-primary-foreground/60" />
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-primary-foreground">
                                    {balanceLoading ? (
                                        <div className="h-8 w-24 bg-primary-foreground/20 rounded animate-pulse"></div>
                                    ) : (
                                        `UGX ${parseFloat(ugxBalance).toLocaleString()}`
                                    )}
                                </div>
                                <p className="text-xs text-primary-foreground/70">Ugandan Shillings</p>
                            </div>
                        </div>

                        {/* Total Wallets */}
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.2s" }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Active Wallets</h3>
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-foreground">
                                    {walletsLoading ? (
                                        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                                    ) : (
                                        wallets.length
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Different currencies</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card animate-glass-appear md:col-span-2 relative z-10" style={{ animationDelay: "0.3s" }}>
                            <h3 className="font-semibold mb-4 text-foreground">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="glass-button-primary text-primary-foreground flex items-center justify-center gap-2 py-3 relative z-20">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span className="text-sm">Send</span>
                                </button>
                                <button className="glass-button-secondary text-secondary-foreground flex items-center justify-center gap-2 py-3 relative z-20">
                                    <ArrowDownLeft className="w-4 h-4" />
                                    <span className="text-sm">Request</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Wallets List */}
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                            <h3 className="font-semibold mb-4 text-foreground">Your Wallets</h3>
                            {walletsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg animate-pulse">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-muted rounded-full"></div>
                                                <div className="space-y-1">
                                                    <div className="h-4 w-16 bg-muted rounded"></div>
                                                    <div className="h-3 w-12 bg-muted rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-4 w-20 bg-muted rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : wallets.length > 0 ? (
                                <div className="space-y-3">
                                    {wallets.map((wallet: any) => (
                                        <div key={wallet.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-semibold text-primary">
                                                        {wallet.currency_symbol}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{wallet.currency_code}</p>
                                                    <p className="text-xs text-muted-foreground">{wallet.currency_name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {wallet.currency_symbol} {parseFloat(wallet.balance).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No wallets found</p>
                                    <p className="text-xs">Wallets will appear here once created</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.5s" }}>
                            <h3 className="font-semibold mb-4 text-foreground">Recent Transactions</h3>
                            {transactionsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg animate-pulse">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-muted rounded-full"></div>
                                                <div className="space-y-1">
                                                    <div className="h-4 w-24 bg-muted rounded"></div>
                                                    <div className="h-3 w-16 bg-muted rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-4 w-16 bg-muted rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {transactions.map((transaction: any) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.transaction_type === 'deposit' ? 'bg-green-500/10' :
                                                        transaction.transaction_type === 'withdrawal' ? 'bg-red-500/10' :
                                                            'bg-blue-500/10'
                                                    }`}>
                                                    {transaction.transaction_type === 'deposit' ? (
                                                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                                                    ) : transaction.transaction_type === 'withdrawal' ? (
                                                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                                                    ) : (
                                                        <RefreshCw className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground capitalize">
                                                        {transaction.transaction_type}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-semibold ${transaction.transaction_type === 'deposit' ? 'text-green-600' :
                                                        transaction.transaction_type === 'withdrawal' ? 'text-red-600' :
                                                            'text-foreground'
                                                    }`}>
                                                    {transaction.transaction_type === 'deposit' ? '+' :
                                                        transaction.transaction_type === 'withdrawal' ? '-' : ''}
                                                    {transaction.currency} {parseFloat(transaction.amount).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {transaction.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No transactions yet</p>
                                    <p className="text-xs">Start by making your first payment</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Business Features Section */}
                    <div className="mt-8 sm:mt-12 glass-card-large animate-glass-appear" style={{ animationDelay: "0.6s" }}>
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Upgrade Your Experience</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Business Account</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Access advanced features like store management, inventory tracking, and business analytics
                                </p>
                                <Link href="/auth/business-register">
                                    <button className="glass-button-primary text-primary-foreground hover:text-primary-foreground flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        Create Business Account
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Developer API</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Integrate piaxis's payment system into your applications with our developer API
                                </p>
                                <Link href="/auth/developer-register">
                                    <button className="glass-button-secondary text-secondary-foreground hover:text-secondary-foreground flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        Get API Access
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
