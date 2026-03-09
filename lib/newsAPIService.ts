// NewsAPI Integration Service
// Professional news feed with verified sources
// NO MOCK DATA - REAL-TIME ONLY

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  source: {
    id: string
    name: string
  }
  url: string
  urlToImage?: string
  category: string
  country?: string
  coordinates?: {
    lat: number
    lon: number
  }
  credibility: 'verified' | 'official' | 'unverified'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'minimal'
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

class NewsAPIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEWSAPI_API_KEY || 'demo-key' // In production, use environment variable
    this.baseUrl = 'https://newsapi.org/v2'
  }

  async fetchCrisisNews(countries?: string[], keywords: string[] = ['crisis', 'emergency', 'terror', 'disaster']): Promise<NewsArticle[]> {
    try {
      // Build search query with crisis-related keywords
      const searchQuery = keywords.join(' OR ')
      const countryFilter = countries?.length ? `&country=${countries.join(',')}` : ''
      
      const response = await fetch(
        `${this.baseUrl}/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=50${countryFilter}&apiKey=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`NewsAPI Error: ${response.status} ${response.statusText}`)
      }

      const data: NewsAPIResponse = await response.json()
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${data.status}`)
      }

      // Process and enhance articles with additional metadata
      const enhancedArticles = data.articles.map(article => {
        const crisisKeywords = keywords.filter(keyword => 
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          article.content?.toLowerCase().includes(keyword.toLowerCase())
        )

        const severity = this.determineSeverity(crisisKeywords, article.title)
        const credibility = this.determineCredibility(article.source.name)

        return {
          id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: article.title,
          description: article.description || '',
          content: article.content || '',
          author: article.author || article.source.name,
          publishedAt: article.publishedAt,
          source: article.source,
          url: article.url,
          urlToImage: article.urlToImage,
          category: this.categorizeArticle(article.title, article.description),
          country: this.extractCountry(article.title, article.description),
          credibility,
          severity
        }
      })

      return enhancedArticles.filter(article => 
        article.severity !== 'minimal' && // Filter out non-crisis content
        (countries.length === 0 || countries.includes(article.country || ''))
      )

    } catch (error) {
      console.error('Error fetching crisis news:', error)
      throw error
    }
  }

  private determineSeverity(keywords: string[], title: string): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
    const title_lower = title.toLowerCase()
    
    if (keywords.some(k => ['terror', 'attack', 'bombing', 'shooting'].includes(k.toLowerCase()))) {
      return 'critical'
    }
    if (keywords.some(k => ['emergency', 'disaster', 'evacuation'].includes(k.toLowerCase()))) {
      return 'high'
    }
    if (keywords.some(k => ['crisis', 'warning', 'alert'].includes(k.toLowerCase()))) {
      return 'medium'
    }
    if (keywords.some(k => ['incident', 'accident'].includes(k.toLowerCase()))) {
      return 'low'
    }
    return 'minimal'
  }

  private determineCredibility(sourceName: string): 'verified' | 'official' | 'unverified' {
    const officialSources = [
      'Reuters', 'Associated Press', 'AFP', 'BBC News', 'CNN',
      'Al Jazeera', 'Bloomberg', 'The Guardian', 'The New York Times'
    ]
    const verifiedSources = [
      'Reuters', 'Associated Press', 'AFP', 'BBC News', 'CNN',
      'Al Jazeera', 'Bloomberg', 'The Guardian', 'The New York Times',
      'Washington Post', 'Wall Street Journal', 'Financial Times'
    ]

    if (officialSources.includes(sourceName)) {
      return 'official'
    }
    if (verifiedSources.includes(sourceName)) {
      return 'verified'
    }
    return 'unverified'
  }

  private categorizeArticle(title: string, description?: string): string {
    const text = `${title} ${description || ''}`.toLowerCase()
    
    if (text.includes('terror') || text.includes('attack')) return 'Terrorism'
    if (text.includes('earthquake') || text.includes('flood') || text.includes('hurricane')) return 'Natural Disaster'
    if (text.includes('protest') || text.includes('riot')) return 'Political Crisis'
    if (text.includes('pandemic') || text.includes('virus') || text.includes('outbreak')) return 'Health Emergency'
    if (text.includes('accident') || text.includes('crash')) return 'Transportation'
    return 'General'
  }

  private extractCountry(title: string, description?: string): string | undefined {
    // Simple country extraction - in production, use geocoding service
    const text = `${title} ${description || ''}`
    
    // Common countries mentioned in crisis news
    const countryPatterns = [
      { name: 'Ukraine', pattern: /ukraine|kyiv/ },
      { name: 'Israel', pattern: /israel|gaza|palestine/ },
      { name: 'USA', pattern: /usa|america|united states/ },
      { name: 'Turkey', pattern: /turkey|turkiye|ankara/ },
      { name: 'Syria', pattern: /syria|damascus/ },
      { name: 'Afghanistan', pattern: /afghanistan|kabul/ },
      { name: 'Iraq', pattern: /iraq|baghdad/ },
      { name: 'Iran', pattern: /iran|tehran/ }
    ]

    for (const country of countryPatterns) {
      if (country.pattern.test(text)) {
        return country.name
      }
    }
    
    return undefined
  }
}

// Export singleton instance
export const newsAPIService = new NewsAPIService()