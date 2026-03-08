// SPC PDH.stat API Service
// Data from the Pacific Community (SPC)

export interface SPCDataflow {
  id: string
  agencyID: string
  version: string
  name: string
}

export interface SPCData {
  [key: string]: any
}

class SPCPDHStatService {
  private static instance: SPCPDHStatService
  private baseUrl = 'https://stats-nsi-stable.pacificdata.org/rest'
  
  private constructor() {}
  
  static getInstance(): SPCPDHStatService {
    if (!SPCPDHStatService.instance) {
      SPCPDHStatService.instance = new SPCPDHStatService()
    }
    return SPCPDHStatService.instance
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
      console.error(`SPC PDH.stat API request failed: ${error}`)
      return null
    }
  }
  
  // Get all dataflows
  async getDataflows(): Promise<SPCDataflow[]> {
    const response = await this.apiRequest<any>('/dataflow/all/all/latest?detail=full')
    if (response && response['structure:Dataflows'] && response['structure:Dataflows']['structure:Dataflow']) {
      return response['structure:Dataflows']['structure:Dataflow'].map((df: any) => ({
        id: df.$.id,
        agencyID: df.$.agencyID,
        version: df.$.version,
        name: df['structure:Name']._,
      }))
    }
    return []
  }
  
  // Get data for a specific dataflow
  async getData(dataflowId: string, key: string, params: Record<string, any> = {}): Promise<SPCData | null> {
    return this.apiRequest<SPCData>(`/data/${dataflowId}/${key}`, params)
  }
}

// Export SPC PDH.stat service instance
export const spcPDHStatService = SPCPDHStatService.getInstance()
