"use client"

import { Eye, Plus, Minus, Shield, Building2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

import Image from "next/image"

export function MobileWalletPreview() {
  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground">
            Experience Piaxe on Mobile
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage your finances, make secure payments, and grow your business with our intuitive mobile app
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative group">
            {/* Floating decoration elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>

            {/* Mobile Design Reference Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>
              <Image
                src="/images/mobile-design-reference.png"
                alt="Piaxe Mobile App Interface - Secure payments and escrow system"
                width={320}
                height={640}
                className="object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
                priority
                quality={95}
              />

              {/* Overlay with app store badges */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <p className="text-white text-sm font-medium text-center">Available Soon</p>
                </div>
              </div>
            </div>

            {/* Feature callouts */}
            <div className="absolute top-8 -left-8 transform -translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
              <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium shadow-lg">
                Escrow Protection
              </div>
            </div>

            <div className="absolute bottom-16 -right-8 transform translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-500">
              <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-sm font-medium shadow-lg">
                Real-time Tracking
              </div>
            </div>
          </div>
        </div>

        {/* App Store Download Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <a
            href="https://play.google.com/store/apps/details?id=com.piaxe.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs opacity-80">Get it on</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </a>

          <a
            href="https://apps.apple.com/app/piaxe/id123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs opacity-80">Download on the</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </a>
        </div>

        {/* Additional features section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Secure Escrow</h3>
            <p className="text-sm text-muted-foreground">Protected payments until terms are fulfilled</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Business Tools</h3>
            <p className="text-sm text-muted-foreground">Complete CRM and inventory management</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Multi-channel</h3>
            <p className="text-sm text-muted-foreground">Accept payments from any source</p>
          </div>
        </div>
      </div>
    </section>
  )
}
