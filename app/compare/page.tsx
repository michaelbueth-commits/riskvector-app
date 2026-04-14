'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RiskBar from '@/components/RiskBar'

const COUNTRIES = ['Afghanistan','Australia','Brazil','Canada','China','France','Germany','India','Iran','Iraq','Israel','Italy','Japan','Mexico','Russia','South Korea','Spain','Syria','Turkey','Ukraine','United Kingdom','United States','Yemen']

interface RiskData { country: string; overall: number; political: number; health: number; weather: number; infrastructure: number; advisoryLevel: string }

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(['Germany', 'France'])
  const [data, setData] = useState<Record<string, RiskData>>({})
  const [loading, setLoading] = useState(false)

  const toggle = (c: string) => setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : prev.length < 3 ? [...prev, c] : prev)

  useEffect(() => {
    if (selected.length === 0) return
    setLoading(true)
    Promise.all(selected.map(c => fetch(`/api/risk/${encodeURIComponent(c)}`).then(r => r.json())))
      .then(results => { const map: Record<string, RiskData> = {}; results.forEach(r => { if (r.country) map[r.country] = r }); setData(map) })
      .finally(() => setLoading(false))
  }, [selected])

  const categories = ['overall','political','health','weather','infrastructure'] as const
  const catLabels: Record<string, string> = { overall: 'Gesamt', political: 'Kriminalität', health: 'Gesundheit', weather: 'Wetter', infrastructure: 'Infrastruktur' }
  const catIcons: Record<string, string> = { overall: '📊', political: '🏛️', health: '🏥', weather: '🌤️', infrastructure: '🏗️' }

  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="pt-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Länder-Vergleich</h1>
          <p className="text-slate-400">Vergleiche Risiko-Scores für bis zu 3 Länder.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {COUNTRIES.map(c => (
            <button key={c} onClick={() => toggle(c)} className={`px-3 py-1.5 rounded-lg text-sm transition cursor-pointer ${selected.includes(c) ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}>{c}</button>
          ))}
        </div>
        {loading && <p className="text-slate-400 animate-pulse">Laden...</p>}
        {!loading && selected.length > 0 && (
          <div className="space-y-6">
            {categories.map(cat => (
              <div key={cat} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-slate-100 mb-4">{catIcons[cat]} {catLabels[cat]}</h3>
                <div className="space-y-3">
                  {selected.map(c => {
                    const score = data[c]?.[cat] ?? 0
                    return <div key={c} className="flex items-center gap-3"><span className="text-sm text-slate-400 w-32">{c}</span><div className="flex-1"><div className="w-full h-3 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${score >= 70 ? 'bg-red-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${score}%` }} /></div></div><span className="text-sm font-bold text-slate-100 w-8 text-right">{score}</span></div>
                  })}
                </div>
              </div>
            ))}
            {Object.keys(data).length > 1 && (
              <div className="backdrop-blur-xl bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-indigo-300 mb-2">🏆 Welches ist sicherer?</h3>
                <p className="text-slate-300">{selected.reduce((a, b) => (data[a]?.overall ?? 100) < (data[b]?.overall ?? 100) ? a : b)} hat den niedrigsten Risiko-Score.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
