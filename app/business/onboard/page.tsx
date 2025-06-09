"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { BusinessOnboardingFlow } from "@/components/business/onboarding-flow"
import { BusinessProtectedRoute } from "@/components/auth/business-protected-route"

export default function BusinessOnboardingPage() {
    const { user, isBusiness } = useAuth()
    const router = useRouter()

    // Redirect if already has complete business setup
    useEffect(() => {
        if (isBusiness && user?.business_profile?.setup_complete) {
            router.push('/business/dashboard')
        }
    }, [isBusiness, user, router])

    return (
        <BusinessProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50/30">
                <BusinessOnboardingFlow />
            </div>
        </BusinessProtectedRoute>
    )
}
