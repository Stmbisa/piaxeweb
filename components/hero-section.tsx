import { Button } from "@/components/ui/button"
import { Shield, Smartphone, CreditCard } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              High-Class bank experiences for everyone
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              The payment system optimized for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                low trust environments
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Piaxe offers escrow payments, POS-free physical store payments, CRM, fundraising, and social e-commerce
              all in one secure platform.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
              Download App
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300">
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-muted-foreground">
            <div className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
                <Smartphone className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm font-medium">Mobile First</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm font-medium">Multi-channel Payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
