import { Metadata } from 'next'
import { SocialSavingGroups } from '@/components/social-saving-groups'

export const metadata: Metadata = {
  title: 'Social Saving Groups - Piaxe',
  description: 'Join or create saving groups with friends and family for shared financial goals',
}

export default function SocialSavingGroupsPage() {
  return <SocialSavingGroups />
}
