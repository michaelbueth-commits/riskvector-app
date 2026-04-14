'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Suspense } from 'react'
import { useNotificationPolling } from '../../hooks/useNotifications'

interface WatchlistItem {
  country: string
  addedAt: string
  lastRiskScore: number
  previousRiskScore?: number
}

function getScoreColor(score: number) {
  if (score <= 35) return 'text-emerald-400'
  if (score <= 65) return 'text-amber-400'
  return 'text-red-400'
}

function getScoreBg(score: number) {
  if (score <= 35) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score <= 65) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

function getTrend(current: number, previous?: number) {
  if (!previous) return { arrow: '→', color: 'text-slate-500', label: 'Neu' }
  const diff = current - previous
  if (diff > 3) return { arrow: '↑', color: 'text-red-400', label: `+${diff}` }
  if (diff < -3) return { arrow: '↓', color: 'text-emerald-400', label: `${diff}` }
  return { arrow: '→', color: 'text-slate-500', label: 'Stabil' }
}

function WatchlistContent() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadWatchlist = useCallback(() => {
    try {
      const raw = localStorage.getItem('rv_watchlist')
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setLoading(false)
  }, [])

  const saveWatchlist = (newItems: WatchlistItem[]) => {
    setItems(newItems)
    localStorage.setItem('rv_watchlist', JSON.stringify(newItems))
  }

  useNotificationPolling()

  useEffect(() => { loadWatchlist() }, [])

  const refreshScores = useCallback(async () => {
    const current = [...items]
    for (let i = 0; i < current.length; i++) {
      try {
        const r = await fetch('/api/risk/' + encodeURIComponent(current[i].country))
        if (r.ok) {
          const data = await r.json()
          current[i].previousRiskScore = current[i].lastRiskScore
          current[i].lastRiskScore = data.overall ?? current[i].lastRiskScore
        }
      } catch {}
    }
    saveWatchlist(current)
  }, [items])

  useEffect(() => {
    if (!loading && items.length > 0) refreshScores()
  }, [loading])

  const removeItem = (country: string) => {
    saveWatchlist(items.filter(i => i.country !== country))
  }

  if (loading) {
    return <div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Lade Watchlist...</div>
  }

  return (
    <div className="min-h-screen bg-[#030714]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
              🛡️ Risk<span className="text-indigo-400">Vector</span>
            </Link>
            <span className="text-indigo-400 font-bold text-sm">⭐ Watchlist</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="text-xs text-slate-400 hover:text-white transition">🔔 Alerts</Link>
            <Link href="/checkin" className="text-xs text-slate-400 hover:text-white transition">🛡️ Check-in</Link>
            <Link href="/dashboard" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">⭐ Deine Watchlist</h1>
          <p className="text-slate-400">Gespeicherte Reiseziele mit aktuellem Risikoscore</p>
        </div>

        {items.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-xl font-semibold text-white mb-2">Noch keine Ziele gespeichert</h2>
            <p className="text-slate-400 mb-6">Gehe zum Dashboard und speichere Länder mit ⭐ Merken</p>
            <Link href="/dashboard" className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-500 hover:to-violet-500 transition">Zum Dashboard →</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">{items.length} gespeichert{items.length !== 1 ? 'e' : ''} Reiseziel{items.length !== 1 ? 'e' : ''}</span>
              <button onClick={() => refreshScores()} className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition">🔄 Aktualisieren</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const trend = getTrend(item.lastRiskScore, item.previousRiskScore)
                return (
                  <div key={item.country} className={`backdrop-blur-xl ${getScoreBg(item.lastRiskScore)} border rounded-2xl p-5 hover:scale-[1.02] transition-transform`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{item.country}</h3>
                        <div className="text-xs text-slate-500 mt-0.5">Hinzugefügt: {new Date(item.addedAt).toLocaleDateString('de-DE')}</div>
                      </div>
                      <button onClick={() => removeItem(item.country)} className="text-slate-600 hover:text-red-400 transition p-1" title="Entfernen">✕</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-3xl font-bold ${getScoreColor(item.lastRiskScore)}`}>{item.lastRiskScore}</span>
                        <span className="text-slate-500 text-sm">/100</span>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${trend.color}`}>
                        <span className="text-lg">{trend.arrow}</span>
                        <span>{trend.label}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard?country=${encodeURIComponent(item.country)}`} className="block mt-3 text-center bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 transition">Details anzeigen →</Link>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function WatchlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Laden...</div>}>
      <WatchlistContent />
    </Suspense>
  )
}
