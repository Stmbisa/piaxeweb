"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UgxOnlyCurrencySelector from "@/components/common/UgxOnlyCurrencySelector";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

type ReceiverLine = {
  id: string;
  amount?: number;
};

type BulkEscrowResponse = {
  status: string;
  escrows: string[];
  total_amount: string;
  successful_receivers: number;
  failed_receivers: number;
  failed_receiver_details: { id: string; reason: string }[];
};

function parseReceivers(text: string): ReceiverLine[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: ReceiverLine[] = [];
  for (const line of lines) {
    // Formats supported:
    // - <uuid>
    // - <uuid>,<amount>
    // - <uuid> <amount>
    const parts = line.split(/[\s,]+/).filter(Boolean);
    if (parts.length === 0) continue;
    const id = parts[0];
    const amount = parts.length > 1 ? Number(parts[1]) : undefined;
    out.push({
      id,
      amount: Number.isFinite(amount as number) ? (amount as number) : undefined,
    });
  }
  return out;
}

export default function AdminBulkEscrowPage() {
  const { token } = useAuth();

  const [currencyCode, setCurrencyCode] = useState("UGX");
  const [amountPerReceiver, setAmountPerReceiver] = useState("1000");
  const [paymentMethod, setPaymentMethod] = useState("piaxis");
  const [receiversText, setReceiversText] = useState("");
  const [termsJson, setTermsJson] = useState("[]");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkEscrowResponse | null>(null);

  const parsedReceivers = useMemo(() => parseReceivers(receiversText), [receiversText]);

  const submit = async () => {
    if (!token) {
      setError("Not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const amountNum = Number(amountPerReceiver);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        throw new Error("Amount per receiver must be a positive number.");
      }
      if (!currencyCode || currencyCode.trim().length !== 3) {
        throw new Error("Currency code must be a 3-letter code (e.g. UGX).");
      }
      if (parsedReceivers.length === 0) {
        throw new Error("Add at least one receiver (one per line).");
      }

      let terms: any[] = [];
      try {
        const parsed = JSON.parse(termsJson || "[]");
        terms = Array.isArray(parsed) ? parsed : [];
      } catch {
        throw new Error("Terms JSON must be valid JSON (e.g. [] or [{...}]).");
      }

      const receiversPayload = parsedReceivers.map((r) =>
        typeof r.amount === "number" ? ({ id: r.id, amount: r.amount } as any) : r.id
      );

      const payload = {
        receivers: receiversPayload,
        amount_per_receiver: amountNum,
        currency_code: currencyCode.trim().toUpperCase(),
        terms,
        payment_method: paymentMethod || "piaxis",
      };

      const res = await fetch("/api/proxy/wallet/bulk-escrows", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as BulkEscrowResponse | any;
      if (!res.ok) {
        const detail = data?.detail || `Request failed (${res.status})`;
        throw new Error(
          typeof detail === "string" ? detail : JSON.stringify(detail)
        );
      }

      setResult(data as BulkEscrowResponse);
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
        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Bulk Escrow</h1>
            <p className="text-sm text-white/70">
              Create a bulk escrow payout using the existing backend endpoint.
            </p>
            <p className="text-xs text-white/60 mt-1">
              Note: the upstream endpoint enforces employer permissions.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={submit}
            className="backdrop-blur-md bg-white/10 border-white/20 text-white"
          >
            <RefreshCw className={"h-4 w-4 mr-2 " + (loading ? "animate-spin" : "")} />
            Submit
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>
              Receivers: one per line. Format: <code>uuid</code> or <code>uuid,amount</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium">Currency</label>
                <UgxOnlyCurrencySelector
                  title=""
                  currencies={[
                    { code: "UGX", name: "Ugandan Shilling" },
                    { code: "USD", name: "US Dollar" },
                    { code: "EUR", name: "Euro" },
                    { code: "GBP", name: "British Pound" },
                  ]}
                  value={currencyCode}
                  onChange={setCurrencyCode}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Amount per receiver</label>
                <Input value={amountPerReceiver} onChange={(e) => setAmountPerReceiver(e.target.value)} placeholder="1000" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-2">
                Payment method
                {paymentMethod.trim().toLowerCase() === "mtn" ? (
                  <Image src="/images/mtn-logo.png" alt="MTN Mobile Money" width={34} height={14} />
                ) : paymentMethod.trim().toLowerCase() === "airtel" ? (
                  <Image src="/images/airtel-logo.png" alt="Airtel Money" width={34} height={14} />
                ) : null}
              </label>
              <Input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="piaxis" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Receivers</label>
              <Textarea
                value={receiversText}
                onChange={(e) => setReceiversText(e.target.value)}
                placeholder="b3e0...\n8c2a...,5000\n..."
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                Parsed: {parsedReceivers.length} receiver(s)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Terms JSON</label>
              <Textarea value={termsJson} onChange={(e) => setTermsJson(e.target.value)} rows={6} />
              <p className="text-xs text-muted-foreground">
                Leave as <code>[]</code> if no special conditions.
              </p>
            </div>

            <Button className="w-full" disabled={loading || !token} onClick={submit}>
              {loading ? "Submitting..." : "Create Bulk Escrow"}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Response from the backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!result ? (
              <p className="text-sm text-muted-foreground">No result yet.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Status:</span> {result.status}</div>
                <div><span className="font-medium">Total Amount:</span> {result.total_amount}</div>
                <div><span className="font-medium">Successful:</span> {result.successful_receivers}</div>
                <div><span className="font-medium">Failed:</span> {result.failed_receivers}</div>
                <div>
                  <span className="font-medium">Escrows:</span>
                  <div className="mt-1 max-h-40 overflow-auto rounded-md border border-border/50 p-2 bg-background/40">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.escrows, null, 2)}</pre>
                  </div>
                </div>
                {result.failed_receiver_details?.length ? (
                  <div>
                    <span className="font-medium">Failure details:</span>
                    <div className="mt-1 max-h-40 overflow-auto rounded-md border border-border/50 p-2 bg-background/40">
                      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.failed_receiver_details, null, 2)}</pre>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
