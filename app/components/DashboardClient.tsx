'use client'

import { useState, useEffect } from 'react'
import EnhancedAlertFeed from '@/components/EnhancedAlertFeed'
import { EnhancedAlert as ServiceAlert } from "@/lib/enhancedAlertService"
import { EnhancedAlert } from "@/lib/enhancedAlertTypes"
import GeoFilter from '@/components/GeoFilter'
import SourceVerification from '@/components/SourceVerification'
import { Alert, AlertSource } from '@/lib/enhancedAlertService'
import { enhancedAlertService } from '@/lib/enhancedAlertService'
import { pushNotificationService } from '@/lib/pushNotificationService'
import { usePushNotifications } from '@/lib/pushNotificationService'

// Force dynamic rendering and no caching

function Dashboard() {
  const [alerts, setAlerts]: [ServiceAlert[], any] = useState<ServiceAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<ServiceAlert[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const { permission, subscribed, requestPermission } = usePushNotifications()

  useEffect(() => {
    // Fetch alerts
    const fetchAlerts = async () => {
      try {
        const data = await enhancedAlertService.getAllAlerts()
        setAlerts(data)
        setFilteredAlerts(data)
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      }
    }

    fetchAlerts()

    // Request notification permission
    if (permission === 'default') {
      requestPermission()
    }

    // Set up periodic refresh
    const interval = setInterval(fetchAlerts, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [permission, requestPermission])

  useEffect(() => {
    // Filter alerts based on geographic selection
    if (selectedRegion || selectedCountry) {
      const filtered = alerts.filter(alert => {
        if (selectedCountry && alert.country === selectedCountry) {
          return true
        }
        if (selectedRegion) {
          // Simple region mapping (in real app, this would be more sophisticated)
          const regionMap: Record<string, string[]> = {
            'europe': ['DE', 'FR', 'GB', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH'],
            'asia': ['CN', 'JP', 'KR', 'IN', 'TH', 'VN', 'SG', 'MY', 'PH', 'ID'],
            'americas': ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE'],
            'africa': ['EG', 'ZA', 'NG', 'KE', 'GH', 'MA', 'TN', 'DZ', 'ET'],
            'middle-east': ['TR', 'IR', 'SA', 'AE', 'IL', 'JO', 'LB', 'IQ', 'SY']
          }
          
          return regionMap[selectedRegion]?.includes(alert.country || '') || false
        }
        return false
      })
      setFilteredAlerts(filtered)
    } else {
      setFilteredAlerts(alerts)
    }
  }, [alerts, selectedRegion, selectedCountry])

  const handleRegionChange = (region: string | null) => {
    setSelectedRegion(region)
    if (region) {
      setSelectedCountry(null) // Clear country when region is selected
    }
  }

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country)
    if (country) {
      setSelectedRegion(null) // Clear region when country is selected
    }
  }

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">RiskVector Professional</h1>
            <p className="text-gray-400">Real-time Global Threat Intelligence</p>
          </div>
          
          {/* Push Notification Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                permission === 'granted' ? 'bg-green-400' : 
                permission === 'denied' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></span>
              <span className="text-sm text-gray-400">
                {permission === 'granted' ? 'Benachrichtigungen aktiv' : 
                 permission === 'denied' ? 'Benachrichtigungen blockiert' : 
                 'Benachrichtigungen anfragen'}
              </span>
            </div>
            
            {permission === 'default' && (
              <button
                onClick={() => requestPermission()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Aktivieren
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
          {/* Geo Filter */}
          <GeoFilter
            onRegionChange={handleRegionChange}
            onCountryChange={handleCountryChange}
            selectedRegion={selectedRegion}
            selectedCountry={selectedCountry}
          />

          {/* Filter Summary */}
          <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Aktiver Filter</h3>
            {selectedRegion && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Region:</span>
                <span className="text-sm font-medium text-blue-400">{selectedRegion}</span>
              </div>
            )}
            {selectedCountry && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Land:</span>
                <span className="text-sm font-medium text-green-400">{selectedCountry}</span>
              </div>
            )}
            {!selectedRegion && !selectedCountry && (
              <div className="text-sm text-gray-400">Kein Filter aktiv</div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Statistik</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Gesamte Alerts:</span>
                <span className="text-sm font-medium">{alerts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Gefiltert:</span>
                <span className="text-sm font-medium">{filteredAlerts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Kritisch:</span>
                <span className="text-sm font-medium text-red-400">
                  {filteredAlerts.filter(a => a.severity === 'critical').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Alert Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {selectedRegion || selectedCountry ? 'Gefilterte Alerts' : 'Globale Alerts'}
              </h2>
              <div className="text-sm text-gray-400">
                Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
              </div>
            </div>
          </div>

          {/* Alert Feed */}
          <EnhancedAlertFeed 
            alerts={filteredAlerts as any}
            onSelectAlert={handleAlertSelect as any}
          />

          {/* Source Verification Panel */}
          {selectedAlert && (
            <div className="mt-8">
              <SourceVerification sources={(selectedAlert as any)?.sources} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard