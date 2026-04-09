export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { interpolService } from '@/lib/interpolService'

// Police alerts endpoint with real INTERPOL data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch real police alerts from INTERPOL
    const [interpolAlerts, europolAlerts] = await Promise.all([
      interpolService.fetchRedNotices(countries),
      interpolService.fetchEuropolAlerts()
    ])

    // Combine all police alerts
    const allAlerts = [...interpolAlerts, ...europolAlerts]
    
    // Convert to enhanced alert format
    const alerts = allAlerts.slice(0, limit).map(alert => ({
      id: alert.id,
      title: `${alert.type.replace('_', ' ')}: ${alert.firstName} ${alert.lastName}`,
      description: `INTERPOL ${alert.type.replace('_', ' ')} for ${alert.charge}`,
      type: 'POLICE' as const,
      severity: alert.severity,
      timestamp: alert.timestamp,
      source: alert.issuingCountry === 'EU' ? 'Europol' : 'INTERPOL',
      location: alert.lastKnownLocation || alert.nationalities.join(', '),
      country: alert.nationalities[0] || 'Global',
      url: alert.url,
      coordinates: alert.coordinates,
      verification: {
        level: 'OFFICIAL' as const,
        method: 'LAW_ENFORCEMENT_DATABASE',
        confidence: 99,
        sources: ['INTERPOL', alert.issuingCountry]
      },
      classification: {
        primary: 'CRIMINAL_INVESTIGATION' as const,
        secondary: ['LAW_ENFORCEMENT', alert.type.replace('_', '_').toUpperCase()]
      },
      scope: {
        geographic: alert.nationalities.length > 1 ? 'INTERNATIONAL' : 'NATIONAL',
        affected: alert.nationalities
      },
      action: {
        type: alert.threatLevel === 'HIGH' ? 'AVOID' : 'MONITOR',
        urgency: alert.threatLevel === 'HIGH' ? 'IMMEDIATE' : 'STANDARD',
        description: alert.threatLevel === 'HIGH' 
          ? 'Do not approach, contact local authorities immediately' 
          : 'Report sightings to local police'
      }
    }))

    return NextResponse.json({
      success: true,
      type: 'POLICE',
      alerts,
      count: alerts.length,
      sources: ['INTERPOL Red Notices', 'Europol Most Wanted'],
      threatLevels: {
        HIGH: alerts.filter(a => a.action.type === 'AVOID').length,
        MEDIUM: alerts.filter(a => a.action.type === 'MONITOR').length
      },
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    console.error('Police API Error:', error)
    
    // Return error with details
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch police alerts',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        message: 'INTERPOL/Europol service temporarily unavailable. Using cached alerts.',
        count: 0
      }
    }, { status: 500 })
  }
}