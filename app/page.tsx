import Link from 'next/link'
import CountryCard from '@/components/CountryCard'

const destinations = [
  { name: 'Türkei', flag: '🇹🇷', score: 55, level: 'Mittleres Risiko' },
  { name: 'Spanien', flag: '🇪🇸', score: 36, level: 'Niedriges Risiko' },
  { name: 'Thailand', flag: '🇹🇭', score: 49, level: 'Mittleres Risiko' },
  { name: 'USA', flag: '🇺🇸', score: 53, level: 'Mittleres Risiko' },
  { name: 'Japan', flag: '🇯🇵', score: 23, level: 'Sehr sicher' },
  { name: 'Deutschland', flag: '🇩🇪', score: 25, level: 'Sehr sicher' },
]

const features = [
  { icon: '🚦', title: 'Sicherheitsampel', desc: 'Grün, Gelb, Rot — sofort sehen, wie sicher ein Land ist.' },
  { icon: '🌤️', title: 'Wetter & Gesundheit', desc: 'Hurrikan-Saison, Malaria-Risiko, Luftqualität — alles drin.' },
  { icon: '🚨', title: 'Echtzeit-Alerts', desc: 'Push-Benachrichtigungen bei Sicherheitsänderungen.' },
  { icon: '📋', title: 'Reise-Checkliste', desc: 'Impfungen, Visum, Versicherungen — nichts vergessen.' },
  { icon: '🆘', title: 'Notrufnummern', desc: 'Lokale Notrufnummern und Botschaftsadressen parat.' },
  { icon: '📱', title: 'Offline verfügbar', desc: 'Länderdaten speichern und ohne Internet nutzen.' },
]

const tiers = [
  { name: 'Free', price: '€0', period: '', features: ['5 Länder/Monat', 'Basis-Risiko-Info', 'Sicherheitsampel'], popular: false },
  { name: 'Reisepass', price: '€4.99', period: '/Monat', features: ['Alle 195 Länder', 'Echtzeit-Alerts', 'Reise-Checklisten', 'Offline-Modus'], popular: true },
  { name: 'Weltreisender', price: '€9.99', period: '/Monat', features: ['Alles im Reisepass', 'Familien-Sharing', 'Prioritäts-Support', 'Lifetime: €49.99'], popular: false },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030714]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
            🛡️ Risk<span className="text-indigo-400">Vector</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/notfall" className="text-sm text-red-400 hover:text-red-300 transition hidden sm:block">🆘 Notfall</Link>
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition hidden sm:block">Dashboard</Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition hidden sm:block">Preise</Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all">
              Kostenlos testen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-slate-300">Bereits <strong className="text-white">15.847</strong> Prüfungen heute</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Wie sicher ist dein<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Reiseziel?</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto animate-slide-up delay-100">
            Prüfe sofort das Sicherheitsrisiko von 195 Ländern. Wetter, Gesundheit, Kriminalität — alles auf einen Blick.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-16 animate-slide-up delay-200">
            <form action="/dashboard" method="get" className="flex gap-2">
              <input
                name="country"
                type="text"
                placeholder="Land oder Ziel eingeben..."
                className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
              <button type="submit" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 whitespace-nowrap">
                🔍 Prüfen
              </button>
            </form>
          </div>

          {/* Destination Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {destinations.map((d, i) => (
              <div key={d.name} className="animate-slide-up" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                <CountryCard {...d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-8">Vertrauenswürdige Datenquellen</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 text-sm font-medium">
            {['BBC', 'Reuters', 'WHO', 'GDACS', 'USGS', 'Auswärtiges Amt'].map(s => (
              <span key={s} className="opacity-50 hover:opacity-80 transition">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 195 Länder</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 24/7 Updates</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Echte Daten</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span> DSGVO-konform</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-tight">Alles, was du für sicheres Reisen brauchst</h2>
          <p className="text-slate-400 text-center mb-12">Keine überflüssigen Features. Nur das, was wirklich hilft.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-tight">Fair & einfach</h2>
          <p className="text-slate-400 text-center mb-12">Starte kostenlos. Upgrade, wenn du mehr brauchst.</p>
          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                  tier.popular
                    ? 'backdrop-blur-xl bg-indigo-600/10 border-2 border-indigo-500/40 relative shadow-lg shadow-indigo-500/10 scale-[1.02]'
                    : 'backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Beliebteste Wahl
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-slate-500">{tier.period}</span>}
                </div>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.popular ? '/pricing' : '/dashboard'}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tier.price === '€0' ? 'Kostenlos starten' : 'Jetzt upgraden'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Prüfe jetzt dein Reiseziel</h2>
          <p className="text-slate-400 mb-8">Kostenlos. Ohne Anmeldung. In 5 Sekunden.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25 text-lg"
          >
            🚀 Kostenlos testen
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            🛡️ Risk<span className="text-indigo-400">Vector</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-slate-300 transition">Preise</Link>
            <Link href="/about" className="hover:text-slate-300 transition">Über uns</Link>
            <Link href="/docs" className="hover:text-slate-300 transition">API Docs</Link>
          </div>
          <div className="text-xs text-slate-600">Made in Germany 🇩🇪</div>
        </div>
      </footer>
    </main>
  )
}
