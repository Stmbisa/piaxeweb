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
  },
  output: 'standalone',
}

// Re-enable PWA with better configuration
export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // disable: true, // disable PWA termporaly to build everytime
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  swcMinify: true,
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    disableDevLogs: true,
    exclude: [/middleware-manifest\.json$/],
  }
})(nextConfig)
