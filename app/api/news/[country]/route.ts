import { NextResponse } from 'next/server'
import { fetchCountryNews } from '@/lib/news-aggregator'

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const country = decodeURIComponent(params.country)
    const articles = await fetchCountryNews(country)

    return NextResponse.json({
      country,
      articles,
      count: articles.length,
      sources: [...new Set(articles.map(a => a.source))],
      lastUpdated: new Date().toISOString(),
      note: 'Real news from RSS feeds: BBC, Al Jazeera, DW, WHO, ReliefWeb, GDACS, USGS',
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({ error: 'Failed to fetch news', articles: [] }, { status: 500 })
  }
}
