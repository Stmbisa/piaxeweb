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
import { adminAPI } from "@/lib/api/admin";

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
        const data = await adminAPI.getRecentSignups(token, 20);
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
    <div className="space-y-6 animate-glass-appear">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Recent Signups</h1>
      </div>
      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">User Registrations</CardTitle>
          <CardDescription>
            View and manage recent user registrations on the platform.
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
            <RecentSignupsTable initialData={recentSignups} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
