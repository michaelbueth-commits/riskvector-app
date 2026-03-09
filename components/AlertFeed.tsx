'use client'

interface Alert {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  category: string
  title: string
  location: string
  country?: string
  timestamp: string
  description: string
  source?: string
  sourceId?: string
  severity?: string
  url?: string
}

interface PoliceReport {
  id: string
  title: string
  description: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  location: {
    city: string
    district?: string
    street?: string
  }
  source: string
  timestamp: Date
  status: string
  cityKey?: string
  cityName?: string
}

interface AlertFeedProps {
  alerts: Alert[]
  policeReports?: PoliceReport[]
  isLoading: boolean
  showNoAlertsMessage?: boolean
}

export default function AlertFeed({ alerts, policeReports = [], isLoading, showNoAlertsMessage = true }: AlertFeedProps) {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return { 
          bg: 'bg-red-500/5', 
          border: 'border-red-500/30', 
          icon: '🔴', 
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          pulse: true
        }
      case 'high':
        return { 
          bg: 'bg-orange-500/5', 
          border: 'border-orange-500/30', 
          icon: '🟠', 
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          pulse: false
        }
      case 'medium':
        return { 
          bg: 'bg-amber-500/5', 
          border: 'border-amber-500/30', 
          icon: '🟡', 
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          pulse: false
        }
      default:
        return { 
          bg: 'bg-blue-500/5', 
          border: 'border-blue-500/30', 
          icon: '🔵', 
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          pulse: false
        }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Earthquake': '🌋',
      'Tropical Cyclone': '🌀',
      'Flood': '🌊',
      'Volcano': '🌋',
      'Weather': '⛈️',
      'Weather Alert': '⛈️',
      'Security': '⚠️',
      'Health': '🏥',
      'Disaster': '🚨',
      // Police report categories
      'TRAFFIC': '🚦',
      'THEFT': '🚨',
      'ASSAULT': '⚠️',
      'VANDALISM': '💥',
      'DRUGS': '💊',
      'PUBLIC_ORDER': '👮',
      'MISSING_PERSON': '🔍',
      'FRAUD': '💳',
      'BURGLARY': '🏠',
      'FIRE': '🔥',
    }
    return icons[category] || '⚠️'
  }

  // Convert police reports to alert format
  const convertPoliceToAlert = (report: PoliceReport): Alert => {
    const severityMap = {
      'LOW': 'low',
      'MEDIUM': 'medium',
      'HIGH': 'high',
      'CRITICAL': 'critical'
    }

    return {
      id: report.id,
      type: severityMap[report.severity] as Alert['type'],
      category: report.category,
      title: report.title,
      location: report.location.district ? `${report.location.district}, ${report.location.city}` : report.location.city,
      country: report.cityName,
      timestamp: report.timestamp.toISOString(),
      description: report.description,
      source: report.source,
      url: `/api/risk/local-police/${report.cityKey}`
    }
  }

  // Combine alerts and police reports
  const allAlerts: Alert[] = [
    ...alerts,
    ...policeReports.map(convertPoliceToAlert)
  ]

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-white/5 h-28 rounded-lg" />
        ))}
      </div>
    )
  }

  if (allAlerts.length === 0) {
    if (!showNoAlertsMessage) {
      return null
    }
    
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white font-semibold mb-1">All Clear</p>
        <p className="text-sm text-gray-500">No active alerts at this time</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
      {allAlerts.map((alert) => {
        const styles = getAlertStyles(alert.type)
        return (
          <div 
            key={alert.id}
            className={`
              ${styles.bg} border ${styles.border} rounded-lg p-4 
              transition-all duration-300 hover:scale-[1.01] cursor-pointer
              group relative overflow-hidden
            `}
            onClick={() => alert.url && window.open(alert.url, '_blank')}
          >
            {/* Animated pulse for critical alerts */}
            {styles.pulse && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer" />
            )}
            
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{styles.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${styles.badge}`}>
                  {alert.type.toUpperCase()}
                </span>
                <span className="text-sm">{getCategoryIcon(alert.category)}</span>
              </div>
              <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
            </div>
            
            <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">
              {alert.title}
            </h3>
            
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{alert.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{alert.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 px-2 py-0.5 rounded bg-white/5">
                  {alert.category}
                </span>
                {alert.source && (
                  <span className="text-xs text-gray-600">
                    via {alert.source}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {allAlerts.length > 5 && (
        <button className="w-full py-3 text-sm text-gray-400 hover:text-white transition text-center">
          View all {allAlerts.length} alerts →
        </button>
      )}
    </div>
  )
}
