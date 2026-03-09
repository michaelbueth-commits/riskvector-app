'use client'

import { useState, useEffect } from 'react'

interface LocationData {
  id: string
  country: string
  city?: string
  addedAt: string
  lastAccessed: string
}

interface UserProfile {
  id: string
  name?: string
  savedLocations: LocationData[]
  activeLocation: {
    country: string
    city?: string
  }
}

const STORAGE_KEY = 'riskvector-user-profile'
const MAX_LOCATIONS = 6

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY)
      if (savedProfile) {
        const parsedProfile: UserProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: 'default-user',
          savedLocations: [],
          activeLocation: {
            country: 'Germany',
            city: ''
          }
        }
        setProfile(defaultProfile)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile))
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      } catch (error) {
        console.error('Error saving user profile:', error)
      }
    }
  }, [profile])

  const addLocation = (country: string, city?: string) => {
    if (!profile) return false

    // Check if location already exists
    const existingIndex = profile.savedLocations.findIndex(
      loc => loc.country === country && loc.city === city
    )

    const newLocation: LocationData = {
      id: Date.now().toString(),
      country,
      city,
      addedAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    }

    let updatedLocations: LocationData[]

    if (existingIndex >= 0) {
      // Update existing location
      updatedLocations = [...profile.savedLocations]
      updatedLocations[existingIndex] = newLocation
    } else if (profile.savedLocations.length < MAX_LOCATIONS) {
      // Add new location
      updatedLocations = [...profile.savedLocations, newLocation]
    } else {
      // Replace oldest location
      updatedLocations = [...profile.savedLocations.slice(1), newLocation]
    }

    setProfile({
      ...profile,
      savedLocations: updatedLocations,
      activeLocation: { country, city }
    })

    return true
  }

  const removeLocation = (locationId: string) => {
    if (!profile) return

    const updatedLocations = profile.savedLocations.filter(loc => loc.id !== locationId)
    
    // If we removed the active location, set to first available or default
    let newActiveLocation = profile.activeLocation
    if (profile.savedLocations.some(loc => loc.id === locationId && 
        loc.country === newActiveLocation.country && 
        loc.city === newActiveLocation.city)) {
      newActiveLocation = updatedLocations[0] ? 
        { country: updatedLocations[0].country, city: updatedLocations[0].city } :
        { country: 'Germany', city: '' }
    }

    setProfile({
      ...profile,
      savedLocations: updatedLocations,
      activeLocation: newActiveLocation
    })
  }

  const setActiveLocation = (country: string, city?: string) => {
    if (!profile) return

    // Update lastAccessed timestamp
    const updatedLocations = profile.savedLocations.map(loc => {
      if (loc.country === country && loc.city === city) {
        return { ...loc, lastAccessed: new Date().toISOString() }
      }
      return loc
    })

    setProfile({
      ...profile,
      savedLocations: updatedLocations,
      activeLocation: { country, city }
    })
  }

  const getActiveLocation = () => {
    return profile?.activeLocation || { country: 'Germany', city: '' }
  }

  const canAddMore = () => {
    return (profile?.savedLocations.length || 0) < MAX_LOCATIONS
  }

  return {
    profile,
    isLoading,
    addLocation,
    removeLocation,
    setActiveLocation,
    getActiveLocation,
    canAddMore,
    maxLocations: MAX_LOCATIONS
  }
}

export default useUserProfile