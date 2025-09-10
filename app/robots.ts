import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/business/dashboard/*',
          '/developer/dashboard/*',
          '/api/*',
          '/admin/*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/business/dashboard/*',
          '/developer/dashboard/*',
          '/api/*'
        ],
      }
    ],
    sitemap: 'https://gopiaxis.com/sitemap.xml',
    host: 'https://gopiaxis.com',
  }
}
