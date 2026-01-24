export const dynamic = "force-dynamic";

import { ScanFallback } from "@/components/deeplink/scan-fallback";

export default function ScanPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <ScanFallback />
    </div>
  );
}
