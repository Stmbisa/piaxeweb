"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  crmAPI,
  type CampaignSchedule,
  type EmailCampaignCreate,
  type SMSCampaignCreate,
  type VoiceCampaignCreate,
  type VoiceScript,
} from "@/lib/api/crm"
import { useAuth } from "@/lib/auth/context"

type CampaignListItem = {
  id: string
  name: string
  type?: string
  status?: string
  created_at?: string
}

type CampaignKind = "email" | "sms" | "voice"

type Draft = {
  name: string
  description: string
  recipientsText: string

  currency: string

  scheduleType: "immediate" | "scheduled" | "recurring"
  scheduledAtLocal: string
  endAtLocal: string
  recurringPatternJson: string

  fromName: string
  replyTo: string
  subjectLine: string
  previewText: string
  emailContent: string

  countryCode: string
  smsContent: string

  voiceInitialMessage: string
  voiceMenuOptionsJson: string
  voiceResponsesJson: string
  voiceFallbackMessage: string
  voiceGoodbyeMessage: string
  retryAttempts: string
  retryDelayMinutes: string
  recordCalls: boolean
  maxDurationSeconds: string
}

const DEFAULT_DRAFT: Draft = {
  name: "",
  description: "",
  recipientsText: "",

  currency: "UGX",

  scheduleType: "immediate",
  scheduledAtLocal: "",
  endAtLocal: "",
  recurringPatternJson: "{}",

  fromName: "",
  replyTo: "",
  subjectLine: "",
  previewText: "",
  emailContent: "",

  countryCode: "",
  smsContent: "",

  voiceInitialMessage: "",
  voiceMenuOptionsJson: "{}",
  voiceResponsesJson: "{}",
  voiceFallbackMessage: "",
  voiceGoodbyeMessage: "",
  retryAttempts: "1",
  retryDelayMinutes: "30",
  recordCalls: false,
  maxDurationSeconds: "300",
}

function parseRecipients(text: string): string[] {
  return text
    .split(/\n|,|;/g)
    .map((value) => value.trim())
    .filter(Boolean)
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200"
    case "draft":
      return "bg-gray-100 text-gray-700 border-gray-200"
    case "paused":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function buildSchedule(draft: Draft, recurringPattern: Record<string, unknown>): CampaignSchedule {
  const endDateIso = draft.endAtLocal ? new Date(draft.endAtLocal).toISOString() : null

  if ((draft.scheduleType === "scheduled" || draft.scheduleType === "recurring") && draft.scheduledAtLocal) {
    return {
      schedule_type: draft.scheduleType,
      start_date: new Date(draft.scheduledAtLocal).toISOString(),
      end_date: endDateIso,
      timezone: "UTC",
      recurring_pattern: recurringPattern,
    }
  }

  return {
    schedule_type: "immediate",
    start_date: new Date().toISOString(),
    end_date: endDateIso,
    timezone: "UTC",
    recurring_pattern: recurringPattern,
  }
}

function parseJsonObject(input: string, errorMessage: string): Record<string, string> {
  let parsed: unknown
  try {
    parsed = JSON.parse(input || "{}")
  } catch {
    throw new Error(errorMessage)
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error(errorMessage)
  }

  const obj = parsed as Record<string, unknown>
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    normalized[String(key)] = value == null ? "" : String(value)
  }
  return normalized
}

function parseJsonRecord(input: string, errorMessage: string): Record<string, unknown> {
  let parsed: unknown
  try {
    parsed = JSON.parse(input || "{}")
  } catch {
    throw new Error(errorMessage)
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error(errorMessage)
  }

  return parsed as Record<string, unknown>
}

export function CampaignManager() {
  const { token } = useAuth()
  const { toast } = useToast()

  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const [createKind, setCreateKind] = useState<CampaignKind>("email")
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT)

  const recipients = useMemo(() => parseRecipients(draft.recipientsText), [draft.recipientsText])

  const loadCampaigns = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response: any = await crmAPI.getCampaigns(token)
      const items: any[] = Array.isArray(response) ? response : response?.campaigns || []

      setCampaigns(
        items
          .filter((c) => c && c.id && c.name)
          .map((c) => ({
            id: String(c.id),
            name: String(c.name),
            type: c.type != null ? String(c.type) : undefined,
            status: c.status != null ? String(c.status) : undefined,
            created_at: c.created_at != null ? String(c.created_at) : undefined,
          }))
      )
    } catch (error: any) {
      console.error("Error loading campaigns:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to load campaigns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const resetDraft = () => setDraft(DEFAULT_DRAFT)

  const handleCreate = async () => {
    if (!token) return

    if (!draft.name.trim()) {
      toast({
        title: "Missing required fields",
        description: "Campaign name is required.",
        variant: "destructive",
      })
      return
    }

    if (recipients.length === 0) {
      toast({
        title: "Missing recipients",
        description: "Add at least one recipient (contact id, email, or phone).",
        variant: "destructive",
      })
      return
    }

    if ((draft.scheduleType === "scheduled" || draft.scheduleType === "recurring") && !draft.scheduledAtLocal) {
      toast({
        title: "Missing schedule",
        description: "Start date/time is required when schedule is set to Scheduled or Recurring.",
        variant: "destructive",
      })
      return
    }

    let recurringPattern: Record<string, unknown>
    try {
      recurringPattern = parseJsonRecord(draft.recurringPatternJson, "Recurring pattern must be valid JSON object.")
    } catch (error: any) {
      toast({
        title: "Invalid recurring pattern",
        description: error?.message || "Recurring pattern must be valid JSON object.",
        variant: "destructive",
      })
      return
    }

    if (draft.scheduleType === "recurring" && Object.keys(recurringPattern || {}).length === 0) {
      toast({
        title: "Missing recurring pattern",
        description: "Recurring pattern is required when schedule is set to Recurring.",
        variant: "destructive",
      })
      return
    }

    const schedule = buildSchedule(draft, recurringPattern)

    if ((schedule.schedule_type === "scheduled" || schedule.schedule_type === "recurring") && schedule.end_date && schedule.end_date <= schedule.start_date) {
      toast({
        title: "Invalid end date",
        description: "End date/time must be after the start date/time.",
        variant: "destructive",
      })
      return
    }

    try {
      setCreating(true)

      if (createKind === "email") {
        if (!draft.fromName.trim() || !draft.subjectLine.trim() || !draft.emailContent.trim()) {
          toast({
            title: "Missing required fields",
            description: "From name, subject, and content are required for email campaigns.",
            variant: "destructive",
          })
          return
        }

        const payload: EmailCampaignCreate = {
          name: draft.name.trim(),
          description: draft.description.trim() || null,
          recipients,
          content: draft.emailContent,
          currency: draft.currency.trim() || "UGX",
          features: [],
          email_settings: {
            from_name: draft.fromName.trim(),
            reply_to: draft.replyTo.trim() || null,
            subject_line: draft.subjectLine.trim(),
            preview_text: draft.previewText.trim() || null,
            template_type: "plain",
            track_opens: true,
            track_clicks: true,
            track_unsubscribes: true,
          },
          schedule,
          ab_test_enabled: false,
          ab_test_variants: [],
        }

        await crmAPI.createEmailCampaign(token, payload)
      } else if (createKind === "sms") {
        if (!draft.countryCode.trim() || !draft.smsContent.trim()) {
          toast({
            title: "Missing required fields",
            description: "Country code and message content are required for SMS campaigns.",
            variant: "destructive",
          })
          return
        }

        const payload: SMSCampaignCreate = {
          name: draft.name.trim(),
          description: draft.description.trim() || null,
          recipients,
          content: draft.smsContent,
          currency: draft.currency.trim() || "UGX",
          country_code: draft.countryCode.trim(),
          schedule,
        }

        await crmAPI.createSmsCampaign(token, payload)
      } else {
        if (!draft.countryCode.trim()) {
          toast({
            title: "Missing required fields",
            description: "Country code is required for voice campaigns.",
            variant: "destructive",
          })
          return
        }

        if (!draft.voiceInitialMessage.trim()) {
          toast({
            title: "Missing required fields",
            description: "Initial message is required for voice campaigns.",
            variant: "destructive",
          })
          return
        }

        if (!draft.voiceFallbackMessage.trim() || !draft.voiceGoodbyeMessage.trim()) {
          toast({
            title: "Missing required fields",
            description: "Fallback and goodbye messages are required for voice campaigns.",
            variant: "destructive",
          })
          return
        }

        const menuOptions = parseJsonObject(draft.voiceMenuOptionsJson, "Menu options must be valid JSON object.")
        const responses = parseJsonObject(draft.voiceResponsesJson, "Responses must be valid JSON object.")

        const voiceScript: VoiceScript = {
          initial_message: draft.voiceInitialMessage.trim(),
          menu_options: menuOptions,
          responses,
          fallback_message: draft.voiceFallbackMessage.trim(),
          goodbye_message: draft.voiceGoodbyeMessage.trim(),
        }

        const payload: VoiceCampaignCreate = {
          name: draft.name.trim(),
          description: draft.description.trim() || null,
          recipients,
          voice_script: voiceScript,
          currency: draft.currency.trim() || "UGX",
          country_code: draft.countryCode.trim(),
          schedule,
          retry_attempts: Math.max(1, parseInt(draft.retryAttempts || "1", 10) || 1),
          retry_delay_minutes: Math.max(0, parseInt(draft.retryDelayMinutes || "30", 10) || 0),
          record_calls: Boolean(draft.recordCalls),
          max_duration_seconds: Math.max(1, parseInt(draft.maxDurationSeconds || "300", 10) || 300),
        }

        await crmAPI.createVoiceCampaign(token, payload)
      }

      toast({
        title: "Created",
        description: "Campaign created successfully.",
      })

      setShowCreateForm(false)
      resetDraft()
      await loadCampaigns()
    } catch (error: any) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleSend = async (campaignId: string) => {
    if (!token) return

    try {
      setSendingId(campaignId)
      await crmAPI.sendCampaign(token, campaignId)
      toast({
        title: "Scheduled",
        description: "Campaign scheduled for execution.",
      })
      await loadCampaigns()
    } catch (error: any) {
      console.error("Error scheduling campaign:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to schedule campaign",
        variant: "destructive",
      })
    } finally {
      setSendingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <p className="text-sm text-muted-foreground">Create Email, SMS, and Voice campaigns.</p>
        </div>
        <Button onClick={() => setShowCreateForm((v) => !v)}>{showCreateForm ? "Close" : "New Campaign"}</Button>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>Choose a campaign type and fill in the required fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={createKind} onValueChange={(v) => setCreateKind(v as CampaignKind)}>
              <TabsList>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label>Campaign name</Label>
                  <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={draft.currency} onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))} placeholder="UGX" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Recipients (one per line)</Label>
                  <Textarea
                    value={draft.recipientsText}
                    onChange={(e) => setDraft((d) => ({ ...d, recipientsText: e.target.value }))}
                    placeholder="contact-id-uuid\nuser@example.com\n+256700000000"
                  />
                  <p className="text-xs text-muted-foreground">Parsed recipients: {recipients.length}</p>
                </div>

                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Tabs
                    value={draft.scheduleType}
                    onValueChange={(v) => {
                      const next = v as Draft["scheduleType"]
                      setDraft((d) => ({
                        ...d,
                        scheduleType: next,
                        ...(next === "immediate"
                          ? { scheduledAtLocal: "", endAtLocal: "", recurringPatternJson: "{}" }
                          : null),
                      }))
                    }}
                  >
                    <TabsList>
                      <TabsTrigger value="immediate">Immediate</TabsTrigger>
                      <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                      <TabsTrigger value="recurring">Recurring</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {draft.scheduleType === "scheduled" || draft.scheduleType === "recurring" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Start date/time</Label>
                      <Input type="datetime-local" value={draft.scheduledAtLocal} onChange={(e) => setDraft((d) => ({ ...d, scheduledAtLocal: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>End date/time (optional)</Label>
                      <Input type="datetime-local" value={draft.endAtLocal} onChange={(e) => setDraft((d) => ({ ...d, endAtLocal: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>
                        Recurring pattern (JSON{draft.scheduleType === "recurring" ? ", required" : ", optional"})
                      </Label>
                      <Textarea value={draft.recurringPatternJson} onChange={(e) => setDraft((d) => ({ ...d, recurringPatternJson: e.target.value }))} rows={4} />
                    </div>
                  </>
                ) : null}
              </div>

              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From name</Label>
                    <Input value={draft.fromName} onChange={(e) => setDraft((d) => ({ ...d, fromName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Reply-To (optional)</Label>
                    <Input value={draft.replyTo} onChange={(e) => setDraft((d) => ({ ...d, replyTo: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Subject</Label>
                    <Input value={draft.subjectLine} onChange={(e) => setDraft((d) => ({ ...d, subjectLine: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Preview text (optional)</Label>
                    <Input value={draft.previewText} onChange={(e) => setDraft((d) => ({ ...d, previewText: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email content</Label>
                    <Textarea value={draft.emailContent} onChange={(e) => setDraft((d) => ({ ...d, emailContent: e.target.value }))} rows={8} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country code</Label>
                    <Input value={draft.countryCode} onChange={(e) => setDraft((d) => ({ ...d, countryCode: e.target.value }))} placeholder="256" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>SMS message</Label>
                    <Textarea value={draft.smsContent} onChange={(e) => setDraft((d) => ({ ...d, smsContent: e.target.value }))} rows={5} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country code</Label>
                    <Input value={draft.countryCode} onChange={(e) => setDraft((d) => ({ ...d, countryCode: e.target.value }))} placeholder="256" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retry attempts</Label>
                    <Input value={draft.retryAttempts} onChange={(e) => setDraft((d) => ({ ...d, retryAttempts: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Retry delay (minutes)</Label>
                    <Input value={draft.retryDelayMinutes} onChange={(e) => setDraft((d) => ({ ...d, retryDelayMinutes: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max duration (seconds)</Label>
                    <Input value={draft.maxDurationSeconds} onChange={(e) => setDraft((d) => ({ ...d, maxDurationSeconds: e.target.value }))} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Initial message</Label>
                    <Textarea value={draft.voiceInitialMessage} onChange={(e) => setDraft((d) => ({ ...d, voiceInitialMessage: e.target.value }))} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Menu options (JSON)</Label>
                    <Textarea value={draft.voiceMenuOptionsJson} onChange={(e) => setDraft((d) => ({ ...d, voiceMenuOptionsJson: e.target.value }))} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Responses (JSON)</Label>
                    <Textarea value={draft.voiceResponsesJson} onChange={(e) => setDraft((d) => ({ ...d, voiceResponsesJson: e.target.value }))} rows={4} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Fallback message</Label>
                    <Textarea value={draft.voiceFallbackMessage} onChange={(e) => setDraft((d) => ({ ...d, voiceFallbackMessage: e.target.value }))} rows={2} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Goodbye message</Label>
                    <Textarea value={draft.voiceGoodbyeMessage} onChange={(e) => setDraft((d) => ({ ...d, voiceGoodbyeMessage: e.target.value }))} rows={2} />
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <input id="record_calls" type="checkbox" checked={draft.recordCalls} onChange={(e) => setDraft((d) => ({ ...d, recordCalls: e.target.checked }))} />
                    <Label htmlFor="record_calls">Record calls</Label>
                  </div>
                </div>
              </TabsContent>

              <div className="flex gap-2 pt-2">
                <Button disabled={creating} onClick={handleCreate}>
                  {creating ? "Creating..." : "Create"}
                </Button>
                <Button
                  variant="outline"
                  disabled={creating}
                  onClick={() => {
                    setShowCreateForm(false)
                    resetDraft()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Existing campaigns</CardTitle>
          <CardDescription>Manage campaigns created in CRM.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-sm text-muted-foreground">No campaigns found.</div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium truncate">{campaign.name}</div>
                    {campaign.type ? <Badge variant="outline">{campaign.type}</Badge> : null}
                    <Badge className={getStatusBadgeClass(campaign.status)} variant="outline">
                      {campaign.status || "unknown"}
                    </Badge>
                  </div>
                  {campaign.created_at ? (
                    <div className="text-xs text-muted-foreground">Created: {new Date(campaign.created_at).toLocaleString()}</div>
                  ) : null}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleSend(campaign.id)} disabled={sendingId === campaign.id}>
                    {sendingId === campaign.id ? "Scheduling..." : "Launch Now"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
