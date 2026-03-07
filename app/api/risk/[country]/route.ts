import { NextResponse } from 'next/server'

// Mock data for MVP - will be replaced with real data sources
const countryRiskData: Record<string, any> = {
  'Germany': {
    overall: 28,
    weather: 35,
    political: 22,
    health: 25,
    infrastructure: 30,
    trends: {
      overall: 'stable',
      weather: 'down',
      political: 'stable',
      health: 'stable',
      infrastructure: 'up',
    },
    advisoryLevel: 'low',
    advisoryText: 'Exercise normal precautions',
    emergencyNumber: '112',
    embassyContact: '+49 30 8305 0',
    medicalAssistance: 'Emergency: 112',
    recentEvents: [
      { description: 'Heavy rainfall in Bavaria causing localized flooding' },
      { description: 'Public transport strike in Berlin (March 6-7)' },
      { description: 'Cold wave warning: temperatures dropping to -15°C' },
      { description: 'Power outage affecting 20,000 homes in Hamburg' },
      { description: 'Airport delays at Frankfurt due to fog' },
    ],
    trendHistory: [25, 27, 28, 26, 30, 28, 25, 27, 28, 29, 28, 27, 26, 28, 29],
  },
  'United States': {
    overall: 42,
    weather: 55,
    political: 45,
    health: 35,
    infrastructure: 38,
    trends: {
      overall: 'up',
      weather: 'up',
      political: 'stable',
      health: 'down',
      infrastructure: 'stable',
    },
    advisoryLevel: 'medium',
    advisoryText: 'Exercise increased caution due to civil unrest in some areas',
    emergencyNumber: '911',
    embassyContact: 'Check local embassy',
    medicalAssistance: 'Emergency: 911',
    recentEvents: [
      { description: 'Severe winter storm warning for Northeast states' },
      { description: 'Active shooter incident reported in downtown area' },
      { description: 'Tornado watch in effect for Oklahoma and Texas' },
      { description: 'Power grid strain warning for California' },
      { description: 'Flash flood warnings in Tennessee' },
    ],
    trendHistory: [38, 40, 41, 42, 44, 42, 40, 41, 43, 44, 42, 40, 39, 41, 42],
  },
  'France': {
    overall: 32,
    weather: 30,
    political: 38,
    health: 28,
    infrastructure: 25,
    trends: {
      overall: 'stable',
      weather: 'stable',
      political: 'up',
      health: 'stable',
      infrastructure: 'stable',
    },
    advisoryLevel: 'low',
    advisoryText: 'Exercise normal precautions. Protests may occur in major cities.',
    emergencyNumber: '112',
    embassyContact: '+33 1 43 12 22 22',
    medicalAssistance: 'Emergency: 112 or 15 (SAMU)',
    recentEvents: [
      { description: 'Public sector strike planned for March 8' },
      { description: 'Heavy snowfall in Alpine regions' },
      { description: 'Airport delays at CDG due to air traffic control' },
      { description: 'Demonstration expected in Paris on Saturday' },
      { description: 'Mild flu season continues' },
    ],
    trendHistory: [30, 31, 30, 32, 33, 32, 30, 31, 32, 33, 32, 31, 30, 31, 32],
  },
}

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = decodeURIComponent(params.country)
  
  // Return country data or default
  const data = countryRiskData[country] || {
    overall: 50,
    weather: 50,
    political: 50,
    health: 50,
    infrastructure: 50,
    trends: {
      overall: 'stable',
      weather: 'stable',
      political: 'stable',
      health: 'stable',
      infrastructure: 'stable',
    },
    advisoryLevel: 'medium',
    advisoryText: 'Limited data available for this country',
    emergencyNumber: '112',
    embassyContact: 'Check local embassy',
    medicalAssistance: 'Contact local authorities',
    recentEvents: [
      { description: 'No recent events reported' },
    ],
    trendHistory: Array(15).fill(50),
  }

  return NextResponse.json(data)
}
