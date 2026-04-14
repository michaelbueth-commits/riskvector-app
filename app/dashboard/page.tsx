'use client'

import { useState, useEffect, useCallback } from 'react'
import { countries } from '@/lib/countries'
import RiskMap from '@/components/RiskMap'
import RiskGauge from '@/components/RiskGauge'
import RiskBar from '@/components/RiskBar'
import SeverityBadge from '@/components/SeverityBadge'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LocationSearch from '@/components/LocationSearch'
import type { LocationItem } from '@/components/LocationSearch'

interface WatchlistItem {
  country: string
  addedAt: string
  lastRiskScore: number
  previousRiskScore?: number
}

interface Advisory {
  country: string
  source: string
  level: number
  levelText: string
  summary: string
  lastUpdated: string
  url: string
}

function getScoreColor(score: number) {
  if (score <= 35) return 'text-emerald-400'
  if (score <= 65) return 'text-amber-400'
  return 'text-red-400'
}

function getScoreLabel(score: number) {
  if (score <= 25) return 'Sehr sicher'
  if (score <= 50) return 'Etwas Vorsicht'
  if (score <= 75) return 'Erhöhtes Risiko'
  return 'Hohes Risiko'
}

function getAdvisoryIcon(level: number) {
  if (level === 1) return '🟢'
  if (level === 2) return '🟡'
  if (level === 3) return '🟠'
  return '🔴'
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const initialCountry = searchParams.get('country') || 'Germany'
  const initialRegion = searchParams.get('region') || ''
  const initialCity = searchParams.get('city') || ''
  const matchedCountry = countries.find(c =>
    c.name.toLowerCase() === initialCountry.toLowerCase() ||
    c.code.toLowerCase() === initialCountry.toLowerCase()
  )
  const [country, setCountry] = useState(matchedCountry?.name || 'Germany')
  const [risk, setRisk] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'checklist' | 'details'>('overview')
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [watchlistCount, setWatchlistCount] = useState(0)
  const [advisories, setAdvisories] = useState<Advisory[]>([])

  const checkWatchlist = useCallback(() => {
    try {
      const raw = localStorage.getItem('rv_watchlist')
      const items: WatchlistItem[] = raw ? JSON.parse(raw) : []
      setIsInWatchlist(items.some(i => i.country.toLowerCase() === country.toLowerCase()))
      setWatchlistCount(items.length)
    } catch {}
  }, [country])

  const toggleWatchlist = () => {
    try {
      const raw = localStorage.getItem('rv_watchlist')
      const items: WatchlistItem[] = raw ? JSON.parse(raw) : []
      const idx = items.findIndex(i => i.country.toLowerCase() === country.toLowerCase())
      if (idx >= 0) {
        items.splice(idx, 1)
      } else {
        items.push({ country, addedAt: new Date().toISOString().split('T')[0], lastRiskScore: risk?.overall ?? 50 })
      }
      localStorage.setItem('rv_watchlist', JSON.stringify(items))
      checkWatchlist()
    } catch {}
  }

  const fetchRisk = useCallback(async (c: string) => {
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/risk/' + encodeURIComponent(c))
      if (!r.ok) throw new Error('HTTP ' + r.status)
      setRisk(await r.json())
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [])

  const fetchAlerts = useCallback(async () => {
    try {
      const r = await fetch('/api/alerts')
      if (r.ok) { const data = await r.json(); setAlerts(Array.isArray(data) ? data : data.alerts || []) }
    } catch {}
  }, [])

  const fetchAdvisories = useCallback(async (c: string) => {
    try {
      const r = await fetch('/api/advisories?country=' + encodeURIComponent(c))
      if (r.ok) { const data = await r.json(); setAdvisories(data.advisories || []) }
    } catch {}
  }, [])

  useEffect(() => { fetchRisk(country) }, [country, fetchRisk])
  useEffect(() => { fetchAlerts() }, [fetchAlerts])
  useEffect(() => { fetchAdvisories(country) }, [country, fetchAdvisories])
  useEffect(() => { checkWatchlist() }, [country, checkWatchlist])

  const shareProfile = () => {
    const text = `🛡️ ${country} Sicherheits-Score: ${risk?.overall || '?'}/100 — RiskVector.app`
    if (navigator.share) { navigator.share({ title: `RiskVector: ${country}`, text, url: window.location.href }) }
    else { navigator.clipboard.writeText(text); alert('Kopiert!') }
  }

  return (
    <div className="min-h-screen bg-[#030714]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50 flex-shrink-0">
              🛡️ Risk<span className="text-indigo-400">Vector</span>
            </Link>
            <div className="hidden sm:block w-64">
              <LocationSearch
                placeholder="Suchen..."
                onSelect={(item: LocationItem) => setCountry(item.country)}
              />
            </div>
            <select value={country} onChange={e => setCountry(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white rounded-lg px-3 py-1.5 max-w-[200px] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none sm:hidden">
              {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-500 hover:text-white transition">Home</Link>
            <Link href="/watchlist" className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1">⭐ Watchlist{watchlistCount > 0 && <span className="bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{watchlistCount}</span>}</Link>
            <Link href="/checkin" className="text-xs text-slate-500 hover:text-white transition">🛡️ Check-in</Link>
            <Link href="/pricing" className="text-xs text-slate-500 hover:text-white transition">Preise</Link>
            <Link href="/rankings" className="text-xs text-slate-500 hover:text-white transition">Rankings</Link>
            <Link href="/notfall" className="text-xs text-red-400 hover:text-red-300 transition font-semibold">🆘 Notfall</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-red-400 text-sm">⚠️ {error}</div>
        )}

        {loading && (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-4 animate-pulse">🌍</div>
            <div>Prüfe {country}...</div>
          </div>
        )}

        {risk && !loading && (
          <div className="animate-fade-in">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-sm text-slate-500">{risk.country}</div>
                <button onClick={toggleWatchlist} className={`text-lg transition hover:scale-110 ${isInWatchlist ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`} title={isInWatchlist ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}>
                  {isInWatchlist ? '⭐' : '☆'}
                </button>
              </div>
              <div className="mb-6"><RiskGauge score={risk.overall} size="lg" /></div>
              <div className={`text-lg font-semibold mb-6 ${getScoreColor(risk.overall)}`}>{getScoreLabel(risk.overall)}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Kriminalität', value: risk.political, icon: '🏛️' },
                  { label: 'Gesundheit', value: risk.health, icon: '🏥' },
                  { label: 'Wetter', value: risk.weather, icon: '🌤️' },
                  { label: 'Infrastruktur', value: risk.infrastructure, icon: '🏗️' },
                ].map(cat => (
                  <div key={cat.label} className="bg-white/[0.03] rounded-xl p-4">
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-xs text-slate-500 mb-1">{cat.label}</div>
                    <span className={`text-lg font-bold ${getScoreColor(cat.value ?? 0)}`}>{cat.value ?? '—'}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={shareProfile} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition text-slate-300">📤 Risiko-Profil teilen</button>
                <Link href={`/checkin?country=${encodeURIComponent(country)}`} className="bg-emerald-600/20 border border-emerald-600/30 rounded-lg px-4 py-2 text-sm hover:bg-emerald-600/30 transition text-emerald-400">🛡️ Bin sicher</Link>
                <button onClick={toggleWatchlist} className={`border rounded-lg px-4 py-2 text-sm transition ${isInWatchlist ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
                  {isInWatchlist ? '⭐ Gemerkt' : '⭐ Merken'}
                </button>
              </div>
            </div>

            {/* Government Advisories */}
            {advisories.length > 0 && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-slate-100 mb-4">🏛️ Offizielle Reisehinweise</h3>
                <div className="space-y-3">
                  {advisories.map((adv, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getAdvisoryIcon(adv.level)}</span>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{adv.source}</div>
                          <div className="text-xs text-slate-500">{adv.levelText}</div>
                        </div>
                      </div>
                      <a href={adv.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline">Details ↗</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
              {([
                { id: 'overview' as const, label: '📊 Übersicht' },
                { id: 'details' as const, label: '🔬 Details' },
                { id: 'alerts' as const, label: '🚨 Alerts' },
                { id: 'checklist' as const, label: '📋 Checkliste' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">📊 Kategorie-Bewertung</h3>
                  <div className="space-y-4">
                    <RiskBar value={risk.political ?? 0} label="Kriminalität / Politik" icon="🏛️" />
                    <RiskBar value={risk.health ?? 0} label="Gesundheit" icon="🏥" />
                    <RiskBar value={risk.weather ?? 0} label="Wetter & Natur" icon="🌤️" />
                    <RiskBar value={risk.infrastructure ?? 0} label="Infrastruktur" icon="🏗️" />
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-100 mb-2">📝 Was du wissen musst</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{risk.advisoryText}</p>
                  {risk.lastUpdate && <div className="mt-3 text-xs text-slate-600">Update: {new Date(risk.lastUpdate).toLocaleString('de-DE')}</div>}
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-100 mb-3">🆘 Notfallnummern</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-400">Notruf</div>
                      <div className="text-xl font-bold text-red-400">{risk.emergencyContacts?.emergencyNumber || '112'}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-400">Polizei</div>
                      <div className="text-lg font-bold text-slate-100">{risk.emergencyContacts?.police || '110'}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-400">Krankenwagen</div>
                      <div className="text-lg font-bold text-slate-100">{risk.emergencyContacts?.ambulance || '112'}</div>
                    </div>
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/5"><span className="text-sm font-medium text-slate-300">🗺️ Karte</span></div>
                  <RiskMap alerts={alerts} selectedCountry={country} />
                </div>
                {risk.trendHistory && risk.trendHistory.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-100 mb-3">📈 Risikoverlauf (30 Tage)</h3>
                    <div className="flex items-end gap-1 h-20">
                      {risk.trendHistory.slice(-30).map((val: number, i: number) => (
                        <div key={i} className={`flex-1 rounded-sm ${val >= 70 ? 'bg-red-500' : val >= 45 ? 'bg-amber-500' : val >= 25 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ height: `${Math.max(5, (val / 100) * 80)}%`, opacity: 0.6 + (i / 30) * 0.4 }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 mt-2"><span>Vor 30 Tagen</span><span>Heute</span></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-slate-100 mb-4">🔬 Erweiterte Risiko-Analyse</h3>
                <p className="text-sm text-slate-400 mb-4">Detaillierte Analyse für {risk.country}. Datenquelle: {risk.dataSource}.</p>
                <div className="space-y-4">
                  <RiskBar value={risk.political ?? 0} label="Politische Stabilität" icon="🏛️" />
                  <RiskBar value={risk.health ?? 0} label="Gesundheitsrisiken" icon="🏥" />
                  <RiskBar value={risk.weather ?? 0} label="Wetter & Naturkatastrophen" icon="🌤️" />
                  <RiskBar value={risk.infrastructure ?? 0} label="Infrastruktur & Verkehr" icon="🏗️" />
                </div>
                <p className="text-xs text-slate-600 mt-4">Basis-Scores basieren auf aktuellen Alerts von GDACS, USGS und NOAA.</p>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center text-slate-500">Keine aktiven Alerts für {country}</div>
                ) : alerts.slice(0, 10).map((alert: any) => (
                  <div key={alert.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition">
                    <div className="flex items-start gap-3">
                      <SeverityBadge severity={alert.severity} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-100 text-sm">{alert.title}</h4>
                        {alert.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>}
                        <div className="flex gap-3 mt-2 text-[10px] text-slate-600">
                          <span>{alert.source}</span>
                          {alert.timestamp && <span>{new Date(alert.timestamp).toLocaleDateString('de-DE')}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/news" className="block text-center text-indigo-400 text-sm hover:text-indigo-300 transition mt-4">Alle Alerts anzeigen →</Link>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-4">
                {[
                  { title: '💉 Gesundheit & Impfungen', items: ['Standard-Impfungen überprüfen', 'Landspezifische Impfempfehlungen prüfen', 'Reisekrankenversicherung abschließen', 'Reiseapotheke packen'] },
                  { title: '📋 Dokumente & Formalitäten', items: ['Reisepass Gültigkeit prüfen (mind. 6 Monate)', 'Visum-Anforderungen prüfen', 'Kopien aller Dokumente (digital + Print)', 'Notfallkontakte eintragen'] },
                  { title: '🔒 Sicherheit', items: ['Lokale Notrufnummern speichern', 'Adresse der deutschen Botschaft notieren', 'Reisewarnung des Auswärtigen Amtes lesen', 'Offline-Karten herunterladen'] },
                ].map((section) => (
                  <div key={section.title} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-100 mb-3">{section.title}</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {section.items.map((item, i) => <li key={i} className="flex items-center gap-2"><span className="w-4 h-4 border border-slate-600 rounded flex-shrink-0" />{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Laden...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
