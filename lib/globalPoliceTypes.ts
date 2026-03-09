// Global police station data structure and service
export interface GlobalPoliceStation {
  id: string
  name: string
  type: 'headquarters' | 'precinct' | 'substation' | 'highway' | 'specialized'
  country: string
  countryCode: string
  region?: string
  city: string
  address: {
    street?: string
    district?: string
    postalCode?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    emergency?: string
    nonEmergency?: string
    fax?: string
    email?: string
    website?: string
  }
  services: string[]
  jurisdiction?: string
  hours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  lastUpdated: string
  source: string
  reliability: 'verified' | 'community' | 'estimated'
}

export interface GlobalPoliceReport {
  id: string
  title: string
  description: string
  category: PoliceCategory
  severity: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  location: {
    country: string
    countryCode: string
    region?: string
    city: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  timestamp: string
  source: {
    name: string
    url?: string
    type: 'official' | 'news' | 'community' | 'aggregated'
  }
  stationId?: string
  tags: string[]
  verified: boolean
  language: string
}

export type PoliceCategory = 
  | 'TRAFFIC' | 'ACCIDENT' | 'SPEEDING' | 'DUI'
  | 'THEFT' | 'BURGLARY' | 'ROBBERY' | 'SHOPLIFTING'
  | 'ASSAULT' | 'DOMESTIC_VIOLENCE' | 'HARASSMENT'
  | 'DRUGS' | 'NARCOTICS' | 'POSSESSION'
  | 'VANDALISM' | 'PROPERTY_DAMAGE' | 'GRAFFITI'
  | 'MISSING_PERSON' | 'CHILD_ABDUCTION'
  | 'FRAUD' | 'SCAM' | 'IDENTITY_THEFT' | 'CYBERCRIME'
  | 'FIRE' | 'RESCUE' | 'EMERGENCY'
  | 'PUBLIC_ORDER' | 'DISTURBANCE' | 'NOISE_COMPLAINT'
  | 'WEAPON' | 'SHOOTING' | 'STABBING'
  | 'HOMICIDE' | 'SUSPICIOUS_DEATH' | 'INVESTIGATION'
  | 'TERRORISM' | 'EXTREMISM' | 'THREAT'
  | 'NATURAL_DISASTER' | 'WEATHER_EMERGENCY'
  | 'CORPORATE' | 'WHITE_COLLAR' | 'ENVIRONMENTAL'
  | 'HUMAN_TRAFFICKING' | 'SMUGGLING'
  | 'PROTEST' | 'DEMONSTRATION' | 'CIVIL_UNREST'
  | 'ANIMAL' | 'WILDLIFE' | 'PET_COMPLAINT'
  | 'OTHER'

export interface CountryPoliceSystem {
  countryCode: string
  country: string
  system: {
    name: string
    emergencyNumber: string
    nonEmergencyNumber?: string
    structure: 'centralized' | 'federal' | 'local' | 'mixed'
    levels: string[]
  }
  coverage: {
    totalStations: number
    regionsCovered: string[]
    lastUpdate: string
  }
  dataSources: {
    official?: string
    news?: string[]
    community?: string[]
    apis?: string[]
  }
}