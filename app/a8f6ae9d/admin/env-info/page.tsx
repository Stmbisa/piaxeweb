"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import { API_ENDPOINTS } from "@/lib/config/env";
import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

interface SecretInfo {
  present: boolean;
  length: number;
  last4: string | null;
}

interface EnvInfo {
  env_path: string;
  secrets: {
    [key: string]: SecretInfo;
  };
}

export default function EnvInfoPage() {
  const { token } = useAuth();
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvInfo = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/proxy/users/admin/env-info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch environment info: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      setEnvInfo(data);
    } catch (err) {
      console.error("Error fetching environment info:", err);
      setError(
        `Failed to load environment info: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvInfo();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Environment Info
          </h1>
          <p className="text-muted-foreground mt-1">
            Masked metadata for environment secrets (safe for diagnostics)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchEnvInfo}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-row justify-between items-center">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEnvInfo}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Environment Path */}
      {envInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Environment File Path</CardTitle>
            <CardDescription>
              Location of the environment configuration file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted px-3 py-2 rounded-md">
              {envInfo.env_path}
            </code>
          </CardContent>
        </Card>
      )}

      {/* Secrets Info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Secrets</CardTitle>
          <CardDescription>
            Masked metadata showing presence, length, and last 4 characters of
            each secret
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : envInfo ? (
            <div className="space-y-4">
              {Object.entries(envInfo.secrets).map(([key, secret]) => (
                <div key={key} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-semibold">{key}</code>
                      {secret.present ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Present
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-gray-400 text-gray-600 dark:text-gray-400"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                  </div>
                  {secret.present ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Length:</span>
                        <span className="ml-2 font-medium">
                          {secret.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Last 4 chars:
                        </span>
                        <code className="ml-2 font-mono bg-muted px-2 py-1 rounded">
                          {secret.last4 || "N/A"}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      This secret is not present in the environment file
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No environment information available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
