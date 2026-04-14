import { NextRequest, NextResponse } from 'next/server'

interface Facility {
  name: string
  type: string
  address: string
  phone: string
  lat: number
  lng: number
  distance: number
  openingHours?: string
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const type = searchParams.get('type') || 'hospital'

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const amenityMap: Record<string, string> = {
    hospital: 'hospital',
    pharmacy: 'pharmacy',
    clinic: 'clinic',
    doctors: 'doctors',
  }

  const amenity = amenityMap[type] || 'hospital'
  const radius = 10000

  const query = `[out:json][timeout:25];(node["amenity"="${amenity}"](around:${radius},${lat},${lng});way["amenity"="${amenity}"](around:${radius},${lat},${lng}););out body center;`

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()

    const facilities: Facility[] = data.elements
      .map((el: any) => {
        const elLat = el.lat || el.center?.lat
        const elLng = el.lon || el.center?.lon
        if (!elLat || !elLng) return null

        const tags = el.tags || {}
        const name = tags['name'] || tags['name:en'] || tags['name:de'] || `${type.charAt(0).toUpperCase() + type.slice(1)}`
        const addr = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean).join(' ')
        const phone = tags['phone'] || tags['contact:phone'] || ''
        const openingHours = tags['opening_hours'] || undefined

        return {
          name,
          type,
          address: addr || 'Adresse nicht verfügbar',
          phone,
          lat: elLat,
          lng: elLng,
          distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
          openingHours,
        }
      })
      .filter(Boolean)
      .sort((a: Facility, b: Facility) => a.distance - b.distance)
      .slice(0, 10)

    return NextResponse.json({ facilities, count: facilities.length })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch facilities', details: error.message },
      { status: 500 }
    )
  }
}
