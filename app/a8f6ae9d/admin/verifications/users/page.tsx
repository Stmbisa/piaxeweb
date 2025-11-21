"use client";

import { UserVerificationsTable } from "@/components/admin/user-verifications-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";

export default function UserVerificationsPage() {
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
        const response = await fetch(
          `/api/proxy/users/admin/verifications/users?status=Pending&limit=10`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch verifications: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        setVerifications(data);
      } catch (err) {
        console.error("Error fetching verifications:", err);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          User Verifications
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Review and manage user identity verification requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserVerificationsTable initialData={verifications} />
        </CardContent>
      </Card>
    </div>
  );
}
