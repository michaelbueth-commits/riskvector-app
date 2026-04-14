'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { products, categories, type CategoryFilter, type ShopProduct } from '@/lib/shop-products'
import { getPlugInfo } from '@/lib/plug-types'
import { getVpnInfo, getVpnColor } from '@/lib/vpn-necessity'

const popularDestinations = [
  'Türkei', 'Spanien', 'Thailand', 'USA', 'Japan', 'Italien',
  'Ägypten', 'Indien', 'Marokko', 'Griechenland', 'Portugal',
  'China', 'Russland', 'Vereinigte Arabische Emirate', 'Mexiko',
  'Vietnam', 'Indonesien', 'Brasilien', 'Australien', 'Südafrika',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-600'}>★</span>
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function ProductCard({ product, country }: { product: ShopProduct; country: string }) {
  const url = product.affiliateUrl.includes('?')
    ? `${product.affiliateUrl}&utm_campaign=${encodeURIComponent(country)}`
    : `${product.affiliateUrl}?utm_campaign=${encodeURIComponent(country)}`

  const isHighlighted = product.recommendedForRisk === 'critical' || product.recommendedForRisk === 'high'

  return (
    <div className={`relative group backdrop-blur-xl bg-white/[0.03] border rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-300 ${
      isHighlighted ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-white/[0.06]'
    }`}>
      {isHighlighted && (
        <div className="absolute -top-2.5 left-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          EMPFOHLEN
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-100 text-sm">{product.name}</h3>
          <p className="text-xs text-slate-500">{product.provider}</p>
        </div>
        <span className="text-sm font-bold text-emerald-400 whitespace-nowrap">{product.priceFrom}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{product.description}</p>
      <div className="space-y-1.5 mb-4">
        {product.features.slice(0, 4).map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-indigo-400">✓</span>
            {f}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <StarRating rating={product.rating} />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          {product.category === 'esim' ? 'eSIM laden' : product.category === 'vpn' ? 'Jetzt schützen' : 'Jetzt abschließen'}
        </a>
      </div>
      <p className="text-[9px] text-slate-600 mt-2">Werbung · Affiliate-Link</p>
    </div>
  )
}

function CountryInfo({ country }: { country: string }) {
  const plug = getPlugInfo(country)
  const vpn = getVpnInfo(country)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-xs text-slate-500 mb-1">🔌 Steckertyp</div>
        <div className="text-lg font-bold text-slate-100">
          {plug.plugTypes.map(t => `Typ ${t}`).join(', ')}
        </div>
        <div className="text-xs text-slate-400">{plug.voltage}V · {plug.frequency}</div>
      </div>
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-xs text-slate-500 mb-1">🔒 VPN-Notwendigkeit</div>
        <div className={`text-lg font-bold ${getVpnColor(vpn.level)}`}>
          {{ none: 'Nicht nötig', low: 'Niedrig', medium: 'Mittel', high: 'Hoch', critical: 'Kritisch' }[vpn.level]}
        </div>
        {vpn.reason && <div className="text-xs text-slate-400 mt-1">{vpn.reason}</div>}
      </div>
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-xs text-slate-500 mb-1">📱 eSIM verfügbar</div>
        <div className="text-lg font-bold text-emerald-400">Ja ✓</div>
        <div className="text-xs text-slate-400">Airalo, Holafly, Maya Mobile</div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[#030714]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
            🛡️ Risk<span className="text-indigo-400">Vector</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm text-indigo-400 font-medium">🛒 Shop</Link>
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition hidden sm:block">Dashboard</Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition hidden sm:block">Preise</Link>
            <Link href="/notfall" className="text-sm text-red-400 hover:text-red-300 transition hidden sm:block">🆘 Notfall</Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            🛒 Reise-Shop
            <span className="block text-lg sm:text-xl text-indigo-400 mt-2">Alles für deine Sicherheit</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Empfohlene Produkte für dein Reiseziel — Versicherungen, VPN, eSIM, Adapter und mehr.
          </p>
          <div className="max-w-md mx-auto mb-4">
            <input
              type="text"
              placeholder="🌍 Reiseziel eingeben..."
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {popularDestinations.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  selectedCountry === c
                    ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {selectedCountry && <CountryInfo country={selectedCountry} />}

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-4 py-2 rounded-lg border transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Produkte durchsuchen..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition"
          />
        </div>

        {selectedCountry && getVpnInfo(selectedCountry).level !== 'none' && (
          <div className="mb-8 backdrop-blur-xl bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-amber-300">VPN empfohlen für {selectedCountry}</p>
              <p className="text-xs text-slate-400 mt-1">{getVpnInfo(selectedCountry).reason}</p>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">🔍</p>
            <p>Keine Produkte gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} country={selectedCountry || 'allgemein'} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-xs text-slate-600 max-w-2xl mx-auto">
          <p>⚠️ Affiliate-Hinweis: Einige Links auf dieser Seite sind Affiliate-Links. Wenn du über diese Links kaufst, erhalten wir eine kleine Provision — für dich ändert sich der Preis nicht.</p>
          <p className="mt-2">Alle Produktempfehlungen basieren auf allgemeinen Reisehinweisen und ersetzen keine individuelle Beratung.</p>
        </div>
      </div>
    </main>
  )
}
