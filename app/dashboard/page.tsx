import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Piaxe',
    description: 'Manage your Piaxe account, payments, and transactions.',
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Welcome to your Dashboard
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Manage your payments, transactions, and account settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-background rounded-2xl p-6 shadow-sm border">
                            <h3 className="font-semibold mb-2">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Common tasks and shortcuts
                            </p>
                            <div className="space-y-2">
                                <button className="w-full text-left p-2 rounded-lg hover:bg-muted/50 text-sm">
                                    Send Payment
                                </button>
                                <button className="w-full text-left p-2 rounded-lg hover:bg-muted/50 text-sm">
                                    Request Payment
                                </button>
                                <button className="w-full text-left p-2 rounded-lg hover:bg-muted/50 text-sm">
                                    View Transaction History
                                </button>
                                <a
                                    href="/dashboard/store"
                                    className="block w-full text-left p-2 rounded-lg hover:bg-muted/50 text-sm text-primary hover:text-primary/90"
                                >
                                    Manage Store →
                                </a>
                            </div>
                        </div>

                        <div className="bg-background rounded-2xl p-6 shadow-sm border">
                            <h3 className="font-semibold mb-2">Account Balance</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your current balance and recent activity
                            </p>
                            <div className="text-2xl font-bold text-primary mb-2">
                                UGX 0.00
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last updated: Just now
                            </p>
                        </div>

                        <div className="bg-background rounded-2xl p-6 shadow-sm border">
                            <h3 className="font-semibold mb-2">Recent Transactions</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your latest payment activity
                            </p>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No transactions yet</p>
                                <p className="text-xs">Start by making your first payment</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-background rounded-2xl p-8 shadow-sm border">
                        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">Verify Your Account</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Complete your account verification to unlock all features
                                </p>
                                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
                                    Start Verification
                                </button>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Add Payment Method</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Connect your bank account or mobile money wallet
                                </p>
                                <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm hover:bg-secondary/90">
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
