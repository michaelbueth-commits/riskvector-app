'use client'

import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'

type EmergencyType = 'rocket' | 'airstrike' | 'earthquake' | 'terrorism' | 'civil_unrest' | 'nuclear' | 'biochemical' | 'flood' | 'fire'

interface ConflictAlert {
  id: string; type: string; severity: string; country: string; title: string; description: string; timestamp: string; source: string; instructions?: string[]; shelterRequired: boolean
}

interface Shelter { id: string; name: string; type: string; lat: number; lng: number; distance: number }

interface SafetyProfile {
  country: string; overallSafety: number; riskLevel: string; rules: Array<{category: string; rule: string; severity: string; details?: string}>; emergencyNumbers: string[]; culturalNotes: string[]; legalWarnings: string[]
}

interface EmergencyGuide {
  type: EmergencyType; title: string; icon: string; steps: string[]; donts: string[]; duration: string
}

const countries = ['UAE', 'Qatar', 'Israel', 'Iran', 'Lebanon', 'Syria', 'Iraq', 'Saudi Arabia', 'Jordan', 'Egypt', 'Yemen']

const emergencyGuides: EmergencyGuide[] = [
  { type: 'rocket', title: 'Rocket / Missile Attack', icon: '🚀', steps: ['Hear siren → Move to shelter IMMEDIATELY', 'If no shelter: Enter building, stairwell, or interior room', 'Stay away from windows and exterior walls', 'Lie flat, protect head with hands', 'Wait 10 minutes after last boom', 'Follow Home Front Command instructions'], donts: ['Do NOT stay outside', 'Do NOT film during active attack', 'Do NOT use elevators'], duration: 'Stay in shelter 10 min after last explosion' },
  { type: 'airstrike', title: 'Airstrike Warning', icon: '✈️', steps: ['Move to basement or underground', 'Stay away from windows', 'Stay low — lie flat', 'Keep phone charged', 'Monitor official channels'], donts: ['Do NOT film or photograph', 'Do NOT go outside', 'Do NOT use elevators'], duration: 'Until official all-clear' },
  { type: 'earthquake', title: 'Earthquake', icon: '🌍', steps: ['DROP to the ground', 'Take COVER under sturdy furniture', 'HOLD ON until shaking stops', 'Stay away from windows', 'If outdoors: Move to open area'], donts: ['Do NOT use elevators', 'Do NOT run outside during shaking'], duration: '10-30 seconds shaking + aftershocks' },
  { type: 'terrorism', title: 'Terrorist Attack', icon: '⚠️', steps: ['RUN — Leave area fast, drop belongings', 'HIDE — Find secure room, barricade door', 'FIGHT — Last resort only', 'Silence your phone', 'Call emergency when safe'], donts: ['Do NOT stop to film', 'Do NOT confront attackers', 'Do NOT gather in groups'], duration: 'Until police all-clear' },
  { type: 'civil_unrest', title: 'Civil Unrest / Protests', icon: '👥', steps: ['Avoid crowds and demonstrations', 'Stay in safe indoor location', 'Monitor local news', 'Contact your embassy', 'Keep passport with you'], donts: ['Do NOT photograph protesters or police', 'Do NOT engage politically', 'Do NOT post on social media'], duration: 'Varies — hours to weeks' },
  { type: 'nuclear', title: 'Nuclear / Radiation', icon: '☢️', steps: ['Get inside — deepest part of building', 'Seal windows and doors', 'Stay inside at least 24 hours', 'Take iodide ONLY if instructed', 'Remove outer clothing if exposed'], donts: ['Do NOT go outside', 'Do NOT consume contaminated food/water'], duration: 'Minimum 24 hours' },
  { type: 'biochemical', title: 'Chemical Incident', icon: '🧪', steps: ['Move UPWIND and uphill', 'Cover mouth/nose with cloth', 'Get inside, close windows', 'Remove contaminated clothing', 'Wash thoroughly with soap'], donts: ['Do NOT touch face/eyes', 'Do NOT try to clean substance'], duration: 'Until authorities declare safe' },
  { type: 'flood', title: 'Flood Emergency', icon: '🌊', steps: ['Move to higher ground', 'Do not walk through moving water', 'Do not drive through flooded roads', 'If trapped: highest level with roof access'], donts: ['Do NOT walk/drive through flood water', 'Do NOT touch electrical equipment'], duration: 'Flash floods fast; river floods days' },
  { type: 'fire', title: 'Fire Emergency', icon: '🔥', steps: ['Evacuate via stairs immediately', 'Stay low — smoke rises', 'Feel doors before opening', 'If trapped: seal cracks, signal from window'], donts: ['Do NOT use elevators', 'Do NOT go back for belongings'], duration: 'Get out and stay out' },
]

const severityColors: Record<string, string> = {
  critical: 'bg-red-600 text-white', urgent: 'bg-orange-500 text-white', warning: 'bg-yellow-500 text-black', info: 'bg-blue-500 text-white', caution: 'bg-yellow-500 text-black'
}

const shelterIcons: Record<string, string> = {
  shelter: '🏠', bunker: '🏗️', hospital: '🏥', police: '👮', fire_station: '🚒', embassy: '🏛️', assembly_point: '📍'
}

export default function SafetyPage() {
  const [selectedCountry, setSelectedCountry] = useState('Israel')
  const [alerts, setAlerts] = useState<ConflictAlert[]>([])
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeGuide, setActiveGuide] = useState<EmergencyType | null>(null)
  const [locationScore, setLocationScore] = useState<number | null>(null)

  const countryCoords: Record<string, [number, number]> = {
    'UAE': [25.2, 55.3], 'Qatar': [25.3, 51.2], 'Israel': [32.1, 34.8],
    'Iran': [35.7, 51.4], 'Lebanon': [33.9, 35.5], 'Syria': [33.5, 36.3],
    'Iraq': [33.3, 44.4], 'Saudi Arabia': [24.7, 46.7], 'Jordan': [31.9, 35.9],
    'Egypt': [30.0, 31.2], 'Yemen': [15.4, 44.2],
  }

  const fetchData = useCallback(async (country: string) => {
    setLoading(true)
    try {
      const [alertsRes, safetyRes, locationRes] = await Promise.allSettled([
        fetch(`/api/alerts/conflict?country=${country}`),
        fetch(`/api/safety-rules/${country}`),
        fetch(`/api/location-safety?lat=${countryCoords[country]?.[0] || 0}&lng=${countryCoords[country]?.[1] || 0}`),
      ])

      if (alertsRes.status === 'fulfilled') {
        const d = await alertsRes.value.json()
        setAlerts(d.alerts || [])
      }
      if (safetyRes.status === 'fulfilled') {
        const d = await safetyRes.value.json()
        setSafetyProfile(d.rules ? d : null)
      }
      if (locationRes.status === 'fulfilled') {
        const d = await locationRes.value.json()
        setLocationScore(d.score ?? null)
      }

      // Fetch shelters for country center
      const [lat, lng] = countryCoords[country] || [0, 0]
      if (lat && lng) {
        const shelterRes = await fetch(`/api/shelters?lat=${lat}&lng=${lng}&radius=15000`)
        if (shelterRes.ok) {
          const d = await shelterRes.json()
          setShelters(d.shelters || [])
        }
      }
    } catch (e) {
      console.error('Failed to fetch safety data:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData(selectedCountry) }, [selectedCountry, fetchData])

  const riskColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 30) return 'text-orange-400'
    return 'text-red-500'
  }

  const riskBg = (score: number) => {
    if (score >= 70) return 'border-green-500/30 bg-green-500/5'
    if (score >= 50) return 'border-yellow-500/30 bg-yellow-500/5'
    if (score >= 30) return 'border-orange-500/30 bg-orange-500/5'
    return 'border-red-500/30 bg-red-500/5'
  }

  return (
    <>
      <Head>
        <title>Safety Guide — RiskVector</title>
        <meta name="description" content="Real-time conflict alerts, shelter finder, and emergency guides for the Middle East" />
      </Head>

      <div className="min-h-screen bg-[#030714]">
        {/* Emergency Banner */}
        {alerts.filter(a => a.severity === 'critical' || a.severity === 'urgent').length > 0 && (
          <div className="bg-red-600/90 text-white px-4 py-2 text-center text-sm font-bold animate-pulse">
            ⚠️ ACTIVE EMERGENCY ALERTS FOR {selectedCountry.toUpperCase()} — {alerts.filter(a => a.severity === 'critical' || a.severity === 'urgent').length} URGENT ALERT(S) ⚠️
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Link href="/" className="text-indigo-400 text-sm hover:underline mb-2 inline-block">← Back to RiskVector</Link>
            <h1 className="text-3xl font-bold text-white">🛡️ Safety Guide</h1>
            <p className="text-slate-400 mt-1">Real-time alerts, shelters, and emergency guides for the Middle East</p>
          </div>

          {/* Country Selector */}
          <div className="mb-6">
            <label className="text-sm text-slate-400 mb-2 block">Select Location</label>
            <div className="flex flex-wrap gap-2">
              {countries.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCountry === c
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading safety data...</div>
          ) : (
            <div className="space-y-6">
              {/* Safety Score */}
              {locationScore !== null && (
                <div className={`border rounded-xl p-6 ${riskBg(locationScore)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Safety Score: {selectedCountry}</h2>
                      <p className="text-slate-400 text-sm mt-1">Based on conflict data, country risk, and nearby infrastructure</p>
                    </div>
                    <div className={`text-5xl font-bold ${riskColor(locationScore)}`}>
                      {locationScore}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Alerts */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">🔔 Active Alerts ({alerts.length})</h2>
                {alerts.length === 0 ? (
                  <p className="text-slate-400 text-sm">No active alerts for {selectedCountry}</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 10).map(alert => (
                      <div key={alert.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[alert.severity] || 'bg-slate-600'}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-400">{alert.type.replace('_', ' ')}</span>
                            </div>
                            <h3 className="text-white font-medium text-sm">{alert.title}</h3>
                            <p className="text-slate-400 text-xs mt-1 line-clamp-2">{alert.description}</p>
                            {alert.instructions && alert.instructions.length > 0 && (
                              <div className="mt-2">
                                {alert.instructions.map((inst, i) => (
                                  <p key={i} className="text-xs text-indigo-300">→ {inst}</p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 whitespace-nowrap">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">Source: {alert.source}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nearby Shelters */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">🏠 Nearby Safe Locations ({shelters.length})</h2>
                {shelters.length === 0 ? (
                  <p className="text-slate-400 text-sm">No shelters found in 15km radius. Try a larger city center.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {shelters.slice(0, 12).map(shelter => (
                      <div key={shelter.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30 flex items-center gap-3">
                        <span className="text-2xl">{shelterIcons[shelter.type] || '📍'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{shelter.name}</p>
                          <p className="text-slate-400 text-xs">{shelter.type.replace('_', ' ')} • {shelter.distance} km</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Safety Rules */}
              {safetyProfile && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">📋 Safety Rules — {selectedCountry}</h2>
                  <div className="space-y-2">
                    {safetyProfile.rules.map((rule, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                        <div className="flex items-start gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${severityColors[rule.severity] || 'bg-slate-600'}`}>
                            {rule.severity.toUpperCase()}
                          </span>
                          <div>
                            <p className="text-white text-sm"><span className="text-indigo-300">{rule.category}:</span> {rule.rule}</p>
                            {rule.details && <p className="text-slate-400 text-xs mt-1">{rule.details}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Emergency Numbers */}
                  <div className="mt-4">
                    <h3 className="text-white text-sm font-medium mb-2">📞 Emergency Numbers</h3>
                    <div className="flex flex-wrap gap-2">
                      {safetyProfile.emergencyNumbers.map((num, i) => (
                        <span key={i} className="bg-red-900/30 border border-red-700/30 text-red-300 px-3 py-1 rounded-lg text-sm">{num}</span>
                      ))}
                    </div>
                  </div>

                  {/* Legal Warnings */}
                  {safetyProfile.legalWarnings.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-white text-sm font-medium mb-2">⚖️ Legal Warnings</h3>
                      <ul className="space-y-1">
                        {safetyProfile.legalWarnings.map((w, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <span className="text-red-400">⚠</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cultural Notes */}
                  {safetyProfile.culturalNotes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-white text-sm font-medium mb-2">🌍 Cultural Notes</h3>
                      <ul className="space-y-1">
                        {safetyProfile.culturalNotes.map((n, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <span className="text-indigo-400">•</span> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Emergency Behavior Guides */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">🆘 Emergency Behavior Guides</h2>
                <p className="text-slate-400 text-sm mb-4">Tap a scenario to see step-by-step instructions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {emergencyGuides.map(guide => (
                    <button
                      key={guide.type}
                      onClick={() => setActiveGuide(activeGuide === guide.type ? null : guide.type)}
                      className={`text-left p-4 rounded-lg border transition-all ${
                        activeGuide === guide.type
                          ? 'border-red-500/50 bg-red-900/20'
                          : 'border-slate-700/30 bg-slate-900/30 hover:bg-slate-700/30'
                      }`}
                    >
                      <span className="text-2xl">{guide.icon}</span>
                      <p className="text-white text-sm font-medium mt-2">{guide.title}</p>
                    </button>
                  ))}
                </div>

                {/* Active Guide */}
                {activeGuide && (() => {
                  const guide = emergencyGuides.find(g => g.type === activeGuide)
                  if (!guide) return null
                  return (
                    <div className="bg-slate-900/50 border border-red-700/30 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-1">{guide.icon} {guide.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">Expected duration: {guide.duration}</p>
                      <div className="mb-4">
                        <h4 className="text-green-400 text-sm font-semibold mb-2">✅ What to Do:</h4>
                        <ol className="space-y-2">
                          {guide.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                              <span className="text-white text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="text-red-400 text-sm font-semibold mb-2">❌ What NOT to Do:</h4>
                        <ul className="space-y-1">
                          {guide.donts.map((dont, i) => (
                            <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                              <span>✗</span> {dont}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
