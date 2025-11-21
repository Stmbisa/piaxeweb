import { Shield, Smartphone, CreditCard } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-br from-background via-background/80 to-muted/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glass-float"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-glass-float-delayed"></div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6 animate-fade-in">
            <div className="glass-button inline-flex items-center gap-2 mb-4 text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Programmable trust rails for emerging commerce
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              The End of Scams. The Future of Trade.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Shop without fear. Sell without limits. Run your entire business from your pocket.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-glass-appear" style={{ animationDelay: "0.2s" }}>
            <a href="/auth/register" className="glass-button-primary px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
              Start Transacting Safely
            </a>
            <a href="/business/onboard" className="glass-button-secondary px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
              Create Shop
            </a>
            <a href="/auth/developer-register" className="glass-button px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-white/10">
              Developers
            </a>
            <a href="#demo" className="glass-button px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-white/5">
              Watch the Demo
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-muted-foreground animate-glass-appear" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card flex items-center gap-3 group cursor-pointer">
              <div className="glass-icon-button">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Bank-level Security</span>
            </div>
            <div className="glass-card flex items-center gap-3 group cursor-pointer">
              <div className="glass-icon-button">
                <Smartphone className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm font-medium">Mobile-First Design</span>
            </div>
            <div className="glass-card flex items-center gap-3 group cursor-pointer">
              <div className="glass-icon-button">
                <CreditCard className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium">Multi-Payment Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
