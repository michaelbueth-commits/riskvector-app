// Real Alert Sources Configuration
// All sources provide actual, real-time emergency data

export interface AlertSource {
  id: string
  name: string
  country: string | 'Global'
  type: 'disaster' | 'weather' | 'security' | 'health' | 'geological'
  url: string
  apiEndpoint?: string
  feedUrl?: string
  format: 'json' | 'xml' | 'rss' | 'cap'
  updateFrequency: string
  description: string
  officialUrl: string
}

export const alertSources: AlertSource[] = [
  // Global Sources
  {
    id: 'gdacs',
    name: 'GDACS - Global Disaster Alert and Coordination System',
    country: 'Global',
    type: 'disaster',
    url: 'https://www.gdacs.org',
    apiEndpoint: 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH',
    feedUrl: 'https://www.gdacs.org/xml/rss.xml',
    format: 'json',
    updateFrequency: '5-6 minutes',
    description: 'UN/EC disaster alerts for earthquakes, cyclones, floods, volcanoes',
    officialUrl: 'https://www.gdacs.org'
  },
  {
    id: 'usgs-earthquake',
    name: 'USGS Earthquake Hazards Program',
    country: 'Global',
    type: 'geological',
    url: 'https://earthquake.usgs.gov',
    apiEndpoint: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson',
    feedUrl: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.atom',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'Worldwide earthquake monitoring and alerts',
    officialUrl: 'https://earthquake.usgs.gov'
  },
  {
    id: 'gdelt',
    name: 'GDELT Project',
    country: 'Global',
    type: 'security',
    url: 'https://www.gdeltproject.org',
    apiEndpoint: 'https://api.gdeltproject.org/api/v2/doc/doc',
    format: 'json',
    updateFrequency: '15 minutes',
    description: 'Global events, protests, conflicts, and geopolitical monitoring',
    officialUrl: 'https://www.gdeltproject.org'
  },

  // Germany
  {
    id: 'nina-katwarn',
    name: 'NINA/KATWARN (BBK)',
    country: 'Germany',
    type: 'disaster',
    url: 'https://nina.api.bund.dev',
    apiEndpoint: 'https://nina.api.bund.dev/api31',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'German federal emergency alerts including KATWARN',
    officialUrl: 'https://www.warnung.bund.de'
  },

  // Europe
  {
    id: 'meteoalarm',
    name: 'MeteoAlarm Europe',
    country: 'Europe',
    type: 'weather',
    url: 'https://www.meteoalarm.org',
    apiEndpoint: 'https://api.meteoalarm.org/edr/v1/collections',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'European weather warnings from 38 national meteorological services',
    officialUrl: 'https://www.meteoalarm.org'
  },

  // USA
  {
    id: 'noaa-weather',
    name: 'NOAA National Weather Service',
    country: 'United States',
    type: 'weather',
    url: 'https://www.weather.gov',
    apiEndpoint: 'https://api.weather.gov/alerts/active',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'US weather alerts, watches, and warnings',
    officialUrl: 'https://www.weather.gov'
  },
  {
    id: 'fema-ipaws',
    name: 'FEMA IPAWS Open Data',
    country: 'United States',
    type: 'disaster',
    url: 'https://www.fema.gov',
    feedUrl: 'https://services1.arcgis.com/5e2co7Om3PHf1dGR/ArcGIS/rest/services/Current_IPAWS_Alerts/FeatureServer/0',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'US emergency alerts via Integrated Public Alert and Warning System',
    officialUrl: 'https://www.fema.gov'
  },

  // Japan
  {
    id: 'jma-earthquake',
    name: 'Japan Meteorological Agency',
    country: 'Japan',
    type: 'geological',
    url: 'https://www.jma.go.jp',
    feedUrl: 'https://www.jma.go.jp/bosai/quake/data/list.json',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'Japan earthquake, tsunami, and weather alerts (J-ALERT data)',
    officialUrl: 'https://www.jma.go.jp'
  },
  {
    id: 'p2pquake',
    name: 'P2P Earthquake Information (Japan)',
    country: 'Japan',
    type: 'geological',
    url: 'https://www.p2pquake.net',
    apiEndpoint: 'https://api.p2pquake.net/v2/history',
    format: 'json',
    updateFrequency: 'Real-time',
    description: 'Real-time earthquake data via P2P network, includes JMA data',
    officialUrl: 'https://www.p2pquake.net'
  },

  // Australia
  {
    id: 'bom-australia',
    name: 'Bureau of Meteorology Australia',
    country: 'Australia',
    type: 'weather',
    url: 'http://www.bom.gov.au',
    feedUrl: 'http://www.bom.gov.au/fwo/IDZ00056.warnings_vic.xml',
    format: 'xml',
    updateFrequency: '30 minutes',
    description: 'Australian weather warnings and alerts',
    officialUrl: 'http://www.bom.gov.au'
  },

  // UK
  {
    id: 'met-office-uk',
    name: 'UK Met Office',
    country: 'United Kingdom',
    type: 'weather',
    url: 'https://www.metoffice.gov.uk',
    feedUrl: 'https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/UK.xml',
    format: 'xml',
    updateFrequency: 'Real-time',
    description: 'UK weather warnings',
    officialUrl: 'https://www.metoffice.gov.uk'
  },

  // Canada
  {
    id: 'environment-canada',
    name: 'Environment Canada',
    country: 'Canada',
    type: 'weather',
    url: 'https://www.weather.gc.ca',
    feedUrl: 'https://weather.gc.ca/rss/warning/on-118_e.xml',
    format: 'xml',
    updateFrequency: 'Real-time',
    description: 'Canadian weather alerts and warnings',
    officialUrl: 'https://www.weather.gc.ca'
  },

  // Health - WHO
  {
    id: 'who-outbreaks',
    name: 'WHO Disease Outbreak News',
    country: 'Global',
    type: 'health',
    url: 'https://www.who.int',
    feedUrl: 'https://www.who.int/rss-feeds/disease-outbreak-news.xml',
    format: 'xml',
    updateFrequency: 'Daily',
    description: 'WHO official disease outbreak news and health emergencies',
    officialUrl: 'https://www.who.int/emergencies/disease-outbreak-news'
  },

  // Geopolitical - GDELT
  {
    id: 'gdelt',
    name: 'GDELT Project',
    country: 'Global',
    type: 'security',
    url: 'https://www.gdeltproject.org',
    apiEndpoint: 'https://api.gdeltproject.org/api/v2/doc/doc',
    format: 'json',
    updateFrequency: '15 minutes',
    description: 'Global events, conflicts, protests, and geopolitical monitoring in real-time',
    officialUrl: 'https://www.gdeltproject.org'
  },

  // Volcanoes - Smithsonian
  {
    id: 'smithsonian-volcano',
    name: 'Smithsonian Global Volcanism Program',
    country: 'Global',
    type: 'geological',
    url: 'https://volcano.si.edu',
    feedUrl: 'https://volcano.si.edu/news/WeeklyVolcanoRSS.xml',
    format: 'xml',
    updateFrequency: 'Weekly',
    description: 'Global volcanic activity reports',
    officialUrl: 'https://volcano.si.edu'
  },
]

export const getSourcesByCountry = (country: string) => 
  alertSources.filter(s => s.country === country || s.country === 'Global')

export const getSourcesByType = (type: AlertSource['type']) => 
  alertSources.filter(s => s.type === type)

export const getSourceById = (id: string) => 
  alertSources.find(s => s.id === id)
