'use client'

import { countries } from '@/lib/countries'
import { useEffect, useState } from 'react'

interface RiskMapProps {
  alerts: any[]
  selectedCountry: string
}

export default function RiskMap({ alerts, selectedCountry }: RiskMapProps) {
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik')

  useEffect(() => {
    const cd = countries.find(c => c.name === selectedCountry)
    if (cd) {
      const zoom = cd.continent === 'Europe' ? 4 : 3
      const delta = zoom === 4 ? 15 : 30
      const bbox = `${cd.lng - delta},${cd.lat - delta},${cd.lng + delta},${cd.lat + delta}`
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${cd.lat},${cd.lng}`)
    }
  }, [selectedCountry])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
      <iframe
        src={mapUrl}
        style={{ width: '100%', height: '100%', minHeight: '400px', border: 'none', borderRadius: '12px' }}
        loading="lazy"
        title={`Karte: ${selectedCountry}`}
        allowFullScreen
      />
    </div>
  )
}
