"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

interface MerchantProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function MerchantProtectedRoute({ children, fallback }: MerchantProtectedRouteProps) {
  const { isAuthenticated, isMerchant, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?message=Please login to access the merchant dashboard&redirect=dashboard/store')
    } else if (!isLoading && isAuthenticated && !isMerchant) {
      router.push('/auth/merchant-register?message=Please create a merchant account to access the store dashboard')
    }
  }, [isAuthenticated, isMerchant, isLoading, router])

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

  if (!isAuthenticated || !isMerchant) {
    return null // Redirecting to appropriate page
  }

  return <>{children}</>
}
