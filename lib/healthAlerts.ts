// WHO GHO OData API Service
// Real-time health data and alerts from the World Health Organization

export interface WHOIndicator {
  IndicatorCode: string
  IndicatorName: string
  Language: string
  Category: string
  SourceOfData: string
}

export interface WHOData {
  Id: number
  IndicatorCode: string
  SpatialDimType: string
  SpatialDim: string
  TimeDimType: string
  TimeDim: number
  Dim1Type: string
  Dim1: string
  Dim2Type: string
  Dim2: string
  Dim3Type: string
  Dim3: string
  DataSourceDimType: string
  DataSourceDim: string
  Value: string
  NumericValue: number
  Low: number
  High: number
  Comments: string
  Date: string
  TimeDimensionValue: string
  TimeDimensionBegin: string
  TimeDimensionEnd: string
}

class WHOGHOService {
  private static instance: WHOGHOService
  private baseUrl = 'https://ghoapi.azureedge.net/api'
  
  private constructor() {}
  
  static getInstance(): WHOGHOService {
    if (!WHOGHOService.instance) {
      WHOGHOService.instance = new WHOGHOService()
    }
    return WHOGHOService.instance
  }
  
  // Make API request
  private async apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
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
      return data.value || []
    } catch (error) {
      console.error(`WHO GHO API request failed: ${error}`)
      return []
    }
  }
  
  // Get list of indicators
  async getIndicators(filter?: string): Promise<WHOIndicator[]> {
    const params = filter ? { $filter: `contains(IndicatorName, '${filter}')` } : {}
    return this.apiRequest<WHOIndicator>('/Indicator', params)
  }
  
  // Get data for a specific indicator
  async getIndicatorData(indicatorCode: string, filter?: string): Promise<WHOData[]> {
    const params = filter ? { $filter: filter } : {}
    return this.apiRequest<WHOData>(`/${indicatorCode}`, params)
  }
  
  // Get recent disease outbreak news using MENING_3 indicator
  async getDiseaseOutbreakNews(limit: number = 20): Promise<WHOData[]> {
    // Using MENING_3: Number of meningitis epidemic districts
    // This provides epidemic intelligence for disease outbreak monitoring
    const indicatorCode = 'MENING_3' // Disease outbreak indicator
    return this.getIndicatorData(indicatorCode, `$top=${limit}`)
  }
}

// Export WHO GHO service instance
export const whoGhoService = WHOGHOService.getInstance()
