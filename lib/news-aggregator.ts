// Global News Aggregator - Fetches REAL news from RSS feeds and APIs
// NO MOCK DATA - Every article comes from a real, attributed source

import { XMLParser } from 'fast-xml-parser'

export interface NewsArticle {
  id: string
  title: string
  description: string
  content?: string
  url: string
  source: string
  sourceLogo?: string
  timestamp: string
  country: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  categories: string[]
  imageUrl?: string
  lat?: number
  lng?: number
}

// Cache
interface CacheEntry {
  articles: NewsArticle[]
  fetchedAt: number
}

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes
const cache: Map<string, CacheEntry> = new Map()

function getCached(key: string): NewsArticle[] | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.fetchedAt > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.articles
}

function setCache(key: string, articles: NewsArticle[]) {
  cache.set(key, { articles, fetchedAt: Date.now() })
}

// Country keyword mapping for filtering
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  'Iran': ['iran', 'tehran', 'isfahan', 'mashhad', 'persian gulf', 'iranian'],
  'Turkey': ['turkey', 'türkiye', 'istanbul', 'ankara', 'antalya'],
  'Germany': ['germany', 'deutschland', 'berlin', 'munich', 'hamburg', 'frankfurt'],
  'Thailand': ['thailand', 'bangkok', 'chiang mai', 'phuket', 'thai'],
  'United States': ['usa', 'united states', 'america', 'washington', 'new york', 'california'],
  'United Kingdom': ['uk', 'britain', 'london', 'england', 'scotland', 'wales'],
  'France': ['france', 'paris', 'lyon', 'marseille', 'french'],
  'Ukraine': ['ukraine', 'kyiv', 'kiev', 'donetsk', 'crimea'],
  'Israel': ['israel', 'tel aviv', 'jerusalem', 'gaza', 'west bank'],
  'Russia': ['russia', 'moscow', 'kremlin', 'russian'],
  'China': ['china', 'beijing', 'shanghai', 'chinese'],
  'India': ['india', 'delhi', 'mumbai', 'bangalore', 'indian'],
  'Japan': ['japan', 'tokyo', 'osaka', 'japanese'],
  'Brazil': ['brazil', 'rio', 'são paulo', 'brasilia'],
  'Mexico': ['mexico', 'mexico city', 'cartel'],
  'Australia': ['australia', 'sydney', 'melbourne', 'canberra'],
  'Syria': ['syria', 'damascus', 'aleppo', 'syrian'],
  'Iraq': ['iraq', 'baghdad', 'iraqi'],
  'Afghanistan': ['afghanistan', 'kabul', 'taliban'],
  'Pakistan': ['pakistan', 'islamabad', 'karachi', 'lahore'],
  'Lebanon': ['lebanon', 'beirut', 'hezbollah'],
  'Egypt': ['egypt', 'cairo', 'suez', 'egyptian'],
  'South Korea': ['south korea', 'seoul', 'korean'],
  'Indonesia': ['indonesia', 'jakarta', 'bali'],
  'Philippines': ['philippines', 'manila', 'filipino'],
  'Colombia': ['colombia', 'bogota', 'medellin'],
  'Nigeria': ['nigeria', 'lagos', 'abuja'],
  'South Africa': ['south africa', 'cape town', 'johannesburg'],
  'Kenya': ['kenya', 'nairobi'],
  'Ethiopia': ['ethiopia', 'addis ababa'],
  'Sudan': ['sudan', 'khartoum', 'darfur'],
  'Myanmar': ['myanmar', 'burma', 'yangon', 'naypyidaw'],
  'Venezuela': ['venezuela', 'caracas'],
  'Italy': ['italy', 'rome', 'milan', 'naples'],
  'Spain': ['spain', 'madrid', 'barcelona'],
  'Greece': ['greece', 'athens', 'thessaloniki'],
  'Netherlands': ['netherlands', 'amsterdam', 'the hague'],
  'Poland': ['poland', 'warsaw', 'krakow'],
  'Sweden': ['sweden', 'stockholm'],
  'Switzerland': ['switzerland', 'zurich', 'bern', 'geneva'],
  'Austria': ['austria', 'vienna'],
  'Saudi Arabia': ['saudi arabia', 'riyadh', 'jeddah', 'mecca'],
  'UAE': ['uae', 'dubai', 'abu dhabi', 'emirates'],
  'Qatar': ['qatar', 'doha'],
  'Jordan': ['jordan', 'amman'],
  'Morocco': ['morocco', 'rabat', 'casablanca', 'marrakech'],
  'Taiwan': ['taiwan', 'taipei'],
  'Singapore': ['singapore'],
  'Malaysia': ['malaysia', 'kuala lumpur'],
  'Vietnam': ['vietnam', 'hanoi', 'ho chi minh'],
  'Yemen': ['yemen', 'aden', 'sanaa'],
  'Somalia': ['somalia', 'mogadishu'],
  'Libya': ['libya', 'tripoli'],
  'Haiti': ['haiti', 'port-au-prince'],
  'Cuba': ['cuba', 'havana'],
  'Argentina': ['argentina', 'buenos aires'],
  'Chile': ['chile', 'santiago'],
  'Peru': ['peru', 'lima'],
  'Mali': ['mali', 'bamako'],
  'Congo': ['congo', 'kinshasa'],
  'Democratic Republic of Congo': ['dr congo', 'kinshasa', 'drc'],
}

// Severity detection keywords
const SEVERITY_KEYWORDS: Record<string, string[]> = {
  critical: [
    'explosion', 'bomb', 'bombing', 'terror', 'terrorist', 'terrorism',
    'mass shooting', 'massacre', 'coup', 'war', 'invasion', 'nuclear',
    'pandemic', 'ebola', 'plague', 'catastrophic', 'devastating',
    'tsunami', 'meltdown', 'radioactive',
    'killed', 'dead', 'deaths', 'casualties',
    'attack', 'airstrike', 'airstrikes',
  ],
  high: [
    'flood', 'flooding', 'hurricane', 'typhoon', 'cyclone',
    'wildfire', 'fire', 'blaze', 'evacuation', 'evacuated',
    'clash', 'clashes', 'conflict', 'violence', 'unrest',
    'protest', 'protests', 'riot', 'riots', 'curfew',
    'emergency', 'crisis', 'outbreak',
    'landslide', 'avalanche',
    'kidnap', 'kidnapping', 'hostage', 'hijack',
    'military', 'troops', 'soldier',
    'sanctions', 'embargo',
  ],
  medium: [
    'warning', 'alert', 'advisory', 'caution', 'risk',
    'travel ban', 'travel warning', 'travel advisory',
    'strike', 'demonstration', 'march', 'rally',
    'power outage', 'blackout', 'shortage',
    'disease', 'virus', 'infection',
    'robbery', 'theft', 'crime',
    'political', 'election', 'government', 'diplomatic',
  ],
}

function detectSeverity(title: string, description: string): 'critical' | 'high' | 'medium' | 'low' {
  const text = `${title} ${description}`.toLowerCase()
  for (const [severity, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) return severity as 'critical' | 'high' | 'medium'
    }
  }
  return 'low'
}

function matchCountry(text: string, country: string): boolean {
  const keywords = COUNTRY_KEYWORDS[country]
  if (!keywords) return text.toLowerCase().includes(country.toLowerCase())
  const lowerText = text.toLowerCase()
  return keywords.some(kw => lowerText.includes(kw.toLowerCase()))
}

// RSS Feed sources
const RSS_SOURCES = [
  { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', logo: '🇬🇧' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', logo: '📡' },
  { name: 'DW News', url: 'https://rss.dw.com/rdf/rss-en-all', logo: '🇩🇪' },
  { name: 'WHO', url: 'https://www.who.int/rss-feeds/news-english.xml', logo: '🏥' },
  { name: 'ReliefWeb', url: 'https://reliefweb.int/rss.xml', logo: '🌐' },
  { name: 'US State Dept Travel', url: 'https://travel.state.gov/_res/rss/TAs.xml', logo: '🇺🇸' },
]

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

async function fetchRSS(source: { name: string; url: string; logo: string }): Promise<NewsArticle[]> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 900 },
      headers: {
        'User-Agent': 'RiskVector/1.0 (news aggregator)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/rdf+xml',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return []
    const xml = await response.text()
    const parsed = parser.parse(xml)

    let items: any[] = []
    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item]
    } else if (parsed['rdf:RDF']?.item) {
      items = Array.isArray(parsed['rdf:RDF'].item) ? parsed['rdf:RDF'].item : [parsed['rdf:RDF'].item]
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry]
    }

    return items.map((item: any, i: number) => {
      const title = item.title?._text || item.title?._cdata || item.title || ''
      const desc = item.description?._text || item.description?._cdata || item.description ||
                   item.summary?._text || item.summary?._cdata || item.summary ||
                   item.content?._text || item.content?._cdata || ''
      const link = item.link?.['@_href'] || item.link?._text || item.link || ''
      const pubDate = item.pubDate || item.published || item.updated || item['dc:date'] || ''
      const mediaUrl = item['media:content']?.['@_url'] || item['media:thumbnail']?.['@_url'] || item.enclosure?.['@_url']

      const titleStr = typeof title === 'string' ? title : String(title)
      const descStr = typeof desc === 'string' ? desc : String(desc)
      const linkStr = typeof link === 'string' ? link : String(link)

      return {
        id: `${source.name.toLowerCase().replace(/\s+/g, '-')}-${i}-${titleStr.slice(0, 20).replace(/\s+/g, '')}`,
        title: titleStr,
        description: descStr.slice(0, 500),
        url: linkStr,
        source: source.name,
        sourceLogo: source.logo,
        timestamp: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        country: 'Global',
        severity: detectSeverity(titleStr, descStr),
        categories: [] as string[],
        imageUrl: typeof mediaUrl === 'string' ? mediaUrl : undefined,
      } as NewsArticle
    }).filter(a => a.title && a.title.length > 5)
  } catch (error) {
    console.error(`RSS fetch error (${source.name}):`, error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

async function fetchGDACSNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch('https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventtype=EQ;TC;FL;VO', {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.features || []).slice(0, 20).map((event: any, i: number) => ({
      id: `gdacs-news-${event.properties?.eventid || i}`,
      title: event.properties?.name || 'GDACS Alert',
      description: event.properties?.description || '',
      url: event.properties?.url || 'https://www.gdacs.org',
      source: 'GDACS',
      sourceLogo: '🌐',
      timestamp: event.properties?.fromdate || new Date().toISOString(),
      country: event.properties?.country || 'Unknown',
      severity: event.properties?.alertlevel === 'Red' ? 'critical' as const :
                event.properties?.alertlevel === 'Orange' ? 'high' as const : 'medium' as const,
      categories: [event.properties?.eventtype === 'EQ' ? 'Earthquake' :
                   event.properties?.eventtype === 'TC' ? 'Cyclone' :
                   event.properties?.eventtype === 'FL' ? 'Flood' : 'Disaster'],
      lat: event.geometry?.coordinates?.[1],
      lng: event.geometry?.coordinates?.[0],
    }))
  } catch { return [] }
}

async function fetchUSGSNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson', {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.features || []).map((eq: any) => ({
      id: `usgs-${eq.id}`,
      title: `${eq.properties?.place || 'Unknown location'} — M${eq.properties?.mag?.toFixed(1)} Earthquake`,
      description: `Magnitude ${eq.properties?.mag} earthquake detected. Depth: ${eq.geometry?.coordinates?.[2]?.toFixed(1)}km`,
      url: eq.properties?.url || 'https://earthquake.usgs.gov',
      source: 'USGS',
      sourceLogo: '🌍',
      timestamp: new Date(eq.properties?.time || Date.now()).toISOString(),
      country: eq.properties?.place?.split(', ').pop() || 'Unknown',
      severity: (eq.properties?.mag >= 6 ? 'critical' : eq.properties?.mag >= 5 ? 'high' : 'medium') as 'critical' | 'high' | 'medium',
      categories: ['Earthquake'],
      lat: eq.geometry?.coordinates?.[1],
      lng: eq.geometry?.coordinates?.[0],
    }))
  } catch { return [] }
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const cached = getCached('all')
  if (cached) return cached

  const results = await Promise.allSettled([
    ...RSS_SOURCES.map(s => fetchRSS(s)),
    fetchGDACSNews(),
    fetchUSGSNews(),
  ])

  const allArticles = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)

  // Deduplicate by similar titles
  const seen = new Set<string>()
  const unique = allArticles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 60).trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  setCache('all', unique)
  return unique
}

export async function fetchCountryNews(country: string): Promise<NewsArticle[]> {
  const cacheKey = `country-${country.toLowerCase()}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const allNews = await fetchAllNews()
  const countryNews = allNews.filter(a => matchCountry(`${a.title} ${a.description} ${a.country}`, country))
  setCache(cacheKey, countryNews)
  return countryNews
}

// City to country mapping
const CITY_TO_COUNTRY: Record<string, string> = {
  'berlin': 'Germany', 'munich': 'Germany', 'hamburg': 'Germany', 'frankfurt': 'Germany',
  'istanbul': 'Turkey', 'ankara': 'Turkey', 'antalya': 'Turkey', 'izmir': 'Turkey',
  'tehran': 'Iran', 'isfahan': 'Iran', 'mashhad': 'Iran', 'shiraz': 'Iran',
  'bangkok': 'Thailand', 'chiang mai': 'Thailand', 'phuket': 'Thailand',
  'london': 'United Kingdom', 'manchester': 'United Kingdom',
  'paris': 'France', 'lyon': 'France', 'marseille': 'France',
  'rome': 'Italy', 'milan': 'Italy', 'naples': 'Italy',
  'madrid': 'Spain', 'barcelona': 'Spain',
  'tokyo': 'Japan', 'osaka': 'Japan',
  'new york': 'United States', 'los angeles': 'United States', 'washington': 'United States',
  'moscow': 'Russia', 'st petersburg': 'Russia',
  'beijing': 'China', 'shanghai': 'China',
  'delhi': 'India', 'mumbai': 'India', 'bangalore': 'India',
  'dubai': 'UAE', 'abu dhabi': 'UAE',
  'riyadh': 'Saudi Arabia', 'jeddah': 'Saudi Arabia',
  'cairo': 'Egypt', 'alexandria': 'Egypt',
  'sydney': 'Australia', 'melbourne': 'Australia',
  'amsterdam': 'Netherlands', 'vienna': 'Austria', 'zurich': 'Switzerland',
  'singapore': 'Singapore', 'kuala lumpur': 'Malaysia',
  'hanoi': 'Vietnam', 'jakarta': 'Indonesia', 'bali': 'Indonesia',
  'manila': 'Philippines', 'bogota': 'Colombia',
  'mexico city': 'Mexico', 'rio de janeiro': 'Brazil',
  'buenos aires': 'Argentina', 'santiago': 'Chile', 'lima': 'Peru',
  'nairobi': 'Kenya', 'cape town': 'South Africa', 'lagos': 'Nigeria',
  'damascus': 'Syria', 'baghdad': 'Iraq', 'kabul': 'Afghanistan',
  'islamabad': 'Pakistan', 'karachi': 'Pakistan',
  'beirut': 'Lebanon', 'amman': 'Jordan', 'doha': 'Qatar',
  'kyiv': 'Ukraine', 'seoul': 'South Korea', 'taipei': 'Taiwan',
}

function resolveCityToCountry(city: string): { city: string; country: string } {
  const lower = city.toLowerCase().trim()
  if (CITY_TO_COUNTRY[lower]) return { city, country: CITY_TO_COUNTRY[lower] }
  for (const [c, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (lower.includes(c) || c.includes(lower)) return { city, country }
  }
  if (COUNTRY_KEYWORDS[city]) return { city, country: city }
  return { city, country: city }
}

const HIGH_RISK_COUNTRIES = new Set([
  'Syria', 'Afghanistan', 'Yemen', 'Somalia', 'Libya', 'Iraq',
  'South Sudan', 'Central African Republic', 'Mali', 'Burkina Faso',
  'Democratic Republic of Congo', 'Venezuela', 'Myanmar',
  'North Korea', 'Iran', 'Russia', 'Ukraine', 'Sudan', 'Haiti',
])

function getBaseRiskScore(country: string): number {
  if (HIGH_RISK_COUNTRIES.has(country)) return 70
  if (['Lebanon', 'Pakistan', 'Egypt', 'Turkey', 'Colombia', 'Mexico', 'Nigeria', 'Ethiopia', 'Kenya', 'Philippines'].includes(country)) return 45
  if (['Thailand', 'India', 'Brazil', 'South Africa', 'Indonesia', 'Morocco', 'Tunisia', 'Jordan', 'Argentina'].includes(country)) return 30
  if (['United States', 'France', 'United Kingdom', 'Germany', 'Belgium', 'Spain', 'Italy', 'Greece'].includes(country)) return 20
  return 15
}

function calculateNewsRisk(articles: NewsArticle[]): number {
  if (articles.length === 0) return 15
  let score = 15
  const recentArticles = articles.filter(a => {
    const age = Date.now() - new Date(a.timestamp).getTime()
    return age < 7 * 24 * 60 * 60 * 1000
  })
  for (const article of recentArticles) {
    switch (article.severity) {
      case 'critical': score += 12; break
      case 'high': score += 6; break
      case 'medium': score += 2; break
      case 'low': score += 0.5; break
    }
  }
  return Math.min(100, Math.round(score))
}

function getTravelWarning(country: string): string | null {
  const warnings: Record<string, string> = {
    'Syria': 'Active civil war — DO NOT TRAVEL',
    'Afghanistan': 'Taliban control — DO NOT TRAVEL',
    'Yemen': 'Active conflict zone — DO NOT TRAVEL',
    'Somalia': 'Extreme risk — DO NOT TRAVEL',
    'Libya': 'Ongoing conflict — DO NOT TRAVEL',
    'Iraq': 'High terrorism risk — Reconsider travel',
    'Iran': 'Political tension, detention risk — Reconsider travel',
    'Russia': 'War with Ukraine, sanctions — Reconsider travel',
    'Ukraine': 'Active war zone — DO NOT TRAVEL',
    'Sudan': 'Armed conflict — DO NOT TRAVEL',
    'Myanmar': 'Military coup, civil unrest — Reconsider travel',
    'Haiti': 'Gang violence, instability — DO NOT TRAVEL',
    'Lebanon': 'Economic crisis, conflict risk — Exercise high caution',
    'Pakistan': 'Terrorism risk in border regions — Exercise high caution',
    'Egypt': 'Terrorism risk in Sinai — Exercise caution',
    'Turkey': 'Earthquake risk, border tensions — Exercise caution',
    'Mexico': 'Cartel violence in certain states — Exercise caution',
    'Colombia': 'Crime in rural areas — Exercise caution',
    'Thailand': 'Political instability, southern insurgency — Normal precautions',
  }
  return warnings[country] || null
}

function getSaferAlternative(country: string): string | null {
  const alternatives: Record<string, string> = {
    'Iran': 'Consider routing through Dubai (UAE) or Istanbul (Turkey)',
    'Syria': 'Consider Jordan or Lebanon instead',
    'Afghanistan': 'Consider routing through Pakistan or Uzbekistan',
    'Iraq': 'Consider Jordan or Turkey instead',
    'Yemen': 'Consider Oman instead',
    'Somalia': 'Consider Kenya or Ethiopia instead',
    'Libya': 'Consider Tunisia or Morocco instead',
    'Russia': 'Consider Georgia or Armenia instead',
    'Ukraine': 'Consider Poland or Romania instead',
    'Sudan': 'Consider Egypt or Ethiopia instead',
    'Myanmar': 'Consider Thailand or Vietnam instead',
    'Haiti': 'Consider Dominican Republic instead',
    'Venezuela': 'Consider Colombia or Panama instead',
  }
  return alternatives[country] || null
}

export interface RouteDestination {
  city: string
  country: string
  riskScore: number
  newsRiskContribution: number
  relevantNews: NewsArticle[]
  alerts: string[]
  warnings: string[]
  travelAdvisory: string | null
  saferAlternative: string | null
}

export interface RouteRiskResponse {
  overallRouteRisk: number
  destinations: RouteDestination[]
  warnings: string[]
  recommendations: string[]
  generatedAt: string
  dataSources: string[]
}

export async function calculateRouteRisk(
  destinations: string[],
  startDate?: string,
  endDate?: string
): Promise<RouteRiskResponse> {
  const resolved = destinations.map(d => resolveCityToCountry(d))
  const uniqueCountries = [...new Set(resolved.map(r => r.country))]
  const newsByCountry = new Map<string, NewsArticle[]>()

  await Promise.all(
    uniqueCountries.map(async country => {
      const news = await fetchCountryNews(country)
      newsByCountry.set(country, news)
    })
  )

  const destResults: RouteDestination[] = resolved.map(({ city, country }) => {
    const news = newsByCountry.get(country) || []
    const newsRisk = calculateNewsRisk(news)
    const baseRisk = getBaseRiskScore(country)
    const riskScore = Math.round(baseRisk * 0.6 + newsRisk * 0.4)
    const recentNews = news.slice(0, 5)
    const alerts = news
      .filter(a => a.severity === 'critical' || a.severity === 'high')
      .slice(0, 3)
      .map(a => `${a.source}: ${a.title}`)
    const travelWarning = getTravelWarning(country)
    const warnings: string[] = []
    if (travelWarning) warnings.push(`${city}: ${travelWarning}`)
    return {
      city, country,
      riskScore: Math.min(100, riskScore),
      newsRiskContribution: newsRisk,
      relevantNews: recentNews,
      alerts, warnings,
      travelAdvisory: travelWarning,
      saferAlternative: getSaferAlternative(country),
    }
  })

  const overallRouteRisk = destResults.length > 0
    ? Math.round(
        destResults.reduce((sum, d) => sum + d.riskScore, 0) / destResults.length * 0.7 +
        Math.max(...destResults.map(d => d.riskScore)) * 0.3
      ) : 0

  const allWarnings = destResults.flatMap(d => d.warnings)
  const recommendations = destResults.filter(d => d.saferAlternative).map(d => d.saferAlternative!)
  const activeSources = new Set<string>(['GDACS', 'USGS', 'BBC World', 'Al Jazeera', 'DW News', 'WHO', 'ReliefWeb'])
  destResults.forEach(d => d.relevantNews.forEach(n => activeSources.add(n.source)))

  return {
    overallRouteRisk: Math.min(100, overallRouteRisk),
    destinations: destResults,
    warnings: allWarnings,
    recommendations,
    generatedAt: new Date().toISOString(),
    dataSources: [...activeSources],
  }
}
