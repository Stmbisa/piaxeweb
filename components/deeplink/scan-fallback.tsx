"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { resolveScanCodeWeb, type ScanResolveResponse } from "@/lib/api/scan";
import { OpenAppCTA } from "@/components/deeplink/open-app-cta";

function normalize(s: string) {
  return (s || "").trim();
}

export function ScanFallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCode = normalize(searchParams.get("code") || "");
  const storeId = normalize(searchParams.get("store_id") || searchParams.get("storeId") || "");

  const [manualCode, setManualCode] = useState(initialCode);
  const [resolving, setResolving] = useState(false);
  const [lastResolution, setLastResolution] = useState<ScanResolveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera scanning (BarcodeDetector-based)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const supported = useMemo(() => {
    return typeof window !== "undefined" && "BarcodeDetector" in window;
  }, []);

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const routeFromResolution = (r: ScanResolveResponse) => {
    setLastResolution(r);

    switch (r.type) {
      case "payment_request":
      case "store_payment_request": {
        const requestId = r.data?.request_id;
        if (requestId) {
          router.replace(`/request/${requestId}`);
          return;
        }
        break;
      }
      case "shared_cart": {
        const cartToken = r.data?.cart_token;
        if (cartToken) {
          router.replace(`/cart/${cartToken}`);
          return;
        }
        break;
      }
      case "store": {
        const store = r.data?.store_id;
        if (store) {
          router.replace(`/store/${store}`);
          return;
        }
        break;
      }
      // payment_qr / user_qr and product codes: web can’t safely fulfill yet.
      default:
        break;
    }
  };

  const resolve = async (code: string) => {
    const c = normalize(code);
    if (!c) return;

    setResolving(true);
    setError(null);

    try {
      const r = await resolveScanCodeWeb(c, storeId || undefined);
      routeFromResolution(r);
    } catch (e: any) {
      setError(e?.message || "Failed to resolve");
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    if (initialCode) resolve(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const startCamera = async () => {
    setError(null);

    if (!supported) {
      setError("This browser doesn’t support camera barcode scanning. Use manual entry.");
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // @ts-expect-error BarcodeDetector is not in TS lib by default
      const detector = new window.BarcodeDetector({
        formats: [
          "qr_code",
          "code_128",
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_39",
          "code_93",
          "itf",
          "pdf417",
          "aztec",
          "data_matrix",
        ],
      });

      const tick = async () => {
        try {
          const v = videoRef.current;
          if (!v || v.readyState < 2) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          const canvas = document.createElement("canvas");
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

          const bitmap = await createImageBitmap(canvas);
          // @ts-expect-error BarcodeDetector
          const results = await detector.detect(bitmap);
          bitmap.close();

          if (Array.isArray(results) && results.length > 0) {
            const val = results[0]?.rawValue || "";
            if (val) {
              stopCamera();
              setManualCode(val);
              await resolve(val);
              return;
            }
          }
        } catch {
          // ignore per-frame errors
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch (e: any) {
      setError(e?.message || "Could not access camera");
      stopCamera();
    }
  };

  return (
    <div className="space-y-4">
      <OpenAppCTA
        title="Scan"
        description="Open in the Piaxis app, or scan on web if the app isn’t available."
        fallbackHref="/scan"
      />

      <Card>
        <CardHeader>
          <CardTitle>Scan on web</CardTitle>
          <CardDescription>
            If the app didn’t open, you can scan here (or paste a code).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={startCamera} disabled={resolving}>Start camera</Button>
            <Button variant="secondary" onClick={stopCamera}>Stop camera</Button>
          </div>

          <video ref={videoRef} playsInline muted className="w-full rounded-md border" />

          <Separator />

          <div className="flex gap-2">
            <Input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Paste QR/barcode value"
            />
            <Button onClick={() => resolve(manualCode)} disabled={resolving}>
              {resolving ? "Resolving…" : "Resolve"}
            </Button>
          </div>

          {lastResolution ? (
            <div className="text-xs text-muted-foreground break-all">
              Resolved: {lastResolution.type}
            </div>
          ) : null}

          {lastResolution && ["payment_qr", "user_qr", "product_code", "store_product_code", "instore_product"].includes(lastResolution.type) ? (
            <div className="text-sm text-muted-foreground">
              This code type is currently supported in the mobile app only. Use “Open in app”.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
