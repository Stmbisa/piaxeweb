import {
  MerchantRegistrationData,
  MerchantProfile,
  registerMerchant,
} from "./merchant-api";

// Authentication API utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piaxe.me';

export interface User {
  id: string;
  account_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  account_type: string;
  payment_qr: {
    token: string;
    type: string;
  };
  is_verified: boolean;
  has_api_pin: boolean;
  avatar: string | null;
  developer_profile?: {
    developer_name: string;
    developer_id: string;
    api_key?: string;
    client_id?: string;
    webhook_url?: string;
    status: "active" | "inactive" | "pending";
  };
  business_profile?: {
    business_name: string;
    business_id: string;
    business_type: string;
    business_phone: string;
    business_email: string;
    business_address: string;
    status: "active" | "inactive" | "pending";
    setup_complete?: boolean;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType: "individual" | "business";
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

class AuthAPI {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/token`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        account_type: data.accountType === "individual" ? "user" : "merchant",
      };
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        let errorMessage = `Registration failed with status: ${response.status}`;
        try {
          errorData = await response.json();
          if (errorData && errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData && typeof errorData === "object") {
            errorMessage = JSON.stringify(errorData);
          } else if (typeof errorData === "string") {
            errorMessage = errorData; // If errorData itself is a string
          }
        } catch (jsonError) {
          // If .json() fails, try to get response as text
          try {
            const textError = await response.text();
            if (textError) {
              errorMessage = textError;
            }
          } catch (textParseError) {
            // If .text() also fails, stick to the status code message
            console.error(
              "Failed to parse error response as JSON or text:",
              textParseError
            );
          }
        }

        // Attempt to parse errorMessage if it's a JSON string containing 'detail'
        try {
          const parsedMessage = JSON.parse(errorMessage);
          if (parsedMessage && parsedMessage.detail) {
            errorMessage = parsedMessage.detail;
          }
        } catch (e) {
          // Not a JSON string or no 'detail' field, keep errorMessage as is
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        headers: this.getHeaders(token),
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Don't throw on logout errors
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Token refresh failed (${response.status})`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Token refresh error:", error);
      // If it's a network error, provide a more helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to refresh authentication. Please check your connection.');
      }
      throw error;
    }
  }

  async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Failed to get user profile (${response.status})`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Profile fetch error:", error);
      // If it's a network error, provide a more helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to fetch user profile. Please check your connection.');
      }
      throw error;
    }
  }

  async verifyEmail(token: string, verificationCode: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-email`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify({ verificationCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Email verification failed");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password reset request failed");
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      throw error;
    }
  }

  // Developer API credentials management (developers are merchants in the backend)
  async resetDeveloperApiKey(token: string): Promise<{ request_id: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/merchant/api-key/reset`,
        {
          method: "POST",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API key reset request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Developer API key reset error:", error);
      throw error;
    }
  }

  async confirmDeveloperApiKeyReset(
    token: string,
    requestId: string,
    confirmationCode: string
  ): Promise<{ api_key: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/merchant/api-key/confirm`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify({
            request_id: requestId,
            confirmation_code: confirmationCode,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API key confirmation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Developer API key confirmation error:", error);
      throw error;
    }
  }

  async resetDeveloperClientId(
    token: string,
    password: string
  ): Promise<{ client_id: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/merchants/client-id/reset`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Client ID reset failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Developer Client ID reset error:", error);
      throw error;
    }
  }

  // Business account management
  async createBusinessAccount(
    token: string,
    businessData: {
      business_name: string;
      business_type: string;
      business_email: string;
      business_phone: string;
      business_address: string;
    }
  ): Promise<any> {
    try {
      // Import the shopping inventory API for store creation
      const { shoppingInventoryAPI } = await import(
        "../api/shopping-inventory"
      );

      // Create a store directly using the shopping inventory API
      // This is the primary business entity in the system
      const storeData = {
        name: `${businessData.business_name} - Main Store`,
        description: `Main location for ${businessData.business_name}`,
        address: businessData.business_address,
        contact_email: businessData.business_email,
        contact_phone: businessData.business_phone,
        business_hours: {
          Monday: { open: "09:00", close: "17:00" },
          Tuesday: { open: "09:00", close: "17:00" },
          Wednesday: { open: "09:00", close: "17:00" },
          Thursday: { open: "09:00", close: "17:00" },
          Friday: { open: "09:00", close: "17:00" },
          Saturday: { open: "10:00", close: "16:00" },
          Sunday: { open: "closed", close: "closed" },
        },
        notification_preferences: {
          email_notifications: true,
          sms_notifications: false,
          marketing_notifications: false,
        },
      };

      const store = await shoppingInventoryAPI.createStore(token, storeData);

      // Return store information in a format compatible with business profile
      return {
        business_name: businessData.business_name,
        business_type: businessData.business_type,
        business_email: businessData.business_email,
        business_phone: businessData.business_phone,
        business_address: businessData.business_address,
        store_id: store.id,
        store: store,
      };
    } catch (error) {
      console.error("Business account creation error:", error);
      throw error;
    }
  }

  async getBusinessProfile(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/business/profile`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch business profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Business profile fetch error:", error);
      throw error;
    }
  }

  // Developer account management (developers are merchants in the backend)
  async createDeveloperAccount(
    token: string,
    developerData: MerchantRegistrationData
  ): Promise<MerchantProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/merchants/register`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify(developerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Developer account creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Developer account creation error:", error);
      throw error;
    }
  }

  async getDeveloperProfile(token: string): Promise<MerchantProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/merchant/profile`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch developer profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Developer profile fetch error:", error);
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();
