'use client'

import { useState, useRef, useEffect } from 'react'
import { countries } from '@/lib/countries'

interface CountrySelectorProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

export default function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountryData = countries.find(c => c.name === selectedCountry)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter countries based on search
  const filteredCountries = searchQuery 
    ? countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries

  // Group countries by continent
  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = []
    }
    acc[country.continent].push(country)
    return acc
  }, {} as Record<string, typeof countries>)

  const continentOrder = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania']

  // Get flag emoji from country code
  const getFlag = (code: string) => {
    return code
      .toUpperCase()
      .replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt(0))
      )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:border-white/20 hover:bg-white/10 transition-all min-w-[240px] group"
      >
        <span className="text-2xl">{selectedCountryData ? getFlag(selectedCountryData.code) : '🌍'}</span>
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Selected Region</div>
          <div className="font-semibold text-white">{selectedCountry}</div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-500' : 'group-hover:text-white'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#18181B] border border-white/10 rounded-xl shadow-2xl z-50 w-[360px] max-h-[480px] overflow-hidden animate-fade-in-up">
          {/* Search */}
          <div className="p-3 border-b border-white/10 sticky top-0 bg-[#18181B] z-10">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 195 countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-[350px]">
            {continentOrder.map(continent => {
              const continentCountries = groupedCountries[continent]
              if (!continentCountries || continentCountries.length === 0) return null
              
              return (
                <div key={continent}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white/5 sticky top-0">
                    {continent} ({continentCountries.length})
                  </div>
                  {continentCountries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onCountryChange(country.name)
                        setIsOpen(false)
                        setSearchQuery('')
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 text-left transition-colors
                        ${country.name === selectedCountry 
                          ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-xl">{getFlag(country.code)}</span>
                      <span className="font-medium flex-1">{country.name}</span>
                      <span className="text-xs text-gray-600">{country.code}</span>
                      {country.name === selectedCountry && (
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )
            })}
            
            {filteredCountries.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <span className="text-2xl mb-2 block">🔍</span>
                No countries found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <p className="text-xs text-gray-500 text-center">
              {countries.length} countries and territories monitored worldwide
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
