import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account | Piaxe',
    description: 'Create your Piaxe account to start making secure payments and managing transactions.',
}

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function RegisterPage() {
    return (
        <div className="bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
                    <RegisterForm redirectTo="/dashboard" />
                </div>
            </div>
        </div>
    )
}
