'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Clock, MapPin, AlertTriangle, RefreshCw } from 'lucide-react'
import { RealAlert } from '@/lib/alertsService'

interface AdvancedFiltersProps {
  alerts: RealAlert[]
  onFiltered: (filtered: RealAlert[]) => void
  totalResults: number
}

interface FilterState {
  search: string
  severity: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL')[]
  type: ('CONFLICT' | 'HEALTH' | 'WEATHER' | 'POLITICAL' | 'INFRASTRUCTURE')[]
  dateRange: {
    start: string
    end: string
  }
  country: string
  city: string
}

export default function AdvancedFilters({ alerts, onFiltered, totalResults }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    severity: [],
    type: [],
    dateRange: {
      start: '',
      end: ''
    },
    country: '',
    city: ''
  })

  const applyFilters = () => {
    let filtered = [...alerts]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.location.toLowerCase().includes(searchLower)
      )
    }

    // Severity filter
    if (filters.severity.length > 0) {
      filtered = filtered.filter(alert => 
        filters.severity.includes(alert.severity as any)
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(alert => 
        filters.type.includes(alert.type as any)
      )
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start)
      filtered = filtered.filter(alert => 
        new Date(alert.timestamp) >= startDate
      )
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(alert => 
        new Date(alert.timestamp) <= endDate
      )
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(alert => 
        alert.country.toLowerCase().includes(filters.country.toLowerCase())
      )
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(alert => 
        alert.location.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    onFiltered(filtered)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      severity: [],
      type: [],
      dateRange: { start: '', end: '' },
      country: '',
      city: ''
    })
    onFiltered(alerts)
  }

  const toggleSeverity = (severity: FilterState['severity'][0]) => {
    setFilters(prev => ({
      ...prev,
      severity: prev.severity.includes(severity)
        ? prev.severity.filter(s => s !== severity)
        : [...prev.severity, severity]
    }))
  }

  const toggleType = (type: FilterState['type'][0]) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }))
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : 
    typeof value === 'object' ? Object.values(value).some(v => v !== '') : 
    value !== ''
  )

  return (
    <Card className="mb-4">
      <div className="p-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search alerts by title, description, or location..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Button 
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge className="ml-1 bg-blue-500 text-white">{getActiveFilterCount(filters)}</Badge>
            )}
          </Button>
          <Button onClick={applyFilters} className="bg-blue-500 hover:bg-blue-600">
            Apply
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="ghost">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{totalResults} alerts total</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Advanced Filter Panel */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Severity Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Severity
                </h4>
                <div className="flex flex-wrap gap-1">
                  {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL'].map(severity => (
                    <button
                      key={severity}
                      onClick={() => toggleSeverity(severity as any)}
                      className={`px-2 py-1 rounded text-xs transition ${
                        filters.severity.includes(severity as any)
                          ? getSeverityColor(severity) + ' text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Type</h4>
                <div className="flex flex-wrap gap-1">
                  {['CONFLICT', 'HEALTH', 'WEATHER', 'POLITICAL', 'INFRASTRUCTURE'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type as any)}
                      className={`px-2 py-1 rounded text-xs transition ${
                        filters.type.includes(type as any)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Date Range
                </h4>
                <div className="space-y-1">
                  <input
                    type="date"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                  />
                  <input
                    type="date"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Location Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </h4>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function getActiveFilterCount(filters: FilterState): number {
  let count = 0
  if (filters.search) count++
  if (filters.severity.length > 0) count++
  if (filters.type.length > 0) count++
  if (filters.dateRange.start || filters.dateRange.end) count++
  if (filters.country) count++
  if (filters.city) count++
  return count
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-600'
    case 'HIGH': return 'bg-orange-600'
    case 'MEDIUM': return 'bg-yellow-600'
    case 'LOW': return 'bg-green-600'
    case 'MINIMAL': return 'bg-blue-600'
    default: return 'bg-gray-600'
  }
}