import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Settings,
  Menu,
  X,
  LogOut,
  Store,
  Server,
  Bell,
  FileText,
  AlertTriangle,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    {
      name: "Dashboard",
      href: `/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Recent Signups",
      href: `/admin/users/recent-signups`,
      icon: Users,
    },
    {
      name: "User Verifications",
      href: `/admin/verifications/users`,
      icon: ClipboardCheck,
    },
    {
      name: "Merchant Verifications",
      href: `/admin/verifications/merchants`,
      icon: Store,
    },
    {
      name: "Environment Info",
      href: `/admin/env-info`,
      icon: Server,
    },
    {
      name: "CRM Recurring Dry-Run",
      href: `/admin/crm/recurring-dry-run`,
      icon: FileText,
    },
    {
      name: "Chain Settlements",
      href: `/admin/chain-settlements`,
      icon: CreditCard,
    },
    // Notifications group
    {
      name: "Send Notification",
      href: `/admin/notifications/send`,
      icon: Bell,
    },
    {
      name: "Templates",
      href: `/admin/notifications/templates`,
      icon: FileText,
    },
    {
      name: "Failed Deliveries",
      href: `/admin/notifications/failed-deliveries`,
      icon: AlertTriangle,
    },
    {
      name: "Support",
      href: `/admin/support`,
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: `/admin/settings`,
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const sidebarClasses = cn(
    "h-screen glass-card-enhanced flex flex-col z-50",
    "transition-all duration-300 ease-in-out animate-glass-appear",
    "border-r-0", // Remove default border, glass handles it
    isMobileMenuOpen
      ? "fixed inset-y-0 left-0 w-64 shadow-2xl"
      : "w-64 hidden lg:flex flex-shrink-0"
  );

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="glass-icon-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="p-6 border-b border-border/20">
              <Link href={`/admin/dashboard`}>
              <div className="flex items-center space-x-2 group">
                <span className="font-bold text-xl text-gradient-primary bg-clip-text text-transparent">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group"
              >
                <div
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg",
                    "transition-all duration-300 ease-out",
                    "glass-base",
                    isActive(route.href)
                      ? "bg-primary/20 text-primary font-semibold shadow-lg scale-[1.02]"
                      : "hover:bg-muted/50 hover:scale-[1.01] hover:shadow-md"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 mr-3 transition-colors duration-200",
                      isActive(route.href)
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  <span>{route.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/20 mt-auto">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center glass-button hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
