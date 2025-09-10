"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    CreditCard,
    Smartphone,
    Building2,
    QrCode,
    Shield,
    Globe,
    Check,
    Settings,
    AlertCircle,
    Copy,
    Eye,
    EyeOff
} from 'lucide-react'

interface PaymentMethod {
    id: string
    name: string
    type: 'mobile_money' | 'bank' | 'card' | 'crypto'
    status: 'active' | 'inactive' | 'pending'
    fees: number
    currency: string
    icon: string
}

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: '1',
        name: 'MTN Mobile Money',
        type: 'mobile_money',
        status: 'active',
        fees: 1.5,
        currency: 'UGX',
        icon: 'smartphone'
    },
    {
        id: '2',
        name: 'Airtel Money',
        type: 'mobile_money',
        status: 'active',
        fees: 1.8,
        currency: 'UGX',
        icon: 'smartphone'
    },
    {
        id: '3',
        name: 'Stanbic Bank',
        type: 'bank',
        status: 'active',
        fees: 2.0,
        currency: 'UGX',
        icon: 'building2'
    },
    {
        id: '4',
        name: 'Visa/Mastercard',
        type: 'card',
        status: 'inactive',
        fees: 3.5,
        currency: 'USD',
        icon: 'creditcard'
    }
]

export function PaymentSettings() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
    const [showApiKey, setShowApiKey] = useState(false)
    const [autoAccept, setAutoAccept] = useState(true)
    const [escrowEnabled, setEscrowEnabled] = useState(true)
    const [posMode, setPosMode] = useState(false)

    const apiKey = "pk_live_51H2J3KLmNoPQrSt2K3L4mN5oPQrSt6K7L8mN9oPQrSt0K1L2mN3oPQrSt4K5L6"
    const webhookUrl = "https://api.piaxe.me/webhooks/payments"

    const getStatusColor = (status: PaymentMethod['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'inactive':
                return 'bg-gray-100 text-gray-700 border-gray-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getTypeIcon = (type: PaymentMethod['type']) => {
        switch (type) {
            case 'mobile_money':
                return <Smartphone className="w-5 h-5" />
            case 'bank':
                return <Building2 className="w-5 h-5" />
            case 'card':
                return <CreditCard className="w-5 h-5" />
            case 'crypto':
                return <Globe className="w-5 h-5" />
            default:
                return <CreditCard className="w-5 h-5" />
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // You could add a toast notification here
    }

    return (
        <div className="space-y-6">
            {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Methods</p>
                                <p className="text-2xl font-bold">{paymentMethods.filter(m => m.status === 'active').length}</p>
                            </div>
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Transaction Fee</p>
                                <p className="text-2xl font-bold">
                                    {(paymentMethods.filter(m => m.status === 'active').reduce((sum, m) => sum + m.fees, 0) /
                                        paymentMethods.filter(m => m.status === 'active').length).toFixed(1)}%
                                </p>
                            </div>
                            <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Security Status</p>
                                <p className="text-2xl font-bold text-green-600">Secure</p>
                            </div>
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Settings Tabs */}
            <Tabs defaultValue="methods" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                    <TabsTrigger value="settings">General Settings</TabsTrigger>
                    <TabsTrigger value="api">API & Webhooks</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="methods" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>
                                Configure the payment methods available to your customers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                {getTypeIcon(method.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{method.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {method.fees}% transaction fee • {method.currency}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Badge className={getStatusColor(method.status)}>
                                                {method.status}
                                            </Badge>
                                            <Switch
                                                checked={method.status === 'active'}
                                                onCheckedChange={(checked) => {
                                                    setPaymentMethods(methods =>
                                                        methods.map(m =>
                                                            m.id === method.id
                                                                ? { ...m, status: checked ? 'active' : 'inactive' }
                                                                : m
                                                        )
                                                    )
                                                }}
                                            />
                                            <Button variant="ghost" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 mb-1">Add More Payment Methods</h4>
                                        <p className="text-sm text-blue-700 mb-3">
                                            Increase your conversion rate by offering more payment options to your customers.
                                        </p>
                                        <Button size="sm" variant="outline">
                                            Add Payment Method
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Payment Settings</CardTitle>
                            <CardDescription>
                                Configure how payments are processed in your store
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Auto-accept payments</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically accept confirmed payments without manual review
                                    </p>
                                </div>
                                <Switch
                                    checked={autoAccept}
                                    onCheckedChange={setAutoAccept}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Enable escrow protection</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Hold payments in escrow until order fulfillment is confirmed
                                    </p>
                                </div>
                                <Switch
                                    checked={escrowEnabled}
                                    onCheckedChange={setEscrowEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">POS-free mode</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Allow customers to pay by scanning QR codes without POS terminal
                                    </p>
                                </div>
                                <Switch
                                    checked={posMode}
                                    onCheckedChange={setPosMode}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="currency">Default Currency</Label>
                                <Input id="currency" value="UGX - Ugandan Shilling" readOnly />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="timeout">Payment Timeout (minutes)</Label>
                                <Input id="timeout" type="number" defaultValue="15" />
                                <p className="text-sm text-muted-foreground">
                                    How long to wait for payment confirmation before timing out
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Configuration</CardTitle>
                            <CardDescription>
                                Integrate piaxis payments into your applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="api-key">API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="api-key"
                                        type={showApiKey ? "text" : "password"}
                                        value={apiKey}
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(apiKey)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Use this key to authenticate API requests from your applications
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="webhook-url">Webhook URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="webhook-url"
                                        value={webhookUrl}
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(webhookUrl)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We'll send payment notifications to this URL
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 border rounded-lg">
                                <h4 className="font-semibold mb-2">API Documentation</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Learn how to integrate piaxis payments into your applications
                                </p>
                                <Button variant="outline" size="sm">
                                    View API Docs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Protect your store and customer payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-900">SSL Certificate</span>
                                    </div>
                                    <p className="text-sm text-green-700">Active and valid</p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <QrCode className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold text-blue-900">Payment QR Codes</span>
                                    </div>
                                    <p className="text-sm text-blue-700">Encrypted and secure</p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="w-5 h-5 text-purple-600" />
                                        <span className="font-semibold text-purple-900">Bank Integration</span>
                                    </div>
                                    <p className="text-sm text-purple-700">PCI DSS compliant</p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-5 h-5 text-orange-600" />
                                        <span className="font-semibold text-orange-900">Fraud Protection</span>
                                    </div>
                                    <p className="text-sm text-orange-700">AI-powered monitoring</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold">Security Actions</h4>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Generate New API Key
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Security Logs
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configure 2FA
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-green-900 mb-1">Security Status: Excellent</h4>
                                        <p className="text-sm text-green-700">
                                            Your payment system is secure and compliant with industry standards.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
