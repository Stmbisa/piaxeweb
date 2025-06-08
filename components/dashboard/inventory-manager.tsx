"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  sales: number
  image?: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ugandan Coffee Beans (Premium)',
    category: 'Food & Beverages',
    price: 25000,
    stock: 45,
    status: 'in-stock',
    sales: 234
  },
  {
    id: '2',
    name: 'Handwoven Basket',
    category: 'Crafts',
    price: 18000,
    stock: 3,
    status: 'low-stock',
    sales: 89
  },
  {
    id: '3',
    name: 'Solar Phone Charger',
    category: 'Electronics',
    price: 75000,
    stock: 0,
    status: 'out-of-stock',
    sales: 156
  },
  {
    id: '4',
    name: 'Organic Honey (500ml)',
    category: 'Food & Beverages',
    price: 12000,
    stock: 28,
    status: 'in-stock',
    sales: 312
  }
]

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'out-of-stock':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.status === 'low-stock').length
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock').length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
              </div>
              <Minus className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">UGX {totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">UGX {product.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{product.stock} units</p>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stock Alerts */}
      {(lowStockProducts > 0 || outOfStockProducts > 0) && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts > 0 && (
                <p className="text-sm text-yellow-700">
                  {lowStockProducts} product(s) are running low on stock
                </p>
              )}
              {outOfStockProducts > 0 && (
                <p className="text-sm text-red-700">
                  {outOfStockProducts} product(s) are out of stock
                </p>
              )}
              <Button variant="outline" size="sm" className="mt-2">
                Review Stock Levels
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
