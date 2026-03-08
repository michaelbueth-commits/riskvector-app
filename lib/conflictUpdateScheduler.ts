// Optimized Conflict Update Scheduler
// Designed to work with regional conflict focus and free API limits

import { optimizedConflictDetectionService, OptimizedConflictIndicator } from './optimizedConflictDetection'

export interface ConflictZoneUpdate {
  country: string
  region: string
  previousScore?: number
  newScore: number
  previousSeverity?: 'low' | 'medium' | 'high' | 'critical'
  newSeverity: 'low' | 'medium' | 'high' | 'critical'
  changeReason: string[]
  recommendedAction: 'add' | 'update' | 'remove' | 'monitor'
  priority: number
  evidence: any[]
  estimatedRisk: number
  approved?: boolean
  approvedBy?: string
  approvedAt?: string
}

export interface ConflictUpdateResult {
  timestamp: string
  additions: OptimizedConflictIndicator[]
  updates: OptimizedConflictIndicator[]
  removals: string[]
  unchanged: string[]
  stats: {
    totalScanned: number
    apiPointsUsed: number
    processingTime: number
  }
}

class ConflictUpdateScheduler {
  private static instance: ConflictUpdateScheduler
  private updateInterval: number = 60 * 60 * 1000 // 1 hour in milliseconds
  private lastUpdate: string = ''
  private updateHistory: ConflictUpdateResult[] = []
  private pendingUpdates: ConflictZoneUpdate[] = []
  private isRunning: boolean = false
  
  private constructor() {}
  
  static getInstance(): ConflictUpdateScheduler {
    if (!ConflictUpdateScheduler.instance) {
      ConflictUpdateScheduler.instance = new ConflictUpdateScheduler()
    }
    return ConflictUpdateScheduler.instance
  }
  
  // Start the conflict update scheduler
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Conflict update scheduler already running')
      return
    }
    
    console.log('🚀 Starting conflict zones update scheduler (1 hour intervals)')
    this.isRunning = true
    
    // Run initial update
    this.runConflictUpdate().catch(error => {
      console.error('Initial conflict update failed:', error)
    })
    
    // Schedule regular updates
    setInterval(() => {
      this.runConflictUpdate().catch(error => {
        console.error('Scheduled conflict update failed:', error)
      })
    }, this.updateInterval)
  }
  
  // Stop the conflict update scheduler
  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Conflict update scheduler not running')
      return
    }
    
    console.log('🛑 Stopping conflict zones update scheduler')
    this.isRunning = false
  }
  
  // Run a single conflict update cycle
  async runConflictUpdate(): Promise<ConflictUpdateResult> {
    console.log('🔍 Running conflict zones update cycle...')
    
    const result: ConflictUpdateResult = {
      timestamp: new Date().toISOString(),
      additions: [],
      updates: [],
      removals: [],
      unchanged: [],
      stats: {
        totalScanned: 0,
        apiPointsUsed: 0,
        processingTime: 0
      }
    }
    
    try {
      const startTime = Date.now()
      const currentConflictZones = this.getCurrentConflictZones()
      
      // Scan for potential conflicts (optimized for free tier)
      const conflicts = await optimizedConflictDetectionService.scanForConflictsOptimized()
      
      // Process detected conflicts
      for (const conflict of conflicts) {
        const update = this.generateConflictZoneUpdate(conflict, 'add')
        
        // For now, auto-approve critical/high severity conflicts
        if (conflict.severity === 'critical' || conflict.severity === 'high') {
          update.approved = true
          update.approvedBy = 'Auto-Approval System'
          update.approvedAt = new Date().toISOString()
          
          // Apply the update
          this.applyConflictZoneUpdate(update)
          result.additions.push(conflict)
        } else {
          // Medium severity requires manual review
          this.pendingUpdates.push(update)
          console.log(`⚠️ Pending manual review: ${conflict.country} (${conflict.severity})`)
        }
      }
      
      // Log unchanged countries
      const allCountries = [...currentConflictZones, ...conflicts.map(c => c.country)]
      const changedCountries = [
        ...result.additions.map(a => a.country),
        ...result.updates.map(u => u.country)
      ]
      
      result.unchanged = allCountries
        .filter(country => !changedCountries.includes(country))
        .filter(country => currentConflictZones.includes(country))
      
      // Calculate stats
      const processingTime = Date.now() - startTime
      const usageStats = optimizedConflictDetectionService.getUsageStats()
      
      result.stats = {
        totalScanned: conflicts.length,
        apiPointsUsed: usageStats.pointsUsedToday,
        processingTime
      }
      
      this.lastUpdate = result.timestamp
      this.updateHistory.push(result)
      
      // Keep only last 30 update results in history
      if (this.updateHistory.length > 30) {
        this.updateHistory = this.updateHistory.slice(-30)
      }
      
      console.log(`✅ Conflict update completed: ${result.additions.length} additions, ${result.updates.length} updates, processing time: ${processingTime}ms`)
      
      return result
      
    } catch (error) {
      console.error('❌ Conflict update cycle failed:', error)
      
      // Return error result
      result.stats = {
        totalScanned: 0,
        apiPointsUsed: 0,
        processingTime: Date.now() - Date.now()
      }
      
      return result
    }
  }
  
  // Generate conflict zone update from conflict indicator
  private generateConflictZoneUpdate(conflict: OptimizedConflictIndicator, action: 'add' | 'update'): ConflictZoneUpdate {
    const severityScore = this.severityToScore(conflict.severity)
    const currentZone = this.getCurrentConflictZones().find(z => z === conflict.country)
    
    return {
      country: conflict.country,
      region: this.determineRegion(conflict.country),
      previousScore: currentZone ? this.getCurrentConflictScore(conflict.country) : undefined,
      newScore: severityScore,
      previousSeverity: currentZone ? this.getCurrentConflictSeverity(conflict.country) : undefined,
      newSeverity: conflict.severity,
      changeReason: conflict.reasons,
      recommendedAction: action,
      priority: this.calculatePriority(conflict),
      evidence: [{
        timestamp: conflict.lastDetected,
        sources: conflict.sources,
        confidence: conflict.confidence,
        estimatedCost: conflict.estimatedCost
      }],
      estimatedRisk: conflict.confidence
    }
  }
  
  // Apply conflict zone update
  private applyConflictZoneUpdate(update: ConflictZoneUpdate): void {
    // This would normally update your configuration/database
    // For now, we'll just log it
    console.log(`✅ Applied conflict zone update: ${update.country} (${update.newSeverity})`)
    
    // Here you would update your CONFLICT_ZONES config or database
    // Example: this.updateConflictZonesConfig(update)
  }
  
  // Get current conflict zones (placeholder - should come from config/database)
  private getCurrentConflictZones(): string[] {
    // This would normally read from your config file or database
    return [
      'Ukraine', 'Russia', 'Israel', 'Palestine', 'Syria', 'Yemen', 
      'Iran', 'Iraq', 'Afghanistan', 'Myanmar', 'Sudan', 'Haiti',
      'Taiwan', 'North Korea', 'South Korea', 'India', 'Pakistan',
      'China', 'Japan', 'Philippines', 'Vietnam', 'Indonesia',
      'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
      'Lebanon', 'Jordan', 'Egypt', 'Libya', 'Tunisia', 'Algeria',
      'Morocco', 'Turkey', 'Greece', 'Cyprus', 'Georgia', 'Armenia',
      'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan'
    ]
  }
  
  // Get current conflict score for a country
  private getCurrentConflictScore(country: string): number {
    // This would normally read from your config/database
    const currentZones = this.getCurrentConflictZones()
    if (!currentZones.includes(country)) return 0
    
    // Default scores for known conflict zones
    const scores: Record<string, number> = {
      'Ukraine': 95,
      'Israel': 85,
      'Iran': 95,
      'Palestine': 90,
      'Russia': 90,
      'Syria': 80,
      'Yemen': 75,
      'Afghanistan': 70,
      'Myanmar': 65,
      'Sudan': 60,
      'Haiti': 55
    }
    
    return scores[country] || 50
  }
  
  // Get current conflict severity for a country
  private getCurrentConflictSeverity(country: string): 'low' | 'medium' | 'high' | 'critical' {
    const score = this.getCurrentConflictScore(country)
    
    if (score >= 85) return 'critical'
    if (score >= 70) return 'high'
    if (score >= 55) return 'medium'
    return 'low'
  }
  
  // Convert severity to numerical score
  private severityToScore(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    const baseScores = {
      'low': 25,
      'medium': 50,
      'high': 75,
      'critical': 95
    }
    
    // Apply regional weights for Middle East and Asia
    const region = this.determineRegionFromCountry('')
    if (region.includes('Middle East') || region.includes('Asia')) {
      return Math.min(100, baseScores[severity] + 5)
    }
    
    return baseScores[severity]
  }
  
  // Calculate priority for conflict zone update
  private calculatePriority(conflict: OptimizedConflictIndicator): number {
    let priority = 3 // Base priority
    
    // Increase priority for critical severity
    if (conflict.severity === 'critical') priority = 1
    if (conflict.severity === 'high') priority = 2
    
    // Increase priority for Middle East and Asian conflicts
    const region = this.determineRegion(conflict.country)
    if (region.includes('Middle East') || region.includes('Asia')) {
      priority = Math.max(1, priority - 1)
    }
    
    return priority
  }
  
  // Determine region from country
  private determineRegion(country: string): string {
    // Simple region determination - could be enhanced with proper geocoding
    const middleEastCountries = [
      'Israel', 'Palestine', 'Lebanon', 'Syria', 'Jordan', 'Egypt',
      'Iran', 'Iraq', 'Saudi Arabia', 'Yemen', 'Oman',
      'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain',
      'Turkey', 'Cyprus', 'Georgia', 'Armenia', 'Azerbaijan'
    ]
    
    const asianCountries = [
      'China', 'Taiwan', 'Japan', 'South Korea', 'North Korea',
      'Philippines', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia',
      'Thailand', 'Myanmar', 'Cambodia', 'Laos',
      'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan',
      'Afghanistan', 'Iran', 'Maldives',
      'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
      'Mongolia'
    ]
    
    if (middleEastCountries.includes(country)) return 'Middle East'
    if (asianCountries.includes(country)) return 'Asia'
    return 'Other'
  }
  
  // Determine region from country (simplified version)
  private determineRegionFromCountry(country: string): string {
    return this.determineRegion(country)
  }
  
  // Get scheduler status
  getStatus(): {
    isRunning: boolean
    lastUpdate: string
    pendingUpdates: number
    updateHistory: ConflictUpdateResult[]
    canRunHourly: boolean
  } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      pendingUpdates: this.pendingUpdates.length,
      updateHistory: this.updateHistory.slice(-5), // Last 5 updates
      canRunHourly: optimizedConflictDetectionService.canRunHourlyScan()
    }
  }
  
  // Get pending updates
  getPendingUpdates(): ConflictZoneUpdate[] {
    return this.pendingUpdates
  }
  
  // Approve pending update
  approveUpdate(country: string, approvedBy: string): ConflictZoneUpdate | null {
    const updateIndex = this.pendingUpdates.findIndex(u => u.country === country)
    if (updateIndex === -1) {
      return null
    }
    
    const update = this.pendingUpdates[updateIndex]
    update.approved = true
    update.approvedBy = approvedBy
    update.approvedAt = new Date().toISOString()
    
    // Remove from pending and apply
    this.pendingUpdates.splice(updateIndex, 1)
    this.applyConflictZoneUpdate(update)
    
    console.log(`✅ Approved conflict zone update: ${update.country} by ${approvedBy}`)
    return update
  }
  
  // Reject pending update
  rejectUpdate(country: string, reason: string): ConflictZoneUpdate | null {
    const updateIndex = this.pendingUpdates.findIndex(u => u.country === country)
    if (updateIndex === -1) {
      return null
    }
    
    const update = this.pendingUpdates[updateIndex]
    this.pendingUpdates.splice(updateIndex, 1)
    
    console.log(`❌ Rejected conflict zone update: ${update.country} - ${reason}`)
    return update
  }
}

// Export conflict update scheduler instance
export const conflictUpdateScheduler = ConflictUpdateScheduler.getInstance()