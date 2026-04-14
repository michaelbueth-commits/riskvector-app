'use client'
import { useState, useEffect } from 'react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    setOffline(!navigator.onLine)
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  if (!offline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-600 text-white text-center py-2 text-sm font-medium">
      ⚠️ Offline-Modus — Zeigt zuletzt geladene Daten
    </div>
  )
}
