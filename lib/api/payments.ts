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
