import { NextRequest, NextResponse } from 'next/server'
import { findNearbyShelters } from '@/lib/conflictAlertService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseInt(searchParams.get('radius') || '10000')
    const type = searchParams.get('type') || undefined

    if (!lat || !lng || (lat === 0 && lng === 0)) {
      return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 })
    }

    const result = await findNearbyShelters(lat, lng, radius)

    let shelters = result.shelters
    if (type) {
      shelters = shelters.filter(s => s.type === type)
    }

    return NextResponse.json({
      shelters,
      count: shelters.length,
      center: { lat, lng },
      radius,
      source: 'OpenStreetMap Overpass API',
    })
  } catch (error) {
    console.error('Shelters error:', error)
    return NextResponse.json({ shelters: [], count: 0, error: 'Failed to fetch shelters' }, { status: 500 })
  }
}
