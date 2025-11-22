"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI } from "@/lib/api/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertCircle } from "lucide-react";

interface FailedDeliveryRecord {
  id?: string;
  recipient_id?: string;
  event_type?: string;
  channel?: string;
  error?: string;
  attempted_at?: string;
}

export default function FailedDeliveriesPage() {
  const { token } = useAuth();
  const [records, setRecords] = useState<FailedDeliveryRecord[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [page, setPage] = useState(1);

  const fetchRecords = async (p = page) => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const data = await adminAPI.getFailedNotificationDeliveries(token, p, 20);
      // Unknown schema; treat as array or object list
      if (Array.isArray(data)) {
        setRecords(data as FailedDeliveryRecord[]);
      } else if (data && Array.isArray(data.results)) {
        setRecords(data.results as FailedDeliveryRecord[]);
      } else {
        setRecords([]);
      }
    } catch (e) { setError(e instanceof Error? e.message:String(e)); }
    finally { setLoading(false); }
  };

  useEffect(()=> { fetchRecords(page); }, [token, page]);

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Failed Notification Deliveries</h1>
            <p className="text-sm text-white/70">Review delivery failures for remediation & retries.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={()=>fetchRecords(page)} disabled={loading} className="backdrop-blur-md bg-white/10 border-white/20 text-white">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading?"animate-spin":""}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" disabled={loading || page<=1} onClick={()=> setPage(p=> Math.max(1, p-1))}>Prev</Button>
            <Button variant="outline" size="sm" disabled={loading} onClick={()=> setPage(p=> p+1)}>Next</Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-transparent to-primary/10" />
        <CardHeader className="relative z-10">
          <CardTitle>Failed Deliveries (page {page})</CardTitle>
          <CardDescription>Delivery attempts that did not succeed</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}
          {!loading && records && records.length === 0 && (
            <p className="text-sm text-white/60">No failed deliveries found.</p>
          )}
          {!loading && records && records.map(rec => (
            <div key={(rec.id || rec.recipient_id || rec.attempted_at || Math.random()).toString()} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              <div className="relative grid md:grid-cols-3 gap-2 text-xs">
                <div><span className="font-semibold">Recipient:</span> {rec.recipient_id || '—'}</div>
                <div><span className="font-semibold">Event:</span> {rec.event_type || '—'}</div>
                <div><span className="font-semibold">Channel:</span> {rec.channel || '—'}</div>
                <div className="md:col-span-3"><span className="font-semibold">Error:</span> {rec.error || '—'}</div>
                <div><span className="font-semibold">Attempted:</span> {rec.attempted_at || '—'}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
