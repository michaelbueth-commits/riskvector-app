'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import RiskScoreCard from '@/components/RiskScoreCard'
import AlertFeed from '@/components/AlertFeed'
import CountrySelector from '@/components/CountrySelector'
import ThemeToggle from '@/components/ThemeToggle'
import useGeolocation from '@/hooks/useGeolocation'
import { geocodeCity } from '@/lib/geocodingService'
import { RealAlert } from '@/lib/alertsService'
import { useDebounce } from 'use-debounce';

// Dynamically import Leaflet components (client-side only)
const RiskMap = dynamic(() => import('@/components/RiskMap'), { ssr: false })

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState('Germany')
  const [selectedCity, setSelectedCity] = useState('')
  const [riskData, setRiskData] = useState<any>(null)
  const [alerts, setAlerts] = useState<RealAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const userLocation = useGeolocation()
  
  const [debouncedCity] = useDebounce(selectedCity, 1000); // Debounce city input

  useEffect(() => {
    // Set country and city from geolocation once available
    if (userLocation.country && !riskData) { // Only on initial load
      setSelectedCountry(userLocation.country);
      if (userLocation.city !== 'Unknown') {
        setSelectedCity(userLocation.city);
      }
    }
  }, [userLocation, riskData]);

  // Main data fetching logic
  const fetchData = useCallback(async (country: string, city: string) => {
    setIsLoading(true);

    // Fetch risk data for the country
    const riskRes = await fetch(`/api/risk/${country}`);
    const riskJson = await riskRes.json();
    setRiskData(riskJson);

    // If a city is specified, geocode it and fetch local alerts
    if (city) {
      setIsGeocoding(true);
      const geoResult = await geocodeCity(city, riskJson.countryCode);
      setIsGeocoding(false);
      
      if (geoResult) {
        // Here you would typically fetch alerts based on coordinates
        // For now, we'll continue to filter the global alerts for demo purposes
        // In a real app, this would be: fetchAlertsForCoordinates(geoResult.lat, geoResult.lon)
      }
    }
    
    // Fetch all alerts to be filtered on the client
    const alertsRes = await fetch('/api/alerts');
    const alertsJson = await alertsRes.json();
    setAlerts(alertsJson.alerts || []);
    
    setIsLoading(false);
  }, []);

  // Trigger data fetch when country or debounced city changes
  useEffect(() => {
    fetchData(selectedCountry, debouncedCity);
  }, [selectedCountry, debouncedCity, fetchData]);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Filter alerts for the selected location (country and city)
  const locationAlerts = alerts.filter(alert => {
    const alertCountry = alert.country?.toLowerCase() || ''
    const alertLocation = alert.location?.toLowerCase() || ''
    const countryMatch = alertCountry === selectedCountry.toLowerCase();
    
    if (!debouncedCity) {
      return countryMatch;
    }
    
    // If city is specified, check if it's in the location string
    return countryMatch && alertLocation.includes(debouncedCity.toLowerCase());
  })

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
              <a 
                href={`/api/risk/${selectedCountry}/emergency`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition text-red-400 hover:text-red-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Emergency Contacts</span>
              </a>
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

        {/* Country Selector & City Search */}
        <div className="mb-6">
          <CountrySelector 
            selectedCountry={selectedCountry} 
            onCountryChange={setSelectedCountry}
            city={selectedCity}
            onCityChange={setSelectedCity}
            isGeocoding={isGeocoding}
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
                  <p className="text-xs text-gray-500 mt-1">Showing alerts for {debouncedCity || selectedCountry}</p>
                </div>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  locationAlerts.length > 0
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${locationAlerts.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                  {locationAlerts.length} Active
                </span>
              </div>
              <AlertFeed alerts={locationAlerts} isLoading={isLoading} />
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Emergency Contacts</h3>
                  <a 
                    href={riskData.emergencyContacts?.url || `/api/risk/${selectedCountry}/emergency`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition border border-red-500/30"
                  >
                    View All →
                  </a>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>🚨</span>
                      <span>Emergency</span>
                    </div>
                    <span className="font-mono text-red-400">{riskData.emergencyNumber || '112'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>🏛️</span>
                      <span>Embassy</span>
                    </div>
                    <span className="text-xs text-gray-500">View details</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>🏥</span>
                      <span>Medical</span>
                    </div>
                    <span className="text-xs text-gray-500">Local hospitals</span>
                  </div>
                </div>
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
