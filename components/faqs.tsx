"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQ {
    question: string
    answer: string
    category?: string
}

const faqs: FAQ[] = [
    {
        question: "What is piaxis and how does it work?",
        answer: "piaxis is a modern fintech platform that enables secure payments, escrow services, and social commerce. We provide payment processing for businesses, secure escrow transactions for consumers, and API services for developers to integrate payments into their applications.",
        category: "General"
    },
    {
        question: "How secure are escrow payments on piaxis?",
        answer: "Our escrow service acts as a trusted intermediary, holding funds securely until both parties fulfill their obligations, obligations are set by the sender, can be location, delivery confirmation, sequential steps, multiparty approval, ... This eliminates the risk of fraud and ensures that sellers deliver goods/services before payment is released. All transactions are encrypted and monitored for security.",
        category: "Security"
    },
    {
        question: "Can I sell products on social media using piaxis?",
        answer: "Yes! Our social commerce feature allows you to sell on WhatsApp, Instagram, Facebook, TikTok, and other platforms without any technical setup. Simply create product links that work across all social media channels with built-in payment processing, you dont even have to own products yourself, just partner with someone put their locations and logistics and payments shall be handled for you.",
        category: "Business"
    },
    {
        question: "What payment methods does piaxis support?",
        answer: "We support multiple payment methods including mobile money wallets, bank transfers, debit/credit cards, and digital payment platforms. This ensures your customers can pay using their preferred method.",
        category: "Payments"
    },
    {
        question: "Is there a fee for using piaxis services?",
        answer: "We offer competitive transaction fees that vary by service type. Basic features like social saving groups have no fees, while payment processing and escrow services have small transaction fees. Contact us for detailed pricing information.",
        category: "Pricing"
    },
    {
        question: "How do social saving groups work?",
        answer: "Social saving groups let you save money with friends in a secure, protected environment. Vote rules (of withdral, of adding or removing a member), vote a governing consitution that governs the group and cant be violated,  Set savings goals, track contributions, and withdraw funds when targets are met. All group activities are transparent and secure.",
        category: "Features"
    },
    {
        question: "Can developers integrate piaxis into their applications?",
        answer: "Absolutely! We provide a comprehensive RESTful API with SDKs, webhooks, and detailed documentation. Developers can integrate payment processing, escrow services, and disbursement capabilities into their applications.",
        category: "Developer"
    },
    {
        question: "How quickly are payments processed?",
        answer: "If you are using internal its instant, but for external wallets Payment processing times vary by method: mobile money and card payments are typically instant, while bank transfers may take 1-3 business days. Escrow releases are immediate once conditions are met.",
        category: "Payments"
    },
    {
        question: "Do I need technical knowledge to start selling?",
        answer: "No technical knowledge required! Our platform is designed for everyone. Simply register, create your store, add products, and start sharing on social media. We handle all the technical aspects for you.",
        category: "Business"
    },
    {
        question: "What countries does piaxis support?",
        answer: "We currently operate in select African markets with plans for expansion. Check our website for the most current list of supported countries and payment methods available in your region.",
        category: "General"
    },
    {
        question: "How can I track my transactions and payments?",
        answer: "All users get access to a comprehensive dashboard where you can track payments, view transaction history, manage escrow agreements, and monitor your business performance with detailed analytics.",
        category: "Features"
    },
    {
        question: "What support is available if I need help?",
        answer: "We provide multiple support channels including email support, comprehensive documentation, API guides for developers, ticketing, and customer service. Business users also get priority support for critical issues.",
        category: "Support"
    }
]

interface FAQItemProps {
    faq: FAQ
    isOpen: boolean
    onToggle: () => void
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
    return (
        <div className="glass-card-enhanced border border-border/50 hover:border-primary/30 transition-all duration-300 !p-0">
            <button
                onClick={onToggle}
                className="w-full text-left p-4 sm:p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                aria-expanded={isOpen}
            >
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                    </h3>
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </button>

            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export function FAQs() {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set())
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category).filter((cat): cat is string => Boolean(cat))))]

    const filteredFAQs = selectedCategory === "All"
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory)

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index)
        } else {
            newOpenItems.add(index)
        }
        setOpenItems(newOpenItems)
    }

    return (
        <section id="faqs" className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 glass-button mb-4">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Frequently Asked Questions</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
                        Got Questions? We've Got Answers
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about our payment solutions, security features,
                        and how to get started with piaxis.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                                selectedCategory === category
                                    ? "glass-button-primary text-primary-foreground"
                                    : "glass-button text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-2.5">
                    {filteredFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            isOpen={openItems.has(index)}
                            onToggle={() => toggleItem(index)}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="glass-card-primary text-center mt-12 sm:mt-16 p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                        Still have questions?
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@piaxis.com"
                            className="glass-button-primary inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Contact Support
                        </a>
                        <a
                            href="/about"
                            className="glass-button inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-foreground rounded-lg"
                        >
                            Learn More About Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
