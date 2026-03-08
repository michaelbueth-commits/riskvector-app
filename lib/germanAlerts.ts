// NINA API Service
// German severe weather warnings and civil protection alerts

export interface NINAWarning {
  [key: string]: any
}

class NINAService {
  private static instance: NINAService
  private baseUrl = 'https://warnung.bund.de/api31'
  
  private constructor() {}
  
  static getInstance(): NINAService {
    if (!NINAService.instance) {
      NINAService.instance = new NINAService()
    }
    return NINAService.instance
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
      console.error(`NINA API request failed: ${error}`)
      return null
    }
  }
  
  // Get dashboard for a specific ARS
  async getDashboard(ars: string): Promise<any> {
    return this.apiRequest<any>(`/dashboard/${ars}.json`)
  }
  
  // Get details for a specific warning
  async getWarning(identifier: string): Promise<NINAWarning | null> {
    return this.apiRequest<NINAWarning>(`/warnings/${identifier}.json`)
  }
}

// Export NINA service instance
export const ninaService = NINAService.getInstance()
