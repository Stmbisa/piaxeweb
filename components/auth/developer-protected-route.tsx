"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

interface DeveloperProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function DeveloperProtectedRoute({ children, fallback }: DeveloperProtectedRouteProps) {
    const { isAuthenticated, isDeveloper, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?message=Please login to access the developer dashboard&redirect=developer/dashboard')
        } else if (!isLoading && isAuthenticated && !isDeveloper) {
            router.push('/auth/developer-register?message=Please create a developer account to access the developer dashboard')
        }
    }, [isAuthenticated, isDeveloper, isLoading, router])

    if (isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )
        )
    }

    if (!isAuthenticated || !isDeveloper) {
        return null // Redirecting to appropriate page
    }

    return <>{children}</>
}
