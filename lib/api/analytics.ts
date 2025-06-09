// Analytics API utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://piaxe.jettts.com'

// Store Analytics Types
export interface StoreAnalytics {
  revenue: {
    total: number
    growth: number
    trend: 'up' | 'down'
    daily_revenue: {
      date: string
      amount: number
    }[]
    monthly_revenue: {
      month: string
      amount: number
    }[]
  }
  orders: {
    total: number
    growth: number
    trend: 'up' | 'down'
    completed: number
    pending: number
    cancelled: number
    daily_orders: {
      date: string
      count: number
    }[]
  }
  customers: {
    total: number
    growth: number
    trend: 'up' | 'down'
    active: number
    new_this_month: number
    returning: number
  }
  conversion: {
    rate: number
    growth: number
    trend: 'up' | 'down'
    visits_to_orders: number
    cart_abandonment_rate: number
  }
  inventory: {
    total_products: number
    low_stock_count: number
    out_of_stock_count: number
    total_value: number
    top_selling_products: {
      product_id: string
      name: string
      sales_count: number
      revenue: number
      growth: number
    }[]
  }
  recent_orders: {
    id: string
    customer_name: string
    amount: number
    status: 'completed' | 'processing' | 'pending' | 'cancelled'
    created_at: string
  }[]
}

export interface PaymentAnalytics {
  total_transactions: number
  successful_transactions: number
  failed_transactions: number
  total_volume: number
  average_transaction_value: number
  payment_methods: {
    method: string
    count: number
    volume: number
    percentage: number
  }[]
  transaction_trends: {
    date: string
    count: number
    volume: number
  }[]
  refunds: {
    total_refunds: number
    refund_rate: number
    total_refund_amount: number
  }
}

export interface MerchantAnalytics {
  stores: {
    total_stores: number
    active_stores: number
    new_stores_this_month: number
  }
  overall_revenue: number
  overall_orders: number
  overall_customers: number
  top_performing_stores: {
    store_id: string
    store_name: string
    revenue: number
    orders: number
    growth: number
  }[]
}

class AnalyticsAPI {
  private getHeaders(token: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // Store Analytics
  async getStoreAnalytics(token: string, storeId: string, params?: {
    start_date?: string
    end_date?: string
    period?: 'day' | 'week' | 'month' | 'year'
  }): Promise<StoreAnalytics> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)
      if (params?.period) queryParams.append('period', params.period)

      const response = await fetch(`${API_BASE_URL}/analytics/stores/${storeId}?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch store analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Store analytics fetch error:', error)
      throw error
    }
  }

  // Payment Analytics
  async getPaymentAnalytics(token: string, storeId?: string, params?: {
    start_date?: string
    end_date?: string
    payment_method?: string
  }): Promise<PaymentAnalytics> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)
      if (params?.payment_method) queryParams.append('payment_method', params.payment_method)
      if (storeId) queryParams.append('store_id', storeId)

      const response = await fetch(`${API_BASE_URL}/analytics/payments?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch payment analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment analytics fetch error:', error)
      throw error
    }
  }

  // Merchant Analytics (all stores)
  async getMerchantAnalytics(token: string, params?: {
    start_date?: string
    end_date?: string
  }): Promise<MerchantAnalytics> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)

      const response = await fetch(`${API_BASE_URL}/analytics/merchant?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch merchant analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Merchant analytics fetch error:', error)
      throw error
    }
  }

  // Revenue breakdown by categories
  async getCategoryAnalytics(token: string, storeId: string, params?: {
    start_date?: string
    end_date?: string
  }): Promise<{
    categories: {
      category_id: string
      category_name: string
      revenue: number
      orders: number
      growth: number
      percentage: number
    }[]
  }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)

      const response = await fetch(`${API_BASE_URL}/analytics/stores/${storeId}/categories?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch category analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Category analytics fetch error:', error)
      throw error
    }
  }

  // Get traffic analytics
  async getTrafficAnalytics(token: string, storeId: string, params?: {
    start_date?: string
    end_date?: string
  }): Promise<{
    page_views: number
    unique_visitors: number
    bounce_rate: number
    average_session_duration: number
    traffic_sources: {
      source: string
      visitors: number
      percentage: number
    }[]
    daily_traffic: {
      date: string
      page_views: number
      unique_visitors: number
    }[]
  }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)

      const response = await fetch(`${API_BASE_URL}/analytics/stores/${storeId}/traffic?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch traffic analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Traffic analytics fetch error:', error)
      throw error
    }
  }
}

export const analyticsAPI = new AnalyticsAPI()
