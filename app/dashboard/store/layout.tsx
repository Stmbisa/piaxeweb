import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Store Dashboard | Piaxe',
    description: 'Manage your store inventory, customers, marketing campaigns, and payment settings.',
}

export default function StoreDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
