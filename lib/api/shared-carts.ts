export type SharedCartDetails = {
  id: string;
  cart_type: string;
  status: string;
  piaxis_token: string;
  total_amount: string;
  currency: string;
  inventory_items?: Array<{ id: string; product_name?: string; price?: string; product_code?: string }>;
  ecommerce_items?: Array<{ id: string; product_name?: string; quantity?: number; unit_price?: string; total_price?: string }>;
  [key: string]: any;
};

export async function getSharedCartDetailsByToken(
  token: string | null | undefined,
  cartToken: string
): Promise<SharedCartDetails> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/proxy/shopping_and_inventory/shared-carts/${cartToken}/details`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to load shared cart (${res.status})`);
  }

  return (await res.json()) as SharedCartDetails;
}

export async function paySharedCart(
  token: string | null | undefined,
  cartToken: string,
  cartType: "instore" | "ecommerce",
  payload: Record<string, any>
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const upstream =
    cartType === "ecommerce"
      ? `shopping_and_inventory/shared-ecommerce-carts/${cartToken}/pay`
      : `shopping_and_inventory/shared-carts/${cartToken}/pay`;

  const res = await fetch(`/api/proxy/${upstream}`, {
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
