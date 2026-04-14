'use client'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const tiers = [
  { name: 'Free', price: '€0', period: '', desc: 'Perfekt zum Ausprobieren', features: ['5 Länder pro Monat', 'Basis-Risiko-Score', 'Sicherheitsampel', 'Notrufnummern', 'Responsive Web-App'], cta: 'Jetzt starten', popular: false, priceId: null },
  { name: 'Reisepass', price: '€4.99', period: '/Monat', desc: 'Für Vielflieger & Urlauber', features: ['Alle 195 Länder', 'Echtzeit-Sicherheits-Alerts', 'Reise-Checklisten', 'Offline-Modus', 'Wetter- & Gesundheitsrisiken', 'Reise-Tipps'], cta: 'Jetzt abonnieren', popular: true, priceId: 'price_1TMAIgPrxEA5GFLKEFJGZ93T' },
  { name: 'Weltreisender', price: '€9.99', period: '/Monat', desc: 'Für Globetrotter & Familien', features: ['Alles im Reisepass', 'Familien-Sharing (bis zu 5)', 'Prioritäts-Support', 'Social Sharing', 'Erweiterte Risiko-Analyse', 'Lifetime-Option: €49.99'], cta: 'Jetzt abonnieren', popular: false, priceId: 'price_1TMAIgPrxEA5GFLKv4BnlffX' },
]

const faqs = [
  { q: 'Kann ich jederzeit kündigen?', a: 'Ja, jederzeit kündbar. Läuft bis Ende des Abrechnungszeitraums.' },
  { q: 'Gibt es eine Geld-zurück-Garantie?', a: 'Ja! 14 Tage Geld-zurück ohne Fragen.' },
  { q: 'Wie funktioniert Familien-Sharing?', a: 'Bis zu 5 Familienmitglieder mit eigenem Zugang.' },
  { q: 'Was ist die Lifetime-Option?', a: 'Einmal €49.99 für alle Weltreisender-Features für immer.' },
  { q: 'Sind alle Preise inkl. MwSt.?', a: 'Ja, alle Preise inkl. gesetzlicher Mehrwertsteuer.' },
]

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleCheckout = async (tier: typeof tiers[0]) => {
    if (!tier.priceId) { window.location.href = '/dashboard'; return }
    setLoadingTier(tier.name)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId: tier.priceId, userId: 'guest' }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Etwas ist schiefgelaufen')
    } catch { alert('Checkout fehlgeschlagen') }
    finally { setLoadingTier(null) }
  }

  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar active="Preise" />
      <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Sicheres Reisen <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">muss nicht teuer sein</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Starte kostenlos. Upgrade nur, wenn du mehr brauchst. Jederzeit kündbar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start mb-20">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-2xl p-7 flex flex-col transition-all duration-300 ${tier.popular ? 'backdrop-blur-xl bg-indigo-600/10 border-2 border-indigo-500/40 relative shadow-lg shadow-indigo-500/10 scale-[1.02]' : 'backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20'}`}>
              {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">Beliebteste Wahl</div>}
              <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{tier.desc}</p>
              <div className="mb-6"><span className="text-4xl font-bold">{tier.price}</span>{tier.period && <span className="text-slate-500">{tier.period}</span>}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-slate-300"><span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>{f}</li>)}
              </ul>
              <button onClick={() => handleCheckout(tier)} disabled={loadingTier === tier.name} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${tier.popular ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}>
                {loadingTier === tier.name ? 'Weiterleitung...' : tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mb-16 max-w-2xl mx-auto backdrop-blur-xl bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-2">🔥 Lifetime Deal</div>
          <h3 className="text-xl font-bold mb-2">Einmal zahlen, für immer nutzen</h3>
          <p className="text-slate-400 text-sm mb-4">Alle Weltreisender-Features. Kein Abo. Einmal €49.99.</p>
          <button onClick={() => handleCheckout({ priceId: 'price_1TMAIhPrxEA5GFLKrx6AM7W9', name: 'Lifetime' } as any)} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-500/25">Lifetime — €49.99</button>
        </div>

        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-6 py-4">
            <span className="text-2xl">🛡️</span>
            <div className="text-left">
              <div className="font-semibold text-emerald-400">14-Tage Geld-zurück-Garantie</div>
              <div className="text-xs text-slate-400">Nicht zufrieden? Volle Rückerstattung.</div>
            </div>
          </div>
        </div>

        <div className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl group">
                <summary className="p-5 font-semibold cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
