export const dynamic = "force-dynamic";
import { StoreBasketPayment } from "@/components/payments/store-basket-payment";

export default async function StoreBasketPayPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <StoreBasketPayment requestId={requestId} />;
}
