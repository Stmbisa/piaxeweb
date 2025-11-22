"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI } from "@/lib/api/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertCircle, Filter, RotateCcw, CornerUpRight } from "lucide-react";

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
    const [records, setRecords] = useState<FailedDeliveryRecord[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [eventFilter, setEventFilter] = useState<string>("");
    const [channelFilter, setChannelFilter] = useState<string>("");
    const [autoRetry, setAutoRetry] = useState<boolean>(true);
    const [retryAttempts, setRetryAttempts] = useState(0);
    const maxRetries = 4;

    const fetchRecords = async (p = page) => {
        if (!token) return;
        setLoading(true); setError(null);
        try {
            const data = await adminAPI.getFailedNotificationDeliveries(token, p, 20, {
              event_type: eventFilter || undefined,
              channel: channelFilter || undefined,
            });
            // Unknown schema; treat as array or object list
            if (Array.isArray(data)) {
                setRecords(data as FailedDeliveryRecord[]);
            } else if (data && Array.isArray(data.results)) {
                setRecords(data.results as FailedDeliveryRecord[]);
            } else {
                setRecords([]);
            }
            setRetryAttempts(0); // reset after success
        } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRecords(page); }, [token, page]);

    // Exponential backoff retry on error
    useEffect(() => {
        if (error && autoRetry && retryAttempts < maxRetries) {
            const delay = Math.pow(2, retryAttempts) * 1000; // 1s,2s,4s,8s
            const t = setTimeout(() => {
                setRetryAttempts(a => a + 1);
                fetchRecords(page);
            }, delay);
            return () => clearTimeout(t);
        }
    }, [error, autoRetry, retryAttempts, page]);

    const filtered = (records || []).filter(r => {
        return (
            (!eventFilter || (r.event_type || '').includes(eventFilter)) &&
            (!channelFilter || (r.channel || '') === channelFilter)
        );
    });

    return (
        <div className="space-y-8 animate-glass-appear">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-white">Failed Notification Deliveries</h1>
                        <p className="text-sm text-white/70">Review delivery failures for remediation & retries.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => fetchRecords(page)} disabled={loading} className="backdrop-blur-md bg-white/10 border-white/20 text-white">
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" disabled={loading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                        <Button variant="outline" size="sm" disabled={loading} onClick={() => setPage(p => p + 1)}>Next</Button>
                        <Button variant={autoRetry ? "default" : "outline"} size="sm" onClick={() => setAutoRetry(a => !a)}>
                            <RotateCcw className="h-4 w-4 mr-2" /> {autoRetry ? "Auto-Retry On" : "Auto-Retry Off"}
                        </Button>
                        <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-black/30 text-white/70">
                            <Filter className="h-3 w-3" />
                            <input
                                placeholder="Event filter"
                                value={eventFilter}
                                onChange={e => setEventFilter(e.target.value)}
                                className="bg-transparent focus:outline-none placeholder:text-white/30 w-28"
                            />
                            <select
                                value={channelFilter}
                                onChange={e => setChannelFilter(e.target.value)}
                                className="bg-transparent focus:outline-none"
                            >
                                <option value="">All Channels</option>
                                <option value="email">email</option>
                                <option value="sms">sms</option>
                                <option value="websocket">websocket</option>
                                <option value="push">push</option>
                            </select>
                        </div>
                        {(eventFilter || channelFilter) && (
                            <Button variant="outline" size="sm" onClick={() => { setEventFilter(""); setChannelFilter(""); }}>
                                Clear Filters
                            </Button>
                        )}
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
                    <CardDescription>
                        {error ? `Error: ${error} (attempt ${retryAttempts}/${maxRetries})` : `Total ${filtered.length} shown`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                    {loading && (
                        <div className="space-y-3">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </div>
                    )}
                    {!loading && filtered && filtered.length === 0 && (
                        <p className="text-sm text-white/60">No failed deliveries found.</p>
                    )}
                                        {!loading && filtered && filtered.map(rec => (
                        <div key={(rec.id || rec.recipient_id || rec.attempted_at || Math.random()).toString()} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                                                        <div className="relative flex flex-col gap-2 text-xs">
                                                            <div className="grid md:grid-cols-3 gap-2">
                                                                <div><span className="font-semibold">Recipient:</span> {rec.recipient_id || '—'}</div>
                                                                <div><span className="font-semibold">Event:</span> {rec.event_type || '—'}</div>
                                                                <div><span className="font-semibold">Channel:</span> {rec.channel || '—'}</div>
                                                            </div>
                                                            <div className=""><span className="font-semibold">Error:</span> {rec.error || '—'}</div>
                                                            <div className="flex items-center justify-between">
                                                                <div><span className="font-semibold">Attempted:</span> {rec.attempted_at || '—'}</div>
                                                                {rec.id ? (
                                                                    <RetryButton id={rec.id} token={token} onDone={()=> setRecords(prev => prev ? prev.filter(r => r !== rec) : prev)} />
                                                                ) : null}
                                                            </div>
                                                        </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function RetryButton({ id, token, onDone }: { id: string; token: string | null; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const retry = async () => {
        if (!token) return;
        setLoading(true); setError(null);
        try {
            await adminAPI.retryFailedNotificationDelivery(token, id);
            onDone();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally { setLoading(false); }
    };
    return (
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={retry} disabled={loading} className="flex items-center">
                {loading ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <CornerUpRight className="h-3 w-3 mr-1" />}
                Retry
            </Button>
            {error && <span className="text-[10px] text-red-400 max-w-[140px] truncate" title={error}>{error}</span>}
        </div>
    );
}
