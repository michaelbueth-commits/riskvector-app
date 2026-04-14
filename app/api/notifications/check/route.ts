import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const countries = req.nextUrl.searchParams.get('countries') || ''
  const since = req.nextUrl.searchParams.get('since') || new Date(Date.now() - 3600000).toISOString()
  
  if (!countries) {
    return NextResponse.json({ alerts: [] })
  }

  const countryList = countries.split(',').map(c => c.trim()).filter(Boolean)
  const alerts: any[] = []

  for (const country of countryList) {
    try {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/alerts?country=${encodeURIComponent(country)}&since=${encodeURIComponent(since)}`, {
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const data = await res.json()
        const items = data.alerts || data || []
        if (Array.isArray(items)) {
          alerts.push(...items.slice(0, 5).map((a: any) => ({
            country,
            title: a.title || a.headline || 'Neue Warnung',
            severity: a.severity || 'medium',
            url: a.url || '',
          })))
        }
      }
    } catch {}
  }

  return NextResponse.json({ alerts, checkedAt: new Date().toISOString() })
}
