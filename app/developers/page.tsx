import { Metadata } from 'next'
import { DeveloperPortal } from '@/components/developer-portal'

export const metadata: Metadata = {
    title: 'Developer Portal - piaxis API',
    description: 'Access piaxis API documentation, manage your API keys, and integrate payment solutions',
}

export default function DeveloperPortalPage() {
    return <DeveloperPortal />
}
