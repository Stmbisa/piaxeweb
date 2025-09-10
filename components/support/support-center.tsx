"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  HelpCircle,
  BookOpen,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Users,
  Zap
} from "lucide-react";
import { TicketList } from "./ticket-list";
import { CreateTicketDialog } from "./create-ticket-dialog";
import { KnowledgeBase } from "./knowledge-base";
import { TicketCategory } from "@/lib/api/support";

const QUICK_HELP_CATEGORIES = [
  {
    id: "payment_issue" as TicketCategory,
    title: "Payment Issues",
    description: "Problems with transactions, payments, or wallet",
    icon: AlertCircle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: "account_access" as TicketCategory,
    title: "Account Access",
    description: "Login problems, password reset, verification",
    icon: Users,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    id: "technical_support" as TicketCategory,
    title: "Technical Support",
    description: "App issues, bugs, or technical difficulties",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "merchant_support" as TicketCategory,
    title: "Business Support",
    description: "Merchant account, business features, integrations",
    icon: MessageCircle,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    id: "api_support" as TicketCategory,
    title: "Developer Support",
    description: "API integration, webhooks, development help",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "billing" as TicketCategory,
    title: "Billing",
    description: "Charges, fees, invoices, and billing questions",
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Browse Knowledge Base",
    description: "Find answers to common questions",
    icon: BookOpen,
    action: "knowledge-base",
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  },
  {
    title: "My Support Tickets",
    description: "View and manage your tickets",
    icon: MessageSquare,
    action: "my-tickets",
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  },
  {
    title: "Create New Ticket",
    description: "Get help from our support team",
    icon: Plus,
    action: "new-ticket",
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  },
];

export function SupportCenter() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "knowledge-base":
        setActiveTab("knowledge-base");
        break;
      case "my-tickets":
        setActiveTab("my-tickets");
        break;
      case "new-ticket":
        setShowCreateTicket(true);
        break;
    }
  };

  const handleCategoryHelp = (category: TicketCategory) => {
    setActiveTab("knowledge-base");
    // We could add category filtering here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Search our knowledge base, browse help topics, or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, common issues, or ask a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                setActiveTab("knowledge-base");
              }
            }}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Support Center</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="my-tickets" disabled={!isAuthenticated}>
              {isAuthenticated ? "My Tickets" : "Sign in for Tickets"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              {QUICK_ACTIONS.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={action.action}
                    className={`cursor-pointer transition-all hover:scale-105 ${action.color}`}
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Help Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUICK_HELP_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => handleCategoryHelp(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">
                              {category.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Popular Articles Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Popular Help Articles</h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("knowledge-base")}
                >
                  View All Articles
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* These would be populated from actual knowledge base */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">How to make a payment</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn the different ways to send money using piaxis
                    </p>
                    <Badge variant="secondary" className="text-xs">Payment</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Setting up your business account</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete guide to business registration and verification
                    </p>
                    <Badge variant="secondary" className="text-xs">Business</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">API integration guide</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Step-by-step developer integration instructions
                    </p>
                    <Badge variant="secondary" className="text-xs">Developer</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Security and fraud protection</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Keep your account and transactions secure
                    </p>
                    <Badge variant="secondary" className="text-xs">Security</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Support CTA */}
            <Card className="bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button onClick={() => setShowCreateTicket(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Support Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge-base">
            <KnowledgeBase searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="my-tickets">
            {isAuthenticated ? (
              <TicketList />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Sign in Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Please sign in to view and manage your support tickets.
                  </p>
                  <Button asChild>
                    <a href="/auth/login">Sign In</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Ticket Dialog */}
        <CreateTicketDialog
          open={showCreateTicket}
          onOpenChange={setShowCreateTicket}
        />
      </div>
    </div>
  );
}
