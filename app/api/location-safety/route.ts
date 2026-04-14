import { NextRequest, NextResponse } from 'next/server'
import { getCountryRiskScore } from '@/lib/safetyRules'
import { findNearbyShelters, fetchConflictAlerts } from '@/lib/conflictAlertService'

export const dynamic = 'force-dynamic'

// Rough country bounding boxes for lat/lng → country mapping
const countryRegions: Array<{ name: string; latMin: number; latMax: number; lngMin: number; lngMax: number; riskMod: number }> = [
  { name: 'Israel', latMin: 29.5, latMax: 33.3, lngMin: 34.2, lngMax: 35.9, riskMod: -20 },
  { name: 'UAE', latMin: 22.5, latMax: 26.5, lngMin: 51.5, lngMax: 56.5, riskMod: 5 },
  { name: 'Qatar', latMin: 24.5, latMax: 26.2, lngMin: 50.7, lngMax: 51.7, riskMod: 5 },
  { name: 'Iran', latMin: 25.0, latMax: 39.8, lngMin: 44.0, lngMax: 63.3, riskMod: -30 },
  { name: 'Lebanon', latMin: 33.0, latMax: 34.7, lngMin: 35.1, lngMax: 36.6, riskMod: -25 },
  { name: 'Syria', latMin: 32.3, latMax: 37.3, lngMin: 35.7, lngMax: 42.4, riskMod: -35 },
  { name: 'Iraq', latMin: 29.0, latMax: 37.4, lngMin: 38.8, lngMax: 48.6, riskMod: -25 },
  { name: 'Saudi Arabia', latMin: 16.0, latMax: 32.2, lngMin: 34.5, lngMax: 55.7, riskMod: 0 },
  { name: 'Jordan', latMin: 29.1, latMax: 33.4, lngMin: 34.9, lngMax: 39.3, riskMod: -5 },
  { name: 'Egypt', latMin: 22.0, latMax: 31.7, lngMin: 24.7, lngMax: 37.0, riskMod: -10 },
  { name: 'Yemen', latMin: 12.1, latMax: 19.0, lngMin: 42.5, lngMax: 54.6, riskMod: -40 },
]

function getCountryFromCoords(lat: number, lng: number): string | null {
  for (const r of countryRegions) {
    if (lat >= r.latMin && lat <= r.latMax && lng >= r.lngMin && lng <= r.lngMax) {
      return r.name
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')

    if (!lat && !lng) {
      return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 })
    }

    const country = getCountryFromCoords(lat, lng)
    const baseScore = country ? getCountryRiskScore(country) : 50

    // Adjust based on time of day
    const hour = new Date().getHours()
    const nightPenalty = (hour >= 22 || hour < 6) ? -5 : 0

    // Fetch nearby safe locations
    let safeLocations: Array<{ name: string; type: string; distance: number }> = []
    try {
      const shelters = await findNearbyShelters(lat, lng, 5000)
      safeLocations = shelters.shelters.slice(0, 5).map(s => ({ name: s.name, type: s.type, distance: s.distance }))
    } catch {
      // Non-critical
    }

    // Fetch recent alerts for country
    let recentAlertCount = 0
    let risks: string[] = []
    if (country) {
      try {
        const alerts = await fetchConflictAlerts(country)
        recentAlertCount = alerts.length
        const types = new Set(alerts.map(a => a.type))
        types.forEach(t => risks.push(`Recent ${t.replace('_', ' ')} activity in the area`))
      } catch {
        // Non-critical
      }
    }

    // Calculate final score
    const regionMod = countryRegions.find(r => r.name === country)?.riskMod || 0
    const alertPenalty = Math.min(recentAlertCount * 3, 20)
    const safeBonus = Math.min(safeLocations.length * 2, 10)
    const score = Math.max(0, Math.min(100, baseScore + nightPenalty + regionMod - alertPenalty + safeBonus))

    const recommendations: string[] = []
    if (score < 30) recommendations.push('Consider leaving the area if possible')
    if (score < 50) recommendations.push('Stay alert and avoid crowds')
    if (nightPenalty) recommendations.push('Exercise extra caution at night')
    if (!safeLocations.length) recommendations.push('Identify nearest shelter or hospital')
    if (country === 'Iran') recommendations.push('Ensure you have VPN installed and working')
    if (country === 'Israel') recommendations.push('Install Home Front Command app')
    recommendations.push('Keep emergency contacts saved on your phone')

    return NextResponse.json({
      score: Math.round(score),
      country,
      coordinates: { lat, lng },
      risks,
      safeLocations,
      recommendations,
      recentAlertCount,
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Location safety error:', error)
    return NextResponse.json({ score: 50, error: 'Failed to assess location safety' }, { status: 500 })
  }
}
