// Shopping and Inventory API utilities
import { API_ENDPOINTS } from "@/lib/config/env";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Product Types
export interface ProductLocation {
  id: string;
  store_id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: string;
  currency: string;
  quantity: number;
  low_stock_threshold: number;
  product_code: string;
  barcode: string;
  qr_code: string | null;
  location: ProductLocation;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  base_price: string;
  currency: string;
  quantity: number;
  low_stock_threshold?: number;
  product_code?: string;
  barcode?: string;
  qr_code?: string;
  location_id: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  base_price?: string;
  quantity?: number;
  low_stock_threshold?: number;
  product_code?: string;
  barcode?: string;
  qr_code?: string;
  location_id?: string;
  is_active?: boolean;
}

export interface ProductsResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

// Store Types
export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  business_hours?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  notification_preferences?: {
    [key: string]: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface StoreCreate {
  name: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  business_hours?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  notification_preferences?: {
    [key: string]: boolean;
  };
}

export interface StoreUpdate {
  name?: string;
  description?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  business_hours?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  notification_preferences?: {
    [key: string]: boolean;
  };
}

// Order Types
export interface Order {
  id: string;
  store_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method?: string;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderCreate {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
  delivery_address?: string;
  notes?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  store_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Category[];
}

export interface CategoryCreate {
  name: string;
  description: string;
  parent_id?: string | null;
  store_id?: string | null;
  is_active?: boolean;
}

class ShoppingInventoryAPI {
  private getHeaders(token: string): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Store Management
  async createStore(token: string, storeData: StoreCreate): Promise<Store> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(storeData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Store creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Store creation error:", error);
      throw error;
    }
  }

  async getStores(token: string): Promise<Store[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch stores");
      }

      return await response.json();
    } catch (error) {
      console.error("Stores fetch error:", error);
      throw error;
    }
  }

  async getStore(token: string, storeId: string): Promise<Store> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch store");
      }

      return await response.json();
    } catch (error) {
      console.error("Store fetch error:", error);
      throw error;
    }
  }

  async updateStore(
    token: string,
    storeId: string,
    storeData: StoreUpdate
  ): Promise<Store> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify(storeData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Store update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Store update error:", error);
      throw error;
    }
  }

  async deleteStore(token: string, storeId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Store deletion failed");
      }
    } catch (error) {
      console.error("Store deletion error:", error);
      throw error;
    }
  }

  // Product Management
  async createProduct(
    token: string,
    storeId: string,
    productData: ProductCreate
  ): Promise<Product> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/products/create`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Product creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Product creation error:", error);
      throw error;
    }
  }

  async getProducts(
    token: string,
    storeId: string,
    params?: {
      category?: string;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append("category", params.category);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const url =
        API_ENDPOINTS.SHOPPING.STORES.PRODUCTS.LIST(storeId) +
        `?${queryParams}`;
      console.log("Fetching products from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch products");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Products fetch error:", error);
      return {
        total: 0,
        page: 1,
        limit: 10,
        products: [],
      };
    }
  }

  async getProduct(
    token: string,
    storeId: string,
    productId: string
  ): Promise<Product> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/products/${productId}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch product");
      }

      return await response.json();
    } catch (error) {
      console.error("Product fetch error:", error);
      throw error;
    }
  }

  async updateProduct(
    token: string,
    storeId: string,
    productId: string,
    productData: ProductUpdate
  ): Promise<Product> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/products/${productId}`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Product update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Product update error:", error);
      throw error;
    }
  }

  async deleteProduct(
    token: string,
    storeId: string,
    productId: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/products/${productId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Product deletion failed");
      }
    } catch (error) {
      console.error("Product deletion error:", error);
      throw error;
    }
  }

  // Stock Management
  async updateStock(
    token: string,
    storeId: string,
    productId: string,
    quantity: number,
    operation: "add" | "subtract" | "set"
  ): Promise<Product> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/products/${productId}/stock`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify({ quantity, operation }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Stock update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Stock update error:", error);
      throw error;
    }
  }

  // Category Management
  async createCategory(
    token: string,
    categoryData: CategoryCreate
  ): Promise<Category> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/categories`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Category creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Category creation error:", error);
      throw error;
    }
  }

  async getCategories(token: string): Promise<Category[]> {
    try {
      console.log("Fetching categories");
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/categories`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      console.log("Categories API Response status:", response.status);
      console.log("Categories API Response headers:", response.headers);

      if (!response.ok) {
        const error = await response.json();
        console.error("Categories API Error:", error);
        throw new Error(error.message || "Failed to fetch categories");
      }

      const data = await response.json();
      console.log("Categories API Response data:", data);

      // Ensure we always return an array
      const categories = Array.isArray(data) ? data : [];
      console.log("Processed categories:", categories);
      return categories;
    } catch (error: any) {
      console.error("Categories fetch error:", error);
      console.error("Full error details:", {
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause,
      });
      // Return empty array instead of throwing
      return [];
    }
  }

  // Order Management
  async createOrder(
    token: string,
    storeId: string,
    orderData: OrderCreate
  ): Promise<Order> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/orders/create`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Order creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  }

  async getOrders(
    token: string,
    storeId: string,
    params?: {
      status?: string;
      payment_status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.payment_status)
        queryParams.append("payment_status", params.payment_status);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/orders?${queryParams}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch orders");
      }

      return await response.json();
    } catch (error) {
      console.error("Orders fetch error:", error);
      throw error;
    }
  }

  async updateOrderStatus(
    token: string,
    storeId: string,
    orderId: string,
    status: Order["status"]
  ): Promise<Order> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_and_inventory/stores/${storeId}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: this.getHeaders(token),
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Order status update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Order status update error:", error);
      throw error;
    }
  }
}

export const shoppingInventoryAPI = new ShoppingInventoryAPI();
