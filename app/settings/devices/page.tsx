"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { deviceBindingAPI, DeviceFingerprint } from "@/lib/api/device-binding";
import { getDeviceIdFromToken } from "@/lib/utils";

export default function DeviceSettingsPage() {
    const { token, isAuthenticated, isLoading, refreshAuth } = useAuth();
    const [devices, setDevices] = useState<DeviceFingerprint[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const currentDeviceId = useMemo(() => (token ? getDeviceIdFromToken(token) : null), [token]);

    const load = async () => {
        if (!token) return;
        setError(null);
        try {
            const list = await deviceBindingAPI.listDevices(token);
            setDevices(list || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load devices");
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, token]);

    const handleRotate = async () => {
        if (!token) return;
        setBusy(true);
        setError(null);
        try {
            await deviceBindingAPI.rotateDevice(token);
            // After rotate, tokens may mismatch old dfp; refresh to pick up new claims
            await refreshAuth();
            await load();
        } catch (e: any) {
            setError(e?.message || "Rotation failed");
        } finally {
            setBusy(false);
        }
    };

    const handleTrust = async (device_id: string) => {
        if (!token) return;
        setBusy(true);
        setError(null);
        try {
            await deviceBindingAPI.trustDevice(token, device_id, "trusted");
            await load();
        } catch (e: any) {
            setError(e?.message || "Trust update failed");
        } finally {
            setBusy(false);
        }
    };

    const handleRevoke = async (device_id: string) => {
        if (!token) return;
        setBusy(true);
        setError(null);
        try {
            await deviceBindingAPI.revokeDevice(token, device_id);
            await load();
        } catch (e: any) {
            setError(e?.message || "Revoke failed");
        } finally {
            setBusy(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-semibold mb-4">Device settings</h1>
                <p>Loading…</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-semibold mb-4">Device settings</h1>
                <p>Please sign in to manage your devices.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Device settings</h1>
                <button
                    onClick={handleRotate}
                    disabled={busy}
                    className="inline-flex items-center rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                    Rotate device ID
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Device ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Trust
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Last seen
                            </th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {devices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                                    No devices found for this account.
                                </td>
                            </tr>
                        ) : (
                            devices.map((d) => {
                                const isCurrent = currentDeviceId && d.device_id === currentDeviceId;
                                const trust = d.trust_level || "unknown";
                                return (
                                    <tr key={d.device_id}>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{d.device_id}</code>
                                                {isCurrent && (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-800">
                                                        current
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm capitalize">{trust}</td>
                                        <td className="px-4 py-3 text-sm">{d.last_seen || "—"}</td>
                                        <td className="px-4 py-3 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {trust !== "trusted" && (
                                                    <button
                                                        onClick={() => handleTrust(d.device_id)}
                                                        disabled={busy}
                                                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                                    >
                                                        Trust
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRevoke(d.device_id)}
                                                    disabled={busy}
                                                    className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
                Tip: Your browser automatically sends the device cookie. Only native or headless clients need the X-Device-ID header.
            </p>
        </div>
    );
}
