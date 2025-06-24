// CRM API utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  tags: string[];
  notes?: string;
  status: "active" | "inactive";
  total_spent: number;
  total_orders: number;
  last_order_date?: string;
  created_at: string;
  updated_at: string;
  merchant_id: string;
}

export interface CustomerCreate {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  tags?: string[];
  notes?: string;
}

export interface CustomerUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  tags?: string[];
  notes?: string;
  status?: "active" | "inactive";
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "notification";
  status: "draft" | "active" | "paused" | "completed";
  target_audience: {
    customer_segments: string[];
    tags: string[];
    min_spent?: number;
    max_spent?: number;
  };
  content: {
    subject?: string;
    message: string;
    template_id?: string;
  };
  schedule: {
    send_immediately: boolean;
    scheduled_at?: string;
    recurring?: {
      frequency: "daily" | "weekly" | "monthly";
      days_of_week?: number[];
      time?: string;
    };
  };
  metrics: {
    sent_count: number;
    delivered_count: number;
    opened_count: number;
    clicked_count: number;
    conversion_count: number;
  };
  created_at: string;
  updated_at: string;
  merchant_id: string;
}

export interface CampaignCreate {
  name: string;
  type: "email" | "sms" | "notification";
  target_audience: {
    customer_segments: string[];
    tags: string[];
    min_spent?: number;
    max_spent?: number;
  };
  content: {
    subject?: string;
    message: string;
    template_id?: string;
  };
  schedule: {
    send_immediately: boolean;
    scheduled_at?: string;
    recurring?: {
      frequency: "daily" | "weekly" | "monthly";
      days_of_week?: number[];
      time?: string;
    };
  };
}

export interface CampaignUpdate {
  name?: string;
  status?: "draft" | "active" | "paused" | "completed";
  target_audience?: {
    customer_segments?: string[];
    tags?: string[];
    min_spent?: number;
    max_spent?: number;
  };
  content?: {
    subject?: string;
    message?: string;
    template_id?: string;
  };
  schedule?: {
    send_immediately?: boolean;
    scheduled_at?: string;
    recurring?: {
      frequency?: "daily" | "weekly" | "monthly";
      days_of_week?: number[];
      time?: string;
    };
  };
}

// Segment Types
export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: {
    tags?: string[];
    min_spent?: number;
    max_spent?: number;
    min_orders?: number;
    max_orders?: number;
    last_order_days?: number;
    location?: string;
    age_range?: {
      min: number;
      max: number;
    };
  };
  customer_count: number;
  created_at: string;
  updated_at: string;
  merchant_id: string;
}

export interface SegmentCreate {
  name: string;
  description?: string;
  criteria: {
    tags?: string[];
    min_spent?: number;
    max_spent?: number;
    min_orders?: number;
    max_orders?: number;
    last_order_days?: number;
    location?: string;
    age_range?: {
      min: number;
      max: number;
    };
  };
}

// Analytics Types
export interface CustomerAnalytics {
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  average_order_value: number;
  customer_lifetime_value: number;
  top_spending_customers: Customer[];
  customer_acquisition_trend: {
    date: string;
    new_customers: number;
  }[];
  customer_segments_distribution: {
    segment_name: string;
    count: number;
    percentage: number;
  }[];
}

export interface CampaignAnalytics {
  total_campaigns: number;
  active_campaigns: number;
  total_sent: number;
  total_delivered: number;
  average_open_rate: number;
  average_click_rate: number;
  conversion_rate: number;
  recent_campaign_performance: {
    campaign_id: string;
    campaign_name: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversions: number;
  }[];
}

class CRMAPI {
  private getHeaders(token: string): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Customer Management
  async createCustomer(
    token: string,
    customerData: CustomerCreate
  ): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/customers/create`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Customer creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Customer creation error:", error);
      throw error;
    }
  }

  async getCustomers(
    token: string,
    params?: {
      search?: string;
      tags?: string[];
      status?: "active" | "inactive";
      segment_id?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.tags)
        params.tags.forEach((tag) => queryParams.append("tags", tag));
      if (params?.status) queryParams.append("status", params.status);
      if (params?.segment_id)
        queryParams.append("segment_id", params.segment_id);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/crm/customers?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch customers");
      }

      return await response.json();
    } catch (error) {
      console.error("Customers fetch error:", error);
      throw error;
    }
  }

  async getCustomer(token: string, customerId: string): Promise<Customer> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/customers/${customerId}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch customer");
      }

      return await response.json();
    } catch (error) {
      console.error("Customer fetch error:", error);
      throw error;
    }
  }

  async updateCustomer(
    token: string,
    customerId: string,
    customerData: CustomerUpdate
  ): Promise<Customer> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/customers/${customerId}`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify(customerData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Customer update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Customer update error:", error);
      throw error;
    }
  }

  async deleteCustomer(token: string, customerId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/customers/${customerId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Customer deletion failed");
      }
    } catch (error) {
      console.error("Customer deletion error:", error);
      throw error;
    }
  }

  // Customer Segments
  async createSegment(
    token: string,
    segmentData: SegmentCreate
  ): Promise<CustomerSegment> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/segments/create`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify(segmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Segment creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Segment creation error:", error);
      throw error;
    }
  }

  async getSegments(token: string): Promise<CustomerSegment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/segments`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch segments");
      }

      return await response.json();
    } catch (error) {
      console.error("Segments fetch error:", error);
      throw error;
    }
  }

  async getSegmentCustomers(
    token: string,
    segmentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ customers: Customer[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/crm/segments/${segmentId}/customers?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch segment customers");
      }

      return await response.json();
    } catch (error) {
      console.error("Segment customers fetch error:", error);
      throw error;
    }
  }

  // Campaign Management
  async createCampaign(
    token: string,
    campaignData: CampaignCreate
  ): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/campaigns/create`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Campaign creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaign creation error:", error);
      throw error;
    }
  }

  async getCampaigns(
    token: string,
    params?: {
      status?: "draft" | "active" | "paused" | "completed";
      type?: "email" | "sms" | "notification";
      page?: number;
      limit?: number;
    }
  ): Promise<{
    campaigns: Campaign[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/crm/campaigns?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch campaigns");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaigns fetch error:", error);
      throw error;
    }
  }

  async getCampaign(token: string, campaignId: string): Promise<Campaign> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/campaigns/${campaignId}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch campaign");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaign fetch error:", error);
      throw error;
    }
  }

  async updateCampaign(
    token: string,
    campaignId: string,
    campaignData: CampaignUpdate
  ): Promise<Campaign> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/campaigns/${campaignId}`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify(campaignData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Campaign update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaign update error:", error);
      throw error;
    }
  }

  async deleteCampaign(token: string, campaignId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/campaigns/${campaignId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Campaign deletion failed");
      }
    } catch (error) {
      console.error("Campaign deletion error:", error);
      throw error;
    }
  }

  async sendCampaign(
    token: string,
    campaignId: string
  ): Promise<{ message: string; sent_count: number }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/crm/campaigns/${campaignId}/send`,
        {
          method: "POST",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Campaign send failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaign send error:", error);
      throw error;
    }
  }

  // Analytics
  async getCustomerAnalytics(
    token: string,
    params?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<CustomerAnalytics> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.start_date)
        queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);

      const response = await fetch(
        `${API_BASE_URL}/crm/analytics/customers?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch customer analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Customer analytics fetch error:", error);
      throw error;
    }
  }

  async getCampaignAnalytics(
    token: string,
    params?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<CampaignAnalytics> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.start_date)
        queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);

      const response = await fetch(
        `${API_BASE_URL}/crm/analytics/campaigns?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch campaign analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Campaign analytics fetch error:", error);
      throw error;
    }
  }
}

export const crmAPI = new CRMAPI();
