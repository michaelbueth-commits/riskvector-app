export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { globalPoliceService } from '@/lib/globalPoliceService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'reports', 'stations', 'stats', 'search'
    const limit = parseInt(searchParams.get('limit') || '20')
    const query = searchParams.get('query') || ''
    const category = searchParams.get('category') || ''
    const severity = searchParams.get('severity') || ''

    if (type === 'stats') {
      const stats = await globalPoliceService.getGlobalStats()
      return NextResponse.json({
        success: true,
        stats
      })
    }

    if (type === 'reports') {
      if (category) {
        const reports = await globalPoliceService.getReportsByCategory(category, limit)
        return NextResponse.json({
          success: true,
          category,
          reports,
          count: reports.length
        })
      }

      if (severity) {
        const reports = await globalPoliceService.getReportsBySeverity(severity, limit)
        return NextResponse.json({
          success: true,
          severity,
          reports,
          count: reports.length
        })
      }

      const reports = await globalPoliceService.getRecentReports(limit)
      return NextResponse.json({
        success: true,
        reports,
        count: reports.length,
        note: 'Most recent police reports globally'
      })
    }

    if (type === 'stations' && query) {
      const stations = await globalPoliceService.searchStations(query)
      return NextResponse.json({
        success: true,
        query,
        stations,
        count: stations.length
      })
    }

    if (type === 'emergency') {
      const countryCode = searchParams.get('country') || 'US'
      const emergencyNumber = await globalPoliceService.getEmergencyNumber(countryCode)
      return NextResponse.json({
        success: true,
        countryCode,
        emergencyNumber,
        note: 'International emergency number for this country'
      })
    }

    // Default: return global overview
    const [stats, reports] = await Promise.all([
      globalPoliceService.getGlobalStats(),
      globalPoliceService.getRecentReports(10)
    ])

    return NextResponse.json({
      success: true,
      global: {
        stats,
        recentReports: reports
      },
      endpoints: {
        stations: '/api/police/global?type=stations&query={search}',
        reports: '/api/police/global?type=reports',
        stats: '/api/police/global?type=stats',
        emergency: '/api/police/global?type=emergency&country={code}',
        country: '/api/police/global/{countryCode}',
        categories: Object.keys(stats).length > 0 ? 'Available via category filter' : 'TRAFFIC, THEFT, ASSAULT, etc.'
      }
    })

  } catch (error) {
    console.error('Global police API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch global police data'
    }, { status: 500 })
  }
}