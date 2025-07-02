"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  supportAPI,
  SupportTicket,
  TicketMessage,
  CreateMessageData,
  TicketStatus,
  TicketPriority,
  MessageType
} from "@/lib/api/support";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  UserCog,
  Paperclip,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  [TicketStatus.OPEN]: {
    label: "Open",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: MessageSquare,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    icon: Clock,
  },
  [TicketStatus.WAITING_FOR_CUSTOMER]: {
    label: "Waiting for You",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: AlertTriangle,
  },
  [TicketStatus.RESOLVED]: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    icon: CheckCircle,
  },
  [TicketStatus.CLOSED]: {
    label: "Closed",
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    icon: CheckCircle,
  },
  [TicketStatus.ESCALATED]: {
    label: "Escalated",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
};

const PRIORITY_CONFIG = {
  [TicketPriority.LOW]: {
    label: "Low",
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  },
  [TicketPriority.MEDIUM]: {
    label: "Medium",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  [TicketPriority.HIGH]: {
    label: "High",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  [TicketPriority.URGENT]: {
    label: "Urgent",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  [TicketPriority.CRITICAL]: {
    label: "Critical",
    color: "bg-red-600/10 text-red-700 dark:text-red-300",
  },
};

interface TicketDetailsDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketUpdated?: () => void;
}

export function TicketDetailsDialog({
  ticketId,
  open,
  onOpenChange,
  onTicketUpdated
}: TicketDetailsDialogProps) {
  const { token } = useAuth();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const loadTicket = async () => {
    if (!token || !ticketId) return;

    try {
      setIsLoadingTicket(true);
      setError(null);
      const fetchedTicket = await supportAPI.getTicket(ticketId, token);
      setTicket(fetchedTicket);
    } catch (err) {
      console.error("Failed to load ticket:", err);
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    } finally {
      setIsLoadingTicket(false);
    }
  };

  const loadMessages = async () => {
    if (!token || !ticketId) return;

    try {
      setIsLoadingMessages(true);
      const fetchedMessages = await supportAPI.getMessages(ticketId, token);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error("Failed to load messages:", err);
      // Don't show error for messages as ticket might load successfully
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newMessage.trim()) return;

    try {
      setIsSendingMessage(true);

      const messageData: CreateMessageData = {
        content: newMessage.trim(),
        message_type: MessageType.USER_MESSAGE,
      };

      await supportAPI.addMessage(ticketId, messageData, token);
      setNewMessage("");
      setAttachments([]);

      // Reload messages and ticket
      await Promise.all([loadMessages(), loadTicket()]);
      onTicketUpdated?.();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAgentMessage = (message: TicketMessage) => {
    return message.message_type === MessageType.AGENT_REPLY;
  };

  const isSystemMessage = (message: TicketMessage) => {
    return message.message_type === MessageType.SYSTEM_NOTE;
  };

  useEffect(() => {
    if (open && ticketId && token) {
      loadTicket();
      loadMessages();
    }
  }, [open, ticketId, token]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Support Ticket Details</span>
            {ticket && (
              <Badge className={cn("ml-2", STATUS_CONFIG[ticket.status].color)}>
                {STATUS_CONFIG[ticket.status].label}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoadingTicket ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading ticket details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : ticket ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Ticket Header */}
            <Card className="flex-shrink-0 mb-4">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{ticket.ticket_number}
                      </span>
                      <Badge className={PRIORITY_CONFIG[ticket.priority].color}>
                        {PRIORITY_CONFIG[ticket.priority].label}
                      </Badge>
                      {ticket.is_overdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
                    <p className="text-muted-foreground">{ticket.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Created</Label>
                    <p>{formatDate(ticket.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <p className="capitalize">{ticket.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Assigned To</Label>
                    <p>{ticket.assigned_agent_name || "Unassigned"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Updated</Label>
                    <p>{formatDate(ticket.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="flex-1 min-h-0">
              <h4 className="font-semibold mb-3">Conversation</h4>
              <ScrollArea className="h-full border rounded-lg">
                <div className="p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={message.id}>
                        <div
                          className={cn(
                            "flex gap-3",
                            isAgentMessage(message) ? "justify-start" :
                            isSystemMessage(message) ? "justify-center" : "justify-end"
                          )}
                        >
                          {isSystemMessage(message) ? (
                            <div className="text-center">
                              <Badge variant="outline" className="text-xs">
                                {message.content}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(message.created_at)}
                              </p>
                            </div>
                          ) : (
                            <>
                              {isAgentMessage(message) && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <UserCog className="h-4 w-4 text-primary" />
                                  </div>
                                </div>
                              )}
                              <div className={cn(
                                "flex-1 max-w-[70%]",
                                !isAgentMessage(message) && "flex justify-end"
                              )}>
                                <div
                                  className={cn(
                                    "rounded-lg p-3",
                                    isAgentMessage(message)
                                      ? "bg-muted"
                                      : "bg-primary text-primary-foreground"
                                  )}
                                >
                                  {message.sender_name && (
                                    <div className="text-xs font-medium mb-1">
                                      {message.sender_name}
                                    </div>
                                  )}
                                  <div className="whitespace-pre-wrap">
                                    {message.content}
                                  </div>
                                  <div className={cn(
                                    "text-xs mt-2 opacity-70",
                                    isAgentMessage(message) ? "text-muted-foreground" : "text-primary-foreground/70"
                                  )}>
                                    {formatDate(message.created_at)}
                                  </div>
                                </div>
                              </div>
                              {!isAgentMessage(message) && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {index < messages.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            {ticket.status !== TicketStatus.CLOSED && (
              <form onSubmit={handleSendMessage} className="flex-shrink-0 mt-4">
                <div className="space-y-3">
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1 text-sm"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isSendingMessage}
                      rows={3}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSendingMessage}
                        size="sm"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                      <label>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isSendingMessage}
                        />
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Paperclip className="h-4 w-4" />
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
