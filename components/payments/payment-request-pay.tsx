"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPaymentRequestDetails, payPaymentRequest, type PaymentRequestDetail } from "@/lib/api/payments";
import { StoreBasketPayment } from "@/components/payments/store-basket-payment";

function fmtMoney(currency: string, amount: string | number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return `${currency} ${String(amount)}`;
  return `${currency} ${n.toLocaleString()}`;
}

export function PaymentRequestPay({ requestId }: { requestId: string }) {
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

  const isBasket = basketItems.length > 0;
  if (isBasket) {
    return <StoreBasketPayment requestId={requestId} />;
  }

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
          <CardTitle>Pay Request</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay Request</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pay Request</CardTitle>
          <Badge variant={details.status === "paid" || details.status === "completed" ? "secondary" : "outline"}>
            {details.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-semibold">{fmtMoney(details.currency, details.amount)}</div>
          {details.message ? <div className="text-sm text-muted-foreground">{details.message}</div> : null}

          {details.conditions ? (
            <>
              <Separator />
              <div className="text-sm">
                <div className="font-medium">Conditions</div>
                <div className="text-muted-foreground whitespace-pre-wrap">{details.conditions}</div>
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
          <div className="text-sm text-muted-foreground self-center">Sign in to pay on web (or pay in mobile app).</div>
        ) : null}
      </div>
    </div>
  );
}
