import { NextResponse } from 'next/server'
import { globalPoliceService } from '@/lib/globalPoliceService'

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const countryCode = params.countryCode.toUpperCase()
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const type = searchParams.get('type') // 'stations' or 'reports' or 'system'
    const limit = parseInt(searchParams.get('limit') || '20')

    if (type === 'system') {
      const system = await globalPoliceService.getCountrySystem(countryCode)
      if (!system) {
        return NextResponse.json({
          success: false,
          error: 'Country system not found',
          countryCode
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        system
      })
    }

    if (type === 'stations') {
      if (city) {
        const stations = await globalPoliceService.getStationsByCity(city, countryCode)
        return NextResponse.json({
          success: true,
          countryCode,
          city,
          stations,
          count: stations.length
        })
      } else {
        const stations = await globalPoliceService.getStationsByCountry(countryCode)
        return NextResponse.json({
          success: true,
          countryCode,
          stations,
          count: stations.length
        })
      }
    }

    if (type === 'reports') {
      if (city) {
        const reports = await globalPoliceService.getReportsByCity(city, countryCode, limit)
        return NextResponse.json({
          success: true,
          countryCode,
          city,
          reports,
          count: reports.length
        })
      } else {
        const reports = await globalPoliceService.getReportsByCountry(countryCode, limit)
        return NextResponse.json({
          success: true,
          countryCode,
          reports,
          count: reports.length
        })
      }
    }

    // If no specific type, return everything for the country
    const [stations, reports, system] = await Promise.all([
      globalPoliceService.getStationsByCountry(countryCode),
      globalPoliceService.getReportsByCountry(countryCode, limit),
      globalPoliceService.getCountrySystem(countryCode)
    ])

    return NextResponse.json({
      success: true,
      countryCode,
      stations: {
        data: stations,
        count: stations.length
      },
      reports: {
        data: reports,
        count: reports.length
      },
      system: system || {
        countryCode,
        emergencyNumber: await globalPoliceService.getEmergencyNumber(countryCode),
        note: 'Basic info available'
      }
    })

  } catch (error) {
    console.error('Global police API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch police data',
      countryCode: params.countryCode
    }, { status: 500 })
  }
}