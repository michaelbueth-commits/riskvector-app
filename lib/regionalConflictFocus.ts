// Regional Conflict Focus Service
// Specialized monitoring for Middle East and Asia regions

export interface RegionalFocus {
  region: string
  countries: string[]
  priority: number
  keywords: string[]
  contextFactors: string[]
  monitoringLevel: 'high' | 'critical' | 'extreme'
}

class RegionalConflictFocusService {
  private static instance: RegionalConflictFocusService
  
  private constructor() {}
  
  static getInstance(): RegionalConflictFocusService {
    if (!RegionalConflictFocusService.instance) {
      RegionalConflictFocusService.instance = new RegionalConflictFocusService()
    }
    return RegionalConflictFocusService.instance
  }
  
  // Define regional focus areas with enhanced coverage
  getRegionalFocusAreas(): RegionalFocus[] {
    return [
      // MIDDLE EAST - EXTREME PRIORITY
      {
        region: 'Middle East - Core Conflict Zone',
        countries: [
          'Israel', 'Palestine', 'Lebanon', 'Syria', 'Jordan', 'Egypt',
          'Iran', 'Iraq', 'Saudi Arabia', 'Yemen', 'Oman',
          'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain'
        ],
        priority: 1,
        keywords: [
          'gaza', 'west bank', 'golan heights', 'sinai',
          'hezbollah', 'hamas', 'idf', 'israel defense',
          'iranian revolutionary guard', 'quds force',
          'houthi', 'yemeni rebels',
          'gulf cooperation council', 'gcc',
          'middle east peace process', 'two-state solution',
          'jerusalem', 'al-aqsa', 'temple mount',
          'suez canal', 'strait of hormuz', 'bab el-mandeb',
          'oil facilities', 'energy infrastructure',
          'proxy war', 'regional power struggle',
          'shiite crescent', 'sunni alliance',
          'us military base', 'naval presence'
        ],
        contextFactors: [
          'Religious tensions (Jerusalem, Al-Aqsa)',
          'Iran-Israel proxy conflict',
          'Gaza-Israel border escalation',
          'Lebanon-Israel border incidents',
          'Red Sea shipping attacks',
          'Iran nuclear program',
          'GCC-Iran tensions',
          'US military presence',
          'Oil market stability',
          'Water resource conflicts (Jordan River, Tigris-Euphrates)'
        ],
        monitoringLevel: 'extreme'
      },
      
      // ASIA - CRITICAL PRIORITY
      {
        region: 'Asia - Pacific Tension Zones',
        countries: [
          // East Asia
          'China', 'Taiwan', 'Japan', 'South Korea', 'North Korea',
          'Philippines', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia',
          'Thailand', 'Myanmar', 'Cambodia', 'Laos',
          // South Asia
          'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan',
          'Afghanistan', 'Iran', 'Maldives',
          // Central Asia
          'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
          'Mongolia'
        ],
        priority: 2,
        keywords: [
          // East Asia tensions
          'south china sea', 'taiwan strait', 'senkaku', 'diaoyu',
          'north korea', 'kim jong un', 'nuclear test', 'ballistic missile',
          'china-us tension', 'trade war', 'tech war', 'semiconductor',
          'quad', 'aukus', 'five eyes',
          'belt and road', 'debt trap', 'infrastructure',
          'china-india border', 'ladakh', 'arunachal pradesh',
          'hong kong', 'beijing', 'shanghai', 'guangdong',
          
          // South Asia conflicts
          'kashmir', 'pakistan-india', 'line of control', 'surgical strike',
          'taliban', 'afghanistan', 'kabul', 'islamabad',
          'balochistan', 'pashtun', 'sindh', 'punjab',
          'nuclear powers', 'india-pakistan tension',
          'bengali', 'dhaka', 'chittagong',
          
          // Southeast Asia issues
          'south china sea arbitration', 'artificial islands',
          'rohingya', 'myanmar coup', 'asean',
          'spratly islands', 'paracel islands',
          'malacca strait', 'singapore strait',
          
          // Central Asia dynamics
          'shanghai cooperation organization', 'sco',
          'caspian sea', 'central asia pipeline',
          'uighur', 'xinjiang', 'turkestan',
          'russian influence', 'chinese influence'
        ],
        contextFactors: [
          'Taiwan sovereignty and US-China relations',
          'North Korean nuclear program and missile tests',
          'South China Sea territorial disputes',
          'US-China technology competition',
          'India-Pakistan historical tensions',
          'China-India border conflicts',
          'ASEAN centrality vs major power competition',
          'Belt and Road Initiative debt concerns',
          'Myanmar civil war and refugee crisis',
          'Rohingya genocide and regional stability',
          'Nuclear weapons proliferation (India, Pakistan, North Korea)',
          'Supply chain disruptions and semiconductor shortages',
          'US military alliances (QUAD, AUKUS, Five Eyes)',
          'Energy security and sea lane protection',
          'Cyber warfare and technology espionage',
          'Climate change impacts on coastal cities'
        ],
        monitoringLevel: 'critical'
      },
      
      // SUB-REGIONAL HOTSPOTS
      {
        region: 'Middle East - Gulf Subregion',
        countries: ['Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Yemen', 'Iran'],
        priority: 3,
        keywords: [
          'gcc', 'gulf cooperation council',
          'oil prices', 'opec', 'opec+',
          'dubai', 'abu dhabi', 'riyadh', 'doha',
          'yemen civil war', 'houthi rebels',
          'iran-iraq', 'shatt al-arab',
          'strait of hormuz', 'oil shipping',
          'muslim brotherhood', 'political islam',
          'wahhabism', 'shiite-sunni',
          'us military presence', 'naval base'
        ],
        contextFactors: [
          'Oil price volatility and market stability',
          'Iran-Saudi regional competition',
          'Yemen humanitarian crisis',
          'Strait of Hormuz shipping security',
          'GCC-Iran normalization efforts',
          'Political reform and youth unemployment',
          'Water scarcity and desertification',
          'Post-oil economic diversification'
        ],
        monitoringLevel: 'critical'
      },
      
      {
        region: 'Asia - South Asian Subcontinent',
        countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Afghanistan', 'Maldives'],
        priority: 4,
        keywords: [
          'kashmir', 'india-pakistan', 'line of control',
          'indus water treaty', 'water dispute',
          'surgical strike', 'balakot', 'pulwama',
          'ceasefire violation', 'border tension',
          'nuclear deterrence', 'atomic weapons',
          'china-pakistan economic corridor', 'cpec',
          'bangladesh independence', 'sheikh hasina',
          'sri lanka economic crisis', 'imf',
          'taliban afghanistan', 'kabul fall',
          'nepal-india border', 'china-nepal relation',
          'maldives water crisis', 'climate change',
          'rohingya', 'myanmar refugees', 'bangladesh camps'
        ],
        contextFactors: [
          'Historical India-Pakistan tensions',
          'Nuclear weapons and deterrence stability',
          'Water resource conflicts (Indus River)',
          'Cross-border terrorism and insurgencies',
          'Economic crises and debt traps (Sri Lanka)',
          'Political instability and regime changes',
          'Climate change impacts (coastal flooding, water scarcity)',
          'Refugee crises and cross-border migration',
          'China regional influence (CPEC, ports)',
          'US-China competition in South Asia'
        ],
        monitoringLevel: 'critical'
      },
      
      {
        region: 'Asia - Southeast Asian Maritime',
        countries: ['Philippines', 'Vietnam', 'Malaysia', 'Indonesia', 'Singapore', 'Thailand', 'Myanmar', 'Cambodia', 'Laos', 'Brunei'],
        priority: 5,
        keywords: [
          'south china sea', 'spratly', 'paracel',
          'asean', 'southeast asia',
          'philippines-china', 'west philippine sea',
          'vietnam-china', 'maritime dispute',
          'malacca strait', 'straits of malacca',
          'singapore', 'port of singapore',
          'myanmar coup', 'state peace council',
          'rohingya', 'genocide', 'ethnic cleansing',
          'south thailand insurgency', 'patani',
          'east timor', 'timor leste',
          'asean economic community', 'aec'
        ],
        contextFactors: [
          'South China Sea territorial disputes',
          'ASEAN unity vs major power pressure',
          'Maritime security and freedom of navigation',
          'Strait of Malacca shipping lane security',
          'Myanmar civil war and refugee crisis',
          'Rohingya persecution and regional response',
          'Economic integration (AEC) and development gaps',
          'Great power competition (US-China)',
          'Counter-terrorism and maritime security',
          'Climate change impacts on archipelagic nations'
        ],
        monitoringLevel: 'high'
      },
      
      {
        region: 'Asia - Northeast Asian Flashpoints',
        countries: ['China', 'Taiwan', 'Japan', 'South Korea', 'North Korea', 'Russia'],
        priority: 6,
        keywords: [
          'taiwan strait', 'taiwan independence', 'one china',
          'senkaku', 'diaoyu', 'east china sea',
          'north korea', 'kim jong un', 'nuclear test',
          'ballistic missile', 'icbm', 'intermediate missile',
          'japan-china', 'senkaku dispute',
          'south korea', 'korean peninsula',
          'thaad', 'missile defense', 'us-south korea',
          'quad', 'aukus', 'five eyes',
          'semiconductor', 'tech war', 'supply chain',
          'beijing', 'shanghai', 'tokyo', 'seoul',
          'us military', 'indo-pacific command'
        ],
        contextFactors: [
          'Taiwan sovereignty and cross-strait relations',
          'North Korean nuclear program and missile testing',
          'US-Japan-South Korea trilateral cooperation',
          'China-US strategic competition',
          'Technology competition and semiconductor supply chains',
          'Historical tensions and territorial disputes',
          'US military alliances and forward presence',
          'Economic interdependence and decoupling',
          'Climate security and natural disasters',
          'Energy security and resource competition'
        ],
        monitoringLevel: 'extreme'
      },
      
      {
        region: 'Asia - Central Asian Crossroads',
        countries: ['Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Afghanistan', 'Iran', 'China', 'Russia'],
        priority: 7,
        keywords: [
          'central asia', 'stans', 'turkestan',
          'shanghai cooperation organization', 'sco',
          'belt and road', 'silk road economic belt',
          'caspian sea', 'energy resources',
          'uranium', 'rare earth', 'natural gas',
          'afghanistan', 'taliban', 'central asia refugees',
          'uighur', 'xinjiang', 'east turkestan',
          'russian influence', 'chinese influence',
          'water politics', 'amu darya', 'syr darya',
          'cotton', 'agriculture', 'water scarcity',
          'nato', 'collective security treaty organization', 'csto'
        ],
        contextFactors: [
          'Great power competition (Russia-China-US)',
          'Energy resources and pipeline politics',
          'Water scarcity and transboundary water conflicts',
          'Security cooperation and military alliances',
          'Economic development and debt sustainability',
          'Counter-terrorism and extremism prevention',
          'Ethnic tensions and minority rights',
          'Climate change impacts on arid regions',
          'Transport and logistics corridors',
          'Historical and cultural connections'
        ],
        monitoringLevel: 'high'
      }
    ]
  }
  
  // Get enhanced monitoring parameters for Middle East and Asia
  getEnhancedMonitoringParameters() {
    const focusAreas = this.getRegionalFocusAreas()
    
    return {
      // Middle East monitoring keywords
      middleEastKeywords: focusAreas
        .filter(area => area.region.includes('Middle East'))
        .flatMap(area => area.keywords),
        
      // Asia monitoring keywords  
      asiaKeywords: focusAreas
        .filter(area => area.region.includes('Asia'))
        .flatMap(area => area.keywords),
        
      // All high-priority countries
      highPriorityCountries: focusAreas
        .filter(area => area.priority <= 3)
        .flatMap(area => area.countries),
        
      // Countries requiring extreme monitoring
      extremeMonitoringCountries: focusAreas
        .filter(area => area.monitoringLevel === 'extreme')
        .flatMap(area => area.countries),
        
      // Context factors for conflict analysis
      contextFactors: focusAreas
        .flatMap(area => area.contextFactors)
    }
  }
  
  // Generate region-specific search parameters
  generateRegionalSearchParams(region: 'middle-east' | 'asia' | 'both'): {
    countries: string[]
    keywords: string[]
    contextFilters: string[]
    priorityLevel: number
  } {
    const focusAreas = this.getRegionalFocusAreas()
    
    if (region === 'middle-east') {
      const middleEastAreas = focusAreas.filter(area => area.region.includes('Middle East'))
      
      return {
        countries: middleEastAreas.flatMap(area => area.countries),
        keywords: middleEastAreas.flatMap(area => area.keywords),
        contextFilters: middleEastAreas.flatMap(area => area.contextFactors),
        priorityLevel: 1
      }
    }
    
    if (region === 'asia') {
      const asiaAreas = focusAreas.filter(area => area.region.includes('Asia'))
      
      return {
        countries: asiaAreas.flatMap(area => area.countries),
        keywords: asiaAreas.flatMap(area => area.keywords),
        contextFilters: asiaAreas.flatMap(area => area.contextFactors),
        priorityLevel: 2
      }
    }
    
    // Both regions
    return {
      countries: focusAreas.flatMap(area => area.countries),
      keywords: focusAreas.flatMap(area => area.keywords),
      contextFilters: focusAreas.flatMap(area => area.contextFactors),
      priorityLevel: 1
    }
  }
  
  // Generate region-specific conflict severity weights
  getRegionalSeverityWeights(region: string): Record<string, number> {
    const baseWeights = {
      'critical': 1.0,
      'high': 0.8,
      'medium': 0.6,
      'low': 0.4
    }
    
    // Increase weights for Middle East and Asian conflicts
    if (region.toLowerCase().includes('middle east') || 
        region.toLowerCase().includes('asia') ||
        region.toLowerCase().includes('gulf') ||
        region.toLowerCase().includes('pacific')) {
      return {
        'critical': 1.3,  // 30% increase for critical Middle East/Asian conflicts
        'high': 1.1,     // 10% increase for high severity
        'medium': 0.9,   // Slight increase for medium
        'low': 0.7
      }
    }
    
    return baseWeights
  }
  
  // Check if country requires special monitoring
  requiresSpecialMonitoring(country: string): {
    region: string
    monitoringLevel: string
    keywords: string[]
    contextFactors: string[]
  } | null {
    const focusAreas = this.getRegionalFocusAreas()
    
    for (const area of focusAreas) {
      if (area.countries.includes(country)) {
        return {
          region: area.region,
          monitoringLevel: area.monitoringLevel,
          keywords: area.keywords,
          contextFactors: area.contextFactors
        }
      }
    }
    
    return null
  }
  
  // Get all countries in Middle East and Asia focus areas
  getMiddleEastAndAsiaCountries(): string[] {
    const focusAreas = this.getRegionalFocusAreas()
    
    return [
      ...focusAreas
        .filter(area => area.region.includes('Middle East'))
        .flatMap(area => area.countries),
      ...focusAreas
        .filter(area => area.region.includes('Asia'))
        .flatMap(area => area.countries)
    ].filter((country, index, self) => self.indexOf(country) === index) // Remove duplicates
  }
  
  // Get conflict risk assessment for Middle East and Asia
  getRegionalRiskAssessment(): {
    region: string
    riskLevel: 'critical' | 'high' | 'medium' | 'low'
    primaryConcerns: string[]
    triggerEvents: string[]
    monitoringRecommendation: string
  }[] {
    const focusAreas = this.getRegionalFocusAreas()
    
    return focusAreas.map(area => ({
      region: area.region,
      riskLevel: area.monitoringLevel === 'extreme' ? 'critical' : 
               area.monitoringLevel === 'critical' ? 'high' :
               area.monitoringLevel === 'high' ? 'medium' : 'low',
      primaryConcerns: area.contextFactors.slice(0, 5), // Top 5 concerns
      triggerEvents: area.keywords.slice(0, 3), // Most likely trigger events
      monitoringRecommendation: area.monitoringLevel === 'extreme' ? 
        'CONTINUOUS MONITORING REQUIRED - Multiple flashpoints present' :
        area.monitoringLevel === 'critical' ?
        'HIGH FREQUENCY MONITORING - Rapid escalation risk' :
        area.monitoringLevel === 'high' ?
        'REGULAR MONITORING - Situational awareness needed' :
        'STANDARD MONITORING - Periodic checks sufficient'
    }))
  }
}

// Export regional conflict focus service instance
export const regionalConflictFocusService = RegionalConflictFocusService.getInstance()