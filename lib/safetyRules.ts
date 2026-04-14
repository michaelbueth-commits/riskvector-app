export interface SafetyRule {
  category: string
  rule: string
  severity: 'info' | 'caution' | 'warning' | 'critical'
  details?: string
}

export interface CountrySafetyProfile {
  country: string
  overallSafety: number // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  rules: SafetyRule[]
  emergencyNumbers: string[]
  embassyInfo?: string
  culturalNotes: string[]
  legalWarnings: string[]
}

const safetyProfiles: Record<string, CountrySafetyProfile> = {
  UAE: {
    country: 'UAE',
    overallSafety: 82,
    riskLevel: 'low',
    rules: [
      { category: 'Alcohol', rule: 'Only in licensed venues (hotels, bars)', severity: 'warning', details: 'Never drink in public places. Drinking without a license was decriminalized in 2024 but public intoxication remains illegal.' },
      { category: 'Dress Code', rule: 'Modest dress in public places', severity: 'caution', details: 'Shoulders and knees should be covered in malls and government buildings.' },
      { category: 'Drugs', rule: 'ZERO tolerance', severity: 'critical', details: 'Including some prescription meds. Check UAE MoH approved list before traveling.' },
      { category: 'Photography', rule: 'No government/military/airport photos', severity: 'warning', details: 'Photographing military sites, airports, or government buildings is strictly prohibited.' },
      { category: 'Public Behavior', rule: 'No PDA, no swearing', severity: 'warning', details: 'Public displays of affection and offensive language can lead to arrest.' },
      { category: 'Driving', rule: 'Strict traffic laws', severity: 'caution', details: 'Speed cameras everywhere. Zero tolerance for drink driving.' },
      { category: 'Ramadan', rule: 'No eating/drinking in public during daylight', severity: 'warning', details: 'Applies during Ramadan month. Hotels have screened-off areas for non-Muslims.' },
      { category: 'LGBT', rule: 'Illegal — severe penalties', severity: 'critical', details: 'Same-sex relationships are criminalized.' },
      { category: 'Social Media', rule: 'No criticism of government/royal family', severity: 'critical', details: 'Defamation and criticism of the UAE or its rulers is a criminal offense.' },
    ],
    emergencyNumbers: ['999 (Police)', '998 (Ambulance)', '997 (Fire)', '901 (Electricity/Water emergency)'],
    culturalNotes: [
      'Friday is the holy day — many businesses closed',
      'Right hand for greetings and eating',
      'Remove shoes when entering homes',
      'Greet with "As-salamu alaykum"',
      'Tipping 10-15% is standard in restaurants',
    ],
    legalWarnings: [
      'Bouncing a cheque is a criminal offense',
      'Co-habitation outside marriage was decriminalized in 2024',
      'Importing pork products is restricted',
      'VPN use is regulated — only illegal if used to commit crimes',
    ],
  },
  Qatar: {
    country: 'Qatar',
    overallSafety: 80,
    riskLevel: 'low',
    rules: [
      { category: 'Alcohol', rule: 'Only in licensed hotel venues', severity: 'warning' },
      { category: 'Dress Code', rule: 'Modest dress required', severity: 'caution', details: 'Slightly more relaxed than UAE but still conservative.' },
      { category: 'Drugs', rule: 'ZERO tolerance', severity: 'critical' },
      { category: 'Photography', rule: 'No military/government photos', severity: 'warning' },
      { category: 'Public Behavior', rule: 'No PDA, respect local customs', severity: 'warning' },
      { category: 'LGBT', rule: 'Illegal', severity: 'critical' },
      { category: 'Restricted Areas', rule: 'Al Udeid Air Base area is restricted', severity: 'critical', details: 'Large US military base — do not approach.' },
      { category: 'Social Media', rule: 'No criticism of government', severity: 'warning' },
    ],
    emergencyNumbers: ['999 (Police)', '997 (Ambulance)', '998 (Fire)'],
    culturalNotes: [
      'World Cup infrastructure makes getting around easy',
      'More relaxed than Saudi Arabia',
      'Friday is the weekly holiday',
      'Qataris are hospitable — accept tea/coffee offers',
    ],
    legalWarnings: [
      'World Cup legacy laws may differ from long-term regulations',
      'Drug penalties include death penalty for trafficking',
      'Importing alcohol is prohibited (hotel venues only)',
    ],
  },
  Israel: {
    country: 'Israel',
    overallSafety: 55,
    riskLevel: 'medium',
    rules: [
      { category: 'Rocket Sirens', rule: 'Hear siren → 90 seconds to shelter', severity: 'critical', details: 'Iron Dome intercepts most rockets but debris falls. Always respond to sirens.' },
      { category: 'Safe Rooms', rule: 'Mamad rooms in buildings post-1992', severity: 'info', details: 'All buildings constructed after 1992 must have a reinforced safe room (Mamad).' },
      { category: 'Public Shelters', rule: 'Marked with orange/green signs', severity: 'info', details: 'Public shelters are marked throughout cities.' },
      { category: 'Gaza Border', rule: 'NO GO zone', severity: 'critical', details: 'Do not travel within 4km of the Gaza border.' },
      { category: 'West Bank', rule: 'Exercise extreme caution', severity: 'warning', details: 'Checkpoints, possible closures. Travel with local knowledge only.' },
      { category: 'Golan Heights', rule: 'Exercise caution near Syrian border', severity: 'warning', details: 'Stray fire from Syria possible. Stay on main roads.' },
      { category: 'Security Checks', rule: 'Expect frequent bag checks', severity: 'info', details: 'Malls, bus stations, and public venues have security screening.' },
      { category: 'App', rule: 'Install "Home Front Command" app', severity: 'critical', details: 'Official Israeli app for real-time rocket alerts and instructions in English.' },
    ],
    emergencyNumbers: ['100 (Police)', '101 (Ambulance/Magen David Adom)', '102 (Fire)'],
    embassyInfo: 'Most embassies in Tel Aviv. US Embassy in Jerusalem.',
    culturalNotes: [
      'Saturday (Shabbat) — most public transport stops Friday evening to Saturday evening',
      'Kosher dietary laws observed in many restaurants',
      'Military service is mandatory — soldiers with weapons are normal sight',
      'Tipping 12-15% in restaurants',
      'Direct communication style is cultural norm, not rudeness',
    ],
    legalWarnings: [
      'Photographing military installations is illegal',
      'No photography at checkpoints',
      'Drug laws are strict',
      'Boycott laws prohibit supporting BDS movement',
    ],
  },
  Iran: {
    country: 'Iran',
    overallSafety: 25,
    riskLevel: 'extreme',
    rules: [
      { category: 'Alcohol', rule: 'NO alcohol — strictly illegal', severity: 'critical', details: 'Possession can lead to imprisonment or worse.' },
      { category: 'Dress', rule: 'Hijab required for women, modest for all', severity: 'critical', details: 'Women must cover hair and wear loose clothing. Men: no shorts.' },
      { category: 'Internet', rule: 'Heavily censored — VPN ESSENTIAL', severity: 'critical', details: 'Many sites blocked. Download VPN before arriving.' },
      { category: 'Photography', rule: 'Many restrictions', severity: 'warning', details: 'No government buildings, military sites, or police.' },
      { category: 'Currency', rule: 'Bring cash — cards rarely work', severity: 'warning', details: 'US sanctions mean international cards do not work. Bring USD/EUR cash.' },
      { category: 'Western Nationals', rule: 'HIGH RISK of detention', severity: 'critical', details: 'Multiple Western nationals detained on espionage charges. Dual nationals at particular risk.' },
      { category: 'Currency', rule: 'Rial is the official currency', severity: 'info', details: 'Toman is colloquially used (1 toman = 10 rial).' },
      { category: 'LGBT', rule: 'Illegal — death penalty possible', severity: 'critical' },
    ],
    emergencyNumbers: ['110 (Police)', '115 (Ambulance)', '125 (Fire)', '112 (General emergency)'],
    culturalNotes: [
      'Taarof — ritual politeness. Offers may be made out of courtesy (refuse initially).',
      'Hospitality is legendary — Iranians are warm to foreigners',
      'Friday is the weekly holiday',
      'Nowruz (Persian New Year) in March is the biggest holiday',
      'Shoes off when entering homes',
    ],
    legalWarnings: [
      'Insulting the Supreme Leader is punishable by imprisonment',
      'Journalism without accreditation is illegal',
      'Drone photography is prohibited',
      'GPS devices may be confiscated',
      'Satellite TV is illegal (though widely used)',
      'Women cannot travel alone without male guardian permission in some contexts',
    ],
  },
}

export function getCountrySafetyProfile(country: string): CountrySafetyProfile | null {
  const normalized = country.toUpperCase()
  if (safetyProfiles[normalized]) return safetyProfiles[normalized]

  // Try aliases
  const aliases: Record<string, string> = {
    'DUBAI': 'UAE', 'UNITED ARAB EMIRATES': 'UAE',
    'ISRAEL': 'Israel', 'PALESTINE': 'Israel', 'GAZA': 'Israel',
    'IRAN': 'Iran', 'ISLAMIC REPUBLIC OF IRAN': 'Iran',
    'QATAR': 'Qatar', 'STATE OF QATAR': 'Qatar',
  }
  const mapped = aliases[normalized]
  if (mapped && safetyProfiles[mapped]) return safetyProfiles[mapped]
  if (safetyProfiles[country]) return safetyProfiles[country]

  return null
}

export function getCountryRiskScore(country: string): number {
  const profile = getCountrySafetyProfile(country)
  return profile?.overallSafety ?? 50
}

export function getAllCountryProfiles(): string[] {
  return Object.keys(safetyProfiles)
}
