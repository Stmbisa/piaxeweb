export const dynamic = "force-dynamic";

import { PaymentRequestPay } from "@/components/payments/payment-request-pay";

export default async function RequestPayAliasPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PaymentRequestPay requestId={requestId} />
    </div>
  );
}
