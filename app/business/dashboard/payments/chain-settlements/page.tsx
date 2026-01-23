"use client";

export const dynamic = "force-dynamic";

import { BusinessProtectedRoute } from "@/components/auth/business-protected-route";
import { ChainSettlementsManager } from "@/components/business/chain-settlements-manager";

export default function Page() {
  return (
    <BusinessProtectedRoute>
      <ChainSettlementsManager />
    </BusinessProtectedRoute>
  );
}
