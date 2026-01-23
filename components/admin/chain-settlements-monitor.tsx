"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAPI } from "@/lib/hooks/use-admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

type AdminOverview = {
  unpaid_totals_by_currency: Record<string, string>;
  top_debtors: Array<{ account_id: string; username: string | null; remaining: string }>;
  top_creditors: Array<{ account_id: string; username: string | null; remaining: string }>;
  debts_count: number;
};

type AdminDebtRow = {
  id: string;
  status: string;
  currency_code: string;
  original_amount: string;
  remaining_amount: string;
  debtor_id: string | null;
  debtor_username: string | null;
  creditor_id: string | null;
  creditor_username: string | null;
  product_id: string | null;
  product_name: string | null;
  created_at: string;
};

type AdminDebtsResponse = {
  total: number;
  limit: number;
  offset: number;
  items: AdminDebtRow[];
};

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "secondary";
  if (s === "unpaid" || s === "overdue") return "destructive";
  if (s === "partially_paid") return "default";
  return "outline";
}

function fmtUserLabel(username: string | null, id: string | null) {
  if (username) return username;
  if (id) return id.slice(0, 8);
  return "—";
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function AdminChainSettlementsMonitor() {
  const { toast } = useToast();
  const { fetchWithAuth } = useAdminAPI();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const [debts, setDebts] = useState<AdminDebtsResponse | null>(null);
  const [debtsLoading, setDebtsLoading] = useState(false);

  const [status, setStatus] = useState<string>("all");
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [debtorId, setDebtorId] = useState<string>("");
  const [creditorId, setCreditorId] = useState<string>("");
  const [limit, setLimit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    if (status && status !== "all") params.set("status", status);
    if (currencyCode) params.set("currency_code", currencyCode.trim().toUpperCase());
    if (productId) params.set("product_id", productId.trim());
    if (debtorId) params.set("debtor_id", debtorId.trim());
    if (creditorId) params.set("creditor_id", creditorId.trim());
    return params.toString();
  }, [status, currencyCode, productId, debtorId, creditorId, limit, offset]);

  const loadOverview = async () => {
    setOverviewLoading(true);
    try {
      const res = await fetchWithAuth(
        `/api/proxy/chain_payments/admin/chain-settlements/overview`,
        { method: "GET" }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = (await res.json()) as AdminOverview;
      setOverview(data);
    } catch (e: any) {
      toast({
        title: "Failed to load chain settlements overview",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadDebts = async () => {
    setDebtsLoading(true);
    try {
      const res = await fetchWithAuth(`/api/proxy/chain_payments/admin/debts?${queryString}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = (await res.json()) as AdminDebtsResponse;
      setDebts(data);
    } catch (e: any) {
      toast({
        title: "Failed to load debts",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
      setDebts(null);
    } finally {
      setDebtsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDebts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const totalPages = debts ? Math.max(1, Math.ceil((debts.total || 0) / (debts.limit || 1))) : 1;
  const currentPage = debts ? Math.floor((debts.offset || 0) / (debts.limit || 1)) + 1 : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Chain Settlements (Admin)</h1>
          <p className="text-muted-foreground">
            Monitoring view for unpaid debts and settlement health.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            loadOverview();
            loadDebts();
          }}
          disabled={overviewLoading || debtsLoading}
          className="gap-2"
        >
          {(overviewLoading || debtsLoading) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle>Unpaid Totals</CardTitle>
            <CardDescription>Remaining debt by currency</CardDescription>
          </CardHeader>
          <CardContent>
            {!overview ? (
              <div className="text-sm text-muted-foreground">No data</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(overview.unpaid_totals_by_currency || {}).length === 0 ? (
                  <div className="text-sm text-muted-foreground">0</div>
                ) : (
                  Object.entries(overview.unpaid_totals_by_currency || {}).map(([ccy, amt]) => (
                    <div key={ccy} className="flex items-center justify-between">
                      <span className="font-medium">{ccy}</span>
                      <span className="text-sm tabular-nums">{amt}</span>
                    </div>
                  ))
                )}
                <div className="pt-2 text-xs text-muted-foreground">
                  Debts count: {overview.debts_count}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle>Top Debtors</CardTitle>
            <CardDescription>Highest remaining balances</CardDescription>
          </CardHeader>
          <CardContent>
            {!overview ? (
              <div className="text-sm text-muted-foreground">No data</div>
            ) : (
              <div className="space-y-2">
                {(overview.top_debtors || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">None</div>
                ) : (
                  overview.top_debtors.map((r) => (
                    <div key={r.account_id} className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{fmtUserLabel(r.username, r.account_id)}</span>
                      <span className="text-sm tabular-nums">{r.remaining}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle>Top Creditors</CardTitle>
            <CardDescription>Most owed-to accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {!overview ? (
              <div className="text-sm text-muted-foreground">No data</div>
            ) : (
              <div className="space-y-2">
                {(overview.top_creditors || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">None</div>
                ) : (
                  overview.top_creditors.map((r) => (
                    <div key={r.account_id} className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{fmtUserLabel(r.username, r.account_id)}</span>
                      <span className="text-sm tabular-nums">{r.remaining}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle>Debts</CardTitle>
          <CardDescription>Filterable list of debt records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Status</div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setOffset(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unpaid">unpaid</SelectItem>
                  <SelectItem value="partially_paid">partially_paid</SelectItem>
                  <SelectItem value="overdue">overdue</SelectItem>
                  <SelectItem value="paid">paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Currency</div>
              <Input
                value={currencyCode}
                onChange={(e) => { setCurrencyCode(e.target.value); setOffset(0); }}
                placeholder="e.g. UGX"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Product ID</div>
              <Input
                value={productId}
                onChange={(e) => { setProductId(e.target.value); setOffset(0); }}
                placeholder="UUID"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Debtor ID</div>
              <Input
                value={debtorId}
                onChange={(e) => { setDebtorId(e.target.value); setOffset(0); }}
                placeholder="UUID"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Creditor ID</div>
              <Input
                value={creditorId}
                onChange={(e) => { setCreditorId(e.target.value); setOffset(0); }}
                placeholder="UUID"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Page Size</div>
              <Input
                type="number"
                min={1}
                max={200}
                value={String(limit)}
                onChange={(e) => {
                  const n = Math.max(1, Math.min(200, Number(e.target.value || 50)));
                  setLimit(n);
                  setOffset(0);
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
              {debts ? (
                <>Showing {debts.items.length} of {debts.total}</>
              ) : (
                <>—</>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={debtsLoading || currentPage <= 1}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Prev
              </Button>
              <div className="text-sm tabular-nums">
                Page {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                disabled={debtsLoading || currentPage >= totalPages}
                onClick={() => setOffset(offset + limit)}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-border/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Original</TableHead>
                  <TableHead>Debtor</TableHead>
                  <TableHead>Creditor</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : !debts || debts.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No debts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  debts.items.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(d.status)}>{d.status}</Badge>
                      </TableCell>
                      <TableCell>{d.currency_code}</TableCell>
                      <TableCell className="tabular-nums">{d.remaining_amount}</TableCell>
                      <TableCell className="tabular-nums">{d.original_amount}</TableCell>
                      <TableCell className="max-w-[180px] truncate" title={d.debtor_id || ""}>
                        {fmtUserLabel(d.debtor_username, d.debtor_id)}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate" title={d.creditor_id || ""}>
                        {fmtUserLabel(d.creditor_username, d.creditor_id)}
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate" title={d.product_id || ""}>
                        {d.product_name || (d.product_id ? d.product_id.slice(0, 8) : "—")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {fmtDate(d.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
