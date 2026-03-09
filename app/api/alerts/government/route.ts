import { NextResponse } from 'next/server'
import { governmentService } from '@/lib/governmentService'

// Government alerts endpoint with real official advisories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch real government alerts from multiple official sources
    const [germanAlerts, usAlerts, ukAlerts] = await Promise.all([
      governmentService.fetchGermanAdvisories(countries),
      governmentService.fetchUSAdvisories(countries),
      governmentService.fetchUKAdvisories(countries)
    ])

    // Combine all government alerts
    const allAlerts = [...germanAlerts, ...usAlerts, ...ukAlerts]
    
    // Remove duplicates and prioritize by severity
    const uniqueAlerts = allAlerts
      .filter((alert, index, arr) => 
        arr.findIndex(a => a.country === alert.country && a.issuingCountry === a.issuingCountry) === index
      )
      .sort((a, b) => {
        // Sort by advisory level (most severe first)
        const levelOrder = { 
          'EVACUATE': 5, 'DO_NOT_TRAVEL': 4, 'RECONSIDER_TRAVEL': 3, 
          'EXERCISE_INCREASED_CAUTION': 2, 'EXERCISE_NORMAL_PRECAUTIONS': 1 
        }
        if (levelOrder[a.level] !== levelOrder[b.level]) {
          return levelOrder[b.level] - levelOrder[a.level]
        }
        // Then sort by severity
        const severityOrder = { 'CRITICAL': 5, 'HIGH': 4, 'MEDIUM': 3, 'LOW': 2, 'MINIMAL': 1 }
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity]
        }
        // Finally sort by update date
        return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
      })

    // Convert to enhanced alert format
    const alerts = uniqueAlerts.slice(0, limit).map(alert => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: 'GOVERNMENT' as const,
      severity: alert.severity,
      timestamp: alert.date,
      source: alert.issuingCountry,
      location: alert.country,
      country: alert.country,
      url: alert.sourceUrl,
      coordinates: alert.coordinates,
      verification: {
        level: 'OFFICIAL' as const,
        method: 'GOVERNMENT_AGENCY',
        confidence: 100,
        sources: [alert.issuingCountry]
      },
      classification: {
        primary: 'TRAVEL_ADVISORY' as const,
        secondary: alert.categories.map(cat => cat.replace(' ', '_').toUpperCase() as any)
      },
      scope: {
        geographic: 'COUNTRY_SPECIFIC',
        affected: [alert.country, alert.regions].flat()
      },
      action: {
        type: alert.level === 'EVACUATE' ? 'EVACUATE' : 
               alert.level === 'DO_NOT_TRAVEL' ? 'TRAVEL_RESTRICTION' : 'MONITOR',
        urgency: alert.level === 'EVACUATE' ? 'IMMEDIATE' : 
                 alert.level === 'DO_NOT_TRAVEL' ? 'HIGH' : 'STANDARD',
        description: alert.level === 'EVACUATE' 
          ? 'Evacuate immediately - follow official evacuation procedures'
          : alert.level === 'DO_NOT_TRAVEL'
          ? 'Do not travel - all non-essential travel should be avoided'
          : 'Exercise increased caution and monitor official guidance'
      },
      officialLevel: alert.level,
      threatTypes: alert.threatTypes
    }))

    // Group by issuing country for statistics
    const issuingCountries = alerts.reduce((acc, alert) => {
      if (!acc[alert.source]) {
        acc[alert.source] = 0
      }
      acc[alert.source]++
      return acc
    }, {} as Record<string, number>)

    // Group by advisory level
    const advisoryLevels = alerts.reduce((acc, alert) => {
      const level = alert.officialLevel || 'UNKNOWN'
      if (!acc[level]) {
        acc[level] = 0
      }
      acc[level]++
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      type: 'GOVERNMENT',
      alerts,
      count: alerts.length,
      sources: Object.keys(issuingCountries),
      statistics: {
        byIssuingCountry: issuingCountries,
        byAdvisoryLevel: advisoryLevels,
        countriesAffected: [...new Set(alerts.map(a => a.country))].length
      },
      emergencyContacts: {
        german: '+49 (0)30 5000-2000',
        us: '+1 (888) 407-4747',
        uk: '+44 (0)20 7008 9000'
      },
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    console.error('Government API Error:', error)
    
    // Return error with details
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch government alerts',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        message: 'Government services temporarily unavailable. Using cached official advisories.',
        count: 0
      }
    }, { status: 500 })
  }
}