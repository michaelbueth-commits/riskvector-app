// VPN censorship/necessity level per country
export type VpnLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'

export interface VpnInfo {
  level: VpnLevel
  reason?: string
}

const vpnData: Record<string, VpnInfo> = {
  'China': { level: 'critical', reason: 'Strenge Internet-Zensur (Great Firewall). VPN notwendig für Google, WhatsApp, Social Media.' },
  'Iran': { level: 'critical', reason: 'Strenge Zensur und Überwachung. VPN essenziell für sichere Kommunikation.' },
  'Russland': { level: 'high', reason: 'Zensur nimmt zu. VPN empfohlen für unabhängige Nachrichten und sicheres Surfen.' },
  'Türkei': { level: 'high', reason: 'Social Media wird regelmäßig blockiert. VPN für WhatsApp, Twitter, YouTube empfohlen.' },
  'Vereinigte Arabische Emirate': { level: 'high', reason: 'VoIP-Dienste (WhatsApp Call, Skype) blockiert. VPN für freie Kommunikation.' },
  'Vietnam': { level: 'medium', reason: 'Einige Websites blockiert. VPN für sicheres Surfen empfohlen.' },
  'Saudi-Arabien': { level: 'medium', reason: 'Einige Inhalte gefiltert. VPN für privates Surfen empfohlen.' },
  'Ägypten': { level: 'medium', reason: 'Überwachung und gelegentliche Blockaden. VPN für Sicherheit empfohlen.' },
  'Kuba': { level: 'medium', reason: 'Stark reguliertes Internet. VPN für Zugang zu blockierten Seiten.' },
  'Myanmar': { level: 'high', reason: 'Militärregierung blockiert viele Seiten. VPN notwendig.' },
  'Thailand': { level: 'low', reason: 'Gelegentliche Inhalte blockiert. VPN optional aber empfohlen.' },
  'Indonesien': { level: 'low', reason: 'Einige Plattformen eingeschränkt. VPN optional.' },
  'Indien': { level: 'low', reason: 'Gelegentliche Blockaden. VPN für Datenschutz empfohlen.' },
  'Kasachstan': { level: 'medium', reason: 'Überwachung und gelegentliche Blockaden.' },
  'Weißrussland': { level: 'high', reason: 'Strenge Internetkontrolle. VPN notwendig.' },
  'Irak': { level: 'medium', reason: 'Gelegentliche Social-Media-Blockaden.' },
  'Pakistan': { level: 'medium', reason: 'Inhaltsfilterung aktiv. VPN empfohlen.' },
  'Bangladesch': { level: 'low', reason: 'Gelegentliche Blockaden bei Unruhen.' },
  'Sri Lanka': { level: 'low', reason: 'Social Media wurde in der Vergangenheit blockiert.' },
  'Nordkorea': { level: 'critical', reason: 'Komplette Internetkontrolle. VPN wird nicht helfen — eigenes Satellitengerät nötig.' },
}

const defaultVpn: VpnInfo = { level: 'none' }

export function getVpnInfo(country: string): VpnInfo {
  return vpnData[country] || defaultVpn
}

export function getVpnColor(level: VpnLevel): string {
  switch (level) {
    case 'critical': return 'text-red-400'
    case 'high': return 'text-orange-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-blue-400'
    default: return 'text-slate-400'
  }
}
