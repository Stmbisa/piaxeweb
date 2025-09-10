import type { Metadata } from 'next'
import { siteConfig, absoluteUrl, defaultImages } from './seo'

interface GenerateOptions {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  noIndex?: boolean
}

export function generatePageMetadata(opts: GenerateOptions = {}): Metadata {
  const fullUrl = absoluteUrl(opts.path || '')
  const title = opts.title ? `${opts.title} | ${siteConfig.name}` : `${siteConfig.name}`
  const description = opts.description || siteConfig.description
  const keywords = Array.from(new Set([...(opts.keywords || []), ...siteConfig.keywords]))

  return {
    title,
    description,
    keywords,
    alternates: { canonical: fullUrl },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: defaultImages(),
      locale: 'en_UG',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/images/twitter-image.png')],
      site: siteConfig.twitter
    },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
  }
}
