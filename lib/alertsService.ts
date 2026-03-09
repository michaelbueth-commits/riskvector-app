// Real Alert Fetching Service
// Fetches live alerts from official sources - NO MOCK DATA

import { AlertSource, alertSources, getSourcesByCountry } from './alertSources'
import { countries, getCountryByName } from './countries'
import { greeceAlerts } from './greeceAlerts'
import { crisisIntelligenceService } from './crisisIntelligence'

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

// OpenWeatherMap - Global Weather Alerts
async function fetchOpenWeatherAlerts(lat: number, lon: number): Promise<RealAlert[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('OpenWeatherMap API key not found. Skipping.');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`,
      { next: { revalidate: 600 } } // Cache 10 minutes
    );

    if (!response.ok) return [];
    const data = await response.json();

    if (!data.alerts || !Array.isArray(data.alerts)) return [];

    return data.alerts.map((alert: any) => ({
      id: `owm-${lat}-${lon}-${alert.start}`,
      type: 'medium', // OWM alerts don't have a clear severity level, default to medium
      category: 'Weather',
      title: `${alert.event} Warning`,
      location: `${data.timezone}`,
      country: 'Unknown', // OneCall API doesn't return country name directly
      timestamp: new Date(alert.start * 1000).toISOString(),
      description: alert.description,
      source: 'OpenWeatherMap',
      sourceId: 'OpenWeatherMap One Call API',
      lat,
      lng: lon,
      severity: 'Moderate',
      url: 'https://openweathermap.org/weather-alerts'
    }));
  } catch (error) {
    console.error('OpenWeatherMap fetch error:', error);
    return [];
  }
}

// GDELT - Geopolitical Events (Conflicts, Protests, Violence)
async function fetchGDELTAlerts(): Promise<RealAlert[]> {
  try {
    // GDELT API - Free, no registration
    // Query for conflict/violence events in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '')
    const query = encodeURIComponent('(conflict OR war OR attack OR protest OR violence OR military OR invasion OR bombing) tone<-5')
    
    const response = await fetch(
      `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&format=json&maxrecords=20&startdatetime=${yesterday}000000&enddatetime=${new Date().toISOString().split('T')[0].replace(/-/g, '')}235959`,
      {
        next: { revalidate: 900 }, // Cache 15 minutes
        headers: {
          'User-Agent': 'RiskVector/1.0'
        }
      }
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    if (!data.articles || !Array.isArray(data.articles)) return []
    
    return data.articles.map((article: any) => {
      // Extract country from sourcecountry or title
      const country = article.sourcecountry || extractCountryFromText(article.title || '')
      const tone = article.tone || 0
      
      return {
        id: `gdelt-${Buffer.from(article.url || '').toString('base64').substring(0, 16)}`,
        type: tone < -10 ? 'critical' : tone < -5 ? 'high' : 'medium',
        category: 'Security',
        title: article.title || 'Geopolitical Event',
        location: country,
        country: country,
        timestamp: article.seendate || new Date().toISOString(),
        description: article.title || 'Geopolitical event detected via GDELT global monitoring.',
        source: 'GDELT',
        sourceId: 'GDELT Project - Global Events Database',
        severity: tone < -10 ? 'Critical' : tone < -5 ? 'High' : 'Moderate',
        url: article.url
      }
    })
  } catch (error) {
    console.error('GDELT fetch error:', error)
    return []
  }
}

// Helper to extract country from text
function extractCountryFromText(text: string): string {
  const countryKeywords: Record<string, string[]> = {
    'Ukraine': ['ukraine', 'kyiv', 'donbas', 'crimea', 'kharkiv', 'odon'],
    'Russia': ['russia', 'moscow', 'kremlin', 'russian'],
    'Israel': ['israel', 'tel aviv', 'jerusalem', 'gaza', 'west bank'],
    'Palestine': ['palestine', 'gaza', 'hamas', 'west bank'],
    'Syria': ['syria', 'damascus', 'aleppo'],
    'Yemen': ['yemen', 'sana', 'aden'],
    'Myanmar': ['myanmar', 'burma', 'yangon'],
    'Afghanistan': ['afghanistan', 'kabul', 'taliban'],
    'Sudan': ['sudan', 'khartoum', 'darfur'],
    'Ethiopia': ['ethiopia', 'addis ababa', 'tigray'],
  }
  
  const lowerText = text.toLowerCase()
  
  for (const [country, keywords] of Object.entries(countryKeywords)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return country
    }
  }
  
  return 'Unknown'
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

import { crisisIntelligenceService } from './crisisIntelligence';

// Main function to fetch all real alerts
export async function fetchAllRealAlerts(): Promise<RealAlert[]> {
  const alerts: RealAlert[] = []
  
  // Fetch from all sources in parallel
  const [gdacsAlerts, usgsAlerts, noaaAlerts, japanAlerts, volcanoAlerts, gdeltAlerts, reliefwebAlerts] = await Promise.all([
    fetchGDACSAlerts(),
    fetchUSGSAlerts(),
    fetchNOAAAlerts(),
    fetchJapanAlerts(),
    fetchVolcanoAlerts(),
    fetchGDELTAlerts(),
    fetchReliefWebAlerts(),
  ])
  
  alerts.push(...gdacsAlerts, ...usgsAlerts, ...noaaAlerts, ...japanAlerts, ...volcanoAlerts, ...gdeltAlerts, ...reliefwebAlerts);
  
  // Add manually curated alerts for high-risk countries like Greece
  alerts.push(...greeceAlerts);

  // Generate internal advisories for high-risk countries with no alerts
  const highRiskCountries = ['GR', 'TR', 'EG', 'LB', 'JO', 'PK', 'NG', 'VE', 'CO'];
  for (const countryCode of highRiskCountries) {
    const hasAlerts = alerts.some(alert => getCountryByName(alert.country)?.code === countryCode);
    if (!hasAlerts) {
      const riskData = await crisisIntelligenceService.getRiskData(countryCode);
      if (riskData.overall > 60) {
        alerts.push({
          id: `rv-internal-${countryCode}`,
          type: riskData.overall > 80 ? 'critical' : 'high',
          category: 'Security Advisory',
          title: `HIGH RISK ADVISORY: ${riskData.countryName}`,
          location: riskData.countryName,
          country: riskData.countryName,
          timestamp: new Date().toISOString(),
          description: `RiskVector has identified a high-risk level of ${riskData.overall}/100 for ${riskData.countryName} due to a combination of factors including ${riskData.highestRiskFactor.toLowerCase()}. No specific external alerts are currently active, but heightened caution is advised.`,
          source: 'RiskVector Internal Assessment',
          sourceId: 'RV-Internal'
        });
      }
    }
  }
  
  // Sort by timestamp (newest first) and remove duplicates
  const uniqueAlerts = Array.from(new Map(alerts.map(alert => [alert.id, alert])).values());
  
  uniqueAlerts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return uniqueAlerts;
}

// Fetch alerts for specific country
export async function fetchCountryAlerts(countryName: string): Promise<RealAlert[]> {
  const allAlerts = await fetchAllRealAlerts()
  
  return allAlerts.filter(alert => 
    alert.country.toLowerCase().includes(countryName.toLowerCase()) ||
    alert.location.toLowerCase().includes(countryName.toLowerCase())
  )
}

// Fetch alerts for specific coordinates
export async function fetchAlertsForCoordinates(lat: number, lng: number): Promise<RealAlert[]> {
  const allAlerts = await fetchAllRealAlerts();
  
  // Find alerts within a certain radius (e.g., 200km)
  const radiusKm = 200;
  
  return allAlerts.filter(alert => {
    if (!alert.lat || !alert.lng) return false;
    
    const distance = getDistance(lat, lng, alert.lat, alert.lng);
    return distance <= radiusKm;
  });
}

// Open-Meteo Weather Alerts (Global)
async function fetchOpenMeteoAlerts(lat: number, lon: number): Promise<RealAlert[]> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&forecast_days=1&timezone=auto`
    );
    if (!response.ok) return [];
    const data = await response.json();

    // Open-Meteo doesn't have a direct "alerts" array in this endpoint,
    // but we can derive alerts from weather codes or extreme values.
    // This is a placeholder for a more complex implementation.
    // For now, we will rely on the OpenWeatherMap integration for alerts.
    
    return []; // Placeholder

  } catch (error) {
    console.error('Open-Meteo fetch error:', error);
    return [];
  }
}


// ReliefWeb - Humanitarian and Disaster Alerts
async function fetchReliefWebAlerts(): Promise<RealAlert[]> {
  try {
    const response = await fetch(
      'https://api.reliefweb.int/v1/disasters?appname=riskvector&profile=list&preset=latest&slim=1&limit=50&query[value]=status:alert OR status:current',
      { next: { revalidate: 900 } } // Cache 15 minutes
    );
    if (!response.ok) return [];
    const data = await response.json();

    return (data.data || []).map((item: any) => {
      const fields = item.fields;
      const country = fields.country?.[0]?.name || 'Unknown';
      
      let type: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      if (fields.status === 'alert') type = 'high';
      if (fields.name.toLowerCase().includes('red alert') || fields.name.toLowerCase().includes('major')) type = 'critical';

      return {
        id: `reliefweb-${item.id}`,
        type,
        category: fields.type?.[0]?.name || 'Humanitarian',
        title: fields.name,
        location: country,
        country: country,
        timestamp: fields.date?.created || new Date().toISOString(),
        description: `Humanitarian situation update for ${country}. Status: ${fields.status}.`,
        source: 'ReliefWeb',
        sourceId: 'ReliefWeb (UN OCHA)',
        url: fields.url,
      };
    });
  } catch (error) {
    console.error('ReliefWeb fetch error:', error);
    return [];
  }
}

// Haversine formula to calculate distance between two lat/lng points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
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
