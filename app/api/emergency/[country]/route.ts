import { NextRequest, NextResponse } from 'next/server'
import { findCountry } from '@/lib/emergency-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params
  const data = findCountry(decodeURIComponent(country))

  if (!data) {
    return NextResponse.json(
      { error: 'Country not found', available: Object.keys(data || {}) },
      { status: 404 }
    )
  }

  return NextResponse.json({
    country: data.country,
    general: data.general,
    police: data.police,
    ambulance: data.ambulance,
    fire: data.fire,
    poisonControl: data.poisonControl || null,
    coordinates: data.coordinates,
    germanEmbassy: data.germanEmbassy,
    emergencyPhrases: data.emergencyPhrases,
  })
}
