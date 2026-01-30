import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth/context";
import { adminAPI, type AnalyticsSummary } from "@/lib/api/admin";
import { RefreshCw, LineChart } from "lucide-react";

export function AdminAnalyticsDashboard() {
  const { token } = useAuth();
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getAnalyticsSummary(token, days);
      setSummary(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days]);

  const topEvent = useMemo(() => {
    if (!summary?.top_events?.length) return null;
    return summary.top_events[0];
  }, [summary]);

  return (
    <div className="space-y-6 animate-glass-appear">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-semibold">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Self-hosted usage telemetry (event counts + trends).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={days === 7 ? "default" : "outline"}
            onClick={() => setDays(7)}
          >
            7d
          </Button>
          <Button
            variant={days === 30 ? "default" : "outline"}
            onClick={() => setDays(30)}
          >
            30d
          </Button>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={"h-4 w-4 mr-2 " + (loading ? "animate-spin" : "")} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-semibold">{summary?.total_events ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Unique users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-semibold">{summary?.unique_users ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Top event</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-40" />
            ) : topEvent ? (
              <div className="space-y-1">
                <div className="text-base font-semibold">{topEvent.event_name}</div>
                <div className="text-sm text-muted-foreground">{topEvent.count} events</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Top events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>
          ) : summary?.top_events?.length ? (
            <div className="space-y-2">
              {summary.top_events.map((e) => (
                <div key={e.event_name} className="flex items-center justify-between text-sm">
                  <div className="font-medium">{e.event_name}</div>
                  <div className="text-muted-foreground">{e.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No events recorded yet.</div>
          )}

          {summary?.truncated ? (
            <div className="mt-3 text-xs text-muted-foreground">
              Daily series is based on the most recent 50k events.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Daily volume</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : summary?.daily_counts?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {summary.daily_counts.map((d) => (
                <div key={d.day} className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-muted-foreground">{d.day}</span>
                  <span className="font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No data.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
