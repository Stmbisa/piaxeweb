"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { ReportsManager } from "@/components/business/reports-manager"

export default function ReportsPage() {
    return <ReportsManager />
}
