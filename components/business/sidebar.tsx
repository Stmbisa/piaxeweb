"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/context"
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
    Store
} from "lucide-react"

interface SidebarItem {
    id: string
    label: string
    href: string
    icon: React.ComponentType<any>
    badge?: string
    color?: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        id: 'overview',
        label: 'Dashboard',
        href: '/business/dashboard',
        icon: LayoutDashboard
    },
    {
        id: 'stores',
        label: 'Store Management',
        href: '/business/dashboard/stores',
        icon: Store
    },
    {
        id: 'products',
        label: 'Products',
        href: '/business/dashboard/products',
        icon: Package,
        badge: 'New'
    },
    {
        id: 'inventory',
        label: 'Inventory',
        href: '/business/dashboard/inventory',
        icon: Package,
        badge: 'Hot'
    },
    {
        id: 'staff',
        label: 'Staff Management',
        href: '/business/dashboard/staff',
        icon: Users
    },
    {
        id: 'orders',
        label: 'Orders',
        href: '/business/dashboard/orders',
        icon: ShoppingBag
    },
    {
        id: 'customers',
        label: 'Customers',
        href: '/business/dashboard/customers',
        icon: Users
    },
    {
        id: 'analytics',
        label: 'Analytics',
        href: '/business/dashboard/analytics',
        icon: BarChart3
    },
    {
        id: 'campaigns',
        label: 'Marketing',
        href: '/business/dashboard/campaigns',
        icon: Megaphone
    },
    {
        id: 'payments',
        label: 'Payments',
        href: '/business/dashboard/payments',
        icon: CreditCard
    },
    {
        id: 'reports',
        label: 'Reports',
        href: '/business/dashboard/reports',
        icon: FileText
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '/business/dashboard/settings',
        icon: Settings
    }
]

export function BusinessSidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const { user } = useAuth()
    const businessProfile = user?.business_profile

    return (
        <div className={cn(
            "bg-white/90 backdrop-blur-sm border-r border-border/50 transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-foreground truncate">
                                {businessProfile?.business_name || 'My Business'}
                            </h2>
                            <p className="text-sm text-muted-foreground truncate">
                                Business Dashboard
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href ||
                        (item.href !== '/business/dashboard' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 border border-purple-200/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 flex-shrink-0",
                                isActive ? "text-purple-600" : "group-hover:text-foreground"
                            )} />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant="secondary" className="text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                {!collapsed && (
                    <div className="space-y-3">
                        {/* Quick Actions */}
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Bell className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">Quick Actions</span>
                            </div>
                            <div className="space-y-2">
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-purple-700 h-8">
                                    Add Product
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-purple-700 h-8">
                                    New Order
                                </Button>
                            </div>
                        </div>

                        {/* Business Status */}
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-900">
                                    Store Active
                                </span>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Help & Support
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
