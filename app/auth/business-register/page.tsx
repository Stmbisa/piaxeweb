import { BusinessRegisterForm } from "@/components/auth/business-register-form"

// Force dynamic rendering since this page uses client-side code
export const dynamic = 'force-dynamic'

export default function BusinessRegisterPage() {
    return <BusinessRegisterForm />
}
