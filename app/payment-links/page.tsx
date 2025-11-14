import { Metadata } from 'next'
import { PaymentLinksSharedCarts } from '@/components/payment-links-shared-carts'

export const metadata: Metadata = {
    title: 'Payment Links & Shared Carts - Piaxis',
    description: 'Create payment links and shared carts for collaborative payments with friends and customers',
}

// Force dynamic rendering since the component uses client-side code
export const dynamic = 'force-dynamic'

export default function PaymentLinksPage() {
    return <PaymentLinksSharedCarts />
}
