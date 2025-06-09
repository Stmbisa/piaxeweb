"use client"

import { useAuth } from "@/lib/auth/context"
import { DeveloperProtectedRoute } from "@/components/auth/developer-protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Webhook, FileText, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

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
                                    Your API keys and client credentials for payment integration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">API Key</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
                                        {developerProfile?.api_key || 'Not generated yet'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Client ID</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
                                        {developerProfile?.client_id || 'Not generated yet'}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href="/auth/developer-api-key-reset">Reset API Key</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href="/auth/developer-client-id-reset">Reset Client ID</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5" />
                                    <span>Documentation & Resources</span>
                                </CardTitle>
                                <CardDescription>
                                    API documentation and developer resources
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full" variant="default">
                                    <a
                                        href="https://piaxe.jettts.com/api/docs/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        📚 Complete API Documentation
                                    </a>
                                </Button>
                                <div className="text-sm text-gray-600">
                                    <p className="mb-2">Quick Links:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Authentication & API Keys</li>
                                        <li>• Payment Collection API</li>
                                        <li>• Escrow Payment API</li>
                                        <li>• Webhooks & Notifications</li>
                                        <li>• SDKs & Code Examples</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Code className="w-5 h-5" />
                                    <span>Get Started</span>
                                </CardTitle>
                                <CardDescription>
                                    New to our API? Start here
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full" size="sm">
                                    <a
                                        href="https://piaxe.jettts.com/api/docs/#quick-start"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Quick Start Guide
                                    </a>
                                </Button>
                                <Button asChild className="w-full" size="sm" variant="outline">
                                    <a
                                        href="https://piaxe.jettts.com/api/docs/#authentication"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Authentication Guide
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Settings className="w-5 h-5" />
                                    <span>Account Management</span>
                                </CardTitle>
                                <CardDescription>
                                    Manage your developer account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!developerProfile ? (
                                    <Button asChild className="w-full" size="sm">
                                        <Link href="/auth/developer-register">Complete Registration</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild className="w-full" size="sm" variant="outline">
                                            <Link href="/auth/developer-api-key-reset">Manage API Key</Link>
                                        </Button>
                                        <Button asChild className="w-full" size="sm" variant="outline">
                                            <Link href="/auth/developer-client-id-reset">Manage Client ID</Link>
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Webhook className="w-5 h-5" />
                                    <span>API Features</span>
                                </CardTitle>
                                <CardDescription>
                                    What you can build with our API
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="space-y-1">
                                    <div>✅ Accept Payments</div>
                                    <div>✅ Disburse Funds</div>
                                    <div>✅ Escrow Services</div>
                                    <div>✅ Payment Requests</div>
                                    <div>✅ Webhook Notifications</div>
                                    <div>✅ Multi-channel Collection</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Developer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Developer Account Information</CardTitle>
                            <CardDescription>
                                Your developer profile and account status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Account Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Name:</span> {developerProfile?.developer_name || user?.email}</div>
                                        <div><span className="font-medium">Developer ID:</span> {developerProfile?.developer_id || 'Not assigned'}</div>
                                        <div><span className="font-medium">Status:</span> {developerProfile?.status || 'Active'}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">API Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">API Key:</span> {developerProfile?.api_key ? 'Configured' : 'Not configured'}</div>
                                        <div><span className="font-medium">Client ID:</span> {developerProfile?.client_id ? 'Configured' : 'Not configured'}</div>
                                        <div><span className="font-medium">Webhook URL:</span> {developerProfile?.webhook_url || 'Not configured'}</div>
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
