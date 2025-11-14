import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
    title: 'Search Results',
    description: 'Search Piaxis content and resources.',
    path: '/search'
})

export default function SearchPage() {
    return (
        <main className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Search</h1>
            <p className="text-muted-foreground mb-8">A basic placeholder search page to satisfy structured data. Implement actual search later.</p>
            <form role="search" aria-label="Site search" className="space-y-4 max-w-xl">
                <input
                    type="text"
                    name="q"
                    placeholder="Search..."
                    className="w-full border rounded-md px-3 py-2 bg-background"
                />
                <button type="submit" className="glass-button-primary px-6 py-2 rounded-full">Search</button>
            </form>
        </main>
    )
}
