'use client'

import { useState } from 'react'
import AlertFeed from './AlertFeed'
import AdvancedFilters from './AdvancedFilters'

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

interface AlertFeedWithFiltersProps {
  alerts: Alert[]
  policeReports: PoliceReport[]
  isLoading: boolean
  country?: string
  city?: string
  className?: string
}

export default function AlertFeedWithFilters({ 
  alerts, 
  policeReports, 
  isLoading, 
  country,
  city,
  className 
}: AlertFeedWithFiltersProps) {
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts)

  const handleFiltered = (filtered: Alert[]) => {
    setFilteredAlerts(filtered)
  }

  return (
    <div className={className}>
      {/* Advanced Filters */}
      <AdvancedFilters 
        alerts={alerts}
        onFiltered={handleFiltered}
        totalResults={alerts.length}
      />

      {/* Alert Feed */}
      <AlertFeed 
        alerts={filteredAlerts}
        policeReports={policeReports}
        isLoading={isLoading}
        showNoAlertsMessage={true}
      />
    </div>
  )
}