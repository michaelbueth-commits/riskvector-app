import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const sources = [
  'Auswärtiges Amt (Deutschland)', 'US Department of State', 'UK Foreign Office',
  'Weltgesundheitsorganisation (WHO)', 'INTERPOL', 'Vereinte Nationen (UN)',
  'Global Terrorism Index', 'World Risk Index', 'Numbeo Safety Index', 'GDACS', 'USGS', 'NOAA',
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar active="Über uns" />
      <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Über <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">RiskVector</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Die führende deutschsprachige Plattform für Reisesicherheitsbewertungen. Wir helfen Reisenden, fundierte Entscheidungen zu treffen.
          </p>
        </div>

        <div className="space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">📊 Unsere Methodik</h2>
            <p className="text-slate-300 mb-6">Unser Risiko-Score (0–100) wird aus über 20 Datenquellen aggregiert und gewichtet:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🏛️', title: 'Politische Stabilität (25%)', desc: 'Regierungsform, Konflikte, Terrorismus-Risiko' },
                { icon: '🏥', title: 'Gesundheitsrisiken (25%)', desc: 'Krankheiten, Impfempfehlungen, medizinische Versorgung' },
                { icon: '🌤️', title: 'Wetter & Natur (25%)', desc: 'Naturkatastrophen, Hurrikan-Saison, Luftqualität' },
                { icon: '🏗️', title: 'Infrastruktur (25%)', desc: 'Verkehrssicherheit, Kriminalität, Notfallversorgung' },
              ].map(c => (
                <div key={c.title} className="bg-white/[0.03] rounded-xl p-4">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-semibold text-slate-100 mb-1">{c.title}</div>
                  <div className="text-sm text-slate-400">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">📡 Datenquellen</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {sources.map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-indigo-400 text-xs">✓</span>{s}
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">🔄 Aktualisierung</h2>
            <p className="text-slate-300">Unsere Daten werden <strong className="text-slate-100">stündlich</strong> aktualisiert. Bei kritischen Ereignissen erfolgt eine sofortige Neubewertung.</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">🇩🇪 Über das Team</h2>
            <p className="text-slate-300">RiskVector wird von einem kleinen Team in Deutschland entwickelt. Wir glauben, dass jeder Reisende Zugang zu professionellen Sicherheitsinformationen haben sollte.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25">🚀 Dashboard testen</Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
