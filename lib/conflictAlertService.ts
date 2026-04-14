import { ConflictAlert } from './conflictAlertTypes'

export async function fetchConflictAlerts(country?: string): Promise<ConflictAlert[]> {
  const alerts: ConflictAlert[] = []

  const [reliefWebAlerts, gdeltAlerts] = await Promise.allSettled([
    fetchReliefWebAlerts(country),
    fetchGDELTAlerts(country),
  ])

  if (reliefWebAlerts.status === 'fulfilled') alerts.push(...reliefWebAlerts.value)
  if (gdeltAlerts.status === 'fulfilled') alerts.push(...gdeltAlerts.value)

  const filtered = country
    ? alerts.filter(a => a.country.toLowerCase() === country.toLowerCase())
    : alerts

  const severityOrder: Record<string, number> = { critical: 0, urgent: 1, warning: 2, info: 3 }
  filtered.sort((a, b) => {
    const se = severityOrder[a.severity] - severityOrder[b.severity]
    if (se !== 0) return se
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return filtered
}

async function fetchReliefWebAlerts(country?: string): Promise<ConflictAlert[]> {
  try {
    const params = new URLSearchParams({
      'appname': 'riskvector',
      'limit': '20',
      'sort[0][field]': 'date',
      'sort[0][direction]': 'desc',
      'fields[include][]': 'name,country,date,description,type,status',
    })
    if (country) {
      params.set('filter[field]', 'country')
      params.set('filter[value][name]', country)
    }

    const res = await fetch(`https://api.reliefweb.int/v1/disasters?${params.toString()}`, {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) return []
    const data = await res.json()

    return (data.data || []).map((item: Record<string, unknown>) => {
      const fields = (item.fields || {}) as Record<string, unknown>
      const countries = (fields.country as Array<Record<string, string>>) || []
      const types = (fields.type as Array<Record<string, string>>) || []
      const countryName = countries[0]?.name || 'Unknown'
      const typeStr = types.map((t: Record<string, string>) => t.name || '').join(',')
      const desc = typeof fields.description === 'string' ? fields.description.substring(0, 500) : 'Humanitarian alert reported'

      return {
        id: `rw-${item.id}`,
        type: mapReliefWebType(typeStr),
        severity: mapReliefWebSeverity(String(fields.status || '')),
        country: countryName,
        title: String(fields.name || 'ReliefWeb Alert'),
        description: desc,
        timestamp: String(fields.date || new Date().toISOString()),
        source: 'ReliefWeb / UN OCHA',
        instructions: getInstructionsForType(mapReliefWebType(typeStr)),
        shelterRequired: false,
      } as ConflictAlert
    })
  } catch {
    return []
  }
}

async function fetchGDELTAlerts(country?: string): Promise<ConflictAlert[]> {
  try {
    const keyword = country ? encodeURIComponent(country) : 'conflict'
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${keyword}%20(conflict%20OR%20attack%20OR%20airstrike%20OR%20rocket%20OR%20military)&mode=ArtList&maxrecords=15&format=json&timespan=7d&sourcelang=english`

    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()

    return (data.articles || []).map((article: Record<string, unknown>, i: number) => {
      const title = String(article.title || 'Security Incident')
      return {
        id: `gdelt-${Date.now()}-${i}`,
        type: detectConflictType(title),
        severity: 'warning' as const,
        country: country || extractCountry(title),
        title: title.substring(0, 100),
        description: title,
        timestamp: String(article.seendate || new Date().toISOString()),
        source: String(article.domain || 'GDELT'),
        instructions: ['Monitor local news for updates', 'Follow instructions from local authorities'],
        shelterRequired: false,
      } as ConflictAlert
    })
  } catch {
    return []
  }
}

function mapReliefWebType(typeStr: string): ConflictAlert['type'] {
  const t = typeStr.toLowerCase()
  if (t.includes('earthquake') || t.includes('flood') || t.includes('storm')) return 'natural_disaster'
  if (t.includes('conflict') || t.includes('war')) return 'military'
  if (t.includes('epidemic') || t.includes('disease')) return 'biochemical'
  return 'civil_unrest'
}

function mapReliefWebSeverity(status: string): ConflictAlert['severity'] {
  const s = status.toLowerCase()
  if (s.includes('critical') || s.includes('alert')) return 'urgent'
  if (s.includes('ongoing')) return 'warning'
  return 'info'
}

function detectConflictType(text: string): ConflictAlert['type'] {
  const t = text.toLowerCase()
  if (t.includes('rocket') || t.includes('missile')) return 'rocket'
  if (t.includes('airstrike') || t.includes('air strike')) return 'airstrike'
  if (t.includes('terror') || t.includes('bombing')) return 'terrorism'
  if (t.includes('protest') || t.includes('unrest') || t.includes('riot')) return 'civil_unrest'
  if (t.includes('nuclear') || t.includes('radiation')) return 'nuclear'
  if (t.includes('earthquake') || t.includes('flood')) return 'natural_disaster'
  return 'military'
}

function extractCountry(text: string): string {
  const countryMap: Record<string, string> = {
    'israel': 'Israel', 'uae': 'UAE', 'dubai': 'UAE', 'qatar': 'Qatar',
    'iran': 'Iran', 'lebanon': 'Lebanon', 'syria': 'Syria', 'iraq': 'Iraq',
    'yemen': 'Yemen', 'palestine': 'Palestine', 'gaza': 'Palestine',
    'jordan': 'Jordan', 'egypt': 'Egypt', 'saudi': 'Saudi Arabia',
  }
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(countryMap)) {
    if (lower.includes(key)) return val
  }
  return 'Unknown'
}

function getInstructionsForType(type: ConflictAlert['type']): string[] {
  const instructions: Record<ConflictAlert['type'], string[]> = {
    rocket: ['Move to shelter immediately', 'Stay away from windows', 'Wait 10 minutes after last impact'],
    airstrike: ['Move to basement or underground', 'Stay away from windows', 'Keep phone charged'],
    military: ['Avoid conflict areas', 'Monitor local news', 'Follow military instructions'],
    civil_unrest: ['Avoid crowds and demonstrations', 'Stay indoors', 'Contact embassy'],
    terrorism: ['Run, Hide, Fight (in that order)', 'Leave belongings', 'Silence phone'],
    natural_disaster: ['Follow evacuation orders', 'Move to high ground (flood)', 'Drop, Cover, Hold On (earthquake)'],
    nuclear: ['Seek underground shelter', 'Seal windows and doors', 'Take iodine if instructed'],
    biochemical: ['Move upwind', 'Cover mouth and nose', 'Remove contaminated clothing'],
  }
  return instructions[type] || ['Follow local authority instructions']
}

export async function findNearbyShelters(lat: number, lng: number, radius: number = 10000): Promise<{
  shelters: Array<{
    id: string
    name: string
    type: string
    lat: number
    lng: number
    distance: number
  }>
  count: number
}> {
  try {
    const query = `[out:json][timeout:25];(
      node["emergency"="shelter"](around:${radius},${lat},${lng});
      node["building"="bunker"](around:${radius},${lat},${lng});
      node["civil_protection"="shelter"](around:${radius},${lat},${lng});
      node["amenity"="shelter"](around:${radius},${lat},${lng});
      node["emergency"="assembly_point"](around:${radius},${lat},${lng});
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="police"](around:${radius},${lat},${lng});
      node["amenity"="fire_station"](around:${radius},${lat},${lng});
      node["amenity"="embassy"](around:${radius},${lat},${lng});
      node["diplomatic"="embassy"](around:${radius},${lat},${lng});
    );out body center;`

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 600 },
    })

    if (!res.ok) return { shelters: [], count: 0 }
    const data = await res.json()

    const shelters = (data.elements || []).map((el: Record<string, unknown>) => {
      const tags = (el.tags || {}) as Record<string, string>
      const elLat = el.lat as number
      const elLng = el.lon as number
      const distance = haversine(lat, lng, elLat, elLng)

      return {
        id: `osm-${el.id}`,
        name: tags['name'] || tags['name:en'] || getShelterLabel(tags),
        type: getShelterCategory(tags),
        lat: elLat,
        lng: elLng,
        distance: Math.round(distance * 100) / 100,
      }
    }).sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance)

    return { shelters, count: shelters.length }
  } catch {
    return { shelters: [], count: 0 }
  }
}

function getShelterLabel(tags: Record<string, string>): string {
  if (tags['amenity'] === 'hospital') return 'Hospital'
  if (tags['amenity'] === 'police') return 'Police Station'
  if (tags['amenity'] === 'fire_station') return 'Fire Station'
  if (tags['amenity'] === 'embassy' || tags['diplomatic'] === 'embassy') return 'Embassy'
  if (tags['building'] === 'bunker') return 'Bunker'
  if (tags['emergency'] === 'assembly_point') return 'Assembly Point'
  return 'Shelter'
}

function getShelterCategory(tags: Record<string, string>): string {
  if (tags['amenity'] === 'hospital') return 'hospital'
  if (tags['amenity'] === 'police') return 'police'
  if (tags['amenity'] === 'fire_station') return 'fire_station'
  if (tags['amenity'] === 'embassy' || tags['diplomatic'] === 'embassy') return 'embassy'
  if (tags['building'] === 'bunker') return 'bunker'
  if (tags['emergency'] === 'assembly_point') return 'assembly_point'
  return 'shelter'
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
