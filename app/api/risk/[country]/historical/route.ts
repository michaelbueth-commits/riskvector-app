import { NextResponse } from 'next/server'

interface HistoricalDataPoint {
  date: string
  riskScore: number
  alerts: number
  policeReports: number
  category: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL'
}

// Generate mock historical data for the last 30 days
function generateHistoricalData(country: string, city?: string): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const today = new Date()
  
  // Base risk score depending on country
  const baseRiskScores: { [key: string]: number } = {
    'Ukraine': 85,
    'Israel': 75,
    'Russia': 70,
    'Iran': 65,
    'Afghanistan': 60,
    'Syria': 58,
    'Yemen': 55,
    'Somalia': 52,
    'Germany': 15,
    'France': 18,
    'USA': 12,
    'Japan': 8,
    'Canada': 10,
    'Australia': 9
  }
  
  const baseScore = baseRiskScores[country] || 20
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Add some realistic variance
    const variance = (Math.random() - 0.5) * 20
    const trendFactor = Math.sin(i / 30 * Math.PI) * 10 // Create a trend
    const riskScore = Math.max(0, Math.min(100, baseScore + variance + trendFactor))
    
    // Determine risk category
    let category: HistoricalDataPoint['category'] = 'MINIMAL'
    if (riskScore > 80) category = 'CRITICAL'
    else if (riskScore > 60) category = 'HIGH'
    else if (riskScore > 40) category = 'MEDIUM'
    else if (riskScore > 20) category = 'LOW'
    
    // Random alerts and police reports (more in high risk countries)
    const baseAlerts = baseScore > 40 ? Math.random() * 3 : Math.random() * 1
    const baseReports = ['Germany', 'France', 'USA'].includes(country) ? Math.random() * 5 : Math.random() * 2
    
    data.push({
      date: date.toISOString().split('T')[0],
      riskScore: Math.round(riskScore),
      alerts: Math.floor(baseAlerts),
      policeReports: Math.floor(baseReports)
    })
  }
  
  return data
}

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = decodeURIComponent(params.country)
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || undefined
  const period = searchParams.get('period') || '30d' // 30d, 90d, 180d, 1y
  
  try {
    // In a real app, this would fetch from a time-series database
    const historicalData = generateHistoricalData(country, city)
    
    // Calculate some analytics
    const avgRiskScore = historicalData.reduce((sum, d) => sum + d.riskScore, 0) / historicalData.length
    const maxRiskScore = Math.max(...historicalData.map(d => d.riskScore))
    const minRiskScore = Math.min(...historicalData.map(d => d.riskScore))
    
    const totalAlerts = historicalData.reduce((sum, d) => sum + d.alerts, 0)
    const totalReports = historicalData.reduce((sum, d) => sum + d.policeReports, 0)
    
    // Find trend direction
    const recent = historicalData.slice(-7)
    const previous = historicalData.slice(-14, -7)
    const recentAvg = recent.reduce((sum, d) => sum + d.riskScore, 0) / recent.length
    const previousAvg = previous.reduce((sum, d) => sum + d.riskScore, 0) / previous.length
    const trend = recentAvg > previousAvg ? 'increasing' : recentAvg < previousAvg ? 'decreasing' : 'stable'
    
    return NextResponse.json({
      success: true,
      country,
      city,
      period,
      data: historicalData,
      analytics: {
        averageRiskScore: Math.round(avgRiskScore),
        maxRiskScore,
        minRiskScore,
        totalAlerts,
        totalPoliceReports: totalReports,
        trend,
        riskCategory: getRiskCategory(avgRiskScore)
      }
    })
  } catch (error) {
    console.error('Historical data API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical data'
    }, { status: 500 })
  }
}

function getRiskCategory(score: number): string {
  if (score > 80) return 'CRITICAL'
  if (score > 60) return 'HIGH'
  if (score > 40) return 'MEDIUM'
  if (score > 20) return 'LOW'
  return 'MINIMAL'
}