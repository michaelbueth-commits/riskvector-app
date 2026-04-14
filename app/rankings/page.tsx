import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const safest = [
  { rank: 1, name: 'Island', code: 'IS', score: 8, flag: '🇮🇸' },
  { rank: 2, name: 'Norwegen', code: 'NO', score: 12, flag: '🇳🇴' },
  { rank: 3, name: 'Schweiz', code: 'CH', score: 14, flag: '🇨🇭' },
  { rank: 4, name: 'Dänemark', code: 'DK', score: 15, flag: '🇩🇰' },
  { rank: 5, name: 'Finnland', code: 'FI', score: 16, flag: '🇫🇮' },
  { rank: 6, name: 'Neuseeland', code: 'NZ', score: 18, flag: '🇳🇿' },
  { rank: 7, name: 'Österreich', code: 'AT', score: 19, flag: '🇦🇹' },
  { rank: 8, name: 'Portugal', code: 'PT', score: 21, flag: '🇵🇹' },
  { rank: 9, name: 'Irland', code: 'IE', score: 22, flag: '🇮🇪' },
  { rank: 10, name: 'Japan', code: 'JP', score: 23, flag: '🇯🇵' },
]

const dangerous = [
  { rank: 1, name: 'Afghanistan', code: 'AF', score: 95, flag: '🇦🇫' },
  { rank: 2, name: 'Syrien', code: 'SY', score: 93, flag: '🇸🇾' },
  { rank: 3, name: 'Süd-Sudan', code: 'SS', score: 91, flag: '🇸🇸' },
  { rank: 4, name: 'Jemen', code: 'YE', score: 89, flag: '🇾🇪' },
  { rank: 5, name: 'Somalia', code: 'SO', score: 87, flag: '🇸🇴' },
  { rank: 6, name: 'Zentralafrikanische Rep.', code: 'CF', score: 86, flag: '🇨🇫' },
  { rank: 7, name: 'Libyen', code: 'LY', score: 85, flag: '🇱🇾' },
  { rank: 8, name: 'DR Kongo', code: 'CD', score: 83, flag: '🇨🇩' },
  { rank: 9, name: 'Irak', code: 'IQ', score: 82, flag: '🇮🇶' },
  { rank: 10, name: 'Mali', code: 'ML', score: 80, flag: '🇲🇱' },
]

function getBarColor(score: number) { return score <= 35 ? 'bg-emerald-500' : score <= 65 ? 'bg-amber-500' : 'bg-red-500' }
function getTextColor(score: number) { return score <= 35 ? 'text-emerald-400' : score <= 65 ? 'text-amber-400' : 'text-red-400' }

export default function RankingsPage() {
  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar active="Rankings" />
      <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Länder-<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Rankings</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Die sichersten und gefährlichsten Länder der Welt — basierend auf unserem aggregierten Risiko-Score.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[{ title: 'Die 10 sichersten Länder', icon: '🟢', data: safest, hoverBorder: 'hover:border-emerald-500/30' }, { title: 'Die 10 gefährlichsten Länder', icon: '🔴', data: dangerous, hoverBorder: 'hover:border-red-500/30' }].map(col => (
            <div key={col.title}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><span>{col.icon}</span>{col.title}</h2>
              <div className="space-y-2">
                {col.data.map(c => (
                  <Link key={c.code} href={`/dashboard?country=${encodeURIComponent(c.name)}`} className={`flex items-center gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 ${col.hoverBorder} transition-all duration-300 group`}>
                    <span className="text-2xl w-8 text-center">{c.flag}</span>
                    <span className="text-slate-500 text-sm w-6">#{c.rank}</span>
                    <span className="font-semibold flex-1 text-slate-100">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getBarColor(c.score)}`} style={{ width: `${c.score}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${getTextColor(c.score)}`}>{c.score}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
