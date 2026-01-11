"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push(window.location.pathname + "/dashboard");
  }, [router]);

  return (
    <div className="space-y-8 animate-glass-appear">
      <Card className="glass-card-enhanced max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">
            Redirecting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Redirecting to admin dashboard...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
