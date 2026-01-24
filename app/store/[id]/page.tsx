export const dynamic = "force-dynamic";

import { OpenAppCTA } from "@/components/deeplink/open-app-cta";

export default async function StoreDeepLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      <OpenAppCTA
        title="Store"
        description="Open this store in the Piaxis app."
        fallbackHref="/"
        pathOverride={`/store/${id}`}
      />
    </div>
  );
}
