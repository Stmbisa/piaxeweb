import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import {
  adminAPI,
  DetailedHealth,
  EscrowStats,
  SystemStats,
} from "@/lib/api/admin";
import { RecentSignupsTable } from "./recent-signups-table";
import { UserVerificationsTable } from "./user-verifications-table";
import {
  AlertCircle,
  RefreshCw,
  ClipboardCheck,
  UserPlus,
  Activity,
  Server,
  ShieldCheck,
  HeartPulse,
  FileText,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardStats {
  recentSignups: number;
  pendingVerifications: number;
  verifiedUsers: number;
  totalUsers: number;
}

interface CeleryHealthPayload {
  detail?: {
    status?: string;
    last_heartbeat?: string | null;
  };
}

export function AdminDashboardOverview() {
  const { token } = useAuth();
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [escrowStats, setEscrowStats] = useState<EscrowStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [detailedHealth, setDetailedHealth] = useState<DetailedHealth | null>(
    null
  );
  const [celeryHealth, setCeleryHealth] = useState<CeleryHealthPayload | null>(
    null
  );
  const [auditLog, setAuditLog] = useState<any | null>(null);
  const [metricsPreview, setMetricsPreview] = useState<string[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    recentSignups: 0,
    pendingVerifications: 0,
    verifiedUsers: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [
        signups,
        verifications,
        escrow,
        system,
        health,
        celery,
        audits,
        metrics,
      ] = await Promise.all([
        adminAPI.getRecentSignups(token, 5),
        adminAPI.getUserVerifications(token, "Pending", 5),
        adminAPI.getEscrowStats(token).catch(() => null),
        adminAPI.getSystemStats(token).catch(() => null),
        adminAPI.getDetailedHealth(token).catch(() => null),
        adminAPI.getCeleryHealth(token).catch(() => null),
        adminAPI.getRecentAuditEvents(token, 5).catch(() => null),
        adminAPI.getMetrics(token).catch(() => null),
      ]);

      setRecentSignups(signups);
      setPendingVerifications(verifications);
      setEscrowStats(escrow);
      setSystemStats(system);
      setDetailedHealth(health);
      setCeleryHealth(celery);
      setAuditLog(audits);

      if (typeof metrics === "string") {
        const preview = metrics
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 8);
        setMetricsPreview(preview);
      } else {
        setMetricsPreview([]);
      }

      setStats({
        recentSignups: signups.length,
        pendingVerifications: verifications.length,
        verifiedUsers: 0, // Placeholder, API doesn't provide total count directly yet
        totalUsers: 0, // Placeholder
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err instanceof Error) {
        setError(`Failed to load dashboard data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const formatLabel = (value: string) =>
    value
      .replace(/[\-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const healthChecks = useMemo(() => {
    if (!detailedHealth?.checks) return [];
    return Object.entries(detailedHealth.checks);
  }, [detailedHealth]);

  const celeryStatus = celeryHealth?.detail?.status || "unknown";
  const celeryIsHealthy = celeryStatus.toLowerCase() === "healthy";
  const celeryHeartbeat = celeryHealth?.detail?.last_heartbeat || null;
  const celeryUnavailable = !celeryHealth || celeryStatus === "unknown";

  const systemHealthLabel = systemStats
    ? systemStats.application.system_status === "healthy"
      ? "Healthy"
      : "Needs Attention"
    : "Pending";

  const summaryCards = [
    {
      key: "recent-signups",
      title: "Recent Signups",
      value: String(stats.recentSignups),
      subtitle: "Last 5 registrations",
      icon: UserPlus,
      gradient: "from-sky-500/25 via-sky-400/10 to-transparent",
      iconClass: "text-sky-600 dark:text-sky-200",
    },
    {
      key: "pending-verifications",
      title: "Pending Verifications",
      value: String(stats.pendingVerifications),
      subtitle: "Awaiting review",
      icon: ClipboardCheck,
      gradient: "from-amber-500/25 via-amber-400/10 to-transparent",
      iconClass: "text-amber-600 dark:text-amber-200",
    },
    {
      key: "active-escrows",
      title: "Active Escrows",
      value: String(escrowStats?.active_escrow_count || 0),
      subtitle: escrowStats?.current_total_held_converted
        ? `Total Held ${escrowStats.current_total_held_converted}`
        : "Pulling balances",
      icon: ShieldCheck,
      gradient: "from-emerald-500/25 via-emerald-400/10 to-transparent",
      iconClass: "text-emerald-600 dark:text-emerald-200",
    },
    {
      key: "escrow-release",
      title: "Release Latency",
      value: escrowStats?.average_release_seconds
        ? `${Math.round(escrowStats.average_release_seconds)}s avg`
        : "—",
      subtitle:
        escrowStats?.p90_release_seconds
          ? `P50 ${Math.round(escrowStats.p50_release_seconds)}s · P90 ${Math.round(
            escrowStats.p90_release_seconds
          )}s`
          : "Awaiting flow data",
      icon: HeartPulse,
      gradient: "from-rose-500/25 via-rose-400/10 to-transparent",
      iconClass: "text-rose-600 dark:text-rose-200",
    },
    {
      key: "system-health",
      title: "System Health",
      value: systemHealthLabel,
      subtitle: systemStats
        ? `CPU ${systemStats.system.cpu_percent || 0}% · Mem ${systemStats.system.memory.percent || 0
        }%`
        : "Watching services",
      icon: Activity,
      gradient: "from-purple-500/25 via-purple-400/10 to-transparent",
      iconClass: "text-purple-600 dark:text-purple-200",
      renderValue: () => (
        <Badge
          className={cn(
            "px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
            systemHealthLabel === "Healthy"
              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-100 border border-emerald-400/40"
              : "bg-amber-500/20 text-amber-700 dark:text-amber-100 border border-amber-400/40"
          )}
        >
          {systemHealthLabel}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-glass-appear">
      {/* Highlight Metrics */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card
            key={card.key}
            className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(68,85,255,0.65)]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
            />
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22)_0,_rgba(255,255,255,0)_55%)]" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={cn("h-5 w-5", card.iconClass)} />
            </CardHeader>
            <CardContent className="relative z-10 space-y-2">
              {loading ? (
                <Skeleton className="h-7 w-24" />
              ) : card.renderValue ? (
                card.renderValue()
              ) : (
                <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="glass-card animate-glass-appear"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-row justify-between items-center">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              className="ml-2 glass-button hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Deep Health + Metrics */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-primary/10" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0)_60%)]" />
          <CardHeader className="relative z-10">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Service Health Checks
                </CardTitle>
                <CardDescription>
                  {detailedHealth?.timestamp
                    ? `Reported ${new Date(
                      detailedHealth.timestamp
                    ).toLocaleString()}`
                    : "Live system diagnostics"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboardData}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-900 dark:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {loading && healthChecks.length === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ) : healthChecks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No health diagnostics available yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {healthChecks.map(([checkName, payload]) => {
                  const data = payload as Record<string, any>;
                  const status = (data?.status as string) || "unknown";
                  const metaEntries = Object.entries(data || {})
                    .filter(([key]) => key !== "status")
                    .slice(0, 3);
                  return (
                    <div
                      key={checkName}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-50 dark:bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/20 via-transparent to-transparent group-hover:opacity-60 transition-opacity" />
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-600 dark:text-white/80" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatLabel(checkName)}
                            </span>
                          </div>
                          <Badge
                            className={cn(
                              "px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                              status.toLowerCase() === "healthy"
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-100 border border-emerald-400/40"
                                : status.toLowerCase() === "unhealthy"

                                ? "bg-rose-500/20 text-rose-700 dark:text-rose-100 border border-rose-400/40"
                                : "bg-amber-500/20 text-amber-700 dark:text-amber-100 border border-amber-400/40"
                            )}
                          >
                            {formatLabel(status)}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          {metaEntries.length === 0 ? (
                            <p>No additional telemetry.</p>
                          ) : (
                            metaEntries.map(([key, value]) => (
                              <div
                                key={`${checkName}-${key}`}
                                className="flex items-center justify-between gap-3"
                              >
                                <span>{formatLabel(key)}</span>
                                <span className="text-gray-900 dark:text-white/80 font-medium">
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : String(value)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              Worker & Metrics Pulse
            </CardTitle>
            <CardDescription>
              Celery workers and Prometheus snapshot
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-gray-50 dark:bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Celery Workers
                </span>
                <Badge
                  className={cn(
                    "px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                    celeryIsHealthy
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-100 border border-emerald-400/40"
                      : celeryUnavailable

                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-100 border border-amber-400/40"
                      : "bg-rose-500/20 text-rose-700 dark:text-rose-100 border border-rose-400/40"
                  )}
                >
                  {celeryUnavailable ? "Unavailable" : formatLabel(celeryStatus)}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {celeryUnavailable
                  ? "Health endpoint unreachable (503/timeout)."
                  : `Last heartbeat: ${celeryHeartbeat ? new Date(celeryHeartbeat).toLocaleString() : "N/A"}`}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <LineChart className="h-4 w-4" />
                Prometheus Preview
              </div>
              <div className="mt-3 max-h-48 overflow-y-auto rounded-xl bg-black/40 p-3 text-[11px] font-mono text-emerald-200 shadow-inner">
                {metricsPreview.length === 0 ? (
                  <p className="text-muted-foreground/70">
                    Metrics endpoint unreachable right now.
                  </p>
                ) : (
                  metricsPreview.map((line, index) => (
                    <div key={index} className="whitespace-pre">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups & Audit Trail */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="glass-card-enhanced relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Signups
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              The most recent user registrations on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <RecentSignupsTable initialData={recentSignups} />
            )}
          </CardContent>
        </Card>

        <Card className="glass-card-enhanced relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-red-500/10" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit Trail
            </CardTitle>
            <CardDescription>
              Most recent security audit events.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3 text-sm text-muted-foreground">
            {Array.isArray(auditLog?.events) && auditLog.events.length > 0 ? (
              <div className="space-y-3">
                {auditLog.events.slice(0, 5).map((event: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-gray-50 dark:bg-white/5 p-3 backdrop-blur-sm"
                  >
                    <p className="text-xs text-muted-foreground/70">
                      {auditLog.timestamp
                        ? new Date(auditLog.timestamp).toLocaleString()
                        : "Timestamp unavailable"}
                    </p>

                    <pre className="mt-2 overflow-x-auto text-[11px] text-gray-800 dark:text-white/90">
{JSON.stringify(event, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {auditLog?.note || "No audit events have been recorded yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card className="glass-card-enhanced relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 via-transparent to-emerald-500/10" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Verifications
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Users waiting for identity verification approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UserVerificationsTable initialData={pendingVerifications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
