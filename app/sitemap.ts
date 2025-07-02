import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://piaxe.com'
  const lastModified = new Date()

  return [
    // Main pages
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // FAQ section anchor
    {
      url: `${baseUrl}/#faqs`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Authentication pages
    {
      url: `${baseUrl}/auth/register`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/business-register`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/developer-register`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.9,
    },

    // Main product pages
    {
      url: `${baseUrl}/developers`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/escrow`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/payment-links`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/savings`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Dashboard pages (public landing sections)
    {
      url: `${baseUrl}/dashboard`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/business/dashboard`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/developer/dashboard`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Business onboarding
    {
      url: `${baseUrl}/business/onboard`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Password reset pages
    {
      url: `${baseUrl}/auth/developer-api-key-reset`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/developer-client-id-reset`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/merchant-api-key-reset`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/merchant-client-id-reset`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]
}
