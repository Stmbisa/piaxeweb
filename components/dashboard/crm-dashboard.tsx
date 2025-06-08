"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  ShoppingBag,
  Star,
  TrendingUp,
  UserPlus,
  MessageSquare
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  totalOrders: number
  lastOrder: string
  status: 'active' | 'inactive' | 'vip'
  joinDate: string
  rating: number
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Nakamura',
    email: 'sarah@example.com',
    phone: '+256701234567',
    totalSpent: 450000,
    totalOrders: 12,
    lastOrder: '2024-01-15',
    status: 'vip',
    joinDate: '2023-08-15',
    rating: 5
  },
  {
    id: '2',
    name: 'John Mukasa',
    email: 'john.mukasa@gmail.com',
    phone: '+256702345678',
    totalSpent: 180000,
    totalOrders: 5,
    lastOrder: '2024-01-10',
    status: 'active',
    joinDate: '2023-11-20',
    rating: 4
  },
  {
    id: '3',
    name: 'Grace Achieng',
    email: 'grace.achieng@yahoo.com',
    phone: '+256703456789',
    totalSpent: 75000,
    totalOrders: 2,
    lastOrder: '2023-12-05',
    status: 'inactive',
    joinDate: '2023-10-10',
    rating: 4
  },
  {
    id: '4',
    name: 'David Ssebunya',
    email: 'david.ssebunya@outlook.com',
    phone: '+256704567890',
    totalSpent: 320000,
    totalOrders: 8,
    lastOrder: '2024-01-12',
    status: 'active',
    joinDate: '2023-09-05',
    rating: 5
  }
]

export function CRMDashboard() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'vip':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length
  const vipCustomers = customers.filter(c => c.status === 'vip').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)

  return (
    <div className="space-y-6">
      {/* CRM Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-600">{vipCustomers}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">UGX {Math.round(averageOrderValue).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRM Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Send Messages
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="vip">VIP Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>
                Manage your customer relationships and track engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {customer.name}
                          <div className="flex items-center">
                            {[...Array(customer.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">UGX {customer.totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{customer.totalOrders} orders</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm">Last order: {customer.lastOrder}</p>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                VIP Customers
              </CardTitle>
              <CardDescription>
                Your most valuable customers who deserve special attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .filter(customer => customer.status === 'vip')
                  .map((customer) => (
                    <div key={customer.id} className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">{customer.name}</h4>
                            <p className="text-sm text-purple-600">Lifetime Value: UGX {customer.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-900">{customer.totalOrders} orders</p>
                          <p className="text-sm text-purple-600">Customer since {customer.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Active Customers
              </CardTitle>
              <CardDescription>
                Customers who have made recent purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers
                  .filter(customer => customer.status === 'active')
                  .map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                      <h4 className="font-semibold text-green-900">{customer.name}</h4>
                      <p className="text-sm text-green-600 mb-2">Last order: {customer.lastOrder}</p>
                      <div className="flex justify-between text-sm">
                        <span>Total spent: UGX {customer.totalSpent.toLocaleString()}</span>
                        <span>{customer.totalOrders} orders</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Customers</CardTitle>
              <CardDescription>
                Customers who haven't made recent purchases - consider reaching out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .filter(customer => customer.status === 'inactive')
                  .map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{customer.name}</h4>
                          <p className="text-sm text-muted-foreground">Last order: {customer.lastOrder}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Send Offer
                          </Button>
                          <Button size="sm">
                            Re-engage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
