"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SidebarItemDef {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  color?: string;
}

const SIDEBAR_ITEMS: SidebarItemDef[] = [
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

export function BusinessSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const businessProfile = user?.business_profile;
  const { state, isMobile } = useSidebar();

  return (
    <>
      {isMobile && (
        <div className="fixed top-18 left-4 z-40 md:hidden">
          <SidebarTrigger className="h-10 w-10 p-0 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-muted/80 dark:bg-slate-800/80 dark:border-slate-700/50 dark:hover:bg-slate-700/80">
            {/* PanelLeft icon is default from SidebarTrigger */}
          </SidebarTrigger>
        </div>
      )}
      <Sidebar
        collapsible="icon"
        className={cn(
          "bg-white/90 dark:bg-slate-900/90 border-r border-border/50 dark:border-slate-700/50",
          "top-[3.5rem] sm:top-[4rem] h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)]"
        )}
      >
        <SidebarHeader className="p-4 border-b border-border/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            {state === "expanded" && (
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground truncate text-sm">
                  {businessProfile?.business_name || "My Business"}
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  Business Dashboard
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/business/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "justify-start w-full",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 border border-purple-200/50 dark:from-purple-400/20 dark:to-blue-400/20 dark:text-purple-300 dark:border-purple-500/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-slate-800"
                    )}
                    tooltip={state === "collapsed" ? item.label : undefined}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive
                            ? "text-purple-600 dark:text-purple-400"
                            : "group-hover:text-foreground dark:group-hover:text-slate-300"
                        )}
                      />
                      {state === "expanded" && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs h-fit"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Rail for desktop toggle */}
        <SidebarRail />

        <SidebarFooter className="p-4 border-t border-border/50 dark:border-slate-700/50">
          {state === "expanded" && (
            <div className="space-y-3">
              {/* Quick Actions */}
              <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700/70 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-900 dark:text-slate-200">
                    Quick Actions
                  </span>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-slate-700 h-8"
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-slate-700 h-8"
                  >
                    New Order
                  </Button>
                </div>
              </div>

              {/* Business Status */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">
                    Store Active
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:bg-muted/50 dark:hover:bg-slate-700/50 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
