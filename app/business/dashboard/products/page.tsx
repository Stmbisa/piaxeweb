"use client"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

import { ProductsManager } from "@/components/business/products-manager"

export default function ProductsPage() {
    return <ProductsManager />
}
