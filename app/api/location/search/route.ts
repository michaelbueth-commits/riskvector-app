import { NextResponse } from 'next/server'
import { countries } from '@/lib/countries'
import { regions } from '@/lib/regions'
import { cities } from '@/lib/cities'
import type { LocationItem } from '@/components/LocationSearch'

// Country name mappings (English → German/common aliases)
const countryAliases: Record<string, string[]> = {
  'Germany': ['Deutschland', 'deutschland'],
  'Turkey': ['Türkei', 'Turkei', 'türkei'],
  'Spain': ['Spanien', 'spanien'],
  'France': ['Frankreich', 'frankreich'],
  'Italy': ['Italien', 'italien'],
  'United States': ['USA', 'Vereinigte Staaten', 'usa', 'Vereinigte Staaten von Amerika'],
  'United Kingdom': ['UK', 'Großbritannien', 'England', 'Vereinigtes Königreich'],
  'Thailand': ['Thailand', 'thailand'],
  'Iran': ['Iran', 'iran', 'Persien'],
  'Japan': ['Japan', 'japan'],
  'China': ['China', 'china'],
  'India': ['Indien', 'indien'],
  'Brazil': ['Brasilien', 'brasilien'],
  'Russia': ['Russland', 'russland'],
  'Australia': ['Australien', 'australien'],
  'Canada': ['Kanada', 'kanada'],
  'Mexico': ['Mexiko', 'mexiko'],
  'Netherlands': ['Niederlande', 'Holland'],
  'Poland': ['Polen', 'polen'],
  'Austria': ['Österreich', 'osterreich', 'Oesterreich'],
  'Switzerland': ['Schweiz', 'schweiz'],
  'Greece': ['Griechenland', 'griechenland'],
  'Portugal': ['Portugal', 'portugal'],
  'Sweden': ['Schweden', 'schweden'],
  'Norway': ['Norwegen', 'norwegen'],
  'Denmark': ['Dänemark', 'danemark', 'daenemark'],
  'Finland': ['Finnland', 'finnland'],
  'Czech Republic': ['Tschechien', 'Tschechische Republik'],
  'Croatia': ['Kroatien', 'kroatien'],
  'Egypt': ['Ägypten', 'Aegypten', 'aegypten'],
  'Morocco': ['Marokko', 'marokko'],
  'South Africa': ['Südafrika', 'Suedafrika'],
  'South Korea': ['Südkorea', 'Suedkorea'],
  'Vietnam': ['Vietnam', 'vietnam'],
  'Indonesia': ['Indonesien', 'indonesien'],
  'Philippines': ['Philippinen', 'philippinen'],
  'Argentina': ['Argentinien', 'argentinien'],
  'Colombia': ['Kolumbien', 'kolumbien'],
  'Peru': ['Peru', 'peru'],
  'Cuba': ['Kuba', 'kuba'],
  'Dominican Republic': ['Dominikanische Republik'],
  'Romania': ['Rumänien', 'Rumaenien'],
  'Hungary': ['Ungarn', 'ungarn'],
  'Ireland': ['Irland', 'irland'],
  'Belgium': ['Belgien', 'belgien'],
  'New Zealand': ['Neuseeland', 'neuseeland'],
  'Iceland': ['Island', 'island'],
  'Israel': ['Israel', 'israel'],
  'United Arab Emirates': ['VAE', 'Vereinigte Arabische Emirate'],
}

function buildIndex(): LocationItem[] {
  const items: LocationItem[] = []

  for (const c of countries) {
    const aliases = countryAliases[c.name] || []
    items.push({
      type: 'country',
      name: c.name,
      country: c.name,
      searchTerms: [c.name, ...aliases, c.code],
    })
  }

  for (const r of regions) {
    const aliases = countryAliases[r.country] || []
    items.push({
      type: 'region',
      name: r.name,
      country: r.country,
      region: r.name,
      searchTerms: [r.name, r.country, ...aliases],
    })
  }

  for (const c of cities) {
    const aliases = countryAliases[c.country] || []
    items.push({
      type: 'city',
      name: c.name,
      country: c.country,
      region: c.region,
      searchTerms: [c.name, c.country, c.region || '', ...aliases].filter(Boolean),
    })
  }

  return items
}

let cachedIndex: LocationItem[] | null = null

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!cachedIndex) cachedIndex = buildIndex()

  // Special case: return full index for client-side caching
  if (q === '__index') {
    return NextResponse.json(cachedIndex)
  }

  // For normal queries, just return the full index and let client search
  // (client-side search is faster for autocomplete)
  return NextResponse.json(cachedIndex)
}
