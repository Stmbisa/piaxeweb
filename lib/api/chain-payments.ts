import { API_BASE_URL } from "@/lib/config/env";

export type SellerSettlementProductRow = {
  product_id: string;
  product_name: string;
  credited_units: number;
  sold_units: number;
  remaining_units: number;
  unpaid_by_currency: Record<string, string>; // decimals as strings
};

export type SellerSettlementLotRow = {
  step_id: string;
  date: string;
  from_entity_id: string | null;
  from_entity_username: string | null;
  quantity: number;
  consumed_quantity: number;
  remaining_quantity: number;
  unit_cost: string | null;
  currency_code: string | null;
};

export type SellerSettlementDebtByCreditorRow = {
  creditor_id: string | null;
  creditor_username: string | null;
  currency_code: string;
  original_amount_total: string;
  remaining_amount_total: string;
};

export type SellerSettlementProductDetail = {
  product_id: string;
  product_name: string;
  chain_currency_code: string | null;
  credited_units: number;
  sold_units: number;
  remaining_units: number;
  lots: SellerSettlementLotRow[];
  debts_by_creditor: SellerSettlementDebtByCreditorRow[];
};

export type AdminChainSettlementsOverview = {
  unpaid_totals_by_currency: Record<string, string>;
  top_debtors: Array<{ account_id: string; username: string | null; remaining: string }>;
  top_creditors: Array<{ account_id: string; username: string | null; remaining: string }>;
  debts_count: number;
};

async function authedFetch<T>(token: string, url: string): Promise<T> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.detail || body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export const chainPaymentsAPI = {
  sellerSettlementProducts: async (token: string, productId?: string) => {
    const qp = productId ? `?product_id=${encodeURIComponent(productId)}` : "";
    return authedFetch<SellerSettlementProductRow[]>(
      token,
      `${API_BASE_URL}/chain_payments/seller/settlements/products${qp}`
    );
  },

  sellerSettlementProductDetail: async (token: string, productId: string) => {
    return authedFetch<SellerSettlementProductDetail>(
      token,
      `${API_BASE_URL}/chain_payments/seller/settlements/products/${encodeURIComponent(productId)}`
    );
  },

  adminOverview: async (token: string) => {
    return authedFetch<AdminChainSettlementsOverview>(
      token,
      `${API_BASE_URL}/chain_payments/admin/chain-settlements/overview`
    );
  },
};
