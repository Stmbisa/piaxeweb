"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI, DeliveryRequestAdmin } from "@/lib/api/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, AlertCircle, Save } from "lucide-react";

const STATUSES: DeliveryRequestAdmin["status"][] = [
  "requested",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
];

function locationSummary(loc: any): string {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const address = loc.address || loc.label || loc.description;
  const coords =
    loc.latitude && loc.longitude
      ? `(${loc.latitude}, ${loc.longitude})`
      : "";
  return [address, coords].filter(Boolean).join(" ");
}

export default function AdminDeliveryRequestsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DeliveryRequestAdmin[]>([]);

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.listDeliveryRequests(token);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const it of items) c[it.status] = (c[it.status] || 0) + 1;
    return c;
  }, [items]);

  const updateRow = async (
    it: DeliveryRequestAdmin,
    patch: Partial<DeliveryRequestAdmin>
  ) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await adminAPI.updateDeliveryRequest(token, it.id, patch);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Delivery Requests</h1>
            <p className="text-sm text-white/70">
              Review and dispatch delivery-mode INSTORE orders.
            </p>
            <p className="text-xs text-white/60 mt-1">
              {STATUSES.map((s) => `${s}: ${counts[s] || 0}`).join(" • ")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={refresh}
            className="backdrop-blur-md bg-white/10 border-white/20 text-white"
          >
            <RefreshCw className={"h-4 w-4 mr-2 " + (loading ? "animate-spin" : "")} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>{items.length} total</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-xl bg-black/20 p-4 border border-white/10"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">
                    {it.id}
                  </div>
                  <div className="text-xs text-white/70">
                    order: {it.order_id} • store: {it.store_id}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    dropoff: {locationSummary(it.delivery_location)}
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-3 md:items-end md:justify-end">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Status</label>
                    <Select
                      value={it.status}
                      onValueChange={(v) => updateRow(it, { status: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Rider Name</label>
                    <Input
                      defaultValue={it.assigned_rider_name || ""}
                      onBlur={(e) =>
                        e.target.value !== (it.assigned_rider_name || "")
                          ? updateRow(it, { assigned_rider_name: e.target.value })
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Rider Phone</label>
                    <Input
                      defaultValue={it.assigned_rider_phone || ""}
                      onBlur={(e) =>
                        e.target.value !== (it.assigned_rider_phone || "")
                          ? updateRow(it, { assigned_rider_phone: e.target.value })
                          : undefined
                      }
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRow(it, {})}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save/Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!items.length ? (
            <div className="text-sm text-muted-foreground">No delivery requests yet.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
