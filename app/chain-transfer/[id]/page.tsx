export const dynamic = "force-dynamic";

import { OpenAppCTA } from "@/components/deeplink/open-app-cta";

export default async function ChainTransferDeepLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      <OpenAppCTA
        title="Incoming transfer"
        description="Open this transfer in the Piaxis app to accept it into a destination store."
        fallbackHref="/"
        pathOverride={`/chain-transfer/${id}`}
        showCopyLink
      />
    </div>
  );
}
