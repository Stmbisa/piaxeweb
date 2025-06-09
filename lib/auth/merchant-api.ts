// Merchant authentication API functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.piaxe.com'

export interface MerchantRegistrationData {
  business_name: string;
  email: string; // Business email
  phone: string; // Business phone
  address: string; // Business address
  website: string;
  business_type: string;
}

export interface MerchantLoginData {
  username: string
  password: string
}

export interface MerchantProfile {
  id: string; // Unique merchant identifier
  api_key?: string; // API key, available after fetching profile
  business_name: string;
  email: string; // Business email
  phone: string; // Business phone
  address: string; // Business address
  website: string;
  business_type: string;
  is_verified: boolean; // Verification status
  created_at: string; // Timestamp of creation
  client_id?: string; // Client ID for API usage
}

export interface ApiKeyResetData {
  current_password: string
  new_api_key?: string
}

export interface ClientIdResetData {
  current_password: string
}

export interface WebhookData {
  url: string
  events: string[]
  description?: string
}

// Register new merchant
export async function registerMerchant(data: MerchantRegistrationData) {
  const response = await fetch(`${API_BASE_URL}/users/merchants/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }

  return response.json()
}

// Login merchant
export async function loginMerchant(data: MerchantLoginData) {
  const response = await fetch(`${API_BASE_URL}/users/merchants/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
}

// Get merchant profile
export async function getMerchantProfile(token: string): Promise<MerchantProfile> {
  const response = await fetch(`${API_BASE_URL}/users/merchant/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch profile')
  }

  return response.json()
}

// Add admin to merchant account
export async function addMerchantAdmin(merchantId: string, adminData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchants/${merchantId}/add_admin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to add admin')
  }

  return response.json()
}

// Request API key reset
export async function requestApiKeyReset(data: ApiKeyResetData, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/api-key/reset`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API key reset failed')
  }

  return response.json()
}

// Confirm API key reset
export async function confirmApiKeyReset(confirmationCode: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/api-key/reset/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ confirmation_code: confirmationCode }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API key reset confirmation failed')
  }

  return response.json()
}

// Reset client ID
export async function resetClientId(data: ClientIdResetData, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchants/client-id/reset`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Client ID reset failed')
  }

  return response.json()
}

// Get client ID
export async function getClientId(token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchants/client-id`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get client ID')
  }

  return response.json()
}

// Create webhook
export async function createWebhook(data: WebhookData, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/webhooks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Webhook creation failed')
  }

  return response.json()
}

// List webhooks
export async function listWebhooks(token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/webhooks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to list webhooks')
  }

  return response.json()
}

// Update webhook
export async function updateWebhook(webhookId: string, data: Partial<WebhookData>, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/webhooks/${webhookId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Webhook update failed')
  }

  return response.json()
}

// Delete webhook
export async function deleteWebhook(webhookId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/webhooks/${webhookId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Webhook deletion failed')
  }

  return response.json()
}

// Verify merchant
export async function verifyMerchant(merchantId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/merchant/verify/${merchantId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Merchant verification failed')
  }

  return response.json()
}
