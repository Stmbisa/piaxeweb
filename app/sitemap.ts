import { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = absoluteUrl()
  const lastModified = new Date()

  // Only include publicly indexable marketing pages (avoid auth/reset/dashboard & fragments)
  const urls: string[] = [
    '', // root
    '/about',
    '/developers',
    '/escrow',
    '/payment-links',
    '/savings',
    '/support'
  ]

  return urls.map(path => ({
  url: `${baseUrl}${path}`.replace(/(?<!:)\/\//g,'/'),
    lastModified,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))
}
