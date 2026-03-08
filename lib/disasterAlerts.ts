// Ambee Natural Disasters API Service
// Real-time and historical natural disaster data

export interface AmbeeDisasterEvent {
  [key: string]: any
}

class AmbeeDisasterService {
  private static instance: AmbeeDisasterService
  private baseUrl = 'https://api.ambeedata.com'
  private apiKey: string | null = null
  
  private constructor() {}
  
  static getInstance(): AmbeeDisasterService {
    if (!AmbeeDisasterService.instance) {
      AmbeeDisasterService.instance = new AmbeeDisasterService()
    }
    return AmbeeDisasterService.instance
  }
  
  // Set Ambee API key
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }
  
  // Make API request
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    if (!this.apiKey) {
      throw new Error('Ambee API key not set. Call setApiKey() first.')
    }
    
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`)
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(url.toString(), {
        headers: {
          'x-api-key': this.apiKey,
          'Content-type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Ambee Natural Disasters API request failed: ${error}`)
      return null
    }
  }
  
  // Get latest disasters by geo coordinates
  async getLatestDisastersByGeo(lat: number, lng: number, eventType?: string, limit: number = 10): Promise<AmbeeDisasterEvent | null> {
    return this.apiRequest<AmbeeDisasterEvent>('/disasters/latest/by-lat-lng', { lat, lng, eventType, limit })
  }
  
  // Get latest disasters by continent
  async getLatestDisastersByContinent(continent: string, eventType?: string, limit: number = 10): Promise<AmbeeDisasterEvent | null> {
    return this.apiRequest<AmbeeDisasterEvent>('/disasters/latest/by-continent', { continent, eventType, limit })
  }
  
  // Get latest disasters by country code
  async getLatestDisastersByCountry(countryCode: string, eventType?: string, limit: number = 10): Promise<AmbeeDisasterEvent | null> {
    return this.apiRequest<AmbeeDisasterEvent>('/disasters/latest/by-country-code', { countryCode, eventType, limit })
  }
}

// Export Ambee Natural Disasters service instance
export const ambeeDisasterService = AmbeeDisasterService.getInstance()
