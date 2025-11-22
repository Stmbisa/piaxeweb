"use client";

import { TicketList } from "@/components/admin/support/ticket-list";
import { MessageSquare } from "lucide-react";

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Support Tickets
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and respond to customer support requests
          </p>
        </div>
      </div>
      <TicketList />
    </div>
  );
}
