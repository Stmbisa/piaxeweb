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
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { ADMIN_PREFIX } from "@/lib/config/env";

export function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    {
      name: "Dashboard",
      href: `/${ADMIN_PREFIX}/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Recent Signups",
      href: `/${ADMIN_PREFIX}/admin/users/recent-signups`,
      icon: Users,
    },
    {
      name: "User Verifications",
      href: `/${ADMIN_PREFIX}/admin/verifications/users`,
      icon: ClipboardCheck,
    },
    {
      name: "Merchant Verifications",
      href: `/${ADMIN_PREFIX}/admin/verifications/merchants`,
      icon: Store,
    },
    {
      name: "Environment Info",
      href: `/${ADMIN_PREFIX}/admin/env-info`,
      icon: Server,
    },
    {
      name: "Settings",
      href: `/${ADMIN_PREFIX}/admin/settings`,
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const sidebarClasses = cn(
    "h-screen bg-background border-r flex flex-col z-50",
    "transition-all duration-300 ease-in-out",
    isMobileMenuOpen
      ? "fixed inset-y-0 left-0 w-64 shadow-lg"
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
          <div className="p-6 border-b">
            <Link href={`/${ADMIN_PREFIX}/admin/dashboard`}>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl">Admin Portal</span>
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
              >
                <div
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md",
                    "transition-colors duration-200",
                    isActive(route.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                >
                  <route.icon className="h-5 w-5 mr-3" />
                  <span>{route.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
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
