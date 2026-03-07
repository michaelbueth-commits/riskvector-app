import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#7C2D12',
        },
        brand: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          dark: '#0F172A',
        },
      },
    },
  },
  plugins: [],
}
export default config
