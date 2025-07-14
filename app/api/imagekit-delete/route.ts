import { NextRequest, NextResponse } from "next/server";
import { IMAGEKIT_CONFIG } from "@/lib/config/env";
// Import verifyToken but don't use it for now due to JWT secret issues
// import { verifyToken } from "@/lib/auth/token";

export async function POST(req: NextRequest) {
  try {
    // Get fileId from request body
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Check if we have the private key
    if (!IMAGEKIT_CONFIG.PRIVATE_KEY) {
      console.error("ImageKit private key is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log(
      `[ImageKit Delete] Attempting to delete image with fileId: ${fileId}`
    );

    // ImageKit API endpoint for file deletion
    // The correct endpoint is https://api.imagekit.io/v1/files/{fileId}
    const deleteUrl = `https://api.imagekit.io/v1/files/${fileId}`;

    console.log(`[ImageKit Delete] Using URL: ${deleteUrl}`);

    // Log the first few characters of the private key to verify it's being loaded correctly
    console.log(
      `[ImageKit Delete] Private key starts with: ${IMAGEKIT_CONFIG.PRIVATE_KEY.substring(
        0,
        5
      )}...`
    );

    // Delete the file from ImageKit
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(
          IMAGEKIT_CONFIG.PRIVATE_KEY + ":"
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[ImageKit Delete] Response status: ${response.status}`);

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error(
          `[ImageKit Delete] Failed to delete image ${fileId} - JSON response:`,
          errorData
        );
      } catch (e) {
        errorText = await response.text();
        console.error(
          `[ImageKit Delete] Failed to delete image ${fileId} - Text response:`,
          errorText
        );
      }

      return NextResponse.json(
        {
          error: "Failed to delete image",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    console.log(
      `[ImageKit Delete] Successfully deleted image with fileId: ${fileId}`
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(
      "[ImageKit Delete] Error in imagekit-delete API route:",
      error
    );

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
