import { API_ENDPOINTS } from "@/lib/config/env";

export interface CreateStorePayload {
  name: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  business_hours?: Record<string, any>;
  notification_preferences?: {
    email_new_order?: boolean;
    sms_inventory_low?: boolean;
    low_stock_alerts?: boolean;
    new_order_notifications?: boolean;
    customer_cart_alerts?: boolean;
    staff_notifications?: boolean;
  };
}

export interface StoreResponse {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  business_hours?: {
    Monday: { open: string; close: string };
    Tuesday: { open: string; close: string };
    Wednesday: { open: string; close: string };
    Thursday: { open: string; close: string };
    Friday: { open: string; close: string };
    Saturday: { open: string; close: string };
    Sunday: { open: string; close: string };
  };
  notification_preferences?: {
    email_new_order?: boolean;
    sms_inventory_low?: boolean;
    low_stock_alerts?: boolean;
    new_order_notifications?: boolean;
    customer_cart_alerts?: boolean;
    staff_notifications?: boolean;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Create a new store
 * @param token JWT auth token
 * @param payload Store creation data
 * @returns The created store
 */
export const createStore = async (
  token: string,
  payload: CreateStorePayload
): Promise<StoreResponse> => {
  const response = await fetch(API_ENDPOINTS.SHOPPING.STORES.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(require("../utils").deviceHeadersForContext
        ? require("../utils").deviceHeadersForContext(token)
        : {}),
    },
      credentials: 'include',
      mode: 'cors',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.detail || "Failed to create store"
    );
  }

  return await response.json();
};

/**
 * Get all stores for the authenticated user
 * @param token JWT auth token
 * @returns Array of stores
 */
export const getStores = async (token: string): Promise<StoreResponse[]> => {
  const response = await fetch(API_ENDPOINTS.SHOPPING.STORES.LIST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(require("../utils").deviceHeadersForContext
        ? require("../utils").deviceHeadersForContext(token)
        : {}),
    },
      credentials: 'include',
      mode: 'cors',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.detail || "Failed to fetch stores"
    );
  }

  return await response.json();
};

/**
 * Get store details by ID
 * @param token JWT auth token
 * @param storeId Store ID
 * @returns Store details
 */
export const getStore = async (
  token: string,
  storeId: string
): Promise<StoreResponse> => {
  const response = await fetch(API_ENDPOINTS.SHOPPING.STORES.GET(storeId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(require("../utils").deviceHeadersForContext
        ? require("../utils").deviceHeadersForContext(token)
        : {}),
    },
      credentials: 'include',
      mode: 'cors',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.detail || "Failed to fetch store details"
    );
  }

  return await response.json();
};

/**
 * Update an existing store
 * @param token JWT auth token
 * @param storeId Store ID
 * @param payload Store update data
 * @returns Updated store
 */
export const updateStore = async (
  token: string,
  storeId: string,
  payload: Partial<CreateStorePayload>
): Promise<StoreResponse> => {
  const response = await fetch(API_ENDPOINTS.SHOPPING.STORES.UPDATE(storeId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(require("../utils").deviceHeadersForContext
        ? require("../utils").deviceHeadersForContext(token)
        : {}),
    },
      credentials: 'include',
      mode: 'cors',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.detail || "Failed to update store"
    );
  }

  return await response.json();
};

/**
 * Delete a store
 * @param token JWT auth token
 * @param storeId Store ID
 */
export const deleteStore = async (
  token: string,
  storeId: string
): Promise<void> => {
  const response = await fetch(API_ENDPOINTS.SHOPPING.STORES.DELETE(storeId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(require("../utils").getDeviceIdFromToken(token)
        ? { "X-Device-ID": require("../utils").getDeviceIdFromToken(token)! }
        : {}),
    },
      credentials: 'include',
      mode: 'cors',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.detail || "Failed to delete store"
    );
  }
};
