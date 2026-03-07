'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface RiskMapProps {
  alerts: any[]
  selectedCountry: string
}

export default function RiskMap({ alerts, selectedCountry }: RiskMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 4)

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || alerts.length === 0) return

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers for each alert
    alerts.forEach((alert) => {
      if (alert.lat && alert.lng) {
        const color = 
          alert.type === 'critical' ? '#ef4444' :
          alert.type === 'high' ? '#f97316' :
          alert.type === 'medium' ? '#eab308' :
          '#3b82f6'

        const marker = L.circleMarker([alert.lat, alert.lng], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapRef.current!)

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${alert.title}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${alert.description}</p>
            <div style="font-size: 11px; color: #888;">
              <div>📍 ${alert.location}</div>
              <div>🕐 ${alert.timestamp}</div>
            </div>
          </div>
        `)
      }
    })
  }, [alerts])

  useEffect(() => {
    if (!mapRef.current || !selectedCountry) return

    // Zoom to country (simplified - would use GeoJSON in production)
    const countryCoords: Record<string, [number, number, number]> = {
      'Germany': [51.1657, 10.4515, 6],
      'United States': [37.0902, -95.7129, 4],
      'France': [46.2276, 2.2137, 6],
      'United Kingdom': [55.3781, -3.4360, 6],
      'Spain': [40.4637, -3.7492, 6],
      'Italy': [41.8719, 12.5674, 6],
      'Japan': [36.2048, 138.2529, 6],
      'Australia': [-25.2744, 133.7751, 4],
      'Canada': [56.1304, -106.3468, 4],
      'Brazil': [-14.2350, -51.9253, 4],
    }

    const coords = countryCoords[selectedCountry]
    if (coords) {
      mapRef.current.flyTo([coords[0], coords[1]], coords[2], {
        duration: 1.5
      })
    }
  }, [selectedCountry])

  return <div ref={mapContainerRef} className="w-full h-full" />
}
