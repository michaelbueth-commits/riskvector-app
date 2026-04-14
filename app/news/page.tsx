'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SeverityBadge from '@/components/SeverityBadge'

interface RealAlert {
  id: string; title: string; description: string; type: string; category?: string
  severity: string; timestamp: string; source: string; location: string; country: string
  url?: string; lat?: number; lng?: number; credibility?: number
  verification?: { level: string; method: string }; tags?: string[]
}

const typeLabels: Record<string, string> = {
  NEWS: '📰 News', POLICE: '👮 Police', GOVERNMENT: '🏛️ Government', ORGANIZATION: '🏥 Organization',
  GDACS: '🌐 GDACS', USGS: '🌍 USGS', NOAA: '🌩️ NOAA', VOLCANO: '🌋 Volcano',
  EARTHQUAKE: '🌍 Earthquake', WEATHER: '⛈️ Weather',
}

const formatTime = (iso: string) => {
  try { const diff = Date.now() - new Date(iso).getTime(); const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'; if (mins < 60) return mins + 'm ago'
    const h = Math.floor(mins / 60); if (h < 24) return h + 'h ago'; return Math.floor(h / 24) + 'd ago'
  } catch { return '' }
}

export default function NewsPage() {
  const [alerts, setAlerts] = useState<RealAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<RealAlert | null>(null)
  const [activeType, setActiveType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setError(null)
        const [alertsRes, enhancedRes, govRes] = await Promise.all([fetch('/api/alerts'), fetch('/api/alerts/enhanced'), fetch('/api/alerts/government')])
        const alertsData = await alertsRes.json(); const enhancedData = await enhancedRes.json(); const govData = await govRes.json()
        const allAlerts: RealAlert[] = [
          ...(alertsData.alerts || []).map((a: any) => ({ ...a, _source: 'alerts' })),
          ...(enhancedData.alerts || []).map((a: any) => ({ ...a, _source: 'enhanced' })),
          ...(govData.alerts || []).map((a: any) => ({ ...a, _source: 'government' })),
        ]
        const seen = new Set<string>(); const unique = allAlerts.filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true })
        const sevOrder: Record<string, number> = { CRITICAL: 4, critical: 4, HIGH: 3, high: 3, MEDIUM: 2, medium: 2, LOW: 1, low: 1 }
        unique.sort((a, b) => { const d = (sevOrder[b.severity] || 0) - (sevOrder[a.severity] || 0); return d !== 0 ? d : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() })
        setAlerts(unique); setLastUpdated(new Date())
      } catch (err: any) { setError(err.message) } finally { setLoading(false) }
    }
    fetchAlerts(); const i = setInterval(fetchAlerts, 60000); return () => clearInterval(i)
  }, [])

  const types = ['All', ...Array.from(new Set(alerts.map(a => a.type))).filter(Boolean).sort()]
  const filteredAlerts = alerts.filter(a => {
    const matchType = activeType === 'All' || a.type === activeType
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || (a.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar active="News" />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">Intelligence Feed</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LIVE</span>
          </div>
          <p className="text-slate-400">Real-time alerts from USGS, GDACS, INTERPOL, Government agencies, and verified news sources.</p>
          <p className="text-xs text-slate-600 mt-1">Last updated: {lastUpdated.toLocaleTimeString('de-DE')} · {alerts.length} alerts</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"><p className="text-red-400 text-sm">Error: {error}. Retrying...</p></div>}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {types.slice(0, 8).map(t => (
              <button key={t} onClick={() => setActiveType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeType === t ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                {typeLabels[t] || t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg pl-4 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition" />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-2">
            <span className="text-sm text-slate-500">{filteredAlerts.length} alerts</span>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="animate-pulse bg-white/5 rounded-xl p-4 h-28" />)}</div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {filteredAlerts.map(alert => (
                  <button key={alert.id} onClick={() => setSelectedAlert(alert)} className={`w-full text-left rounded-xl p-4 transition-all border ${selectedAlert?.id === alert.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'}`}>
                    <div className="flex items-start gap-2.5">
                      <SeverityBadge severity={alert.severity} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-100 text-sm leading-snug mb-1 line-clamp-2">{alert.title}</h3>
                        {alert.description && <p className="text-xs text-slate-400 line-clamp-2 mb-1.5">{alert.description}</p>}
                        <div className="flex items-center gap-3 text-[10px] text-slate-600">
                          <span className="text-slate-400">{alert.source}</span>
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredAlerts.length === 0 && <div className="text-center py-12 text-slate-500"><div className="text-3xl mb-3">🔍</div><p>No alerts found</p></div>}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {selectedAlert ? (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <SeverityBadge severity={selectedAlert.severity} />
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400">{typeLabels[selectedAlert.type] || selectedAlert.type}</span>
                  {selectedAlert.location && <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400">📍 {selectedAlert.location}</span>}
                </div>
                <h2 className="text-xl font-bold text-slate-100 leading-tight mb-3">{selectedAlert.title}</h2>
                {selectedAlert.description && <p className="text-slate-300 leading-relaxed text-sm mb-4">{selectedAlert.description}</p>}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-xs text-slate-500">
                  <span>{formatTime(selectedAlert.timestamp)}</span>
                  <span>📡 {selectedAlert.source}</span>
                  {selectedAlert.country && <span>🌍 {selectedAlert.country}</span>}
                  {selectedAlert.credibility != null && <span>🎯 {selectedAlert.credibility}% credible</span>}
                </div>
                {selectedAlert.url && (
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs text-slate-500 mb-1">Original Source</p><p className="text-sm text-indigo-400 truncate max-w-md">{selectedAlert.url}</p></div>
                      <a href={selectedAlert.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium transition flex-shrink-0 ml-4">Open →</a>
                    </div>
                  </div>
                )}
                {selectedAlert.lat && selectedAlert.lng && (
                  <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <p className="text-sm text-indigo-300">📍 Lat: {selectedAlert.lat.toFixed(4)}, Lng: {(selectedAlert.lng || 0).toFixed(4)}</p>
                  </div>
                )}
                {selectedAlert.verification && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium">✓ {selectedAlert.verification.level}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center py-20">
                <div className="text-4xl mb-4">📡</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Select an Alert</h3>
                <p className="text-slate-400 text-sm text-center max-w-xs">Choose an alert from the live feed to view full details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
