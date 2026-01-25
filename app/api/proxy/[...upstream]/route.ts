import { NextRequest, NextResponse } from "next/server";
import { getDeviceIdFromToken } from "@/lib/utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gopiaxis.com";

// Allow-list of upstream path prefixes we proxy
const ALLOWED_PREFIXES = [
  "wallet/",
  "shopping_and_inventory/",
  "payments/",
  "chain_payments/", // Chain payments settlement monitoring
  "auth/devices",
  "users/admin/", // Admin user management endpoints
  "monitoring/", // Monitoring & health endpoints
  "escrow/", // Escrow admin stats endpoints
  "support/", // Support ticketing endpoints
  "admin/crm/", // Admin tools (CRM)
  "admin/public_content/", // Admin public updates/tips CRUD
];

function isAllowed(path: string) {
  return ALLOWED_PREFIXES.some((p) => path.startsWith(p));
}

export const dynamic = "force-dynamic";

async function handle(req: NextRequest, upstreamParts: string[]) {
  const path = (upstreamParts || []).join("/");
  if (!path || !isAllowed(path)) {
    return NextResponse.json(
      { detail: "Upstream path not allowed" },
      { status: 403 }
    );
  }

  // Forward auth and attach device id
  const authHeader = req.headers.get("authorization") || undefined;
  const token = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.split(" ")[1]
    : undefined;
  const deviceId = token ? getDeviceIdFromToken(token) : undefined;

  // Some upstream endpoints require a trailing slash (e.g. wallet/wallets/, shopping_and_inventory/stores/)
  const needsTrailing = [
    "wallet/wallets",
    "shopping_and_inventory/stores",
    "monitoring/health/celery",
  ].includes(path);
  const url = `${API_BASE_URL}/${path}${needsTrailing ? "/" : ""}${
    req.nextUrl.search
  }`;

  console.log(`Proxying request to: ${url}`);
  console.log(`With device ID: ${deviceId || "Not found"}`);

  const init: RequestInit = {
    method: req.method,
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(deviceId ? { "X-Device-ID": deviceId } : {}),
      // Only forward Content-Type on non-GET requests to avoid upstream 400s
      ...(req.method !== "GET" && req.headers.get("content-type")
        ? { "Content-Type": req.headers.get("content-type") as string }
        : {}),
      Accept: "application/json",
    },
    // Forward body for non-GET/HEAD
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : (await req.text()) || undefined,
    cache: "no-store",
  };

  try {
    // Add a conservative timeout to avoid hanging connections in dev
    const signal = (AbortSignal as any)?.timeout
      ? (AbortSignal as any).timeout(15000)
      : undefined;
    const upstream = await fetch(url, { ...init, signal });

    console.log(`Proxy response status: ${upstream.status}`);

    // Try to proxy JSON response; fall back to text
    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await upstream.json().catch((err) => {
        console.error(`Error parsing JSON response: ${err.message}`);
        return { error: "Failed to parse JSON response" };
      });
      return NextResponse.json(data, { status: upstream.status });
    } else {
      const text = await upstream.text();
      console.log(
        `Non-JSON response (${contentType}): ${text.substring(0, 100)}...`
      );
      return new NextResponse(text, {
        status: upstream.status,
        headers: { "content-type": contentType || "text/plain" },
      });
    }
  } catch (error) {
    console.error(
      `Proxy error for ${url}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return NextResponse.json(
      {
        detail: `Proxy error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ upstream: string[] }> }
) {
  const { upstream } = await ctx.params;
  return handle(req, upstream);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ upstream: string[] }> }
) {
  const { upstream } = await ctx.params;
  return handle(req, upstream);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ upstream: string[] }> }
) {
  const { upstream } = await ctx.params;
  return handle(req, upstream);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ upstream: string[] }> }
) {
  const { upstream } = await ctx.params;
  return handle(req, upstream);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ upstream: string[] }> }
) {
  const { upstream } = await ctx.params;
  return handle(req, upstream);
}
