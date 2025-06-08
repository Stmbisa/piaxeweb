"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Link,
    Share2,
    ShoppingCart,
    Copy,
    QrCode,
    Eye,
    Edit2,
    Trash2,
    Plus,
    DollarSign,
    Users,
    Calendar,
    CheckCircle2,
    Clock,
    TrendingUp
} from 'lucide-react'

interface PaymentLink {
    id: string
    title: string
    description: string
    amount: number
    currency: string
    url: string
    isActive: boolean
    expiresAt?: string
    allowCustomAmount: boolean
    collectShipping: boolean
    uses: number
    maxUses?: number
    createdAt: string
}

interface SharedCart {
    id: string
    name: string
    description: string
    items: Array<{
        id: string
        name: string
        price: number
        quantity: number
    }>
    totalAmount: number
    contributors: Array<{
        phone: string
        contribution: number
        status: 'pending' | 'paid'
    }>
    url: string
    isActive: boolean
    target: number
    expiresAt: string
    createdAt: string
}

const mockPaymentLinks: PaymentLink[] = [
    {
        id: 'PL-001',
        title: 'Premium Coffee Subscription',
        description: 'Monthly delivery of premium Ugandan coffee beans',
        amount: 75000,
        currency: 'UGX',
        url: 'https://pay.piaxe.com/link/coffee-subscription',
        isActive: true,
        allowCustomAmount: false,
        collectShipping: true,
        uses: 23,
        maxUses: 100,
        createdAt: '2024-01-10T09:00:00Z'
    },
    {
        id: 'PL-002',
        title: 'Donation for School Project',
        description: 'Help fund computer lab equipment for local school',
        amount: 0,
        currency: 'UGX',
        url: 'https://pay.piaxe.com/link/school-donation',
        isActive: true,
        allowCustomAmount: true,
        collectShipping: false,
        uses: 156,
        createdAt: '2024-01-05T14:30:00Z'
    },
    {
        id: 'PL-003',
        title: 'Event Ticket Sales',
        description: 'Kampala Tech Conference 2024 - Early Bird',
        amount: 150000,
        currency: 'UGX',
        url: 'https://pay.piaxe.com/link/tech-conference',
        isActive: false,
        expiresAt: '2024-02-01T23:59:59Z',
        allowCustomAmount: false,
        collectShipping: false,
        uses: 89,
        maxUses: 200,
        createdAt: '2023-12-20T10:00:00Z'
    }
]

const mockSharedCarts: SharedCart[] = [
    {
        id: 'SC-001',
        name: 'Office Lunch Order',
        description: 'Friday team lunch from Sarah\'s Kitchen',
        items: [
            { id: '1', name: 'Chicken Curry', price: 15000, quantity: 5 },
            { id: '2', name: 'Vegetable Rice', price: 8000, quantity: 5 },
            { id: '3', name: 'Fruit Juice', price: 3000, quantity: 5 }
        ],
        totalAmount: 130000,
        contributors: [
            { phone: '+256701234567', contribution: 26000, status: 'paid' },
            { phone: '+256702345678', contribution: 26000, status: 'paid' },
            { phone: '+256703456789', contribution: 26000, status: 'pending' },
            { phone: '+256704567890', contribution: 26000, status: 'pending' },
            { phone: '+256705678901', contribution: 26000, status: 'pending' }
        ],
        url: 'https://pay.piaxe.com/cart/office-lunch-friday',
        isActive: true,
        target: 130000,
        expiresAt: '2024-01-19T12:00:00Z',
        createdAt: '2024-01-17T08:30:00Z'
    },
    {
        id: 'SC-002',
        name: 'Birthday Gift Fund',
        description: 'Contribution for John\'s surprise birthday gift',
        items: [
            { id: '1', name: 'Bluetooth Speaker', price: 280000, quantity: 1 },
            { id: '2', name: 'Gift Wrapping', price: 20000, quantity: 1 }
        ],
        totalAmount: 300000,
        contributors: [
            { phone: '+256701234567', contribution: 50000, status: 'paid' },
            { phone: '+256702345678', contribution: 50000, status: 'paid' },
            { phone: '+256703456789', contribution: 50000, status: 'paid' },
            { phone: '+256704567890', contribution: 50000, status: 'pending' },
            { phone: '+256705678901', contribution: 50000, status: 'pending' },
            { phone: '+256706789012', contribution: 50000, status: 'pending' }
        ],
        url: 'https://pay.piaxe.com/cart/john-birthday-gift',
        isActive: true,
        target: 300000,
        expiresAt: '2024-01-25T18:00:00Z',
        createdAt: '2024-01-15T16:20:00Z'
    }
]

export function PaymentLinksSharedCarts() {
    const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(mockPaymentLinks)
    const [sharedCarts, setSharedCarts] = useState<SharedCart[]>(mockSharedCarts)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-UG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // You could add a toast notification here
    }

    const generateQRCode = (url: string) => {
        // This would generate a QR code for the URL
        console.log('Generate QR code for:', url)
    }

    const getContributionProgress = (cart: SharedCart) => {
        const collected = cart.contributors
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.contribution, 0)
        return (collected / cart.target) * 100
    }

    const getCollectedAmount = (cart: SharedCart) => {
        return cart.contributors
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.contribution, 0)
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Payment Links</p>
                                <p className="text-2xl font-bold">{paymentLinks.filter(l => l.isActive).length}</p>
                            </div>
                            <Link className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Shared Carts</p>
                                <p className="text-2xl font-bold">{sharedCarts.filter(c => c.isActive).length}</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Link Uses</p>
                                <p className="text-2xl font-bold">{paymentLinks.reduce((sum, l) => sum + l.uses, 0)}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cart Contributions</p>
                                <p className="text-2xl font-bold">
                                    {sharedCarts.reduce((sum, c) => sum + c.contributors.filter(contrib => contrib.status === 'paid').length, 0)}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="payment-links" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="payment-links">Payment Links</TabsTrigger>
                    <TabsTrigger value="shared-carts">Shared Carts</TabsTrigger>
                    <TabsTrigger value="create">Create New</TabsTrigger>
                </TabsList>

                <TabsContent value="payment-links" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Payment Links</h2>
                            <p className="text-muted-foreground">Share links to collect payments easily</p>
                        </div>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Payment Link
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {paymentLinks.map((link) => (
                            <Card key={link.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{link.title}</h3>
                                            <p className="text-sm text-muted-foreground">{link.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={link.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                                                {link.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {link.allowCustomAmount ? 'Any Amount' : `UGX ${link.amount.toLocaleString()}`}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{link.uses} uses</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Link className="w-4 h-4" />
                                            <span className="font-mono">{link.url}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(link.url)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => generateQRCode(link.url)}
                                            >
                                                <QrCode className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {link.maxUses && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span>Usage Progress</span>
                                                <span>{link.uses} / {link.maxUses}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min((link.uses / link.maxUses) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="shared-carts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Shared Carts</h2>
                            <p className="text-muted-foreground">Collaborative payment collections</p>
                        </div>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Shared Cart
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {sharedCarts.map((cart) => (
                            <Card key={cart.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{cart.name}</h3>
                                            <p className="text-sm text-muted-foreground">{cart.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">UGX {getCollectedAmount(cart).toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground">of {cart.target.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span>Collection Progress</span>
                                            <span>{Math.round(getContributionProgress(cart))}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(getContributionProgress(cart), 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Items ({cart.items.length})</h4>
                                            <div className="space-y-1">
                                                {cart.items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span>{item.name} (×{item.quantity})</span>
                                                        <span>UGX {(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                {cart.items.length > 3 && (
                                                    <p className="text-sm text-muted-foreground">+{cart.items.length - 3} more items</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Contributors ({cart.contributors.length})</h4>
                                            <div className="space-y-1">
                                                {cart.contributors.slice(0, 3).map((contributor, index) => (
                                                    <div key={index} className="flex justify-between items-center text-sm">
                                                        <span>{contributor.phone}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span>UGX {contributor.contribution.toLocaleString()}</span>
                                                            {contributor.status === 'paid' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <Clock className="w-4 h-4 text-yellow-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {cart.contributors.length > 3 && (
                                                    <p className="text-sm text-muted-foreground">+{cart.contributors.length - 3} more contributors</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>Expires: {formatDate(cart.expiresAt)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(cart.url)}
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Create Payment Link */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link className="w-5 h-5" />
                                    Create Payment Link
                                </CardTitle>
                                <CardDescription>
                                    Generate a shareable link to collect payments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="link-title">Title</Label>
                                    <Input id="link-title" placeholder="e.g., Product Sale, Service Payment" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link-description">Description</Label>
                                    <Textarea id="link-description" placeholder="Describe what this payment is for..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link-amount">Amount (UGX)</Label>
                                    <Input id="link-amount" type="number" placeholder="50000" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="custom-amount" />
                                    <Label htmlFor="custom-amount">Allow custom amount</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="collect-shipping" />
                                    <Label htmlFor="collect-shipping">Collect shipping info</Label>
                                </div>
                                <Button className="w-full">
                                    <Link className="w-4 h-4 mr-2" />
                                    Create Payment Link
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Create Shared Cart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Create Shared Cart
                                </CardTitle>
                                <CardDescription>
                                    Set up collaborative payment collection
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cart-name">Cart Name</Label>
                                    <Input id="cart-name" placeholder="e.g., Office Lunch, Group Gift" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cart-description">Description</Label>
                                    <Textarea id="cart-description" placeholder="What are you collecting money for?" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cart-target">Target Amount (UGX)</Label>
                                    <Input id="cart-target" type="number" placeholder="200000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cart-expires">Expires At</Label>
                                    <Input id="cart-expires" type="datetime-local" />
                                </div>
                                <Button className="w-full">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Create Shared Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
