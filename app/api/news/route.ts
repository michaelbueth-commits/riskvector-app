import { NextResponse } from 'next/server'
import { fetchAllNews } from '@/lib/news-aggregator'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const source = searchParams.get('source')
    const country = searchParams.get('country')
    const limit = parseInt(searchParams.get('limit') || '50')

    let articles = await fetchAllNews()

    if (severity) {
      articles = articles.filter(a => a.severity === severity)
    }
    if (source) {
      articles = articles.filter(a => a.source.toLowerCase().includes(source.toLowerCase()))
    }
    if (country) {
      articles = articles.filter(a => 
        a.country.toLowerCase().includes(country.toLowerCase()) ||
        a.title.toLowerCase().includes(country.toLowerCase()) ||
        a.description.toLowerCase().includes(country.toLowerCase())
      )
    }

    return NextResponse.json({
      articles: articles.slice(0, limit),
      total: articles.length,
      sources: [...new Set(articles.map(a => a.source))],
      lastUpdated: new Date().toISOString(),
      note: 'Real news from RSS feeds: BBC, Al Jazeera, DW, WHO, ReliefWeb, GDACS, USGS',
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({ error: 'Failed to fetch news', articles: [] }, { status: 500 })
  }
}
