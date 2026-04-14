'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface LocationItem {
  type: 'country' | 'region' | 'city'
  name: string
  country: string
  region?: string
  searchTerms: string[]
}

interface Props {
  onSelect?: (item: LocationItem) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

// Build the index client-side from static imports
let locationIndex: LocationItem[] | null = null

async function getIndex(): Promise<LocationItem[]> {
  if (locationIndex) return locationIndex
  const res = await fetch('/api/location/search?q=__index')
  if (!res.ok) return []
  locationIndex = await res.json()
  return locationIndex!
}

function normalize(s: string): string {
  return s.toLowerCase()
    .replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ß/g, 'ss')
    .replace(/[éèêë]/g, 'e').replace(/[áàâã]/g, 'a').replace(/[íìîï]/g, 'i')
    .replace(/[óòôõ]/g, 'o').replace(/[úùû]/g, 'u').replace(/ñ/g, 'n')
    .replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/đ/g, 'd').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae').replace(/'/g, '').replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

export function searchLocations(index: LocationItem[], query: string, limit = 10): LocationItem[] {
  const q = normalize(query)
  if (!q) return []

  const scored = index.map(item => {
    let bestScore = 0
    for (const term of item.searchTerms) {
      const t = normalize(term)
      if (t === q) bestScore = Math.max(bestScore, 100)
      else if (t.startsWith(q)) bestScore = Math.max(bestScore, 80)
      else if (t.includes(q)) bestScore = Math.max(bestScore, 60)
    }
    // Prefer countries > regions > cities for same score
    if (bestScore > 0) {
      if (item.type === 'country') bestScore += 5
      else if (item.type === 'region') bestScore += 3
    }
    return { item, score: bestScore }
  }).filter(x => x.score > 0)

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(x => x.item)
}

export default function LocationSearch({ onSelect, placeholder = 'Land, Region oder Stadt suchen...', className = '', autoFocus = false }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationItem[]>([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [index, setIndex] = useState<LocationItem[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => { getIndex().then(setIndex) }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length < 2) { setResults([]); setOpen(false); return }
    debounceRef.current = setTimeout(() => {
      const r = searchLocations(index, query)
      setResults(r)
      setOpen(r.length > 0)
      setActiveIdx(-1)
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, index])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = useCallback((item: LocationItem) => {
    setOpen(false)
    setQuery('')
    if (onSelect) {
      onSelect(item)
    } else {
      const params = new URLSearchParams()
      params.set('country', item.country)
      if (item.region) params.set('region', item.region)
      if (item.type === 'city') params.set('city', item.name)
      router.push(`/dashboard?${params.toString()}`)
    }
  }, [onSelect, router])

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(results[activeIdx]) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  const icon = (type: string) => type === 'country' ? '🌍' : type === 'region' ? '🗺️' : '🏙️'

  const highlight = (text: string) => {
    const q = query.toLowerCase()
    const idx = text.toLowerCase().indexOf(q)
    if (idx === -1) return text
    return <>{text.slice(0, idx)}<span className="text-indigo-400 font-semibold">{text.slice(idx, idx + q.length)}</span>{text.slice(idx + q.length)}</>
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 backdrop-blur-xl bg-[#0a0f1e]/95 border border-white/10 rounded-xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((item, i) => (
            <button
              key={`${item.type}-${item.name}-${item.country}`}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${i === activeIdx ? 'bg-indigo-500/20' : 'hover:bg-white/5'}`}
            >
              <span className="text-lg flex-shrink-0">{icon(item.type)}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-slate-100 truncate">{highlight(item.name)}</div>
                <div className="text-xs text-slate-500 truncate">
                  {[item.region, item.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {query.length >= 2 && open && results.length === 0 && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 backdrop-blur-xl bg-[#0a0f1e]/95 border border-white/10 rounded-xl shadow-2xl p-4 text-center text-sm text-slate-500">
          Keine Ergebnisse
        </div>
      )}
    </div>
  )
}
