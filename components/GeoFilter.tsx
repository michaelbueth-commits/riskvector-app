'use client'

import { useState, useEffect } from 'react'
import { Country, Region } from '../types/countries'
import { countries } from '../types/countries'

interface GeoFilterProps {
  onRegionChange: (region: string | null) => void
  onCountryChange: (country: string | null) => void
  selectedRegion: string | null
  selectedCountry: string | null
}

export default function GeoFilter({ 
  onRegionChange, 
  onCountryChange, 
  selectedRegion, 
  selectedCountry 
}: GeoFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [regions] = useState([
    { id: 'europe', name: 'Europa', countries: 44 },
    { id: 'asia', name: 'Asien', countries: 48 },
    { id: 'americas', name: 'Amerikas', countries: 35 },
    { id: 'africa', name: 'Afrika', countries: 54 },
    { id: 'oceania', name: 'Ozeanien', countries: 14 },
    { id: 'middle-east', name: 'Naher Osten', countries: 18 }
  ])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">🌍</span>
        Geografischer Filter
      </h3>
      
      {/* Regions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Regionen</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => onRegionChange(selectedRegion === region.id ? null : region.id)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === region.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div>{region.name}</div>
              <div className="text-xs opacity-75">{region.countries} Länder</div>
            </button>
          ))}
        </div>
      </div>

      {/* Country Search */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Länder-Suche</h4>
        <input
          type="text"
          placeholder="Land suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Countries List */}
      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredCountries.slice(0, 20).map(country => (
            <button
              key={country.code}
              onClick={() => onCountryChange(selectedCountry === country.code ? null : country.code)}
              className={`p-3 rounded-lg text-left transition-colors ${
                selectedCountry === country.code
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-medium">{country.name}</div>
              <div className="text-xs opacity-75">{country.code} • {country.region}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedRegion || selectedCountry) && (
        <button
          onClick={() => {
            onRegionChange(null)
            onCountryChange(null)
          }}
          className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Filter zurücksetzen
        </button>
      )}
    </div>
  )
}

