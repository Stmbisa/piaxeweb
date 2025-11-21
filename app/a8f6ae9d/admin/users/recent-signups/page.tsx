"use client";

import { RecentSignupsTable } from "@/components/admin/recent-signups-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";

export default function RecentSignupsPage() {
  const { token } = useAuth();
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignups = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/proxy/users/admin/recent-signups?limit=10`,
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
            `Failed to fetch recent signups: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        setRecentSignups(data);
      } catch (err) {
        console.error("Error fetching recent signups:", err);
        setError(
          `Failed to load signups: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSignups();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Recent Signups</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            View and manage recent user registrations on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSignupsTable initialData={recentSignups} />
        </CardContent>
      </Card>
    </div>
  );
}
