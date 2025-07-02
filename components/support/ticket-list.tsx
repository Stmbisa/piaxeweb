"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { supportAPI, SupportTicket, TicketStatus, TicketPriority, TicketCategory } from "@/lib/api/support";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Loader2
} from "lucide-react";
import { TicketDetailsDialog } from "./ticket-details-dialog";
import { CreateTicketDialog } from "./create-ticket-dialog";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  [TicketStatus.OPEN]: {
    label: "Open",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: MessageSquare,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    icon: Clock,
  },
  [TicketStatus.WAITING_FOR_CUSTOMER]: {
    label: "Waiting for You",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: AlertTriangle,
  },
  [TicketStatus.RESOLVED]: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    icon: CheckCircle,
  },
  [TicketStatus.CLOSED]: {
    label: "Closed",
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    icon: CheckCircle,
  },
  [TicketStatus.ESCALATED]: {
    label: "Escalated",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
};

const PRIORITY_CONFIG = {
  [TicketPriority.LOW]: {
    label: "Low",
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  },
  [TicketPriority.MEDIUM]: {
    label: "Medium",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  [TicketPriority.HIGH]: {
    label: "High",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  [TicketPriority.URGENT]: {
    label: "Urgent",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  [TicketPriority.CRITICAL]: {
    label: "Critical",
    color: "bg-red-600/10 text-red-700 dark:text-red-300",
  },
};

const CATEGORY_LABELS = {
  [TicketCategory.GENERAL]: "General",
  [TicketCategory.PAYMENT_ISSUE]: "Payment Issue",
  [TicketCategory.ACCOUNT_ACCESS]: "Account Access",
  [TicketCategory.TECHNICAL_SUPPORT]: "Technical Support",
  [TicketCategory.BILLING]: "Billing",
  [TicketCategory.MERCHANT_SUPPORT]: "Business Support",
  [TicketCategory.API_SUPPORT]: "Developer Support",
  [TicketCategory.SECURITY_CONCERN]: "Security",
  [TicketCategory.FEATURE_REQUEST]: "Feature Request",
  [TicketCategory.BUG_REPORT]: "Bug Report",
};

export function TicketList() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const loadTickets = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTickets = await supportAPI.getTickets({}, token);
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [token]);

  useEffect(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ticket =>
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.ticket_number.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  if (!token) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please sign in to view your tickets.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Support Tickets</h2>
          <p className="text-muted-foreground">
            Track and manage your support requests
          </p>
        </div>
        <Button onClick={() => setShowCreateTicket(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                    <SelectItem key={category} value={category}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your tickets...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Error Loading Tickets</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadTickets}>Try Again</Button>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">
              {tickets.length === 0 ? "No tickets yet" : "No matching tickets"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {tickets.length === 0
                ? "You haven't created any support tickets yet."
                : "Try adjusting your search or filters."}
            </p>
            {tickets.length === 0 && (
              <Button onClick={() => setShowCreateTicket(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Ticket
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const statusConfig = STATUS_CONFIG[ticket.status];
            const priorityConfig = PRIORITY_CONFIG[ticket.priority];
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={ticket.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">
                          #{ticket.ticket_number}
                        </span>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                        {ticket.is_overdue && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge className={cn("mb-2", statusConfig.color)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(ticket.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Category: {CATEGORY_LABELS[ticket.category]}</span>
                      {ticket.message_count && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.message_count} messages
                        </span>
                      )}
                      {ticket.assigned_agent_name && (
                        <span>Assigned to: {ticket.assigned_agent_name}</span>
                      )}
                    </div>
                    <span>Created: {formatDate(ticket.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <TicketDetailsDialog
          ticketId={selectedTicket}
          open={!!selectedTicket}
          onOpenChange={(open: boolean) => !open && setSelectedTicket(null)}
          onTicketUpdated={loadTickets}
        />
      )}

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        open={showCreateTicket}
        onOpenChange={setShowCreateTicket}
        onTicketCreated={loadTickets}
      />
    </div>
  );
}
