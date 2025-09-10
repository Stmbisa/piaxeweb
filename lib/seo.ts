// Central SEO configuration & helpers
export const siteConfig = {
  name: 'piaxis',
  description: 'piaxis offers escrow payments, POS-free payments, CRM, fundraising, and social e-commerce in one platform for Uganda, East Africa and beyond.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://piaxis.com',
  twitter: '@piaxis',
  keywords: [
    'piaxis',
    'escrow payments',
    'mobile money',
    'digital payments',
    'payment API',
    'Uganda payments',
    'East Africa fintech',
    'supply chain payments'
  ],
}

export function absoluteUrl(path = '') {
  const base = siteConfig.url.replace(/\/$/, '')
  return base + path
}

export function defaultImages() {
  return [
    {
      url: absoluteUrl('/images/og-image.png'),
      width: 1200,
      height: 630,
      alt: 'piaxis - Payment system for supply chains'
    },
  ]
}
