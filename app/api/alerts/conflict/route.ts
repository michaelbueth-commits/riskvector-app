import { NextRequest, NextResponse } from 'next/server'
import { fetchConflictAlerts } from '@/lib/conflictAlertService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const country = searchParams.get('country') || undefined
    const severity = searchParams.get('severity') || undefined
    const type = searchParams.get('type') || undefined

    const alerts = await fetchConflictAlerts(country)

    let filtered = alerts
    if (severity) {
      filtered = filtered.filter(a => a.severity === severity)
    }
    if (type) {
      filtered = filtered.filter(a => a.type === type)
    }

    return NextResponse.json({
      alerts: filtered,
      count: filtered.length,
      sources: [
        { name: 'ReliefWeb / UN OCHA', status: 'active', type: 'Humanitarian alerts' },
        { name: 'GDELT Project', status: 'active', type: 'Global conflict monitoring' },
      ],
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Conflict alerts error:', error)
    return NextResponse.json({
      alerts: [],
      count: 0,
      error: 'Failed to fetch conflict alerts',
      lastUpdate: new Date().toISOString(),
    }, { status: 500 })
  }
}
