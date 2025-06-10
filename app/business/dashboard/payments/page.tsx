"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { PaymentsManager } from "@/components/business/payments-manager"

export default function PaymentsPage() {
    return <PaymentsManager />
}
