"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { crmAPI, type Campaign as APICampaign } from '@/lib/api/crm'
import { useAuth } from '@/lib/auth/context'
import {
  Megaphone,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Send,
  Gift,
  Percent
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  type: 'discount' | 'social' | 'email' | 'referral'
  status: 'active' | 'scheduled' | 'completed' | 'draft'
  startDate: string
  endDate: string
  budget: number
  spent: number
  reach: number
  conversions: number
  description: string
}

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<APICampaign[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    if (!token) return

    try {
      setLoading(true)
      const campaignsResponse = await crmAPI.getCampaigns(token)
      setCampaigns(campaignsResponse.campaigns)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!token) return

    try {
      await crmAPI.deleteCampaign(token, campaignId)
      setCampaigns(campaigns.filter(c => c.id !== campaignId))
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-4 h-4" />
      case 'social':
        return <Users className="w-4 h-4" />
      case 'email':
        return <Send className="w-4 h-4" />
      case 'sms':
        return <Send className="w-4 h-4" />
      case 'notification':
        return <Megaphone className="w-4 h-4" />
      default:
        return <Megaphone className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalSent = campaigns.reduce((sum, c) => sum + c.metrics.sent_count, 0)
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.metrics.delivered_count, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.metrics.opened_count, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.conversion_count, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.metrics.sent_count * 50), 0) // Estimated cost
  const totalReach = totalSent // Using sent count as reach

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeCampaigns}</p>
              </div>
              <Megaphone className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold text-green-600">{totalConversions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">
                  {totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalOpened.toLocaleString()} opened
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
          <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.content.message.length > 100
                            ? campaign.content.message.substring(0, 100) + '...'
                            : campaign.content.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {new Date(campaign.created_at).toLocaleDateString()}
                          </span>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Audience</p>
                        <p className="font-semibold">
                          {campaign.target_audience.customer_segments.length} segments
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.target_audience.tags.length} tags
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <p className="font-semibold">{campaign.metrics.sent_count} sent</p>
                        <p className="text-sm text-green-600">{campaign.metrics.conversion_count} conversions</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Delivery Progress</span>
                      <span>
                        {campaign.metrics.sent_count > 0
                          ? Math.round((campaign.metrics.delivered_count / campaign.metrics.sent_count) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${campaign.metrics.sent_count > 0
                            ? Math.min((campaign.metrics.delivered_count / campaign.metrics.sent_count) * 100, 100)
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {campaigns
              .filter(campaign => campaign.status === 'active')
              .map((campaign) => (
                <Card key={campaign.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-green-900">{campaign.name}</h3>
                        <p className="text-sm text-green-700 mb-2">{campaign.content.message}</p>
                        <div className="flex items-center gap-4 text-sm text-green-600">
                          <span>{campaign.metrics.sent_count} people reached</span>
                          <span>{campaign.metrics.conversion_count} conversions</span>
                          <span>UGX {Math.round(campaign.metrics.sent_count * 50).toLocaleString()} spent</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4">
            {campaigns
              .filter(campaign => campaign.status === 'draft' || campaign.status === 'paused')
              .map((campaign) => (
                <Card key={campaign.id} className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900">{campaign.name}</h3>
                        <p className="text-sm text-blue-700 mb-2">{campaign.content.message}</p>
                        <p className="text-sm text-blue-600">
                          Created: {new Date(campaign.created_at).toLocaleDateString()} | Messages: {campaign.metrics.sent_count}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm">
                          Launch Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{campaign.metrics.conversion_count} conversions</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.metrics.sent_count > 0 ? ((campaign.metrics.conversion_count / campaign.metrics.sent_count) * 100).toFixed(1) : 0}% conversion rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Total Investment</span>
                    <span className="font-semibold">UGX {totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Total Conversions</span>
                    <span className="font-semibold text-green-600">{totalConversions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Cost per Conversion</span>
                    <span className="font-semibold">
                      UGX {totalConversions > 0 ? Math.round(totalSpent / totalConversions).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-primary/5">
                    <span>Overall Reach</span>
                    <span className="font-semibold text-primary">{totalReach.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Campaign Templates</CardTitle>
          <CardDescription>
            Start with proven campaign templates for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Percent className="w-8 h-8 text-orange-500 mb-2" />
              <h4 className="font-semibold mb-1">Discount Campaign</h4>
              <p className="text-sm text-muted-foreground">Percentage or fixed amount discounts</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="font-semibold mb-1">Social Media Boost</h4>
              <p className="text-sm text-muted-foreground">Promote products on social platforms</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Gift className="w-8 h-8 text-purple-500 mb-2" />
              <h4 className="font-semibold mb-1">Referral Program</h4>
              <p className="text-sm text-muted-foreground">Reward customers for referrals</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Send className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-semibold mb-1">Email Marketing</h4>
              <p className="text-sm text-muted-foreground">Direct email campaigns to customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
