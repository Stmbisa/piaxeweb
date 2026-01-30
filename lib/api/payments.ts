export type PaymentMethodEnum = "piaxis" | "mtn" | "airtel" | "card";

export type PaymentRequestDetail = {
  id: string;
  amount: string | null;
  total_amount?: string | null;
  currency: string;
  status: string;
  created_at: string;
  expires_at: string;
  request_type: string;
  message?: string | null;
  conditions?: string | null;
  collected_amount?: string;
  is_requester?: boolean;
  is_recipient?: boolean;
  is_allowed_payer?: boolean;
  qr_code?: any;
  metadata?: any;
};

export type PayPaymentRequestPayload = {
  amount: number;
  currency: string;
  payment_method: PaymentMethodEnum;
  mfa_code?: string;
  user_info?: Record<string, any> | null;
};

export type PaymentRequestCreatePayload = {
  amount?: number;
  min_amount?: number;
  max_amount?: number;
  target_amount?: number;
  currency: string;
  request_type:
    | "fixed_amount"
    | "open_amount"
    | "range_amount"
    | "product_payment"
    | "specific";
  access_type?: "restricted" | "open" | "fundraise";
  recipient_identifier?: string;
  expires_at?: string;
  message?: string;
  conditions?: string;
  generate_qr?: boolean;
};

export type PaymentRequestCreateResponse = {
  id: string;
  amount: string | null;
  currency: string;
  status: string;
  created_at: string;
  expires_at: string;
  request_type: string;
  qr_code?: { token: string } | null;
};

export type StoreItemizedPaymentRequestCreatePayload = {
  store_id: string;
  items: Array<{ product_id: string; quantity: number }>;
  currency?: string;
  message?: string;
  expires_at?: string;
  generate_qr?: boolean;
};

export type StoreItemizedPaymentRequestCreateResponse = {
  request_id: string;
  qr_token: string | null;
  store_id: string;
  currency: string;
  amount: string;
  total_amount: string;
  products: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
  created_at: string;
  expires_at: string;
};

export async function getPaymentRequestDetails(
  token: string | null | undefined,
  requestId: string
): Promise<PaymentRequestDetail> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/proxy/payments/payment-requests/${requestId}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to load payment request (${res.status})`);
  }

  return (await res.json()) as PaymentRequestDetail;
}

export async function payPaymentRequest(
  token: string | null | undefined,
  requestId: string,
  payload: PayPaymentRequestPayload
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/proxy/payments/payment-requests/${requestId}/pay`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to pay (${res.status})`);
  }

  return await res.json();
}

export async function createPaymentRequest(
  token: string,
  payload: PaymentRequestCreatePayload
): Promise<PaymentRequestCreateResponse> {
  const res = await fetch(`/api/proxy/payments/payment-requests/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create payment request (${res.status})`);
  }

  return (await res.json()) as PaymentRequestCreateResponse;
}

export async function createStoreItemizedPaymentRequest(
  token: string,
  payload: StoreItemizedPaymentRequestCreatePayload
): Promise<StoreItemizedPaymentRequestCreateResponse> {
  const res = await fetch(`/api/proxy/shopping_and_inventory/payment-requests/store-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create store payment request (${res.status})`);
  }

  return (await res.json()) as StoreItemizedPaymentRequestCreateResponse;
}

export async function downloadPaymentRequestPdf(
  token: string,
  requestId: string
): Promise<Blob> {
  const res = await fetch(`/api/proxy/payments/payment-requests/${requestId}/print`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to download PDF (${res.status})`);
  }

  return await res.blob();
}
