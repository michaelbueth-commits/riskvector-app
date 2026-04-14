'use client'
export default function RiskGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color = score >= 70 ? '#ef4444' : score >= 45 ? '#f59e0b' : score >= 25 ? '#eab308' : '#22c55e'
  const label = score >= 70 ? 'HIGH RISK' : score >= 45 ? 'ELEVATED' : score >= 25 ? 'MODERATE' : 'LOW RISK'
  const s = { sm: { w: 'w-16 h-16', t: 'text-sm', l: 'text-[8px]', sw: 3.5 }, md: { w: 'w-24 h-24', t: 'text-xl', l: 'text-[10px]', sw: 3 }, lg: { w: 'w-32 h-32', t: 'text-3xl', l: 'text-xs', sw: 2.5 } }[size]
  return (
    <div className="text-center">
      <div className={`relative ${s.w} mx-auto`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={s.sw} />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth={s.sw} strokeDasharray={`${score}, 100`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${s.t} font-bold`} style={{ color }}>{score}</span>
        </div>
      </div>
      <span className={`${s.l} font-semibold tracking-wider`} style={{ color }}>{label}</span>
    </div>
  )
}
