import AddProductPage from "@/components/business/add-product-page";

export default function Page({
  searchParams,
}: {
  searchParams: { store_id: string };
}) {
  const storeId = searchParams.store_id;

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  return <AddProductPage storeId={storeId} />;
}
