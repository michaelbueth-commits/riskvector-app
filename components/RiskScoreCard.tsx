'use client'

import { useState } from 'react'

interface RiskScoreCardProps {
  title: string
  score: number
  trend?: 'up' | 'down' | 'stable'
  icon: string
  primary?: boolean
  details?: {
    description?: string
    factors?: string[]
    recommendations?: string[]
    lastUpdated?: string
    dataSource?: string
  }
}

export default function RiskScoreCard({ title, score, trend = 'stable', icon, primary = false, details }: RiskScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
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

  const getRiskDescription = (title: string, score: number) => {
    const descriptions: Record<string, string> = {
      'Overall Risk': score <= 25 ? 'Travel conditions are safe with minimal risks detected.' :
                       score <= 50 ? 'Some risks present. Exercise normal precautions.' :
                       score <= 75 ? 'Significant risks detected. Avoid non-essential travel.' :
                       'Severe risks. Do not travel.',
      'Weather': score <= 25 ? 'No significant weather threats in the forecast.' :
                  score <= 50 ? 'Minor weather disturbances possible. Stay informed.' :
                  score <= 75 ? 'Active weather warnings in effect. Take precautions.' :
                  'Severe weather emergency. Seek shelter immediately.',
      'Political': score <= 25 ? 'Stable political environment with no major tensions.' :
                    score <= 50 ? 'Some political tensions or protests may occur.' :
                    score <= 75 ? 'Elevated political instability. Avoid demonstrations.' :
                    'Active conflict or severe political crisis. Do not travel.',
      'Health': score <= 25 ? 'No significant health risks reported.' :
                 score <= 50 ? 'Minor health precautions recommended.' :
                 score <= 75 ? 'Active disease outbreak or health emergency.' :
                 'Severe health crisis. Medical facilities may be overwhelmed.',
      'Infrastructure': score <= 25 ? 'Infrastructure is stable and functioning normally.' :
                         score <= 50 ? 'Minor infrastructure disruptions possible.' :
                         score <= 75 ? 'Significant infrastructure damage or failures.' :
                         'Critical infrastructure failure. Basic services unavailable.'
    }
    return descriptions[title] || 'Risk assessment based on multiple data sources.'
  }

  const getFactors = (title: string, score: number): string[] => {
    const factorsMap: Record<string, string[]> = {
      'Weather': ['Temperature extremes', 'Precipitation levels', 'Wind speeds', 'Storm activity'],
      'Political': ['Government stability', 'Civil unrest', 'International relations', 'Terrorism threat'],
      'Health': ['Disease outbreaks', 'Healthcare capacity', 'Vaccination rates', 'Sanitation'],
      'Infrastructure': ['Transportation', 'Power grid', 'Communications', 'Water supply']
    }
    
    if (title === 'Overall Risk') return []
    return factorsMap[title] || []
  }

  const getRecommendations = (title: string, score: number): string[] => {
    if (score <= 25) return ['No special precautions needed', 'Follow standard travel advice']
    if (score <= 50) return ['Stay informed via local news', 'Keep emergency contacts handy', 'Have contingency plans']
    if (score <= 75) return ['Avoid high-risk areas', 'Register with embassy', 'Have evacuation plan', 'Keep emergency supplies']
    return ['Do not travel', 'If present, leave immediately', 'Contact embassy for assistance', 'Shelter in place if evacuation not possible']
  }

  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        className={`
          relative rounded-xl p-5 transition-all duration-300 cursor-pointer
          ${styles.bg} border ${styles.border} ${primary ? styles.glow : ''}
          ${primary ? 'col-span-2 md:col-span-1' : ''}
          hover:scale-[1.02] hover:shadow-lg
        `}
      >
        {/* Background gradient for primary card */}
        {primary && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{icon}</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
          
          <p className="mt-3 text-xs text-gray-500 text-center">
            Click for details
          </p>
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsExpanded(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div 
            className="relative bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${styles.bg} border-b ${styles.border} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-2xl font-bold ${styles.text}`}>{score}</span>
                      <span className="text-sm text-gray-400">/100</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${styles.bg} ${styles.text} border ${styles.border}`}>
                        {getRiskLabel(score)}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
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
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Assessment</h3>
                <p className="text-gray-300 leading-relaxed">
                  {getRiskDescription(title, score)}
                </p>
              </div>
              
              {/* Factors */}
              {getFactors(title, score).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {getFactors(title, score).map((factor, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${styles.text.replace('text-', 'bg-')}`} />
                        <span className="text-gray-300">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {getRecommendations(title, score).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <svg className={`w-4 h-4 mt-0.5 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Data Source */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Data sources: GDACS, USGS, GDELT, NOAA</span>
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
