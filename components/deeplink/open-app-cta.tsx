"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCustomSchemeUrl, getAndroidStoreUrl, getIosStoreUrl } from "@/lib/deeplink";

type Props = {
  title: string;
  description?: string;
  fallbackHref?: string; // web fallback path
  autoOpen?: boolean;
  pathOverride?: string; // when current path isn't the intended app path
  showCopyLink?: boolean;
};

export function OpenAppCTA({ title, description, fallbackHref, autoOpen = true, pathOverride, showCopyLink = false }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPathWithQuery = useMemo(() => {
    const base = pathOverride || pathname || "/";
    const qs = searchParams?.toString();
    return qs ? `${base}?${qs}` : base;
  }, [pathname, searchParams, pathOverride]);

  const customSchemeUrl = useMemo(() => buildCustomSchemeUrl(currentPathWithQuery), [currentPathWithQuery]);
  const webUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const [attempted, setAttempted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    if (attempted) return;

    setAttempted(true);

    // We can't reliably detect install state; we use a heuristic:
    // try to open the app, then after a short delay show install + web fallback UI.
    const t = setTimeout(() => {
      try {
        window.location.href = customSchemeUrl;
      } catch {
        // ignore
      }
    }, 50);

    const f = setTimeout(() => setShowFallback(true), 1200);

    return () => {
      clearTimeout(t);
      clearTimeout(f);
    };
  }, [autoOpen, attempted, customSchemeUrl]);

  const iosStore = getIosStoreUrl();
  const androidStore = typeof window !== "undefined" ? getAndroidStoreUrl(window.location.href) : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          {showFallback ? "If the app didn’t open, use the options below." : "Opening the Piaxis app…"}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => (window.location.href = customSchemeUrl)}>Open in app</Button>
          {showCopyLink ? (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(webUrl || window.location.href);
                } catch {
                  // ignore
                }
              }}
            >
              Copy link
            </Button>
          ) : null}
          {androidStore ? (
            <Button variant="secondary" asChild>
              <a href={androidStore} rel="noreferrer">Install (Android)</a>
            </Button>
          ) : null}
          {iosStore ? (
            <Button variant="secondary" asChild>
              <a href={iosStore} rel="noreferrer">Install (iOS)</a>
            </Button>
          ) : null}
          {fallbackHref ? (
            <Button variant="outline" asChild>
              <Link href={fallbackHref}>Continue on web</Link>
            </Button>
          ) : null}
        </div>

        <div className="text-xs text-muted-foreground break-all">
          App link: {customSchemeUrl}
        </div>
      </CardContent>
    </Card>
  );
}
