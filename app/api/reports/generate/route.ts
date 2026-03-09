import { NextResponse } from 'next/server'
import { RealAlert } from '@/lib/alertsService'

interface ReportData {
  country: string
  city?: string
  title: string
  generatedAt: string
  riskScores: {
    overall: number
    weather: number
    political: number
    health: number
    infrastructure: number
  }
  alerts: RealAlert[]
  policeReports: any[]
  analytics: {
    averageRiskScore: number
    maxRiskScore: number
    minRiskScore: number
    totalAlerts: number
    totalPoliceReports: number
    trend: string
    riskCategory: string
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { country, city, format = 'pdf' } = body

    // Fetch current risk data
    const riskResponse = await fetch(`http://localhost:3000/api/risk/${encodeURIComponent(country)}`)
    const riskData = await riskResponse.json()

    // Fetch alerts
    const alertsResponse = await fetch('http://localhost:3000/api/alerts')
    const alertsData = await alertsResponse.json()
    const alerts: RealAlert[] = alertsData.alerts || []

    // Fetch police reports
    const policeResponse = await fetch('http://localhost:3000/api/relevant-police')
    const policeData = await policeResponse.json()
    const policeReports = policeData.reports || []

    // Fetch analytics data
    const analyticsResponse = await fetch(`http://localhost:3000/api/risk/${encodeURIComponent(country)}/historical`)
    const analyticsData = await analyticsResponse.json()

    // Prepare report data
    const reportData: ReportData = {
      country,
      city,
      title: `Risk Intelligence Report: ${city ? `${city}, ` : ''}${country}`,
      generatedAt: new Date().toISOString(),
      riskScores: {
        overall: riskData.overall || 0,
        weather: riskData.weather || 0,
        political: riskData.political || 0,
        health: riskData.health || 0,
        infrastructure: riskData.infrastructure || 0
      },
      alerts: alerts.slice(0, 20), // Top 20 alerts
      policeReports: policeReports.slice(0, 10), // Top 10 police reports
      analytics: analyticsData.analytics || {
        averageRiskScore: 0,
        maxRiskScore: 0,
        minRiskScore: 0,
        totalAlerts: 0,
        totalPoliceReports: 0,
        trend: 'stable',
        riskCategory: 'MINIMAL'
      }
    }

    // Generate report based on format
    if (format === 'pdf') {
      // For now, return JSON data - in production, this would generate a PDF
      return NextResponse.json({
        success: true,
        format: 'pdf',
        data: reportData,
        message: 'PDF report generation not yet implemented. Data available for download.'
      })
    } else if (format === 'excel') {
      // For now, return JSON data - in production, this would generate an Excel file
      return NextResponse.json({
        success: true,
        format: 'excel',
        data: reportData,
        message: 'Excel report generation not yet implemented. Data available for download.'
      })
    } else if (format === 'json') {
      // Return raw JSON data
      return NextResponse.json({
        success: true,
        format: 'json',
        data: reportData,
        download: true
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unsupported format'
    }, { status: 400 })

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate report'
    }, { status: 500 })
  }
}