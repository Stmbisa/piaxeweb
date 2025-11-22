"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-glass-appear">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
      </div>
      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle className="text-gradient-primary bg-clip-text text-transparent">System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Settings functionality will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
