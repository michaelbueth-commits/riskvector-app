// Fixed EmergencyContacts Type Definition

export interface Consulate {
  city: string
  address: string
  phone: string
  email?: string
  hours?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Embassy {
  city: string
  address: string
  phone: string
  email?: string
  hours?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface EmergencyNumber {
  type: 'police' | 'ambulance' | 'fire' | 'general'
  number: string
  description?: string
}

export interface Hospital {
  name: string
  address: string
  phone: string
  type: 'public' | 'private' | 'emergency'
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface CountryEmergencyContacts {
  country: string
  countryCode: string
  embassies: Embassy[]
  consulates: Consulate[]  // ← ADDED THIS
  emergencyNumbers: EmergencyNumber[]
  hospitals?: Hospital[]
  travelAdvisory?: {
    level: 'low' | 'medium' | 'high' | 'extreme'
    message: string
    lastUpdated: string
  }
}

export const emergencyContacts: CountryEmergencyContacts[] = [
  // Data will be added here
]
