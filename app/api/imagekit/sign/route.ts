import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { IMAGEKIT_CONFIG } from "@/lib/config/env";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_CONFIG.PUBLIC_KEY,
  privateKey: IMAGEKIT_CONFIG.PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_CONFIG.URL_ENDPOINT,
});

export async function POST(request: NextRequest) {
  if (!IMAGEKIT_CONFIG.PRIVATE_KEY || !IMAGEKIT_CONFIG.URL_ENDPOINT) {
    return NextResponse.json(
      { error: "ImageKit server credentials are not configured." },
      { status: 500 }
    );
  }

  try {
    const { urls, expireSeconds = 300 } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty urls array." },
        { status: 400 }
      );
    }

    const validUrls = Array.from(
      new Set(
        urls.filter(
          (url: unknown): url is string =>
            typeof url === "string" && url.trim().length > 0
        )
      )
    );

    if (validUrls.length === 0) {
      return NextResponse.json(
        { signedUrls: {} },
        {
          status: 200,
        }
      );
    }

    const sanitizedEndpoint = IMAGEKIT_CONFIG.URL_ENDPOINT.replace(/\/$/, "");
    const signedUrls: Record<string, string> = {};

    validUrls.forEach((assetUrl) => {
      try {
        let signedUrl: string | null = null;

        if (sanitizedEndpoint && assetUrl.startsWith(sanitizedEndpoint)) {
          let path = assetUrl.slice(sanitizedEndpoint.length);
          if (!path.startsWith("/")) {
            path = `/${path}`;
          }
          signedUrl = imagekit.url({
            path,
            signed: true,
            expireSeconds,
          });
        } else {
          signedUrl = imagekit.url({
            src: assetUrl,
            signed: true,
            expireSeconds,
            urlEndpoint: sanitizedEndpoint,
          });
        }

        if (signedUrl) {
          signedUrls[assetUrl] = signedUrl;
        }
      } catch (error) {
        console.error(`Failed to sign ImageKit URL: ${assetUrl}`, error);
      }
    });

    return NextResponse.json({ signedUrls });
  } catch (error) {
    console.error("Error generating signed ImageKit URLs:", error);
    return NextResponse.json(
      { error: "Unable to generate signed URLs" },
      { status: 500 }
    );
  }
}
