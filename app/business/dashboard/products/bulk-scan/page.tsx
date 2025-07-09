import BulkScanPage from "@/components/business/bulk-scan-page";

export default async function Page({
  searchParams,
}: {
  searchParams: { store_id?: string };
}) {
  const { store_id: storeId } = await searchParams;

  if (!storeId) {
    return <div>Error: Store ID is missing.</div>;
  }

  return <BulkScanPage storeId={storeId} />;
}
