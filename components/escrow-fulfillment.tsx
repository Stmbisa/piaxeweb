"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
    Shield,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Package,
    Eye,
    MessageSquare,
    RefreshCw,
    Upload,
    FileText
} from 'lucide-react'

interface EscrowTransaction {
    id: string
    buyerPhone: string
    sellerName: string
    amount: number
    description: string
    status: 'pending_payment' | 'payment_confirmed' | 'item_shipped' | 'delivered' | 'completed' | 'disputed'
    createdAt: string
    updatedAt: string
    escrowFee: number
    deliveryProof?: string[]
    buyerConfirmed: boolean
    sellerConfirmed: boolean
    autoReleaseDate: string
}

const mockEscrowTransactions: EscrowTransaction[] = [
    {
        id: 'ESC-001',
        buyerPhone: '+256701234567',
        sellerName: 'Sarah\'s Electronics Store',
        amount: 450000,
        description: 'Samsung Galaxy A54 - Brand new with warranty',
        status: 'payment_confirmed',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        escrowFee: 9000,
        buyerConfirmed: false,
        sellerConfirmed: true,
        autoReleaseDate: '2024-01-22T11:45:00Z'
    },
    {
        id: 'ESC-002',
        buyerPhone: '+256702345678',
        sellerName: 'John\'s Coffee Shop',
        amount: 75000,
        description: 'Premium Ugandan Coffee Beans (2kg)',
        status: 'item_shipped',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        escrowFee: 1500,
        deliveryProof: ['proof-image-1.jpg', 'proof-image-2.jpg'],
        buyerConfirmed: false,
        sellerConfirmed: true,
        autoReleaseDate: '2024-01-23T09:15:00Z'
    },
    {
        id: 'ESC-003',
        buyerPhone: '+256703456789',
        sellerName: 'Grace\'s Fashion Boutique',
        amount: 120000,
        description: 'Ankara Dress - Custom tailored',
        status: 'completed',
        createdAt: '2024-01-10T16:45:00Z',
        updatedAt: '2024-01-18T13:20:00Z',
        escrowFee: 2400,
        buyerConfirmed: true,
        sellerConfirmed: true,
        autoReleaseDate: '2024-01-18T13:20:00Z'
    }
]

export function EscrowFulfillment() {
    const [transactions, setTransactions] = useState<EscrowTransaction[]>(mockEscrowTransactions)
    const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

    const getStatusColor = (status: EscrowTransaction['status']) => {
        switch (status) {
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'payment_confirmed':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'item_shipped':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'disputed':
                return 'bg-red-100 text-red-700 border-red-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStatusIcon = (status: EscrowTransaction['status']) => {
        switch (status) {
            case 'pending_payment':
                return <Clock className="w-4 h-4" />
            case 'payment_confirmed':
                return <CheckCircle2 className="w-4 h-4" />
            case 'item_shipped':
                return <Package className="w-4 h-4" />
            case 'delivered':
                return <CheckCircle2 className="w-4 h-4" />
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />
            case 'disputed':
                return <AlertCircle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const getProgressValue = (status: EscrowTransaction['status']) => {
        switch (status) {
            case 'pending_payment': return 20
            case 'payment_confirmed': return 40
            case 'item_shipped': return 70
            case 'delivered': return 90
            case 'completed': return 100
            case 'disputed': return 50
            default: return 0
        }
    }

    const formatStatus = (status: EscrowTransaction['status']) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-UG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const activeTransactions = transactions.filter(t =>
        ['pending_payment', 'payment_confirmed', 'item_shipped', 'delivered'].includes(t.status)
    ).length

    const completedTransactions = transactions.filter(t => t.status === 'completed').length
    const totalEscrowValue = transactions
        .filter(t => ['payment_confirmed', 'item_shipped', 'delivered'].includes(t.status))
        .reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="space-y-6">
            {/* Escrow Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Escrows</p>
                                <p className="text-2xl font-bold">{activeTransactions}</p>
                            </div>
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Value Secured</p>
                                <p className="text-2xl font-bold">UGX {totalEscrowValue.toLocaleString()}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* How Escrow Works */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        How Piaxe Escrow Protects Unregistered Users
                    </CardTitle>
                    <CardDescription>
                        Secure payments for buyers who don't have Piaxe accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-semibold mb-2">1. Buyer Pays via Phone</h4>
                            <p className="text-sm text-muted-foreground">
                                Unregistered buyers can pay using mobile money or bank transfer
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold mb-2">2. Funds Held Safely</h4>
                            <p className="text-sm text-muted-foreground">
                                Payment is secured in escrow until delivery is confirmed
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold mb-2">3. Seller Ships Item</h4>
                            <p className="text-sm text-muted-foreground">
                                Seller ships and provides delivery proof via SMS or photo
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold mb-2">4. Auto-Release</h4>
                            <p className="text-sm text-muted-foreground">
                                Funds release automatically after 7 days or buyer confirmation
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Escrow Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Escrow Transactions</CardTitle>
                    <CardDescription>
                        Monitor and manage escrow transactions for unregistered users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{transaction.id}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Buyer: {transaction.buyerPhone} • Seller: {transaction.sellerName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">UGX {transaction.amount.toLocaleString()}</p>
                                        <Badge className={getStatusColor(transaction.status)}>
                                            {getStatusIcon(transaction.status)}
                                            <span className="ml-1">{formatStatus(transaction.status)}</span>
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">{transaction.description}</p>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                        <span>Progress</span>
                                        <span>{getProgressValue(transaction.status)}% Complete</span>
                                    </div>
                                    <Progress value={getProgressValue(transaction.status)} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Created: {formatDate(transaction.createdAt)}</span>
                                        <span>Updated: {formatDate(transaction.updatedAt)}</span>
                                        {transaction.status !== 'completed' && (
                                            <span>Auto-release: {formatDate(transaction.autoReleaseDate)}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                        {transaction.status === 'item_shipped' && (
                                            <Button size="sm" variant="outline">
                                                Confirm Delivery
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {transaction.deliveryProof && transaction.deliveryProof.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm font-medium mb-2">Delivery Proof:</p>
                                        <div className="flex gap-2">
                                            {transaction.deliveryProof.map((proof, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{proof}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Create New Escrow */}
            <Card>
                <CardHeader>
                    <CardTitle>Create New Escrow Transaction</CardTitle>
                    <CardDescription>
                        Set up escrow protection for unregistered buyers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="buyer-phone">Buyer Phone Number</Label>
                                <Input id="buyer-phone" placeholder="+256701234567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Transaction Amount (UGX)</Label>
                                <Input id="amount" type="number" placeholder="100000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Item Description</Label>
                                <Textarea id="description" placeholder="Describe the item or service being sold..." />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Escrow Fee Breakdown</h4>
                                <div className="space-y-1 text-sm text-blue-700">
                                    <div className="flex justify-between">
                                        <span>Transaction Amount:</span>
                                        <span>UGX 100,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Escrow Fee (2%):</span>
                                        <span>UGX 2,000</span>
                                    </div>
                                    <div className="flex justify-between font-semibold border-t border-blue-300 pt-1">
                                        <span>Buyer Pays:</span>
                                        <span>UGX 102,000</span>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full">
                                Create Escrow Transaction
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
