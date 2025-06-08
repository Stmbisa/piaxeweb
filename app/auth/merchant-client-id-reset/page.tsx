import { MerchantClientIdResetForm } from '@/components/auth/merchant-client-id-reset-form'

export default function MerchantClientIdResetPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30 p-4">
            <div className="w-full max-w-md">
                <MerchantClientIdResetForm />
            </div>
        </div>
    )
}
