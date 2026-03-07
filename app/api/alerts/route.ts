import { NextResponse } from 'next/server'

// Mock alerts for MVP - will be replaced with real GDELT, WHO, Weather APIs
const mockAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    category: 'weather',
    title: 'Severe Winter Storm Warning',
    location: 'Bavaria, Germany',
    timestamp: '10 min ago',
    description: 'Heavy snowfall expected. Avoid non-essential travel.',
    lat: 48.7904,
    lng: 11.4979,
  },
  {
    id: '2',
    type: 'high' as const,
    category: 'infrastructure',
    title: 'Major Power Outage',
    location: 'Hamburg, Germany',
    timestamp: '25 min ago',
    description: '20,000 households affected. Restoration expected in 3 hours.',
    lat: 53.5511,
    lng: 9.9937,
  },
  {
    id: '3',
    type: 'medium' as const,
    category: 'transportation',
    title: 'Airport Delays - Fog',
    location: 'Frankfurt Airport',
    timestamp: '1 hour ago',
    description: 'Flight delays up to 2 hours due to heavy fog conditions.',
    lat: 50.0379,
    lng: 8.5622,
  },
  {
    id: '4',
    type: 'low' as const,
    category: 'health',
    title: 'Seasonal Flu Warning',
    location: 'Berlin, Germany',
    timestamp: '2 hours ago',
    description: 'Increased flu activity. Wear masks in crowded places.',
    lat: 52.5200,
    lng: 13.4050,
  },
  {
    id: '5',
    type: 'high' as const,
    category: 'political',
    title: 'Public Transport Strike',
    location: 'Berlin, Germany',
    timestamp: '3 hours ago',
    description: 'March 6-7: Major disruptions expected. Use alternative transport.',
    lat: 52.5200,
    lng: 13.4050,
  },
  {
    id: '6',
    type: 'critical' as const,
    category: 'security',
    title: 'Active Situation - Avoid Area',
    location: 'Munich City Center',
    timestamp: '45 min ago',
    description: 'Police operation ongoing. Avoid Marienplatz area.',
    lat: 48.1374,
    lng: 11.5755,
  },
  {
    id: '7',
    type: 'medium' as const,
    category: 'weather',
    title: 'Cold Wave Warning',
    location: 'Eastern Germany',
    timestamp: '4 hours ago',
    description: 'Temperatures dropping to -15°C. Prepare for extreme cold.',
    lat: 51.3402,
    lng: 12.3752,
  },
  {
    id: '8',
    type: 'low' as const,
    category: 'infrastructure',
    title: 'Water Supply Maintenance',
    location: 'Stuttgart, Germany',
    timestamp: '5 hours ago',
    description: 'Scheduled maintenance may cause low water pressure.',
    lat: 48.7758,
    lng: 9.1829,
  },
]

export async function GET() {
  // In production, this would fetch from:
  // 1. GDELT API (political events, conflicts)
  // 2. OpenWeather API (weather alerts)
  // 3. USGS API (earthquakes)
  // 4. WHO/CDC RSS feeds (health alerts)
  // 5. Government alert APIs (KATWARN, WEA, etc.)

  return NextResponse.json({
    alerts: mockAlerts,
    lastUpdated: new Date().toISOString(),
    sources: ['GDELT', 'OpenWeather', 'USGS', 'WHO', 'KATWARN'],
  })
}
