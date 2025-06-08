import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Business Login | Piaxe',
  description: 'Login to your Piaxe business account to manage payments, inventory, and customers.',
}

export default function MerchantLoginPage() {
  // Redirect to regular login since merchants use the same authentication
  redirect('/auth/login?message=Please login with your regular account to access business features')
}
