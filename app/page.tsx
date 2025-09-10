import { HeroSection } from "@/components/hero-section"
import { MobileWalletPreview } from "@/components/mobile-wallet-preview"
import { TargetSection } from "@/components/target-section"
import { SecurityFeatures } from "@/components/security-features"
import { Testimonials } from "@/components/testimonials"
import { BarcodePaymentDemo } from "@/components/barcode-payment-demo"
import { FAQs } from "@/components/faqs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 relative overflow-hidden">
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is piaxis and how does it work?',
                acceptedAnswer: { '@type': 'Answer', text: 'piaxis is a modern fintech platform that enables secure payments, escrow services, and social commerce. We provide payment processing for businesses, secure escrow transactions for consumers, and API services for developers to integrate payments into their applications.' }
              },
              {
                '@type': 'Question',
                name: 'How secure are escrow payments on piaxis?',
                acceptedAnswer: { '@type': 'Answer', text: 'Our escrow service acts as a trusted intermediary, holding funds securely until both parties fulfill their obligations. This eliminates fraud risk; all transactions are encrypted and monitored.' }
              },
              {
                '@type': 'Question',
                name: 'Can I sell products on social media using piaxis?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Our social commerce feature lets you sell on popular platforms using product links with built-in payment processing.' }
              },
              {
                '@type': 'Question',
                name: 'What payment methods does piaxis support?',
                acceptedAnswer: { '@type': 'Answer', text: 'We support mobile money wallets, bank transfers, cards, and digital payment platforms.' }
              },
              {
                '@type': 'Question',
                name: 'How do social saving groups work?',
                acceptedAnswer: { '@type': 'Answer', text: 'Social saving groups let you save with friends in a protected environment with transparent contribution tracking and rule governance.' }
              }
            ]
          })
        }}
      />
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
                buttonLink="/business/onboard"
                imageSrc="/images/business/sme-business.png"
                imageAlt="SME business owner using piaxis dashboard"
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
                buttonLink="#mobile-preview"
                imageSrc="/images/business/consumer.png"
                imageAlt="Consumer using piaxis mobile app for secure payments"
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
                    link: "https://api.piaxe.me/api/docs/",
                    external: true
                  },
                  {
                    text: "Register as Developer",
                    link: "/auth/developer-register",
                    variant: "outline"
                  }
                ]}
                imageSrc="/images/business/developer-api.png"
                imageAlt="Developer integrating piaxis API"
                imageRight
              />
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="container mx-auto px-4 py-8 sm:py-12">
          <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.4s" }}>
            <div className="text-center max-w-3xl mx-auto p-8 sm:p-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need Help?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our comprehensive support center is here to help you succeed. From quick answers to personalized assistance, we've got you covered.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground">Instant answers to common questions</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Live Support</h3>
                  <p className="text-sm text-muted-foreground">Get help from our expert team</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground">Complete guides and tutorials</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/support"
                  className="glass-button-primary px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Visit Support Center
                </a>
                <a
                  href="/support#new-ticket"
                  className="glass-button-secondary px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Create Support Ticket
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="glass-card-large animate-glass-appear" style={{ animationDelay: "0.5s" }}>
          <Testimonials />
        </div>

        <div className="animate-glass-appear" style={{ animationDelay: "0.6s" }}>
          <FAQs />
        </div>
      </div>
    </div>
  )
}
