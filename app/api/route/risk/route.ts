import { NextResponse } from 'next/server'
import { calculateRouteRisk } from '@/lib/news-aggregator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destinations, startDate, endDate } = body

    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json({ error: 'destinations array required' }, { status: 400 })
    }

    if (destinations.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 destinations' }, { status: 400 })
    }

    const result = await calculateRouteRisk(destinations, startDate, endDate)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Route risk error:', error)
    return NextResponse.json({ error: 'Failed to calculate route risk' }, { status: 500 })
  }
}
