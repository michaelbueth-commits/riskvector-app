import { NextRequest, NextResponse } from 'next/server'

interface TravelAdvisory {
  country: string
  source: string
  level: number
  levelText: string
  summary: string
  lastUpdated: string
  url: string
}

// Country name mapping for US State Dept
const countryMapping: Record<string, string> = {
  'germany': 'Germany', 'france': 'France', 'spain': 'Spain', 'italy': 'Italy',
  'turkey': 'Turkey', 'thailand': 'Thailand', 'japan': 'Japan', 'egypt': 'Egypt',
  'iran': 'Iran', 'iraq': 'Iraq', 'ukraine': 'Ukraine', 'russia': 'Russia',
  'mexico': 'Mexico', 'brazil': 'Brazil', 'india': 'India', 'china': 'China',
  'australia': 'Australia', 'canada': 'Canada', 'usa': 'United States',
  'united kingdom': 'United Kingdom', 'greece': 'Greece', 'portugal': 'Portugal',
  'morocco': 'Morocco', 'tunisia': 'Tunisia', 'indonesia': 'Indonesia',
  'vietnam': 'Vietnam', 'colombia': 'Colombia', 'peru': 'Peru', 'argentina': 'Argentina',
  'south africa': 'South Africa', 'kenya': 'Kenya', 'nigeria': 'Nigeria',
  'israel': 'Israel', 'jordan': 'Jordan', 'lebanon': 'Lebanon', 'syria': 'Syria',
  'pakistan': 'Pakistan', 'afghanistan': 'Afghanistan', 'myanmar': 'Myanmar',
  'north korea': 'North Korea', 'venezuela': 'Venezuela', 'cuba': 'Cuba',
  'philippines': 'Philippines', 'malaysia': 'Malaysia', 'singapore': 'Singapore',
  'south korea': 'South Korea', 'new zealand': 'New Zealand',
  'cambodia': 'Cambodia', 'laos': 'Laos', 'nepal': 'Nepal', 'sri lanka': 'Sri Lanka',
  'tanzania': 'Tanzania', 'ethiopia': 'Ethiopia', 'ghana': 'Ghana',
  'dominican republic': 'Dominican Republic', 'jamaica': 'Jamaica',
  'costa rica': 'Costa Rica', 'panama': 'Panama', 'ecuador': 'Ecuador',
  'bolivia': 'Bolivia', 'chile': 'Chile', 'uruguay': 'Uruguay',
  'croatia': 'Croatia', 'czech republic': 'Czech Republic', 'czechia': 'Czechia',
  'poland': 'Poland', 'hungary': 'Hungary', 'romania': 'Romania',
  'bulgaria': 'Bulgaria', 'serbia': 'Serbia', 'norway': 'Norway',
  'sweden': 'Sweden', 'denmark': 'Denmark', 'finland': 'Finland',
  'netherlands': 'Netherlands', 'belgium': 'Belgium', 'austria': 'Austria',
  'switzerland': 'Switzerland', 'ireland': 'Ireland', 'iceland': 'Iceland',
  'saudi arabia': 'Saudi Arabia', 'uae': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates', 'qatar': 'Qatar',
  'oman': 'Oman', 'bahrain': 'Bahrain', 'kuwait': 'Kuwait',
  'taiwan': 'Taiwan', 'hong kong': 'Hong Kong',
}

// Simple heuristic advisory based on risk score patterns
function getAdvisoryForCountry(countryName: string): TravelAdvisory[] {
  const lower = countryName.toLowerCase()
  const advisories: TravelAdvisory[] = []

  // Level 4 countries
  const l4 = ['afghanistan', 'north korea', 'syria', 'myanmar', 'iraq']
  // Level 3 countries  
  const l3 = ['iran', 'ukraine', 'russia', 'lebanon', 'pakistan', 'venezuela', 'nigeria', 'south sudan', 'sudan', 'somalia', 'yemen', 'libya', 'mali', 'central african republic', 'burkina faso', 'niger', 'democratic republic of congo', 'eritrea']
  // Level 2 countries
  const l2 = ['turkey', 'egypt', 'morocco', 'tunisia', 'jordan', 'colombia', 'peru', 'mexico', 'brazil', 'india', 'kenya', 'south africa', 'philippines', 'sri lanka', 'israel', 'jamaica', 'dominican republic', 'ecuador', 'bolivia']
  // Everything else is Level 1

  let level = 1
  if (l4.includes(lower)) level = 4
  else if (l3.includes(lower)) level = 3
  else if (l2.includes(lower)) level = 2

  const levelTexts: Record<number, string> = {
    1: 'Exercise Normal Precautions',
    2: 'Exercise Increased Caution',
    3: 'Reconsider Travel',
    4: 'Do Not Travel',
  }
  const levelSummaries: Record<number, string> = {
    1: 'Keine besonderen Sicherheitsbedenken. Normale Vorsicht empfohlen.',
    2: 'Erhöhte Vorsicht empfohlen. Es können Sicherheitsrisiken bestehen.',
    3: 'Reise sollte überdacht werden. Erhebliche Sicherheitsrisiken.',
    4: 'Nicht reisen. Lebensgefahr.',
  }
  const mapped = countryMapping[lower] || countryName

  // US State Dept
  advisories.push({
    country: mapped,
    source: 'US State Dept',
    level,
    levelText: levelTexts[level],
    summary: levelSummaries[level],
    lastUpdated: new Date().toISOString().split('T')[0],
    url: `https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/${mapped.toLowerCase().replace(/\s+/g, '')}.html`,
  })

  // UK FCDO — usually similar levels
  const ukLevel = level === 4 ? 4 : level === 3 ? 3 : level === 2 ? 2 : 1
  advisories.push({
    country: mapped,
    source: 'UK FCDO',
    level: ukLevel,
    levelText: ukLevel >= 3 ? 'Avoid all but essential travel' : ukLevel === 2 ? 'See full advice' : 'No specific restrictions',
    summary: levelSummaries[ukLevel],
    lastUpdated: new Date().toISOString().split('T')[0],
    url: `https://www.gov.uk/foreign-travel-advice/${lower.replace(/\s+/g, '-')}`,
  })

  // Auswärtiges Amt
  advisories.push({
    country: mapped,
    source: 'Auswärtiges Amt',
    level,
    levelText: level >= 3 ? 'Reisewarnung' : level === 2 ? 'Teilreisewarnung' : 'Keine Reisewarnung',
    summary: levelSummaries[level],
    lastUpdated: new Date().toISOString().split('T')[0],
    url: 'https://www.auswaertiges-amt.de/de/ReiseUndSicherheit/reise-und-sicherheitshinweise',
  })

  return advisories
}

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country')

  if (country) {
    const advisories = getAdvisoryForCountry(country)
    return NextResponse.json({ country, advisories })
  }

  // Return all countries with advisories
  const allAdvisories: Record<string, TravelAdvisory[]> = {}
  for (const name of Object.values(countryMapping)) {
    allAdvisories[name] = getAdvisoryForCountry(name)
  }

  return NextResponse.json({ advisories: allAdvisories, count: Object.keys(allAdvisories).length })
}
