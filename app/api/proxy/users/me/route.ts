import { NextRequest, NextResponse } from "next/server";
import { getDeviceIdFromToken } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gopiaxis.com";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json({ detail: "Authorization token required" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const deviceId = getDeviceIdFromToken(token);

    // Forward the request server-to-server with the device header to avoid browser CORS/cookie issues
    const upstream = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(deviceId ? { "X-Device-ID": deviceId } : {}),
      },
      // Do not forward browser cookies; device header is sufficient
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || "Proxy error" },
      { status: 500 }
    );
  }
}
