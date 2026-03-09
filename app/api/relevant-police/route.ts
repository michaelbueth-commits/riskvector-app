import { NextResponse } from 'next/server'
import RegionalPoliceService, { LocalPoliceReport } from '@/lib/regionalPolice'

const policeService = RegionalPoliceService.getInstance()

interface RelevantPoliceResponse {
  reports: LocalPoliceReport[]
  metadata: {
    totalReports: number
    highSeverityCount: number
    mediumSeverityCount: number
    lastUpdated: string
  }
}

export async function GET() {
  try {
    // Get relevant police reports from all supported cities
    const supportedCities = policeService.getSupportedCities()
    
    // Fetch reports from all cities
    const cityReportPromises = supportedCities.map(async (city) => {
      try {
        const reports = await policeService.getLatestReports(city.key, 50)
        return reports.map(report => ({
          ...report,
          cityKey: city.key,
          cityName: city.name
        }))
      } catch (error) {
        console.warn(`Could not fetch reports for ${city.name}:`, error)
        return []
      }
    })

    const allReports = await Promise.all(cityReportPromises)
    const flatReports = allReports.flat()

    // Filter and sort by relevance
    const relevantReports = flatReports
      // Only include HIGH and MEDIUM severity reports
      .filter(report => 
        report.severity === 'HIGH' || 
        report.severity === 'MEDIUM' ||
        (report.severity === 'LOW' && report.category === 'FRAUD')
      )
      // Sort by severity and timestamp (most recent first)
      .sort((a, b) => {
        const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
        const severityDiff = severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]
        
        if (severityDiff !== 0) return -severityDiff // Reverse to have HIGH first
        
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
      // Take top 20 reports
      .slice(0, 20)

    const metadata = {
      totalReports: relevantReports.length,
      highSeverityCount: relevantReports.filter(r => r.severity === 'HIGH').length,
      mediumSeverityCount: relevantReports.filter(r => r.severity === 'MEDIUM').length,
      lastUpdated: new Date().toISOString()
    }

    const response: RelevantPoliceResponse = {
      reports: relevantReports,
      metadata
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching relevant police reports:', error)
    
    return NextResponse.json({
      error: 'Fehler beim Abrufen der Polizeimeldungen',
      reports: [],
      metadata: {
        totalReports: 0,
        highSeverityCount: 0,
        mediumSeverityCount: 0,
        lastUpdated: new Date().toISOString()
      }
    }, { status: 500 })
  }
}