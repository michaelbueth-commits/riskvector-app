'use client'

interface RiskScoreCardProps {
  title: string
  score: number
  trend?: 'up' | 'down' | 'stable'
  icon: string
}

export default function RiskScoreCard({ title, score, trend = 'stable', icon }: RiskScoreCardProps) {
  const getRiskColor = (score: number) => {
    if (score <= 25) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
    if (score <= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' }
    if (score <= 75) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
  }

  const colors = getRiskColor(score)

  const getTrendIcon = () => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-5 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-semibold ${
          trend === 'up' ? 'text-red-600' : 
          trend === 'down' ? 'text-green-600' : 
          'text-slate-600'
        }`}>
          {getTrendIcon()}
        </span>
      </div>
      <h3 className="text-sm font-medium text-slate-700 mb-1">{title}</h3>
      <div className={`text-3xl font-bold ${colors.text}`}>
        {score}
        <span className="text-sm font-normal text-slate-600 ml-1">/100</span>
      </div>
    </div>
  )
}
