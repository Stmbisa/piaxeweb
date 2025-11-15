import type { Metadata } from 'next'
import { SocialSavingGroups } from '@/components/social-saving-groups'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Social Saving Groups',
  description: 'Join or create saving groups with friends for shared goals. Protected with transparent, rule‑based escrow.',
  path: '/savings',
  keywords: ['savings groups','chama app','village savings','trusted group payments']
})

// Force dynamic rendering since the component uses client-side code
export const dynamic = 'force-dynamic'

export default function SocialSavingGroupsPage() {
  return <SocialSavingGroups />
}
