export const dynamic = "force-dynamic";

import { OpenAppCTA } from "@/components/deeplink/open-app-cta";

export default async function PayTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      <OpenAppCTA
        title="Pay"
        description="This payment link is best handled in the Piaxis mobile app."
        fallbackHref={`/pay/${token}`}
        pathOverride={`/pay/${token}`}
      />
      <div className="text-sm text-muted-foreground">
        If you intended to pay a store basket request, you may have a request id link like `/request/&lt;uuid&gt;` or `/pay/store-basket/&lt;uuid&gt;`.
      </div>
    </div>
  );
}
