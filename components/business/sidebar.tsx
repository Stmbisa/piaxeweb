"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";
import {
  Building2,
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Settings,
  CreditCard,
  FileText,
  HelpCircle,
  Bell,
  Store,
  X,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  color?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    href: "/business/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "stores",
    label: "Store Management",
    href: "/business/dashboard/stores",
    icon: Store,
  },
  {
    id: "products",
    label: "Products",
    href: "/business/dashboard/products",
    icon: Package,
    badge: "New",
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/business/dashboard/inventory",
    icon: Package,
    badge: "Hot",
  },
  {
    id: "staff",
    label: "Staff Management",
    href: "/business/dashboard/staff",
    icon: Users,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/business/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    id: "customers",
    label: "Customers",
    href: "/business/dashboard/customers",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/business/dashboard/analytics",
    icon: BarChart3,
  },
  {
    id: "campaigns",
    label: "Marketing",
    href: "/business/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    id: "payments",
    label: "Payments",
    href: "/business/dashboard/payments",
    icon: CreditCard,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/business/dashboard/reports",
    icon: FileText,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/business/dashboard/settings",
    icon: Settings,
  },
];

interface BusinessSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BusinessSidebar({ isOpen = true, onClose }: BusinessSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const businessProfile = user?.business_profile;

  return (
    <>
      {/* Mobile Overlay - only show when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "glass-card-enhanced backdrop-blur-xl border-r border-border/20 transition-all duration-500 flex flex-col shadow-2xl z-50 bg-gradient-to-b from-white/80 via-white/60 to-white/40 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40",
          // Mobile styles - completely hidden by default on mobile
          "hidden md:flex",
          // When mobile menu is open, show as overlay
          isOpen && "flex fixed left-0 top-0 h-full md:relative",
          // Responsive width
          collapsed ? "w-16 md:w-20" : "w-72 md:w-80 lg:w-96"
        )}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="glass-button w-8 h-8 p-0 hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Header */}
        <div className="p-4 md:p-5 lg:p-6 border-b border-border/20">
          <div className="flex items-center gap-3 md:gap-4 animate-glass-appear">
            <div className="glass-icon-button w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-sm" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm md:text-base lg:text-lg truncate bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                  {businessProfile?.business_name || "My Business"}
                </h2>
                <p className="text-sm text-muted-foreground/80 truncate mt-1">
                  Business Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 lg:p-5 space-y-2 md:space-y-3 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/business/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose} // Close mobile menu when navigation item is clicked
                className={cn(
                  "glass-card flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg animate-glass-appear backdrop-blur-xl",
                  isActive
                    ? "glass-button-primary shadow-xl shadow-purple-500/25 bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-blue-500/20 border-purple-300/30 dark:border-purple-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 border-border/20 hover:border-border/40"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6 flex-shrink-0 transition-all duration-300",
                    isActive
                      ? "text-purple-600 dark:text-purple-400 drop-shadow-sm"
                      : "group-hover:text-foreground dark:group-hover:text-slate-300 group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="glass-button text-xs px-2 py-1 h-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-700/50">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 md:p-5 lg:p-6 border-t border-border/20">
          {!collapsed && (
            <div className="space-y-3 md:space-y-4 animate-glass-appear" style={{ animationDelay: '0.8s' }}>
              {/* Quick Actions */}
              <div className="glass-card-primary p-4 md:p-5 hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-blue-500/10 border-purple-200/30 dark:border-purple-700/30 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 md:gap-3 mb-3">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400 drop-shadow-sm" />
                  <span className="text-sm md:text-base font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    Quick Actions
                  </span>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass-button w-full justify-start text-sm hover:scale-[1.02] transition-all duration-300 h-9 md:h-10 backdrop-blur-sm"
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass-button w-full justify-start text-sm hover:scale-[1.02] transition-all duration-300 h-9 md:h-10 backdrop-blur-sm"
                  >
                    New Order
                  </Button>
                </div>
              </div>

              {/* Business Status */}
              <div className="glass-card flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-green-500/10 via-green-400/5 to-emerald-500/10 hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl border-green-200/30 dark:border-green-700/30 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm md:text-base font-medium text-green-700 dark:text-green-300">
                    Store Active
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="glass-button w-full justify-start text-muted-foreground hover:scale-[1.02] transition-all duration-300 h-9 md:h-10 text-sm backdrop-blur-sm"
              >
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                Help & Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}