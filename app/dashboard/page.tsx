"use client"

import { PersonalDashboard } from "@/components/dashboard/personal-dashboard"

// Force dynamic rendering since this page uses client-side authentication
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    return <PersonalDashboard />
}
