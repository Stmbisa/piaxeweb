"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/context";
import { adminAPI } from "@/lib/api/admin";
import { AlertCircle, RefreshCw } from "lucide-react";

const EXAMPLE_CRON = {
  type: "cron",
  cron_expression: "*/15 * * * *",
};

const EXAMPLE_INTERVAL = {
  type: "interval",
  interval: { minutes: 15 },
};

const EXAMPLE_SPECIFIC_DAYS = {
  type: "specific_days",
  days: ["monday", "wednesday", "friday"],
  times: ["09:00"],
};

export default function CrmRecurringDryRunPage() {
  const { token } = useAuth();

  const [patternJson, setPatternJson] = useState(
    JSON.stringify(EXAMPLE_CRON, null, 2)
  );
  const [endDateIso, setEndDateIso] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [result, setResult] = useState<{
    now: string;
    next_run: string | null;
    end_date: string | null;
    within_end_date: boolean;
  } | null>(null);

  const copyExample = async (
    key: "cron" | "interval" | "specific_days",
    example: Record<string, any>
  ) => {
    const text = JSON.stringify(example, null, 2);
    setPatternJson(text);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      setError(
        `Failed to copy to clipboard. Pattern was applied to the textarea. ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };

  const parsedPattern = useMemo(() => {
    try {
      return JSON.parse(patternJson);
    } catch {
      return null;
    }
  }, [patternJson]);

  const runDry = async () => {
    if (!token) return;

    setError(null);
    setResult(null);

    if (!parsedPattern || typeof parsedPattern !== "object") {
      setError("Recurring pattern must be valid JSON object.");
      return;
    }

    setLoading(true);
    try {
      const data = await adminAPI.crmRecurringNextRunDryRun(
        token,
        parsedPattern as Record<string, any>,
        endDateIso.trim() ? endDateIso.trim() : null
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              CRM Recurring Dry-Run
            </h1>
            <p className="text-sm text-muted-foreground">
              Computes the next run time for a given recurring_pattern (no scheduling)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runDry}
            disabled={loading || !token}
            className="backdrop-blur-md bg-white/10 border-white/20 text-gray-900 dark:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Compute
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Paste the JSON you send as schedule.recurring_pattern. Optionally set end_date (ISO).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-sm font-medium">recurring_pattern (JSON)</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyExample("cron", EXAMPLE_CRON)}
                >
                  {copied === "cron" ? "Copied" : "Copy cron"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyExample("interval", EXAMPLE_INTERVAL)}
                >
                  {copied === "interval" ? "Copied" : "Copy interval"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyExample("specific_days", EXAMPLE_SPECIFIC_DAYS)
                  }
                >
                  {copied === "specific_days" ? "Copied" : "Copy specific_days"}
                </Button>
              </div>
            </div>
            <Textarea
              value={patternJson}
              onChange={(e) => setPatternJson(e.target.value)}
              className="min-h-[180px] font-mono"
              error={!parsedPattern}
              helperText={!parsedPattern ? "Invalid JSON" : undefined}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">end_date (optional ISO 8601)</div>
            <Input
              placeholder="2026-01-12T10:00:00Z"
              value={endDateIso}
              onChange={(e) => setEndDateIso(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              If provided, the API also tells you whether next_run is before end_date.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Computed from backend CampaignScheduler.calculate_next_run(...)</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">now:</span>{" "}
                <code className="ml-2 font-mono bg-black/40 px-2 py-1 rounded text-white">
                  {result.now}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground">next_run:</span>{" "}
                <code className="ml-2 font-mono bg-black/40 px-2 py-1 rounded text-white">
                  {result.next_run ?? "null"}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground">within_end_date:</span>{" "}
                <code className="ml-2 font-mono bg-black/40 px-2 py-1 rounded text-white">
                  {String(result.within_end_date)}
                </code>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No result yet. Click Compute.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
