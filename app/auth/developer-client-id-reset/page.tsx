import { MerchantClientIdResetForm } from '@/components/auth/merchant-client-id-reset-form'
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Reset Client ID',
    description: 'Reset your Piaxis developer Client ID securely.',
    path: '/auth/developer-client-id-reset',
    keywords: ['reset client id','developer credentials']
})

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function DeveloperClientIdResetPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 p-4">
            <div className="w-full max-w-md">
                <MerchantClientIdResetForm />
            </div>
        </div>
    )
}
