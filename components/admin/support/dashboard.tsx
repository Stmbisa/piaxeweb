"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";
import { adminAPI, SupportTicket } from "@/lib/api/admin";
import {
  AlertCircle,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { ADMIN_PREFIX } from "@/lib/config/env";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SupportStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  overdue_tickets: number;
  avg_response_time: number | null;
  avg_resolution_time: number | null;
}

interface DashboardData {
  stats: SupportStats;
  recent_tickets: SupportTicket[];
  overdue_tickets: SupportTicket[];
  my_tickets: SupportTicket[] | null;
}

export function SupportDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.getSupportDashboard(token);
      setData(response);
    } catch (err) {
      console.error("Error fetching support dashboard:", err);
      setError(
        `Failed to load support dashboard: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  const statsCards = [
    {
      title: "Total Tickets",
      value: data?.stats.total_tickets ?? 0,
      icon: Ticket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Open Tickets",
      value: data?.stats.open_tickets ?? 0,
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Overdue",
      value: data?.stats.overdue_tickets ?? 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-200 dark:border-red-800",
    },
    {
      title: "Resolved",
      value: data?.stats.resolved_tickets ?? 0,
      icon: CheckCircle2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Support Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor ticket status and support performance
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${ADMIN_PREFIX}/admin/support/tickets`}>
            <Button variant="default" className="glass-button-primary">
              View All Tickets
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDashboard}
            className="glass-button"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="glass-card">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border bg-white/80 dark:bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              stat.border
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              )}
              <div
                className={cn(
                  "absolute inset-0 opacity-10 pointer-events-none",
                  stat.bg
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent & Overdue Tickets */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tickets */}
        <Card className="glass-card-enhanced h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Tickets
            </CardTitle>
            <CardDescription>Latest support requests received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))
              ) : data?.recent_tickets && data.recent_tickets.length > 0 ? (
                data.recent_tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {ticket.subject}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{ticket.ticket_number}</span>
                        <span>•</span>
                        <span>{formatDate(ticket.created_at)}</span>
                        <span>•</span>
                        <span>{ticket.customer_name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent tickets found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Tickets */}
        <Card className="glass-card-enhanced h-full border-red-200/50 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tickets
            </CardTitle>
            <CardDescription>Tickets exceeding SLA time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))
              ) : data?.overdue_tickets && data.overdue_tickets.length > 0 ? (
                data.overdue_tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between p-4 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {ticket.subject}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{ticket.ticket_number}</span>
                        <span>•</span>
                        <span className="text-red-500">
                          Due {formatDate(ticket.due_date || "")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                  <p>No overdue tickets! Great job.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
