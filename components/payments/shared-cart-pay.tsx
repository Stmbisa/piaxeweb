"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { getSharedCartDetailsByToken, paySharedCart, type SharedCartDetails } from "@/lib/api/shared-carts";
import { trackEvent } from "@/lib/analytics/client";

type PayMethod = "piaxis" | "mtn" | "airtel";

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

  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getSharedCartDetailsByToken(token, cartToken);
        if (!cancelled) {
          setDetails(data);
          trackEvent("shared_cart_viewed", {
            cart_token: cartToken,
            status: data?.status,
            cart_type: data?.cart_type,
            currency: data?.currency,
            total_amount: data?.total_amount,
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          toast({
            title: "Failed to load",
            description: e?.message || "Could not load shared cart",
            variant: "destructive",
          });
          trackEvent("shared_cart_view_failed", {
            cart_token: cartToken,
            message: e?.message,
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
    const cartType = (details.cart_type || "instore").toLowerCase() === "ecommerce" ? "ecommerce" : "instore";

    trackEvent("shared_cart_pay_clicked", {
      cart_token: cartToken,
      cart_type: cartType,
      payment_method: paymentMethod,
      has_token: Boolean(token),
      has_phone: Boolean(phoneNumber.trim()),
      has_email: Boolean(email.trim()),
    });

    if (paymentMethod === "piaxis" && !token) {
      toast({
        title: "Login required",
        description: "Sign in to pay with Piaxis balance on web.",
        variant: "destructive",
      });
      return;
    }

    if ((paymentMethod === "mtn" || paymentMethod === "airtel") && !phoneNumber.trim()) {
      toast({
        title: "Missing phone number",
        description: "Enter a phone number for mobile money payments.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPaying(true);
      const payload: Record<string, any> = {
        payment_type: "direct",
        payment_method: paymentMethod,
        currency: details.currency || "UGX",
      };

      if (paymentMethod === "mtn" || paymentMethod === "airtel") {
        payload.user_info = {
          phone_number: phoneNumber.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
        };
      }

      await paySharedCart(token, cartToken, cartType, payload);
      toast({ title: "Paid", description: "Payment sent successfully." });
      trackEvent("shared_cart_paid", {
        cart_token: cartToken,
        cart_type: cartType,
        payment_method: paymentMethod,
      });
      const refreshed = await getSharedCartDetailsByToken(token, cartToken);
      setDetails(refreshed);
    } catch (e: any) {
      toast({
        title: "Payment failed",
        description: e?.message || "Could not complete payment",
        variant: "destructive",
      });
      trackEvent("shared_cart_payment_failed", {
        cart_token: cartToken,
        payment_method: paymentMethod,
        message: e?.message,
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

  const isPending = (details.status || "").includes("pending");
  const canPay = isPending && (paymentMethod !== "piaxis" || !!token) && (paymentMethod === "piaxis" || !!phoneNumber.trim());

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

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Method</div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={paymentMethod === "mtn" ? "default" : "outline"}
                onClick={() => {
                  setPaymentMethod("mtn");
                  trackEvent("shared_cart_payment_method_selected", {
                    cart_token: cartToken,
                    method: "mtn",
                  });
                }}
                className="flex items-center gap-2"
              >
                <Image src="/images/mtn-logo.png" alt="MTN Mobile Money" width={28} height={12} />
                MTN Mobile Money
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "airtel" ? "default" : "outline"}
                onClick={() => {
                  setPaymentMethod("airtel");
                  trackEvent("shared_cart_payment_method_selected", {
                    cart_token: cartToken,
                    method: "airtel",
                  });
                }}
                className="flex items-center gap-2"
              >
                <Image src="/images/airtel-logo.png" alt="Airtel Money" width={28} height={12} />
                Airtel Money
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "piaxis" ? "default" : "outline"}
                onClick={() => {
                  setPaymentMethod("piaxis");
                  trackEvent("shared_cart_payment_method_selected", {
                    cart_token: cartToken,
                    method: "piaxis",
                  });
                }}
                disabled={!token}
              >
                Piaxis balance
              </Button>

              <Button type="button" variant="outline" disabled>
                Card (coming soon)
              </Button>
            </div>
            {!token ? (
              <div className="text-xs text-muted-foreground">
                Piaxis balance requires sign-in. Mobile money can be paid without signing in (if enabled on the API).
              </div>
            ) : null}
          </div>

          {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="mm-phone">Phone number</Label>
                <Input
                  id="mm-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +256700000000"
                  inputMode="tel"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mm-email">Email (optional)</Label>
                <Input
                  id="mm-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  inputMode="email"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onPay} disabled={!canPay || paying}>
              {paying ? "Paying…" : "Pay now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
