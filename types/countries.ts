// Country and Region types for geographic filtering

export interface Country {
  code: string
  name: string
  region: string
  subregion?: string
  continent: string
  capital?: string
  population?: number
  area?: number
  languages?: string[]
  currencies?: string[]
  timezone?: string
  coordinates?: {
    lat: number
    lng: number
  }
  emergency?: {
    police: string
    medical: string
    fire: string
  }
  risk?: {
    level: 'low' | 'medium' | 'high' | 'critical'
    score: number
    factors: string[]
    lastUpdated: string
  }
}

export interface Region {
  code: string
  name: string
  countries: string[]
  subregions?: string[]
  coordinates?: {
    north: number
    south: number
    east: number
    west: number
  }
  risk?: {
    level: 'low' | 'medium' | 'high' | 'critical'
    score: number
    conflicts: number
    lastUpdated: string
  }
}

// Region definitions
export const REGIONS: Region[] = [
  {
    code: 'EU',
    name: 'Europe',
    countries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    subregions: ['Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe'],
    coordinates: { north: 71.2, south: 35.8, east: 40.2, west: -25.0 },
    risk: {
      level: 'low',
      score: 25,
      conflicts: 2,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'AS',
    name: 'Asia',
    countries: ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'NK', 'OM', 'PK', 'PS', 'PH', 'QA', 'RU', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'],
    subregions: ['Central Asia', 'Eastern Asia', 'Southern Asia', 'Southeastern Asia', 'Western Asia'],
    coordinates: { north: 77.6, south: -11.3, east: 148.9, west: 25.8 },
    risk: {
      level: 'high',
      score: 72,
      conflicts: 15,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'NA',
    name: 'North America',
    countries: ['CA', 'US', 'MX', 'GL'],
    coordinates: { north: 83.1, south: 13.2, east: -52.6, west: -169.0 },
    risk: {
      level: 'low',
      score: 30,
      conflicts: 1,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'SA',
    name: 'South America',
    countries: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'],
    coordinates: { north: 13.4, south: -55.9, east: -32.4, west: -92.0 },
    risk: {
      level: 'medium',
      score: 58,
      conflicts: 8,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'AF',
    name: 'Africa',
    countries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'SZ', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
    coordinates: { north: 37.3, south: -34.8, east: 52.0, west: -17.6 },
    risk: {
      level: 'high',
      score: 78,
      conflicts: 22,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'OC',
    name: 'Oceania',
    countries: ['AU', 'NZ', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NU', 'PW', 'PG', 'SB', 'TO', 'TV', 'VU', 'WS', 'AS', 'CK', 'PF', 'NC', 'NU', 'TK', 'TV', 'WF'],
    coordinates: { north: -5.5, south: -47.2, east: -120.3, west: -179.9 },
    risk: {
      level: 'low',
      score: 15,
      conflicts: 0,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'ME',
    name: 'Middle East',
    countries: ['TR', 'CY', 'SY', 'LB', 'IL', 'JO', 'IQ', 'IR', 'KW', 'SA', 'YE', 'OM', 'AE', 'BH', 'QA'],
    coordinates: { north: 42.4, south: 12.6, east: 63.3, west: 35.9 },
    risk: {
      level: 'critical',
      score: 89,
      conflicts: 12,
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  }
]

// Country data
export const countries: Country[] = [
  // Europe
  {
    code: 'DE',
    name: 'Germany',
    region: 'Europe',
    subregion: 'Western Europe',
    continent: 'Europe',
    capital: 'Berlin',
    population: 83240525,
    area: 357022,
    languages: ['German'],
    currencies: ['EUR'],
    timezone: 'Europe/Berlin',
    coordinates: { lat: 51.165691, lng: 10.451526 },
    emergency: {
      police: '110',
      medical: '112',
      fire: '112'
    },
    risk: {
      level: 'low',
      score: 28,
      factors: ['Political stability', 'Strong economy', 'Low crime rate'],
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'GR',
    name: 'Greece',
    region: 'Europe',
    subregion: 'Southern Europe',
    continent: 'Europe',
    capital: 'Athens',
    population: 10423054,
    area: 131957,
    languages: ['Greek'],
    currencies: ['EUR'],
    timezone: 'Europe/Athens',
    coordinates: { lat: 39.0742, lng: 21.824312 },
    emergency: {
      police: '100',
      medical: '166',
      fire: '199'
    },
    risk: {
      level: 'medium',
      score: 52,
      factors: ['Economic instability', 'Immigration pressure', 'Political tensions'],
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  {
    code: 'TR',
    name: 'Turkey',
    region: 'Middle East',
    subregion: 'Western Asia',
    continent: 'Asia',
    capital: 'Ankara',
    population: 84339067,
    area: 783562,
    languages: ['Turkish'],
    currencies: ['TRY'],
    timezone: 'Europe/Istanbul',
    coordinates: { lat: 38.963745, lng: 35.243322 },
    emergency: {
      police: '155',
      medical: '112',
      fire: '110'
    },
    risk: {
      level: 'high',
      score: 76,
      factors: ['Political instability', 'Economic crisis', 'Security concerns', 'Natural disasters'],
      lastUpdated: '2026-03-07T00:00:00Z'
    }
  },
  // Add more countries as needed...
]

// Utility functions
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code)
}

export function getCountriesByRegion(regionCode: string): Country[] {
  const region = REGIONS.find(r => r.code === regionCode)
  if (!region) return []
  
  return countries.filter(country => region.countries.includes(country.code))
}

export function getRegionByCountry(countryCode: string): Region | undefined {
  return REGIONS.find(region => region.countries.includes(countryCode))
}

export function getHighRiskCountries(): Country[] {
  return countries.filter(country => 
    country.risk && ['high', 'critical'].includes(country.risk.level)
  )
}

export function calculateRegionRisk(regionCode: string): { level: 'low' | 'medium' | 'high' | 'critical', score: number } {
  const regionCountries = getCountriesByRegion(regionCode)
  
  if (regionCountries.length === 0) {
    return { level: 'low', score: 0 }
  }
  
  const totalRisk = regionCountries.reduce((sum, country) => 
    sum + (country.risk?.score || 0), 0
  )
  
  const averageRisk = totalRisk / regionCountries.length
  const riskLevel = averageRisk >= 80 ? 'critical' :
                     averageRisk >= 60 ? 'high' :
                     averageRisk >= 40 ? 'medium' : 'low'
  
  return { level: riskLevel, score: Math.round(averageRisk) }
}