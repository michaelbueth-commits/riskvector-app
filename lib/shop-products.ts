export interface ShopProduct {
  id: string
  category: 'insurance-health' | 'insurance-luggage' | 'vpn' | 'esim' | 'adapter' | 'gear'
  name: string
  provider: string
  description: string
  priceFrom: string
  affiliateUrl: string
  // Amazon PartnerNet: Ändere 'bestofme05-21' zu deiner PartnerNet ID
  affiliatePartner: string
  features: string[]
  rating: number
  recommendedForRisk: 'all' | 'medium' | 'high' | 'critical'
  countries?: string[]
}

// TODO: Replace all affiliate URLs with real tracked links after signup
export const products: ShopProduct[] = [
  // === TRAVEL INSURANCE ===
  {
    id: 'safetywing-nomad',
    category: 'insurance-health',
    name: 'SafetyWing Nomad Insurance',
    provider: 'SafetyWing',
    description: 'Digitale Nomaden-Krankenversicherung für weltweit Reisen. Monatlich kündbar.',
    priceFrom: 'ab $45/Monat',
    affiliateUrl: 'https://www.amazon.de/s?k=reisekrankenversicherung&tag=bestofme05-21',
    affiliatePartner: 'SafetyWing Affiliate',
    features: ['Weltweite Deckung', 'Monatlich kündbar', 'COVID-19 inklusive', 'Kein Heimatrecht nötig', 'Familiendeckung verfügbar'],
    rating: 4.6,
    recommendedForRisk: 'all',
  },
  {
    id: 'worldnomads-standard',
    category: 'insurance-health',
    name: 'WorldNomads Standard',
    provider: 'WorldNomads',
    description: 'Reisekrankenversicherung speziell für Rucksacktouristen und Abenteurer.',
    priceFrom: 'ab €8/Woche',
    affiliateUrl: 'https://www.amazon.de/s?k=auslandskrankenversicherung+reise&tag=bestofme05-21',
    affiliatePartner: 'WorldNomads Affiliate',
    features: ['Abenteuer-Sport abgedeckt', 'Gepäckversicherung inklusive', 'Reiserücktritt', '24/7 Notfall-Hotline', 'Deutschsprachiger Support'],
    rating: 4.3,
    recommendedForRisk: 'all',
  },
  {
    id: 'worldnomads-explorer',
    category: 'insurance-health',
    name: 'WorldNomads Explorer',
    provider: 'WorldNomads',
    description: 'Premium-Reiseversicherung mit erweiterter Deckung für Extremsport und teure Ausrüstung.',
    priceFrom: 'ab €15/Woche',
    affiliateUrl: 'https://www.amazon.de/s?k=premium+reisekrankenversicherung&tag=bestofme05-21',
    affiliatePartner: 'WorldNomads Affiliate',
    features: ['Alles im Standard', 'Extremsport abgedeckt', 'Elektronik bis €3.000', 'Notfall-Evakuierung', 'Bergrettung inklusive'],
    rating: 4.5,
    recommendedForRisk: 'high',
  },
  {
    id: 'heymondo-reise',
    category: 'insurance-health',
    name: 'Heymondo Reiseversicherung',
    provider: 'Heymondo',
    description: 'Günstige Reisekrankenversicherung mit guter Deckung und WhatsApp-Support.',
    priceFrom: 'ab €3/Tag',
    affiliateUrl: 'https://www.amazon.de/s?k=g%C3%BCnstige+reisekrankenversicherung&tag=bestofme05-21',
    affiliatePartner: 'Heymondo Affiliate',
    features: ['Sehr günstig', 'WhatsApp-Notfall-Support', 'Reiserücktritt optional', 'Frühe Rückreise', 'COVID-19 gedeckt'],
    rating: 4.4,
    recommendedForRisk: 'all',
  },
  {
    id: 'allianz-reise',
    category: 'insurance-health',
    name: 'Allianz Reiseversicherung',
    provider: 'Allianz',
    description: 'Premium-Reisekrankenversicherung von Europas größtem Versicherer.',
    priceFrom: 'ab €12/Woche',
    affiliateUrl: 'https://www.amazon.de/s?k=allianz+reiseversicherung&tag=bestofme05-21',
    affiliatePartner: 'Allianz Partner',
    features: ['Höchste Deckungssumme', 'Rundum-Sorglos-Paket', 'Deutschsprachig', 'Krankenhausaufenthalt', 'Rücktransport garantiert'],
    rating: 4.2,
    recommendedForRisk: 'critical',
  },
  {
    id: 'hansemerkur-reise',
    category: 'insurance-health',
    name: 'HanseMerkur Reiseversicherung',
    provider: 'HanseMerkur',
    description: 'Deutscher Versicherer mit exzellentem Service und kurzfristig abschließbar.',
    priceFrom: 'ab €9/Jahr',
    affiliateUrl: 'https://www.amazon.de/s?k=hansemerkur+reisekrankenversicherung&tag=bestofme05-21',
    affiliatePartner: 'HanseMerkur',
    features: ['Jahresreiseversicherung', 'Kurzfristig abschließbar', 'Deutscher Support', 'Stiftung Warentest empfohlen', 'Familien-Tarife'],
    rating: 4.5,
    recommendedForRisk: 'all',
  },

  // === LUGGAGE INSURANCE ===
  {
    id: 'worldnomads-gepaeck',
    category: 'insurance-luggage',
    name: 'WorldNomads Gepäckversicherung',
    provider: 'WorldNomads',
    description: 'Reisegepäckversicherung gegen Diebstahl, Verlust und Beschädigung.',
    priceFrom: 'inkl. in Reiseversicherung',
    affiliateUrl: 'https://www.amazon.de/s?k=reisegep%C3%A4ckversicherung&tag=bestofme05-21',
    affiliatePartner: 'WorldNomads Affiliate',
    features: ['Diebstahl gedeckt', 'Verlust durch Airline', 'Beschädigung', 'Elektronik-Deckung', 'Bis zu €2.000'],
    rating: 4.3,
    recommendedForRisk: 'all',
  },
  {
    id: 'hansemerkur-gepaeck',
    category: 'insurance-luggage',
    name: 'HanseMerkur Reisegepäckversicherung',
    provider: 'HanseMerkur',
    description: 'Eigenständige Gepäckversicherung — auch ohne Krankenversicherung abschließbar.',
    priceFrom: 'ab €12/Jahr',
    affiliateUrl: 'https://www.amazon.de/s?k=gep%C3%A4ckversicherung+reise&tag=bestofme05-21',
    affiliatePartner: 'HanseMerkur',
    features: ['Eigenständiger Abschluss', 'Jahresdeckung', 'Weltweit gültig', 'Diebstahl & Verlust', 'Bis €3.000 Deckung'],
    rating: 4.4,
    recommendedForRisk: 'all',
  },

  // === VPN SERVICES ===
  {
    id: 'nordvpn',
    category: 'vpn',
    name: 'NordVPN',
    provider: 'NordVPN',
    description: 'Marktführer mit 6.000+ Servern in 111 Ländern. Schnell und zuverlässig.',
    priceFrom: 'ab €3.29/Monat',
    affiliateUrl: 'https://www.amazon.de/s?k=nordvpn+vpn+software&tag=bestofme05-21',
    affiliatePartner: 'NordVPN Affiliate (40% Commission)',
    features: ['6.000+ Server', '111 Länder', 'Kill Switch', 'Double VPN', 'Streaming-fähig', '24/7 Support'],
    rating: 4.7,
    recommendedForRisk: 'all',
  },
  {
    id: 'surfshark',
    category: 'vpn',
    name: 'Surfshark',
    provider: 'Surfshark',
    description: 'Günstiger VPN mit unbegrenzten gleichzeitigen Verbindungen.',
    priceFrom: 'ab €1.99/Monat',
    affiliateUrl: 'https://www.amazon.de/s?k=surfshark+vpn&tag=bestofme05-21',
    affiliatePartner: 'Surfshark Affiliate',
    features: ['Unbegrenzte Geräte', '3.200+ Server', '100 Länder', 'Camouflage Mode', 'Sehr günstig', 'NoBorders-Modus'],
    rating: 4.5,
    recommendedForRisk: 'all',
  },
  {
    id: 'expressvpn',
    category: 'vpn',
    name: 'ExpressVPN',
    provider: 'ExpressVPN',
    description: 'Premium VPN mit extrem hohen Geschwindigkeiten — ideal für Streaming.',
    priceFrom: 'ab €5.99/Monat',
    affiliateUrl: 'https://www.amazon.de/s?k=expressvpn&tag=bestofme05-21',
    affiliatePartner: 'ExpressVPN Affiliate ($13/signup)',
    features: ['Höchste Geschwindigkeit', '3.000+ Server', '94 Länder', 'TrustedServer Technologie', 'Split Tunneling', '24/7 Chat'],
    rating: 4.6,
    recommendedForRisk: 'all',
  },
  {
    id: 'cyberghost',
    category: 'vpn',
    name: 'CyberGhost',
    provider: 'CyberGhost',
    description: 'Deutsches VPN-Unternehmen mit 11.000+ Servern und 45-Tage-Geld-zurück.',
    priceFrom: 'ab €2.19/Monat',
    affiliateUrl: 'https://www.amazon.de/s?k=cyberghost+vpn&tag=bestofme05-21',
    affiliatePartner: 'CyberGhost Affiliate',
    features: ['11.000+ Server', '100 Länder', '45 Tage Geld-zurück', 'Deutsches Unternehmen', 'Streaming-optimiert', 'NoSpy Server'],
    rating: 4.4,
    recommendedForRisk: 'all',
  },

  // === eSIM ===
  {
    id: 'airalo-esim',
    category: 'esim',
    name: 'Airalo eSIM',
    provider: 'Airalo',
    description: 'Weltweit eSIMs für 200+ Länder. Sofort aktiviert, kein physischer SIM-Kartenwechsel.',
    priceFrom: 'ab $4.50',
    affiliateUrl: 'https://www.amazon.de/s?k=prepaid+sim+karte+ausland+esim&tag=bestofme05-21',
    affiliatePartner: 'Airalo Affiliate',
    features: ['200+ Länder', 'Sofort aktiv', 'Kein SIM-Wechsel', 'App-basiert', 'Daten-Sharing möglich'],
    rating: 4.5,
    recommendedForRisk: 'all',
  },
  {
    id: 'holafly-esim',
    category: 'esim',
    name: 'Holafly eSIM',
    provider: 'Holafly',
    description: 'Unlimited Data eSIMs für Reisende. Ideal für Dauer-Surfer.',
    priceFrom: 'ab €19',
    affiliateUrl: 'https://www.amazon.de/s?k=esim+reisen+unlimited+data&tag=bestofme05-21',
    affiliatePartner: 'Holafly Affiliate',
    features: ['Unlimited Data', '170+ Länder', 'Kein Vertrag', 'Sofort per E-Mail', 'Hotspot-Sharing'],
    rating: 4.3,
    recommendedForRisk: 'all',
  },
  {
    id: 'maya-esim',
    category: 'esim',
    name: 'Maya Mobile eSIM',
    provider: 'Maya Mobile',
    description: 'Günstige eSIMs mit flexiblen Datenpaketen für Reisende.',
    priceFrom: 'ab $5',
    affiliateUrl: 'https://www.mayamobile.com/?utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Maya Mobile Affiliate',
    features: ['Flexible Pakete', '190+ Länder', 'Sofort aktivierbar', 'Günstige Tagespakete', 'Kein Auto-Renewal'],
    rating: 4.2,
    recommendedForRisk: 'all',
  },

  // === TRAVEL ADAPTERS ===
  {
    id: 'universal-adapter',
    category: 'adapter',
    name: 'Universal Reiseadapter',
    provider: 'Amazon',
    description: 'Weltweiter Reiseadapter für 150+ Länder mit USB-C Schnellladung.',
    priceFrom: 'ab €15',
    affiliateUrl: 'https://www.amazon.de/s?k=universal+reiseadapter&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['150+ Länder', 'USB-C PD 65W', 'USB-A Ports', 'Kompakt & leicht', 'Sicherung eingebaut'],
    rating: 4.5,
    recommendedForRisk: 'all',
  },
  {
    id: 'usb-hub-travel',
    category: 'adapter',
    name: 'Reise-USB-Hub mit Stecker',
    provider: 'Amazon',
    description: 'Kombinierter Adapter mit 4-Port USB-Hub — alle Geräte gleichzeitig laden.',
    priceFrom: 'ab €25',
    affiliateUrl: 'https://www.amazon.de/s?k=reise+usb+hub+stecker&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['4x USB Ports', '1x USB-C', 'Universalstecker', 'Kompakt', 'LED-Anzeige'],
    rating: 4.3,
    recommendedForRisk: 'all',
  },

  // === TRAVEL GEAR ===
  {
    id: 'money-belt',
    category: 'gear',
    name: 'Sicherheitsgürtel (Money Belt)',
    provider: 'Amazon',
    description: 'Unsichtbarer Geldgürtel unter der Kleidung — Schutz gegen Taschendiebe.',
    priceFrom: 'ab €10',
    affiliateUrl: 'https://www.amazon.de/s?k=sicherheitsguertel+reise&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['Unsichtbar unter Kleidung', 'RFID-Blockierend', 'Wasserabweisend', 'Pass & Geld', 'Leicht (50g)'],
    rating: 4.4,
    recommendedForRisk: 'medium',
  },
  {
    id: 'door-alarm',
    category: 'gear',
    name: 'Reise-Türalarm',
    provider: 'Amazon',
    description: 'Tragbarer Türalarm für Hotelzimmer — 120 dB Alarm bei unbefugtem Eintreten.',
    priceFrom: 'ab €12',
    affiliateUrl: 'https://www.amazon.de/s?k=reise+türalarm&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['120 dB Alarm', 'Einfache Montage', 'Batteriebetrieben', 'Für alle Türen', 'Taschenlampen-Funktion'],
    rating: 4.2,
    recommendedForRisk: 'high',
  },
  {
    id: 'first-aid-kit',
    category: 'gear',
    name: 'Reise-Erste-Hilfe-Set',
    provider: 'Amazon',
    description: 'Kompaktes Erste-Hilfe-Set speziell für Reisen — Pflaster, Verbände, Desinfektion.',
    priceFrom: 'ab €15',
    affiliateUrl: 'https://www.amazon.de/s?k=reise+erste+hilfe+set&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['120 Teile', 'Wasserdicht', 'Kompakt (200g)', 'CE-zertifiziert', 'Inkl. Rettungsdecke'],
    rating: 4.6,
    recommendedForRisk: 'all',
  },
  {
    id: 'water-filter',
    category: 'gear',
    name: 'Trinkwasserfilter (LifeStraw)',
    provider: 'Amazon',
    description: 'Trinkwasserfilter entfernt 99.9% Bakterien — sicher in Ländern mit schlechtem Leitungswasser.',
    priceFrom: 'ab €20',
    affiliateUrl: 'https://www.amazon.de/s?k=lifestraw+trinkwasserfilter&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['99.9% Bakterien entfernt', '4.000 Liter Kapazität', 'Keine Batterien nötig', 'Leicht (56g)', 'WHO geprüft'],
    rating: 4.7,
    recommendedForRisk: 'high',
  },
  {
    id: 'pacsafe-backpack',
    category: 'gear',
    name: 'PacSafe Diebstahlsicherer Rucksack',
    provider: 'Amazon',
    description: 'Rucksack mit Stahlnetz und versteckten Reißverschlüssen — ideal für Städtereisen.',
    priceFrom: 'ab €80',
    affiliateUrl: 'https://www.amazon.de/s?k=pacsafe+rucksack&tag=bestofme05-21&utm_source=riskvector&utm_medium=shop',
    affiliatePartner: 'Amazon Associates',
    features: ['Stahlnetz-Inlay', 'Versteckter RV', 'RFID-Tasche', 'Laptop-Fach 15"', 'Wasserabweisend'],
    rating: 4.4,
    recommendedForRisk: 'medium',
  },
]

export function getProductsByCategory(category: ShopProduct['category']): ShopProduct[] {
  return products.filter(p => p.category === category)
}

export function getProductsForRisk(riskLevel: 'low' | 'medium' | 'high' | 'critical'): ShopProduct[] {
  const riskOrder = { all: 0, medium: 1, high: 2, critical: 3 }
  const minLevel = riskLevel === 'low' ? 0 : riskLevel === 'medium' ? 1 : riskLevel === 'high' ? 2 : 3
  return products.filter(p => riskOrder[p.recommendedForRisk] <= Math.max(minLevel, 0) || p.recommendedForRisk === 'all')
}

export const categories = [
  { id: 'all' as const, label: 'Alle', icon: '🛒' },
  { id: 'insurance-health' as const, label: 'Krankenversicherung', icon: '🏥' },
  { id: 'insurance-luggage' as const, label: 'Gepäckversicherung', icon: '💼' },
  { id: 'vpn' as const, label: 'VPN', icon: '🔒' },
  { id: 'esim' as const, label: 'eSIM & Daten', icon: '📱' },
  { id: 'adapter' as const, label: 'Reiseadapter', icon: '🔌' },
  { id: 'gear' as const, label: 'Sicherheits-Zubehör', icon: '🧳' },
] as const

export type CategoryFilter = typeof categories[number]['id']
