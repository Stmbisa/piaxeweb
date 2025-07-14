/**
 * ImageKit Service for handling image uploads and management
 * Based on the mobile implementation but adapted for web usage
 */

import axios from "axios";
import { IMAGEKIT_CONFIG } from "../config/env";

// Create an API client that will include authentication headers
// Note: We'll pass the token directly to the getUploadAuthParameters function
// instead of trying to get it from localStorage, which doesn't work well with SSR
const apiClient = axios.create();

interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
}

interface ImageKitError extends Error {
  message: string;
  stack?: string;
  response?: {
    message?: string;
    help?: string;
    status?: number;
    data?: any;
  };
}

interface ImageKitFile {
  uri: string; // URL for the file (web equivalent of mobile URI)
  mimeType?: string;
  name?: string;
  size?: number;
}

interface ImageKitUploadResponse {
  url: string;
  fileId: string;
  thumbnailUrl: string;
}

// ImageKit upload endpoint
const IMAGEKIT_UPLOAD_ENDPOINT =
  "https://upload.imagekit.io/api/v1/files/upload";

/**
 * Get authentication parameters from your backend
 * @param authToken The authentication token from the auth context
 */
const getUploadAuthParameters = async (
  authToken: string
): Promise<ImageKitAuthResponse> => {
  if (!IMAGEKIT_CONFIG.AUTHENTICATION_ENDPOINT) {
    console.error(
      "ImageKit authentication endpoint is not configured in IMAGEKIT_CONFIG."
    );
    throw new Error("ImageKit authentication endpoint is missing.");
  }

  if (!authToken) {
    console.error(
      "Authentication token is missing. User may not be logged in."
    );
    throw new Error("Authentication token is required for ImageKit upload.");
  }

  console.log(
    "[AUTH_FETCH] Attempting to fetch ImageKit auth parameters from backend"
  );
  try {
    // Use the provided auth token
    const response = await axios.get(IMAGEKIT_CONFIG.AUTHENTICATION_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("[AUTH_FETCH] Backend response status:", response.status);
    console.log(
      "[AUTH_FETCH] Received auth parameters from backend:",
      response.data
    );
    return response.data;
  } catch (error: any) {
    console.error("[AUTH_FETCH] CRITICAL ERROR during fetch to backend:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(
      `Failed to get upload signature: ${
        error.response?.status || "Unknown"
      } . Body: ${JSON.stringify(error.response?.data || {})}`
    );
  }
};

/**
 * Upload an image to ImageKit
 * @param file File to upload
 * @param authToken Authentication token from the auth context
 * @returns Upload response with URL and file ID
 */
export const uploadImageToImageKit = async (
  file: ImageKitFile,
  authToken: string
) => {
  try {
    // Use values from IMAGEKIT_CONFIG
    if (!IMAGEKIT_CONFIG.PUBLIC_KEY) {
      console.error(
        "Client-side ImageKit public key is not configured in IMAGEKIT_CONFIG."
      );
      throw new Error("Client-side ImageKit public key is missing.");
    }
    if (!file || !file.uri) {
      console.error("File URI is missing for ImageKit upload.");
      throw new Error("File URI is required to upload an image.");
    }
    if (!authToken) {
      console.error(
        "Authentication token is missing. User may not be logged in."
      );
      throw new Error("Authentication token is required for ImageKit upload.");
    }

    // 1. Get authentication parameters from your backend
    console.log("Step 1: Calling getUploadAuthParameters");
    const authParams = await getUploadAuthParameters(authToken);
    console.log("Step 1 DONE: Auth params received");

    const fileName =
      file.name ||
      `upload_${Date.now()}.${file.mimeType?.split("/")[1] || "jpg"}`;
    const fileType = file.mimeType || "image/jpeg";

    console.log("Starting ImageKit upload with file (SIGNED):", {
      uri: file.uri,
      type: fileType,
      name: fileName,
      size: file.size,
      authParamsUsed: {
        token: authParams.token.substring(0, 5) + "...",
        signature: authParams.signature.substring(0, 5) + "...",
        expire: authParams.expire,
      },
    });

    // For web, we need to fetch the file from the URI first
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("publicKey", IMAGEKIT_CONFIG.PUBLIC_KEY);
    formData.append("fileName", fileName);
    formData.append("useUniqueFileName", "true");
    formData.append("token", authParams.token);
    formData.append("expire", authParams.expire.toString());
    formData.append("signature", authParams.signature);

    console.log("Uploading to ImageKit endpoint:", IMAGEKIT_UPLOAD_ENDPOINT);
    console.log(
      "Using client-side public key (first 5 chars from config):",
      IMAGEKIT_CONFIG.PUBLIC_KEY.substring(0, 5) + "..."
    );

    // Use fetch instead of axios for better compatibility with the mobile implementation
    const uploadResponse = await fetch(IMAGEKIT_UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    console.log("ImageKit response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      let errorDataText = "Could not read error response.";
      let errorDataJson: any = null;
      try {
        errorDataJson = await uploadResponse.json();
        errorDataText = JSON.stringify(errorDataJson);
        console.error("ImageKit upload failed (JSON response):", {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorDataJson,
        });
      } catch (e) {
        try {
          errorDataText = await uploadResponse.text();
          console.error("ImageKit upload failed (Text response):", {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            error: errorDataText,
          });
        } catch (textError) {
          console.error(
            "Failed to even read error response as text:",
            textError
          );
        }
      }
      const ikMessage = errorDataJson?.message || uploadResponse.statusText;
      const ikHelp = errorDataJson?.help ? ` (${errorDataJson.help})` : "";
      throw new Error(
        `Upload failed: ${uploadResponse.status} ${ikMessage}${ikHelp}. Raw: ${errorDataText}`
      );
    }

    const data = await uploadResponse.json();
    console.log("ImageKit upload successful (SIGNED):", {
      url: data.url,
      fileId: data.fileId,
      thumbnailUrl: data.thumbnailUrl,
    });
    return {
      url: data.url,
      fileId: data.fileId,
      thumbnailUrl: data.thumbnailUrl,
    };
  } catch (error: unknown) {
    const err = error as ImageKitError;
    console.error(
      "ImageKit upload error details (SIGNED FLOW - USING CONFIG):",
      {
        errorMessage: err?.message || "Unknown error",
        errorStack: err?.stack,
        configUsed: {
          publicKey: IMAGEKIT_CONFIG.PUBLIC_KEY?.substring(0, 5) + "...",
          urlEndpoint: IMAGEKIT_CONFIG.URL_ENDPOINT,
          authenticationEndpoint: IMAGEKIT_CONFIG.AUTHENTICATION_ENDPOINT,
        },
      }
    );
    throw new Error(
      err?.message || "Failed to upload image (signed flow - using config)"
    );
  }
};

/**
 * Transform an ImageKit URL with parameters
 * @param url Original ImageKit URL
 * @param transformations Object containing transformation parameters
 * @returns Transformed URL
 */
export const transformImagekitUrl = (
  url: string,
  transformations: Record<string, string | number>
): string => {
  if (!url || !url.includes(IMAGEKIT_CONFIG.URL_ENDPOINT)) {
    return url; // Return original URL if it's not an ImageKit URL
  }

  // Convert transformations object to query string
  const transformParams = Object.entries(transformations)
    .map(([key, value]) => `${key}-${value}`)
    .join(",");

  // Insert transformations into URL
  const urlParts = url.split("/");
  const insertIndex =
    urlParts.findIndex((part) => part.includes("imagekit.io")) + 1;

  if (insertIndex > 0) {
    urlParts.splice(insertIndex, 0, `tr:${transformParams}`);
    return urlParts.join("/");
  }

  return url;
};

/**
 * Clean up multiple unused images
 * @param fileIds Array of file IDs to delete
 * @param authToken Authentication token from the auth context (not used currently)
 */
export const cleanupUnusedImages = async (
  fileIds: string[],
  authToken?: string
) => {
  try {
    if (!fileIds || fileIds.length === 0) {
      console.log("[ImageKit Client] No file IDs provided for deletion");
      return; // Nothing to delete
    }

    console.log(
      `[ImageKit Client] Attempting to delete ${fileIds.length} images:`,
      fileIds
    );

    // Process each file ID
    await Promise.all(
      fileIds.map(async (fileId) => {
        try {
          console.log(
            `[ImageKit Client] Sending delete request for fileId: ${fileId}`
          );

          // Use our API endpoint for deletion
          const response = await fetch("/api/imagekit-delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileId }),
          });

          console.log(
            `[ImageKit Client] Delete response status for ${fileId}: ${response.status}`
          );

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
              console.error(
                `[ImageKit Client] Failed to delete image ${fileId}:`,
                errorData
              );
            } catch (e) {
              const errorText = await response.text();
              console.error(
                `[ImageKit Client] Failed to delete image ${fileId} (text response):`,
                errorText
              );
              errorData = { error: errorText };
            }
            // Don't throw here, just log the error and continue with other deletions
          } else {
            const successData = await response.json();
            console.log(
              `[ImageKit Client] Successfully deleted image ${fileId}:`,
              successData
            );
          }
        } catch (error) {
          console.error(
            `[ImageKit Client] Error processing deletion for image ${fileId}:`,
            error
          );
          // Don't throw here, just log the error and continue with other deletions
        }
      })
    );

    console.log("[ImageKit Client] Finished processing all image deletions");
  } catch (error) {
    console.error("[ImageKit Client] Error in cleanupUnusedImages:", error);
    // Re-throw the error for the caller to handle
    throw error;
  }
};
