// MeteoAlarm OGC-API EDR Service
// European severe weather warnings

export interface MeteoAlarmWarning {
  [key: string]: any
}

class MeteoAlarmService {
  private static instance: MeteoAlarmService
  private baseUrl = 'https://api.meteoalarm.org/edr/v1'
  
  private constructor() {}
  
  static getInstance(): MeteoAlarmService {
    if (!MeteoAlarmService.instance) {
      MeteoAlarmService.instance = new MeteoAlarmService()
    }
    return MeteoAlarmService.instance
  }
  
  // Make API request
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`)
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`MeteoAlarm API request failed: ${error}`)
      return null
    }
  }
  
  // Get available locations
  async getLocations(): Promise<any> {
    return this.apiRequest<any>('/collections/warnings/locations')
  }
  
  // Get warnings for a specific location
  async getWarningsForLocation(locationId: string): Promise<MeteoAlarmWarning | null> {
    return this.apiRequest<MeteoAlarmWarning>(`/collections/warnings/locations/${locationId}`)
  }
}

// Export MeteoAlarm service instance
export const meteoAlarmService = MeteoAlarmService.getInstance()
