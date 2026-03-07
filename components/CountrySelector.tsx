'use client'

import { useState, useRef, useEffect } from 'react'

interface CountrySelectorProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const popularCountries = [
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'China', flag: '🇨🇳' },
]

export default function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountryData = popularCountries.find(c => c.name === selectedCountry)

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

  const filteredCountries = popularCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:border-white/20 hover:bg-white/10 transition-all min-w-[220px] group"
      >
        <span className="text-2xl">{selectedCountryData?.flag || '🌍'}</span>
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
        <div className="absolute top-full left-0 mt-2 bg-[#18181B] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[280px] overflow-hidden animate-fade-in-up">
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredCountries.map((country) => (
              <button
                key={country.name}
                onClick={() => {
                  onCountryChange(country.name)
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${country.name === selectedCountry 
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
                {country.name === selectedCountry && (
                  <svg className="w-4 h-4 ml-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            
            {filteredCountries.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <span className="text-2xl mb-2 block">🔍</span>
                No countries found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <p className="text-xs text-gray-500 text-center">
              {popularCountries.length} regions monitored worldwide
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
