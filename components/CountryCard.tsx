import Link from 'next/link'
function getScoreColor(score: number) { return score <= 35 ? 'text-emerald-400' : score <= 65 ? 'text-amber-400' : 'text-red-400' }
function getBarColor(score: number) { return score <= 35 ? 'bg-emerald-500' : score <= 65 ? 'bg-amber-500' : 'bg-red-500' }
export default function CountryCard({ name, flag, score, level }: { name: string; flag: string; score: number; level: string }) {
  return (
    <Link href={`/dashboard?country=${encodeURIComponent(name)}`} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 block">
      <div className="text-3xl mb-2">{flag}</div>
      <div className="font-semibold text-slate-100 mb-1">{name}</div>
      <div className={`text-2xl font-bold mb-2 ${getScoreColor(score)}`}>{score}/100</div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full ${getBarColor(score)}`} style={{ width: `${score}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{level}</div>
    </Link>
  )
}
