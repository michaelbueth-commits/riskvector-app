export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { newsAPIService } from '@/lib/newsAPIService'

// News alerts endpoint with real-time data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch real crisis news from NewsAPI
    const articles = await newsAPIService.fetchCrisisNews(countries)
    
    // Convert to enhanced alert format
    const alerts = articles.slice(0, limit).map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      type: 'NEWS' as const,
      severity: article.severity.toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL',
      timestamp: article.publishedAt,
      source: article.source.name,
      location: article.country || 'Global',
      country: article.country || 'Global',
      url: article.url,
      coordinates: article.coordinates,
      verification: {
        level: article.credibility.toUpperCase() as 'OFFICIAL' | 'VERIFIED' | 'UNVERIFIED',
        method: 'API_VERIFICATION',
        confidence: article.credibility === 'official' ? 95 : 85,
        sources: [article.source.name]
      },
      classification: {
        primary: article.category.toUpperCase() as 'TERRORISM' | 'NATURAL_DISASTER' | 'POLITICAL_CRISIS' | 'HEALTH_EMERGENCY' | 'TRANSPORTATION',
        secondary: ['CRISIS_INTELLIGENCE', 'NEWS_MEDIA']
      },
      scope: {
        geographic: article.country ? 'COUNTRY_SPECIFIC' : 'GLOBAL',
        affected: article.country ? [article.country] : ['GLOBAL']
      },
      action: {
        type: article.severity === 'critical' ? 'MONITOR' : 'NONE',
        urgency: article.severity === 'critical' ? 'IMMEDIATE' : 'STANDARD',
        description: article.severity === 'critical' ? 'Monitor situation closely' : 'Awareness recommended'
      }
    }))

    return NextResponse.json({
      success: true,
      type: 'NEWS',
      alerts,
      count: alerts.length,
      sources: ['NewsAPI.org', 'Verified News Agencies'],
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    console.error('News API Error:', error)
    
    // Return error with details
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news alerts',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        message: 'NewsAPI service temporarily unavailable. Please check API key configuration.',
        count: 0
      }
    }, { status: 500 })
  }
}