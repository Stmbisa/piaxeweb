/**
 * Product Service for handling product-related API operations
 * Separate from shopping-inventory.ts to make the code more modular
 */

// Type definitions based on mobile app's implementation
export interface BatchProductInput {
  name: string;
  description: string;
  base_price: number;
  currency: string;
  category_id: string;
  location_id: string;
  sku: string;
  code: string;
  code_type: string;
  image_url: string;
  image_file_id: string;
  expiry_date: string;
  is_ecommerce_enabled: boolean;
  quantity: number;
  images?: string[]; // Array of image URLs
}

// Add ScanProductInput interface similar to mobile implementation
export interface ScanProductInput {
  code?: string;
  location_id?: string;
  code_type?: string;
  name?: string;
  description?: string;
  base_price?: number;
  currency?: string;
  category_id?: string;
  images?: string[];
  store_category_id?: string;
  sku?: string;
  qr_code?: string;
  barcode?: string;
  is_ecommerce_enabled?: boolean;
}

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

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  store_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: ProductCategory[];
}

export interface Product {
  id: string;
  product_id: string;
  name: string;
  description: string;
  sku: string | null;
  barcode: string | null;
  product_code: string | null;
  piaxe_token: string | null;
  qr_code: string | null;
  external_qr_code: string | null;
  category: ProductCategory | null;
  base_price: string;
  manual_price: string | null;
  currency: string;
  store_price: string | null;
  in_stock_quantity: number;
  total_quantity_in_store: number;
  low_stock_threshold: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  specifications: Record<string, any>;
  variants: any[];
  location: ProductLocation;
  quantity: number;
}

export interface ProductResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

/**
 * Add multiple products in a batch
 * @param token User auth token
 * @param storeId Store ID
 * @param products Array of product data to add
 * @returns Promise with the API response
 */
export const batchAddProducts = async (
  token: string,
  storeId: string,
  products: BatchProductInput[]
): Promise<Product[]> => {
  try {
    console.log("Adding batch of products:", {
      storeId,
      productsCount: products.length,
    });

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const endpoint = `${API_URL}/shopping_and_inventory/stores/${storeId}/products/batch`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(products),
    });

    if (!response.ok) {
      let errorMessage = `Failed to add products. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch (e) {
        // Unable to parse error as JSON, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Successfully added products:", {
      count: data.length || "unknown",
    });

    return data;
  } catch (error: any) {
    console.error("Batch add products error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Failed to add products");
  }
};

/**
 * Add a product using barcode scanning
 * @param token User auth token
 * @param storeId Store ID
 * @param productData Product data to add
 * @returns Promise with the API response
 */
export const scanProduct = async (
  token: string,
  storeId: string,
  productData: ScanProductInput
): Promise<Product> => {
  try {
    console.log("Scanning and adding product:", {
      storeId,
      productData,
    });

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const endpoint = `${API_URL}/shopping_and_inventory/stores/${storeId}/products/scan`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      let errorMessage = `Failed to scan and add product. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch (e) {
        // Unable to parse error as JSON, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Successfully scanned and added product:", data);

    return data;
  } catch (error: any) {
    console.error("Scan product error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Failed to scan and add product");
  }
};

/**
 * Get store locations
 * @param token User auth token
 * @param storeId Store ID
 * @returns Promise with the store locations
 */
export const getStoreLocations = async (
  token: string,
  storeId: string
): Promise<ProductLocation[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const endpoint = `${API_URL}/shopping_and_inventory/stores/${storeId}/locations`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get store locations. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching store locations:", error);
    throw new Error(error.message || "Failed to fetch store locations");
  }
};

/**
 * Get product categories
 * @param token User auth token
 * @returns Promise with the categories
 */
export const getProductCategories = async (
  token: string
): Promise<ProductCategory[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const endpoint = `${API_URL}/shopping_and_inventory/categories`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get product categories. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Error fetching product categories:", error);
    return []; // Return empty array on error
  }
};
