import type { Metadata } from 'next'
import { PaymentLinksSharedCarts } from '@/components/payment-links-shared-carts'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Payment Links & Shared Carts',
    description: 'Create secure payment links and shared carts for collaborative payments with escrow protection.',
    path: '/payment-links',
    keywords: ['payment links','shared carts','group checkout','escrow links']
})

// Force dynamic rendering since the component uses client-side code
export const dynamic = 'force-dynamic'

export default function PaymentLinksPage() {
    return <PaymentLinksSharedCarts />
}
