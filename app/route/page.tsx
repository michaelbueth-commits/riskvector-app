'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RiskGauge from '@/components/RiskGauge'
import SeverityBadge from '@/components/SeverityBadge'

interface NewsArticle { id: string; title: string; description: string; url: string; source: string; sourceLogo?: string; timestamp: string; severity: string }
interface Destination { city: string; country: string; riskScore: number; relevantNews: NewsArticle[]; alerts: string[]; warnings: string[]; travelAdvisory: string | null; saferAlternative: string | null }
interface RouteResult { overallRouteRisk: number; destinations: Destination[]; warnings: string[]; recommendations: string[]; generatedAt: string; dataSources: string[] }

export default function RoutePage() {
  const [inputValue, setInputValue] = useState('')
  const [destinations, setDestinations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RouteResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addDestination = () => { const city = inputValue.trim(); if (city && !destinations.includes(city)) { setDestinations([...destinations, city]); setInputValue('') } }
  const removeDestination = (idx: number) => { setDestinations(destinations.filter((_, i) => i !== idx)); setResult(null) }

  const analyzeRoute = async () => {
    if (destinations.length < 2) return
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/route/risk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destinations }) })
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Failed'); setResult(data)
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  const examples = [
    { label: 'Europe → Middle East → Asia', cities: ['Berlin', 'Istanbul', 'Tehran', 'Bangkok'] },
    { label: 'Southeast Asia Tour', cities: ['Bangkok', 'Singapore', 'Jakarta', 'Bali'] },
    { label: 'South America Tour', cities: ['Buenos Aires', 'Santiago', 'Lima', 'Bogota'] },
  ]

  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar active="Route" />
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Travel Route Risk Assessment</h1>
          <p className="text-slate-400">Enter your travel route for real-time risk analysis from global news sources and disaster alerts.</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Enter city (e.g., Berlin, Istanbul)" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDestination()} className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
            <button onClick={addDestination} className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition font-medium">+ Add</button>
          </div>

          {destinations.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {destinations.map((city, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-slate-600 mr-1">→</span>}
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white flex items-center gap-2">
                    {city}
                    <button onClick={() => removeDestination(idx)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {examples.map(ex => (
                <button key={ex.label} onClick={() => { setDestinations(ex.cities); setResult(null) }} className="text-xs text-slate-500 hover:text-indigo-400 transition px-2 py-1 rounded hover:bg-white/5">{ex.label}</button>
              ))}
            </div>
            <button onClick={analyzeRoute} disabled={destinations.length < 2 || loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25">
              {loading ? 'Analyzing...' : 'Analyze Route'}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"><p className="text-red-400 text-sm">{error}</p></div>}

        {loading && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400">Fetching real-time data from global sources...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-center py-8 px-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Overall Route Risk</h2>
              <RiskGauge score={result.overallRouteRisk} size="lg" />
              <p className="text-sm text-slate-500 mt-4">Based on {result.dataSources.length} live data sources</p>
            </div>

            {/* Route Timeline */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-slate-100 mb-4">🗺️ Route Timeline</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {result.destinations.map((dest, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 min-w-[140px] text-center">
                      <div className="text-sm font-bold text-slate-100">{dest.city}</div>
                      <div className="text-xs text-slate-500 mb-2">{dest.country}</div>
                      <RiskGauge score={dest.riskScore} size="sm" />
                    </div>
                    {idx < result.destinations.length - 1 && <span className="text-slate-600 text-lg">→</span>}
                  </div>
                ))}
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h3 className="text-red-400 font-semibold mb-2">⚠️ Travel Warnings</h3>
                {result.warnings.map((w, i) => <p key={i} className="text-red-300 text-sm mb-1">{w}</p>)}
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                <h3 className="text-indigo-400 font-semibold mb-2">💡 Recommendations</h3>
                {result.recommendations.map((r, i) => <p key={i} className="text-indigo-300 text-sm mb-1">{r}</p>)}
              </div>
            )}

            {result.destinations.map((dest, idx) => (
              <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 pt-2"><RiskGauge score={dest.riskScore} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-100">{dest.city}</h3>
                      <span className="text-sm text-slate-500">{dest.country}</span>
                    </div>
                    {dest.travelAdvisory && <div className="mb-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20"><p className="text-red-300 text-sm">⚠️ {dest.travelAdvisory}</p></div>}
                    {dest.saferAlternative && <div className="mb-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20"><p className="text-indigo-300 text-sm">💡 {dest.saferAlternative}</p></div>}
                    {dest.relevantNews.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent News</h4>
                        <div className="space-y-2">
                          {dest.relevantNews.slice(0, 3).map((article, ai) => (
                            <div key={ai} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                              <SeverityBadge severity={article.severity} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-100 line-clamp-1">{article.title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                                  <span>{article.source}</span>
                                  <span>{new Date(article.timestamp).toLocaleDateString('de-DE')}</span>
                                </div>
                              </div>
                              {article.url && <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs hover:underline flex-shrink-0">→</a>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {result.dataSources.map((s, i) => <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-slate-400">{s}</span>)}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && destinations.length === 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-center py-16">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Plan Your Route</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Add at least 2 destinations to get a comprehensive risk assessment.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
