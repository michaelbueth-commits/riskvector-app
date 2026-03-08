// Conflict Detection Service
// Automatically detects emerging or escalating conflicts to update risk assessments

export interface ConflictIndicator {
  country: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  reasons: string[]
  sources: string[]
  lastDetected: string
  trend: 'improving' | 'stable' | 'escalating' | 'emerging'
}

export interface ConflictPattern {
  keywords: string[]
  severityMultipliers: number[]
  contextRequirements: string[]
  minimumConfidence: number
}

class ConflictDetectionService {
  private static instance: ConflictDetectionService
  private baseUrl = 'https://api.worldnewsapi.com'
  private apiKey: string | null = null
  
  // Conflict detection patterns based on historical analysis
  private conflictPatterns: Map<string, ConflictPattern> = new Map([
    ['armed_conflict', {
      keywords: ['war', 'armed conflict', 'military operation', 'airstrike', 'missile attack', 'ground combat', 'invasion'],
      severityMultipliers: [0.8, 0.9, 1.0, 1.2],
      contextRequirements: ['casualties', 'military', 'government'],
      minimumConfidence: 0.7
    }],
    ['political_crisis', {
      keywords: ['coup', 'government collapse', 'political instability', 'revolution', 'civil unrest', 'protests'],
      severityMultipliers: [0.6, 0.7, 0.8, 0.9],
      contextRequirements: ['government', 'police', 'opposition'],
      minimumConfidence: 0.6
    }],
    ['terror_threat', {
      keywords: ['terrorism', 'bombing', 'attack', 'kidnapping', 'hostage', 'extremism'],
      severityMultipliers: [0.7, 0.8, 0.9, 1.0],
      contextRequirements: ['civilian', 'government', 'security'],
      minimumConfidence: 0.8
    }],
    ['regional_escalation', {
      keywords: ['escalation', 'tensions', 'border conflict', 'diplomatic crisis', 'regional war'],
      severityMultipliers: [0.9, 1.0, 1.1, 1.3],
      contextRequirements: ['multiple countries', 'military', 'diplomatic'],
      minimumConfidence: 0.8
    }]
  ])
  
  private constructor() {}
  
  static getInstance(): ConflictDetectionService {
    if (!ConflictDetectionService.instance) {
      ConflictDetectionService.instance = new ConflictDetectionService()
    }
    return ConflictDetectionService.instance
  }
  
  // Set World News API key for conflict detection
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
      console.error(`Conflict detection API request failed: ${error}`)
      return null
    }
  }
  
  // Scan for emerging or escalating conflicts
  async scanForConflicts(): Promise<ConflictIndicator[]> {
    const conflicts: ConflictIndicator[] = []
    
    // Get recent news with conflict-related keywords
    const conflictKeywords = [
      'war', 'conflict', 'attack', 'strike', 'military', 'casualties', 
      'bombing', 'missile', 'invasion', 'escalation', 'crisis'
    ]
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    const response = await this.apiRequest<{ news: any[] }>('/search-news', {
      text: conflictKeywords.join(' OR '),
      earliest_publish_date: sevenDaysAgo,
      sort_by: 'published_at',
      sort_direction: 'desc',
      limit: 100
    })
    
    if (!response?.news) return conflicts
    
    // Analyze news for conflict indicators
    const countryConflicts = new Map<string, any[]>()
    
    response.news.forEach(article => {
      const countries = this.extractCountries(article)
      const conflictType = this.analyzeConflictType(article)
      const severity = this.calculateConflictSeverity(article, conflictType)
      
      countries.forEach(country => {
        if (!countryConflicts.has(country)) {
          countryConflicts.set(country, [])
        }
        countryConflicts.get(country)!.push({
          article,
          conflictType,
          severity,
          publishedAt: article.published_at
        })
      })
    })
    
    // Generate conflict indicators for each country
    countryConflicts.forEach((events, country) => {
      const indicator = this.generateConflictIndicator(country, events)
      if (indicator && indicator.severity !== 'low') {
        conflicts.push(indicator)
      }
    })
    
    return conflicts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }
  
  // Check if country should be added to conflict zones
  async recommendConflictZoneUpdates(currentConflictZones: string[]): Promise<{
    additions: ConflictIndicator[]
    removals: string[]
    updates: ConflictIndicator[]
  }> {
    const detectedConflicts = await this.scanForConflicts()
    
    const additions: ConflictIndicator[] = []
    const updates: ConflictIndicator[] = []
    
    detectedConflicts.forEach(conflict => {
      if (!currentConflictZones.includes(conflict.country)) {
        if (conflict.severity === 'critical' || conflict.severity === 'high') {
          additions.push(conflict)
        }
      } else {
        // Check if existing conflict zone needs severity update
        updates.push(conflict)
      }
    })
    
    // Check for conflicts that have de-escalated (potential removals)
    const removals: string[] = []
    currentConflictZones.forEach(country => {
      const detectedConflict = detectedConflicts.find(c => c.country === country)
      if (!detectedConflict || detectedConflict.severity === 'low') {
        // Additional verification needed before removal
        // This could involve checking multiple sources over time
        console.log(`Potential de-escalation detected for ${country}`)
      }
    })
    
    return { additions, removals, updates }
  }
  
  // Extract countries mentioned in article
  private extractCountries(article: any): string[] {
    const countries: string[] = []
    
    // Use entities from World News API
    if (article.entities?.locations) {
      countries.push(...article.entities.locations)
    }
    
    // Extract from text as fallback
    const text = `${article.title} ${article.text}`.toLowerCase()
    const commonCountries = [
      'ukraine', 'russia', 'israel', 'palestine', 'syria', 'iran', 'iraq', 'afghanistan',
      'yemen', 'sudan', 'myanmar', 'haiti', 'venezuela', 'libya', 'somalia', 'mali',
      'ethiopia', 'congo', 'car', 'south sudan', 'lebanon', 'pakistan', 'india', 'china'
    ]
    
    commonCountries.forEach(country => {
      if (text.includes(country)) {
        countries.push(country.charAt(0).toUpperCase() + country.slice(1))
      }
    })
    
    // Remove duplicates
    const uniqueSet = new Set(countries)
    return Array.from(uniqueSet)
  }
  
  // Analyze conflict type based on article content
  private analyzeConflictType(article: any): string {
    const text = `${article.title} ${article.text}`.toLowerCase()
    
    for (const [patternType, pattern] of this.conflictPatterns) {
      if (pattern.keywords.some(keyword => text.includes(keyword))) {
        return patternType
      }
    }
    
    return 'unknown'
  }
  
  // Calculate conflict severity based on article and pattern
  private calculateConflictSeverity(article: any, conflictType: string): number {
    const pattern = this.conflictPatterns.get(conflictType)
    if (!pattern) return 0.5
    
    const text = `${article.title} ${article.text}`.toLowerCase()
    
    let severityScore = 0.5 // Base severity
    
    // Check for severity indicators
    const severityIndicators = [
      { keywords: ['critical', 'severe', 'deadly', 'devastating'], multiplier: 1.5 },
      { keywords: ['multiple', 'massive', 'major', 'significant'], multiplier: 1.2 },
      { keywords: ['casualties', 'deaths', 'killed', 'injured'], multiplier: 1.3 },
      { keywords: ['escalation', 'tension', 'crisis', 'emergency'], multiplier: 1.1 }
    ]
    
    severityIndicators.forEach(indicator => {
      if (indicator.keywords.some(keyword => text.includes(keyword))) {
        severityScore *= indicator.multiplier
      }
    })
    
    // Apply sentiment if available
    if (article.sentiment && article.sentiment < -0.5) {
      severityScore *= 1.2
    }
    
    return Math.min(1.0, severityScore)
  }
  
  // Generate conflict indicator for country
  private generateConflictIndicator(country: string, events: any[]): ConflictIndicator | null {
    if (events.length === 0) return null
    
    // Calculate average severity
    const avgSeverity = events.reduce((sum, event) => sum + event.severity, 0) / events.length
    
    // Determine overall severity level
    let severity: 'low' | 'medium' | 'high' | 'critical'
    if (avgSeverity >= 0.9) severity = 'critical'
    else if (avgSeverity >= 0.7) severity = 'high'
    else if (avgSeverity >= 0.5) severity = 'medium'
    else severity = 'low'
    
    // Calculate confidence based on number of events and sources
    const confidence = Math.min(1.0, (events.length * 0.1) + 0.3)
    
    // Generate reasons
    const reasons: string[] = []
    const sources = new Set<string>()
    
    const conflictTypes = new Set(events.map(e => e.conflictType))
    conflictTypes.forEach(type => {
      if (type !== 'unknown') {
        reasons.push(`${type.replace('_', ' ').toUpperCase()} detected`)
      }
    })
    
    events.forEach(event => {
      if (event.article.source) {
        sources.add(event.article.source)
      }
    })
    
    // Determine trend
    const recentEvents = events.filter(e => 
      new Date(e.publishedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    )
    const trend = recentEvents.length > events.length * 0.6 ? 'escalating' : 'stable'
    
    return {
      country,
      severity,
      confidence,
      reasons: reasons.length > 0 ? reasons : ['Conflict indicators detected'],
      sources: Array.from(sources),
      lastDetected: new Date().toISOString(),
      trend
    }
  }
  
  // Generate weekly conflict intelligence report
  async generateConflictReport(): Promise<{
    summary: string
    highRiskCountries: ConflictIndicator[]
    emergingConflicts: ConflictIndicator[]
    deEscalatingConflicts: string[]
    recommendations: string[]
  }> {
    const conflicts = await this.scanForConflicts()
    
    const highRiskCountries = conflicts.filter(c => c.severity === 'critical' || c.severity === 'high')
    const emergingConflicts = conflicts.filter(c => c.trend === 'escalating' && c.confidence > 0.7)
    
    // This would need historical data to determine de-escalating conflicts
    const deEscalatingConflicts: string[] = [] // Placeholder for future implementation
    
    const recommendations = [
      'Review high-risk countries for travel restrictions',
      'Monitor emerging conflicts for potential escalation',
      'Update conflict zones list based on current intelligence',
      'Verify conflicting reports with multiple sources'
    ]
    
    const summary = `Detected ${conflicts.length} countries with conflict indicators. ${highRiskCountries.length} at high or critical risk. ${emergingConflicts.length} emerging conflicts identified.`
    
    return {
      summary,
      highRiskCountries,
      emergingConflicts,
      deEscalatingConflicts,
      recommendations
    }
  }
}

// Export conflict detection service instance
export const conflictDetectionService = ConflictDetectionService.getInstance()