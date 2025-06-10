import type { Metadata } from "next"
import { Shield, Users, Zap, Globe, Heart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Piaxe's mission to revolutionize payments in low trust environments across Uganda and East Africa with secure escrow solutions and innovative fintech.",
    openGraph: {
        title: "About Piaxe - Revolutionizing Secure Payments",
        description: "Discover how Piaxe is transforming payment systems in Uganda with escrow protection, POS-free solutions, and comprehensive business tools.",
    }
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
                        Revolutionizing Payments in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Low Trust Environments
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-8 px-4">
                        Piaxe is a comprehensive payment system designed specifically for Uganda and East Africa,
                        where trust between parties can be limited. We provide escrow protection, POS-free payments,
                        and complete business management tools all in one secure platform.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4">
                        <Button size="lg" className="rounded-full px-6 md:px-8 w-full sm:w-auto">
                            Join Our Mission
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-6 md:px-8 w-full sm:w-auto">
                            Contact Us
                        </Button>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 px-4">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                Our Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                To eliminate payment fraud and build trust in digital transactions across Uganda and East Africa
                                by providing secure escrow services, innovative payment solutions, and comprehensive business tools
                                that empower consumers, SMEs, and online businesses to transact with confidence.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                                <Globe className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                                Our Vision
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                To become the leading payment ecosystem in East Africa, where every transaction is secure,
                                every business has access to modern payment tools, and trust is the foundation of all
                                digital commerce interactions.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Core Values */}
                <section className="mb-12 md:mb-16 px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                                <CardTitle className="text-lg md:text-xl">Security First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Every transaction is protected with bank-level security and escrow protection
                                    to ensure your money is safe until terms are fulfilled.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Users className="w-10 h-10 md:w-12 md:h-12 text-secondary mx-auto mb-3 md:mb-4" />
                                <CardTitle className="text-lg md:text-xl">Community Focused</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    We build solutions for our local communities, understanding the unique
                                    challenges and needs of businesses and consumers in Uganda.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Zap className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-3 md:mb-4" />
                                <CardTitle className="text-lg md:text-xl">Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    We continuously innovate to provide cutting-edge payment solutions
                                    that are simple to use yet powerful in functionality.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Problem We Solve */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">The Problem We Solve</h2>
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-lg md:text-xl font-semibold text-primary">Payment Fraud & Scams</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    In Uganda, payment fraud and scams are common, especially in online transactions.
                                    People lose money to dishonest sellers and buyers regularly.
                                </p>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-lg md:text-xl font-semibold text-primary">Limited Payment Infrastructure</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Small businesses struggle with expensive POS systems and complex payment processing,
                                    limiting their ability to accept digital payments.
                                </p>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-lg md:text-xl font-semibold text-primary">Trust Issues</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Low trust between buyers and sellers makes it difficult to conduct business,
                                    especially for high-value transactions or with new partners.
                                </p>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-lg md:text-xl font-semibold text-primary">Business Management Complexity</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    SMEs lack access to affordable, integrated tools for managing inventory,
                                    customer relationships, and payment processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Solution */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Our Solution</h2>
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="text-base md:text-lg">Escrow Protection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-xs md:text-sm">
                                        We hold payments securely until both parties fulfill their obligations,
                                        eliminating fraud and building trust.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-secondary">
                                <CardHeader>
                                    <CardTitle className="text-base md:text-lg">POS-Free Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-xs md:text-sm">
                                        Businesses can accept payments using just a mobile phone and QR codes,
                                        eliminating the need for expensive POS systems.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-500">
                                <CardHeader>
                                    <CardTitle className="text-base md:text-lg">Complete Business Tools</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-xs md:text-sm">
                                        Free CRM, inventory management, payment processing, and online store
                                        setup all in one integrated platform.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Impact */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Our Impact</h2>
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
                </section>

                {/* Team Section */}
                <section className="mb-12 md:mb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Built by Ugandans, for Uganda</h2>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                            Our team understands the local market, payment behaviors, and business challenges
                            because we live and work in the same environment as our users.
                        </p>
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 md:p-8">
                                <Award className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-3 md:mb-4" />
                                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Recognized Excellence</h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Piaxe has been recognized by leading fintech organizations and startup accelerators
                                    for our innovative approach to solving payment challenges in emerging markets.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center bg-primary/5 rounded-2xl md:rounded-3xl p-8 md:p-12 mx-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Join the Payment Revolution</h2>
                    <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                        Whether you're a consumer looking for secure payments, a business wanting to grow,
                        or a developer building the next big thing, Piaxe has the tools you need.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                        <Button size="lg" className="rounded-full px-6 md:px-8 w-full sm:w-auto">
                            Get Started Today
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-6 md:px-8 w-full sm:w-auto">
                            Contact Our Team
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    )
}
