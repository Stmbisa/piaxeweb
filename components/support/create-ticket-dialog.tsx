"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { supportAPI, CreateTicketData, TicketCategory, TicketPriority } from "@/lib/api/support";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, AlertCircle } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: TicketCategory.GENERAL, label: "General Question" },
  { value: TicketCategory.PAYMENT_ISSUE, label: "Payment Issue" },
  { value: TicketCategory.ACCOUNT_ACCESS, label: "Account Access" },
  { value: TicketCategory.TECHNICAL_SUPPORT, label: "Technical Support" },
  { value: TicketCategory.BILLING, label: "Billing" },
  { value: TicketCategory.MERCHANT_SUPPORT, label: "Business Support" },
  { value: TicketCategory.API_SUPPORT, label: "Developer/API Support" },
  { value: TicketCategory.SECURITY_CONCERN, label: "Security Concern" },
  { value: TicketCategory.FEATURE_REQUEST, label: "Feature Request" },
  { value: TicketCategory.BUG_REPORT, label: "Bug Report" },
];

const PRIORITY_OPTIONS = [
  { value: TicketPriority.LOW, label: "Low - General question" },
  { value: TicketPriority.MEDIUM, label: "Medium - Standard issue" },
  { value: TicketPriority.HIGH, label: "High - Important issue" },
  { value: TicketPriority.URGENT, label: "Urgent - Business impact" },
  { value: TicketPriority.CRITICAL, label: "Critical - System down" },
];

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: () => void;
  defaultCategory?: TicketCategory;
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  onTicketCreated,
  defaultCategory
}: CreateTicketDialogProps) {
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>(defaultCategory || TicketCategory.GENERAL);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  const resetForm = () => {
    setSubject("");
    setDescription("");
    setCategory(defaultCategory || TicketCategory.GENERAL);
    setPriority(TicketPriority.MEDIUM);
    setGuestEmail("");
    setGuestName("");
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!subject.trim()) {
        throw new Error("Subject is required");
      }
      if (!description.trim()) {
        throw new Error("Description is required");
      }
      if (!isAuthenticated && (!guestEmail.trim() || !guestName.trim())) {
        throw new Error("Name and email are required for guest users");
      }

      const ticketData: CreateTicketData = {
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
      };

      if (!isAuthenticated) {
        ticketData.guest_email = guestEmail.trim();
        ticketData.guest_name = guestName.trim();
      }

      await supportAPI.createTicket(ticketData, token || undefined);

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        onTicketCreated?.();
      }, 2000);
    } catch (err) {
      console.error("Failed to create ticket:", err);
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Describe your issue and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ticket Created Successfully!</h3>
            <p className="text-muted-foreground">
              We've received your request and will respond shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Guest user fields */}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Your Name *</Label>
                  <Input
                    id="guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-email">Your Email *</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as TicketCategory)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as TicketPriority)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about your issue, including any error messages, steps to reproduce, and what you expected to happen."
                className="min-h-[120px]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
