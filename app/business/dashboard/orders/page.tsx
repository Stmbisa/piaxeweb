"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { OrdersManager } from "@/components/business/orders-manager"

export default function OrdersPage() {
    return <OrdersManager />
}
