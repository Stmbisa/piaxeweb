import type { Metadata } from 'next'
import { DeveloperPortal } from '@/components/developer-portal'
import { generatePageMetadata } from '@/lib/metadata'
import { absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata({
    title: 'Developer Portal',
    description: 'Access Piaxis API docs, manage API keys, and integrate programmable escrow and POS‑free payments.',
    path: '/developers',
    keywords: ['piaxis api','developer portal','payment api uganda','escrow api','webhooks','sdk']
})

export default function DeveloperPortalPage() {
        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
                                { '@type': 'ListItem', position: 2, name: 'Developers', item: absoluteUrl('/developers') }
                            ]
                        })
                    }}
                />
                {/* HowTo schema for quickstart to boost dev SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'HowTo',
                            name: 'Generate a Piaxis API Key',
                            description: 'Create a developer account and generate an API key to integrate payments and escrow.',
                            step: [
                                { '@type': 'HowToStep', name: 'Register', url: absoluteUrl('/auth/developer-register') },
                                { '@type': 'HowToStep', name: 'Create API Key', url: absoluteUrl('/developers#api-keys') },
                                { '@type': 'HowToStep', name: 'Make a Test Call', url: absoluteUrl('/developers#examples') }
                            ]
                        })
                    }}
                />
                <DeveloperPortal />
            </>
        )
}
