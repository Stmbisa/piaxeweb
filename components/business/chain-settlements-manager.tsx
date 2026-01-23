"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { chainPaymentsAPI, type SellerSettlementProductRow, type SellerSettlementProductDetail } from "@/lib/api/chain-payments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink } from "lucide-react";

function sumUnpaid(unpaidByCurrency: Record<string, string>): string {
  // display-only; keep as string
  const entries = Object.entries(unpaidByCurrency || {});
  if (entries.length === 0) return "0";
  return entries.map(([ccy, amt]) => `${amt} ${ccy}`).join(" · ");
}

export function ChainSettlementsManager() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SellerSettlementProductRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [detail, setDetail] = useState<SellerSettlementProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedRow = useMemo(
    () => rows.find((r) => r.product_id === selectedProductId) || null,
    [rows, selectedProductId]
  );

  const loadOverview = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await chainPaymentsAPI.sellerSettlementProducts(token);
      setRows(data);
      if (!selectedProductId && data.length > 0) setSelectedProductId(data[0].product_id);
    } catch (e: any) {
      toast({
        title: "Failed to load chain settlements",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (productId: string) => {
    if (!token || !productId) return;
    try {
      setDetailLoading(true);
      const data = await chainPaymentsAPI.sellerSettlementProductDetail(token, productId);
      setDetail(data);
    } catch (e: any) {
      toast({
        title: "Failed to load product settlement",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (selectedProductId) loadDetail(selectedProductId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Chain Settlements</h1>
          <p className="text-muted-foreground">Credited vs sold units, and unpaid upstream debts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/business/dashboard/payments">
            <Button variant="outline">Back to Payments</Button>
          </Link>
          <Button onClick={loadOverview} className="flex items-center gap-2" disabled={loading}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seller Overview</CardTitle>
          <CardDescription>Select a product to view lots and creditor debts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.length === 0 ? (
            <div className="text-muted-foreground">No chain settlement data yet.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Product</div>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {rows.map((r) => (
                      <SelectItem key={r.product_id} value={r.product_id}>
                        {r.product_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRow && (
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="p-3">
                      <div className="text-xs text-muted-foreground">Credited</div>
                      <div className="text-xl font-semibold">{selectedRow.credited_units}</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-xs text-muted-foreground">Sold</div>
                      <div className="text-xl font-semibold">{selectedRow.sold_units}</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-xs text-muted-foreground">Remaining</div>
                      <div className="text-xl font-semibold">{selectedRow.remaining_units}</div>
                    </Card>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="text-muted-foreground">Unpaid:</span>{" "}
                    <span className="font-medium">{sumUnpaid(selectedRow.unpaid_by_currency)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Detail</CardTitle>
          <CardDescription>Lots (FIFO) and debts grouped by creditor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {detailLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : !detail ? (
            <div className="text-muted-foreground">Select a product to view details.</div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">Credited: {detail.credited_units}</Badge>
                <Badge variant="secondary">Sold: {detail.sold_units}</Badge>
                <Badge variant="secondary">Remaining: {detail.remaining_units}</Badge>
                {detail.chain_currency_code && (
                  <Badge variant="outline">Chain currency: {detail.chain_currency_code}</Badge>
                )}
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Debts by creditor</div>
                {detail.debts_by_creditor.length === 0 ? (
                  <div className="text-muted-foreground">No unpaid debts for this product.</div>
                ) : (
                  <div className="space-y-2">
                    {detail.debts_by_creditor.map((d) => (
                      <div key={`${d.creditor_id}:${d.currency_code}`} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">{d.creditor_username || d.creditor_id || "Unknown creditor"}</div>
                          <div className="text-xs text-muted-foreground">{d.currency_code}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{d.remaining_amount_total} {d.currency_code}</div>
                          <div className="text-xs text-muted-foreground">Original: {d.original_amount_total}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Lots</div>
                {detail.lots.length === 0 ? (
                  <div className="text-muted-foreground">No credited lots found.</div>
                ) : (
                  <div className="space-y-2">
                    {detail.lots.map((lot) => (
                      <div key={lot.step_id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="font-medium">
                            {lot.from_entity_username || "Supplier"} · {new Date(lot.date).toLocaleDateString()}
                          </div>
                          <Link
                            href={`/business/dashboard/products`}
                            className="text-sm text-primary inline-flex items-center gap-1"
                          >
                            Products <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Qty {lot.quantity} · Consumed {lot.consumed_quantity} · Remaining {lot.remaining_quantity}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Unit cost: {lot.unit_cost ?? "—"} {lot.currency_code ?? ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
