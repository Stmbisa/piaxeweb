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
import { adminAPI } from "@/lib/api/admin";
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
      const data = await adminAPI.adminEnvInfo(token);
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Environment Info</h1>
            <p className="text-sm text-white/70">
              Masked metadata for environment secrets (safe for diagnostics)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEnvInfo}
            disabled={loading}
            className="backdrop-blur-md bg-white/10 border-white/20 text-white"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
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
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-primary/10" />
          <CardHeader className="relative z-10">
            <CardTitle>Environment File Path</CardTitle>
            <CardDescription>
              Location of the environment configuration file
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <code className="text-sm bg-black/40 px-3 py-2 rounded-md text-white">
              {envInfo.env_path}
            </code>
          </CardContent>
        </Card>
      )}

      {/* Secrets Info */}
      <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-amber-500/15" />
        <CardHeader className="relative z-10">
          <CardTitle>Environment Secrets</CardTitle>
          <CardDescription>
            Masked metadata showing presence, length, and last 4 characters of
            each secret
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : envInfo ? (
            <div className="space-y-4">
              {Object.entries(envInfo.secrets).map(([key, secret]) => (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                  <div className="relative flex items-center justify-between">
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
                  <div className="relative mt-3">
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
                          <code className="ml-2 font-mono bg-black/40 px-2 py-1 rounded text-white">
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No environment information available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
