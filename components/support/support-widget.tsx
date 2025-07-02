"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Plus,
  ExternalLink,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { CreateTicketDialog } from "./create-ticket-dialog";
import Link from "next/link";

interface SupportWidgetProps {
  className?: string;
  compact?: boolean;
}

export function SupportWidget({ className = "", compact = false }: SupportWidgetProps) {
  const { isAuthenticated } = useAuth();
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Need Help?</h3>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setShowCreateTicket(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Support Ticket
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/support">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Help Center
            </Link>
          </Button>
        </div>

        <CreateTicketDialog
          open={showCreateTicket}
          onOpenChange={setShowCreateTicket}
        />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Support Center
        </CardTitle>
        <CardDescription>
          Get help when you need it most
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            onClick={() => setShowCreateTicket(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Create Support Ticket</div>
                <div className="text-sm text-muted-foreground">Get personalized help</div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            asChild
          >
            <Link href="/support">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Knowledge Base</div>
                  <div className="text-sm text-muted-foreground">Find answers instantly</div>
                </div>
              </div>
            </Link>
          </Button>

          {isAuthenticated && (
            <Button
              variant="outline"
              className="justify-start h-auto p-3"
              asChild
            >
              <Link href="/support#my-tickets">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">My Tickets</div>
                    <div className="text-sm text-muted-foreground">Track your requests</div>
                  </div>
                </div>
              </Link>
            </Button>
          )}
        </div>

        {/* Popular Help Topics */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Popular Help Topics</h4>
          <div className="space-y-2">
            <Link
              href="/support?category=payment_issue"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              • Payment and transaction issues
            </Link>
            <Link
              href="/support?category=account_access"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              • Account access and login problems
            </Link>
            <Link
              href="/support?category=merchant_support"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              • Business account setup
            </Link>
            <Link
              href="/support?category=api_support"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              • API integration help
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Contact Us</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>support@piaxe.me</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Mon-Fri 9AM-6PM EAT</span>
            </div>
          </div>
        </div>

        <CreateTicketDialog
          open={showCreateTicket}
          onOpenChange={setShowCreateTicket}
        />
      </CardContent>
    </Card>
  );
}

// Floating Support Button
export function FloatingSupportButton() {
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={() => setShowCreateTicket(true)}
        aria-label="Get Support"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <CreateTicketDialog
        open={showCreateTicket}
        onOpenChange={setShowCreateTicket}
      />
    </>
  );
}
