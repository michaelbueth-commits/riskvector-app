'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import RiskScoreCard from '@/components/RiskScoreCard'
import AlertFeed from '@/components/AlertFeed'
import CountrySelector from '@/components/CountrySelector'

// Dynamically import Leaflet components (client-side only)
const RiskMap = dynamic(() => import('@/components/RiskMap'), { ssr: false })

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState('Germany')
  const [riskData, setRiskData] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch initial data
    fetchRiskData(selectedCountry)
    fetchAlerts()
  }, [selectedCountry])

  const fetchRiskData = async (country: string) => {
    try {
      const res = await fetch(`/api/risk/${country}`)
      const data = await res.json()
      setRiskData(data)
    } catch (error) {
      console.error('Failed to fetch risk data:', error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts')
      const data = await res.json()
      setAlerts(data.alerts || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-slate-900">RiskVector</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Monitoring Active</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Global Risk Dashboard</h1>
          <p className="text-slate-600">Real-time threat monitoring across 195 countries</p>
        </div>

        {/* Country Selector */}
        <div className="mb-6">
          <CountrySelector 
            selectedCountry={selectedCountry} 
            onCountryChange={setSelectedCountry} 
          />
        </div>

        {/* Risk Overview Cards */}
        {riskData && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            <RiskScoreCard 
              title="Overall Risk" 
              score={riskData.overall} 
              trend={riskData.trends?.overall}
              icon="🛡️"
            />
            <RiskScoreCard 
              title="Weather" 
              score={riskData.weather} 
              trend={riskData.trends?.weather}
              icon="⛈️"
            />
            <RiskScoreCard 
              title="Political" 
              score={riskData.political} 
              trend={riskData.trends?.political}
              icon="🏛️"
            />
            <RiskScoreCard 
              title="Health" 
              score={riskData.health} 
              trend={riskData.trends?.health}
              icon="🏥"
            />
            <RiskScoreCard 
              title="Infrastructure" 
              score={riskData.infrastructure} 
              trend={riskData.trends?.infrastructure}
              icon="⚡"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Map - Takes 2 columns */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Global Risk Map</h2>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <RiskMap alerts={alerts} selectedCountry={selectedCountry} />
              </div>
            </div>
          </div>

          {/* Alert Feed - Takes 1 column */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Live Alerts</h2>
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {alerts.length} Active
                </span>
              </div>
              <AlertFeed alerts={alerts} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Country-specific Details */}
        {riskData && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {selectedCountry} - Risk Details
            </h2>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Recent Events</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {riskData.recentEvents?.slice(0, 5).map((event: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      {event.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Advisory Level</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  riskData.advisoryLevel === 'low' ? 'bg-green-100 text-green-700' :
                  riskData.advisoryLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  riskData.advisoryLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {riskData.advisoryLevel?.toUpperCase()}
                </div>
                <p className="text-sm text-slate-600 mt-2">{riskData.advisoryText}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Emergency Contacts</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>🚨 Emergency: {riskData.emergencyNumber || '112'}</li>
                  <li>🏛️ Embassy: {riskData.embassyContact || 'Check local embassy'}</li>
                  <li>🏥 Medical: {riskData.medicalAssistance || 'Local hospitals'}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Risk Trends (30 days)</h3>
                <div className="h-24 flex items-end gap-1">
                  {riskData.trendHistory?.map((value: number, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-1 bg-blue-200 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
