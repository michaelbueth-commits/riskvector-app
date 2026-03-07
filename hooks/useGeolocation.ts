'use client'

import { useState, useEffect } from 'react'

interface GeolocationData {
  country: string
  city: string
  lat: number
  lng: number
  error: string | null
}

const useGeolocation = (): GeolocationData => {
  const [data, setData] = useState<GeolocationData>({
    country: '',
    city: '',
    lat: 0,
    lng: 0,
    error: null,
  })

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if location was already determined
    const storedLocation = sessionStorage.getItem('userLocation');
    if (storedLocation) {
      setData(JSON.parse(storedLocation));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use OpenStreetMap Nominatim for reverse geocoding (no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          
          if (!response.ok) {
            throw new Error('Reverse geocoding failed')
          }
          
          const locationData = await response.json()
          const country = locationData.address?.country || 'Unknown'
          const city = locationData.address?.city || locationData.address?.town || locationData.address?.village || 'Unknown'

          const result = { country, city, lat: latitude, lng: longitude, error: null }
          setData(result);
          sessionStorage.setItem('userLocation', JSON.stringify(result));

        } catch (error) {
          const result = { country: '', city: '', lat: 0, lng: 0, error: 'Could not determine location name.' }
          setData(result)
          sessionStorage.setItem('userLocation', JSON.stringify(result));
        }
      },
      (error) => {
        const result = { country: '', city: '', lat: 0, lng: 0, error: 'Geolocation permission denied.' }
        setData(result)
        sessionStorage.setItem('userLocation', JSON.stringify(result));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000 * 60 * 30, // Use cached location up to 30 mins old
      }
    )
  }, [])

  return data
}

export default useGeolocation;
