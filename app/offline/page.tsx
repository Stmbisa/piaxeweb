"use client"

import { useEffect, useState } from "react"

export default function OfflinePage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="glass-card p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">You're Offline</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you're not connected to the internet. Check your connection and try again.
          </p>
          {isClient && (
            <button 
              onClick={handleRetry}
              className="glass-button-primary px-6 py-3 rounded-lg"
            >
              Try Again
            </button>
          )}
          {!isClient && (
            <div className="glass-button-primary px-6 py-3 rounded-lg inline-block">
              Try Again
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
