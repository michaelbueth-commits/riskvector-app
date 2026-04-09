'use client'

import { AlertSource } from '../lib/enhancedAlertService'

interface SourceVerificationProps {
  sources: AlertSource[]
  className?: string
}

export default function SourceVerification({ sources, className = '' }: SourceVerificationProps) {
  const getVerificationColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-green-100 text-green-800 border-green-200'
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200'
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 4: return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVerificationText = (tier: number) => {
    switch (tier) {
      case 1: return 'Offiziell'
      case 2: return 'Verifiziert'
      case 3: return 'Unbestätigt'
      case 4: return 'Nicht vertrauenswürdig'
      default: return 'Unbekannt'
    }
  }

  const getTrustScore = (credibility: number) => {
    if (credibility >= 9) return { score: 95, text: 'Höchst vertrauenswürdig' }
    if (credibility >= 8) return { score: 85, text: 'Sehr vertrauenswürdig' }
    if (credibility >= 7) return { score: 75, text: 'Vertrauenswürdig' }
    if (credibility >= 6) return { score: 60, text: 'Mittel vertrauenswürdig' }
    if (credibility >= 5) return { score: 45, text: 'Gering vertrauenswürdig' }
    return { score: 25, text: 'Nicht vertrauenswürdig' }
  }

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">✅</span>
        Quellen-Verifikation
      </h3>
      
      {sources.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-2xl mb-2">📋</div>
          <div>Keine Quellenangaben verfügbar</div>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((source, index) => {
            const trustData = getTrustScore(source.credibility)
            
            return (
              <div key={index} className="border border-gray-600 rounded-lg p-3 bg-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(source.tier)}`}>
                        {getVerificationText(source.tier)}
                      </span>
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                        >
                          <span className="mr-1">🔗</span>
                          Quelle
                        </a>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-white mb-1">{source.name}</h4>
                    {source.type && (
                      <div className="text-sm text-gray-400 mb-2">
                        Typ: <span className="text-gray-300">{source.type}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-400">Glaubwürdigkeit:</span>
                        <span className="ml-1 font-medium text-white">{source.credibility}/10</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-400">Vertrauensscore:</span>
                        <span className="ml-1 font-medium text-white">{trustData.score}%</span>
                      </div>
                    </div>
                    
                    {trustData.text && (
                      <div className="mt-2 text-xs text-gray-400">
                        {trustData.text}
                      </div>
                    )}
                  </div>
                  
                  {/* Trust Meter */}
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#374151"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={
                            trustData.score >= 90 ? '#10b981' :
                            trustData.score >= 80 ? '#3b82f6' :
                            trustData.score >= 70 ? '#f59e0b' :
                            '#ef4444'
                          }
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={176}
                          strokeDashoffset={176 - (176 * trustData.score) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {trustData.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bias Information */}
                {source.bias && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-400">
                      <span className="font-medium">Bias-Hinweis:</span> {source.bias}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {/* Overall Trust Score */}
      {sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Gesamte Verifizierung</div>
              <div className="text-xs text-gray-400">
                Basierend auf {sources.length} Quelle{sources.length > 1 ? 'n' : ''}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                {Math.round(sources.reduce((sum, source) => sum + source.credibility, 0) / sources.length)}%
              </div>
              <div className="text-xs text-gray-400">Durchschnitt</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
