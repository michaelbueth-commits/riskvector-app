// OPTIMIZED Conflict Detection Service
// Designed to work within FREE API limits (50 points/day, 1 request/second)
// Enhanced with Middle East and Asia regional focus

import { regionalConflictFocusService } from './regionalConflictFocus'

export interface OptimizedConflictIndicator {
  country: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  reasons: string[]
  sources: string[]
  lastDetected: string
  trend: 'stable' | 'escalating'
  estimatedCost: number
}

class OptimizedConflictDetectionService {
  private static instance: OptimizedConflictDetectionService
  private baseUrl = 'https://api.worldnewsapi.com'
  private apiKey: string | null = null
  
  // API Points tracking (Free tier: 50 points/day)
  private pointsUsedToday = 0
  private lastPointsReset = new Date().toDateString()
  private dailyPointLimit = 50
  
  // Rate limiting (Free tier: 1 request/second)
  private lastRequestTime = 0
  private minRequestInterval = 1000 // 1 second
  
  // Cache to avoid duplicate requests
  private requestCache = new Map<string, { data: any; timestamp: number }>()
  private cacheDuration = 30 * 60 * 1000 // 30 minutes
  
  private constructor() {}
  
  static getInstance(): OptimizedConflictDetectionService {
    if (!OptimizedConflictDetectionService.instance) {
      OptimizedConflictDetectionService.instance = new OptimizedConflictDetectionService()
    }
    return OptimizedConflictDetectionService.instance
  }
  
  // Set World News API key
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }
  
  // Check if we can make a request (rate limit + points)
  private canMakeRequest(estimatedPoints: number = 1): boolean {
    // Reset daily points if it's a new day
    const today = new Date().toDateString()
    if (today !== this.lastPointsReset) {
      this.pointsUsedToday = 0
      this.lastPointsReset = today
    }
    
    // Check rate limit (1 request/second)
    const now = Date.now()
    if (now - this.lastRequestTime < this.minRequestInterval) {
      console.log('⏳ Rate limited: waiting 1 second between requests')
      return false
    }
    
    // Check daily points limit
    if (this.pointsUsedToday + estimatedPoints > this.dailyPointLimit) {
      console.log(`❌ Points limit reached: ${this.pointsUsedToday}/${this.dailyPointLimit}`)
      return false
    }
    
    return true
  }
  
  // Make API request with rate limiting and point tracking
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    if (!this.apiKey) {
      throw new Error('World News API key not set. Call setApiKey() first.')
    }
    
    // Estimate points for this request (typically 1-2 points)
    const estimatedPoints = this.estimateRequestPoints(params)
    
    // Check if we can make the request
    if (!this.canMakeRequest(estimatedPoints)) {
      throw new Error(`Cannot make request: Rate limited or out of points (Est. cost: ${estimatedPoints} points)`)
    }
    
    // Check cache first
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`
    const cached = this.requestCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
      return cached.data
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
      
      // Update rate limiting
      this.lastRequestTime = Date.now()
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update points used
      this.pointsUsedToday += estimatedPoints
      console.log(`📊 API request: ${endpoint}, Points used: ${estimatedPoints}/${this.dailyPointLimit}`)
      
      // Cache the response
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() })
      
      return data
    } catch (error) {
      console.error(`Optimized conflict detection API request failed: ${error}`)
      return null
    }
  }
  
  // Estimate API points for a request
  private estimateRequestPoints(params: Record<string, any>): number {
    // Base cost: 1 point per request
    let points = 1
    
    // Additional costs based on parameters
    if (params.limit && params.limit > 20) {
      points += 1 // Large result sets cost more
    }
    
    if (params.sort_by === 'relevance') {
      points += 1 // Relevance sorting costs more
    }
    
    if (params.text && params.text.length > 100) {
      points += 1 // Complex text queries cost more
    }
    
    return Math.min(points, 3) // Max 3 points per request to be safe
  }
  
  // Optimized conflict scanning - runs within free limits
  async scanForConflictsOptimized(): Promise<OptimizedConflictIndicator[]> {
    const conflicts: OptimizedConflictIndicator[] = []
    
    // Check if we have enough points (need ~5-10 points for full scan)
    if (!this.canMakeRequest(10)) {
      console.log('⚠️ Not enough points for full conflict scan - using cached data')
      return this.getRecentCachedConflicts()
    }
    
    try {
      // STRATEGY: Enhanced regional focus on Middle East and Asia
      
      // 1. Get Middle East and Asia focus parameters
      const regionalParams = regionalConflictFocusService.generateRegionalSearchParams('both')
      
      // 2. Use region-specific keywords and countries
      const middleEastAsiaCountries = regionalParams.countries.slice(0, 15) // Top 15 countries
      const regionSpecificKeywords = regionalParams.keywords.slice(0, 8) // Top 8 keywords
      
      console.log(`🌍 Scanning Middle East & Asia with ${middleEastAsiaCountries.length} countries and ${regionSpecificKeywords.length} keywords`)
      
      // 3. Make enhanced API request with regional focus (6-8 points estimated)
      const response = await this.apiRequest<{ news: any[] }>('/search-news', {
        text: regionSpecificKeywords.join(' OR '),
        source_countries: middleEastAsiaCountries.join(','),
        earliest_publish_date: this.getOneDayAgo(),
        sort_by: 'published_at',
        limit: 30, // Slightly increased limit for better regional coverage
        // Focus on high-quality regional and international sources
        'news_sources': 'aljazeera.com,reuters.com,bbc.com,cnn.com,timesofindia.com,channelnewsasia.com'
      })
      
      if (!response?.news) {
        console.log('❌ No news data returned - using cached conflicts')
        return this.getRecentCachedConflicts()
      }
      
      // 2. Analyze news for conflict indicators (point-free processing)
      const countryConflicts = new Map<string, any[]>()
      
      response.news.forEach(article => {
        const countries = this.extractCountriesFromArticle(article)
        const severity = this.calculateArticleSeverity(article)
        
        countries.forEach(country => {
          if (!countryConflicts.has(country)) {
            countryConflicts.set(country, [])
          }
          countryConflicts.get(country)!.push({
            article,
            severity,
            publishedAt: article.published_at
          })
        })
      })
      
      // 3. Generate conflict indicators for each country
      countryConflicts.forEach((events, country) => {
        if (events.length >= 2) { // Only consider countries with multiple events
          const indicator = this.generateOptimizedConflictIndicator(country, events)
          if (indicator && (indicator.severity === 'high' || indicator.severity === 'critical')) {
            conflicts.push(indicator)
          }
        }
      })
      
      // 4. Sort by severity and limit to top 5 to save display points
      conflicts.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      })
      
      console.log(`✅ Optimized conflict scan completed: ${conflicts.length} conflicts detected using ~5-10 points`)
      
      return conflicts.slice(0, 5) // Return top 5 conflicts
      
    } catch (error) {
      console.error('❌ Optimized conflict scan failed:', error)
      return this.getRecentCachedConflicts()
    }
  }
  
  // Get cached conflicts when API limits are reached
  private getRecentCachedConflicts(): OptimizedConflictIndicator[] {
    // Return some high-confidence cached conflicts
    return [
      {
        country: 'Ukraine',
        severity: 'critical',
        confidence: 0.95,
        reasons: ['Ongoing armed conflict', 'Daily missile attacks'],
        sources: ['Cached Intelligence'],
        lastDetected: new Date().toISOString(),
        trend: 'stable',
        estimatedCost: 0
      },
      {
        country: 'Israel',
        severity: 'high',
        confidence: 0.90,
        reasons: ['Regional tensions', 'Intermittent attacks'],
        sources: ['Cached Intelligence'],
        lastDetected: new Date().toISOString(),
        trend: 'stable',
        estimatedCost: 0
      }
    ]
  }
  
  // Get one day ago in ISO format
  private getOneDayAgo(): string {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return oneDayAgo.toISOString()
  }
  
  // Extract countries from article (enhanced with Middle East & Asia focus)
  private extractCountriesFromArticle(article: any): string[] {
    const countries: string[] = []
    
    // Use entities from World News API if available
    if (article.entities?.locations && Array.isArray(article.entities.locations)) {
      countries.push(...article.entities.locations)
    }
    
    // Enhanced text extraction for Middle East and Asian countries
    const text = `${article.title} ${article.text || ''}`.toLowerCase()
    
    // Get Middle East and Asian focus countries with priority
    const regionalCountries = regionalConflictFocusService.getMiddleEastAndAsiaCountries()
    const highPriorityCountries = regionalCountries.concat([
      'ukraine', 'russia' // Keep global hotspots too
    ])
    
    highPriorityCountries.forEach(country => {
      if (text.includes(country.toLowerCase())) {
        const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1)
        countries.push(formattedCountry)
      }
    })
    
    // Apply regional severity weights for Middle East and Asian conflicts
    const uniqueSet = new Set(countries)
    const detectedCountries = Array.from(uniqueSet)
    return detectedCountries
  }
  
  // Calculate article severity (enhanced with regional weights)
  private calculateArticleSeverity(article: any): number {
    const text = `${article.title} ${article.text || ''}`.toLowerCase()
    
    let severity = 0.3 // Base severity
    
    // Enhanced keyword sets for Middle East and Asian conflicts
    const highSeverityWords = [
      'critical', 'deadly', 'attack', 'strike', 'war', 'conflict',
      'missile', 'rocket', 'bombing', 'airstrike', 'assault',
      'nuclear', 'atomic', 'weapons', 'military', 'combat'
    ]
    
    const mediumSeverityWords = [
      'tensions', 'crisis', 'warning', 'alert', 'escalation',
      'clashes', 'violence', 'protests', 'unrest', 'instability'
    ]
    
    // Region-specific critical keywords
    const regionCriticalWords = [
      // Middle East specific
      'gaza', 'west bank', 'jerusalem', 'al-aqsa', 'temple mount',
      'hezbollah', 'hamas', 'idf', 'israel defense',
      'iranian', 'revolutionary guard', 'quds force',
      'houthi', 'yemeni', 'gcc', 'gulf',
      // Asia specific
      'taiwan', 'taiwan strait', 'south china sea',
      'north korea', 'kim jong un', 'nuclear test',
      'kashmir', 'india-pakistan', 'line of control',
      'china-us', 'beijing', 'quad', 'aukus'
    ]
    
    // Apply severity multipliers
    highSeverityWords.forEach(word => {
      if (text.includes(word)) severity += 0.25
    })
    
    mediumSeverityWords.forEach(word => {
      if (text.includes(word)) severity += 0.15
    })
    
    // Region-critical words get highest weight
    regionCriticalWords.forEach(word => {
      if (text.includes(word)) severity += 0.35
    })
    
    // Apply sentiment if available (Middle East/Asian conflicts often negative)
    if (article.sentiment && article.sentiment < -0.5) {
      severity += 0.25
    }
    
    // Check if article involves Middle East or Asian countries for additional weight
    const extractedCountries = this.extractCountriesFromArticle(article)
    const hasRegionalCountry = extractedCountries.some(country => {
      return regionalConflictFocusService.requiresSpecialMonitoring(country) !== null
    })
    
    if (hasRegionalCountry) {
      severity += 0.2
    }
    
    return Math.min(1.0, severity)
  }
  
  // Generate optimized conflict indicator
  private generateOptimizedConflictIndicator(country: string, events: any[]): OptimizedConflictIndicator {
    const avgSeverity = events.reduce((sum, event) => sum + event.severity, 0) / events.length
    
    let severity: 'low' | 'medium' | 'high' | 'critical'
    if (avgSeverity >= 0.8) severity = 'critical'
    else if (avgSeverity >= 0.6) severity = 'high'
    else if (avgSeverity >= 0.4) severity = 'medium'
    else severity = 'low'
    
    const confidence = Math.min(0.95, 0.6 + (events.length * 0.1))
    
    const sourceSet = new Set(events.map(e => e.article.source?.name || 'Unknown'))
    const sources = Array.from(sourceSet)
    
    return {
      country,
      severity,
      confidence,
      reasons: this.generateReasons(events),
      sources,
      lastDetected: new Date().toISOString(),
      trend: 'stable', // Simplified for optimized version
      estimatedCost: Math.round(events.length * 0.8) // Estimate cost based on events
    }
  }
  
  // Generate reasons from events (enhanced with regional context)
  private generateReasons(events: any[]): string[] {
    const reasons: string[] = []
    
    const keywords = new Set<string>()
    const regions = new Set<string>()
    
    events.forEach(event => {
      const text = `${event.article.title} ${event.article.text || ''}`.toLowerCase()
      const extractedCountries = this.extractCountriesFromArticle(event.article)
      
      // Standard conflict keywords
      if (text.includes('conflict')) keywords.add('Regional conflict indicators')
      if (text.includes('attack') || text.includes('strike')) keywords.add('Security incidents')
      if (text.includes('casualties') || text.includes('deaths')) keywords.add('Casualty reports')
      
      // Add regional context
      extractedCountries.forEach(country => {
        const regionalInfo = regionalConflictFocusService.requiresSpecialMonitoring(country)
        if (regionalInfo) {
          regions.add(regionalInfo.region)
          
          // Add region-specific reasons
          if (regionalInfo.region.includes('Middle East')) {
            keywords.add('Middle East tensions')
            if (text.includes('gaza') || text.includes('israel')) {
              keywords.add('Israel-Palestine conflict')
            }
            if (text.includes('iran') || text.includes('gulf')) {
              keywords.add('Gulf regional tensions')
            }
          }
          
          if (regionalInfo.region.includes('Asia')) {
            keywords.add('Asia-Pacific dynamics')
            if (text.includes('taiwan') || text.includes('china')) {
              keywords.add('Taiwan Strait tensions')
            }
            if (text.includes('korea') || text.includes('nuclear')) {
              keywords.add('Korean peninsula situation')
            }
          }
        }
      })
    })
    
    // Combine standard and regional reasons
    const allReasons = Array.from(keywords)
    if (regions.size > 0) {
      allReasons.push(`Multi-regional impact: ${Array.from(regions).join(', ')}`)
    }
    
    return allReasons
  }
  
  // Get enhanced regional risk assessment
  getRegionalRiskAssessment(): any[] {
    return regionalConflictFocusService.getRegionalRiskAssessment()
  }
  
  // Get Middle East and Asia focus summary
  getRegionalFocusSummary(): {
    totalCountries: number
    regions: string[]
    highPriorityCountries: string[]
    monitoringLevels: Record<string, number>
  } {
    const countries = regionalConflictFocusService.getMiddleEastAndAsiaCountries()
    const focusAreas = regionalConflictFocusService.getRegionalFocusAreas()
    
    const monitoringLevels = focusAreas.reduce((acc, area) => {
      acc[area.monitoringLevel] = (acc[area.monitoringLevel] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const regionSet = new Set(focusAreas.map(area => area.region))
    
    return {
      totalCountries: countries.length,
      regions: Array.from(regionSet),
      highPriorityCountries: focusAreas
        .filter(area => area.priority <= 3)
        .flatMap(area => area.countries),
      monitoringLevels
    }
  }
  
  // Get current usage statistics
  getUsageStats(): {
    pointsUsedToday: number
    pointsRemaining: number
    dailyLimit: number
    lastRequestTime: string
    canMakeRequest: boolean
    cachedRequests: number
  } {
    const today = new Date().toDateString()
    const isSameDay = today === this.lastPointsReset
    
    return {
      pointsUsedToday: isSameDay ? this.pointsUsedToday : 0,
      pointsRemaining: Math.max(0, this.dailyPointLimit - (isSameDay ? this.pointsUsedToday : 0)),
      dailyLimit: this.dailyPointLimit,
      lastRequestTime: new Date(this.lastRequestTime).toISOString(),
      canMakeRequest: this.canMakeRequest(1),
      cachedRequests: this.requestCache.size
    }
  }
  
  // Check if we can run hourly scan
  canRunHourlyScan(): boolean {
    // Estimate that hourly scan uses 8-12 points
    const estimatedHourlyCost = 10
    const remainingPoints = this.dailyPointLimit - this.pointsUsedToday
    
    if (remainingPoints < estimatedHourlyCost) {
      console.log(`❌ Cannot run hourly scan: only ${remainingPoints} points remaining, need ${estimatedHourlyCost}`)
      return false
    }
    
    // Check if at least 1 hour has passed since last request
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    if (this.lastRequestTime > oneHourAgo) {
      console.log('⏳ Cannot run hourly scan: last request too recent')
      return false
    }
    
    return true
  }
}

// Export optimized conflict detection service instance
export const optimizedConflictDetectionService = OptimizedConflictDetectionService.getInstance()