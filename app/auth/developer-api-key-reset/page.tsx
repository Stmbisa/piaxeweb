import { MerchantApiKeyResetForm } from '@/components/auth/merchant-api-key-reset-form'
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Reset API Key',
    description: 'Reset your Piaxis developer API key securely.',
    path: '/auth/developer-api-key-reset',
    keywords: ['reset api key','developer credentials']
})

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function DeveloperApiKeyResetPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 p-4">
            <div className="w-full max-w-md">
                <MerchantApiKeyResetForm />
            </div>
        </div>
    )
}
