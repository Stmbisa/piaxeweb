import { Metadata } from 'next'
import { SocialSavingGroups } from '@/components/social-saving-groups'

export const metadata: Metadata = {
  title: 'Social Saving Groups - Piaxe',
  description: 'Join or create saving groups with friends and family for shared financial goals',
}

// Force dynamic rendering since the component uses client-side code
export const dynamic = 'force-dynamic'

export default function SocialSavingGroupsPage() {
  return <SocialSavingGroups />
}
