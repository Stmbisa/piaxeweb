"use client";

type AnalyticsEvent = {
  event_name: string;
  source?: string;
  session_id?: string;
  device_id?: string;
  path?: string;
  occurred_at?: string;
  properties?: Record<string, any>;
};

const SESSION_KEY = "piaxis_session_id";

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = randomId();
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

export async function trackEvent(
  event_name: string,
  properties: Record<string, any> = {}
) {
  try {
    const session_id = getOrCreateSessionId();
    const path = typeof window !== "undefined" ? window.location.pathname : undefined;

    const body = {
      events: [
        {
          event_name,
          source: "web",
          session_id,
          path,
          occurred_at: new Date().toISOString(),
          properties,
        } satisfies AnalyticsEvent,
      ],
    };

    // Use keepalive so it still ships during navigation
    await fetch("/api/proxy/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Never block UX on analytics
  }
}
