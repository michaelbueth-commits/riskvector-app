'use client'

import { useState } from 'react'

interface CountrySelectorProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const popularCountries = [
  'Germany',
  'United States',
  'France',
  'United Kingdom',
  'Spain',
  'Italy',
  'Japan',
  'Australia',
  'Canada',
  'Brazil',
]

export default function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-300 transition min-w-[200px]"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">🌍</span>
          <span className="font-semibold text-slate-900">{selectedCountry}</span>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-80 overflow-y-auto">
          {popularCountries.map((country) => (
            <button
              key={country}
              onClick={() => {
                onCountryChange(country)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition ${
                country === selectedCountry ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
              }`}
            >
              {country}
            </button>
          ))}
          <div className="border-t border-slate-200 mt-2 pt-2 px-4">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
