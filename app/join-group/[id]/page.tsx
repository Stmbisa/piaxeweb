export const dynamic = "force-dynamic";

import { OpenAppCTA } from "@/components/deeplink/open-app-cta";

export default async function JoinGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      <OpenAppCTA
        title="Join Group"
        description="Continue in the Piaxis app to view and accept this invitation."
        fallbackHref="/"
        pathOverride={`/join-group/${id}`}
      />
    </div>
  );
}
