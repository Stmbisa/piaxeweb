import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import { API_ENDPOINTS } from "@/lib/config/env";
import { RecentSignupsTable } from "./recent-signups-table";
import { UserVerificationsTable } from "./user-verifications-table";
import {
  AlertCircle,
  RefreshCw,
  Users,
  ClipboardCheck,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { getDeviceIdFromToken } from "@/lib/utils";
import { useAdminAPI } from "@/lib/hooks/use-admin-api";

interface DashboardStats {
  recentSignups: number;
  pendingVerifications: number;
  verifiedUsers: number;
  totalUsers: number;
}

export function AdminDashboardOverview() {
  const { token, user, isAuthenticated } = useAuth();
  const { fetchWithAuth } = useAdminAPI();
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    recentSignups: 0,
    pendingVerifications: 0,
    verifiedUsers: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use proxy to avoid CORS issues
      const signupsUrl = `/api/proxy/users/admin/recent-signups?limit=5`;

      const signupsResponse = await fetchWithAuth(signupsUrl, {
        method: "GET",
      });

      if (!signupsResponse.ok) {
        const errorText = await signupsResponse.text();
        throw new Error(
          `Failed to fetch recent signups: ${signupsResponse.status} - ${errorText}`
        );
      }

      const signupsData = await signupsResponse.json();
      setRecentSignups(signupsData);

      // Fetch pending verifications
      const verificationsUrl = `/api/proxy/users/admin/verifications/users?status=Pending&limit=5`;

      const verificationsResponse = await fetchWithAuth(verificationsUrl, {
        method: "GET",
      });

      if (!verificationsResponse.ok) {
        const errorText = await verificationsResponse.text();
        throw new Error(
          `Failed to fetch verifications: ${verificationsResponse.status} - ${errorText}`
        );
      }

      const verificationsData = await verificationsResponse.json();
      setPendingVerifications(verificationsData);

      // Set stats
      setStats({
        recentSignups: signupsData.length,
        pendingVerifications: verificationsData.length,
        verifiedUsers: 45, // Sample placeholder data
        totalUsers: 178, // Sample placeholder data
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Don't set error for token expiration - it's handled by the hook
      if (
        err instanceof Error &&
        err.message !== "SESSION_EXPIRED" &&
        err.message !== "TOKEN_REFRESHED"
      ) {
        setError(`Failed to load dashboard data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  return (
    <div className="space-y-6 animate-glass-appear">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card-enhanced border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Recent Signups
            </CardTitle>
            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.recentSignups}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="glass-card-enhanced border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Pending Verifications
            </CardTitle>
            <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.pendingVerifications}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="glass-card-enhanced border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Verified Users
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.verifiedUsers}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="glass-card-enhanced border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalUsers}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="glass-card animate-glass-appear"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-row justify-between items-center">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              className="ml-2 glass-button hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Signups */}
      <Card className="glass-card-enhanced animate-glass-appear">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">
            Recent Signups
          </CardTitle>
          <CardDescription>
            The most recent user registrations on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <RecentSignupsTable initialData={recentSignups} />
          )}
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      <Card className="glass-card-enhanced animate-glass-appear">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">
            Pending Verifications
          </CardTitle>
          <CardDescription>
            Users waiting for identity verification approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UserVerificationsTable initialData={pendingVerifications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
