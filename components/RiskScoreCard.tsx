'use client'

interface RiskScoreCardProps {
  title: string
  score: number
  trend?: 'up' | 'down' | 'stable'
  icon: string
  primary?: boolean
}

export default function RiskScoreCard({ title, score, trend = 'stable', icon, primary = false }: RiskScoreCardProps) {
  const getRiskStyles = (score: number) => {
    if (score <= 25) return { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]'
    }
    if (score <= 50) return { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]'
    }
    if (score <= 75) return { 
      bg: 'bg-orange-500/10', 
      text: 'text-orange-400', 
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]'
    }
    return { 
      bg: 'bg-red-500/10', 
      text: 'text-red-400', 
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]'
    }
  }

  const styles = getRiskStyles(score)

  const getTrendIcon = () => {
    if (trend === 'up') return (
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
    if (trend === 'down') return (
      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
    return (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
  }

  const getRiskLabel = (score: number) => {
    if (score <= 25) return 'Low'
    if (score <= 50) return 'Medium'
    if (score <= 75) return 'High'
    return 'Critical'
  }

  return (
    <div className={`
      relative rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer
      ${styles.bg} border ${styles.border} ${primary ? styles.glow : ''}
      ${primary ? 'col-span-2 md:col-span-1' : ''}
    `}>
      {/* Background gradient for primary card */}
      {primary && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          {getTrendIcon()}
        </div>
        
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          {title}
        </h3>
        
        <div className="flex items-end gap-2">
          <div className={`text-3xl font-bold ${styles.text}`}>
            {score}
          </div>
          <div className="text-sm text-gray-500 pb-1">/100</div>
        </div>

        {/* Risk level indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            score <= 25 ? 'bg-emerald-500' :
            score <= 50 ? 'bg-amber-500' :
            score <= 75 ? 'bg-orange-500' :
            'bg-red-500 animate-pulse'
          }`} />
          <span className={`text-xs font-semibold ${styles.text}`}>
            {getRiskLabel(score)} Risk
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              score <= 25 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
              score <= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
              score <= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
