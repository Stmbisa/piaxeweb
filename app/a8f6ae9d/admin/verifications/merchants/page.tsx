"use client";

import { MerchantVerificationsTable } from "@/components/admin/merchant-verifications-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI } from "@/lib/api/admin";

export default function MerchantVerificationsPage() {
  const { token } = useAuth();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const data = await adminAPI.getMerchantVerifications(token, "Pending", 20);
        setVerifications(data);
      } catch (err) {
        console.error("Error fetching merchant verifications:", err);
        setError(
          `Failed to load verifications: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [token]);

  return (
    <div className="space-y-6 animate-glass-appear">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Merchant Verifications
        </h1>
      </div>
      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">Merchant Verification Requests</CardTitle>
          <CardDescription>
            Review and manage merchant identity verification requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-10 bg-muted/50 rounded animate-pulse" />
              <div className="h-10 bg-muted/50 rounded animate-pulse" />
              <div className="h-10 bg-muted/50 rounded animate-pulse" />
            </div>
          ) : (
            <MerchantVerificationsTable initialData={verifications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
