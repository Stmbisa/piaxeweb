import { DeveloperRegisterForm } from "@/components/auth/developer-register-form"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function DeveloperRegisterPage() {
    return <DeveloperRegisterForm />
}
