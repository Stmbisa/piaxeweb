// Support API utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.gopiaxis.com';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  assigned_agent_name?: string;
  customer_email?: string;
  customer_name?: string;
  created_at: string;
  updated_at: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  due_date?: string;
  is_overdue: boolean;
  tags: string[];
  message_count?: number;
  last_message_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  message_type: MessageType;
  is_public: boolean;
  sender_id?: string;
  sender_name?: string;
  sender_email?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  message_id?: string;
  filename: string;
  original_filename: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  attachment_type: AttachmentType;
  uploaded_by?: string;
  uploaded_at: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: TicketCategory;
  tags: string[];
  slug: string;
  meta_description?: string;
  search_keywords: string[];
  is_published: boolean;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  author_id: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  WAITING_FOR_CUSTOMER = "waiting_for_customer",
  RESOLVED = "resolved",
  CLOSED = "closed",
  ESCALATED = "escalated",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
  CRITICAL = "critical",
}

export enum TicketCategory {
  GENERAL = "general",
  PAYMENT_ISSUE = "payment_issue",
  ACCOUNT_ACCESS = "account_access",
  TECHNICAL_SUPPORT = "technical_support",
  BILLING = "billing",
  MERCHANT_SUPPORT = "merchant_support",
  API_SUPPORT = "api_support",
  SECURITY_CONCERN = "security_concern",
  FEATURE_REQUEST = "feature_request",
  BUG_REPORT = "bug_report",
}

export enum MessageType {
  USER_MESSAGE = "user_message",
  AGENT_REPLY = "agent_reply",
  SYSTEM_NOTE = "system_note",
  EMAIL_MESSAGE = "email_message",
}

export enum AttachmentType {
  IMAGE = "image",
  DOCUMENT = "document",
  SCREENSHOT = "screenshot",
  LOG_FILE = "log_file",
  OTHER = "other",
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  guest_email?: string;
  guest_name?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  related_payment_id?: string;
  related_wallet_id?: string;
  related_escrow_id?: string;
}

export interface CreateMessageData {
  content: string;
  message_type?: MessageType;
  is_public?: boolean;
  metadata?: Record<string, any>;
}

export interface TicketListQuery {
  status?: TicketStatus;
  category?: TicketCategory;
  priority?: TicketPriority;
  assigned_to?: string;
  created_after?: string;
  created_before?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface SupportStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  overdue_tickets: number;
  avg_response_time?: number;
  avg_resolution_time?: number;
}

class SupportAPI {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Customer Support Endpoints
  async createTicket(
    data: CreateTicketData,
    token?: string
  ): Promise<SupportTicket> {
    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to create ticket");
      }

      return await response.json();
    } catch (error) {
      console.error("Create ticket error:", error);
      throw error;
    }
  }

  async getTickets(
    query: TicketListQuery = {},
    token: string
  ): Promise<SupportTicket[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/support/tickets?${params.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch tickets");
      }

      return await response.json();
    } catch (error) {
      console.error("Get tickets error:", error);
      throw error;
    }
  }

  async getTicket(ticketId: string, token: string): Promise<SupportTicket> {
    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch ticket");
      }

      return await response.json();
    } catch (error) {
      console.error("Get ticket error:", error);
      throw error;
    }
  }

  async addMessage(
    ticketId: string,
    data: CreateMessageData,
    token: string
  ): Promise<TicketMessage> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
        {
          method: "POST",
          headers: this.getHeaders(token),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to add message");
      }

      return await response.json();
    } catch (error) {
      console.error("Add message error:", error);
      throw error;
    }
  }

  async getMessages(ticketId: string, token: string): Promise<TicketMessage[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch messages");
      }

      return await response.json();
    } catch (error) {
      console.error("Get messages error:", error);
      throw error;
    }
  }

  async uploadAttachment(
    ticketId: string,
    file: File,
    token: string,
    messageId?: string
  ): Promise<TicketAttachment> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (messageId) {
        formData.append("message_id", messageId);
      }

      const response = await fetch(
        `${API_BASE_URL}/support/tickets/${ticketId}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to upload attachment");
      }

      return await response.json();
    } catch (error) {
      console.error("Upload attachment error:", error);
      throw error;
    }
  }

  // Knowledge Base Endpoints
  async getKnowledgeBaseArticles(
    category?: TicketCategory,
    search?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<KnowledgeBaseArticle[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        published_only: "true",
      });

      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await fetch(
        `${API_BASE_URL}/support/knowledge-base?${params.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch articles");
      }

      return await response.json();
    } catch (error) {
      console.error("Get knowledge base articles error:", error);
      throw error;
    }
  }

  async getKnowledgeBaseArticle(articleId: string): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support/knowledge-base/${articleId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch article");
      }

      return await response.json();
    } catch (error) {
      console.error("Get knowledge base article error:", error);
      throw error;
    }
  }

  async voteOnArticle(
    articleId: string,
    helpful: boolean
  ): Promise<{ helpful_votes: number; not_helpful_votes: number; total_votes: number }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support/knowledge-base/${articleId}/vote?helpful=${helpful}`,
        {
          method: "POST",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to vote on article");
      }

      return await response.json();
    } catch (error) {
      console.error("Vote on article error:", error);
      throw error;
    }
  }

  // Admin/Agent Endpoints (require appropriate permissions)
  async getAllTickets(
    query: TicketListQuery = {},
    token: string
  ): Promise<SupportTicket[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/support/admin/tickets?${params.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch all tickets");
      }

      return await response.json();
    } catch (error) {
      console.error("Get all tickets error:", error);
      throw error;
    }
  }

  async getSupportDashboard(token: string): Promise<{
    stats: SupportStats;
    recent_tickets: SupportTicket[];
    overdue_tickets: SupportTicket[];
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/support/admin/dashboard`, {
        method: "GET",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || "Failed to fetch dashboard");
      }

      return await response.json();
    } catch (error) {
      console.error("Get support dashboard error:", error);
      throw error;
    }
  }
}

export const supportAPI = new SupportAPI();
