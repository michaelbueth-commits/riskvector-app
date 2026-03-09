'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useUserProfile from '@/hooks/useUserProfile'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, MapPin, Star, Trash2, Plus, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, isLoading, removeLocation, setActiveLocation } = useUserProfile()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-white">Error loading profile</div>
      </div>
    )
  }

  const handleSetLocation = (country: string, city?: string) => {
    setActiveLocation(country, city)
    router.push('/')
  }

  const handleDeleteLocation = (locationId: string) => {
    if (confirmDelete === locationId) {
      removeLocation(locationId)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(locationId)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const sortedLocations = [...profile.savedLocations].sort((a, b) => 
    new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
  )

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-lg font-bold tracking-tight">My Risk Profile</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Risk Locations</h1>
          <p className="text-gray-400">
            Your saved locations for quick access to risk intelligence. 
            {profile.savedLocations.length > 0 ? (
              <span> Tap any location to view detailed risk information.</span>
            ) : (
              <span> Add your first location to get started.</span>
            )}
          </p>
        </div>

        {/* Active Location Card */}
        <Card className="mb-6 border-2 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Currently Active</div>
                <div className="font-semibold">
                  {profile.activeLocation.city 
                    ? `${profile.activeLocation.city}, ${profile.activeLocation.country}`
                    : profile.activeLocation.country
                  }
                </div>
              </div>
            </div>
            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
              ACTIVE
            </Badge>
          </div>
        </Card>

        {/* Saved Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLocations.map((location) => (
            <Card key={location.id} className="group hover:scale-[1.01] transition-all duration-300">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {location.city ? `${location.city}, ${location.country}` : location.country}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Added {new Date(location.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleSetLocation(location.country, location.city)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                    >
                      {confirmDelete === location.id ? (
                        <span className="text-xs">Sure?</span>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>Last accessed {new Date(location.lastAccessed).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Add Location Card */}
          {profile.savedLocations.length < 6 && (
            <Card className="border-dashed border-white/20 hover:border-white/40 transition-colors">
              <div className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[120px]">
                <Plus className="w-8 h-8 text-gray-500 mb-2" />
                <div className="font-semibold text-white mb-1">Add Location</div>
                <p className="text-xs text-gray-500">
                  Save up to {6 - profile.savedLocations.length} more location{6 - profile.savedLocations.length > 1 ? 's' : ''}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Info Section */}
        {profile.savedLocations.length > 0 && (
          <Card className="mt-8 bg-blue-500/5 border-blue-500/20">
            <div className="p-4">
              <h3 className="font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-200">
                Your saved locations are automatically prioritized when you visit the dashboard. 
                The most recently accessed location appears at the top of your list.
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}