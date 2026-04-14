export interface PlugInfo {
  plugTypes: string[]
  voltage: number
  frequency: string
}

const plugData: Record<string, PlugInfo> = {
  'Deutschland': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Türkei': { plugTypes: ['C', 'F'], voltage: 220, frequency: '50Hz' },
  'Spanien': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Frankreich': { plugTypes: ['C', 'E'], voltage: 230, frequency: '50Hz' },
  'Italien': { plugTypes: ['C', 'F', 'L'], voltage: 230, frequency: '50Hz' },
  'Griechenland': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Portugal': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Österreich': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Schweiz': { plugTypes: ['C', 'J'], voltage: 230, frequency: '50Hz' },
  'USA': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Kanada': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Mexiko': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Brasilien': { plugTypes: ['C', 'N'], voltage: 220, frequency: '60Hz' },
  'Argentinien': { plugTypes: ['C', 'I'], voltage: 220, frequency: '50Hz' },
  'Japan': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'China': { plugTypes: ['A', 'C', 'I'], voltage: 220, frequency: '50Hz' },
  'Südkorea': { plugTypes: ['C', 'F'], voltage: 220, frequency: '60Hz' },
  'Thailand': { plugTypes: ['A', 'B', 'C', 'O'], voltage: 220, frequency: '50Hz' },
  'Vietnam': { plugTypes: ['A', 'C'], voltage: 220, frequency: '50Hz' },
  'Indonesien': { plugTypes: ['C', 'F'], voltage: 220, frequency: '50Hz' },
  'Indien': { plugTypes: ['C', 'D', 'M'], voltage: 230, frequency: '50Hz' },
  'Australien': { plugTypes: ['I'], voltage: 230, frequency: '50Hz' },
  'Neuseeland': { plugTypes: ['I'], voltage: 230, frequency: '50Hz' },
  'Ägypten': { plugTypes: ['C', 'F'], voltage: 220, frequency: '50Hz' },
  'Marokko': { plugTypes: ['C', 'E'], voltage: 220, frequency: '50Hz' },
  'Südafrika': { plugTypes: ['C', 'M', 'N'], voltage: 230, frequency: '50Hz' },
  'Kenia': { plugTypes: ['G'], voltage: 240, frequency: '50Hz' },
  'Russland': { plugTypes: ['C', 'F'], voltage: 220, frequency: '50Hz' },
  'Vereinigtes Königreich': { plugTypes: ['G'], voltage: 230, frequency: '50Hz' },
  'Irland': { plugTypes: ['G'], voltage: 230, frequency: '50Hz' },
  'Israel': { plugTypes: ['C', 'H', 'M'], voltage: 230, frequency: '50Hz' },
  'Vereinigte Arabische Emirate': { plugTypes: ['C', 'D', 'G'], voltage: 230, frequency: '50Hz' },
  'Saudi-Arabien': { plugTypes: ['A', 'B', 'G'], voltage: 220, frequency: '60Hz' },
  'Iran': { plugTypes: ['C', 'F'], voltage: 220, frequency: '50Hz' },
  'Singapur': { plugTypes: ['G'], voltage: 230, frequency: '50Hz' },
  'Malaysia': { plugTypes: ['G'], voltage: 230, frequency: '50Hz' },
  'Hongkong': { plugTypes: ['G'], voltage: 220, frequency: '50Hz' },
  'Philippinen': { plugTypes: ['A', 'B'], voltage: 220, frequency: '60Hz' },
  'Kolumbien': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Peru': { plugTypes: ['A', 'C'], voltage: 220, frequency: '60Hz' },
  'Kuba': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Kambodscha': { plugTypes: ['A', 'C', 'G'], voltage: 230, frequency: '50Hz' },
  'Myanmar': { plugTypes: ['C', 'D', 'F', 'G'], voltage: 230, frequency: '50Hz' },
  'Nigeria': { plugTypes: ['D', 'G'], voltage: 230, frequency: '50Hz' },
  'Tansania': { plugTypes: ['D', 'G'], voltage: 230, frequency: '50Hz' },
  'Jordanien': { plugTypes: ['B', 'C', 'D', 'F', 'G', 'J'], voltage: 230, frequency: '50Hz' },
  'Kroatien': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
  'Taiwan': { plugTypes: ['A', 'B'], voltage: 110, frequency: '60Hz' },
  'Island': { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' },
}

const defaultPlug: PlugInfo = { plugTypes: ['C', 'F'], voltage: 230, frequency: '50Hz' }

export function getPlugInfo(country: string): PlugInfo {
  return plugData[country] || defaultPlug
}
