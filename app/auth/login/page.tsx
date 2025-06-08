import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In | Piaxe',
    description: 'Sign in to your Piaxe account to manage payments and transactions.',
}

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
