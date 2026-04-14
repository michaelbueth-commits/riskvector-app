export interface ConflictAlert {
  id: string
  type: 'rocket' | 'airstrike' | 'military' | 'civil_unrest' | 'terrorism' | 'natural_disaster' | 'nuclear' | 'biochemical'
  severity: 'info' | 'warning' | 'urgent' | 'critical'
  country: string
  region?: string
  city?: string
  title: string
  description: string
  timestamp: string
  source: string
  instructions?: string[]
  shelterRequired: boolean
  lat?: number
  lng?: number
}
