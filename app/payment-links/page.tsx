import { Metadata } from 'next'
import { PaymentLinksSharedCarts } from '@/components/payment-links-shared-carts'

export const metadata: Metadata = {
    title: 'Payment Links & Shared Carts - Piaxe',
    description: 'Create payment links and shared carts for collaborative payments with friends and customers',
}

export default function PaymentLinksPage() {
    return <PaymentLinksSharedCarts />
}
