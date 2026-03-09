'use client'

import { useState, useEffect } from 'react'
import { GlobalPoliceReport } from '@/lib/globalPoliceTypes'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Globe, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  Filter,
  TrendingUp,
  Shield,
  Flag,
  Zap
} from 'lucide-react'

interface GlobalPoliceReportProps {
  report: GlobalPoliceReport
  className?: string
}

export function GlobalPoliceReportCard({ report, className }: GlobalPoliceReportProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'MINIMAL': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'TRAFFIC': '🚦',
      'ACCIDENT': '🚨',
      'THEFT': '💰',
      'BURGLARY': '🏠',
      'ASSAULT': '⚠️',
      'MISSING_PERSON': '🔍',
      'DRUGS': '💊',
      'FIRE': '🔥',
      'PUBLIC_ORDER': '👮',
      'FRAUD': '💳',
      'WEAPON': '🔫',
      'HOMICIDE': '☠️',
      'TERRORISM': '🎯',
      'NATURAL_DISASTER': '🌪️'
    }
    return icons[category] || '⚠️'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'JP': '🇯🇵',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'NL': '🇳🇱',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'AT': '🇦🇹',
      'SE': '🇸🇪',
      'NO': '🇳🇴',
      'DK': '🇩🇰',
      'FI': '🇫🇮',
      'IE': '🇮🇪',
      'PT': '🇵🇹',
      'GR': '🇬🇷',
      'TR': '🇹🇷',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'AR': '🇦🇷',
      'MX': '🇲🇽',
      'RU': '🇷🇺',
      'CN': '🇨🇳',
      'KR': '🇰🇷',
      'ZA': '🇿🇦',
      'EG': '🇪🇬',
      'MA': '🇲🇦',
      'NG': '🇳🇬',
      'KE': '🇰🇪',
      'TH': '🇹🇭',
      'VN': '🇻🇳',
      'MY': '🇲🇾',
      'SG': '🇸🇬',
      'ID': '🇮🇩',
      'PH': '🇵🇭',
      'PK': '🇵🇰',
      'BD': '🇧🇩',
      'LK': '🇱🇰',
      'NP': '🇳🇵',
      'MM': '🇲🇲',
      'KH': '🇰🇭',
      'LA': '🇱🇦',
      'MN': '🇲🇳',
      'UZ': '🇺🇿',
      'KZ': '🇰🇿',
      'KG': '🇰🇬',
      'TJ': '🇹🇯',
      'TM': '🇹🇲',
      'GE': '🇬🇪',
      'AM': '🇦🇲',
      'AZ': '🇦🇿',
      'IL': '🇮🇱',
      'SA': '🇸🇦',
      'AE': '🇦🇪',
      'QA': '🇶🇦',
      'KW': '🇰🇼',
      'BH': '🇧🇭',
      'OM': '🇴🇲',
      'JO': '🇯🇴',
      'LB': '🇱🇧',
      'SY': '🇸🇾',
      'IQ': '🇮🇶',
      'IR': '🇮🇷',
      'AF': '🇦🇫',
      'LV': '🇱🇻',
      'LT': '🇱🇹',
      'EE': '🇪🇪',
      'PL': '🇵🇱',
      'CZ': '🇨🇿',
      'SK': '🇸🇰',
      'HU': '🇭🇺',
      'RO': '🇷🇴',
      'BG': '🇧🇬',
      'HR': '🇭🇷',
      'SI': '🇸🇮',
      'BA': '🇧🇦',
      'ME': '🇲🇪',
      'RS': '🇷🇸',
      'MK': '🇲🇰',
      'AL': '🇦🇱',
      'XK': '🇽🇰',
      'MD': '🇲🇩',
      'UA': '🇺🇦',
      'BY': '🇧🇾',
      'AD': '🇦🇩',
      'MC': '🇲🇨',
      'LI': '🇱🇮',
      'LU': '🇱🇺'
    }
    return flags[countryCode] || '🌐'
  }

  return (
    <Card className={`hover:scale-[1.01] transition-all duration-300 cursor-pointer ${className}`}
          onClick={() => report.source.url && window.open(report.source.url, '_blank')}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(report.category)}</span>
            <div>
              <h3 className="font-semibold text-white text-sm">{report.title}</h3>
              <p className="text-xs text-gray-400">
                {getCountryFlag(report.location.countryCode)} {report.location.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${getSeverityColor(report.severity)} text-xs`}>
              {report.severity}
            </Badge>
            {report.verified && (
              <Shield className="w-3 h-3 text-green-400" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {report.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{report.source.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(report.timestamp)}</span>
            </div>
          </div>
          
          {report.source.url && (
            <ExternalLink className="w-3 h-3 text-gray-500" />
          )}
        </div>

        {/* Tags */}
        {report.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {report.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="text-xs bg-gray-700 border border-gray-500">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

interface GlobalPoliceFeedProps {
  reports: GlobalPoliceReport[]
  title?: string
  showHeader?: boolean
  className?: string
}

export function GlobalPoliceFeed({ reports, title = "Global Police Reports", showHeader = true, className }: GlobalPoliceFeedProps) {
  if (reports.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-400">No police reports found</p>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {title}
            <Badge className="border border-gray-500">{reports.length} reports</Badge>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>Live</span>
          </div>
        </div>
      )}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
        {reports.map((report) => (
          <GlobalPoliceReportCard 
            key={report.id} 
            report={report}
          />
        ))}
      </div>
    </div>
  )
}

interface GlobalPoliceStatsProps {
  stats: {
    totalStations: number
    totalReports: number
    countriesCovered: number
    citiesCovered: number
    lastUpdate: string
  }
  className?: string
}

export function GlobalPoliceStats({ stats, className }: GlobalPoliceStatsProps) {
  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Global Police Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.countriesCovered}</div>
            <div className="text-xs text-gray-400">Countries</div>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalStations}</div>
            <div className="text-xs text-gray-400">Police Stations</div>
          </div>
          
          <div className="bg-orange-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.totalReports}</div>
            <div className="text-xs text-gray-400">Reports</div>
          </div>
          
          <div className="bg-purple-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.citiesCovered}</div>
            <div className="text-xs text-gray-400">Cities Covered</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {new Date(stats.lastUpdate).toLocaleString()}</span>
            <span>Real-time global monitoring</span>
          </div>
        </div>
      </div>
    </Card>
  )
}