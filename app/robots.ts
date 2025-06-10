import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/business/', '/developer/', '/payment-links/', '/savings/'],
    },
    sitemap: 'https://piaxe.com/sitemap.xml',
  }
}
