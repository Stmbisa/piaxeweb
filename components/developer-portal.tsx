"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Code,
  Key,
  Book,
  Terminal,
  Play,
  Copy,
  Check,
  Plus,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Shield,
  Download
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'active' | 'revoked'
  created: string
  lastUsed: string
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API',
    key: 'pk_live_abcd1234567890',
    permissions: ['payments', 'escrow', 'webhooks'],
    status: 'active',
    created: '2024-01-15',
    lastUsed: '2024-01-20'
  },
  {
    id: '2',
    name: 'Test Environment',
    key: 'pk_test_xyz9876543210',
    permissions: ['payments', 'testing'],
    status: 'active',
    created: '2024-01-10',
    lastUsed: '2024-01-19'
  }
]

const codeExamples = {
  payment: `// Initialize Payment
const payment = await piaxe.payments.create({
  amount: 50000,
  currency: 'UGX',
  reference: 'order_123',
  customer: {
    phone: '+256701234567',
    name: 'John Doe'
  },
  payment_method: 'mobile_money',
  description: 'Product purchase'
});

console.log(payment.payment_url);`,

  escrow: `// Create Escrow Transaction
const escrow = await piaxe.escrow.create({
  amount: 100000,
  currency: 'UGX',
  buyer_phone: '+256701234567',
  seller_id: 'seller_123',
  description: 'Laptop purchase',
  auto_release_days: 7
});

console.log(escrow.transaction_id);`,

  webhook: `// Webhook Handler
app.post('/webhooks/piaxe', (req, res) => {
  const signature = req.headers['piaxe-signature'];
  const payload = req.body;

  if (piaxe.webhooks.verify(payload, signature)) {
    const event = payload.event;

    switch(event.type) {
      case 'payment.completed':
        // Handle successful payment
        console.log('Payment completed:', event.data);
        break;
      case 'escrow.released':
        // Handle escrow release
        console.log('Escrow released:', event.data);
        break;
    }
  }

  res.status(200).send('OK');
});`
}

export function DeveloperPortal() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedExample, setSelectedExample] = useState<keyof typeof codeExamples>('payment')
  const [copied, setCopied] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(key.length - 12)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Developer Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Build powerful payment solutions with Piaxe API
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="examples">Code Examples</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,543</div>
                    <p className="text-xs text-muted-foreground">
                      +23% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <Check className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">99.2%</div>
                    <p className="text-xs text-muted-foreground">
                      Excellent performance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</div>
                    <p className="text-xs text-muted-foreground">
                      API keys in use
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Start */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>
                    Get started with Piaxe API in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Create API Key</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate your API keys from the API Keys tab
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">2. Install SDK</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        npm install piaxe-sdk
                      </code>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">3. Initialize Client</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure your API client with your keys
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">4. Make API Calls</h4>
                      <p className="text-sm text-muted-foreground">
                        Start accepting payments and managing escrow
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">API Keys</h2>
                  <p className="text-muted-foreground">Manage your API keys and permissions</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Key
                </Button>
              </div>

              <div className="grid gap-4">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{apiKey.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                              {apiKey.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Created: {apiKey.created}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Last used: {apiKey.lastUsed}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">API Key</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                              {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm">Permissions</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="outline">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      REST API
                    </CardTitle>
                    <CardDescription>
                      Complete REST API reference with all endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Authentication
                    </CardTitle>
                    <CardDescription>
                      Learn about API authentication and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      View Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Webhooks
                    </CardTitle>
                    <CardDescription>
                      Set up webhooks for real-time notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      View Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      SDKs
                    </CardTitle>
                    <CardDescription>
                      Official SDKs for popular programming languages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download SDKs
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Testing
                    </CardTitle>
                    <CardDescription>
                      Test mode and sandbox environment guide
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      View Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Examples
                    </CardTitle>
                    <CardDescription>
                      Code examples and integration tutorials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      View Examples
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Code Examples Tab */}
            <TabsContent value="examples" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Code Examples</h2>
                  <p className="text-muted-foreground">Ready-to-use code snippets</p>
                </div>
                <div className="flex gap-2">
                  {Object.keys(codeExamples).map((example) => (
                    <Button
                      key={example}
                      variant={selectedExample === example ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedExample(example as keyof typeof codeExamples)}
                    >
                      {example.charAt(0).toUpperCase() + example.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="capitalize">{selectedExample} Example</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeExamples[selectedExample])}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono">
                      {codeExamples[selectedExample]}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
