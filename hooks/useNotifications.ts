'use client'

import { useEffect, useRef } from 'react'

export function useNotificationPolling() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const check = async () => {
      const raw = localStorage.getItem('rv_notif_settings')
      if (!raw) return
      const settings = JSON.parse(raw)
      if (!settings.enabled) return

      const watchlist = localStorage.getItem('rv_watchlist')
      if (!watchlist) return
      const items = JSON.parse(watchlist)
      if (items.length === 0) return

      const countries = items.map((i: any) => i.country).join(',')
      const lastCheck = localStorage.getItem('rv_notif_last') || new Date(0).toISOString()

      try {
        const res = await fetch(`/api/notifications/check?countries=${encodeURIComponent(countries)}&since=${encodeURIComponent(lastCheck)}`)
        if (!res.ok) return
        const data = await res.json()
        localStorage.setItem('rv_notif_last', data.checkedAt)

        const severity = settings.severity || 'all'
        const filtered = (data.alerts || []).filter((a: any) => {
          if (severity === 'all') return true
          if (severity === 'high') return a.severity === 'high' || a.severity === 'critical'
          return a.severity === 'critical'
        })

        for (const alert of filtered.slice(0, 3)) {
          const n = new Notification('⚠️ RiskVector Alert', {
            body: `${alert.country}: ${alert.title}`,
            icon: '/icon-192.png',
            tag: `rv-${alert.country}-${alert.title}`.slice(0, 50),
          })
          n.onclick = () => window.open(`/dashboard?country=${encodeURIComponent(alert.country)}`, '_blank')
        }
      } catch {}
    }

    const startPolling = () => {
      const raw = localStorage.getItem('rv_notif_settings')
      if (!raw) return
      const settings = JSON.parse(raw)
      if (!settings.enabled) return

      const freq = (parseInt(settings.frequency) || 30) * 60 * 1000
      check()
      intervalRef.current = setInterval(check, freq)
    }

    startPolling()

    // Re-read settings periodically
    const settingsInterval = setInterval(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      startPolling()
    }, 60000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearInterval(settingsInterval)
    }
  }, [])
}
