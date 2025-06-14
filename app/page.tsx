import { HeroSection } from "@/components/hero-section"
import { MobileWalletPreview } from "@/components/mobile-wallet-preview"
import { TargetSection } from "@/components/target-section"
import { SecurityFeatures } from "@/components/security-features"
import { Testimonials } from "@/components/testimonials"
import { BarcodePaymentDemo } from "@/components/barcode-payment-demo"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
      {/* Beautiful liquid glass background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-glass-float opacity-60"></div>

      <div className="relative z-10">
        <HeroSection />
        <MobileWalletPreview />
        <BarcodePaymentDemo />
        <SecurityFeatures />

        <section className="container mx-auto px-4 py-8 sm:py-12 space-y-12">
          <div className="grid gap-8 lg:gap-12">
            <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.1s" }}>
              <TargetSection
                id="sme"
                title="For SMEs and Brick & Mortar Businesses"
                description="Our payment tools can help your business thrive. Accept payments, manage inventory, customer relationships, and soon HR - all with one setup."
                features={[
                  "Accept digital payments from mobile money wallets, banks, and cards",
                  "Sell online on our ecommerce platform and on social media",
                  "Manage inventory and customer relationships (CRM) for free",
                  "Accept payments on social media as easy as it sounds",
                  "POS-free payment collection in physical stores using just mobile phones",
                ]}
                buttonText="Start Selling"
                buttonLink="#business"
                imageSrc="/images/business/sme-business.png"
                imageAlt="SME business owner using Piaxe dashboard"
              />
            </div>

            <div className="glass-card-secondary animate-glass-appear" style={{ animationDelay: "0.2s" }}>
              <TargetSection
                id="social-commerce"
                title="Social Commerce - Sell Anywhere, Anytime"
                description="Turn your social media presence into a powerful sales channel. Set up once, sell everywhere - no coding, no API integration, just pure social selling magic."
                features={[
                  "Sell on WhatsApp, Instagram, Facebook, TikTok, Jiji and any social platform",
                  "Share product links or QR Codes that work across all social media channels",
                  "Dont worry about logistics, we have partners that make that so easy, just list and rest",
                  "Secure payment collection with escrow protection for buyers",
                  "No technical knowledge required - just create your store and start sharing",
                  "Real-time inventory sync across all your social selling channels",
                ]}
                buttonText="Start Social Selling"
                buttonLink="/business/onboard"
                imageSrc="/images/business/consumer-app.png"
                imageAlt="Social commerce seller sharing products on social media"
                imageRight
              />
            </div>

            <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.3s" }}>
              <TargetSection
                id="consumers"
                title="For Consumers"
                description="Make secure escrow payments, manage your finances, and participate in social saving groups with complete peace of mind."
                features={[
                  "Escrow payments for secure transactions - never be scammed again",
                  "Track and manage your payments in real-time",
                  "Join social saving groups with friends in protected environments",
                  "Send and receive money securely across platforms",
                  "Transfer money to non-users through escrow or normal transfers",
                ]}
                buttonText="Download App"
                buttonLink="#download"
                imageSrc="/images/business/consumer.png"
                imageAlt="Consumer using Piaxe mobile app for secure payments"
              />
            </div>

            <div className="glass-card-secondary animate-glass-appear" style={{ animationDelay: "0.4s" }}>
              <TargetSection
                id="developers"
                title="For Online Businesses & Developers"
                description="Integrate our robust API to process payments, disburse funds, and offer escrow services to your users."
                features={[
                  "RESTful API for accepting and disbursing payments",
                  "Escrow payment API with customizable terms for secure transactions",
                  "Multi-channel payment collection (cards, mobile money, banks)",
                  "Payment requests that can accept from anyone or specific users",
                  "Webhook support for real-time notifications and comprehensive SDKs",
                ]}
                buttons={[
                  {
                    text: "Explore API",
                    link: "https://piaxe.jettts.com/api/docs/",
                    external: true
                  },
                  {
                    text: "Register as Developer",
                    link: "/auth/developer-register",
                    variant: "outline"
                  }
                ]}
                imageSrc="/images/business/developer-api.png"
                imageAlt="Developer integrating Piaxe API"
                imageRight
              />
            </div>
          </div>
        </section>

        <div className="glass-card-large animate-glass-appear" style={{ animationDelay: "0.5s" }}>
          <Testimonials />
        </div>
      </div>
    </div>
  )
}
