"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { adminAPI, SupportTicket, SupportAgent } from "@/lib/api/admin";
import {
  ChevronDown,
  Search,
  MoreHorizontal,
  Filter,
  UserPlus,
  Edit,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TicketList() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });

  // Dialog states
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  // Form states
  const [updateForm, setUpdateForm] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [assignAgentId, setAssignAgentId] = useState("");

  const fetchTickets = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (filters.status !== "all") params.status = filters.status;
      if (filters.priority !== "all") params.priority = filters.priority;
      if (filters.category !== "all") params.category = filters.category;

      const data = await adminAPI.listTickets(token, params);
      setTickets(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    if (!token) return;
    setAgentsLoading(true);
    try {
      const data = await adminAPI.listSupportAgents(token);
      setAgents(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setAgentsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token, page, filters]);

  const handleUpdateTicket = async () => {
    if (!token || !selectedTicket) return;
    try {
      const payload: any = {};
      if (updateForm.status) payload.status = updateForm.status;
      if (updateForm.priority) payload.priority = updateForm.priority;
      if (updateForm.category) payload.category = updateForm.category;

      await adminAPI.updateTicket(token, selectedTicket.id, payload);
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      setShowUpdateDialog(false);
      fetchTickets();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  const handleAssignTicket = async () => {
    if (!token || !selectedTicket || !assignAgentId) return;
    try {
      await adminAPI.assignTicket(token, selectedTicket.id, assignAgentId);
      toast({
        title: "Success",
        description: "Ticket assigned successfully",
      });
      setShowAssignDialog(false);
      fetchTickets();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      });
    }
  };

  const openUpdateDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setUpdateForm({
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
    });
    setShowUpdateDialog(true);
  };

  const openAssignDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setAssignAgentId(ticket.assigned_to || "");
    setShowAssignDialog(true);
    if (agents.length === 0) fetchAgents();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Open</Badge>;
      case "in_progress":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
        );
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "high":
        return <Badge variant="destructive">{priority}</Badge>;
      case "medium":
        return <Badge variant="secondary">{priority}</Badge>;
      case "low":
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4 animate-glass-appear">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8 glass-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) => setFilters({ ...filters, status: v })}
        >
          <SelectTrigger className="w-[150px] glass-input">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.priority}
          onValueChange={(v) => setFilters({ ...filters, priority: v })}
        >
          <SelectTrigger className="w-[150px] glass-input">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchTickets}
          className="glass-button"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md glass-card-enhanced overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.ticket_number}
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {ticket.customer_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ticket.customer_email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    {ticket.assigned_agent_name || (
                      <span className="text-muted-foreground italic">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openUpdateDialog(ticket)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openAssignDialog(ticket)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" /> Assign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="glass-button"
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={tickets.length < limit}
          className="glass-button"
        >
          Next
        </Button>
      </div>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="glass-card-enhanced">
          <DialogHeader>
            <DialogTitle>Update Ticket</DialogTitle>
            <DialogDescription>
              Update status, priority or category for{" "}
              {selectedTicket?.ticket_number}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(v) =>
                  setUpdateForm({ ...updateForm, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={updateForm.priority}
                onValueChange={(v) =>
                  setUpdateForm({ ...updateForm, priority: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={updateForm.category}
                onValueChange={(v) =>
                  setUpdateForm({ ...updateForm, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="account_access">Account Access</SelectItem>
                  <SelectItem value="payment_issue">Payment Issue</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="glass-card-enhanced">
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign {selectedTicket?.ticket_number} to a support agent
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Agent</Label>
              <Select value={assignAgentId} onValueChange={setAssignAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agentsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading agents...
                    </SelectItem>
                  ) : agents.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No agents found
                    </SelectItem>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.agent_name} ({agent.current_ticket_count}{" "}
                        tickets)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignTicket}>Assign Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
