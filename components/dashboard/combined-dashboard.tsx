"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { useWallets, useTransactions, useBalance } from "@/lib/hooks/useWallets"
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory"
import { Building2, Zap, RefreshCw, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Store as StoreIcon, Package } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export function CombinedDashboard() {
    const { user, token } = useAuth()
    const router = useRouter()
    const [stores, setStores] = useState<Store[]>([])
    const [loadingStores, setLoadingStores] = useState(true)

    // Wallet data hooks with improved error handling
    const { wallets, totalBalance, isLoading: walletsLoading, error: walletsError, refetch: refetchWallets } = useWallets()
    const { transactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactions({
        limit: 3,
        offset: 0
    })

    useEffect(() => {
        loadStores()
    }, [token])

    const loadStores = async () => {
        if (!token) return

        try {
            setLoadingStores(true)
            const storesData = await shoppingInventoryAPI.getStores(token)
            setStores(storesData)
        } catch (error) {
            console.error('Error loading stores:', error)
        } finally {
            setLoadingStores(false)
        }
    }

    const handleRefreshData = async () => {
        await Promise.all([
            refetchWallets(),
            refetchTransactions(),
            loadStores()
        ])
    }

    // Get UGX wallet specifically
    const ugxWallet = wallets.find(w => w.currency_code === "UGX")
    const ugxBalance = ugxWallet?.balance || "0.00"

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
            {/* Background glass orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

            <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 animate-fade-in">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4 text-foreground">
                                Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
                            </h1>
                            <p className="text-sm sm:text-lg text-muted-foreground">Manage your wallets, transactions, and business operations</p>
                        </div>
                        <button
                            onClick={handleRefreshData}
                            className="glass-icon-button mt-4 sm:mt-0"
                            disabled={walletsLoading || transactionsLoading || loadingStores}
                        >
                            <RefreshCw className={`w-5 h-5 ${walletsLoading || transactionsLoading || loadingStores ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column - Wallets & Transactions */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Balance Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Primary Balance */}
                                <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.1s" }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-primary-foreground/80">Primary Balance</h3>
                                        <Wallet className="w-5 h-5 text-primary-foreground/60" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-primary-foreground">
                                            {walletsLoading ? (
                                                <div className="h-8 w-24 bg-primary-foreground/20 rounded animate-pulse"></div>
                                            ) : walletsError ? (
                                                <span className="text-red-300 text-sm">Error loading</span>
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

                                {/* Total Stores */}
                                <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.3s" }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-muted-foreground">Your Stores</h3>
                                        <StoreIcon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-foreground">
                                            {loadingStores ? (
                                                <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                                            ) : (
                                                stores.length
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Business locations</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                                <h3 className="font-semibold mb-4 text-foreground">Quick Actions</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button className="glass-button-primary text-primary-foreground flex items-center justify-center gap-2 py-3">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span className="text-sm">Send</span>
                                    </button>
                                    <button className="glass-button-secondary text-secondary-foreground flex items-center justify-center gap-2 py-3">
                                        <ArrowDownLeft className="w-4 h-4" />
                                        <span className="text-sm">Request</span>
                                    </button>
                                    <button
                                        className="glass-button-primary text-primary-foreground flex items-center justify-center gap-2 py-3"
                                        onClick={() => router.push('/business/onboard?step=store-setup')}
                                    >
                                        <StoreIcon className="w-4 h-4" />
                                        <span className="text-sm">Add Store</span>
                                    </button>
                                    <button className="glass-button-secondary text-secondary-foreground flex items-center justify-center gap-2 py-3">
                                        <Package className="w-4 h-4" />
                                        <span className="text-sm">Inventory</span>
                                    </button>
                                </div>
                            </div>

                            {/* Wallets & Transactions Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Wallets List */}
                                <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.5s" }}>
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
                                    ) : walletsError ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm text-red-500">Failed to load wallets</p>
                                            <button
                                                onClick={() => refetchWallets()}
                                                className="text-xs text-primary hover:underline mt-2"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : wallets.length > 0 ? (
                                        <div className="space-y-3">
                                            {wallets.slice(0, 4).map((wallet: any) => (
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
                                            {wallets.length > 4 && (
                                                <div className="text-center pt-2">
                                                    <span className="text-sm text-muted-foreground">+{wallets.length - 4} more wallets</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No wallets found</p>
                                        </div>
                                    )}
                                </div>

                                {/* Recent Transactions */}
                                <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.6s" }}>
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
                                    ) : transactionsError ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm text-red-500">Failed to load transactions</p>
                                            <button
                                                onClick={() => refetchTransactions()}
                                                className="text-xs text-primary hover:underline mt-2"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : transactions.length > 0 ? (
                                        <div className="space-y-3">
                                            {transactions.map((transaction: any) => (
                                                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/10 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            transaction.transaction_type === 'deposit' ? 'bg-green-500/10' :
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
                                                        <p className={`text-sm font-semibold ${
                                                            transaction.transaction_type === 'deposit' ? 'text-green-600' :
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stores */}
                        <div className="space-y-6">
                            {/* Your Stores */}
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.7s" }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-foreground">Your Stores</h3>
                                    <Link href="/business/dashboard/stores">
                                        <button className="text-sm text-primary hover:underline">View All</button>
                                    </Link>
                                </div>
                                {loadingStores ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="p-4 bg-muted/20 rounded-lg animate-pulse">
                                                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                                                <div className="h-3 w-32 bg-muted rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : stores.length > 0 ? (
                                    <div className="space-y-3">
                                        {stores.slice(0, 3).map((store) => (
                                            <div
                                                key={store.id}
                                                className="p-4 rounded-lg border border-border/20 hover:bg-muted/10 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/dashboard/store?id=${store.id}`)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-foreground">{store.name}</h4>
                                                    <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full">
                                                        Active
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {store.description || "No description"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {store.address}
                                                </p>
                                            </div>
                                        ))}
                                        {stores.length > 3 && (
                                            <div className="text-center pt-2">
                                                <span className="text-sm text-muted-foreground">+{stores.length - 3} more stores</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <StoreIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">No stores yet</p>
                                        <button
                                            className="text-sm text-primary hover:underline mt-2"
                                            onClick={() => router.push('/business/onboard?step=store-setup')}
                                        >
                                            Create your first store
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Business Features */}
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.8s" }}>
                                <h3 className="font-semibold mb-4 text-foreground">Business Tools</h3>
                                <div className="space-y-3">
                                    <Link href="/business/dashboard">
                                        <button className="glass-button w-full text-foreground hover:bg-muted/20 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Business Dashboard
                                        </button>
                                    </Link>
                                    <Link href="/auth/developer-register">
                                        <button className="glass-button w-full text-foreground hover:bg-muted/20 flex items-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Developer API
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
