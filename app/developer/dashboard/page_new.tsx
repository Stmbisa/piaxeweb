"use client"

import { useAuth } from "@/lib/auth/context"
import { DeveloperProtectedRoute } from "@/components/auth/developer-protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Webhook, FileText, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function DeveloperDashboard() {
    const { user, isDeveloper } = useAuth()
    const developerProfile = user?.developer_profile

    return (
        <DeveloperProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-600">Welcome back, {developerProfile?.developer_name || user?.email}</p>
                            <Badge variant={developerProfile?.status === 'active' ? 'default' : 'secondary'}>
                                {developerProfile?.status || 'Active'}
                            </Badge>
                        </div>
                    </div>

                    {/* API Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Key className="w-5 h-5" />
                                    <span>API Credentials</span>
                                </CardTitle>
                                <CardDescription>
                                    Manage your API keys and authentication
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Client ID</h4>
                                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                                            {developerProfile?.client_id || 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">API Key</h4>
                                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                                            {developerProfile?.api_key ? '•'.repeat(32) : 'Not set'}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/auth/developer-api-key-reset">Reset API Key</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/auth/developer-client-id-reset">Reset Client ID</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="w-5 h-5" />
                                    <span>API Usage</span>
                                </CardTitle>
                                <CardDescription>
                                    Monitor your API usage and limits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Requests this month</span>
                                            <span className="text-sm text-gray-600">1,234 / 10,000</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Rate limit</span>
                                            <span className="text-sm text-gray-600">100/hour</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5" />
                                    <span>Documentation</span>
                                </CardTitle>
                                <CardDescription>
                                    API reference and guides
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="https://api.gopiaxis.com/api/docs/" target="_blank">
                                        View API Docs
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Code className="w-5 h-5" />
                                    <span>Code Examples</span>
                                </CardTitle>
                                <CardDescription>
                                    Sample code and SDKs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/developers">
                                        Browse Examples
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Webhook className="w-5 h-5" />
                                    <span>Webhooks</span>
                                </CardTitle>
                                <CardDescription>
                                    Configure event notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Setup Webhooks
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent API Activity</CardTitle>
                            <CardDescription>
                                Your latest API requests and events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div>
                                        <p className="font-medium">Payment created</p>
                                        <p className="text-sm text-gray-600">POST /api/payments</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="default">200</Badge>
                                        <p className="text-sm text-gray-600">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div>
                                        <p className="font-medium">Escrow status check</p>
                                        <p className="text-sm text-gray-600">GET /api/escrow/status</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="default">200</Badge>
                                        <p className="text-sm text-gray-600">5 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Payment disbursement</p>
                                        <p className="text-sm text-gray-600">POST /api/disburse</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="default">200</Badge>
                                        <p className="text-sm text-gray-600">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DeveloperProtectedRoute>
    )
}
