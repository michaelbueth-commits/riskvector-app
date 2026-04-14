import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    name: 'RiskVector — Reise-Sicherheit',
    short_name: 'RiskVector',
    description: 'Echtzeit-Risikoanalyse für 195 Länder',
    start_url: '/',
    display: 'standalone',
    background_color: '#030714',
    theme_color: '#6366f1',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }, { headers: { 'Content-Type': 'application/manifest+json' } })
}
