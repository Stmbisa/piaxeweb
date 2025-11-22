// Shopping & Inventory API utilities
import { deviceHeadersForContext } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gopiaxis.com";

// Store Types
export interface Store {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  location: string;
  store_type: string;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_featured: boolean;
  currency: string;
  contact_phone: string;
  contact_email: string;
  website: string | null;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  } | null;
  business_hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  } | null;
}

export interface CreateStoreData {
  name: string;
  description: string;
  location: string;
  store_type: string;
  currency: string;
  contact_phone: string;
  contact_email: string;
  website?: string;
  address?: string; // Added for compatibility
  notification_preferences?: any; // Added for compatibility
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  business_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

export interface UpdateStoreData extends Partial<CreateStoreData> {}

// Product Types
export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock_quantity: number;
  category: string;
  barcode: string | null;
  sku: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[] | null;
  attributes: Record<string, string> | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  barcode: string | null;
  sku: string | null;
  attributes: Record<string, string> | null;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  barcode?: string;
  sku?: string;
  store_id: string;
  variants?: Omit<ProductVariant, "id">[];
  attributes?: Record<string, string>;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

// Staff Types
export interface StaffMember {
  id: string;
  store_id: string;
  account_id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "staff";
  permissions: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateStaffData {
  email: string;
  role: "manager" | "staff";
  permissions: string[];
}

export interface UpdateStaffData extends Partial<CreateStaffData> {}

// Import Types
export interface ProductImportJob {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  total_items: number;
  processed_items: number;
  successful_items: number;
  failed_items: number;
  errors: string[];
}

// Scan Types
export interface ScannedProduct {
  barcode: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  exists_in_store: boolean;
  store_product_id?: string;
}

class ShoppingInventoryAPI {
  private getBase(): string {
    return API_BASE_URL;
  }

  private getHeaders(token: string): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Add device headers for device binding
    Object.assign(headers, deviceHeadersForContext(token));

    return headers;
  }

  // Store Operations
  async createStore(token: string, data: CreateStoreData): Promise<Store> {
    try {
      console.log("Creating store with token:", token.substring(0, 15) + "...");

      // Ensure required fields are present
      const storeData = {
        ...data,
        location: data.location || data.address || "",
        store_type: data.store_type || "retail",
        currency: data.currency || "UGX",
      };

      const response = await fetch(
        `${this.getBase()}/shopping_and_inventory/stores`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(storeData),
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        console.error("Store creation failed with status:", response.status);
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error(
          `Failed to create store: ${response.status} - ${error}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Store creation error:", error);
      throw error;
    }
  }

  async getStores(token: string): Promise<Store[]> {
    try {
      console.log(
        "Fetching stores with token:",
        token.substring(0, 15) + "..."
      );

      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle "Account is not verified" as a specific case (empty stores list)
        // This prevents the dashboard from crashing/showing error when user is just not verified yet
        if (response.status === 400 && errorText.includes("Account is not verified")) {
          console.warn("User account not verified for stores, returning empty list");
          return [];
        }

        console.error("Stores fetch failed with status:", response.status);
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch stores: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Stores fetch error:", error);
      throw error;
    }
  }

  async getStore(token: string, storeId: string): Promise<Store> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch store: ${response.status} - ${errorText}`
        );
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
    data: UpdateStoreData
  ): Promise<Store> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to update store: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Store update error:", error);
      throw error;
    }
  }

  async deleteStore(token: string, storeId: string): Promise<void> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to delete store: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Store deletion error:", error);
      throw error;
    }
  }

  // Product Operations
  async getProducts(
    token: string,
    storeId: string,
    options?: {
      limit?: number;
      offset?: number;
      category?: string;
      search?: string;
    }
  ): Promise<Product[]> {
    try {
      // Use proxy to avoid CORS issues
      let url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products`;

      // Add query parameters if provided
      if (options) {
        const params = new URLSearchParams();
        if (options.limit) params.append("limit", options.limit.toString());
        if (options.offset) params.append("offset", options.offset.toString());
        if (options.category) params.append("category", options.category);
        if (options.search) params.append("search", options.search);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch products: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Products fetch error:", error);
      throw error;
    }
  }

  async getProduct(
    token: string,
    storeId: string,
    productId: string
  ): Promise<Product> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/${productId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch product: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Product fetch error:", error);
      throw error;
    }
  }

  async createProduct(
    token: string,
    data: CreateProductData
  ): Promise<Product> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/products`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to create product: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Product creation error:", error);
      throw error;
    }
  }

  async updateProduct(
    token: string,
    storeId: string,
    productId: string,
    data: UpdateProductData
  ): Promise<Product> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/${productId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to update product: ${response.status} - ${errorText}`
        );
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
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/${productId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to delete product: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Product deletion error:", error);
      throw error;
    }
  }

  // Batch Product Operations
  async batchCreateProducts(
    token: string,
    storeId: string,
    products: CreateProductData[]
  ): Promise<Product[]> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/batch`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ products }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to batch create products: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Batch product creation error:", error);
      throw error;
    }
  }

  // Import Products
  async importProducts(
    token: string,
    storeId: string,
    file: File
  ): Promise<{ task_id: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/import`;

      // Remove content-type header to let browser set it with boundary
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to import products: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Product import error:", error);
      throw error;
    }
  }

  async getImportStatus(
    token: string,
    storeId: string,
    taskId: string
  ): Promise<ProductImportJob> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/import/${taskId}/status`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to get import status: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Import status fetch error:", error);
      throw error;
    }
  }

  // Scan Products
  async scanProduct(
    token: string,
    storeId: string,
    barcode: string
  ): Promise<ScannedProduct> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/products/scan`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ barcode }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to scan product: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Product scan error:", error);
      throw error;
    }
  }

  // Staff Operations
  async getStaffMembers(
    token: string,
    storeId: string
  ): Promise<StaffMember[]> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/staff`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch staff members: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Staff fetch error:", error);
      throw error;
    }
  }

  async addStaffMember(
    token: string,
    storeId: string,
    data: CreateStaffData
  ): Promise<StaffMember> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/staff`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to add staff member: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Staff addition error:", error);
      throw error;
    }
  }

  async updateStaffMember(
    token: string,
    storeId: string,
    staffId: string,
    data: UpdateStaffData
  ): Promise<StaffMember> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/staff/${staffId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to update staff member: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Staff update error:", error);
      throw error;
    }
  }

  async removeStaffMember(
    token: string,
    storeId: string,
    staffId: string
  ): Promise<void> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/staff/${staffId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to remove staff member: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Staff removal error:", error);
      throw error;
    }
  }

  async getStaffMember(
    token: string,
    storeId: string,
    staffId: string
  ): Promise<StaffMember> {
    try {
      // Use proxy to avoid CORS issues
      const url = `/api/proxy/shopping_and_inventory/stores/${storeId}/staff/${staffId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch staff member: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Staff fetch error:", error);
      throw error;
    }
  }
}

export const shoppingInventoryAPI = new ShoppingInventoryAPI();
