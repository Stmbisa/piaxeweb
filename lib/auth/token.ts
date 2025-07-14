/**
 * Token verification utilities for authentication
 */

import * as jwt from "jsonwebtoken";

/**
 * Verify a JWT token and return the decoded payload
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    // In a real implementation, you would use a proper JWT secret from environment variables
    const secret = process.env.JWT_SECRET || "default-secret-for-development";

    // Verify the token
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Generate a new JWT token
 * @param payload Data to encode in the token
 * @param expiresIn Token expiration time (e.g., '1h', '7d')
 * @returns Signed JWT token
 */
export function generateToken(
  payload: any,
  expiresIn: string | number = "24h"
): string {
  // Get the secret from environment variables or use a default
  const secret = process.env.JWT_SECRET || "default-secret-for-development";

  // Use type assertion to work around type issues
  return jwt.sign(payload, secret, { expiresIn } as any);
}
