import type { Metadata } from "next"
import { generatePageMetadata } from '@/lib/metadata'
import { Shield, Users, Zap, Globe, Heart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = generatePageMetadata({
    title: 'About Piaxis',
    description: "Learn about Piaxis's mission to disrupt payments across Africa and low trust environments with secure escrow solutions and innovative fintech features.",
    path: '/about',
    keywords: ['about Piaxis', 'Piaxis mission']
})

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gopiaxis.com/' },
                            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://gopiaxis.com/about' }
                        ]
                    })
                }}
            />
            {/* Background glass orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

            <main className="relative z-10 container mx-auto px-4 py-12">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mx-auto mb-12 md:mb-16 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
                        Rebuilding commerce on programmable trust.
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-8 px-4">
                        Piaxis turns payments into programmable trust — escrow with delivery, geo, approval, time & rating conditions; POS‑free checkout; social selling; fundraising caps; payroll escrow; remote cart pay; restricted spend remittance; credit lines; APIs. We started in Uganda and East Africa and are expanding quickly.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4">
                        <button className="glass-button-primary rounded-full px-6 md:px-8 py-3 w-full sm:w-auto">
                            Join Our Mission
                        </button>
                        <button className="glass-button-secondary rounded-full px-6 md:px-8 py-3 w-full sm:w-auto">
                            Contact Us
                        </button>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 px-4">
                    <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "0.1s" }}>
                        <div className="flex items-center gap-3 text-xl md:text-2xl mb-4">
                            <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                            <h3 className="font-semibold text-primary-foreground">Our Mission</h3>
                        </div>
                        <p className="text-primary-foreground/80 leading-relaxed text-sm md:text-base">
                            To eliminate payment fraud and build trust in digital transactions across Uganda and East Africa
                            by providing secure escrow services, innovative payment solutions, and comprehensive business tools
                            that empower consumers, SMEs, and online businesses to transact with confidence.
                        </p>
                    </div>

                    <div className="glass-card-secondary animate-glass-appear" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center gap-3 text-xl md:text-2xl mb-4">
                            <Globe className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
                            <h3 className="font-semibold text-secondary-foreground">Our Vision</h3>
                        </div>
                        <p className="text-secondary-foreground/80 leading-relaxed text-sm md:text-base">
                            To become the leading payment ecosystem in East Africa, where every transaction is secure,
                            every business has access to modern payment tools, and trust is the foundation of all
                            digital commerce interactions.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mb-12 md:mb-16 px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        <div className="glass-card text-center animate-glass-appear" style={{ animationDelay: "0.3s" }}>
                            <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">Security First</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Every transaction is protected with bank-level security and escrow protection
                                to ensure your money is safe until terms are fulfilled.
                            </p>
                        </div>

                        <div className="glass-card text-center animate-glass-appear" style={{ animationDelay: "0.4s" }}>
                            <Users className="w-10 h-10 md:w-12 md:h-12 text-secondary mx-auto mb-3 md:mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">Community Focused</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                We build solutions for our local communities, understanding the unique
                                challenges and needs of businesses and consumers in Uganda.
                            </p>
                        </div>

                        <div className="glass-card text-center animate-glass-appear" style={{ animationDelay: "0.5s" }}>
                            <Zap className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-3 md:mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">Innovation</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                We continuously innovate to provide cutting-edge payment solutions
                                that are simple to use yet powerful in functionality.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trust Tax (Problem) from spec */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">The Trust Tax</h2>
                        <p className="text-muted-foreground mb-6">Scams as % of online volume, hours lost to reconciliation, and the capex of legacy hardware — the hidden tax on commerce we are removing.</p>
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.6s" }}>
                                <h3 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">Payment Fraud & Scams</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    In Uganda, payment fraud and scams are common, especially in online transactions.
                                    People lose money to dishonest sellers and buyers regularly.
                                </p>
                            </div>
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.7s" }}>
                                <h3 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">Limited Payment Infrastructure</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Small businesses struggle with expensive POS systems and complex payment processing,
                                    limiting their ability to accept digital payments.
                                </p>
                            </div>
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.8s" }}>
                                <h3 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">Trust Issues</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Low trust between buyers and sellers makes it difficult to conduct business,
                                    especially for high-value transactions or with new partners.
                                </p>
                            </div>
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "0.9s" }}>
                                <h3 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">Business Management Complexity</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    SMEs lack access to affordable, integrated tools for managing inventory,
                                    customer relationships, and payment processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mechanism vs Traditional comparison (spec) */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-foreground">Mechanism vs Traditional</h2>
                        <div className="overflow-hidden rounded-xl border border-border/40">
                            <table className="min-w-full divide-y divide-border/40 glass-card">
                                <thead className="bg-background/60">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dimension</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gateway</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legacy POS</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Piaxis</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    <tr>
                                        <td className="px-4 py-3 text-sm">Settlement Control</td>
                                        <td className="px-4 py-3 text-sm">Blind</td>
                                        <td className="px-4 py-3 text-sm">Hardware dependent</td>
                                        <td className="px-4 py-3 text-sm font-medium">Programmable conditions</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">Channels</td>
                                        <td className="px-4 py-3 text-sm">Online only</td>
                                        <td className="px-4 py-3 text-sm">In-store only</td>
                                        <td className="px-4 py-3 text-sm font-medium">Unified omni-channel</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">Fraud Mitigation</td>
                                        <td className="px-4 py-3 text-sm">Reactive</td>
                                        <td className="px-4 py-3 text-sm">Manual</td>
                                        <td className="px-4 py-3 text-sm font-medium">Preventive conditional locking</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">Remote Cart</td>
                                        <td className="px-4 py-3 text-sm">No</td>
                                        <td className="px-4 py-3 text-sm">No</td>
                                        <td className="px-4 py-3 text-sm font-medium">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">Restricted Spend</td>
                                        <td className="px-4 py-3 text-sm">No</td>
                                        <td className="px-4 py-3 text-sm">No</td>
                                        <td className="px-4 py-3 text-sm font-medium">Yes</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Impact */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Our Impact</h2>
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "1.3s" }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">---+</div>
                                    <p className="text-muted-foreground text-xs md:text-sm">Businesses Protected</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-secondary mb-2">UGX---</div>
                                    <p className="text-muted-foreground text-xs md:text-sm">Transactions Secured</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">99.9%</div>
                                    <p className="text-muted-foreground text-xs md:text-sm">Fraud Prevention Rate</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">24/7</div>
                                    <p className="text-muted-foreground text-xs md:text-sm">Support Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Local Roots & Compliance */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-foreground">Local Roots & Compliance</h2>
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            <div className="glass-card-primary animate-glass-appear" style={{ animationDelay: "1.35s" }}>
                                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Regulatory Posture</h3>
                                <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">We align with regional KYC/AML guidelines and follow emerging digital financial services frameworks. Data residency and privacy safeguards are built into core flows.</p>
                            </div>
                            <div className="glass-card-secondary animate-glass-appear" style={{ animationDelay: "1.4s" }}>
                                <h3 className="text-lg font-semibold mb-2 text-secondary-foreground">Data Handling</h3>
                                <p className="text-xs md:text-sm text-secondary-foreground/80 leading-relaxed">Sensitive payment details are tokenized; device binding adds another trust layer. We avoid unnecessary storage of personally identifiable information.</p>
                            </div>
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "1.45s" }}>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Community Partnership</h3>
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">We pilot features with local merchants and savings groups—iterating with real-world feedback to reduce friction and increase trust adoption.</p>
                            </div>
                            <div className="glass-card animate-glass-appear" style={{ animationDelay: "1.5s" }}>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Reliability & Status</h3>
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">Public latency & uptime metrics are on the roadmap along with a transparent incident status page for merchants and developers.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roadmap Highlights */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-5xl mx-auto glass-card-primary p-6 md:p-10 animate-glass-appear" style={{ animationDelay: "1.55s" }}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">Roadmap Highlights</h2>
                        <p className="text-sm md:text-base text-primary-foreground/80 mb-6">A glimpse at what the next three quarters unlock for programmable trust.</p>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="glass-card bg-white/10 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">Q1</h3>
                                <ul className="space-y-1 text-xs opacity-80 list-disc list-inside">
                                    <li>Condition Builder UI</li>
                                    <li>Public Metrics Endpoint</li>
                                    <li>Developer Webhooks</li>
                                </ul>
                            </div>
                            <div className="glass-card bg-white/10 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">Q2</h3>
                                <ul className="space-y-1 text-xs opacity-80 list-disc list-inside">
                                    <li>Credit Line Pilot</li>
                                    <li>Savings Groups Constitution</li>
                                    <li>Status Page + SLA</li>
                                </ul>
                            </div>
                            <div className="glass-card bg-white/10 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">Q3</h3>
                                <ul className="space-y-1 text-xs opacity-80 list-disc list-inside">
                                    <li>Adaptive Persona Hero</li>
                                    <li>Advanced Restricted Spend</li>
                                    <li>SDK bundle release</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Built by Africans, for Africa</h2>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                            Our team understands the local market, payment behaviors, and business challenges
                            because we live and work in the same environment as our users.
                        </p>
                        <div className="glass-card animate-glass-appear" style={{ animationDelay: "1.4s" }}>
                            <Award className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-3 md:mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">Recognized Excellence</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Piaxis has been recognized by leading fintech organizations and startup accelerators
                                for our innovative approach to solving payment challenges in emerging markets.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission CTA Cluster */}
                <section className="glass-card-primary mx-4 animate-glass-appear" style={{ animationDelay: "1.6s" }}>
                    <div className="text-center p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary-foreground">Join The Mission</h2>
                        <p className="text-base md:text-lg text-primary-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto">
                            Consumers, merchants, developers, communities—help build commerce where funds only move when reality matches.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <a href="/auth/register" className="glass-button-primary rounded-xl px-4 py-4 text-sm font-medium">Start Protected Payment</a>
                            <a href="/business/onboard" className="glass-button-secondary rounded-xl px-4 py-4 text-sm font-medium">Create Shop</a>
                            <a href="/auth/developer-register" className="glass-button rounded-xl px-4 py-4 text-sm font-medium bg-white/10">Generate API Key</a>
                            <a href="/payment-links" className="glass-button rounded-xl px-4 py-4 text-sm font-medium bg-white/5">Launch Campaign</a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
