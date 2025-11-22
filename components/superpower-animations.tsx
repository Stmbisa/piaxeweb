"use client"

import { Lock, Unlock, QrCode, MapPin, CheckCircle2, Smartphone, XCircle, Package, Check } from "lucide-react"
import { useState, useEffect } from "react"

export function LockAnimation() {
    const [isLocked, setIsLocked] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLocked((prev) => !prev)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative flex items-center justify-center w-full h-full">
            <div className={`transition-all duration-500 ${isLocked ? "text-primary" : "text-muted-foreground"}`}>
                {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            {isLocked && (
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
            )}
        </div>
    )
}

export function ScanAnimation() {
    return (
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
            <QrCode className="w-5 h-5 text-foreground/80" />
            <div className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-scan-line" />
        </div>
    )
}

export function MapAnimation() {
    return (
        <div className="relative flex items-center justify-center w-full h-full">
            <MapPin className="w-5 h-5 text-primary animate-bounce" />
            <div className="absolute bottom-0 w-3 h-1 bg-primary/30 rounded-full animate-pulse" />
        </div>
    )
}


export function POSDestructionAnimation() {
    return (
        <div className="relative w-full h-full bg-gradient-to-br from-muted/50 to-background flex items-center justify-center overflow-hidden rounded-2xl">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25"></div>

            {/* The POS Machine (Old Way) - Fades Out */}
            <div className="absolute animate-fade-out [animation-delay:1.5s] [animation-fill-mode:forwards] opacity-100">
                <div className="relative flex flex-col items-center grayscale opacity-70">
                    <div className="w-24 h-32 bg-slate-800 rounded-xl border-b-8 border-r-8 border-slate-900 flex flex-col items-center p-2 shadow-2xl transform rotate-3">
                        <div className="w-full h-8 bg-slate-700 rounded mb-2 border border-slate-600"></div>
                        <div className="grid grid-cols-3 gap-1 w-full mt-2">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-full h-2 bg-slate-600 rounded-sm"></div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -right-6 -top-6">
                        <XCircle className="w-12 h-12 text-red-500/80 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* The Phone (New Way) - Slides In */}
            <div className="absolute animate-fade-in-simple opacity-0 [animation-delay:2s] [animation-fill-mode:forwards] z-10">
                <div className="relative">
                    {/* Phone Frame */}
                    <div className="w-[100px] h-[200px] bg-slate-900 rounded-[2rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-b-xl z-20"></div>

                        {/* Screen Content: Camera View */}
                        <div className="w-full h-full bg-slate-900 flex flex-col relative">
                            {/* Camera UI Overlay */}
                            <div className="absolute inset-4 border-2 border-white/30 rounded-lg z-10 flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                            </div>

                            {/* Product being scanned */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="w-12 h-12 text-white/80" />
                            </div>

                            {/* Scanning Laser */}
                            <div className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-scan-line z-10 top-0"></div>

                            {/* Success Popup (Delayed) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 animate-fade-in-simple [animation-delay:4s] [animation-fill-mode:forwards] z-20 backdrop-blur-sm">
                                <div className="bg-white rounded-full p-3 shadow-lg transform scale-0 animate-glass-appear [animation-delay:4.1s]">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                            </div>

                            {/* Bottom UI */}
                            <div className="absolute bottom-4 left-0 w-full px-4 z-20">
                                <div className="w-full h-8 bg-primary rounded-full flex items-center justify-center shadow-lg opacity-0 animate-fade-in-simple [animation-delay:4.5s] [animation-fill-mode:forwards]">
                                    <span className="text-[10px] font-bold text-primary-foreground">Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Label */}
                    <div className="absolute -right-12 top-10 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce [animation-delay:4.2s] opacity-0 animate-fade-in-simple [animation-fill-mode:forwards]">
                        Scanned!
                    </div>
                </div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-4 text-center w-full">
                <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                    Scan • Pay • Go
                </span>
            </div>
        </div>
    )
}
