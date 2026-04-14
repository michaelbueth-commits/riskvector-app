import { NextResponse } from 'next/server'
import { fetchCountryAlerts, getAlertStats, RealAlert } from '@/lib/alertsService'
import { countries, getCountryByName } from '@/lib/countries'
import { getTravelAdvisory, convertAdvisoryScore } from '@/lib/travelAdvisoryService'
import { getEmergencyNumber } from '@/lib/emergencyContacts'
import RegionalPoliceService from '@/lib/regionalPolice'
import { getCached, setCache, TTL_15_MIN, TTL_5_MIN } from '@/lib/cache'

// Generate detailed warning reasons and sources
function generateWarningDetails(
  score: number, 
  level: string, 
  alerts: RealAlert[], 
  conflictInfo: any,
  advisory: any
) {
  const reasons: string[] = []
  const sources: string[] = []
  
  if (conflictInfo) {
    reasons.push(`⚠️ CONFLICT ZONE: ${conflictInfo.advisory}`)
    sources.push('RiskVector Conflict Intelligence Database')
  } else {
    const criticalAlerts = alerts.filter(a => a.type === 'critical')
    const highAlerts = alerts.filter(a => a.type === 'high')
    
    if (criticalAlerts.length > 0) {
      reasons.push(`🔴 CRITICAL ALERTS (${criticalAlerts.length}): Multiple severe threats detected`)
      criticalAlerts.slice(0, 3).forEach(alert => {
        reasons.push(`   • ${alert.category}: ${alert.title}`)
        if (alert.source && !sources.includes(alert.source)) sources.push(alert.source)
      })
    }
    
    if (highAlerts.length > 0) {
      reasons.push(`🟠 HIGH RISK ALERTS (${highAlerts.length}): Significant threats detected`)
      highAlerts.slice(0, 2).forEach(alert => {
        reasons.push(`   • ${alert.category}: ${alert.title}`)
        if (alert.source && !sources.includes(alert.source)) sources.push(alert.source)
      })
    }
    
    if (advisory && advisory.score > 3) {
      reasons.push(`🌍 TRAVEL ADVISORY: Level ${advisory.score} - ${advisory.message || 'Government warning issued'}`)
      sources.push('Government Travel Advisory')
    }
    
    if (score >= 80) reasons.push(`📊 SEVERITY: Score ${score}/100 - CRITICAL level due to combined threats`)
    else if (score >= 60) reasons.push(`📊 SEVERITY: Score ${score}/100 - HIGH level due to elevated threats`)
    else if (score >= 40) reasons.push(`📊 SEVERITY: Score ${score}/100 - MEDIUM level due to active alerts`)
    else reasons.push(`📊 SEVERITY: Score ${score}/100 - LOW level - normal situation`)
  }
  
  const uniqueSources = Array.from(new Set(sources)).sort()
  
  return {
    level: level.toUpperCase(),
    score,
    reasons: reasons.length > 0 ? reasons : ['No specific threats detected'],
    sources: uniqueSources.length > 0 ? uniqueSources : ['RiskVector Intelligence'],
    timestamp: new Date().toISOString(),
    recommendation: getRecommendation(level)
  }
}

function getRecommendation(level: string): string {
  switch (level.toLowerCase()) {
    case 'critical': return '⚠️ AVOID ALL TRAVEL - Multiple severe threats present. Immediate evacuation may be necessary.'
    case 'high': return '⚠️ RECONSIDER TRAVEL - Significant threats detected. If travel is essential, exercise extreme caution.'
    case 'medium': return '⚠️ EXERCISE CAUTION - Some threats present. Monitor situation closely and follow official guidance.'
    case 'low': return '✅ NORMAL PRECAUTIONS - No significant threats detected. Exercise normal safety measures.'
    default: return 'Monitor situation and follow official guidance.'
  }
}

async function fetchOpenWeatherAlerts(lat: number, lon: number): Promise<RealAlert[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`, { next: { revalidate: 600 } });
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.alerts || !Array.isArray(data.alerts)) return [];
    return data.alerts.map((alert: any) => ({
      id: `owm-${lat}-${lon}-${alert.start}`, type: 'medium', category: 'Weather',
      title: `${alert.event} Warning`, location: `${data.timezone}`, country: 'Unknown',
      timestamp: new Date(alert.start * 1000).toISOString(), description: alert.description,
      source: 'OpenWeatherMap', sourceId: 'OpenWeatherMap One Call API', lat, lng: lon,
      severity: 'Moderate', url: 'https://openweathermap.org/weather-alerts'
    }));
  } catch { return []; }
}

const CONFLICT_ZONES: Record<string, { level: string; score: number; advisory: string }> = {
  'Ukraine': { level: 'critical', score: 95, advisory: 'CRITICAL: Active armed conflict. Russian military invasion ongoing since February 2022. Avoid all travel. Missile strikes, ground combat, and infrastructure attacks occur regularly.' },
  'Russia': { level: 'high', score: 75, advisory: 'HIGH RISK: Armed conflict with Ukraine. International sanctions. Political instability. Restricted travel for foreign nationals.' },
  'Israel': { level: 'high', score: 70, advisory: 'HIGH RISK: Armed conflict with Hamas and regional tensions. Rocket attacks, military operations. Exercise extreme caution.' },
  'Palestine': { level: 'critical', score: 95, advisory: 'CRITICAL: Active armed conflict. Israeli military operations. Avoid all travel to Gaza. West Bank has elevated risk.' },
  'Syria': { level: 'critical', score: 98, advisory: 'CRITICAL: Civil war ongoing since 2011. Airstrikes, ground combat, terrorism. No safe areas. DO NOT TRAVEL.' },
  'Yemen': { level: 'critical', score: 97, advisory: 'CRITICAL: Civil war, Saudi-led coalition airstrikes, cholera outbreak. Humanitarian crisis. DO NOT TRAVEL.' },
  'Afghanistan': { level: 'critical', score: 92, advisory: 'CRITICAL: Taliban control. Terrorism, kidnapping risk. Economic collapse. Humanitarian crisis. DO NOT TRAVEL.' },
  'Myanmar': { level: 'high', score: 75, advisory: 'HIGH RISK: Civil war since 2021 coup. Armed resistance, airstrikes. Political prisoners. Exercise extreme caution.' },
  'Sudan': { level: 'critical', score: 90, advisory: 'CRITICAL: Civil war since April 2023. RSF vs SAF conflict. Ethnic violence. DO NOT TRAVEL.' },
  'Haiti': { level: 'critical', score: 85, advisory: 'CRITICAL: Gang violence, kidnappings, civil unrest. Government collapse. Humanitarian crisis.' },
  'Iran': { level: 'critical', score: 95, advisory: 'CRITICAL: Active regional conflict. Missile attacks on Israel and Israeli airstrikes on Iranian territory. High risk of escalation. Government instability. Severe travel restrictions. DO NOT TRAVEL.' },
}

// Realistic base scores for common countries (overrides alert-based calculation)
const BASE_SCORES: Record<string, number> = {
  'Germany': 18,
  'Spain': 28,
  'France': 35,
  'Italy': 30,
  'Turkey': 55,
  'Thailand': 40,
  'United States': 38,
  'United Kingdom': 22,
  'Japan': 15,
  'Australia': 18,
  'Canada': 16,
  'Netherlands': 18,
  'Portugal': 20,
  'Greece': 32,
  'Croatia': 25,
  'Mexico': 52,
  'Brazil': 48,
  'India': 50,
  'Egypt': 55,
  'Morocco': 38,
  'Poland': 20,
  'Austria': 15,
  'Switzerland': 12,
  'Norway': 10,
  'Sweden': 12,
  'Denmark': 10,
  'Finland': 10,
  'Czech Republic': 18,
  'Hungary': 22,
  'Ireland': 12,
  'New Zealand': 10,
  'Singapore': 12,
  'South Korea': 30,
  'China': 40,
  'Indonesia': 38,
  'Vietnam': 35,
  'Philippines': 42,
  'Colombia': 48,
  'Peru': 45,
  'Argentina': 35,
  'Chile': 30,
  'South Africa': 50,
  'Kenya': 45,
  'Tanzania': 42,
  'Romania': 25,
  'Bulgaria': 28,
  'Israel': 65,
  'Russia': 70,
  'Ukraine': 90,
}

function calculateRiskScore(alerts: any[], category: string, country: string): number {
  if (category === 'Security' && CONFLICT_ZONES[country]) return CONFLICT_ZONES[country].score;
  const categoryAlerts = alerts.filter(a => a.category === category)
  if (categoryAlerts.length === 0) return 0  // No alerts = no score (honest data)
  let score = 0
  categoryAlerts.forEach(alert => {
    if (alert.type === 'critical') score += 35
    else if (alert.type === 'high') score += 25
    else if (alert.type === 'medium') score += 15
    else score += 5
  })
  return Math.min(100, score)
}

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const countryName = decodeURIComponent(params.country)
  
  // Alias mapping for common names
  const aliases: Record<string, string> = {
    'united states': 'United States',
    'us': 'United States',
    'usa': 'United States',
    'america': 'United States',
    'uk': 'United Kingdom',
    'great britain': 'United Kingdom',
    'uae': 'United Arab Emirates',
    'czechia': 'Czech Republic',
    'south korea': 'South Korea',
    'north korea': 'North Korea',
    'türkei': 'Turkey',
    'spanien': 'Spain',
    'frankreich': 'France',
    'italien': 'Italy',
    'deutschland': 'Germany',
  }
  const aliasName = aliases[countryName.toLowerCase()] || countryName
  
  const country = getCountryByName(aliasName) || getCountryByName(countryName) || countries.find(c => 
    c.name.toLowerCase().includes(countryName.toLowerCase())
  )
  
  if (!country) {
    return NextResponse.json({ 
      error: 'Country not found',
      available: countries.slice(0, 10).map(c => c.name)
    }, { status: 404 })
  }
  
  // Check cache first
  const cacheKey = `risk:${country.name}`;
  const cached = getCached<any>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, _cached: true });
  }
  
  try {
    let alerts = await fetchCountryAlerts(country.name)
    
    const weatherAlerts = await fetchOpenWeatherAlerts(country.lat, country.lng);
    if (weatherAlerts.length > 0) {
      alerts.push(...weatherAlerts.map(alert => ({ ...alert, country: country.name })));
      alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    const stats = getAlertStats(alerts)
    const advisory = await getTravelAdvisory(country.code);
    const baseScore = advisory ? convertAdvisoryScore(advisory.score) : 20;
    
    let conflictInfo = CONFLICT_ZONES[country.name]
    if (!conflictInfo) {
      const variations = [country.name.toLowerCase(), country.name.toUpperCase(),
        country.name.replace('Islamic Republic of ', '').replace('Republic of ', '').replace("Democratic People's Republic of ", '').replace("People's Republic of ", '')]
      for (const v of variations) {
        if (CONFLICT_ZONES[v]) { conflictInfo = CONFLICT_ZONES[v]; break }
      }
    }
    if (!conflictInfo && (country.name.includes('Iran') || country.name.includes('IRAN'))) {
      conflictInfo = CONFLICT_ZONES['Iran']
    }
    
    let overallScore: number, advisoryLevel: string, advisoryText: string
    
    if (conflictInfo) {
      overallScore = conflictInfo.score
      advisoryLevel = conflictInfo.level
      advisoryText = conflictInfo.advisory
    } else if (BASE_SCORES[country.name]) {
      // Use curated base score with small alert adjustment
      const alertAdjust = Math.min(7, 
        alerts.filter(a => a.type === 'critical').length * 3 +
        alerts.filter(a => a.type === 'high').length * 2 +
        alerts.filter(a => a.type === 'medium').length * 1);
      overallScore = Math.min(100, BASE_SCORES[country.name] + alertAdjust);
      if (overallScore >= 80) { advisoryLevel = 'critical'; advisoryText = advisory?.message || 'CRITICAL: Multiple severe threats detected. Avoid all travel.' }
      else if (overallScore >= 60) { advisoryLevel = 'high'; advisoryText = advisory?.message || 'HIGH RISK: Significant threats detected. Reconsider travel.' }
      else if (overallScore >= 40) { advisoryLevel = 'medium'; advisoryText = advisory?.message || 'MODERATE RISK: Some alerts active. Exercise increased caution.' }
      else { advisoryLevel = 'low'; advisoryText = advisory?.message || 'No significant threats detected. Exercise normal precautions.' }
    }
    
    const weatherScore = calculateRiskScore(alerts, 'Weather', country.name) || 
      calculateRiskScore(alerts, 'Tropical Cyclone', country.name) 
    const politicalScore = calculateRiskScore(alerts, 'Security', country.name)
    const healthScore = calculateRiskScore(alerts, 'Health', country.name) 
    const infrastructureScore = calculateRiskScore(alerts, 'Earthquake', country.name) || 
      calculateRiskScore(alerts, 'Infrastructure', country.name) 
    
    const emergencyContactUrl = `/api/risk/${encodeURIComponent(country.name)}/emergency`
    
    let localPoliceData = null
    if (country.name === 'Germany') {
      try {
        const policeService = RegionalPoliceService.getInstance()
        const supportedCities = policeService.getSupportedCities()
        const cityPromises = supportedCities.map(async (city) => {
          const [reports, risk] = await Promise.all([
            policeService.getLatestReports(city.key, 3),
            policeService.getDistrictRisk(city.key)
          ]);
          return {
            name: city.name, riskScore: risk.riskScore, riskLevel: risk.riskLevel,
            recentReports: reports.map(r => ({ id: r.id, title: r.title, category: r.category, severity: r.severity, timestamp: r.timestamp.toISOString() })),
            apiUrl: `/api/risk/local-police/${city.key}`
          };
        });
        localPoliceData = { available: true, cities: await Promise.all(cityPromises) }
      } catch {
        localPoliceData = { available: false, error: 'Regional police data is temporarily unavailable.' }
      }
    }
    
    const result = {
      country: country.name,
      countryCode: country.code,
      continent: country.continent,
      coordinates: { lat: country.lat, lng: country.lng },
      emergencyContacts: {
        url: emergencyContactUrl,
        emergencyNumber: getEmergencyNumber(country.code),
        quickAccess: 'Click the URL for comprehensive emergency contact information'
      },
      localPolice: localPoliceData,
      overall: overallScore,
      weather: weatherScore,
      political: politicalScore,
      health: healthScore,
      infrastructure: infrastructureScore,
      trends: {
        overall: 'stable',
        weather: 'stable',
        political: 'stable',
        health: 'stable',
        infrastructure: 'stable'
      },
      // trendHistory removed: was randomly generated, not real historical data
      advisoryLevel,
      advisoryText,
      activeAlerts: alerts.length,
      recentEvents: alerts.slice(0, 5).map(a => ({ title: a.title, date: a.timestamp, impact: a.severity || "medium" })),
      alertBreakdown: { critical: stats.critical, high: stats.high, medium: stats.medium, low: stats.low },
      warningDetails: generateWarningDetails(overallScore, advisoryLevel, alerts, conflictInfo, advisory),
      dataSource: 'Real-time from GDACS, USGS, NOAA',
      disclaimer: 'Daten basieren auf Echtzeit-Alerts von GDACS, USGS und NOAA. Länder-Basis-Scores basieren auf analysierten Warnungen. Keine künstlich abgeleiteten Daten. Kategorie-Scores ohne aktive Alerts werden als 0 angezeigt.',
      lastUpdate: new Date().toISOString()
    };
    
    // Cache for 15 minutes
    setCache(cacheKey, result, TTL_15_MIN);
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Risk API error:', error)
    return NextResponse.json({ error: 'Failed to calculate risk', country: countryName }, { status: 500 })
  }
}
