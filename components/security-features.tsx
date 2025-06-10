import { Shield, Lock, Eye, CheckCircle } from "lucide-react"

export function SecurityFeatures() {
  return (
    <section className="py-10 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">Never be scammed again</h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our escrow system ensures your money is safe until both parties fulfill their obligations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-background rounded-2xl p-4 sm:p-6 text-center shadow-sm border">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Escrow Protection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Funds held securely until terms are met</p>
          </div>

          <div className="bg-background rounded-2xl p-4 sm:p-6 text-center shadow-sm border">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Encrypted Transactions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">End-to-end encryption for all payments</p>
          </div>

          <div className="bg-background rounded-2xl p-4 sm:p-6 text-center shadow-sm border">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Real-time Tracking</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Monitor your transactions every step</p>
          </div>

          <div className="bg-background rounded-2xl p-4 sm:p-6 text-center shadow-sm border">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Verified Users</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">KYC verification for trusted transactions</p>
          </div>
        </div>
      </div>
    </section>
  )
}
