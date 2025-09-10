"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        const checkIfInstalled = () => {
            const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
            const isIOSInstalled = (window.navigator as any).standalone === true
            setIsInstalled(isInStandaloneMode || isIOSInstalled)
        }

        checkIfInstalled()

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)

            // Show install prompt after 15 seconds if not installed
            setTimeout(() => {
                if (!isInstalled) {
                    setShowPrompt(true)
                }
            }, 15000)
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setShowPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [isInstalled])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setDeferredPrompt(null)
            setShowPrompt(false)
        }
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        // Don't show again for 24 hours
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }

    // Check if user dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (dismissed) {
            const dismissedTime = parseInt(dismissed)
            const dayInMs = 24 * 60 * 60 * 1000
            if (Date.now() - dismissedTime < dayInMs) {
                setShowPrompt(false)
                return
            }
        }
    }, [])

    if (!showPrompt || isInstalled || !deferredPrompt) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm animate-glass-appear">
            {/* Floating glass background effects */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-glass-float"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-glass-float-delayed"></div>

            <div className="glass-card-enhanced relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                {/* Glass shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-glass-shimmer opacity-50"></div>

                <div className="relative z-10">
                    <div className="flex items-start gap-3">
                        <div className="glass-icon-button p-2 bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20">
                            <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 text-foreground">Install piaxis App</h3>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                Get access to secure payments, escrow protection, and business tools.
                                Works offline and loads faster!
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleInstallClick}
                                    className="glass-button-primary flex-1 text-xs h-8 font-medium flex items-center justify-center gap-1 group"
                                >
                                    <Download className="w-3 h-3 transition-transform group-hover:scale-110" />
                                    Install
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="glass-button text-xs h-8 px-3 hover:bg-muted/50 transition-all"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="glass-icon-button p-1 h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Subtle glass border glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
            </div>
        </div>
    )
}
