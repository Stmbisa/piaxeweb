"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { crmAPI, type Customer } from '@/lib/api/crm'
import { useAuth } from '@/lib/auth/context'
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

export function CRMDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Load customers on component mount
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    if (!token) return

    try {
      setLoading(true)
      const customersResponse = await crmAPI.getCustomers(token)
      setCustomers(customersResponse.customers)
    } catch (error) {
      console.error('Error loading customers:', error)
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (!token) return

    try {
      await crmAPI.deleteCustomer(token, customerId)
      setCustomers(customers.filter(c => c.id !== customerId))
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    customer.phone.includes(searchTerm)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const vipCustomers = customers.filter(c => c.total_spent > 500000).length // Consider VIP if spent > 500k
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0)
  const totalOrders = customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading CRM data...</p>
        </div>
      </div>
    )
  }

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
                          {customer.total_spent > 500000 && (
                            <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
                          )}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {customer.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">UGX {customer.total_spent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{customer.total_orders} orders</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm">
                          Last order: {customer.last_order_date || 'Never'}
                        </p>
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
                  .filter(customer => customer.total_spent > 500000)
                  .map((customer) => (
                    <div key={customer.id} className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">{customer.name}</h4>
                            <p className="text-sm text-purple-600">Lifetime Value: UGX {customer.total_spent.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-900">{customer.total_orders} orders</p>
                          <p className="text-sm text-purple-600">Customer since {new Date(customer.created_at).toLocaleDateString()}</p>
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
                      <p className="text-sm text-green-600 mb-2">
                        Last order: {customer.last_order_date || 'Never'}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Total spent: UGX {customer.total_spent.toLocaleString()}</span>
                        <span>{customer.total_orders} orders</span>
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
                          <p className="text-sm text-muted-foreground">
                            Last order: {customer.last_order_date || 'Never'}
                          </p>
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
