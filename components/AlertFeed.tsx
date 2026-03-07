'use client'

interface Alert {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  category: string
  title: string
  location: string
  timestamp: string
  description: string
}

interface AlertFeedProps {
  alerts: Alert[]
  isLoading: boolean
}

export default function AlertFeed({ alerts, isLoading }: AlertFeedProps) {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴', badge: 'bg-red-100 text-red-700' }
      case 'high':
        return { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🟠', badge: 'bg-orange-100 text-orange-700' }
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '🟡', badge: 'bg-yellow-100 text-yellow-700' }
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔵', badge: 'bg-blue-100 text-blue-700' }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-slate-600">No active alerts</p>
        <p className="text-sm text-slate-500 mt-1">You're safe for now!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type)
        return (
          <div 
            key={alert.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 transition-all hover:shadow-sm cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{styles.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${styles.badge}`}>
                  {alert.type.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-slate-500">{alert.timestamp}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{alert.title}</h3>
            <p className="text-xs text-slate-600 mb-2">{alert.description}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {alert.location}
            </div>
          </div>
        )
      })}
    </div>
  )
}
