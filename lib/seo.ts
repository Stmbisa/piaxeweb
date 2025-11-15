// Central SEO configuration & helpers
export const siteConfig = {
  name: 'Piaxis',
  description: 'Piaxis offers programmable escrow and POS‑free payments in Uganda and East Africa — conditional payments that only release when your rules are met, plus P2P and scan‑to‑pay for physical stores.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gopiaxis.com',
  twitter: '@piaxis',
  keywords: [
    'piaxis','programmable escrow uganda','conditional payments africa','pos-free checkout','scan to pay','p2p payments','social commerce payments','URA eFRIS integration API','secure online payments uganda','small business CRM','group savings app','payroll escrow service','uganda payments','east africa fintech','payment api'
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
      alt: 'Piaxis — payment system for supply chains'
    },
  ]
}
