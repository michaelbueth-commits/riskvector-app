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

// P2P Quake Japan - Free API, no registration
async function fetchJapanAlerts(): Promise<RealAlert[]> {
  try {
    // P2P Earthquake Information API - Free, no registration
    const response = await fetch('https://api.p2pquake.net/v2/history?codes=551&codes=552&limit=10', {
      next: { revalidate: 60 } // Cache 1 minute
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data || []).map((event: any) => {
      const magnitude = event.earthquake?.hypocenter?.magnitude || 0
      const depth = event.earthquake?.hypocenter?.depth || 0
      const location = event.earthquake?.hypocenter?.name || 'Japan'
      
      return {
        id: `japan-p2p-${event.id || Math.random().toString(36).substr(2, 9)}`,
        type: magnitude >= 6 ? 'critical' : magnitude >= 5 ? 'high' : magnitude >= 4 ? 'medium' : 'low',
        category: 'Earthquake',
        title: `M${magnitude.toFixed(1)} - ${location}, Japan`,
        location: `${location}, Japan`,
        country: 'Japan',
        timestamp: new Date(event.time || Date.now()).toISOString(),
        description: `Magnitude ${magnitude.toFixed(1)} earthquake at ${depth}km depth in ${location}. Source: JMA via P2P Quake Network.`,
        source: 'P2PQuake/JMA',
        sourceId: 'Japan Meteorological Agency via P2P Quake',
        lat: event.earthquake?.hypocenter?.latitude,
        lng: event.earthquake?.hypocenter?.longitude,
        severity: magnitude >= 6 ? 'Critical' : magnitude >= 5 ? 'High' : 'Moderate'
      }
    })
  } catch (error) {
    console.error('Japan P2P Quake fetch error:', error)
    return []
  }
}

// Smithsonian Global Volcanism Program - Free RSS
async function fetchVolcanoAlerts(): Promise<RealAlert[]> {
  try {
    const response = await fetch('https://volcano.si.edu/news/WeeklyVolcanoRSS.xml', {
      next: { revalidate: 3600 } // Cache 1 hour (weekly updates)
    })
    
    if (!response.ok) return []
    
    const text = await response.text()
    
    // Parse RSS XML
    const alerts: RealAlert[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1]
      
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/)
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/)
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
      
      if (titleMatch) {
        const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '')
        const description = descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, '').substring(0, 300) : ''
        const url = linkMatch ? linkMatch[1] : ''
        
        // Extract country from title (e.g., "Ambae (Vanuatu)")
        const countryMatch = title.match(/\(([^)]+)\)/)
        const country = countryMatch ? countryMatch[1] : 'Unknown'
        
        alerts.push({
          id: `volcano-${Math.random().toString(36).substr(2, 9)}`,
          type: title.toLowerCase().includes('new eruptive') ? 'high' : 
                title.toLowerCase().includes('continuing') ? 'medium' : 'low',
          category: 'Volcano',
          title: `Volcanic Activity: ${title}`,
          location: country,
          country: country,
          timestamp: new Date().toISOString(),
          description: description || `Volcanic activity reported at ${title}. See Smithsonian GVP for details.`,
          source: 'Smithsonian GVP',
          sourceId: 'Smithsonian Global Volcanism Program',
          severity: title.toLowerCase().includes('new eruptive') ? 'High' : 'Moderate',
          url: url
        })
      }
    }
    
    return alerts.slice(0, 10)
  } catch (error) {
    console.error('Volcano RSS fetch error:', error)
    return []
  }
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
  const [gdacsAlerts, usgsAlerts, noaaAlerts, japanAlerts, volcanoAlerts] = await Promise.all([
    fetchGDACSAlerts(),
    fetchUSGSAlerts(),
    fetchNOAAAlerts(),
    fetchJapanAlerts(),
    fetchVolcanoAlerts(),
  ])
  
  alerts.push(...gdacsAlerts, ...usgsAlerts, ...noaaAlerts, ...japanAlerts, ...volcanoAlerts)
  
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
