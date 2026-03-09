'use client'

import { useState } from 'react'
import { RealAlert } from '@/lib/alertsService'
import AlertFeed from './AlertFeed'
import AdvancedFilters from './AdvancedFilters'

interface AlertFeedWithFiltersProps {
  initialAlerts: RealAlert[]
  policeReports: any[]
  isLoading: boolean
}

export default function AlertFeedWithFilters({ 
  initialAlerts, 
  policeReports, 
  isLoading 
}: AlertFeedWithFiltersProps) {
  const [filteredAlerts, setFilteredAlerts] = useState<RealAlert[]>(initialAlerts)

  const handleFiltered = (filtered: RealAlert[]) => {
    setFilteredAlerts(filtered)
  }

  return (
    <div>
      <AdvancedFilters
        alerts={initialAlerts}
        onFiltered={handleFiltered}
        totalResults={initialAlerts.length}
      />
      <AlertFeed 
        alerts={filteredAlerts}
        policeReports={policeReports}
        isLoading={isLoading}
        showNoAlertsMessage={true}
      />
    </div>
  )
}