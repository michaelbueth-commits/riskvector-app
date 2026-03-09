'use client'

import { useState, useEffect } from 'react'
import { GlobalPoliceStation } from '@/lib/globalPoliceTypes'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Shield, 
  Building,
  Clock,
  ExternalLink,
  AlertCircle,
  Star
} from 'lucide-react'

interface PoliceStationCardProps {
  station: GlobalPoliceStation
  className?: string
}

export function PoliceStationCard({ station, className }: PoliceStationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'community': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'estimated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'headquarters': return <Building className="w-4 h-4" />
      case 'precinct': return <Shield className="w-4 h-4" />
      case 'substation': return <MapPin className="w-4 h-4" />
      case 'highway': return <AlertCircle className="w-4 h-4" />
      default: return <Building className="w-4 h-4" />
    }
  }

  return (
    <Card className={`hover:scale-[1.01] transition-all duration-300 cursor-pointer ${className}`}
          onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(station.type)}
            <div>
              <h3 className="font-semibold text-white">{station.name}</h3>
              <p className="text-sm text-gray-400">{station.city}, {station.country}</p>
            </div>
          </div>
          <Badge className={`${getReliabilityColor(station.reliability)} text-xs`}>
            {station.reliability}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3" />
          <span>{station.address.district ? `${station.address.district}, ` : ''}{station.city}</span>
          {station.address.coordinates && (
            <span className="text-blue-400">GPS Available</span>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-1 mb-3">
          {station.contact.emergency && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-mono">{station.contact.emergency}</span>
              <Badge className="text-xs bg-red-500/10 border-red-500/30 text-red-400">
                EMERGENCY
              </Badge>
            </div>
          )}
          {station.contact.nonEmergency && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone className="w-3 h-3" />
              <span className="font-mono">{station.contact.nonEmergency}</span>
            </div>
          )}
          {station.contact.website && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Globe className="w-3 h-3" />
              <a href={station.contact.website} target="_blank" rel="noopener noreferrer"
                 className="hover:underline" onClick={(e) => e.stopPropagation()}>
                Official Website
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </a>
            </div>
          )}
        </div>

        {/* Services */}
        {station.services.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {station.services.slice(0, isExpanded ? station.services.length : 3).map((service, index) => (
                <Badge key={index} className="text-xs bg-gray-700 border border-gray-500">
                  {service}
                </Badge>
              ))}
              {!isExpanded && station.services.length > 3 && (
                <Badge className="text-xs bg-gray-700 border border-gray-500">
                  +{station.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Additional Info (expanded) */}
        {isExpanded && (
          <div className="pt-3 border-t border-gray-700 space-y-2">
            {station.jurisdiction && (
              <div className="text-sm">
                <span className="text-gray-400">Jurisdiction: </span>
                <span className="text-white">{station.jurisdiction}</span>
              </div>
            )}
            {station.hours && (
              <div className="text-sm">
                <span className="text-gray-400">Hours: </span>
                <span className="text-white">{station.hours.monday || '24/7'}</span>
              </div>
            )}
            {station.address.street && (
              <div className="text-sm">
                <span className="text-gray-400">Address: </span>
                <span className="text-white">
                  {station.address.street}
                  {station.address.postalCode && `, ${station.address.postalCode}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Last updated: {new Date(station.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3" />
            <span>{station.type}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-xs"
          >
            {isExpanded ? 'Show Less' : 'Show Details'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

interface PoliceStationsListProps {
  stations: GlobalPoliceStation[]
  title?: string
  className?: string
}

export function PoliceStationsList({ stations, title = "Police Stations", className }: PoliceStationsListProps) {
  if (stations.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Building className="w-12 h-12 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-400">No police stations found</p>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        {title}
        <Badge className="border border-gray-500">{stations.length} stations</Badge>
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <PoliceStationCard 
            key={station.id} 
            station={station}
            className="h-fit"
          />
        ))}
      </div>
    </div>
  )
}

interface GlobalPoliceMapProps {
  stations: GlobalPoliceStation[]
  className?: string
}

export function GlobalPoliceMap({ stations, className }: GlobalPoliceMapProps) {
  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Global Police Stations Map
          <Badge className="border border-gray-500">{stations.length} locations</Badge>
        </h3>
        <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">Interactive Map</p>
            <p className="text-sm text-gray-600 mt-1">
              {stations.length} police stations worldwide
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Map integration coming soon
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Countries covered: {new Set(stations.map(s => s.countryCode)).size}</p>
          <p>Cities covered: {new Set(stations.map(s => `${s.city},${s.countryCode}`)).size}</p>
        </div>
      </div>
    </Card>
  )
}