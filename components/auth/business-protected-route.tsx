"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

interface BusinessProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function BusinessProtectedRoute({ children, fallback }: BusinessProtectedRouteProps) {
  const { isAuthenticated, isBusiness, isLoading, checkStores } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login?message=Please login to access the business dashboard&redirect=business/dashboard')
        return
      }

      if (!isLoading && isAuthenticated && !isBusiness) {
        // Check if user has stores before redirecting to registration
        const hasStores = await checkStores()
        if (!hasStores) {
          router.push('/auth/business-register?message=Please create a business account to access the business dashboard')
        }
      }
    }

    handleAuth()
  }, [isAuthenticated, isBusiness, isLoading, router, checkStores])

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

  if (!isAuthenticated || !isBusiness) {
    return null // Redirecting to appropriate page
  }

  return <>{children}</>
}
