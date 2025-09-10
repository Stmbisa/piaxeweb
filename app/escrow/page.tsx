import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EscrowFulfillment } from '@/components/escrow-fulfillment'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Escrow Management | piaxis',
    description: 'Manage escrow transactions for unregistered users with secure payment protection.',
}

export default function EscrowPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gopiaxis.com/' },
                            { '@type': 'ListItem', position: 2, name: 'Escrow', item: 'https://gopiaxis.com/escrow' }
                        ]
                    })
                }}
            />
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Escrow Management
                        </h1>
                        <p className="text-muted-foreground">
                            Secure payment protection for transactions with unregistered users
                        </p>
                    </div>
                    <EscrowFulfillment />
                </div>
            </main>
            <Footer />
        </div>
    )
}
