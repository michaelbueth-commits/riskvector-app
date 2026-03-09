// Enhanced alert types for the 4-category alert system
export interface EnhancedAlert {
  // Common properties for all alerts
  id: string
  category: string
  title: string
  location: string
  country: string
  countryCode: string
  timestamp: string
  description: string
  severity: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  source: string
  sourceId: string
  url?: string
  coordinates?: {
    lat: number
    lng: number
  }
  
  // Type-specific properties
  type: 'NEWS' | 'POLICE' | 'ORGANIZATION' | 'GOVERNMENT'
  
  // Source verification details
  verification: {
    level: 'UNVERIFIED' | 'VERIFIED' | 'OFFICIAL'
    timestamp: string
    method?: 'AUTOMATIC' | 'MANUAL' | 'API'
    verifiedBy?: string
  }
  
  // Alert classification
  classification: {
    primary: string
    secondary?: string[]
    tags: string[]
    confidence: number // 0-100
  }
  
  // Geographic scope
  scope: {
    level: 'GLOBAL' | 'REGIONAL' | 'NATIONAL' | 'PROVINCIAL' | 'CITY' | 'LOCAL'
    region?: string
    province?: string
    city?: string
    district?: string
  }
  
  // Action information
  action?: {
    type: 'MONITOR' | 'AVOID' | 'EVACUATE' | 'SHELTER' | 'TRAVEL_RESTRICTION' | 'NONE'
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE'
    timeline?: string
    expires?: string
  }
  
  // Distribution information
  distribution: {
    audience: 'PUBLIC' | 'RESTRICTED' | 'OFFICIAL' | 'INTERNAL'
    priority: 'ROUTINE' | 'IMPORTANT' | 'URGENT' | 'CRITICAL'
  }
}

// Source categories with their verification levels
export interface AlertSource {
  id: string
  name: string
  category: 'NEWS' | 'POLICE' | 'ORGANIZATION' | 'GOVERNMENT'
  type: 'WIRE' | 'BROADCAST' | 'PRESS' | 'AGENCY' | 'DEPARTMENT' | 'MINISTRY' | 'EMBASSY' | 'NGO' | 'UN'
  country: string
  countryCode: string
  website?: string
  apiEndpoint?: string
  reliability: number // 0-100
  verificationProcess: 'AUTOMATIC' | 'MANUAL' | 'HYBRID'
  lastUpdated: string
  active: boolean
}

// Enhanced filters for the alert system
export interface AlertFilter {
  types?: AlertType[]
  categories?: string[]
  severity?: Severity[]
  countries?: string[]
  timeRange?: {
    start: string
    end: string
  }
  sources?: string[]
  verificationLevels?: VerificationLevel[]
  scopeLevels?: ScopeLevel[]
  actions?: ActionType[]
}

type AlertType = 'NEWS' | 'POLICE' | 'ORGANIZATION' | 'GOVERNMENT'
type Severity = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type VerificationLevel = 'UNVERIFIED' | 'VERIFIED' | 'OFFICIAL'
type ScopeLevel = 'GLOBAL' | 'REGIONAL' | 'NATIONAL' | 'PROVINCIAL' | 'CITY' | 'LOCAL'
type ActionType = 'MONITOR' | 'AVOID' | 'EVACUATE' | 'SHELTER' | 'TRAVEL_RESTRICTION' | 'NONE'

// Standard categories for each type
export const STANDARD_CATEGORIES = {
  NEWS: ['Politics', 'Economy', 'Security', 'Disaster', 'Health', 'Technology', 'Environment', 'Society'],
  POLICE: ['Traffic', 'Accident', 'Theft', 'Burglary', 'Assault', 'Missing Person', 'Public Order', 'Emergency', 'Investigation'],
  ORGANIZATION: ['Humanitarian', 'Refugee', 'Aid', 'Medical', 'Disaster Relief', 'Human Rights', 'Development', 'Peacekeeping'],
  GOVERNMENT: ['Travel Advisory', 'Security Alert', 'Emergency Declaration', 'Regulation', 'Policy', 'Diplomatic', 'National Emergency', 'State of Emergency']
}

// Severity mapping to colors and icons
export const SEVERITY_MAPPING = {
  MINIMAL: { color: 'blue', icon: 'ℹ️', score: 20 },
  LOW: { color: 'green', icon: '✅', score: 40 },
  MEDIUM: { color: 'yellow', icon: '⚠️', score: 60 },
  HIGH: { color: 'orange', icon: '🚨', score: 80 },
  CRITICAL: { color: 'red', icon: '☢️', score: 100 }
}

// Type mapping to colors and icons
export const TYPE_MAPPING = {
  NEWS: { color: 'purple', icon: '📰', label: 'Nachrichten' },
  POLICE: { color: 'blue', icon: '👮', label: 'Polizei' },
  ORGANIZATION: { color: 'green', icon: '🏢', label: 'Organisationen' },
  GOVERNMENT: { color: 'red', icon: '🏛️', label: 'Staatlich' }
}