import { NextResponse } from 'next/server'
import RegionalPoliceService, { 
  LocalPoliceReport, 
  LocalCrimeStats 
} from '@/lib/regionalPolice'

const policeService = RegionalPoliceService.getInstance()

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  const cityKey = params.city.toLowerCase()
  const cityConfig = policeService.getCityConfig(cityKey)

  if (!cityConfig) {
    return NextResponse.json({
      error: `City '${params.city}' not supported.`,
      receivedCityKey: cityKey, // <-- ADD THIS LINE FOR DEBUGGING
      supportedCities: policeService.getSupportedCities().map(c => c.key)
    }, { status: 404 })
  }

  try {
    // Get latest police reports and statistics
    const [latestReports, crimeStats, cityRisk] = await Promise.all([
      policeService.getLatestReports(cityKey, 20),
      policeService.getCrimeStatistics(cityKey),
      policeService.getDistrictRisk(cityKey)
    ])

    const response = {
      // Basic info
      city: cityConfig.name,
      state: cityConfig.state,
      population: cityConfig.population,
      policeDepartment: cityConfig.policeDepartment,
      lastUpdated: new Date().toISOString(),

      // Current alerts
      currentAlerts: latestReports.filter(r => r.status === 'ACTIVE'),
      
      // Latest reports
      latestReports: latestReports.map(report => ({
        id: report.id,
        timestamp: report.timestamp.toISOString(),
        title: report.title,
        description: report.description.substring(0, 200) + '...',
        category: report.category,
        severity: report.severity,
        location: report.location,
        source: report.source,
        status: report.status
      })),

      // Crime statistics
      crimeStatistics: {
        ...crimeStats,
        interpretation: getCrimeInterpretation(crimeStats, cityConfig)
      },

      // City-wide risk assessment
      riskAssessment: {
        overallRisk: cityRisk.riskScore,
        riskLevel: cityRisk.riskLevel,
        interpretation: getRiskInterpretation(cityRisk.riskLevel, cityConfig),
        recommendations: cityRisk.recommendations
      },

      // District breakdown
      districts: Object.entries(crimeStats.byDistrict).map(([district, count]) => ({
        name: district,
        incidentCount: count,
        riskLevel: count > crimeStats.totalIncidents * 0.3 ? 'HIGH' : 
                   count > crimeStats.totalIncidents * 0.1 ? 'MEDIUM' : 'LOW'
      })),

      // Quick reference
      emergencyInfo: {
        policeEmergency: '110',
        policeStation: {
          address: cityConfig.emergencyContact.address,
          phone: cityConfig.emergencyContact.phone,
          website: 'https://www.polizei.rlp.de'
        }
      },

      // Data sources
      dataSources: [
        {
          name: `Polizeiinspektion ${cityConfig.name}`,
          type: 'Official',
          reliability: 'HIGH'
        },
        {
          name: 'Presseportal Blaulicht',
          type: 'Press Portal',
          reliability: 'MEDIUM'
        }
      ],
      disclaimer: 'Diese Informationen basieren auf öffentlich zugänglichen Polizeimeldungen und Presseberichten. Für aktuelle Notfälle wählen Sie bitte 110.'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error(`${cityConfig.name} police API error:`, error)
    
    return NextResponse.json({
      error: `Fehler beim Abrufen der Polizeidaten für ${cityConfig.name}`,
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 })
  }
}

function getCrimeInterpretation(stats: LocalCrimeStats, config: any): string {
  const { totalIncidents, trend } = stats
  if (totalIncidents === 0) return `Aktuell keine nennenswerten Vorfälle in ${config.name} gemeldet.`
  const trendText = {
    'INCREASING': 'Leicht steigende Tendenz.',
    'STABLE': 'Stabile Situation.',
    'DECREASING': 'Leicht sinkende Tendenz.'
  }
  return `In den letzten 30 Tagen wurden ${totalIncidents} Vorfälle gemeldet. ${trendText[trend]}`
}

function getRiskInterpretation(level: string, config: any): string {
  const interpretations: Record<string, string> = {
    'LOW': `Die Sicherheitslage in ${config.name} ist insgesamt gut.`,
    'MEDIUM': `Die Sicherheitslage in ${config.name} ist zufriedenstellend. Übliche Vorsicht wird empfohlen.`,
    'HIGH': `Erhöhte Vorsicht in ${config.name} empfohlen.`,
    'CRITICAL': `Hohes Sicherheitsrisiko in ${config.name}.`
  }
  return interpretations[level] || interpretations['LOW']
}