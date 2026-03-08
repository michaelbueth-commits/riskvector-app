// System Scheduler
// Initializes and manages all automated services

import { conflictUpdateScheduler } from './conflictUpdateScheduler'
import { conflictDetectionService } from './conflictDetectionService'

class SystemScheduler {
  private static instance: SystemScheduler
  private initialized = false
  
  private constructor() {}
  
  static getInstance(): SystemScheduler {
    if (!SystemScheduler.instance) {
      SystemScheduler.instance = new SystemScheduler()
    }
    return SystemScheduler.instance
  }
  
  // Initialize all scheduled services
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ Scheduler already initialized')
      return
    }
    
    console.log('🚀 Initializing RiskVector System Scheduler...')
    
    try {
      // Set API keys for services that require them
      const worldNewsApiKey = process.env.WORLD_NEWS_API_KEY
      if (worldNewsApiKey) {
        conflictDetectionService.setApiKey(worldNewsApiKey)
        console.log('✅ World News API key configured')
      } else {
        console.warn('⚠️ World News API key not found - conflict detection limited')
      }
      
      // Start conflict zones auto-update scheduler
      conflictUpdateScheduler.start()
      console.log('✅ Conflict zones auto-update scheduler started')
      
      this.initialized = true
      console.log('🎯 All scheduled services initialized successfully')
      
      // Run initial conflict detection report
      await this.generateInitialReport()
      
    } catch (error) {
      console.error('❌ Failed to initialize scheduler:', error)
      throw error
    }
  }
  
  // Generate initial conflict intelligence report
  private async generateInitialReport(): Promise<void> {
    try {
      console.log('📊 Generating initial conflict intelligence report...')
      
      const report = await conflictDetectionService.generateConflictReport()
      
      console.log('📋 Initial Conflict Intelligence Report:')
      console.log(`Summary: ${report.summary}`)
      console.log(`High Risk Countries: ${report.highRiskCountries.length}`)
      console.log(`Emerging Conflicts: ${report.emergingConflicts.length}`)
      
      if (report.highRiskCountries.length > 0) {
        console.log('🔴 High Risk Countries:')
        report.highRiskCountries.forEach(country => {
          console.log(`  - ${country.country}: ${country.severity.toUpperCase()} (${country.confidence.toFixed(2)} confidence)`)
          console.log(`    Reasons: ${country.reasons.join(', ')}`)
        })
      }
      
      if (report.emergingConflicts.length > 0) {
        console.log('🟠 Emerging Conflicts:')
        report.emergingConflicts.forEach(country => {
          console.log(`  - ${country.country}: ESCALATING (${country.severity.toUpperCase()})`)
        })
      }
      
      console.log('💡 Recommendations:')
      report.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`)
      })
      
    } catch (error) {
      console.error('Failed to generate initial report:', error)
    }
  }
  
  // Get scheduler status
  getStatus(): {
    initialized: boolean
    lastUpdate: string
    pendingUpdates: any[]
    services: string[]
  } {
    const schedulerStatus = conflictUpdateScheduler.getStatus()
    
    return {
      initialized: this.initialized,
      lastUpdate: schedulerStatus.lastUpdate,
      pendingUpdates: conflictUpdateScheduler.getPendingUpdates(),
      services: [
        'Conflict Detection Service',
        'Conflict Zones Auto-Update Scheduler',
        'World News API Integration'
      ]
    }
  }
}

// Export scheduler instance
export const systemScheduler = SystemScheduler.getInstance()