"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { SettingsManager } from "@/components/business/settings-manager"

export default function SettingsPage() {
    return <SettingsManager />
}
