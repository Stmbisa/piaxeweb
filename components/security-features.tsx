import { Shield, Lock, Eye, CheckCircle } from "lucide-react"

export function SecurityFeatures() {
  return (
    <section className="py-1 sm:py-12 bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

      <div className="container mx-auto px-1 sm:px-4 relative z-10">
        <div className="text-center mb-1 sm:mb-8 animate-glass-appear">
          <h2 className="text-sm sm:text-3xl font-bold tracking-tight mb-0.5 sm:mb-4">Never be scammed again</h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto px-1">
            Our escrow system ensures your money is safe until both parties fulfill their obligations
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 sm:gap-4 lg:gap-6">
          <div className="glass-card text-center p-1 sm:p-4 animate-glass-appear" style={{ animationDelay: "0.1s" }}>
            <div className="glass-icon-button w-4 h-4 sm:w-12 sm:h-12 mx-auto mb-0.5 sm:mb-4">
              <Shield className="w-2 h-2 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-0.5 sm:mb-2 text-xs sm:text-base leading-tight">Escrow Protection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug">Funds held securely until terms are met</p>
          </div>

          <div className="glass-card text-center p-1 sm:p-4 animate-glass-appear" style={{ animationDelay: "0.2s" }}>
            <div className="glass-icon-button w-4 h-4 sm:w-12 sm:h-12 mx-auto mb-0.5 sm:mb-4">
              <Lock className="w-2 h-2 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-0.5 sm:mb-2 text-xs sm:text-base leading-tight">Encrypted Transactions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug">End-to-end encryption for all payments</p>
          </div>

          <div className="glass-card text-center p-1 sm:p-4 animate-glass-appear" style={{ animationDelay: "0.3s" }}>
            <div className="glass-icon-button w-4 h-4 sm:w-12 sm:h-12 mx-auto mb-0.5 sm:mb-4">
              <Eye className="w-2 h-2 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-0.5 sm:mb-2 text-xs sm:text-base leading-tight">Real-time Tracking</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug">Monitor your transactions every step</p>
          </div>

          <div className="glass-card text-center p-1 sm:p-4 animate-glass-appear" style={{ animationDelay: "0.4s" }}>
            <div className="glass-icon-button w-4 h-4 sm:w-12 sm:h-12 mx-auto mb-0.5 sm:mb-4">
              <CheckCircle className="w-2 h-2 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-0.5 sm:mb-2 text-xs sm:text-base leading-tight">Verified Users</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug">KYC verification for trusted transactions</p>
          </div>
        </div>
      </div>
    </section>
  )
}
