"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  adminAPI,
  PublicTipAdmin,
  PublicUpdateAdmin,
} from "@/lib/api/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Trash2, AlertCircle, Plus } from "lucide-react";

const UPDATE_KINDS: PublicUpdateAdmin["kind"][] = [
  "general",
  "feature",
  "sacco",
  "project",
];

export default function AdminPublicContentPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updates, setUpdates] = useState<PublicUpdateAdmin[]>([]);
  const [tips, setTips] = useState<PublicTipAdmin[]>([]);

  // Create Update form
  const [uTitle, setUTitle] = useState("");
  const [uMessage, setUMessage] = useState("");
  const [uKind, setUKind] = useState<PublicUpdateAdmin["kind"]>("general");
  const [uActionLabel, setUActionLabel] = useState("Open");
  const [uActionUrl, setUActionUrl] = useState("/trade/cart");
  const [uTimeLabel, setUTimeLabel] = useState("New");
  const [uPriority, setUPriority] = useState("0");
  const [uActive, setUActive] = useState(true);

  // Create Tip form
  const [tTitle, setTTitle] = useState("");
  const [tMessage, setTMessage] = useState("");
  const [tSurfaces, setTSurfaces] = useState("instore_scan");
  const [tPriority, setTPriority] = useState("0");
  const [tActive, setTActive] = useState(true);

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [u, t] = await Promise.all([
        adminAPI.listPublicUpdates(token),
        adminAPI.listPublicTips(token),
      ]);
      setUpdates(u);
      setTips(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createUpdate = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await adminAPI.createPublicUpdate(token, {
        title: uTitle,
        message: uMessage,
        kind: uKind,
        time_label: uTimeLabel || null,
        action_label: uActionUrl ? uActionLabel || "Open" : null,
        action_url: uActionUrl || null,
        is_active: uActive,
        priority: Number.isFinite(Number(uPriority)) ? Number(uPriority) : 0,
      });
      setUTitle("");
      setUMessage("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const createTip = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const surfaces = tSurfaces
        .split(/[,
\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      await adminAPI.createPublicTip(token, {
        title: tTitle,
        message: tMessage,
        surfaces,
        is_active: tActive,
        priority: Number.isFinite(Number(tPriority)) ? Number(tPriority) : 0,
      });
      setTTitle("");
      setTMessage("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const toggleUpdate = async (u: PublicUpdateAdmin) => {
    if (!token) return;
    await adminAPI.updatePublicUpdate(token, u.id, { is_active: !u.is_active });
    await refresh();
  };

  const deleteUpdate = async (u: PublicUpdateAdmin) => {
    if (!token) return;
    if (!confirm("Delete this update?")) return;
    await adminAPI.deletePublicUpdate(token, u.id);
    await refresh();
  };

  const toggleTip = async (t: PublicTipAdmin) => {
    if (!token) return;
    await adminAPI.updatePublicTip(token, t.id, { is_active: !t.is_active });
    await refresh();
  };

  const deleteTip = async (t: PublicTipAdmin) => {
    if (!token) return;
    if (!confirm("Delete this tip?")) return;
    await adminAPI.deletePublicTip(token, t.id);
    await refresh();
  };

  const activeUpdates = useMemo(
    () => updates.filter((u) => u.is_active).length,
    [updates]
  );
  const activeTips = useMemo(() => tips.filter((t) => t.is_active).length, [tips]);

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Public Content</h1>
            <p className="text-sm text-white/70">
              Manage in-app Updates and contextual Tips (DB-backed).
            </p>
            <p className="text-xs text-white/60 mt-1">
              Active: {activeUpdates} updates • {activeTips} tips
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={refresh}
            className="backdrop-blur-md bg-white/10 border-white/20 text-white"
          >
            <RefreshCw className={"h-4 w-4 mr-2 " + (loading ? "animate-spin" : "")} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-transparent to-primary/10" />
          <CardHeader className="relative z-10">
            <CardTitle>Create Update</CardTitle>
            <CardDescription>
              Optional action_url can be a path like <code>/trade/cart</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <Input placeholder="Title" value={uTitle} onChange={(e) => setUTitle(e.target.value)} />
            <Textarea placeholder="Message" value={uMessage} onChange={(e) => setUMessage(e.target.value)} rows={4} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium">Kind</label>
                <Select value={uKind} onValueChange={(v) => setUKind(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UPDATE_KINDS.map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Time Label</label>
                <Input value={uTimeLabel} onChange={(e) => setUTimeLabel(e.target.value)} placeholder="New" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Action label" value={uActionLabel} onChange={(e) => setUActionLabel(e.target.value)} />
              <Input placeholder="Action url (optional)" value={uActionUrl} onChange={(e) => setUActionUrl(e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Priority" value={uPriority} onChange={(e) => setUPriority(e.target.value)} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={uActive} onChange={(e) => setUActive(e.target.checked)} />
                Active
              </label>
            </div>
            <Button disabled={loading || !uTitle || !uMessage} onClick={createUpdate} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Update
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-transparent to-secondary/10" />
          <CardHeader className="relative z-10">
            <CardTitle>Create Tip</CardTitle>
            <CardDescription>
              Surfaces are comma/newline separated (e.g. <code>instore_scan</code>).
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <Input placeholder="Title" value={tTitle} onChange={(e) => setTTitle(e.target.value)} />
            <Textarea placeholder="Message" value={tMessage} onChange={(e) => setTMessage(e.target.value)} rows={4} />
            <Input placeholder="Surfaces" value={tSurfaces} onChange={(e) => setTSurfaces(e.target.value)} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Priority" value={tPriority} onChange={(e) => setTPriority(e.target.value)} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={tActive} onChange={(e) => setTActive(e.target.checked)} />
                Active
              </label>
            </div>
            <Button disabled={loading || !tTitle || !tMessage} onClick={createTip} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Tip
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Updates</CardTitle>
            <CardDescription>{updates.length} total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {updates.map((u) => (
              <div key={u.id} className="flex items-start justify-between gap-3 rounded-lg bg-black/20 p-3">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{u.title}</div>
                  <div className="text-xs text-white/70">{u.kind} • {u.is_active ? "active" : "inactive"}</div>
                  {u.action_url ? (
                    <div className="text-xs text-white/60 truncate">{u.action_label || "Open"} → {u.action_url}</div>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleUpdate(u)}>
                    {u.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUpdate(u)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!updates.length ? (
              <div className="text-sm text-muted-foreground">No updates yet.</div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
            <CardDescription>{tips.length} total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tips.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3 rounded-lg bg-black/20 p-3">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{t.title}</div>
                  <div className="text-xs text-white/70">{t.is_active ? "active" : "inactive"}</div>
                  <div className="text-xs text-white/60 truncate">surfaces: {(t.surfaces || []).join(", ")}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleTip(t)}>
                    {t.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTip(t)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!tips.length ? (
              <div className="text-sm text-muted-foreground">No tips yet.</div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
