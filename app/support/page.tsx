import { Metadata } from 'next'
import { SupportCenter } from '@/components/support/support-center'

export const metadata: Metadata = {
    title: 'Support Center | Piaxe',
    description: 'Get help with your Piaxe account, payments, and technical issues. Browse our knowledge base or create a support ticket.',
}

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <SupportCenter />
        </div>
    )
}
