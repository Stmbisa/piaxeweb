import { DeveloperRegisterForm } from "@/components/auth/developer-register-form"
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Developer Registration',
    description: 'Register as a developer to generate API keys and start integrating Piaxis payments.',
    path: '/auth/developer-register',
    keywords: ['developer register','api key','piaxis developer']
})

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function DeveloperRegisterPage() {
    return <DeveloperRegisterForm />
}
