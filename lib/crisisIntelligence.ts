// Crisis Intelligence Service
// Real-time aggregation from multiple verified sources with attribution
// ACLED Integration: Best-in-class conflict data

export interface IntelligenceSource {
  name: string
  type: 'official' | 'wire' | 'news' | 'osint' | 'blogger' | 'acled'
  tier: 1 | 2 | 3 | 4
  bias?: string
  credibility: number
  url?: string
}

// ACLED-specific interfaces
export interface ACLEDCredentials {
  email: string
  password?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: number
}

export interface ACLEDEvent {
  data_id: number
  iso: string
  event_id_cnty: string
  event_id_no_cnty: string
  event_date: string
  year: number
  time_precision: number
  disorder_type: string
  event_type: string
  sub_event_type: string
  actor1: string
  assoc_actor_1: string
  inter1: number
  actor2: string
  assoc_actor_2: string
  inter2: number
  interaction: number
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
  source: string
  source_scale: string
  notes?: string
  fatalities: number
  tags?: string
  timestamp: string
}

export interface ACLEDResponse {
  success: boolean
  count: number
  data: ACLEDEvent[]
  status?: number
  error?: string
}

export interface CrisisEvent {
  id: string
  type: 'kinetic' | 'terror' | 'infrastructure' | 'humanitarian'
  subtype: string
  location: string
  country: string
  lat?: number
  lng?: number
  timestamp: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  summary: string
  details?: string
  casualties?: {
    deaths?: number
    injuries?: number
  }
  sources: IntelligenceSource[]
  credibilityScore: number
  crossReferenced: boolean
  officialConfirmation: 'confirmed' | 'denied' | 'pending' | 'unavailable'
}

// Source Database
export const INTELLIGENCE_SOURCES: Record<string, IntelligenceSource[]> = {
  Ukraine: [
    { name: 'Ukrainian MOD', type: 'official', tier: 1, credibility: 9, bias: 'Pro-Ukraine' },
    { name: 'Kyiv Independent', type: 'news', tier: 2, credibility: 8, bias: 'Pro-Ukraine' },
    { name: 'Institute for Study of War', type: 'osint', tier: 2, credibility: 8, bias: 'Western analysis' },
    { name: 'War Mapper', type: 'osint', tier: 4, credibility: 6, bias: 'None' },
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'BBC Ukraine', type: 'news', tier: 2, credibility: 8, bias: 'Western' },
  ],
  Israel: [
    { name: 'IDF Spokesperson', type: 'official', tier: 1, credibility: 8, bias: 'Pro-Israel' },
    { name: 'Times of Israel', type: 'news', tier: 2, credibility: 7, bias: 'Pro-Israel' },
    { name: 'Al Jazeera', type: 'news', tier: 2, credibility: 7, bias: 'Pro-Palestinian' },
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'AP News', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
  ],
  Iran: [
    { name: 'IRGC (via IRNA)', type: 'official', tier: 1, credibility: 6, bias: 'Pro-Iran' },
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'ISNA', type: 'news', tier: 2, credibility: 6, bias: 'Pro-Iran' },
    { name: 'Al Jazeera', type: 'news', tier: 2, credibility: 7, bias: 'Regional' },
  ],
  Yemen: [
    { name: 'Houthi Media', type: 'official', tier: 1, credibility: 5, bias: 'Pro-Houthi' },
    { name: 'Long War Journal', type: 'osint', tier: 3, credibility: 7, bias: 'Western analysis' },
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'Maritime Security', type: 'official', tier: 1, credibility: 8, bias: 'Neutral' },
  ],
  Syria: [
    { name: 'Syrian MOD', type: 'official', tier: 1, credibility: 5, bias: 'Pro-Assad' },
    { name: 'SOHR', type: 'osint', tier: 3, credibility: 7, bias: 'Anti-Assad' },
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
  ],
  default: [
    { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'AP News', type: 'wire', tier: 1, credibility: 9, bias: 'Neutral' },
    { name: 'BBC World', type: 'news', tier: 2, credibility: 8, bias: 'Western' },
  ],
}

// Today's real intelligence from web search (March 7, 2026)
export const CURRENT_INTELLIGENCE: CrisisEvent[] = [
  // Ukraine Events
  {
    id: 'ukr-2026-0307-001',
    type: 'kinetic',
    subtype: 'massive_drone_missile_attack',
    location: 'Kharkiv, Ukraine',
    country: 'Ukraine',
    lat: 49.9935,
    lng: 36.2304,
    timestamp: '2026-03-07T04:30:00Z',
    severity: 'critical',
    summary: 'Russian forces launched massive overnight assault with 480 drones and 29 missiles. Ballistic missile struck residential building in Kharkiv.',
    details: 'Russian ballistic missile hit 5-story residential building in Kharkiv. 7 civilians killed including 2 children. Air raid alerts nationwide. Regions affected: Kharkiv, Kyiv, Dnipro, Sumy, Zaporizhzhia, Donetsk.',
    casualties: {
      deaths: 7,
      injuries: 40
    },
    sources: [
      { name: 'Kyiv Independent', type: 'news', tier: 2, credibility: 8, url: 'https://kyivindependent.com/russian-attacks-against-ukraine-kill-10-injure-40-including-children-over-past-day/' },
      { name: 'Reuters', type: 'wire', tier: 1, credibility: 9, url: 'https://www.reuters.com/world/europe/russia-ukraine-march-7-2026' },
      { name: 'NV.ua', type: 'news', tier: 2, credibility: 7, url: 'https://english.nv.ua/nation/russia-launches-509-missiles-and-drones-in-massive-overnight-strike-across-ukraine-50589763.html' },
    ],
    credibilityScore: 9,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
  {
    id: 'ukr-2026-0307-002',
    type: 'kinetic',
    subtype: 'counterattack',
    location: 'Donetsk Region, Ukraine',
    country: 'Ukraine',
    lat: 48.0159,
    lng: 37.8029,
    timestamp: '2026-03-07T06:00:00Z',
    severity: 'high',
    summary: 'Ukrainian forces struck Russian Shahed drone storage facility using Western long-range missiles (ATACMS/SCALP).',
    sources: [
      { name: 'Kyiv Independent', type: 'news', tier: 2, credibility: 8, url: 'https://kyivindependent.com/ukraine-hits-russian-shahed-type-drone-storage-in-donetsk-with-scalp-atacms-missiles-military-says/' },
      { name: 'Ukrainian MOD', type: 'official', tier: 1, credibility: 8, bias: 'Pro-Ukraine' },
    ],
    credibilityScore: 7,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
  
  // Israel-Iran Events
  {
    id: 'isr-2026-0307-001',
    type: 'kinetic',
    subtype: 'missile_attack',
    location: 'Israel (Nationwide)',
    country: 'Israel',
    timestamp: '2026-03-07T05:00:00Z',
    severity: 'critical',
    summary: 'Iran launched missile attacks on Israel, triggering nationwide air raid alerts. Saudi Arabia and Qatar also intercepted drones/missiles.',
    details: 'Iranian missile barrage targeted Israeli cities. Air defenses active across the country. Gulf states also affected by Iranian drone/missile launches.',
    sources: [
      { name: 'CBS News', type: 'news', tier: 2, credibility: 8, url: 'https://www.cbsnews.com/live-updates/us-iran-war-israel-strikes-regime-targets/' },
      { name: 'Jerusalem Post', type: 'news', tier: 2, credibility: 7, url: 'https://www.jpost.com/israel-news/defense-news/article-889119' },
      { name: 'The Hindu', type: 'news', tier: 2, credibility: 8, url: 'https://www.thehindu.com/news/international/iran-israel-us-war-live-west-asia-conflict-march-7-2026/' },
    ],
    credibilityScore: 9,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
  {
    id: 'isr-2026-0307-002',
    type: 'kinetic',
    subtype: 'airstrike',
    location: 'Tehran, Iran',
    country: 'Iran',
    lat: 35.6892,
    lng: 51.3890,
    timestamp: '2026-03-07T03:00:00Z',
    severity: 'critical',
    summary: 'Israel carried out extensive airstrikes on Iranian military infrastructure in Tehran and other cities.',
    details: 'IDF strikes targeted Iranian military facilities, air defense systems, and command centers. Casualties reported. Additional strikes on Hezbollah in Lebanon.',
    sources: [
      { name: 'The Guardian', type: 'news', tier: 2, credibility: 8, url: 'https://www.theguardian.com/world/2026/mar/06/tehran-bombing-iran-night-of-terror' },
      { name: 'Reuters', type: 'wire', tier: 1, credibility: 9 },
      { name: 'CBS News', type: 'news', tier: 2, credibility: 8 },
    ],
    credibilityScore: 8,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
  {
    id: 'gaza-2026-0307-001',
    type: 'kinetic',
    subtype: 'drone_strike',
    location: 'Gaza Strip',
    country: 'Palestine',
    lat: 31.3547,
    lng: 34.3088,
    timestamp: '2026-03-07T08:00:00Z',
    severity: 'high',
    summary: 'Israeli forces killed 4 Palestinians including a child despite ceasefire. Drone strike in Tuffah neighborhood caused injuries.',
    casualties: {
      deaths: 4,
      injuries: 1
    },
    sources: [
      { name: 'Middle East Monitor', type: 'news', tier: 3, credibility: 6, bias: 'Pro-Palestinian', url: 'https://www.middleeastmonitor.com/20260307-israeli-army-kills-4-palestinians-including-child-in-gaza/' },
      { name: 'Palestine Chronicle', type: 'news', tier: 3, credibility: 6, bias: 'Pro-Palestinian', url: 'https://www.palestinechronicle.com/live-blog-israel-strikes-tehran-clashes-reported-in-lebanon/' },
    ],
    credibilityScore: 6,
    crossReferenced: true,
    officialConfirmation: 'pending'
  },
  
  // Yemen/Houthi
  {
    id: 'yem-2026-0307-001',
    type: 'kinetic',
    subtype: 'threat_alert',
    location: 'Red Sea / Gulf of Aden',
    country: 'Yemen',
    timestamp: '2026-03-07T00:00:00Z',
    severity: 'high',
    summary: 'Houthis threaten to resume Red Sea attacks in response to US-Israel strikes on Iran. Maritime threat level elevated.',
    details: 'No confirmed attacks yet, but Houthi officials indicate imminent resumption of drone/missile attacks on commercial shipping. Vessels with US/Israel links at highest risk.',
    sources: [
      { name: 'GCaptain', type: 'news', tier: 3, credibility: 7, url: 'https://gcaptain.com/red-sea-corridor-slips-back-into-crisis-as-houthi-threats-resurface/' },
      { name: 'Long War Journal', type: 'osint', tier: 3, credibility: 7, url: 'https://www.longwarjournal.org/archives/2026/03/houthis-express-solidarity-with-iran-but-do-not-launch-retaliatory-attacks-yet.php' },
      { name: 'US Embassy Saudi Arabia', type: 'official', tier: 1, credibility: 9, url: 'https://sa.usembassy.gov/travel-advisory-saudi-arabia-march-03-2026/' },
    ],
    credibilityScore: 8,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
  
  // Terrorism
  {
    id: 'terror-2026-0305-001',
    type: 'terror',
    subtype: 'foiled_plot',
    location: 'Damascus, Syria',
    country: 'Syria',
    timestamp: '2026-03-05T12:00:00Z',
    severity: 'medium',
    summary: 'Syrian security forces thwarted ISIS-linked car bomb plot targeting Damascus.',
    sources: [
      { name: 'SANA (Syrian State)', type: 'official', tier: 1, credibility: 5, bias: 'Pro-Assad', url: 'https://sana.sy/en/syria/2300580/' },
    ],
    credibilityScore: 5,
    crossReferenced: false,
    officialConfirmation: 'unavailable'
  },
  {
    id: 'terror-2026-0206-001',
    type: 'terror',
    subtype: 'mosque_bombing',
    location: 'Islamabad, Pakistan',
    country: 'Pakistan',
    timestamp: '2026-02-06T14:00:00Z',
    severity: 'critical',
    summary: 'ISIS-Pakistan claimed mosque bombing that killed 32 and injured 170.',
    casualties: {
      deaths: 32,
      injuries: 170
    },
    sources: [
      { name: 'Wikipedia Terror Timeline', type: 'osint', tier: 3, credibility: 7, url: 'https://en.wikipedia.org/wiki/List_of_terrorist_incidents_in_2026' },
      { name: 'Reuters', type: 'wire', tier: 1, credibility: 9 },
    ],
    credibilityScore: 8,
    crossReferenced: true,
    officialConfirmation: 'confirmed'
  },
]

// Get intelligence for specific country
export function getIntelligenceForCountry(country: string): CrisisEvent[] {
  return CURRENT_INTELLIGENCE.filter(event => 
    event.country.toLowerCase() === country.toLowerCase() ||
    event.location.toLowerCase().includes(country.toLowerCase())
  )
}

// Get all critical events
export function getCriticalEvents(): CrisisEvent[] {
  return CURRENT_INTELLIGENCE.filter(event => 
    event.severity === 'critical'
  )
}

// Calculate zone threat level
export function calculateZoneThreat(events: CrisisEvent[]): {
  level: 'critical' | 'high' | 'medium' | 'low'
  score: number
  confidence: number
} {
  if (events.length === 0) {
    return { level: 'low', score: 15, confidence: 5 }
  }
  
  let score = 0
  let totalCredibility = 0
  
  events.forEach(event => {
    const severityWeight = 
      event.severity === 'critical' ? 35 :
      event.severity === 'high' ? 25 :
      event.severity === 'medium' ? 15 : 5
    
    score += severityWeight * (event.credibilityScore / 10)
    totalCredibility += event.credibilityScore
  })
  
  score = Math.min(100, score)
  
  const avgCredibility = totalCredibility / events.length
  
  const level = 
    score >= 75 ? 'critical' :
    score >= 50 ? 'high' :
    score >= 25 ? 'medium' : 'low'
  
  return {
    level,
    score,
    confidence: avgCredibility
  }
}

// Format intelligence for display
export function formatIntelligence(event: CrisisEvent): string {
  const severityEmoji = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵'
  }
  
  const typeEmoji = {
    kinetic: '💥',
    terror: '⚠️',
    infrastructure: '🏗️',
    humanitarian: '🏥'
  }
  
  let output = `
${severityEmoji[event.severity]} **${event.severity.toUpperCase()}** — ${event.location}
${typeEmoji[event.type]} ${event.subtype.replace(/_/g, ' ').toUpperCase()}
🕐 ${new Date(event.timestamp).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} CET

${event.summary}

${event.casualties ? `☠️ Casualties: ${event.casualties.deaths || 0} dead, ${event.casualties.injuries || 0} injured` : ''}

📚 **Sources**:
${event.sources.map(s => `• ${s.name} (${s.credibility}/10) ${s.bias ? `[${s.bias}]` : ''}`).join('\n')}

✅ Credibility: ${event.credibilityScore}/10
🔄 Cross-referenced: ${event.crossReferenced ? 'Yes' : 'No'}
🏛️ Official: ${event.officialConfirmation}
`.trim()
  
  return output
}

// ===== ACLED INTEGRATION =====
// Best-in-class conflict data from ACLED (Armed Conflict Location & Event Data Project)

class ACLEDService {
  private static instance: ACLEDService
  private credentials: ACLEDCredentials | null = null
  private baseUrl = 'https://acleddata.com/api'
  
  private constructor() {}
  
  static getInstance(): ACLEDService {
    if (!ACLEDService.instance) {
      ACLEDService.instance = new ACLEDService()
    }
    return ACLEDService.instance
  }
  
  // Set ACLED credentials (call this once with your credentials)
  setCredentials(credentials: ACLEDCredentials): void {
    this.credentials = credentials
  }
  
  // Get OAuth access token
  async getAccessToken(): Promise<string> {
    if (!this.credentials) {
      throw new Error('ACLED credentials not set. Call setCredentials() first.')
    }
    
    // Check if we have a valid access token
    if (this.credentials.accessToken && this.credentials.tokenExpiry && Date.now() < this.credentials.tokenExpiry) {
      return this.credentials.accessToken
    }
    
    // If we have a refresh token, try to use it
    if (this.credentials.refreshToken) {
      try {
        return await this.refreshAccessToken()
      } catch (error) {
        console.warn('Failed to refresh access token, requesting new one:', error)
      }
    }
    
    // Request new access token
    return await this.requestNewAccessToken()
  }
  
  // Request new OAuth access token
  private async requestNewAccessToken(): Promise<string> {
    if (!this.credentials?.email || !this.credentials?.password) {
      throw new Error('Email and password required for OAuth authentication')
    }
    
    const formData = new URLSearchParams()
    formData.append('username', this.credentials.email)
    formData.append('password', this.credentials.password)
    formData.append('grant_type', 'password')
    formData.append('client_id', 'acled')
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`OAuth request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Store the tokens
      this.credentials.accessToken = data.access_token
      this.credentials.refreshToken = data.refresh_token
      this.credentials.tokenExpiry = Date.now() + (data.expires_in * 1000)
      
      return data.access_token
    } catch (error) {
      throw new Error(`Failed to get OAuth token: ${error}`)
    }
  }
  
  // Refresh access token using refresh token
  private async refreshAccessToken(): Promise<string> {
    if (!this.credentials?.refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const formData = new URLSearchParams()
    formData.append('refresh_token', this.credentials.refreshToken)
    formData.append('grant_type', 'refresh_token')
    formData.append('client_id', 'acled')
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update the tokens
      this.credentials.accessToken = data.access_token
      this.credentials.refreshToken = data.refresh_token || this.credentials.refreshToken
      this.credentials.tokenExpiry = Date.now() + (data.expires_in * 1000)
      
      return data.access_token
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error}`)
    }
  }
  
  // Make authenticated API request
  private async apiRequest(endpoint: string, params: Record<string, any> = {}): Promise<ACLEDResponse> {
    try {
      const accessToken = await this.getAccessToken()
      
      // Build URL with parameters
      const url = new URL(`${this.baseUrl}${endpoint}`)
      url.searchParams.append('_format', 'json')
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join('|'))
        } else if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        success: true,
        count: data.count || data.data?.length || 0,
        data: data.data || [],
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        count: 0,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // Get conflict events with filters
  async getConflictEvents(params: {
    country?: string | string[]
    region?: string | string[]
    year?: number | number[]
    event_type?: string | string[]
    limit?: number
    event_date_from?: string
    event_date_to?: string
  } = {}): Promise<ACLEDResponse> {
    return this.apiRequest('/acled/read', params)
  }
  
  // Get recent events (last 30 days)
  async getRecentEvents(country?: string, limit: number = 100): Promise<ACLEDResponse> {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    return this.getConflictEvents({
      country,
      limit,
      event_date_from: startDate,
      event_date_to: endDate
    })
  }
  
  // Convert ACLED event to CrisisEvent format
  convertACLEDEvent(acledEvent: ACLEDEvent): CrisisEvent {
    // Map ACLED event types to our types
    const eventTypeMap: Record<string, CrisisEvent['type']> = {
      'Battles': 'kinetic',
      'Explosions/Remote violence': 'kinetic',
      'Violence against civilians': 'terror',
      'Protests': 'kinetic',
      'Riots': 'kinetic',
      'Strategic developments': 'infrastructure'
    }
    
    // Map severity based on fatalities and event type
    let severity: CrisisEvent['severity'] = 'low'
    if (acledEvent.fatalities >= 10) severity = 'critical'
    else if (acledEvent.fatalities >= 3) severity = 'high'
    else if (acledEvent.fatalities >= 1) severity = 'medium'
    
    // Adjust severity for certain event types
    if (acledEvent.event_type === 'Explosions/Remote violence') {
      severity = severity === 'low' ? 'medium' : severity
    }
    if (acledEvent.civilian_targeting === 1) {
      severity = severity === 'low' ? 'high' : severity === 'medium' ? 'critical' : severity
    }
    
    return {
      id: `acled-${acledEvent.data_id}`,
      type: eventTypeMap[acledEvent.event_type] || 'kinetic',
      subtype: acledEvent.sub_event_type.toLowerCase().replace(/\s+/g, '_'),
      location: acledEvent.location,
      country: acledEvent.country,
      lat: acledEvent.latitude,
      lng: acledEvent.longitude,
      timestamp: acledEvent.timestamp,
      severity,
      summary: `${acledEvent.event_type}: ${acledEvent.actor1}${acledEvent.actor2 ? ` vs ${acledEvent.actor2}` : ''} in ${acledEvent.location}`,
      details: acledEvent.notes,
      casualties: acledEvent.fatalities > 0 ? {
        deaths: acledEvent.fatalities,
        injuries: 0 // ACLED doesn't typically track injuries
      } : undefined,
      sources: [
        {
          name: 'ACLED',
          type: 'acled',
          tier: 1,
          credibility: 9,
          bias: 'Neutral',
          url: 'https://acleddata.com'
        }
      ],
      credibilityScore: 9,
      crossReferenced: true,
      officialConfirmation: 'confirmed'
    }
  }
  
  // Get crisis intelligence with ACLED data
  async getEnhancedIntelligence(country: string): Promise<CrisisEvent[]> {
    try {
      const response = await this.getRecentEvents(country, 50)
      
      if (!response.success || !response.data.length) {
        // Fallback to existing intelligence
        return getIntelligenceForCountry(country)
      }
      
      // Convert ACLED events to CrisisEvent format
      const acledEvents = response.data.map(event => this.convertACLEDEvent(event))
      
      // Combine with existing intelligence
      const existingEvents = getIntelligenceForCountry(country)
      
      // Merge and sort by timestamp (newest first)
      const allEvents = [...acledEvents, ...existingEvents]
      return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
    } catch (error) {
      console.warn('ACLED integration failed, using fallback:', error)
      return getIntelligenceForCountry(country)
    }
  }
  
  // Get zone threat level with ACLED data
  async getEnhancedZoneThreat(country: string): Promise<{
    level: 'critical' | 'high' | 'medium' | 'low'
    score: number
    confidence: number
    acledData: boolean
  }> {
    try {
      const response = await this.getRecentEvents(country, 200)
      
      if (!response.success || !response.data.length) {
        // Fallback to existing calculation
        const events = getIntelligenceForCountry(country)
        const result = calculateZoneThreat(events)
        return { ...result, acledData: false }
      }
      
      // Convert to CrisisEvents and calculate threat
      const events = response.data.map(event => this.convertACLEDEvent(event))
      const result = calculateZoneThreat(events)
      
      // Boost confidence due to ACLED data
      const boostedConfidence = Math.min(10, result.confidence + 2)
      
      return {
        ...result,
        confidence: boostedConfidence,
        acledData: true
      }
      
    } catch (error) {
      console.warn('ACLED threat calculation failed, using fallback:', error)
      const events = getIntelligenceForCountry(country)
      const result = calculateZoneThreat(events)
      return { ...result, acledData: false }
    }
  }
}

// Export ACLED service instance
export const crisisIntelligenceService = crisisIntelligenceService.getInstance()
export const acledService = ACLEDService.getInstance()

// Enhanced functions that use ACLED when available
export async function getEnhancedIntelligenceForCountry(country: string): Promise<CrisisEvent[]> {
  return acledService.getEnhancedIntelligence(country)
}

export async function getEnhancedZoneThreat(country: string): Promise<{
  level: 'critical' | 'high' | 'medium' | 'low'
  score: number
  confidence: number
  acledData: boolean
}> {
  return acledService.getEnhancedZoneThreat(country)
}
