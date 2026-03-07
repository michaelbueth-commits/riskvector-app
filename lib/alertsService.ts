// Real Alert Fetching Service
// Fetches live alerts from official sources - NO MOCK DATA

import { AlertSource, alertSources, getSourcesByCountry } from './alertSources'
import { countries, getCountryByName } from './countries'

export interface RealAlert {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  category: string
  title: string
  location: string
  country: string
  timestamp: string
  description: string
  source: string
  sourceId: string
  lat?: number
  lng?: number
  severity?: string
  url?: string
}

// GDACS Alert Parser
async function fetchGDACSAlerts(): Promise<RealAlert[]> {
  try {
    const response = await fetch('https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventtype=EQ;TC;FL;VO&alertlevel=Orange;Red', {
      next: { revalidate: 300 } // Cache 5 minutes
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data.features || []).map((event: any) => ({
      id: `gdacs-${event.properties?.eventid || Math.random().toString(36).substr(2, 9)}`,
      type: event.properties?.alertlevel === 'Red' ? 'critical' : 
            event.properties?.alertlevel === 'Orange' ? 'high' : 'medium',
      category: event.properties?.eventtype === 'EQ' ? 'Earthquake' :
                event.properties?.eventtype === 'TC' ? 'Tropical Cyclone' :
                event.properties?.eventtype === 'FL' ? 'Flood' :
                event.properties?.eventtype === 'VO' ? 'Volcano' : 'Disaster',
      title: event.properties?.name || 'GDACS Alert',
      location: event.properties?.country || 'Unknown',
      country: event.properties?.country || 'Unknown',
      timestamp: event.properties?.fromdate || new Date().toISOString(),
      description: event.properties?.description || event.properties?.name || '',
      source: 'GDACS',
      sourceId: alertSources.find(s => s.id === 'gdacs')?.name || 'GDACS',
      lat: event.geometry?.coordinates?.[1],
      lng: event.geometry?.coordinates?.[0],
      severity: event.properties?.alertlevel,
      url: `https://www.gdacs.org/report.aspx?eventid=${event.properties?.eventid}`
    }))
  } catch (error) {
    console.error('GDACS fetch error:', error)
    return []
  }
}

// USGS Earthquake Alerts
async function fetchUSGSAlerts(): Promise<RealAlert[]> {
  try {
    // Fetch significant earthquakes from last 24 hours
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson', {
      next: { revalidate: 300 }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data.features || []).map((event: any) => {
      const props = event.properties
      const mag = props?.mag || 0
      
      return {
        id: `usgs-${event.id}`,
        type: mag >= 7 ? 'critical' : mag >= 6 ? 'high' : mag >= 5 ? 'medium' : 'low',
        category: 'Earthquake',
        title: `M${mag.toFixed(1)} - ${props?.place || 'Unknown Location'}`,
        location: props?.place || 'Unknown',
        country: extractCountryFromPlace(props?.place || ''),
        timestamp: new Date(props?.time || Date.now()).toISOString(),
        description: `Magnitude ${mag.toFixed(1)} earthquake detected at ${props?.place || 'unknown location'}. Depth: ${props?.depth?.toFixed(1) || 'unknown'} km.`,
        source: 'USGS',
        sourceId: alertSources.find(s => s.id === 'usgs-earthquake')?.name || 'USGS',
        lat: event.geometry?.coordinates?.[1],
        lng: event.geometry?.coordinates?.[0],
        severity: mag >= 7 ? 'Critical' : mag >= 6 ? 'High' : 'Moderate',
        url: props?.url
      }
    })
  } catch (error) {
    console.error('USGS fetch error:', error)
    return []
  }
}

// Helper to extract country from USGS place string
function extractCountryFromPlace(place: string): string {
  const parts = place.split(',')
  const lastPart = parts[parts.length - 1]?.trim()
  
  // Map common abbreviations
  const countryMap: Record<string, string> = {
    'CA': 'Canada',
    'MX': 'Mexico',
    'JP': 'Japan',
    'CL': 'Chile',
    'NZ': 'New Zealand',
    'ID': 'Indonesia',
    'TR': 'Turkey',
    'IR': 'Iran',
    'PH': 'Philippines',
    'PG': 'Papua New Guinea',
    'RU': 'Russia',
    'TW': 'Taiwan',
    'GR': 'Greece',
    'IT': 'Italy',
    'IS': 'Iceland',
    'AL': 'Albania',
    'PK': 'Pakistan',
    'AF': 'Afghanistan',
    'EC': 'Ecuador',
    'CO': 'Colombia',
    'PE': 'Peru',
    'AR': 'Argentina',
    'BO': 'Bolivia',
    'CN': 'China',
    'MM': 'Myanmar',
    'NP': 'Nepal',
    'IN': 'India',
    'KZ': 'Kazakhstan',
    'UZ': 'Uzbekistan',
    'TJ': 'Tajikistan',
    'KG': 'Kyrgyzstan',
    'FJ': 'Fiji',
    'SB': 'Solomon Islands',
    'VU': 'Vanuatu',
    'TO': 'Tonga',
    'WS': 'Samoa',
  }
  
  return countryMap[lastPart] || lastPart || 'Unknown'
}

// NOAA Weather Alerts (US only)
async function fetchNOAAAlerts(): Promise<RealAlert[]> {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active?status=actual', {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'RiskVector/1.0 (contact@riskvector.app)',
        'Accept': 'application/geo+json'
      }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data.features || []).slice(0, 20).map((alert: any) => {
      const props = alert.properties
      const severity = props?.severity?.toLowerCase()
      
      return {
        id: `noaa-${props?.id || Math.random().toString(36).substr(2, 9)}`,
        type: severity === 'extreme' ? 'critical' : 
              severity === 'severe' ? 'high' : 
              severity === 'moderate' ? 'medium' : 'low',
        category: props?.event || 'Weather Alert',
        title: props?.headline || props?.event || 'Weather Alert',
        location: props?.areaDesc || 'United States',
        country: 'United States',
        timestamp: props?.effective || new Date().toISOString(),
        description: props?.description || props?.headline || '',
        source: 'NOAA',
        sourceId: alertSources.find(s => s.id === 'noaa-weather')?.name || 'NOAA NWS',
        severity: props?.severity,
        url: props?.uri
      }
    })
  } catch (error) {
    console.error('NOAA fetch error:', error)
    return []
  }
}

// Main function to fetch all real alerts
export async function fetchAllRealAlerts(): Promise<RealAlert[]> {
  const alerts: RealAlert[] = []
  
  // Fetch from all sources in parallel
  const [gdacsAlerts, usgsAlerts, noaaAlerts] = await Promise.all([
    fetchGDACSAlerts(),
    fetchUSGSAlerts(),
    fetchNOAAAlerts(),
  ])
  
  alerts.push(...gdacsAlerts, ...usgsAlerts, ...noaaAlerts)
  
  // Sort by timestamp (newest first)
  alerts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  return alerts
}

// Fetch alerts for specific country
export async function fetchCountryAlerts(countryName: string): Promise<RealAlert[]> {
  const allAlerts = await fetchAllRealAlerts()
  
  return allAlerts.filter(alert => 
    alert.country.toLowerCase().includes(countryName.toLowerCase()) ||
    alert.location.toLowerCase().includes(countryName.toLowerCase())
  )
}

// Get alert statistics
export function getAlertStats(alerts: RealAlert[]): {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  byCategory: Record<string, number>
  byCountry: Record<string, number>
} {
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    high: alerts.filter(a => a.type === 'high').length,
    medium: alerts.filter(a => a.type === 'medium').length,
    low: alerts.filter(a => a.type === 'low').length,
    byCategory: {} as Record<string, number>,
    byCountry: {} as Record<string, number>
  }
  
  alerts.forEach(alert => {
    stats.byCategory[alert.category] = (stats.byCategory[alert.category] || 0) + 1
    stats.byCountry[alert.country] = (stats.byCountry[alert.country] || 0) + 1
  })
  
  return stats
}
