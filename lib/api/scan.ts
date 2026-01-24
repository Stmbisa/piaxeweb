export type ScanResolveType =
  | "payment_qr"
  | "user_qr"
  | "payment_request"
  | "store_payment_request"
  | "shared_cart"
  | "store"
  | "instore_product"
  | "store_product_code"
  | "product_code"
  | "unknown";

export type ScanResolveResponse = {
  type: ScanResolveType;
  data: Record<string, any>;
};

export async function resolveScanCodeWeb(
  code: string,
  storeId?: string
): Promise<ScanResolveResponse> {
  const res = await fetch("/api/proxy/payments/scan/resolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ code, store_id: storeId || undefined }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to resolve (${res.status})`);
  }

  return (await res.json()) as ScanResolveResponse;
}
