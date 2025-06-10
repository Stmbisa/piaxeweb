import { HeroSection } from "@/components/hero-section"
import { MobileWalletPreview } from "@/components/mobile-wallet-preview"
import { TargetSection } from "@/components/target-section"
import { SecurityFeatures } from "@/components/security-features"
import { Testimonials } from "@/components/testimonials"
import { BarcodePaymentDemo } from "@/components/barcode-payment-demo"

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <MobileWalletPreview />
      <BarcodePaymentDemo />
      <SecurityFeatures />

      <section className="container mx-auto px-4 py-4 sm:py-6 space-y-8">
        <div className="grid gap-6 sm:gap-8 lg:gap-10">
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
            imageRight
          />

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
          />
        </div>
      </section>

      <Testimonials />
    </div>
  )
}
