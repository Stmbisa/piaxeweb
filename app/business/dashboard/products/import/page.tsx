import ImportProductsPage from "@/components/business/import-products-page";

export default function Page({
  searchParams,
}: {
  searchParams: { store_id: string };
}) {
  const storeId = searchParams.store_id;

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  return <ImportProductsPage storeId={storeId} />;
}
