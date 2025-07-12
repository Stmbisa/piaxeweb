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
        hostname: 'piaxe.com',
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
  disable: process.env.NODE_ENV === 'development',
  // disable:true, // always disable pwa before build,
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  swcMinify: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    disableDevLogs: true,
    exclude: [/middleware-manifest\.json$/, /build-manifest\.json$/, /_buildManifest\.js$/],
    maximumFileSizeToCacheInBytes: 5000000,
  }
})(nextConfig)
