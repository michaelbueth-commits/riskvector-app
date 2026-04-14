'use client'
import { useEffect, useState } from 'react'

export default function PWAProvider() {
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Hide if already installed
    window.addEventListener('appinstalled', () => setShowInstall(false))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:max-w-sm backdrop-blur-xl bg-indigo-600/90 border border-indigo-400/30 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📲</span>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">RiskVector installieren</div>
          <div className="text-indigo-200 text-xs">Schneller Zugriff & Offline-Modus</div>
        </div>
        <button onClick={install} className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition">Installieren</button>
        <button onClick={() => setShowInstall(false)} className="text-white/60 hover:text-white text-lg ml-1">✕</button>
      </div>
    </div>
  )
}
