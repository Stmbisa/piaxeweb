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
                <section className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Revolutionizing Payments in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Low Trust Environments
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        Piaxe is a comprehensive payment system designed specifically for Uganda and East Africa,
                        where trust between parties can be limited. We provide escrow protection, POS-free payments,
                        and complete business management tools all in one secure platform.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">
                            Join Our Mission
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">
                            Contact Us
                        </Button>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="grid md:grid-cols-2 gap-12 mb-16">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Heart className="w-6 h-6 text-primary" />
                                Our Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                To eliminate payment fraud and build trust in digital transactions across Uganda and East Africa
                                by providing secure escrow services, innovative payment solutions, and comprehensive business tools
                                that empower consumers, SMEs, and online businesses to transact with confidence.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Globe className="w-6 h-6 text-secondary" />
                                Our Vision
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                To become the leading payment ecosystem in East Africa, where every transaction is secure,
                                every business has access to modern payment tools, and trust is the foundation of all
                                digital commerce interactions.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Core Values */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                                <CardTitle>Security First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Every transaction is protected with bank-level security and escrow protection
                                    to ensure your money is safe until terms are fulfilled.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                                <CardTitle>Community Focused</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We build solutions for our local communities, understanding the unique
                                    challenges and needs of businesses and consumers in Uganda.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-none shadow-lg">
                            <CardHeader>
                                <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                <CardTitle>Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We continuously innovate to provide cutting-edge payment solutions
                                    that are simple to use yet powerful in functionality.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Problem We Solve */}
                <section className="mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">The Problem We Solve</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary">Payment Fraud & Scams</h3>
                                <p className="text-muted-foreground">
                                    In Uganda, payment fraud and scams are common, especially in online transactions.
                                    People lose money to dishonest sellers and buyers regularly.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary">Limited Payment Infrastructure</h3>
                                <p className="text-muted-foreground">
                                    Small businesses struggle with expensive POS systems and complex payment processing,
                                    limiting their ability to accept digital payments.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary">Trust Issues</h3>
                                <p className="text-muted-foreground">
                                    Low trust between buyers and sellers makes it difficult to conduct business,
                                    especially for high-value transactions or with new partners.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary">Business Management Complexity</h3>
                                <p className="text-muted-foreground">
                                    SMEs lack access to affordable, integrated tools for managing inventory,
                                    customer relationships, and payment processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Solution */}
                <section className="mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Our Solution</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="text-lg">Escrow Protection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        We hold payments securely until both parties fulfill their obligations,
                                        eliminating fraud and building trust.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-secondary">
                                <CardHeader>
                                    <CardTitle className="text-lg">POS-Free Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Businesses can accept payments using just a mobile phone and QR codes,
                                        eliminating the need for expensive POS systems.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-500">
                                <CardHeader>
                                    <CardTitle className="text-lg">Complete Business Tools</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Free CRM, inventory management, payment processing, and online store
                                        setup all in one integrated platform.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Impact */}
                <section className="mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                                <p className="text-muted-foreground">Businesses Protected</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-secondary mb-2">₦2B+</div>
                                <p className="text-muted-foreground">Transactions Secured</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">99.9%</div>
                                <p className="text-muted-foreground">Fraud Prevention Rate</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                                <p className="text-muted-foreground">Support Available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Built by Ugandans, for Uganda</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Our team understands the local market, payment behaviors, and business challenges
                            because we live and work in the same environment as our users.
                        </p>
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-8">
                                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-4">Recognized Excellence</h3>
                                <p className="text-muted-foreground">
                                    Piaxe has been recognized by leading fintech organizations and startup accelerators
                                    for our innovative approach to solving payment challenges in emerging markets.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center bg-primary/5 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Join the Payment Revolution</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Whether you're a consumer looking for secure payments, a business wanting to grow,
                        or a developer building the next big thing, Piaxe has the tools you need.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">
                            Get Started Today
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">
                            Contact Our Team
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    )
}
