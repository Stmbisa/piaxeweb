"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { shoppingInventoryAPI, type Product, type Store } from "@/lib/api/shopping-inventory";
import {
  createPaymentRequest,
  createStoreItemizedPaymentRequest,
  downloadPaymentRequestPdf,
  getPaymentRequestDetails,
  type PaymentRequestDetail,
} from "@/lib/api/payments";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function PaymentRequestsDashboard() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  // Shared created request state (used by both flows)
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<PaymentRequestDetail | null>(null);
  const [loadingCreated, setLoadingCreated] = useState(false);

  // Service/Other request fields
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceNote, setServiceNote] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [serviceCurrency, setServiceCurrency] = useState("UGX");

  // Store basket request fields
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [basketNote, setBasketNote] = useState("");
  const [basketItems, setBasketItems] = useState<
    Array<{ product_id: string; product_name: string; quantity: number; currency?: string; price?: number }>
  >([]);

  const basketTotal = useMemo(() => {
    return basketItems.reduce((sum, item) => {
      const price = Number(item.price ?? 0);
      return sum + price * item.quantity;
    }, 0);
  }, [basketItems]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoadingStores(true);
        const data = await shoppingInventoryAPI.getStores(token);
        setStores(data);
        if (data.length && !selectedStoreId) {
          setSelectedStoreId(data[0].id);
        }
      } catch (e: any) {
        toast({
          title: "Failed to load stores",
          description: e?.message || "Could not load your stores",
          variant: "destructive",
        });
      } finally {
        setLoadingStores(false);
      }
    })();
  }, [token, toast, selectedStoreId]);

  useEffect(() => {
    if (!token || !selectedStoreId) return;
    const q = productSearch.trim();
    if (!q) {
      setProductResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoadingProducts(true);
        const products = await shoppingInventoryAPI.getProducts(token, selectedStoreId, {
          limit: 10,
          offset: 0,
          search: q,
        });
        setProductResults(products || []);
      } catch {
        setProductResults([]);
      } finally {
        setLoadingProducts(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [token, selectedStoreId, productSearch]);

  useEffect(() => {
    if (!token || !createdRequestId) return;
    (async () => {
      try {
        setLoadingCreated(true);
        const d = await getPaymentRequestDetails(token, createdRequestId);
        setCreatedRequest(d);
      } catch {
        // If detail fetch fails, keep id only.
      } finally {
        setLoadingCreated(false);
      }
    })();
  }, [token, createdRequestId]);

  const addBasketItem = (p: Product) => {
    setBasketItems((prev) => {
      const existing = prev.find((x) => x.product_id === p.id);
      if (existing) {
        return prev.map((x) => (x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [...prev, { product_id: p.id, product_name: p.name, quantity: 1, currency: p.currency, price: p.price }];
    });
  };

  const updateBasketQty = (productId: string, qty: number) => {
    setBasketItems((prev) =>
      prev
        .map((x) => (x.product_id === productId ? { ...x, quantity: Math.max(1, qty) } : x))
        .filter((x) => x.quantity > 0)
    );
  };

  const removeBasketItem = (productId: string) => {
    setBasketItems((prev) => prev.filter((x) => x.product_id !== productId));
  };

  const handleCreateServiceRequest = async () => {
    if (!token) {
      toast({ title: "Sign in required", description: "Please sign in first.", variant: "destructive" });
      return;
    }

    const amt = Number(serviceAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast({ title: "Invalid amount", description: "Enter an amount greater than 0.", variant: "destructive" });
      return;
    }

    try {
      setCreatedRequest(null);
      setCreatedRequestId(null);
      const resp = await createPaymentRequest(token, {
        currency: serviceCurrency,
        request_type: "fixed_amount",
        access_type: "open",
        amount: amt,
        message: serviceTitle.trim() || undefined,
        conditions: serviceNote.trim() || undefined,
        generate_qr: true,
      });
      setCreatedRequestId(resp.id);
      toast({ title: "Created", description: "Payment request created." });
    } catch (e: any) {
      toast({ title: "Failed", description: e?.message || "Could not create request", variant: "destructive" });
    }
  };

  const handleCreateStoreBasketRequest = async () => {
    if (!token) {
      toast({ title: "Sign in required", description: "Please sign in first.", variant: "destructive" });
      return;
    }
    if (!selectedStoreId) {
      toast({ title: "Select a store", description: "Choose a store first.", variant: "destructive" });
      return;
    }
    if (basketItems.length === 0) {
      toast({ title: "No items", description: "Add at least one item.", variant: "destructive" });
      return;
    }

    try {
      setCreatedRequest(null);
      setCreatedRequestId(null);
      const resp = await createStoreItemizedPaymentRequest(token, {
        store_id: selectedStoreId,
        items: basketItems.map((x) => ({ product_id: x.product_id, quantity: x.quantity })),
        message: basketNote.trim() || undefined,
        generate_qr: true,
      });
      setCreatedRequestId(resp.request_id);
      toast({ title: "Created", description: "Store basket request created." });
    } catch (e: any) {
      toast({ title: "Failed", description: e?.message || "Could not create store request", variant: "destructive" });
    }
  };

  const handleDownloadPdf = async () => {
    if (!token || !createdRequestId) return;
    try {
      const blob = await downloadPaymentRequestPdf(token, createdRequestId);
      downloadBlob(blob, `payment_request_${createdRequestId}.pdf`);
    } catch (e: any) {
      toast({ title: "Download failed", description: e?.message || "Could not download PDF", variant: "destructive" });
    }
  };

  const handleOpenPdf = async () => {
    if (!token || !createdRequestId) return;
    try {
      const blob = await downloadPaymentRequestPdf(token, createdRequestId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      // revoke later
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e: any) {
      toast({ title: "Open failed", description: e?.message || "Could not open PDF", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
          <CardDescription>Create printable payment requests (QR + PDF)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="service" className="space-y-4">
            <TabsList>
              <TabsTrigger value="service">Service / Other</TabsTrigger>
              <TabsTrigger value="store">Store Basket</TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="service-title">Title (optional)</Label>
                <Input
                  id="service-title"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Cleaning service, Consultation, Custom job"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service-note">Note (optional)</Label>
                <Textarea
                  id="service-note"
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  placeholder="Any extra details for the payer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="service-amount">Amount</Label>
                  <Input
                    id="service-amount"
                    value={serviceAmount}
                    onChange={(e) => setServiceAmount(e.target.value)}
                    type="number"
                    placeholder="50000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-currency">Currency</Label>
                  <Input
                    id="service-currency"
                    value={serviceCurrency}
                    onChange={(e) => setServiceCurrency(e.target.value.toUpperCase())}
                    placeholder="UGX"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleCreateServiceRequest}>
                    Create Request
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="store" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store-select">Store</Label>
                <select
                  id="store-select"
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={!token || loadingStores}
                  value={selectedStoreId}
                  onChange={(e) => {
                    setSelectedStoreId(e.target.value);
                    setBasketItems([]);
                    setProductSearch("");
                    setProductResults([]);
                  }}
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {!stores.length && token && !loadingStores ? (
                  <p className="text-sm text-muted-foreground">No stores found.</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="basket-note">Note (optional)</Label>
                <Textarea
                  id="basket-note"
                  value={basketNote}
                  onChange={(e) => setBasketNote(e.target.value)}
                  placeholder="Shown on the printable request"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="product-search">Add products</Label>
                <Input
                  id="product-search"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  disabled={!token || !selectedStoreId}
                />
                {loadingProducts ? (
                  <p className="text-sm text-muted-foreground">Searching…</p>
                ) : null}
                {productResults.length ? (
                  <div className="border rounded-md divide-y">
                    {productResults.map((p) => (
                      <button
                        key={p.id}
                        className="w-full text-left px-3 py-2 hover:bg-muted/50"
                        onClick={() => addBasketItem(p)}
                        type="button"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {p.currency} {Number(p.price).toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Basket</p>
                  <p className="text-sm text-muted-foreground">Approx total: {basketTotal.toLocaleString()}</p>
                </div>
                {basketItems.length ? (
                  <div className="border rounded-md divide-y">
                    {basketItems.map((i) => (
                      <div key={i.product_id} className="px-3 py-2 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{i.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {i.currency} {Number(i.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={String(i.quantity)}
                            onChange={(e) => updateBasketQty(i.product_id, Number(e.target.value || 1))}
                            type="number"
                            className="w-20"
                            min={1}
                          />
                          <Button variant="ghost" onClick={() => removeBasketItem(i.product_id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No items added yet.</p>
                )}
              </div>

              <Button className="w-full" onClick={handleCreateStoreBasketRequest}>
                Create Store Basket Request
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {createdRequestId ? (
        <Card>
          <CardHeader>
            <CardTitle>Printable Request</CardTitle>
            <CardDescription>
              {loadingCreated
                ? "Loading request details…"
                : createdRequest
                ? `Status: ${createdRequest.status}`
                : `Request ID: ${createdRequestId}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {createdRequest ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  Amount: {createdRequest.amount} {createdRequest.currency}
                </div>
                {createdRequest.message ? <div>Title: {createdRequest.message}</div> : null}
                {createdRequest.conditions ? <div>Note: {createdRequest.conditions}</div> : null}
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleDownloadPdf}>Download PDF</Button>
              <Button variant="secondary" onClick={handleOpenPdf}>
                Open/Print PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
