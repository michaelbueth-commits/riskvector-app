// World News API Service
// Global news aggregator for comprehensive international intelligence

export interface GlobalNewsArticle {
  id: string
  title: string
  text: string
  summary?: string
  url: string
  published_at: string
  author: string
  source: {
    id: string
    name: string
    country: string
    domain: string
  }
  sentiment?: number
  language: string
  categories?: string[]
  entities?: {
    persons: string[]
    organizations: string[]
    locations: string[]
  }
  image_url?: string
  video_url?: string
}

export interface NewsFilterOptions {
  text?: string
  title?: string
  source_country?: string
  language?: string
  source_domains?: string[]
  authors?: string[]
  min_sentiment?: number
  max_sentiment?: number
  earliest_publish_date?: string
  latest_publish_date?: string
  location_filter?: string // lat,lng,radius
  categories?: string[]
  entities?: string
  news_sources?: string[]
  sort_by?: 'published_at' | 'relevance' | 'sentiment'
  sort_direction?: 'asc' | 'desc'
  page?: number
  limit?: number
}

class GlobalNewsIntelligenceService {
  private static instance: GlobalNewsIntelligenceService
  private baseUrl = 'https://api.worldnewsapi.com'
  private apiKey: string | null = null
  
  private constructor() {}
  
  static getInstance(): GlobalNewsIntelligenceService {
    if (!GlobalNewsIntelligenceService.instance) {
      GlobalNewsIntelligenceService.instance = new GlobalNewsIntelligenceService()
    }
    return GlobalNewsIntelligenceService.instance
  }
  
  // Set World News API key
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }
  
  // Make API request
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    if (!this.apiKey) {
      throw new Error('World News API key not set. Call setApiKey() first.')
    }
    
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`)
      
      // Add API key
      url.searchParams.append('api_key', this.apiKey)
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, String(item)))
          } else {
            url.searchParams.append(key, String(value))
          }
        }
      })
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`World News API request failed: ${error}`)
      return null
    }
  }
  
  // Search news with advanced filtering
  async searchNews(options: NewsFilterOptions): Promise<{ news: GlobalNewsArticle[], total_results?: number } | null> {
    return this.apiRequest<{ news: GlobalNewsArticle[], total_results?: number }>('/search-news', options)
  }
  
  // Get top news by country
  async getTopNews(country: string, date?: string): Promise<{ top_news: GlobalNewsArticle[] } | null> {
    return this.apiRequest<{ top_news: GlobalNewsArticle[] }>('/top-news', {
      source_country: country,
      date: date || new Date().toISOString().split('T')[0]
    })
  }
  
  // Get news by location (geospatial search)
  async getNewsByLocation(lat: number, lng: number, radius: number, options: Omit<NewsFilterOptions, 'location_filter'> = {}): Promise<{ news: GlobalNewsArticle[] } | null> {
    return this.apiRequest<{ news: GlobalNewsArticle[] }>('/search-news', {
      location_filter: `${lat},${lng},${radius}`,
      ...options
    })
  }
  
  // Get breaking news (recent, high-impact news)
  async getBreakingNews(options: NewsFilterOptions = {}): Promise<{ news: GlobalNewsArticle[] } | null> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    return this.apiRequest<{ news: GlobalNewsArticle[] }>('/search-news', {
      latest_publish_date: oneHourAgo,
      sort_by: 'published_at',
      sort_direction: 'desc',
      limit: 20,
      ...options
    })
  }
  
  // Get news by specific sources (BBC, CNN, Reuters, AFP, etc.)
  async getNewsBySources(sources: string[], options: Omit<NewsFilterOptions, 'news_sources'> = {}): Promise<{ news: GlobalNewsArticle[] } | null> {
    return this.apiRequest<{ news: GlobalNewsArticle[] }>('/search-news', {
      news_sources: sources,
      ...options
    })
  }
  
  // Get news with sentiment analysis (positive/negative sentiment)
  async getSentimentNews(minSentiment: number, maxSentiment: number, options: Omit<NewsFilterOptions, 'min_sentiment' | 'max_sentiment'> = {}): Promise<{ news: GlobalNewsArticle[] } | null> {
    return this.apiRequest<{ news: GlobalNewsArticle[] }>('/search-news', {
      min_sentiment: minSentiment,
      max_sentiment: maxSentiment,
      ...options
    })
  }
  
  // Get geo coordinates for a location
  async getGeoCoordinates(location: string, language: string = 'en'): Promise<{ latitude: number, longitude: number } | null> {
    return this.apiRequest<{ latitude: number, longitude: number }>('/geo-coordinates', {
      location,
      language
    })
  }
  
  // Get news about specific entities (people, organizations, locations)
  async getNewsAboutEntities(entities: string[], options: NewsFilterOptions = {}): Promise<{ news: GlobalNewsArticle[] } | null> {
    const entitiesParam = entities.map(e => `ENT:${e}`).join(' OR ')
    
    return this.apiRequest<{ news: GlobalNewsArticle[] }>('/search-news', {
      text: entitiesParam,
      ...options
    })
  }
  
  // Convert global news to crisis intelligence format
  convertToCrisisIntelligence(articles: GlobalNewsArticle[]): any[] {
    return articles.map(article => ({
      id: `global-${article.id}`,
      type: 'news',
      title: article.title,
      description: article.summary || article.text.substring(0, 300) + '...',
      location: this.extractLocation(article),
      severity: this.calculateSeverity(article),
      timestamp: article.published_at,
      source: article.source.name,
      url: article.url,
      category: this.getPrimaryCategory(article),
      language: article.language,
      sentiment: article.sentiment,
      metadata: {
        author: article.author,
        sourceCountry: article.source.country,
        entities: article.entities,
        imageUrl: article.image_url,
        videoUrl: article.video_url
      }
    }))
  }
  
  // Extract primary location from article
  private extractLocation(article: GlobalNewsArticle): string {
    if (article.entities?.locations && article.entities.locations.length > 0) {
      return article.entities.locations[0]
    }
    
    // Use source country as fallback
    return article.source.country || 'global'
  }
  
  // Calculate severity based on content and sentiment
  private calculateSeverity(article: GlobalNewsArticle): number {
    let severity = 1
    
    const text = `${article.title} ${article.text}`.toLowerCase()
    
    // High severity keywords
    const highSeverity = [
      'emergency', 'crisis', 'disaster', 'attack', 'explosion', 'terror', 'war',
      'conflict', 'fatal', 'deadly', 'catastrophe', 'devastating', 'tragedy'
    ]
    
    // Medium severity keywords
    const mediumSeverity = [
      'warning', 'alert', 'danger', 'threat', 'serious', 'major', 'severe',
      'incident', 'accident', 'clash', 'tension', 'protest'
    ]
    
    // Check sentiment (negative news often indicates higher severity)
    if (article.sentiment && article.sentiment < -0.5) {
      severity += 1
    }
    
    // Check keywords
    if (highSeverity.some(word => text.includes(word))) {
      severity = 3
    } else if (mediumSeverity.some(word => text.includes(word))) {
      severity = 2
    }
    
    return Math.min(severity, 3) // Cap at 3
  }
  
  // Get primary category from article
  private getPrimaryCategory(article: GlobalNewsArticle): string {
    if (article.categories && article.categories.length > 0) {
      return article.categories[0]
    }
    
    // Category detection based on content
    const text = `${article.title} ${article.text}`.toLowerCase()
    
    if (text.includes('war') || text.includes('conflict') || text.includes('military')) {
      return 'conflict'
    }
    
    if (text.includes('disaster') || text.includes('emergency') || text.includes('catastrophe')) {
      return 'disaster'
    }
    
    if (text.includes('health') || text.includes('disease') || text.includes('pandemic')) {
      return 'health'
    }
    
    if (text.includes('politics') || text.includes('government') || text.includes('election')) {
      return 'politics'
    }
    
    return 'general'
  }
}

// Export global news intelligence service instance
export const globalNewsIntelligenceService = GlobalNewsIntelligenceService.getInstance()