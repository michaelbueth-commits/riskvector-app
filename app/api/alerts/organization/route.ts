export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { organizationService } from '@/lib/organizationService'

// Organization alerts endpoint with real UN/NGO data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch real organization alerts from multiple verified sources
    const [ochaAlerts, whoAlerts, redCrossAlerts] = await Promise.all([
      organizationService.fetchOCHAAlerts(countries),
      organizationService.fetchWHOAlerts(),
      organizationService.fetchRedCrossAlerts()
    ])

    // Combine all organization alerts
    const allAlerts = [...ochaAlerts, ...whoAlerts, ...redCrossAlerts]
    
    // Remove duplicates and sort by severity/date
    const uniqueAlerts = allAlerts
      .filter((alert, index, arr) => 
        arr.findIndex(a => a.id === alert.id) === index
      )
      .sort((a, b) => {
        // Sort by severity first
        const severityOrder = { 'CRITICAL': 5, 'HIGH': 4, 'MEDIUM': 3, 'LOW': 2, 'MINIMAL': 1 }
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity]
        }
        // Then sort by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

    // Convert to enhanced alert format
    const alerts = uniqueAlerts.slice(0, limit).map(alert => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: 'ORGANIZATION' as const,
      severity: alert.severity,
      timestamp: alert.date,
      source: alert.organization,
      location: alert.countries.join(', ') || alert.regions.join(', ') || 'Global',
      country: alert.countries[0] || 'Global',
      url: alert.sourceUrl,
      coordinates: alert.coordinates,
      verification: {
        level: alert.verification === 'OFFICIAL' ? 'OFFICIAL' : 'VERIFIED' as const,
        method: 'ORGANIZATIONAL_DATABASE',
        confidence: alert.verification === 'OFFICIAL' ? 98 : 90,
        sources: [alert.organization]
      },
      classification: {
        primary: alert.category.toUpperCase() as 'NATURAL_DISASTER' | 'CONFLICT' | 'HEALTH' | 'REFUGEE' | 'FOOD_SECURITY',
        secondary: ['HUMANITARIAN', alert.type.replace('_', '_').toUpperCase()]
      },
      scope: {
        geographic: alert.countries.length > 3 ? 'GLOBAL' : 'REGIONAL',
        affected: alert.countries.length > 0 ? alert.countries : alert.regions
      },
      action: {
        type: alert.urgency === 'IMMEDIATE' ? 'EVACUATE' : 'MONITOR',
        urgency: alert.urgency,
        description: alert.urgency === 'IMMEDIATE' 
          ? 'Immediate humanitarian assistance required' 
          : 'Monitor situation and follow official guidance'
      },
      tags: alert.tags
    }))

    // Group by organization for statistics
    const organizations = alerts.reduce((acc, alert) => {
      if (!acc[alert.source]) {
        acc[alert.source] = 0
      }
      acc[alert.source]++
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      type: 'ORGANIZATION',
      alerts,
      count: alerts.length,
      sources: Object.keys(organizations),
      statistics: {
        byOrganization: organizations,
        byCategory: alerts.reduce((acc, alert) => {
          const category = alert.classification.primary
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category]++
          return acc
        }, {} as Record<string, number>)
      },
      lastUpdate: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      success: true,
      alerts: [],
      fallback: true,
      message: "Service temporarily unavailable",
      error: error.message
    })
  }
}
