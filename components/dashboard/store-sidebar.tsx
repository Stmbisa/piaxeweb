"use client"

import { cn } from '@/lib/utils'
import {
    BarChart3,
    Package,
    Users,
    Megaphone,
    CreditCard,
    Building2,
    Store
} from 'lucide-react'

interface StoreSidebarProps {
    items: Array<{
        id: string
        label: string
        icon: string
    }>
    activeSection: string
    onSectionChange: (section: string) => void
}

const iconMap = {
    BarChart3,
    Package,
    Users,
    Megaphone,
    CreditCard,
}

export function StoreSidebar({ items, activeSection, onSectionChange }: StoreSidebarProps) {
    return (
        <div className="w-64 bg-background/80 backdrop-blur-sm border-r border-border/50 min-h-screen">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">My Store</h2>
                        <p className="text-sm text-muted-foreground">Business Dashboard</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {items.map((item) => {
                        const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                        const isActive = activeSection === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {IconComponent && <IconComponent className="w-5 h-5" />}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Store Status</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                        Your store is live and accepting payments
                    </p>
                    <div className="w-full bg-primary/20 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-4/5"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">80% setup complete</p>
                </div>
            </div>
        </div>
    )
}
