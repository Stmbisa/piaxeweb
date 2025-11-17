import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Sign In',
    description: 'Sign in to your Piaxis account to manage payments, escrow, and devices.',
    path: '/auth/login',
    keywords: ['piaxis login','account sign in','merchant login']
})

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function LoginPage() {
    return (
        <div className="bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
                    <LoginForm redirectTo="/dashboard" />
                </div>
            </div>
        </div>
    )
}
