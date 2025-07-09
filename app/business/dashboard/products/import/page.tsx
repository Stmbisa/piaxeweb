import ImportProductsPage from "@/components/business/import-products-page";

export default async function Page({
  searchParams,
}: {
  searchParams: { store_id?: string };
}) {
  const { store_id: storeId } = await searchParams;

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  return <ImportProductsPage storeId={storeId} />;
}
