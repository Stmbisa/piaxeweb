/**
 * Environment configuration for the application
 * Contains API URLs and other environment-specific values
 */

// Base API URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ImageKit configuration
export const IMAGEKIT_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
  URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  AUTHENTICATION_ENDPOINT: `${API_BASE_URL}/api/imagekit-auth`,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: `${API_BASE_URL}/users/signup`,
    LOGIN: `${API_BASE_URL}/users/token`,
    REFRESH_TOKEN: `${API_BASE_URL}/users/refresh`,
    LOGOUT: `${API_BASE_URL}/users/logout`,
    VERIFY_OTP: `${API_BASE_URL}/users/verify-otp`,
    ACTIVATE: `${API_BASE_URL}/users/activate`,
    ME: `${API_BASE_URL}/users/me`,
    REQUEST_NEW_OTP: `${API_BASE_URL}/users/request-new-otp`,
    REQUEST_PASSWORD_RESET: `${API_BASE_URL}/users/request_password_reset`,
    RESET_PASSWORD: `${API_BASE_URL}/users/reset_password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change_password`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/users/me`,
    DELETE_ACCOUNT: `${API_BASE_URL}/users/accounts/me`,
    CREATE_PIN: `${API_BASE_URL}/users/create_pin`,
    VALIDATE_PIN: `${API_BASE_URL}/users/validate_api_access/`,
    INVALIDATE_PIN: `${API_BASE_URL}/users/api-access/invalidate`,
    CHANGE_PIN: `${API_BASE_URL}/users/change_pin`,
    VERIFY_USER: `${API_BASE_URL}/users/verify/user`,
    GET_USER_DETAILS: (userId: string) =>
      `${API_BASE_URL}/users/users/${userId}`,
    // Payment Methods
    LIST_PAYMENT_METHODS: `${API_BASE_URL}/users/payment-methods`,
    ADD_PAYMENT_METHOD: `${API_BASE_URL}/users/payment-methods`,
    UPDATE_PAYMENT_METHOD: (payment_method_id: string) =>
      `${API_BASE_URL}/users/payment-methods/${payment_method_id}`,
    DELETE_PAYMENT_METHOD: (payment_method_id: string) =>
      `${API_BASE_URL}/users/payment-methods/${payment_method_id}`,
    GET_PAYMENT_METHOD_DETAIL: (payment_method_id: string) =>
      `${API_BASE_URL}/users/payment-methods/${payment_method_id}`,
  },

  WALLET: {
    CREATE: `${API_BASE_URL}/wallet/wallet/create`,
    GET_CURRENCIES: `${API_BASE_URL}/wallet/currencies`,
    LIST_WALLETS: `${API_BASE_URL}/wallet/wallets/`,
    GET_WALLET_DETAIL: (id: string) => `${API_BASE_URL}/wallet/wallets/${id}/`,
    GET_BALANCE: `${API_BASE_URL}/wallet/balance`,
    GET_TRANSACTIONS: `${API_BASE_URL}/wallet/transactions`,
    GET_LAST_TRANSACTION: (currency_code: string) =>
      `${API_BASE_URL}/wallet/transactions?currency=${currency_code}&limit=1&offset=0`,
    TRANSFERS: `${API_BASE_URL}/wallet/transfers`,
    DEPOSITS: `${API_BASE_URL}/wallet/deposits`,
    WITHDRAWALS: `${API_BASE_URL}/wallet/withdrawals`,
    CREATE_DEPOSIT: `${API_BASE_URL}/wallet/deposits`,
    LIST_DEPOSITS: `${API_BASE_URL}/wallet/deposits`,
    GET_DEPOSIT_DETAIL: (id: string) => `${API_BASE_URL}/wallet/deposits/${id}`,
    SEARCH_USERS: `${API_BASE_URL}/users/search`,
    CREATE_WITHDRAWAL: `${API_BASE_URL}/wallet/withdrawals`,
    LIST_WITHDRAWALS: `${API_BASE_URL}/wallet/withdrawals`,
    GET_WITHDRAWAL_DETAIL: (id: string) =>
      `${API_BASE_URL}/wallet/withdrawals/${id}`,
  },

  ESCROW: {
    CREATE: `${API_BASE_URL}/wallet/escrows/`,
    CREATE_EMAIL_PHONE: `${API_BASE_URL}/wallet/escrows/send`,
    CREATE_PURCHASE: `${API_BASE_URL}/wallet/escrows/purchase`,
    FULFILL_TERM: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/fulfill-term`,
    FULFILL_TERM_UNREGISTERED: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/fulfill-term-unregistered`,
    RELEASE: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/release`,
    REVERSE: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/reverse`,
    LIST_SENT: `${API_BASE_URL}/wallet/escrows/sent/`,
    LIST_RECEIVED: `${API_BASE_URL}/wallet/escrows/received/`,
    GET_DETAILS: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}`,
    CANCEL: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/cancel`,
    COMPLETE: (escrow_id: string) =>
      `${API_BASE_URL}/wallet/escrows/${escrow_id}/complete`,
    CREATE_BULK: `${API_BASE_URL}/wallet/bulk-escrows/`,
  },

  PAYMENTS: {
    CREATE: `${API_BASE_URL}/payments/payments`,
    LIST: `${API_BASE_URL}/payments/payments`,
    GET_DETAILS: (payment_id: string) =>
      `${API_BASE_URL}/payments/payments/${payment_id}`,
    CREATE_REQUEST: `${API_BASE_URL}/payments/payment-requests/create`,
    PAY_REQUEST: (request_id: string) =>
      `${API_BASE_URL}/payments/payment-requests/${request_id}/pay`,
    PAY_WITH_QR: (qr_token: string) =>
      `${API_BASE_URL}/payments/payments/qr/${qr_token}`,
    LIST_REQUESTS: `${API_BASE_URL}/payments/payment-requests`,
    GET_REQUEST_DETAILS: (request_id: string) =>
      `${API_BASE_URL}/payments/payment-requests/${request_id}`,
    PAYMENT_REQUESTS: `${API_BASE_URL}/payments/payment-requests`,
    RECEIVED_PAYMENT_REQUESTS: `${API_BASE_URL}/payments/payment-requests/received`,
  },

  SHOPPING: {
    ALL_STORES: `${API_BASE_URL}/shopping_and_inventory/all-stores`,
    STORES: {
      CREATE: `${API_BASE_URL}/shopping_and_inventory/stores`,
      LIST: `${API_BASE_URL}/shopping_and_inventory/stores`,
      GET: (store_id: string) =>
        `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}`,
      UPDATE: (store_id: string) =>
        `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}`,
      DELETE: (store_id: string) =>
        `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}`,
      STAFF: {
        LIST: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/staff`,
        CREATE: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/staff`,
        UPDATE: (store_id: string, staff_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/staff/${staff_id}`,
        DELETE: (store_id: string, staff_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/staff/${staff_id}`,
        DETAILS: (store_id: string, staff_account_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/staff/${staff_account_id}`,
      },
      PRODUCTS: {
        LIST: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products`,
        CREATE: `${API_BASE_URL}/shopping_and_inventory/products`,
        UPDATE: (store_id: string, product_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/${product_id}`,
        DELETE: (store_id: string, product_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/${product_id}`,
        GET: (store_id: string, product_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/${product_id}`,
        BATCH: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/batch`,
        IMPORT: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/import`,
        IMPORT_STATUS: (store_id: string, task_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/import/${task_id}/status`,
        SCAN: (store_id: string) =>
          `${API_BASE_URL}/shopping_and_inventory/stores/${store_id}/products/scan`,
      },
    },
  },

  CRM: {
    CONTACTS: `${API_BASE_URL}/crm/contacts`,
    CONTACTS_IMPORT: `${API_BASE_URL}/crm/contacts/import`,
    CONTACT_IMPORT_JOB_STATUS: (job_id: string) =>
      `${API_BASE_URL}/crm/import/${job_id}/status`,
    CONTACT_DETAIL: (contact_id: string) =>
      `${API_BASE_URL}/crm/contacts/${contact_id}`,
    APPOINTMENTS: `${API_BASE_URL}/crm/appointments`,
    APPOINTMENT_DETAIL: (appointment_id: string) =>
      `${API_BASE_URL}/crm/appointments/${appointment_id}`,
    EVENTS: `${API_BASE_URL}/crm/events`,
    EVENT_DETAIL: (event_id: string) =>
      `${API_BASE_URL}/crm/events/${event_id}`,
    REMINDERS: `${API_BASE_URL}/crm/reminders`,
    REMINDER_DETAIL: (reminder_id: string) =>
      `${API_BASE_URL}/crm/reminders/${reminder_id}`,
    TEMPLATES: `${API_BASE_URL}/crm/templates`,
    TEMPLATE_DETAIL: (template_id: string) =>
      `${API_BASE_URL}/crm/templates/${template_id}`,
    DOCUMENTS: `${API_BASE_URL}/crm/documents`,
    DOCUMENT_DETAIL: (document_id: string) =>
      `${API_BASE_URL}/crm/documents/${document_id}`,
    LEADS: `${API_BASE_URL}/crm/leads`,
    LEAD_DETAIL: (lead_id: string) => `${API_BASE_URL}/crm/leads/${lead_id}`,
    CAMPAIGNS: `${API_BASE_URL}/crm/campaigns`,
    CAMPAIGN_DETAIL: (campaign_id: string) =>
      `${API_BASE_URL}/crm/campaigns/${campaign_id}`,
    CAMPAIGNS_EMAIL: `${API_BASE_URL}/crm/campaigns/email`,
    CAMPAIGNS_SMS: `${API_BASE_URL}/crm/campaigns/sms`,
    CAMPAIGNS_VOICE: `${API_BASE_URL}/crm/campaigns/voice`,
  },
};

// API request timeout in milliseconds
export const API_TIMEOUT = 30000;

// Environment configuration
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};

// Other configurations
export const CONFIG = {
  // Add any other configuration values here
  DEFAULT_CURRENCY: "UGX",
  DEFAULT_LANGUAGE: "en",
  APP_NAME: "Piaxis",
};
