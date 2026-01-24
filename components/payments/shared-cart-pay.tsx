"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSharedCartDetailsByToken, paySharedCart, type SharedCartDetails } from "@/lib/api/shared-carts";

function fmtMoney(currency: string, amount: string | number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return `${currency} ${String(amount)}`;
  return `${currency} ${n.toLocaleString()}`;
}

export function SharedCartPay({ cartToken }: { cartToken: string }) {
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [details, setDetails] = useState<SharedCartDetails | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getSharedCartDetailsByToken(token, cartToken);
        if (!cancelled) setDetails(data);
      } catch (e: any) {
        if (!cancelled) {
          toast({
            title: "Failed to load",
            description: e?.message || "Could not load shared cart",
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
  }, [token, cartToken, toast]);

  const items = useMemo(() => {
    if (!details) return [] as any[];
    if (Array.isArray(details.ecommerce_items) && details.ecommerce_items.length > 0) return details.ecommerce_items;
    if (Array.isArray(details.inventory_items) && details.inventory_items.length > 0) return details.inventory_items;
    return [];
  }, [details]);

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

    const cartType = (details.cart_type || "instore").toLowerCase() === "ecommerce" ? "ecommerce" : "instore";

    try {
      setPaying(true);
      await paySharedCart(token, cartToken, cartType, {
        payment_type: "direct",
        payment_method: "piaxis",
        currency: details.currency || "UGX",
      });
      toast({ title: "Paid", description: "Payment sent successfully." });
      const refreshed = await getSharedCartDetailsByToken(token, cartToken);
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
          <CardTitle>Shared Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shared Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Not found.</CardContent>
      </Card>
    );
  }

  const canPay = !!token && (details.status || "").includes("pending");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shared Cart</CardTitle>
          <Badge variant={String(details.status).includes("paid") || String(details.status).includes("completed") ? "secondary" : "outline"}>
            {details.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-semibold">{fmtMoney(details.currency || "UGX", details.total_amount)}</div>

          {items.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Items</div>
                <div className="space-y-2">
                  {items.map((it: any, idx: number) => {
                    const name = it?.product_name || it?.product_code || it?.id || `Item ${idx + 1}`;
                    const lineTotal = it?.total_price || it?.price;
                    const qty = it?.quantity;
                    const unit = it?.unit_price;
                    return (
                      <div key={`${it?.id || idx}`} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{name}</div>
                          {qty ? (
                            <div className="text-xs text-muted-foreground">Qty {qty} × {fmtMoney(details.currency || "UGX", unit)}</div>
                          ) : null}
                        </div>
                        <div className="font-medium whitespace-nowrap">{fmtMoney(details.currency || "UGX", lineTotal)}</div>
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
        <Button onClick={onPay} disabled={!canPay || paying}>
          {paying ? "Paying…" : "Pay with Piaxis balance"}
        </Button>
        {!token ? (
          <div className="text-sm text-muted-foreground self-center">Sign in to pay on web (or pay in mobile app).</div>
        ) : null}
      </div>
    </div>
  );
}
