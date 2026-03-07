import { NextResponse } from 'next/server'
import { fetchAllRealAlerts, getAlertStats } from '@/lib/alertsService'

// Real alerts endpoint - fetches from GDACS, USGS, NOAA, etc.
export async function GET() {
  try {
    // Fetch real alerts from all sources
    const alerts = await fetchAllRealAlerts()
    
    // Get statistics
    const stats = getAlertStats(alerts)
    
    return NextResponse.json({
      alerts: alerts.slice(0, 50), // Return latest 50 alerts
      stats: {
        total: stats.total,
        critical: stats.critical,
        high: stats.high,
        medium: stats.medium,
        low: stats.low,
        categories: stats.byCategory,
        countries: stats.byCountry
      },
      sources: [
        { name: 'GDACS', status: 'active', type: 'Global Disasters', coverage: 'Worldwide' },
        { name: 'USGS', status: 'active', type: 'Earthquakes', coverage: 'Worldwide' },
        { name: 'NOAA NWS', status: 'active', type: 'Weather (US)', coverage: 'United States' },
        { name: 'P2PQuake/JMA', status: 'active', type: 'Earthquakes', coverage: 'Japan' },
        { name: 'Smithsonian GVP', status: 'active', type: 'Volcanoes', coverage: 'Worldwide' }
      ],
      lastUpdate: new Date().toISOString(),
      note: 'Real-time data from official sources. No mock or demo data.'
    })
  } catch (error) {
    console.error('Alerts API error:', error)
    
    return NextResponse.json({
      alerts: [],
      stats: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
      error: 'Failed to fetch alerts',
      lastUpdate: new Date().toISOString()
    }, { status: 500 })
  }
}
