"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI, NotificationTemplate } from "@/lib/api/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Save, Plus, AlertCircle } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

const EVENT_TYPES = [
  "term_fulfilled","term_pending_action","term_failed","term_expired","escrow_created","escrow_completed","escrow_cancelled","escrow_disputed","payment_received","payment_sent","payment_failed","ticket_created","ticket_updated","ticket_closed_by_user","ticket_resolved","account_verified","security_alert","system_maintenance"
];
const CHANNELS = ["email","sms","websocket","push"];

export default function NotificationTemplatesPage() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<NotificationTemplate[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [creating, setCreating] = useState(false);

  // New template state
  const [newEventType, setNewEventType] = useState("escrow_created");
  const [newChannel, setNewChannel] = useState("email");
  const [titleTemplate, setTitleTemplate] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [subjectTemplate, setSubjectTemplate] = useState("");
  const [htmlTemplate, setHtmlTemplate] = useState("");

  const fetchTemplates = async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const data = await adminAPI.getNotificationTemplates(token);
      setTemplates(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  useEffect(()=> { fetchTemplates(); }, [token]);

  const createTemplate = async () => {
    if (!token) return;
    setCreating(true); setError(null);
    try {
      const created = await adminAPI.createNotificationTemplate(token, {
        event_type: newEventType,
        channel: newChannel,
        title_template: titleTemplate,
        message_template: messageTemplate,
        subject_template: subjectTemplate || null,
        html_template: htmlTemplate || null,
      });
      setTemplates(prev => prev ? [created, ...prev] : [created]);
      setTitleTemplate(""); setMessageTemplate(""); setSubjectTemplate(""); setHtmlTemplate("");
    } catch (e) { setError(e instanceof Error? e.message: String(e)); }
    finally { setCreating(false); }
  };

  const toggleActive = async (tpl: NotificationTemplate) => {
    if (!token) return;
    try {
      const updated = await adminAPI.updateNotificationTemplate(token, tpl.id, { is_active: !tpl.is_active });
      setTemplates(prev => prev ? prev.map(p => p.id===updated.id ? updated : p) : [updated]);
    } catch (e) { setError(e instanceof Error? e.message:String(e)); }
  };

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Notification Templates</h1>
            <p className="text-sm text-white/70">Manage reusable notification content per channel & event.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTemplates} disabled={loading} className="backdrop-blur-md bg-white/10 border-white/20 text-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading?"animate-spin":""}`} /> Refresh
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

      {/* Create */}
      <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-transparent to-primary/10" />
        <CardHeader className="relative z-10">
          <CardTitle>Create Template</CardTitle>
          <CardDescription>Define new notification content</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Event Type</label>
              <Select value={newEventType} onValueChange={setNewEventType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_TYPES.map(ev=> <SelectItem key={ev} value={ev}>{ev}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Channel</label>
              <Select value={newChannel} onValueChange={setNewChannel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHANNELS.map(ch=> <SelectItem key={ch} value={ch}>{ch}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Title Template</label>
              <Input value={titleTemplate} onChange={e=>setTitleTemplate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Subject Template (optional)</label>
              <Input value={subjectTemplate} onChange={e=>setSubjectTemplate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Message Template</label>
            <Textarea rows={4} value={messageTemplate} onChange={e=>setMessageTemplate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">HTML Template (optional)</label>
            <Textarea rows={4} value={htmlTemplate} onChange={e=>setHtmlTemplate(e.target.value)} />
          </div>
          <Button onClick={createTemplate} disabled={creating || !titleTemplate || !messageTemplate} className="w-full">
            {creating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            {creating?"Creating...":"Create Template"}
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-amber-500/15" />
        <CardHeader className="relative z-10">
          <CardTitle>Existing Templates</CardTitle>
          <CardDescription>Toggle active status & review definitions</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}
          {!loading && templates && templates.length === 0 && (
            <p className="text-sm text-white/60">No templates yet.</p>
          )}
          {!loading && templates && templates.map(tpl => (
            <div key={tpl.id} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs">{tpl.id}</div>
                  <Button size="sm" variant="outline" onClick={()=>toggleActive(tpl)}>
                    {tpl.is_active?"Deactivate":"Activate"}
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div><span className="font-semibold">Event:</span> {tpl.event_type}</div>
                  <div><span className="font-semibold">Channel:</span> {tpl.channel}</div>
                  <div><span className="font-semibold">Title:</span> {tpl.title_template}</div>
                  <div><span className="font-semibold">Active:</span> {tpl.is_active?"Yes":"No"}</div>
                </div>
                {tpl.subject_template && (
                  <div className="text-xs"><span className="font-semibold">Subject:</span> {tpl.subject_template}</div>
                )}
                {tpl.message_template && (
                  <div className="text-xs"><span className="font-semibold">Message:</span> {tpl.message_template}</div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
