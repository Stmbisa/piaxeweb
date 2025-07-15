import AddProductPage from "@/components/business/add-product-page";
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route";

export default async function Page({
  searchParams,
}: {
  searchParams: { store_id?: string };
}) {
  const { store_id: storeId } = await searchParams;

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  return (
    <BusinessProtectedRoute>
      <AddProductPage storeId={storeId} />
    </BusinessProtectedRoute>
  );
}
