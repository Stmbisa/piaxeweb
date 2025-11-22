"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { adminAPI } from "@/lib/api/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Send, AlertCircle } from "lucide-react";

const EVENT_TYPES = [
  "term_fulfilled","term_pending_action","term_failed","term_expired","escrow_created","escrow_completed","escrow_cancelled","escrow_disputed","payment_received","payment_sent","payment_failed","ticket_created","ticket_updated","ticket_closed_by_user","ticket_resolved","account_verified","security_alert","system_maintenance"
];
const PRIORITIES = ["low","medium","high","urgent"];
const CHANNELS = ["email","sms","websocket","push"];

export default function SendAdminNotificationPage() {
  const { token } = useAuth();
  const [recipientIds, setRecipientIds] = useState("");
  const [eventType, setEventType] = useState<string>("escrow_created");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [priority, setPriority] = useState("medium");
  const [channels, setChannels] = useState<string[]>(["email","websocket"]);
  const [expiresAt, setExpiresAt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!token) return;
    setSending(true); setError(null); setSuccess(false);
    try {
      await adminAPI.sendAdminNotification(token, {
        recipient_ids: recipientIds.split(/[,\n\s]+/).filter(Boolean),
        event_type: eventType,
        title,
        message,
        action_url: actionUrl || null,
        priority,
        channels,
        expires_at: expiresAt || null,
        send_immediately: true,
      });
      setSuccess(true);
      setTitle(""); setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-8 animate-glass-appear">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0,_rgba(255,255,255,0)_60%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Send Admin Notification</h1>
            <p className="text-sm text-white/70">Broadcast events to selected users across channels.</p>
          </div>
          <Button variant="outline" size="sm" disabled={sending} onClick={submit} className="backdrop-blur-md bg-white/10 border-white/20 text-white">
            {sending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send
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
      {success && (
        <Alert>
          <Send className="h-4 w-4" />
          <AlertTitle>Sent</AlertTitle>
          <AlertDescription>Notification send request accepted.</AlertDescription>
        </Alert>
      )}

      <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-transparent to-primary/10" />
        <CardHeader className="relative z-10">
          <CardTitle>Payload</CardTitle>
          <CardDescription>Fill out core notification data</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div>
            <label className="text-xs font-medium">Recipient IDs (UUID, comma/newline separated)</label>
            <Textarea rows={3} value={recipientIds} onChange={e=>setRecipientIds(e.target.value)} placeholder="uuid-1, uuid-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Event Type</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_TYPES.map(ev=> <SelectItem key={ev} value={ev}>{ev}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map(p=> <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Channels (toggle)</label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map(ch => {
                const active = channels.includes(ch);
                return (
                  <Button key={ch} type="button" size="sm" variant={active?"default":"outline"} onClick={()=> setChannels(prev => active ? prev.filter(x=>x!==ch) : [...prev,ch])}>{ch}</Button>
                );
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Title</label>
              <Input value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Action URL (optional)</label>
              <Input value={actionUrl} onChange={e=>setActionUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Message</label>
            <Textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Expires At (ISO, optional)</label>
              <Input value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} placeholder="2025-11-22T14:15:22Z" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Preview Recipient Count</label>
              <div className="text-sm px-3 py-2 rounded-md bg-black/40 text-white/80">{recipientIds.split(/[,\n\s]+/).filter(Boolean).length} recipients</div>
            </div>
          </div>
          <Button disabled={sending || !title || !message || !recipientIds.trim()} onClick={submit} className="w-full">
            {sending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {sending?"Sending...":"Send Notification"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
