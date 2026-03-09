/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Vercel-specific optimizations
  poweredByHeader: false,
  generateBuildId: () => 'riskvector-prod',
  
  // Performance optimizations
  compress: true,
  images: {
    domains: [
      'riskvector.app',
      'localhost',
      'vercel.com',
      'assets.vercel.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel-insights.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' vercel-insights.vercel.app;",
          },
        ],
      },
    ]
  },

  // Redirect configuration for riskvector.app
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig