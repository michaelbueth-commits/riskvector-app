'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import RiskScoreCard from '@/components/RiskScoreCard'
import AlertFeed from '@/components/AlertFeed'
import CountrySelector from '@/components/CountrySelector'
import ThemeToggle from '@/components/ThemeToggle'

// Dynamically import Leaflet components (client-side only)
const RiskMap = dynamic(() => import('@/components/RiskMap'), { ssr: false })

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState('Germany')
  const [riskData, setRiskData] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchRiskData(selectedCountry)
    fetchAlerts()
  }, [selectedCountry])

  // Filter alerts for selected country
  const countryAlerts = alerts.filter(alert => {
    const alertCountry = alert.country?.toLowerCase() || ''
    const alertLocation = alert.location?.toLowerCase() || ''
    const selected = selectedCountry.toLowerCase()
    
    // Match if country name appears in alert country or location
    return alertCountry.includes(selected) || 
           alertLocation.includes(selected) ||
           selected.includes(alertCountry)
  })

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
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shadow-glow-gold">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">RiskVector</span>
              </div>
            </div>

            {/* Center Info */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-gray-400">Live Monitoring Active</span>
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {' '}
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="p-2 rounded-lg hover:bg-white/5 transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="btn-gold text-sm text-black">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Global Risk Dashboard</h1>
          <p className="text-gray-400">Real-time threat monitoring across 195 countries</p>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <RiskScoreCard 
              title="Overall Risk" 
              score={riskData.overall} 
              trend={riskData.trends?.overall}
              icon="🛡️"
              primary
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
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Map - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="card-glass h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Global Risk Map</h2>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="h-[500px] rounded-xl overflow-hidden bg-black/20">
                <RiskMap alerts={alerts} selectedCountry={selectedCountry} />
              </div>
            </div>
          </div>

          {/* Alert Feed - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="card-glass h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Live Alerts</h2>
                  <p className="text-xs text-gray-500 mt-1">Showing alerts for {selectedCountry}</p>
                </div>
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  {countryAlerts.length} Active
                </span>
              </div>
              <AlertFeed alerts={countryAlerts} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Country-specific Details */}
        {riskData && (
          <div className="card-glass">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {selectedCountry} — Risk Analysis
              </h2>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                riskData.advisoryLevel === 'low' ? 'risk-bg-low risk-low' :
                riskData.advisoryLevel === 'medium' ? 'risk-bg-medium risk-medium' :
                riskData.advisoryLevel === 'high' ? 'risk-bg-high risk-high' :
                'risk-bg-critical risk-critical'
              }`}>
                {riskData.advisoryLevel?.toUpperCase()} RISK
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Recent Events */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Events</h3>
                <ul className="space-y-2">
                  {riskData.recentEvents?.slice(0, 4).map((event: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-gray-300">{event.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advisory */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Advisory</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{riskData.advisoryText}</p>
              </div>

              {/* Emergency Contacts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Emergency Contacts</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <span>🚨</span>
                    <span>Emergency: {riskData.emergencyNumber || '112'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span>🏛️</span>
                    <span>Embassy: {riskData.embassyContact || 'Check local'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span>🏥</span>
                    <span>Medical: {riskData.medicalAssistance || 'Local hospitals'}</span>
                  </li>
                </ul>
              </div>

              {/* Trend Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">30-Day Trend</h3>
                <div className="h-20 flex items-end gap-1">
                  {riskData.trendHistory?.map((value: number, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{ 
                        height: `${value}%`,
                        background: value > 70 ? 'linear-gradient(to top, #EF4444, #F87171)' :
                                   value > 40 ? 'linear-gradient(to top, #F59E0B, #FBBF24)' :
                                   'linear-gradient(to top, #10B981, #34D399)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Countries Monitored', value: '195', icon: '🌍' },
            { label: 'Active Alerts', value: alerts.length.toString(), icon: '⚠️' },
            { label: 'Data Sources', value: '50+', icon: '📡' },
            { label: 'Last Update', value: 'Just now', icon: '⚡' },
          ].map((stat, i) => (
            <div key={i} className="card-premium py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span>© 2026 RiskVector.app</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  )
}
