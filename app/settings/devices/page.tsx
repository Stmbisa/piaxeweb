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
            // Guard against non-array responses from the API
            setDevices(Array.isArray(list) ? list : []);
        } catch (e: any) {
            // Surface backend device-binding errors (e.g. "Device identifier required")
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
            <div className="max-w-4xl mx-auto px-4 py-12 animate-glass-appear">
                <div className="glass-card-enhanced rounded-2xl p-8">
                    <h1 className="text-2xl font-semibold mb-4 text-foreground">Device settings</h1>
                    <p className="text-sm text-muted-foreground">Loading your device bindings…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 animate-glass-appear">
                <div className="glass-card-enhanced rounded-2xl p-8">
                    <h1 className="text-2xl font-semibold mb-4 text-foreground">Device settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Please sign in to manage your trusted devices.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-glass-appear">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Device settings
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                        Manage which devices are trusted for your Piaxis account. If you see
                        <span className="font-medium text-destructive ml-1">"Device identifier required"</span>
                        , it means we didn&apos;t receive a bound device id for this session.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={handleRotate}
                        disabled={busy}
                        className="glass-button-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60"
                    >
                        Rebind this device (rotate ID)
                    </button>
                    <span className="text-[11px] text-muted-foreground">Use if you changed browsers or your device was reset.</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 glass-card-enhanced rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground">
                        !
                    </span>
                    <div>
                        <p className="font-medium">{error}</p>
                        {error.toLowerCase().includes("device identifier required") && (
                            <p className="mt-1 text-xs text-destructive-foreground/80">
                                Your browser should normally send the secure <code className="px-1 py-0.5 rounded bg-destructive-foreground/10">dfp</code> cookie
                                automatically. Try refreshing this page or signing in again from this device. If issues persist, your
                                session may need to be re-bound.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="glass-card-enhanced rounded-2xl p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Active devices
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Each login from a new browser or device creates a separate fingerprint. The current device is highlighted.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border/40 bg-background/40 backdrop-blur">
                    <table className="min-w-full divide-y divide-border/40">
                        <thead className="bg-background/60">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Device ID
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Trust
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Last seen
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 bg-background/40">
                            {devices.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-sm text-muted-foreground text-center">
                                        No devices found for this account.
                                    </td>
                                </tr>
                            ) : (
                                devices.map((d) => {
                                    const isCurrent = currentDeviceId && d.device_id === currentDeviceId;
                                    const trust = d.trust_level || "unknown";
                                    return (
                                        <tr key={d.device_id} className={isCurrent ? "bg-piaxis.dark-900/40" : ""}>
                                            <td className="px-4 py-3 text-sm align-top">
                                                <div className="flex flex-col gap-1">
                                                    <code className="text-[11px] bg-black/40 text-xs text-foreground/90 px-2 py-1 rounded-md break-all">
                                                        {d.device_id}
                                                    </code>
                                                    {isCurrent && (
                                                        <span className="inline-flex items-center w-fit rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                                                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            Current device
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm align-top capitalize">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${trust === "trusted" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : trust === "unverified" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-background/60 text-foreground/80 border-border/40"}`}>
                                                    {trust}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm align-top text-muted-foreground">
                                                {d.last_seen || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    {trust !== "trusted" && (
                                                        <button
                                                            onClick={() => handleTrust(d.device_id)}
                                                            disabled={busy}
                                                            className="glass-icon-button inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-foreground/90 disabled:opacity-60"
                                                        >
                                                            Trust
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRevoke(d.device_id)}
                                                        disabled={busy}
                                                        className="glass-icon-button inline-flex items-center rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive disabled:opacity-60"
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
            </div>

            <p className="mt-4 text-xs text-muted-foreground max-w-2xl">
                Tip: On the web, your browser automatically sends the secure device cookie for you. Only native apps, CLI tools, or
                headless integrations should send an explicit <code className="px-1 py-0.5 rounded bg-background/60">X-Device-ID</code>{" "}
                header.
            </p>
        </div>
    );
}
