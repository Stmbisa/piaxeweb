import type { Metadata } from 'next'
import { SupportCenter } from '@/components/support/support-center'
import { generatePageMetadata } from '@/lib/metadata'
import { absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata({
    title: 'Support Center',
    description: 'Get help with your Piaxis account, escrow payments, and integrations. Browse the knowledge base or open a ticket.',
    path: '/support',
    keywords: ['piaxis support','help center','open ticket','payment issues','escrow help']
})

export default function SupportPage() {
        return (
                <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'BreadcrumbList',
                                    itemListElement: [
                                        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
                                        { '@type': 'ListItem', position: 2, name: 'Support', item: absoluteUrl('/support') }
                                    ]
                                })
                            }}
                        />
                        <SupportCenter />
                </div>
        )
}
