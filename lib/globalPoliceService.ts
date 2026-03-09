import { GlobalPoliceStation, GlobalPoliceReport, CountryPoliceSystem, PoliceCategory } from './globalPoliceTypes'

// Emergency numbers database
const EMERGENCY_NUMBERS: { [key: string]: string } = {
  'US': '911',
  'CA': '911',
  'MX': '911',
  'GB': '999',
  'FR': '17',
  'DE': '110',
  'IT': '112',
  'ES': '112',
  'NL': '112',
  'BE': '112',
  'CH': '112',
  'AT': '112',
  'SE': '112',
  'NO': '112',
  'DK': '112',
  'FI': '112',
  'IE': '999',
  'PT': '112',
  'GR': '112',
  'TR': '112',
  'AU': '000',
  'NZ': '111',
  'JP': '110',
  'KR': '112',
  'CN': '110',
  'IN': '112',
  'RU': '112',
  'BR': '190',
  'AR': '911',
  'CL': '133',
  'CO': '123',
  'PE': '105',
  'ZA': '10111',
  'EG': '122',
  'MA': '190',
  'DZ': '17',
  'TN': '197',
  'NG': '112',
  'KE': '999',
  'GH': '191',
  'PH': '911',
  'TH': '191',
  'VN': '113',
  'MY': '999',
  'SG': '999',
  'ID': '112',
  'PK': '15',
  'BD': '999',
  'LK': '119',
  'NP': '100',
  'MM': '199',
  'KH': '117',
  'LA': '191',
  'MN': '102',
  'UZ': '102',
  'KZ': '112',
  'KG': '102',
  'TJ': '112',
  'TM': '103',
  'GE': '112',
  'AM': '102',
  'AZ': '102',
  'IL': '100',
  'SA': '999',
  'AE': '999',
  'QA': '999',
  'KW': '112',
  'BH': '999',
  'OM': '9999',
  'JO': '911',
  'LB': '112',
  'SY': '112',
  'IQ': '122',
  'IR': '110',
  'AF': '119',
  'LV': '112',
  'LT': '112',
  'EE': '112',
  'PL': '112',
  'CZ': '112',
  'SK': '112',
  'HU': '112',
  'RO': '112',
  'BG': '112',
  'HR': '112',
  'SI': '112',
  'BA': '122',
  'ME': '122',
  'RS': '112',
  'MK': '192',
  'AL': '112',
  'XK': '112',
  'MD': '112',
  'UA': '112',
  'BY': '102',
  'AD': '112',
  'MC': '112',
  'LI': '112',
  'LU': '112'
}

class GlobalPoliceService {
  private stations: GlobalPoliceStation[] = []
  private reports: GlobalPoliceReport[] = []
  private countrySystems: { [key: string]: CountryPoliceSystem } = {}

  constructor() {
    this.initializeData()
  }

  private async initializeData() {
    // Initialize with major cities and their police systems
    await this.loadCountrySystems()
    await this.loadMajorStations()
    await this.generateSampleReports()
  }

  private async loadCountrySystems() {
    // Load police system information for different countries
    this.countrySystems = {
      'US': {
        countryCode: 'US',
        country: 'United States',
        system: {
          name: 'Multiple Law Enforcement Agencies',
          emergencyNumber: '911',
          nonEmergencyNumber: '311',
          structure: 'local',
          levels: ['Federal', 'State', 'County', 'City', 'Town']
        },
        coverage: {
          totalStations: 17984,
          regionsCovered: ['All 50 States', 'Washington D.C.', 'Territories'],
          lastUpdate: '2024-01-15'
        },
        dataSources: {
          official: ['FBI', 'DOJ', 'Local Police Departments'],
          news: ['AP', 'Reuters', 'Local Newspapers'],
          community: ['Police.community', 'Nextdoor'],
          apis: ['FBI Crime Data API', 'Data.gov']
        }
      },
      'GB': {
        countryCode: 'GB',
        country: 'United Kingdom',
        system: {
          name: 'British Police',
          emergencyNumber: '999',
          nonEmergencyNumber: '101',
          structure: 'regional',
          levels: ['Territorial', 'Specialist']
        },
        coverage: {
          totalStations: 2298,
          regionsCovered: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
          lastUpdate: '2024-01-10'
        },
        dataSources: {
          official: ['Police.uk', 'Home Office'],
          news: ['BBC', 'The Guardian', 'Local News'],
          community: ['Neighbourhood Watch'],
          apis: ['Police.uk API', 'Crime Map']
        }
      },
      'DE': {
        countryCode: 'DE',
        country: 'Germany',
        system: {
          name: 'German Police',
          emergencyNumber: '110',
          nonEmergencyNumber: '110',
          structure: 'federal',
          levels: ['Federal', 'State', 'Local']
        },
        coverage: {
          totalStations: 3840,
          regionsCovered: ['All 16 Bundesländer'],
          lastUpdate: '2024-01-08'
        },
        dataSources: {
          official: ['BKA', 'LKA', 'Local PDs'],
          news: ['Spiegel', 'Bild', 'Local Papers'],
          community: ['Nachbarschaftswache'],
          apis: ['Polizei-Berlin.de', 'BKA Portal']
        }
      },
      'FR': {
        countryCode: 'FR',
        country: 'France',
        system: {
          name: 'Police Nationale',
          emergencyNumber: '17',
          nonEmergencyNumber: '17',
          structure: 'centralized',
          levels: ['National', 'Departmental', 'Local']
        },
        coverage: {
          totalStations: 1650,
          regionsCovered: ['All Departments', 'Overseas Territories'],
          lastUpdate: '2024-01-12'
        },
        dataSources: {
          official: ['Ministère de l\'Intérieur', 'Police Nationale'],
          news: ['Le Monde', 'Le Figaro', 'Local Press'],
          community: ['Voisins Vigilants'],
          apis: ['Gouvernement.fr', 'Data.gouv.fr']
        }
      },
      'JP': {
        countryCode: 'JP',
        country: 'Japan',
        system: {
          name: 'National Police Agency',
          emergencyNumber: '110',
          nonEmergencyNumber: '#9110',
          structure: 'centralized',
          levels: ['National', 'Prefectural', 'Local']
        },
        coverage: {
          totalStations: 1260,
          regionsCovered: ['All 47 Prefectures'],
          lastUpdate: '2024-01-05'
        },
        dataSources: {
          official: ['NPA', 'Prefectural Police'],
          news: ['NHK', 'Asahi Shimbun', 'Local Papers'],
          community: ['Chonaikai'],
          apis: ['NPA Portal', 'Open Data Japan']
        }
      }
    }
  }

  private async loadMajorStations() {
    // Sample major police stations worldwide
    this.stations = [
      // North America
      {
        id: 'nypd-headquarters',
        name: 'New York Police Department Headquarters',
        type: 'headquarters',
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        city: 'New York City',
        address: {
          street: '1 Police Plaza',
          postalCode: '10038',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        contact: {
          emergency: '911',
          nonEmergency: '646-610-5000',
          website: 'https://www1.nyc.gov/site/nypd'
        },
        services: ['Emergency Response', 'Crime Investigation', 'Community Policing', 'Traffic Control'],
        jurisdiction: 'New York City (5 Boroughs)',
        hours: {
          monday: '24/7', tuesday: '24/7', wednesday: '24/7', thursday: '24/7',
          friday: '24/7', saturday: '24/7', sunday: '24/7'
        },
        lastUpdated: '2024-01-15T10:00:00Z',
        source: 'NYPD Official',
        reliability: 'verified'
      },
      {
        id: 'lapd-headquarters',
        name: 'Los Angeles Police Department Headquarters',
        type: 'headquarters',
        country: 'United States',
        countryCode: 'US',
        region: 'California',
        city: 'Los Angeles',
        address: {
          street: '100 W 1st St',
          postalCode: '90012',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        contact: {
          emergency: '911',
          nonEmergency: '877-ASK-LAPD',
          website: 'https://www.lapdonline.org'
        },
        services: ['Patrol', 'Detective', 'Traffic', 'Special Operations'],
        jurisdiction: 'City of Los Angeles',
        hours: {
          monday: '24/7', tuesday: '24/7', wednesday: '24/7', thursday: '24/7',
          friday: '24/7', saturday: '24/7', sunday: '24/7'
        },
        lastUpdated: '2024-01-14T09:30:00Z',
        source: 'LAPD Official',
        reliability: 'verified'
      },
      // Europe
      {
        id: 'metropolitan-police',
        name: 'Metropolitan Police Service',
        type: 'headquarters',
        country: 'United Kingdom',
        countryCode: 'GB',
        region: 'England',
        city: 'London',
        address: {
          street: 'New Scotland Yard',
          postalCode: 'SW1H 0BG',
          coordinates: { lat: 51.5074, lng: -0.1278 }
        },
        contact: {
          emergency: '999',
          nonEmergency: '101',
          website: 'https://www.met.police.uk'
        },
        services: ['Policing', 'Counter-terrorism', 'Specialist Crime', 'Traffic'],
        jurisdiction: 'Greater London',
        hours: {
          monday: '24/7', tuesday: '24/7', wednesday: '24/7', thursday: '24/7',
          friday: '24/7', saturday: '24/7', sunday: '24/7'
        },
        lastUpdated: '2024-01-10T08:00:00Z',
        source: 'Met Police Official',
        reliability: 'verified'
      },
      {
        id: 'berliner-polizei',
        name: 'Berliner Polizei',
        type: 'headquarters',
        country: 'Germany',
        countryCode: 'DE',
        region: 'Berlin',
        city: 'Berlin',
        address: {
          street: 'Alt-Moabit 140',
          postalCode: '10559',
          coordinates: { lat: 52.5200, lng: 13.4050 }
        },
        contact: {
          emergency: '110',
          website: 'https://www.berlin.de/polizei'
        },
        services: ['Schutzpolizei', 'Kriminalpolizei', 'Verkehrspolizei'],
        jurisdiction: 'Land Berlin',
        hours: {
          monday: '24/7', tuesday: '24/7', wednesday: '24/7', thursday: '24/7',
          friday: '24/7', saturday: '24/7', sunday: '24/7'
        },
        lastUpdated: '2024-01-08T07:30:00Z',
        source: 'Polizei Berlin',
        reliability: 'verified'
      },
      // Asia
      {
        id: 'tokyo-metropolitan-police',
        name: 'Tokyo Metropolitan Police Department',
        type: 'headquarters',
        country: 'Japan',
        countryCode: 'JP',
        region: 'Kanto',
        city: 'Tokyo',
        address: {
          street: '2-1-1 Kasumigaseki',
          postalCode: '100-8929',
          coordinates: { lat: 35.6762, lng: 139.6503 }
        },
        contact: {
          emergency: '110',
          nonEmergency: '#9110',
          website: 'https://www.keishicho.metro.tokyo.jp'
        },
        services: ['Community Safety', 'Criminal Investigation', 'Traffic', 'Security'],
        jurisdiction: 'Tokyo Metropolis',
        hours: {
          monday: '24/7', tuesday: '24/7', wednesday: '24/7', thursday: '24/7',
          friday: '24/7', saturday: '24/7', sunday: '24/7'
        },
        lastUpdated: '2024-01-05T09:00:00Z',
        source: 'Tokyo Metropolitan Police',
        reliability: 'verified'
      }
    ]
  }

  private async generateSampleReports() {
    // Generate sample police reports from different countries
    const reports: GlobalPoliceReport[] = [
      // US Reports
      {
        id: 'nypd-2024-001',
        title: 'Traffic Collision - Broadway & 42nd Street',
        description: 'Multi-vehicle accident reported at intersection. No serious injuries reported.',
        category: 'TRAFFIC',
        severity: 'MEDIUM',
        location: {
          country: 'United States',
          countryCode: 'US',
          region: 'New York',
          city: 'New York City',
          coordinates: { lat: 40.7580, lng: -73.9855 }
        },
        timestamp: '2024-01-15T14:30:00Z',
        source: {
          name: 'NYPD',
          type: 'official'
        },
        stationId: 'nypd-headquarters',
        tags: ['traffic', 'accident', 'manhattan'],
        verified: true,
        language: 'en'
      },
      {
        id: 'lapd-2024-002',
        title: 'Burglary Investigation - Hollywood',
        description: 'Residential burglary reported. Suspect fled on foot. Investigation ongoing.',
        category: 'BURGLARY',
        severity: 'HIGH',
        location: {
          country: 'United States',
          countryCode: 'US',
          region: 'California',
          city: 'Los Angeles',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        timestamp: '2024-01-14T22:15:00Z',
        source: {
          name: 'LAPD',
          type: 'official'
        },
        stationId: 'lapd-headquarters',
        tags: ['burglary', 'investigation', 'hollywood'],
        verified: true,
        language: 'en'
      },
      // UK Reports
      {
        id: 'met-2024-003',
        title: 'Missing Person - Central London',
        description: 'Missing person reported. Last seen near Trafalgar Square. Police seeking public assistance.',
        category: 'MISSING_PERSON',
        severity: 'HIGH',
        location: {
          country: 'United Kingdom',
          countryCode: 'GB',
          region: 'England',
          city: 'London',
          coordinates: { lat: 51.5074, lng: -0.1278 }
        },
        timestamp: '2024-01-10T16:45:00Z',
        source: {
          name: 'Metropolitan Police',
          type: 'official'
        },
        stationId: 'metropolitan-police',
        tags: ['missing', 'person', 'trafalgar-square'],
        verified: true,
        language: 'en'
      },
      // Germany Reports
      {
        id: 'berlin-2024-004',
        title: 'Verkehrsunfall - Alexanderplatz',
        description: 'Auffahrunfall mit zwei Personenkraftwagen. Eine Person leicht verletzt.',
        category: 'ACCIDENT',
        severity: 'LOW',
        location: {
          country: 'Germany',
          countryCode: 'DE',
          region: 'Berlin',
          city: 'Berlin',
          coordinates: { lat: 52.5217, lng: 13.4108 }
        },
        timestamp: '2024-01-08T08:20:00Z',
        source: {
          name: 'Berliner Polizei',
          type: 'official'
        },
        stationId: 'berliner-polizei',
        tags: ['verkehrsunfall', 'alexanderplatz', 'auffahrunfall'],
        verified: true,
        language: 'de'
      },
      // Japan Reports
      {
        id: 'tokyo-2024-005',
        title: '窃盗事件 - 渋谷区',
        description: '渋谷センター街でのスリ事件。被害者は観光客女性。',
        category: 'THEFT',
        severity: 'MEDIUM',
        location: {
          country: 'Japan',
          countryCode: 'JP',
          region: 'Kanto',
          city: 'Tokyo',
          coordinates: { lat: 35.6586, lng: 139.7016 }
        },
        timestamp: '2024-01-05T15:30:00Z',
        source: {
          name: 'Tokyo Metropolitan Police',
          type: 'official'
        },
        stationId: 'tokyo-metropolitan-police',
        tags: ['theft', 'shibuya', 'pickpocket', 'tourist'],
        verified: true,
        language: 'ja'
      }
    ]

    this.reports = reports.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // Public API Methods
  async getStationsByCountry(countryCode: string): Promise<GlobalPoliceStation[]> {
    return this.stations.filter(station => station.countryCode === countryCode)
  }

  async getStationsByCity(city: string, countryCode?: string): Promise<GlobalPoliceStation[]> {
    return this.stations.filter(station => {
      const cityMatch = station.city.toLowerCase() === city.toLowerCase()
      const countryMatch = !countryCode || station.countryCode === countryCode
      return cityMatch && countryMatch
    })
  }

  async getReportsByCountry(countryCode: string, limit: number = 50): Promise<GlobalPoliceReport[]> {
    return this.reports
      .filter(report => report.location.countryCode === countryCode)
      .slice(0, limit)
  }

  async getReportsByCity(city: string, countryCode: string, limit: number = 20): Promise<GlobalPoliceReport[]> {
    return this.reports
      .filter(report => 
        report.location.city.toLowerCase() === city.toLowerCase() &&
        report.location.countryCode === countryCode
      )
      .slice(0, limit)
  }

  async getRecentReports(limit: number = 20): Promise<GlobalPoliceReport[]> {
    return this.reports.slice(0, limit)
  }

  async getCountrySystem(countryCode: string): Promise<CountryPoliceSystem | null> {
    return this.countrySystems[countryCode] || null
  }

  async getEmergencyNumber(countryCode: string): Promise<string> {
    return EMERGENCY_NUMBERS[countryCode] || '112' // Default to 112 (EU standard)
  }

  async searchStations(query: string): Promise<GlobalPoliceStation[]> {
    const lowerQuery = query.toLowerCase()
    return this.stations.filter(station =>
      station.name.toLowerCase().includes(lowerQuery) ||
      station.city.toLowerCase().includes(lowerQuery) ||
      station.country.toLowerCase().includes(lowerQuery) ||
      station.address.street?.toLowerCase().includes(lowerQuery)
    )
  }

  async getGlobalStats(): Promise<{
    totalStations: number
    totalReports: number
    countriesCovered: number
    citiesCovered: number
    lastUpdate: string
  }> {
    const countries = new Set(this.stations.map(s => s.countryCode))
    const cities = new Set(this.stations.map(s => `${s.city},${s.countryCode}`))
    
    return {
      totalStations: this.stations.length,
      totalReports: this.reports.length,
      countriesCovered: countries.size,
      citiesCovered: cities.size,
      lastUpdate: new Date().toISOString()
    }
  }

  async getReportsByCategory(category: string, limit: number = 20): Promise<GlobalPoliceReport[]> {
    return this.reports
      .filter(report => report.category === category.toUpperCase())
      .slice(0, limit)
  }

  async getReportsBySeverity(severity: string, limit: number = 20): Promise<GlobalPoliceReport[]> {
    return this.reports
      .filter(report => report.severity === severity.toUpperCase())
      .slice(0, limit)
  }
}

// Export singleton instance
export const globalPoliceService = new GlobalPoliceService()
export default GlobalPoliceService