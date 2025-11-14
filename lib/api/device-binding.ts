import { deviceHeadersForContext } from "../utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gopiaxis.com";

export interface DeviceFingerprint {
  device_id: string;
  created_at?: string;
  last_seen?: string;
  trust_level?: "trusted" | "untrusted" | "unknown";
}

export interface RotateResponse {
  device_id: string;
}

export const deviceBindingAPI = {
  async listDevices(token: string): Promise<DeviceFingerprint[]> {
    const res = await fetch(`${API_BASE_URL}/auth/devices/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...deviceHeadersForContext(token),
      },
      credentials: "include",
      mode: "cors",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || "Failed to list devices");
    }
    return res.json();
  },

  async rotateDevice(token: string): Promise<RotateResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/devices/rotate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...deviceHeadersForContext(token),
      },
      credentials: "include",
      mode: "cors",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || "Failed to rotate device");
    }
    return res.json();
  },

  async trustDevice(token: string, device_id: string, trust_level: "trusted" = "trusted") {
    const res = await fetch(`${API_BASE_URL}/auth/devices/trust`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...deviceHeadersForContext(token),
      },
      body: JSON.stringify({ device_id, trust_level }),
      credentials: "include",
      mode: "cors",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || "Failed to trust device");
    }
    return res.json();
  },

  async revokeDevice(token: string, device_id: string) {
    const res = await fetch(`${API_BASE_URL}/auth/devices/revoke`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...deviceHeadersForContext(token),
      },
      body: JSON.stringify({ device_id }),
      credentials: "include",
      mode: "cors",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || "Failed to revoke device");
    }
    return res.json();
  },
};
