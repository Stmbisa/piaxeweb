"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-500">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">Install Piaxe App</h3>
                            <p className="text-xs opacity-90 mb-3 leading-relaxed">
                                Get access to secure payments, escrow protection, and business tools.
                                Works offline and loads faster!
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleInstallClick}
                                    className="flex-1 bg-white text-primary hover:bg-white/90 font-medium text-xs h-8"
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Install
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleDismiss}
                                    className="text-white hover:bg-white/20 text-xs h-8 px-2"
                                >
                                    Later
                                </Button>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDismiss}
                            className="text-white hover:bg-white/20 p-1 h-6 w-6 shrink-0"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
