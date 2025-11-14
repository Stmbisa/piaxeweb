import withPWA from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gopiaxis.com',
      },
    ],
  },
  output: 'standalone',
  // Add headers for PWA optimization
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
}

// Enhanced PWA configuration for better app store compatibility
export default withPWA({
  dest: 'public',
  disable: true, // temporarily disable build-time PWA to avoid Next 15 prerender crash
  register: true,
  skipWaiting: true,
})(nextConfig)