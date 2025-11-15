import { BusinessRegisterForm } from "@/components/auth/business-register-form"
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Merchant Registration',
    description: 'Create your merchant account to accept POS‑free payments, links, and escrow.',
    path: '/auth/business-register',
    keywords: ['merchant register','create shop','piaxis onboarding']
})

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function BusinessRegisterPage() {
    return <BusinessRegisterForm />
}
