// Enhanced Alert Service
// Unified interface for all alert data sources with proper typing

export interface Alert {
  id: string
  type: 'news' | 'police' | 'organization' | 'government' | 'acled' | 'gdacs' | 'usgs' | 'noaa' | 'japan' | 'volcano' | 'gdelt' | 'reliefweb'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: string
  country: string
  countryCode?: string
  region: string
  timestamp: string
  source: string
  sourceUrl?: string
  credibility: number
  tags?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  impact?: {
    casualties?: number
    affected?: number
    economic?: number
  }
  verified: boolean
  active: boolean
  expiresAt?: string
  lastUpdated: string
}

export interface AlertSource {
  name: string
  type: 'official' | 'wire' | 'news' | 'osint' | 'blogger' | 'acled'
  tier: 1 | 2 | 3 | 4
  bias?: string
  credibility: number
  url?: string
}

export interface EnhancedAlert extends Alert {
  sources: AlertSource[]
  crossReferences: string[]
  verificationScore: number
  lastVerified: string
  distributionChannels: string[]
}

// Type mappings for different alert sources
export type AlertType = Alert['type']
export type SeverityLevel = Alert['severity']

// Interfaces for different data sources
export interface NewsAlert {
  id: string
  headline: string
  body: string
  source: string
  publishedAt: string
  author?: string
  category: string
  keywords: string[]
}

export interface PoliceAlert {
  id: string
  type: 'warning' | 'incident' | 'alert'
  description: string
  location: string
  timestamp: string
  severity: SeverityLevel
  coordinates?: {
    lat: number
    lng: number
  }
  affectedAreas: string[]
}

export interface ACLEDAlert {
  data_id: number
  iso: string
  event_id_cnty: string
  event_id_no_cnty: string
  event_date: string
  year: number
  time_precision: number
  event_type: string
  sub_event_type: string
  actor1: string
  assoc_actor_1: string
  actor2: string
  assoc_actor_2: string
  civilian_targeting: number
  iso2: string
  iso3: string
  region: string
  country: string
  admin1: string
  admin2: string
  admin3: string
  location: string
  latitude: number
  longitude: number
  geo_precision: number
  timestamp: string
  fatalities: number
  notes: string
  source: string
  source_scale: string
}

// Service class for enhanced alert processing
export class EnhancedAlertService {
  private static instance: EnhancedAlertService
  private cache: Map<string, EnhancedAlert> = new Map()
  private lastUpdate: Date = new Date(0)

  private constructor() {}

  static getInstance(): EnhancedAlertService {
    if (!EnhancedAlertService.instance) {
      EnhancedAlertService.instance = new EnhancedAlertService()
    }
    return EnhancedAlertService.instance
  }

  async getAllAlerts(): Promise<EnhancedAlert[]> {
    // In a real implementation, this would fetch from various sources
    // For now, return sample data
    return this.getSampleAlerts()
  }

  async getAlertById(id: string): Promise<EnhancedAlert | null> {
    const alerts = await this.getAllAlerts()
    return alerts.find(alert => alert.id === id) || null
  }

  async getAlertsByCountry(countryCode: string): Promise<EnhancedAlert[]> {
    const alerts = await this.getAllAlerts()
    return alerts.filter(alert => alert.countryCode === countryCode)
  }

  async getAlertsBySeverity(severity: SeverityLevel): Promise<EnhancedAlert[]> {
    const alerts = await this.getAllAlerts()
    return alerts.filter(alert => alert.severity === severity)
  }

  async getAlertsByType(type: AlertType): Promise<EnhancedAlert[]> {
    const alerts = await this.getAllAlerts()
    return alerts.filter(alert => alert.type === type)
  }

  async searchAlerts(query: string): Promise<EnhancedAlert[]> {
    const alerts = await this.getAllAlerts()
    const lowercaseQuery = query.toLowerCase()
    
    return alerts.filter(alert => 
      alert.title.toLowerCase().includes(lowercaseQuery) ||
      alert.description.toLowerCase().includes(lowercaseQuery) ||
      alert.location.toLowerCase().includes(lowercaseQuery) ||
      alert.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  private getSampleAlerts(): EnhancedAlert[] {
    return [
      {
        id: 'gr-2026-0307-001',
        type: 'critical',
        title: 'Critical Security Alert: Athens, Greece',
        description: 'Multiple coordinated attacks reported in central Athens. High risk area. All civilians advised to avoid the area until further notice.',
        location: 'Athens, Greece',
        country: 'Greece',
        countryCode: 'GR',
        region: 'Europe',
        timestamp: '2026-03-07T08:30:00Z',
        source: 'Hellenic Police',
        credibility: 9,
        verified: true,
        active: true,
        lastUpdated: '2026-03-07T08:45:00Z',
        sources: [
          {
            name: 'Hellenic Police',
            type: 'official',
            tier: 1,
            credibility: 9,
            url: 'https://www.hellenicpolice.gr/'
          }
        ],
        crossReferences: ['ATH-001-2026', 'GR-SEC-077'],
        verificationScore: 95,
        lastVerified: '2026-03-07T08:45:00Z',
        distributionChannels: ['emergency', 'public', 'media']
      },
      {
        id: 'de-2026-0307-002',
        type: 'high',
        title: 'Protest Alert: Berlin, Germany',
        description: 'Large-scale protest forming in Berlin city center. Traffic disruptions expected. Participants gathering at Brandenburg Gate.',
        location: 'Berlin, Germany',
        country: 'Germany',
        countryCode: 'DE',
        region: 'Europe',
        timestamp: '2026-03-07T10:15:00Z',
        source: 'Berlin Police',
        credibility: 8,
        verified: true,
        active: true,
        lastUpdated: '2026-03-07T10:20:00Z',
        sources: [
          {
            name: 'Berlin Police',
            type: 'official',
            tier: 1,
            credibility: 8
          },
          {
            name: 'Tagesspiegel',
            type: 'news',
            tier: 2,
            credibility: 7,
            url: 'https://tagesspiegel.de/'
          }
        ],
        crossReferences: ['BER-PROTEST-0307', 'DE-CIVIL-002'],
        verificationScore: 88,
        lastVerified: '2026-03-07T10:20:00Z',
        distributionChannels: ['public', 'media']
      },
      {
        id: 'tr-2026-0307-003',
        type: 'critical',
        title: 'Earthquake Alert: Eastern Turkey',
        description: 'Magnitude 6.2 earthquake reported in eastern Turkey. Aftershocks expected. Emergency services deployed to affected areas.',
        location: 'Elazığ, Turkey',
        country: 'Turkey',
        countryCode: 'TR',
        region: 'Middle East',
        timestamp: '2026-03-07T06:45:00Z',
        source: 'AFAD',
        credibility: 10,
        verified: true,
        active: true,
        lastUpdated: '2026-03-07T07:00:00Z',
        sources: [
          {
            name: 'AFAD',
            type: 'official',
            tier: 1,
            credibility: 10,
            url: 'https://www.afad.gov.tr/'
          },
          {
            name: 'USGS',
            type: 'official',
            tier: 1,
            credibility: 10,
            url: 'https://earthquake.usgs.gov/'
          }
        ],
        crossReferences: ['TR-EQ-0307', 'AFAD-2026-037'],
        verificationScore: 98,
        lastVerified: '2026-03-07T07:00:00Z',
        distributionChannels: ['emergency', 'international', 'scientific']
      },
      {
        id: 'jp-2026-0307-004',
        type: 'medium',
        title: 'Typhoon Warning: Okinawa, Japan',
        description: 'Typhoon approaching Okinawa. Expected to make landfall within 24 hours. Residents advised to prepare emergency supplies.',
        location: 'Okinawa, Japan',
        country: 'Japan',
        countryCode: 'JP',
        region: 'Asia',
        timestamp: '2026-03-07T12:00:00Z',
        source: 'Japan Meteorological Agency',
        credibility: 9,
        verified: true,
        active: true,
        expiresAt: '2026-03-08T12:00:00Z',
        lastUpdated: '2026-03-07T12:15:00Z',
        sources: [
          {
            name: 'Japan Meteorological Agency',
            type: 'official',
            tier: 1,
            credibility: 9,
            url: 'https://www.jma.go.jp/'
          }
        ],
        crossReferences: ['JP-TYPHOON-0307', 'JMA-2026-042'],
        verificationScore: 92,
        lastVerified: '2026-03-07T12:15:00Z',
        distributionChannels: ['weather', 'emergency', 'public']
      },
      {
        id: 'us-2026-0307-005',
        type: 'high',
        title: 'Wildfire Alert: California, USA',
        description: 'Fast-moving wildfire reported in Northern California. Evacuation orders issued for several communities. Fire spreading rapidly due to dry conditions.',
        location: 'Northern California, USA',
        country: 'United States',
        countryCode: 'US',
        region: 'Americas',
        timestamp: '2026-03-07T14:30:00Z',
        source: 'CAL FIRE',
        credibility: 8,
        verified: true,
        active: true,
        lastUpdated: '2026-03-07T15:00:00Z',
        sources: [
          {
            name: 'CAL FIRE',
            type: 'official',
            tier: 1,
            credibility: 8,
            url: 'https://www.fire.ca.gov/'
          },
          {
            name: 'CNN',
            type: 'news',
            tier: 2,
            credibility: 7,
            url: 'https://www.cnn.com/'
          }
        ],
        crossReferences: ['US-WF-0307', 'CA-FIRE-2026-015'],
        verificationScore: 85,
        lastVerified: '2026-03-07T15:00:00Z',
        distributionChannels: ['emergency', 'public', 'media']
      }
    ]
  }
}

// Export singleton instance
export const enhancedAlertService = EnhancedAlertService.getInstance()

// Type utility functions
export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-100'
    case 'high': return 'text-orange-600 bg-orange-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'low': return 'text-green-600 bg-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export function getTypeIcon(type: AlertType): string {
  const iconMap: Record<AlertType, string> = {
    'news': '📰',
    'police': '👮',
    'organization': '🏛️',
    'government': '🏛️',
    'acled': '📊',
    'gdacs': '🌪️',
    'usgs': '🏔️',
    'noaa': '🌊',
    'japan': '🗾',
    'volcano': '🌋',
    'gdelt': '📈',
    'reliefweb': '🆘'
  }
  return iconMap[type] || '📢'
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateVerificationScore(sources: AlertSource[]): number {
  if (sources.length === 0) return 0
  
  const totalCredibility = sources.reduce((sum, source) => sum + source.credibility, 0)
  const averageCredibility = totalCredibility / sources.length
  
  // Bonus for multiple sources
  const sourceBonus = sources.length > 1 ? Math.min(sources.length * 2, 10) : 0
  
  return Math.min(Math.round(averageCredibility + sourceBonus), 100)
}

export function validateAlert(alert: Partial<Alert>): boolean {
  const required = ['id', 'type', 'title', 'description', 'location', 'country', 'region', 'timestamp', 'source']
  return required.every(field => field in alert)
}

export function sanitizeAlert(alert: Partial<Alert>): Alert {
  return {
    id: alert.id || `alert-${Date.now()}`,
    type: alert.type || 'medium',
    title: alert.title || 'Untitled Alert',
    description: alert.description || 'No description available',
    location: alert.location || 'Unknown',
    country: alert.country || 'Unknown',
    countryCode: alert.countryCode,
    region: alert.region || 'Unknown',
    timestamp: alert.timestamp || new Date().toISOString(),
    source: alert.source || 'Unknown',
    sourceUrl: alert.sourceUrl,
    credibility: alert.credibility || 5,
    tags: alert.tags || [],
    coordinates: alert.coordinates,
    impact: alert.impact,
    verified: alert.verified || false,
    active: alert.active || true,
    expiresAt: alert.expiresAt,
    lastUpdated: alert.lastUpdated || new Date().toISOString()
  }
}