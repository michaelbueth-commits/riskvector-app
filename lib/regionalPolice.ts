/**
 * Regional Police Intelligence Service for Rheinland-Pfalz
 * Provides hyper-local police reports and crime data for multiple cities
 */

export interface LocalPoliceReport {
  id: string
  timestamp: Date
  title: string
  description: string
  category: PoliceCategory
  severity: PoliceSeverity
  location: {
    city: string
    district?: string
    street?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  source: 'presseportal' | 'meinestadt' | 'rhein-zeitung' | 'polizei-rlp' | 'wochenspiegellive'
  url: string
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED'
}

export enum PoliceCategory {
  TRAFFIC = 'TRAFFIC',
  THEFT = 'THEFT', 
  ASSAULT = 'ASSAULT',
  VANDALISM = 'VANDALISM',
  DRUGS = 'DRUGS',
  PUBLIC_ORDER = 'PUBLIC_ORDER',
  MISSING_PERSON = 'MISSING_PERSON',
  FRAUD = 'FRAUD',
  BURGLARY = 'BURGLARY',
  FIRE = 'FIRE',
  OTHER = 'OTHER'
}

export enum PoliceSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface LocalCrimeStats {
  period: string
  totalIncidents: number
  byCategory: Record<PoliceCategory, number>
  byDistrict: Record<string, number>
  trend: 'INCREASING' | 'STABLE' | 'DECREASING'
  hotspots: Array<{
    district: string
    incidentCount: number
    riskLevel: number
  }>
}

interface CityConfig {
  name: string
  state: string
  population: string
  policeDepartment: string
  coordinates: {
    lat: number
    lng: number
  }
  districts: string[]
  emergencyContact: {
    phone: string
    address: string
  }
}

const SUPPORTED_CITIES: Record<string, CityConfig> = {
  'bad-kreuznach': {
    name: 'Bad Kreuznach',
    state: 'Rheinland-Pfalz',
    population: 'ca. 50.000',
    policeDepartment: 'Polizeidirektion Bad Kreuznach',
    coordinates: { lat: 49.8408, lng: 7.8672 },
    districts: [
      'Bad Kreuznach (Stadtzentrum)',
      'Bad Kreuznach (Nord)', 
      'Bad Kreuznach (Süd)',
      'Bad Kreuznach (West)',
      'Bad Münster am Stein-Ebernburg'
    ],
    emergencyContact: {
      phone: '+49 671 8440',
      address: 'Salinenstraße 19, 55543 Bad Kreuznach'
    }
  },
  'bad-neuenahr-ahrweiler': {
    name: 'Bad Neuenahr-Ahrweiler',
    state: 'Rheinland-Pfalz', 
    population: 'ca. 27.000',
    policeDepartment: 'Polizeiinspektion Bad Neuenahr-Ahrweiler',
    coordinates: { lat: 50.5433, lng: 7.1049 },
    districts: [
      'Bad Neuenahr',
      'Ahrweiler',
      'Grolsheim',
      'Heimersheim',
      'Walporzheim'
    ],
    emergencyContact: {
      phone: '+49 2641 9100-57399',
      address: 'Neuenahrer Straße 13, 53424 Bad Neuenahr-Ahrweiler'
    }
  },
  'simmern': {
    name: 'Simmern/Hunsrück',
    state: 'Rheinland-Pfalz',
    population: 'ca. 40.000 (Landkreis)',
    policeDepartment: 'Polizeiinspektion Simmern',
    coordinates: { lat: 49.9811, lng: 7.5215 },
    districts: [
      'Simmern',
      'Kastellaun',
      'Rheinböllen',
      'Kappel',
      'Tiefenbach',
      'Hahn'
    ],
    emergencyContact: {
      phone: '+49 6761 9332-0',
      address: 'Rathausstraße 1, 55469 Simmern'
    }
  }
}

class RegionalPoliceService {
  private static instance: RegionalPoliceService
  private cache: Map<string, LocalPoliceReport[]> = new Map()
  private lastUpdate: Date | null = null
  private readonly CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

  static getInstance(): RegionalPoliceService {
    if (!RegionalPoliceService.instance) {
      RegionalPoliceService.instance = new RegionalPoliceService()
    }
    return RegionalPoliceService.instance
  }

  /**
   * Get latest police reports for a specific city
   */
  async getLatestReports(cityKey: string, limit: number = 20): Promise<LocalPoliceReport[]> {
    const cacheKey = `${cityKey}-latest-reports`
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.slice(0, limit)
    }

    try {
      const cityConfig = SUPPORTED_CITIES[cityKey]
      if (!cityConfig) {
        throw new Error(`City ${cityKey} not supported`)
      }

      // Fetch from multiple sources based on city
      const reports = await this.fetchCityReports(cityKey, cityConfig)

      this.cache.set(cacheKey, reports)
      this.lastUpdate = new Date()

      return reports.slice(0, limit)
    } catch (error) {
      console.error(`Error fetching police reports for ${cityKey}:`, error)
      return this.getCachedData(cacheKey) || []
    }
  }

  /**
   * Get crime statistics for a specific city
   */
  async getCrimeStatistics(cityKey: string): Promise<LocalCrimeStats> {
    const reports = await this.getLatestReports(cityKey, 1000)
    const cityConfig = SUPPORTED_CITIES[cityKey]
    
    if (!cityConfig) {
      throw new Error(`City ${cityKey} not supported`)
    }
    
    const stats: LocalCrimeStats = {
      period: 'Letzte 30 Tage',
      totalIncidents: reports.length,
      byCategory: this.groupByCategory(reports),
      byDistrict: this.groupByDistrict(reports),
      trend: this.calculateTrend(reports),
      hotspots: this.calculateHotspots(reports)
    }

    return stats
  }

  /**
   * Get risk assessment for specific city/district
   */
  async getDistrictRisk(cityKey: string, district?: string): Promise<{
    city: string
    district: string
    riskScore: number
    riskLevel: PoliceSeverity
    recentIncidents: LocalPoliceReport[]
    recommendations: string[]
  }> {
    const reports = await this.getLatestReports(cityKey, 200)
    const cityConfig = SUPPORTED_CITIES[cityKey]
    
    if (!cityConfig) {
      throw new Error(`City ${cityKey} not supported`)
    }
    
    const districtReports = district 
      ? reports.filter(r => 
          r.location.district?.toLowerCase().includes(district.toLowerCase())
        )
      : reports

    const riskScore = this.calculateDistrictRisk(districtReports)
    const riskLevel = this.getRiskLevelFromScore(riskScore)

    return {
      city: cityConfig.name,
      district: district || cityConfig.name,
      riskScore,
      riskLevel,
      recentIncidents: districtReports.slice(0, 10),
      recommendations: this.getRecommendations(riskLevel, districtReports)
    }
  }

  /**
   * Get supported cities list
   */
  getSupportedCities(): Array<{
    key: string
    name: string
    state: string
    population: string
    policeDepartment: string
  }> {
    return Object.entries(SUPPORTED_CITIES).map(([key, config]) => ({
      key,
      name: config.name,
      state: config.state,
      population: config.population,
      policeDepartment: config.policeDepartment
    }))
  }

  /**
   * Get city configuration
   */
  getCityConfig(cityKey: string): CityConfig | null {
    return SUPPORTED_CITIES[cityKey] || null
  }

  // --- Private Methods ---

  private async fetchCityReports(cityKey: string, cityConfig: CityConfig): Promise<LocalPoliceReport[]> {
    switch (cityKey) {
      case 'bad-kreuznach':
        return await this.fetchBadKreuznachReports(cityConfig)
      case 'bad-neuenahr-ahrweiler':
        return await this.fetchBadNeuenahrAhrweilerReports(cityConfig)
      case 'simmern':
        return await this.fetchSimmernReports(cityConfig)
      default:
        throw new Error(`City ${cityKey} not supported`)
    }
  }

  private async fetchBadKreuznachReports(cityConfig: CityConfig): Promise<LocalPoliceReport[]> {
    // In real implementation, this would scrape presseportal.de/blaulight
    return [
      {
        id: 'pk-bk-20260308-001',
        timestamp: new Date('2026-03-08T14:30:00'),
        title: 'Verkehrsunfall auf REWE-Parkplatz',
        description: 'Unfallhergang noch unklar, Polizei ermittelt.',
        category: PoliceCategory.TRAFFIC,
        severity: PoliceSeverity.LOW,
        location: {
          city: cityConfig.name,
          street: 'REWE-Parkplatz'
        },
        source: 'presseportal',
        url: 'https://www.presseportal.de/blaulight/nr/117703',
        status: 'INVESTIGATING'
      },
      {
        id: 'pk-bk-20260308-002', 
        timestamp: new Date('2026-03-08T02:15:00'),
        title: 'Nächtlicher Knall sorgt für Aufmerksamkeit',
        description: 'Zivilstreife kontrollierte und sicherte Lage.',
        category: PoliceCategory.PUBLIC_ORDER,
        severity: PoliceSeverity.MEDIUM,
        location: {
          city: cityConfig.name
        },
        source: 'presseportal',
        url: 'https://www.presseportal.de/blaulight/r/Bad%20Kreuznach',
        status: 'RESOLVED'
      }
    ]
  }

  private async fetchBadNeuenahrAhrweilerReports(cityConfig: CityConfig): Promise<LocalPoliceReport[]> {
    // Real implementation would scrape Bad Neuenahr-Ahrweiler sources
    return [
      {
        id: 'bna-20260308-001',
        timestamp: new Date('2026-03-08T10:00:00'),
        title: 'Schulwegkontrollen in der Stadt',
        description: 'Polizei kontrolliert Verkehrssicherheit an Schulen.',
        category: PoliceCategory.TRAFFIC,
        severity: PoliceSeverity.LOW,
        location: {
          city: cityConfig.name,
          district: 'Ahrweiler'
        },
        source: 'presseportal',
        url: 'https://www.presseportal.de/blaulight/r/Bad%20Neuenahr-Ahrweiler',
        status: 'ACTIVE'
      },
      {
        id: 'bna-20260306-001',
        timestamp: new Date('2026-03-06T16:30:00'),
        title: 'Verkehrsunfall mit Verletzten',
        description: 'Auffahrunfall an der Bundesstraße, mehrere Verletzte.',
        category: PoliceCategory.TRAFFIC,
        severity: PoliceSeverity.HIGH,
        location: {
          city: cityConfig.name,
          district: 'Bad Neuenahr'
        },
        source: 'rhein-zeitung',
        url: 'https://www.rhein-zeitung.de/blaulight/polizeimeldungen-koblenz-und-region/',
        status: 'INVESTIGATING'
      }
    ]
  }

  private async fetchSimmernReports(cityConfig: CityConfig): Promise<LocalPoliceReport[]> {
    // Real implementation would scrape Simmern sources
    return [
      {
        id: 'sim-20260308-001',
        timestamp: new Date('2026-03-08T09:15:00'),
        title: 'Brand in Kastellaun - Ermittlungen laufen',
        description: 'Einfamilienhaus brannte nieder, Ursache wird untersucht.',
        category: PoliceCategory.FIRE,
        severity: PoliceSeverity.HIGH,
        location: {
          city: cityConfig.name,
          district: 'Kastellaun'
        },
        source: 'presseportal',
        url: 'https://www.presseportal.de/blaulight/r/Simmern',
        status: 'INVESTIGATING'
      },
      {
        id: 'sim-20260305-001',
        timestamp: new Date('2026-03-05T14:20:00'),
        title: 'Betrugswarnung: Falsche Polizisten am Telefon',
        description: 'Betrüger geben sich als Polizisten aus und erbitten Geld.',
        category: PoliceCategory.FRAUD,
        severity: PoliceSeverity.MEDIUM,
        location: {
          city: cityConfig.name
        },
        source: 'wochenspiegellive',
        url: 'https://www.wochenspiegellive.de/rhein-hunsrueck-kreis/artikel/polizei-simmern-meldet-aktuell-anrufwelle-von-falschen-polizeibeamten',
        status: 'ACTIVE'
      }
    ]
  }

  private isCacheValid(key: string): boolean {
    if (!this.lastUpdate) return false
    return Date.now() - this.lastUpdate.getTime() < this.CACHE_DURATION
  }

  private getCachedData(key: string): LocalPoliceReport[] | null {
    return this.cache.has(key) ? this.cache.get(key)! : null
  }

  private groupByCategory(reports: LocalPoliceReport[]): Record<PoliceCategory, number> {
    const groups: Record<PoliceCategory, number> = {
      [PoliceCategory.TRAFFIC]: 0,
      [PoliceCategory.THEFT]: 0,
      [PoliceCategory.ASSAULT]: 0,
      [PoliceCategory.VANDALISM]: 0,
      [PoliceCategory.DRUGS]: 0,
      [PoliceCategory.PUBLIC_ORDER]: 0,
      [PoliceCategory.MISSING_PERSON]: 0,
      [PoliceCategory.FRAUD]: 0,
      [PoliceCategory.BURGLARY]: 0,
      [PoliceCategory.FIRE]: 0,
      [PoliceCategory.OTHER]: 0
    }

    reports.forEach(report => {
      groups[report.category] = (groups[report.category] || 0) + 1
    })

    return groups
  }

  private groupByDistrict(reports: LocalPoliceReport[]): Record<string, number> {
    const groups: Record<string, number> = {}
    
    reports.forEach(report => {
      const district = report.location.district || reports[0]?.location.city || 'Unknown'
      groups[district] = (groups[district] || 0) + 1
    })

    return groups
  }

  private calculateTrend(reports: LocalPoliceReport[]): 'INCREASING' | 'STABLE' | 'DECREASING' {
    if (reports.length < 10) return 'STABLE'
    
    const recentWeek = reports.filter(r => 
      r.timestamp.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length
    
    const previousWeek = reports.filter(r => 
      r.timestamp.getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000 &&
      r.timestamp.getTime() <= Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length

    if (recentWeek > previousWeek * 1.2) return 'INCREASING'
    if (recentWeek < previousWeek * 0.8) return 'DECREASING'
    return 'STABLE'
  }

  private calculateHotspots(reports: LocalPoliceReport[]) {
    const districtCounts = this.groupByDistrict(reports)
    
    return Object.entries(districtCounts).map(([district, count]) => ({
      district,
      incidentCount: count,
      riskLevel: count > 10 ? 90 : count > 5 ? 70 : count > 2 ? 50 : 30
    }))
  }

  private calculateDistrictRisk(reports: LocalPoliceReport[]): number {
    if (reports.length === 0) return 0

    let totalRisk = 0
    reports.forEach(report => {
      const severityWeight = {
        [PoliceSeverity.LOW]: 1,
        [PoliceSeverity.MEDIUM]: 3,
        [PoliceSeverity.HIGH]: 7,
        [PoliceSeverity.CRITICAL]: 15
      }
      totalRisk += severityWeight[report.severity]
    })

    // Normalize to 0-100 scale
    const maxPossibleRisk = reports.length * 15
    return Math.min(100, Math.round((totalRisk / maxPossibleRisk) * 100))
  }

  private getRiskLevelFromScore(score: number): PoliceSeverity {
    if (score >= 80) return PoliceSeverity.CRITICAL
    if (score >= 60) return PoliceSeverity.HIGH
    if (score >= 30) return PoliceSeverity.MEDIUM
    return PoliceSeverity.LOW
  }

  private getRecommendations(riskLevel: PoliceSeverity, reports: LocalPoliceReport[]): string[] {
    const baseRecommendations = [
      'Folgen Sie den lokalen Polizeimeldungen auf presseportal.de',
      'Speichern Sie die Notrufnummer 110 in Ihrem Telefon',
      'Informieren Sie Nachbarn über verdächtige Aktivitäten'
    ]

    if (riskLevel === PoliceSeverity.CRITICAL) {
      return [
        ...baseRecommendations,
        'Vermeiden Sie nachts bestimmte Stadtteile',
        'Sichern Sie Fahrzeuge und Wohnungen besonders gut',
        'Nutzen Sie wenn möglich Begleitung in der Nacht'
      ]
    }

    if (riskLevel === PoliceSeverity.HIGH) {
      return [
        ...baseRecommendations,
        'Achten Sie auf Ihre Umgebung, besonders in der Nacht',
        'Sichern Sie Wertsachen gegen Diebstahl'
      ]
    }

    return baseRecommendations
  }
}

export default RegionalPoliceService