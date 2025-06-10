"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Force dynamic rendering since this page uses client-side routing
export const dynamic = 'force-dynamic'

export default function StoreDashboard() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to new business dashboard
        router.replace('/business/dashboard')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Redirecting to business dashboard...</p>
            </div>
        </div>
    )
}
