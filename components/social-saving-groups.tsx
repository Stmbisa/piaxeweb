"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users,
  Plus,
  Target,
  Calendar,
  Coins,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  Settings,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface SavingGroup {
  id: string
  name: string
  description: string
  target_amount: number
  current_amount: number
  members_count: number
  max_members: number
  contribution_frequency: 'daily' | 'weekly' | 'monthly'
  contribution_amount: number
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'paused'
  is_admin: boolean
  next_contribution: string
  category: string
}

interface SavingTransaction {
  id: string
  group_id: string
  member_name: string
  amount: number
  type: 'contribution' | 'withdrawal' | 'interest'
  date: string
  status: 'completed' | 'pending'
}

const mockSavingGroups: SavingGroup[] = [
  {
    id: '1',
    name: 'Family Emergency Fund',
    description: 'Building emergency fund for unexpected family expenses',
    target_amount: 5000000,
    current_amount: 2800000,
    members_count: 8,
    max_members: 10,
    contribution_frequency: 'monthly',
    contribution_amount: 100000,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'active',
    is_admin: true,
    next_contribution: '2024-02-01',
    category: 'Emergency'
  },
  {
    id: '2',
    name: 'University Friends Vacation',
    description: 'Saving for our annual reunion trip to Mombasa',
    target_amount: 1500000,
    current_amount: 950000,
    members_count: 6,
    max_members: 6,
    contribution_frequency: 'weekly',
    contribution_amount: 25000,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    status: 'active',
    is_admin: false,
    next_contribution: '2024-01-29',
    category: 'Travel'
  },
  {
    id: '3',
    name: 'Business Equipment Fund',
    description: 'Pooling resources to buy new equipment for our co-op',
    target_amount: 8000000,
    current_amount: 8000000,
    members_count: 12,
    max_members: 15,
    contribution_frequency: 'monthly',
    contribution_amount: 200000,
    start_date: '2023-06-01',
    end_date: '2024-01-31',
    status: 'completed',
    is_admin: false,
    next_contribution: '',
    category: 'Business'
  }
]

const mockTransactions: SavingTransaction[] = [
  {
    id: '1',
    group_id: '1',
    member_name: 'Sarah Mukisa',
    amount: 100000,
    type: 'contribution',
    date: '2024-01-25',
    status: 'completed'
  },
  {
    id: '2',
    group_id: '1',
    member_name: 'James Okello',
    amount: 100000,
    type: 'contribution',
    date: '2024-01-24',
    status: 'completed'
  },
  {
    id: '3',
    group_id: '2',
    member_name: 'Grace Nalwoga',
    amount: 25000,
    type: 'contribution',
    date: '2024-01-22',
    status: 'pending'
  }
]

export function SocialSavingGroups() {
  const [savingGroups, setSavingGroups] = useState<SavingGroup[]>(mockSavingGroups)
  const [transactions, setTransactions] = useState<SavingTransaction[]>(mockTransactions)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<SavingGroup | null>(null)

  const getStatusColor = (status: SavingGroup['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Social Saving Groups
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join friends and family to save together for common goals. Secure, transparent, and rewarding.
            </p>
          </div>

          <Tabs defaultValue="my-groups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              <TabsTrigger value="discover">Discover Groups</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* My Groups Tab */}
            <TabsContent value="my-groups" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">My Saving Groups</h2>
                  <p className="text-muted-foreground">Manage and track your group savings</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>

              {/* Group Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                        <p className="text-2xl font-bold">{savingGroups.filter(g => g.status === 'active').length}</p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(savingGroups.reduce((sum, g) => sum + g.current_amount, 0))}
                        </p>
                      </div>
                      <Coins className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Contribution</p>
                        <p className="text-2xl font-bold">{formatCurrency(200000)}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        <p className="text-2xl font-bold">{savingGroups.reduce((sum, g) => sum + g.members_count, 0)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Saving Groups List */}
              <div className="grid gap-6">
                {savingGroups.map((group) => (
                  <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            <Badge className={getStatusColor(group.status)}>
                              {group.status}
                            </Badge>
                            {group.is_admin && (
                              <Badge variant="outline">Admin</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{group.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {group.members_count}/{group.max_members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {group.contribution_frequency} contributions
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {group.category}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Goal</span>
                          <span>{getProgressPercentage(group.current_amount, group.target_amount).toFixed(1)}%</span>
                        </div>
                        <Progress value={getProgressPercentage(group.current_amount, group.target_amount)} />
                        <div className="flex justify-between text-sm">
                          <span>Current: {formatCurrency(group.current_amount)}</span>
                          <span>Target: {formatCurrency(group.target_amount)}</span>
                        </div>
                      </div>

                      {group.status === 'active' && group.next_contribution && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Next Contribution Due</p>
                              <p className="text-sm text-muted-foreground">{group.next_contribution}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatCurrency(group.contribution_amount)}</p>
                              <Button size="sm" className="mt-1">
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Discover Groups Tab */}
            <TabsContent value="discover" className="space-y-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Discover New Groups</h3>
                <p className="text-muted-foreground mb-6">
                  Find public saving groups that match your goals and interests
                </p>
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Browse Public Groups
                </Button>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recent Transactions</h2>
                <p className="text-muted-foreground">Track all your saving group contributions and withdrawals</p>
              </div>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'contribution'
                              ? 'bg-green-100 text-green-600 dark:bg-green-950/20'
                              : transaction.type === 'withdrawal'
                                ? 'bg-red-100 text-red-600 dark:bg-red-950/20'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-950/20'
                            }`}>
                            {transaction.type === 'contribution' ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : transaction.type === 'withdrawal' ? (
                              <ArrowDownRight className="w-5 h-5" />
                            ) : (
                              <TrendingUp className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.member_name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {transaction.type} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                          <div className="flex items-center gap-1">
                            {transaction.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="text-sm text-muted-foreground capitalize">
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
