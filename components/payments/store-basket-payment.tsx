"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPaymentRequestDetails, payPaymentRequest, type PaymentRequestDetail } from "@/lib/api/payments";

function fmtMoney(currency: string, amount: string | number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return `${currency} ${String(amount)}`;
  return `${currency} ${n.toLocaleString()}`;
}

export function StoreBasketPayment({ requestId }: { requestId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [details, setDetails] = useState<PaymentRequestDetail | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getPaymentRequestDetails(token, requestId);
        if (!cancelled) setDetails(data);
      } catch (e: any) {
        if (!cancelled) {
          toast({
            title: "Failed to load",
            description: e?.message || "Could not load payment request",
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, requestId, toast]);

  const basketItems = useMemo(() => {
    const products = (details as any)?.metadata?.products;
    if (!Array.isArray(products)) return [] as any[];
    return products;
  }, [details]);

  const canPayWithPiaxis = !!token && details?.status === "pending";

  const onPay = async () => {
    if (!details) return;
    if (!token) {
      toast({
        title: "Login required",
        description: "Sign in to pay with Piaxis balance on web.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPaying(true);
      await payPaymentRequest(token, requestId, {
        amount: Number(details.amount || 0),
        currency: details.currency,
        payment_method: "piaxis",
      });
      toast({ title: "Paid", description: "Payment sent successfully." });
      const refreshed = await getPaymentRequestDetails(token, requestId);
      setDetails(refreshed);
    } catch (e: any) {
      toast({
        title: "Payment failed",
        description: e?.message || "Could not complete payment",
        variant: "destructive",
      });
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay Basket</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay Basket</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pay Basket</CardTitle>
          <Badge variant={details.status === "paid" || details.status === "completed" ? "secondary" : "outline"}>
            {details.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-semibold">{fmtMoney(details.currency, details.amount)}</div>
          {details.message ? (
            <div className="text-sm text-muted-foreground">{details.message}</div>
          ) : null}

          {basketItems.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Items</div>
                <div className="space-y-2">
                  {basketItems.map((it: any, idx: number) => {
                    const qty = Number(it?.quantity || 0);
                    const unit = Number(it?.unit_price || 0);
                    const lineTotal = Number.isFinite(qty) && Number.isFinite(unit) ? qty * unit : null;
                    const name = it?.product_name || it?.product_code || it?.product_id || `Item ${idx + 1}`;
                    return (
                      <div key={`${it?.product_id || it?.product_code || idx}`} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{name}</div>
                          <div className="text-xs text-muted-foreground">
                            Qty {qty} × {fmtMoney(details.currency, it?.unit_price)}
                          </div>
                        </div>
                        <div className="font-medium whitespace-nowrap">
                          {fmtMoney(details.currency, lineTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={onPay} disabled={!canPayWithPiaxis || paying}>
          {paying ? "Paying…" : "Pay with Piaxis balance"}
        </Button>
        {!token ? (
          <div className="text-sm text-muted-foreground self-center">
            Sign in to pay on web (or pay in mobile app).
          </div>
        ) : null}
      </div>
    </div>
  );
}
