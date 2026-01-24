export const dynamic = "force-dynamic";

import { SharedCartPay } from "@/components/payments/shared-cart-pay";

export default async function CartPayPage({
  params,
}: {
  params: Promise<{ cartToken: string }>;
}) {
  const { cartToken } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SharedCartPay cartToken={cartToken} />
    </div>
  );
}
