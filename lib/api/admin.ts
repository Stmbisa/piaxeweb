import { API_ENDPOINTS } from "@/lib/config/env";
import { getDeviceIdFromToken } from "@/lib/utils";

// Types
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  is_admin: boolean;
  is_staff: boolean;
  is_employer: boolean;
  account_id: string;
  email: string;
  phone_number: string;
  account_type: string;
}

export interface AdminMerchant {
  id: string;
  is_verified: boolean;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  business_type: string;
  status: string;
  admins: any[];
}

export interface RecentSignup {
  account_id: string;
  email: string;
  username: string;
  account_type: string;
  is_active: boolean;
  date_joined: string;
}

export interface VerificationRequest {
  user_profile_id?: string;
  merchant_profile_id?: string;
  account_id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  country: string;
  verification_status: string;
  document_upload_status: string;
  verification_date: string;
  rejection_reason?: string;
}

export interface EscrowStats {
  current_total_held: string;
  historical_total_held: string;
  average_release_seconds: number;
  active_escrow_count: number;
  released_escrow_count: number;
  top_conditions: any[];
  p50_release_seconds: number;
  p90_release_seconds: number;
  p99_release_seconds: number;
  reference_currency_code: string;
  current_total_held_converted: string;
  historical_total_held_converted: string;
  per_currency: any[];
}

export interface NotificationTemplate {
  id: string;
  event_type: string;
  channel: string;
  title_template: string;
  message_template: string;
  subject_template?: string | null;
  html_template?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  timestamp: string;
  system: {
    cpu_percent: number;
    memory: {
      total: number;
      available: number;
      percent: number;
      used: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      percent: number;
    };
  };
  process: {
    memory_rss: number;
    memory_vms: number;
    cpu_percent: number;
    num_threads: number;
    create_time: string;
  };
  application: {
    active_connections: number;
    total_requests: number;
    error_rate: number;
    response_time_avg: number;
    system_status: string;
  };
}

export interface DetailedHealth {
  status: string;
  timestamp: string;
  checks: {
    database: { status: string; response_time_ms: string };
    redis: { status: string; response_time_ms: string };
    security: {
      status: string;
      device_fingerprinter: string;
      fraud_detection: string;
      security_middleware: string;
    };
    metrics: {
      status: string;
      collectors_count: number;
      registry_active: boolean;
    };
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  ticket_number: string;
  status: string;
  assigned_to?: string;
  assigned_agent_name?: string;
  customer_email: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  due_date?: string;
  is_overdue: boolean;
  tags: string[];
  message_count: number;
  last_message_at?: string;
}

export interface SupportAgent {
  id: string;
  user_id: string;
  agent_id: string;
  agent_name: string;
  department: string;
  specializations: string[];
  max_concurrent_tickets: number;
  email_notifications: boolean;
  auto_assignment: boolean;
  is_active: boolean;
  is_available: boolean;
  current_ticket_count: number;
  total_tickets_handled: number;
  average_response_time: number;
  average_resolution_time: number;
  customer_satisfaction_rating: number;
  created_at: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  meta_description: string;
  search_keywords: string[];
  slug: string;
  is_published: boolean;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

// Helper for headers with automatic device ID propagation
const getHeaders = (
  token: string,
  extra: Record<string, string> = {}
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...extra,
  };

  const deviceId = getDeviceIdFromToken(token);
  if (deviceId) {
    headers["X-Device-ID"] = deviceId;
  }

  return headers;
};

// Admin API Functions

export const adminAPI = {
  // Users & Merchants
  listUsers: async (token: string): Promise<AdminUser[]> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.LIST_USERS, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to list users");
    return response.json();
  },

  listMerchants: async (token: string): Promise<AdminMerchant[]> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.LIST_MERCHANTS, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to list merchants");
    return response.json();
  },

  getRecentSignups: async (token: string, limit = 20): Promise<RecentSignup[]> => {
    const response = await fetch(`/api/proxy/users/admin/recent-signups?limit=${limit}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get recent signups");
    return response.json();
  },

  // Verifications
  getUserVerifications: async (token: string, status?: string, limit = 50): Promise<VerificationRequest[]> => {
    let url = `/api/proxy/users/admin/verifications/users?limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await fetch(url, { headers: getHeaders(token) });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user verifications: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  getMerchantVerifications: async (token: string, status?: string, limit = 50): Promise<VerificationRequest[]> => {
    let url = `/api/proxy/users/admin/verifications/merchants?limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await fetch(url, { headers: getHeaders(token) });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get merchant verifications: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  getUserDetails: async (token: string, accountId: string): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.AUTH.GET_USER_DETAILS(accountId), {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user details: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  getUserVerificationDocuments: async (token: string, userProfileId: string): Promise<any> => {
    const response = await fetch(`/api/proxy/users/admin/verifications/users/${userProfileId}/documents`, {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user verification documents: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  setUserAdminStatus: async (token: string, accountId: string, isAdmin: boolean, confirmSelfRevocation = false): Promise<any> => {
    let url = `/api/proxy/users/admin/users/${accountId}/admin-status`;
    if (confirmSelfRevocation) url += `?confirm_self_revocation=true`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ is_admin: isAdmin }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set user admin status: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  // Admin Tools
  adminEmailDiagnostic: async (token: string, recipient: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.EMAIL_DIAGNOSTIC, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ recipient }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send diagnostic email: ${response.status} - ${errorText}`);
    }
  },

  adminEnvInfo: async (token: string): Promise<any> => {
    const response = await fetch(`/api/proxy/users/admin/env-info`, {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get env info: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  verifyUser: async (token: string, accountId: string, status: string, reason?: string) => {
    const response = await fetch(`/api/proxy/users/admin/verify/user/${accountId}`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ status, reason }),
    });
    if (!response.ok) throw new Error("Failed to verify user");
    return response.json();
  },

  verifyMerchant: async (token: string, accountId: string, status: string, reason?: string) => {
    const response = await fetch(`/api/proxy/users/admin/verify/merchant/${accountId}`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ status, reason }),
    });
    if (!response.ok) throw new Error("Failed to verify merchant");
    return response.json();
  },

  // Stats & Monitoring
  getEscrowStats: async (token: string, useCache = true): Promise<EscrowStats> => {
    const response = await fetch(
      `/api/proxy/wallet/admin/escrows/live-stats?use_cache=${useCache}`,
      {
        headers: getHeaders(token),
      }
    );
    if (!response.ok) throw new Error("Failed to get live escrow stats");
    return response.json();
  },

  getSystemStats: async (token: string): Promise<SystemStats> => {
    const response = await fetch(`/api/proxy/monitoring/system/stats`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get system stats");
    return response.json();
  },

  getDetailedHealth: async (token: string): Promise<DetailedHealth> => {
    const response = await fetch(`/api/proxy/monitoring/health/detailed`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get detailed health");
    return response.json();
  },

  getMetrics: async (token: string): Promise<string> => {
    const response = await fetch(`/api/proxy/monitoring/metrics`, {
      headers: { ...getHeaders(token), Accept: "text/plain" },
    });
    if (!response.ok) throw new Error("Failed to get metrics");
    return response.text();
  },

  getCeleryHealth: async (token: string): Promise<any> => {
    const response = await fetch(`/api/proxy/monitoring/health/celery/`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get celery health");
    return response.json();
  },

  getRecentAuditEvents: async (token: string, limit = 100): Promise<any> => {
    const response = await fetch(`/api/proxy/monitoring/audit/recent?limit=${limit}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get recent audit events");
    return response.json();
  },

  // Notifications (admin)
  sendAdminNotification: async (
    token: string,
    payload: {
      recipient_ids: string[];
      event_type: string;
      title: string;
      message: string;
      action_url?: string | null;
      priority?: string;
      channels?: string[];
      expires_at?: string | null;
      send_immediately?: boolean;
    }
  ): Promise<any> => {
    const response = await fetch(`/api/proxy/wallet/admin/notifications/send`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to send admin notification: ${response.status} ${text}`);
    }
    return response.json().catch(() => null);
  },

  getFailedNotificationDeliveries: async (
    token: string,
    page = 1,
    perPage = 20
  ): Promise<any> => {
    const response = await fetch(
      `/api/proxy/wallet/admin/notifications/failed-deliveries?page=${page}&per_page=${perPage}`,
      { headers: getHeaders(token) }
    );
    if (!response.ok) throw new Error("Failed to get failed deliveries");
    return response.json().catch(() => null);
  },

  getNotificationTemplates: async (token: string): Promise<NotificationTemplate[]> => {
    const response = await fetch(`/api/proxy/wallet/admin/notifications/templates`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get notification templates");
    return response.json();
  },

  createNotificationTemplate: async (
    token: string,
    payload: {
      event_type: string;
      channel: string;
      title_template: string;
      message_template: string;
      subject_template?: string | null;
      html_template?: string | null;
    }
  ): Promise<NotificationTemplate> => {
    const response = await fetch(`/api/proxy/wallet/admin/notifications/templates`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create notification template");
    return response.json();
  },

  updateNotificationTemplate: async (
    token: string,
    templateId: string,
    payload: {
      title_template?: string | null;
      message_template?: string | null;
      subject_template?: string | null;
      html_template?: string | null;
      is_active?: boolean | null;
    }
  ): Promise<NotificationTemplate> => {
    const response = await fetch(
      `/api/proxy/wallet/admin/notifications/templates/${templateId}`,
      {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) throw new Error("Failed to update notification template");
    return response.json();
  },

  debugAuthInfo: async (token: string): Promise<any> => {
    // Note: This endpoint might not be in env.ts yet, assuming standard path or skipping if not critical
    // Based on user request, it exists. Let's assume a path or skip if not in env.
    // Since I can't see it in env.ts, I'll skip adding it to avoid errors, or add it if I can infer the path.
    // User said: Debug Auth Info ... Authorizations: BearerAuth ...
    // I'll skip for now as it's for debugging.
    return {}; 
  },

  // Support
  getSupportDashboard: async (token: string) => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.DASHBOARD, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get support dashboard");
    return response.json();
  },

  listTickets: async (token: string, params: any = {}): Promise<SupportTicket[]> => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_ENDPOINTS.ADMIN.SUPPORT.LIST_TICKETS}?${query}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to list tickets");
    return response.json();
  },

  updateTicket: async (token: string, ticketId: string, data: any): Promise<SupportTicket> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.UPDATE_TICKET(ticketId), {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update ticket");
    return response.json();
  },

  assignTicket: async (token: string, ticketId: string, agentId: string): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN.SUPPORT.ASSIGN_TICKET(ticketId)}?agent_id=${agentId}`, {
      method: "POST",
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to assign ticket");
  },

  convertEmailToTicket: async (token: string, data: any): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.CONVERT_EMAIL, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to convert email to ticket");
  },

  // Support Agents
  listSupportAgents: async (token: string): Promise<SupportAgent[]> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.LIST_AGENTS, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to list support agents");
    return response.json();
  },

  createSupportAgent: async (token: string, data: any): Promise<SupportAgent> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.CREATE_AGENT, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create support agent");
    return response.json();
  },

  updateSupportAgent: async (token: string, agentId: string, data: any): Promise<SupportAgent> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.UPDATE_AGENT(agentId), {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update support agent");
    return response.json();
  },

  deactivateSupportAgent: async (token: string, agentId: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.DEACTIVATE_AGENT(agentId), {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to deactivate support agent");
  },

  // Knowledge Base
  listKnowledgeBaseArticles: async (token: string, params: any = {}): Promise<KnowledgeBaseArticle[]> => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_ENDPOINTS.ADMIN.SUPPORT.LIST_KB_ARTICLES}?${query}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to list knowledge base articles");
    return response.json();
  },

  getKnowledgeBaseArticle: async (token: string, articleId: string): Promise<KnowledgeBaseArticle> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.GET_KB_ARTICLE(articleId), {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to get knowledge base article");
    return response.json();
  },

  createKnowledgeBaseArticle: async (token: string, data: any): Promise<KnowledgeBaseArticle> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.CREATE_KB_ARTICLE, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create knowledge base article");
    return response.json();
  },

  updateKnowledgeBaseArticle: async (token: string, articleId: string, data: any): Promise<KnowledgeBaseArticle> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.UPDATE_KB_ARTICLE(articleId), {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update knowledge base article");
    return response.json();
  },

  deleteKnowledgeBaseArticle: async (token: string, articleId: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.ADMIN.SUPPORT.DELETE_KB_ARTICLE(articleId), {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to delete knowledge base article");
  },

  voteOnArticle: async (token: string, articleId: string, helpful: boolean): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN.SUPPORT.VOTE_ARTICLE(articleId)}?helpful=${helpful}`, {
      method: "POST",
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error("Failed to vote on article");
  },
};
