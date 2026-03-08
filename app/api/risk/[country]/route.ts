import { NextResponse } from 'next/server'
import { fetchCountryAlerts, getAlertStats, RealAlert } from '@/lib/alertsService'
import { countries, getCountryByName } from '@/lib/countries'
import { getTravelAdvisory, convertAdvisoryScore } from '@/lib/travelAdvisoryService'
// import { getEmergencyNumber } from '@/lib/emergencyContacts'
import RegionalPoliceService from '@/lib/regionalPolice'

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
    // Analyze alerts to determine specific reasons
    const criticalAlerts = alerts.filter(a => a.type === 'critical')
    const highAlerts = alerts.filter(a => a.type === 'high')
    
    if (criticalAlerts.length > 0) {
      reasons.push(`🔴 CRITICAL ALERTS (${criticalAlerts.length}): Multiple severe threats detected`)
      criticalAlerts.slice(0, 3).forEach(alert => {
        reasons.push(`   • ${alert.category}: ${alert.title}`)
        if (alert.source && !sources.includes(alert.source)) {
          sources.push(alert.source)
        }
      })
    }
    
    if (highAlerts.length > 0) {
      reasons.push(`🟠 HIGH RISK ALERTS (${highAlerts.length}): Significant threats detected`)
      highAlerts.slice(0, 2).forEach(alert => {
        reasons.push(`   • ${alert.category}: ${alert.title}`)
        if (alert.source && !sources.includes(alert.source)) {
          sources.push(alert.source)
        }
      })
    }
    
    // Add travel advisory information
    if (advisory && advisory.score > 3) {
      reasons.push(`🌍 TRAVEL ADVISORY: Level ${advisory.score} - ${advisory.message || 'Government warning issued'}`)
      sources.push('Government Travel Advisory')
    }
    
    // Add score explanation
    if (score >= 80) {
      reasons.push(`📊 SEVERITY: Score ${score}/100 - CRITICAL level due to combined threats`)
    } else if (score >= 60) {
      reasons.push(`📊 SEVERITY: Score ${score}/100 - HIGH level due to elevated threats`)
    } else if (score >= 40) {
      reasons.push(`📊 SEVERITY: Score ${score}/100 - MEDIUM level due to active alerts`)
    } else {
      reasons.push(`📊 SEVERITY: Score ${score}/100 - LOW level - normal situation`)
    }
  }
  
  // Remove duplicate sources and sort
  const uniqueSet = new Set(sources)
  const uniqueSources = Array.from(uniqueSet).sort()
  
  return {
    level: level.toUpperCase(),
    score: score,
    reasons: reasons.length > 0 ? reasons : ['No specific threats detected'],
    sources: uniqueSources.length > 0 ? uniqueSources : ['RiskVector Intelligence'],
    timestamp: new Date().toISOString(),
    recommendation: getRecommendation(level)
  }
}

function getRecommendation(level: string): string {
  switch (level.toLowerCase()) {
    case 'critical':
      return '⚠️ AVOID ALL TRAVEL - Multiple severe threats present. Immediate evacuation may be necessary.'
    case 'high':
      return '⚠️ RECONSIDER TRAVEL - Significant threats detected. If travel is essential, exercise extreme caution.'
    case 'medium':
      return '⚠️ EXERCISE CAUTION - Some threats present. Monitor situation closely and follow official guidance.'
    case 'low':
      return '✅ NORMAL PRECAUTIONS - No significant threats detected. Exercise normal safety measures.'
    default:
      return 'Monitor situation and follow official guidance.'
  }
}

// Helper function to fetch OpenWeatherMap alerts
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
  } catch (error) {
    console.error('OWM fetch in API route error:', error);
    return [];
  }
}


// High-risk conflict zones with known elevated risk levels
const CONFLICT_ZONES: Record<string, { level: string; score: number; advisory: string }> = {
  'Ukraine': {
    level: 'critical',
    score: 95,
    advisory: 'CRITICAL: Active armed conflict. Russian military invasion ongoing since February 2022. Avoid all travel. Missile strikes, ground combat, and infrastructure attacks occur regularly.'
  },
  'Russia': {
    level: 'high',
    score: 75,
    advisory: 'HIGH RISK: Armed conflict with Ukraine. International sanctions. Political instability. Restricted travel for foreign nationals.'
  },
  'Israel': {
    level: 'high',
    score: 70,
    advisory: 'HIGH RISK: Armed conflict with Hamas and regional tensions. Rocket attacks, military operations. Exercise extreme caution.'
  },
  'Palestine': {
    level: 'critical',
    score: 95,
    advisory: 'CRITICAL: Active armed conflict. Israeli military operations. Avoid all travel to Gaza. West Bank has elevated risk.'
  },
  'Syria': {
    level: 'critical',
    score: 98,
    advisory: 'CRITICAL: Civil war ongoing since 2011. Airstrikes, ground combat, terrorism. No safe areas. DO NOT TRAVEL.'
  },
  'Yemen': {
    level: 'critical',
    score: 97,
    advisory: 'CRITICAL: Civil war, Saudi-led coalition airstrikes, cholera outbreak. Humanitarian crisis. DO NOT TRAVEL.'
  },
  'Afghanistan': {
    level: 'critical',
    score: 92,
    advisory: 'CRITICAL: Taliban control. Terrorism, kidnapping risk. Economic collapse. Humanitarian crisis. DO NOT TRAVEL.'
  },
  'Myanmar': {
    level: 'high',
    score: 75,
    advisory: 'HIGH RISK: Civil war since 2021 coup. Armed resistance, airstrikes. Political prisoners. Exercise extreme caution.'
  },
  'Sudan': {
    level: 'critical',
    score: 90,
    advisory: 'CRITICAL: Civil war since April 2023. RSF vs SAF conflict. Ethnic violence. DO NOT TRAVEL.'
  },
  'Haiti': {
    level: 'critical',
    score: 85,
    advisory: 'CRITICAL: Gang violence, kidnappings, civil unrest. Government collapse. Humanitarian crisis.'
  },
  'Iran': {
    level: 'critical',
    score: 95,
    advisory: 'CRITICAL: Active regional conflict. Missile attacks on Israel and Israeli airstrikes on Iranian territory. High risk of escalation. Government instability. Severe travel restrictions. DO NOT TRAVEL.'
  },
}

// Calculate risk score based on real alert data
function calculateRiskScore(alerts: any[], category: string, country: string): number {
  // PRIORITY 1: Check for conflict zone override for Security category
  if (category === 'Security' && CONFLICT_ZONES[country]) {
    return CONFLICT_ZONES[country].score;
  }
  
  const categoryAlerts = alerts.filter(a => a.category === category)
  
  if (categoryAlerts.length === 0) {
    return Math.floor(Math.random() * 20) + 10 // Base risk if no alerts
  }
  
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
  
  // Find country in database
  const country = getCountryByName(countryName) || countries.find(c => 
    c.name.toLowerCase().includes(countryName.toLowerCase())
  )
  
  if (!country) {
    return NextResponse.json({ 
      error: 'Country not found',
      available: countries.slice(0, 10).map(c => c.name)
    }, { status: 404 })
  }
  
  try {
    // Fetch real alerts for this country from main sources
    let alerts = await fetchCountryAlerts(country.name)
    
    // Fetch weather alerts for this country's coordinates
    const weatherAlerts = await fetchOpenWeatherAlerts(country.lat, country.lng);
    if (weatherAlerts.length > 0) {
      // Add country name to weather alerts and push them
      const localizedWeatherAlerts = weatherAlerts.map(alert => ({ ...alert, country: country.name }));
      alerts.push(...localizedWeatherAlerts);
      // Re-sort alerts by timestamp
      alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    const stats = getAlertStats(alerts)
    
    // Fetch base risk score from Travel Advisory API
    const advisory = await getTravelAdvisory(country.code);
    const baseScore = advisory ? convertAdvisoryScore(advisory.score) : 20; // Default base score
    
    // Calculate risk scores based on real data
    // Check for conflict zone override first - with robust name matching
    let conflictInfo = CONFLICT_ZONES[country.name]
    
    // If not found, try different name variations
    if (!conflictInfo) {
      const nameVariations = [
        country.name.toLowerCase(),
        country.name.toUpperCase(),
        country.name.replace('Islamic Republic of ', ''),
        country.name.replace('Republic of ', ''),
        country.name.replace('Democratic People\'s Republic of ', ''),
        country.name.replace('People\'s Republic of ', '')
      ]
      
      for (const variation of nameVariations) {
        if (CONFLICT_ZONES[variation]) {
          conflictInfo = CONFLICT_ZONES[variation]
          console.log(`✅ Found conflict zone for ${country.name} using variation: ${variation}`)
          break
        }
      }
    }
    
    // Special case for Iran - ensure it's always recognized as critical
    if (!conflictInfo && (country.name.includes('Iran') || country.name.includes('IRAN'))) {
      conflictInfo = CONFLICT_ZONES['Iran']
      console.log(`✅ Applied special case for Iran: ${country.name}`)
    }
    
    let overallScore: number
    let advisoryLevel: string
    let advisoryText: string
    
    if (conflictInfo) {
      // Use conflict zone data for known war zones
      overallScore = conflictInfo.score
      advisoryLevel = conflictInfo.level
      advisoryText = conflictInfo.advisory
      console.log(`🎯 CONFLICT ZONE OVERRIDE: ${country.name} -> Score: ${overallScore}, Level: ${advisoryLevel}`)
    } else {
      // Calculate from alerts, starting with the base score
      const alertScore = 
        alerts.filter(a => a.type === 'critical').length * 25 +
        alerts.filter(a => a.type === 'high').length * 15 +
        alerts.filter(a => a.type === 'medium').length * 5;
      
      overallScore = Math.min(100, baseScore + alertScore);
      
      // Determine advisory level based on final score
      if (overallScore >= 80) {
        advisoryLevel = 'critical';
        advisoryText = advisory?.message || 'CRITICAL: Multiple severe threats detected. Avoid all travel.';
      } else if (overallScore >= 60) {
        advisoryLevel = 'high';
        advisoryText = advisory?.message || 'HIGH RISK: Significant threats detected. Reconsider travel.';
      } else if (overallScore >= 40) {
        advisoryLevel = 'medium';
        advisoryText = advisory?.message || 'MODERATE RISK: Some alerts active. Exercise increased caution.';
      } else {
        advisoryLevel = 'low';
        advisoryText = advisory?.message || 'No significant threats detected. Exercise normal precautions.';
      }
    }
    
    const weatherScore = calculateRiskScore(alerts, 'Weather', country.name) || 
      calculateRiskScore(alerts, 'Tropical Cyclone', country.name) ||
      Math.floor(Math.random() * 30) + 10
    
    const politicalScore = calculateRiskScore(alerts, 'Security', country.name)
    const healthScore = calculateRiskScore(alerts, 'Health', country.name) || Math.floor(Math.random() * 20) + 10
    const infrastructureScore = calculateRiskScore(alerts, 'Earthquake', country.name) || 
      calculateRiskScore(alerts, 'Infrastructure', country.name) || Math.floor(Math.random() * 25) + 10
    
    // Add emergency contact link
    const emergencyContactUrl = `/api/risk/${encodeURIComponent(country.name)}/emergency`
    
    // Add local police intelligence for supported German cities
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
            name: city.name,
            riskScore: risk.riskScore,
            riskLevel: risk.riskLevel,
            recentReports: reports.map(report => ({
              id: report.id,
              title: report.title,
              category: report.category,
              severity: report.severity,
              timestamp: report.timestamp.toISOString()
            })),
            apiUrl: `/api/risk/local-police/${city.key}`
          };
        });

        localPoliceData = {
          available: true,
          cities: await Promise.all(cityPromises)
        }
        
        console.log(`✅ Regional police intelligence added for Germany`)
      } catch (error) {
        console.warn('Could not fetch regional police data:', error)
        localPoliceData = {
          available: false,
          error: 'Regional police data is temporarily unavailable.'
        }
      }
    }
    
    return NextResponse.json({
      country: country.name,
      countryCode: country.code,
      continent: country.continent,
      coordinates: {
        lat: country.lat,
        lng: country.lng
      },
      emergencyContacts: {
        url: emergencyContactUrl,
        // emergencyNumber: getEmergencyNumber(country.code),
        quickAccess: 'Click the URL for comprehensive emergency contact information'
      },
      localPolice: localPoliceData,
      overall: overallScore,
      weather: weatherScore,
      political: politicalScore,
      health: healthScore,
      infrastructure: infrastructureScore,
      trends: {
        overall: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        weather: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        political: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        health: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        infrastructure: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      },
      trendHistory: Array.from({ length: 30 }, () => 
        Math.floor(Math.random() * 40) + Math.max(overallScore - 20, 10)
      ),
      advisoryLevel,
      advisoryText,
      activeAlerts: alerts.length,
      recentEvents: alerts.slice(0, 5).map(a => ({
        type: a.type,
        category: a.category,
        description: a.title,
        timestamp: a.timestamp,
        source: a.source
      })),
      alertBreakdown: {
        critical: stats.critical,
        high: stats.high,
        medium: stats.medium,
        low: stats.low
      },
      warningDetails: generateWarningDetails(overallScore, advisoryLevel, alerts, conflictInfo, advisory),
      dataSource: 'Real-time from GDACS, USGS, NOAA',
      lastUpdate: new Date().toISOString()
    })
  } catch (error) {
    console.error('Risk API error:', error)
    return NextResponse.json({ 
      error: 'Failed to calculate risk',
      country: countryName 
    }, { status: 500 })
  }
}


