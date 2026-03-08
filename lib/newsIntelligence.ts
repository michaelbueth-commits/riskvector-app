// BBC News API Service
// International news intelligence for comprehensive situational awareness

export interface BBCNewsArticle {
  title: string
  description?: string
  content?: string
  publishedAt: string
  url: string
  author?: string
  category?: string
  language: string
}

export interface NewsCategory {
  id: string
  name: string
  description?: string
}

class NewsIntelligenceService {
  private static instance: NewsIntelligenceService
  private baseUrl = 'https://bbc-news-api.vercel.app'
  
  private constructor() {}
  
  static getInstance(): NewsIntelligenceService {
    if (!NewsIntelligenceService.instance) {
      NewsIntelligenceService.instance = new NewsIntelligenceService()
    }
    return NewsIntelligenceService.instance
  }
  
  // Make API request
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`)
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`BBC News API request failed: ${error}`)
      return null
    }
  }
  
  // Get news by category
  async getNewsByCategory(category: string, language: string = 'en'): Promise<BBCNewsArticle[] | null> {
    return this.apiRequest<BBCNewsArticle[]>('/news', { category, language })
  }
  
  // Get latest news
  async getLatestNews(language: string = 'en', limit: number = 20): Promise<BBCNewsArticle[] | null> {
    return this.apiRequest<BBCNewsArticle[]>('/latest', { language, limit })
  }
  
  // Get supported languages
  async getSupportedLanguages(): Promise<string[] | null> {
    return this.apiRequest<string[]>('/languages')
  }
  
  // Get breaking news (filtered by recency and importance)
  async getBreakingNews(language: string = 'en'): Promise<BBCNewsArticle[] | null> {
    const latest = await this.getLatestNews(language, 10)
    if (!latest) return null
    
    // Filter for breaking news (published within last 6 hours)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
    return latest.filter(article => {
      const articleDate = new Date(article.publishedAt)
      return articleDate > sixHoursAgo
    })
  }
  
  // Get news by keyword in title or description
  async searchNews(keyword: string, language: string = 'en'): Promise<BBCNewsArticle[] | null> {
    const news = await this.getLatestNews(language, 50)
    if (!news) return null
    
    const lowerKeyword = keyword.toLowerCase()
    return news.filter(article => 
      article.title.toLowerCase().includes(lowerKeyword) ||
      (article.description && article.description.toLowerCase().includes(lowerKeyword))
    )
  }
  
  // Convert BBC news to crisis intelligence format
  convertToCrisisIntelligence(articles: BBCNewsArticle[]): any[] {
    return articles.map(article => ({
      id: `bbc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'news',
      title: article.title,
      description: article.description || article.content || '',
      location: this.extractLocation(article),
      severity: this.assessSeverity(article),
      timestamp: article.publishedAt,
      source: 'BBC News',
      url: article.url,
      category: article.category || 'general',
      language: article.language,
      metadata: {
        author: article.author,
        originalContent: article.content
      }
    }))
  }
  
  // Extract location from article text (simple keyword-based)
  private extractLocation(article: BBCNewsArticle): string {
    const text = `${article.title} ${article.description || ''}`.toLowerCase()
    
    // Common location keywords
    const locations = [
      'uk', 'britain', 'england', 'scotland', 'wales', 'northern ireland',
      'us', 'america', 'united states', 'europe', 'asia', 'africa', 'middle east',
      'germany', 'france', 'italy', 'spain', 'russia', 'china', 'japan',
      'india', 'pakistan', 'afghanistan', 'iran', 'iraq', 'syria', 'turkey',
      'egypt', 'libya', 'tunisia', 'algeria', 'morocco', 'nigeria', 'kenya',
      'south africa', 'brazil', 'argentina', 'mexico', 'canada', 'australia'
    ]
    
    for (const location of locations) {
      if (text.includes(location)) {
        return location
      }
    }
    
    return 'global'
  }
  
  // Assess severity based on keywords
  private assessSeverity(article: BBCNewsArticle): number {
    const text = `${article.title} ${article.description || ''}`.toLowerCase()
    
    const highSeverity = ['emergency', 'crisis', 'disaster', 'attack', 'explosion', 'terror', 'war', 'conflict', 'fatal', 'deadly']
    const mediumSeverity = ['warning', 'alert', 'danger', 'threat', 'serious', 'major', 'severe']
    const lowSeverity = ['update', 'report', 'news', 'story', 'developing', 'ongoing']
    
    if (highSeverity.some(word => text.includes(word))) return 3
    if (mediumSeverity.some(word => text.includes(word))) return 2
    if (lowSeverity.some(word => text.includes(word))) return 1
    
    return 1 // Default low severity
  }
}

// Export news intelligence service instance
export const newsIntelligenceService = NewsIntelligenceService.getInstance()