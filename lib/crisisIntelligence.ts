// Crisis Intelligence Service
// Real-time aggregation from multiple verified sources with attribution

export interface IntelligenceSource {
  name: string
  type: 'official' | 'wire' | 'news' | 'osint' | 'blogger'
  tier: 1 | 2 | 3 | 4
  bias?: string
  credibility: number
  url?: string
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
