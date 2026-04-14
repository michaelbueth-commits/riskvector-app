export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = decodeURIComponent(params.country)
  
  return NextResponse.json({
    success: true,
    country,
    period: 'N/A',
    data: [],
    analytics: {
      averageRiskScore: 0,
      maxRiskScore: 0,
      minRiskScore: 0,
      totalAlerts: 0,
      totalPoliceReports: 0,
      trend: 'stable',
      riskCategory: 'UNKNOWN'
    },
    disclaimer: 'Historische Daten sind derzeit nicht verfügbar. Risikobewertungen basieren ausschließlich auf aktuellen Echtzeit-Daten (GDACS, USGS, NOAA). Vergangene Trenddaten werden nicht angezeigt, da keine verifizierten historischen Aufzeichnungen vorliegen.'
  })
}
