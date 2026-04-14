/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: https://*.tile.openstreetmap.org; font-src 'self'; connect-src 'self' https:; frame-src https://www.openstreetmap.org;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },
  
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  compress: true,
  poweredByHeader: false,
  generateBuildId: () => 'riskvector-1775850246',
  
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
