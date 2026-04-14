'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'

type Severity = 'all' | 'high' | 'critical'
type Frequency = '15' | '30' | '60' | '360'

interface Settings {
  enabled: boolean
  severity: Severity
  frequency: Frequency
}

const DEFAULT: Settings = { enabled: false, severity: 'all', frequency: '30' }

function NotifContent() {
  const [settings, setSettings] = useState<Settings>(DEFAULT)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('rv_notif_settings')
    if (saved) setSettings(JSON.parse(saved))
    setPermission('Notification' in window ? Notification.permission : 'denied')
  }, [])

  const save = (s: Settings) => {
    setSettings(s)
    localStorage.setItem('rv_notif_settings', JSON.stringify(s))
  }

  const enableNotifs = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setPermission(perm)
    if (perm === 'granted') save({ ...settings, enabled: true })
  }

  const toggle = () => {
    if (!settings.enabled && permission !== 'granted') {
      enableNotifs()
    } else {
      save({ ...settings, enabled: !settings.enabled })
    }
  }

  const testNotif = () => {
    if (permission === 'granted') {
      new Notification('⚠️ RiskVector Test', { body: 'Benachrichtigungen funktionieren! 🎉', icon: '/icon-192.png' })
    }
  }

  if (!mounted) return <div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Laden...</div>

  return (
    <div className="min-h-screen bg-[#030714]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">🛡️ Risk<span className="text-indigo-400">Vector</span></Link>
            <span className="text-indigo-400 font-bold text-sm">🔔 Benachrichtigungen</span>
          </div>
          <Link href="/dashboard" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔔 Benachrichtigungen</h1>
        <p className="text-slate-400 mb-8">Erhalte Alerts bei Risikoänderungen deiner gespeicherten Reiseziele</p>

        <div className="space-y-6">
          {/* Toggle */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Push-Benachrichtigungen</h2>
                <p className="text-sm text-slate-400 mt-1">Browser-Benachrichtigungen für Risiko-Alerts</p>
              </div>
              <button onClick={toggle} className={`relative w-14 h-7 rounded-full transition-colors ${settings.enabled ? 'bg-indigo-600' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {permission === 'denied' && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-300">
                Benachrichtigungen wurden blockiert. Bitte in den Browser-Einstellungen erlauben.
              </div>
            )}
          </div>

          {/* Severity */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Alert-Schwelle</h2>
            <div className="grid grid-cols-3 gap-3">
              {([['all', 'Alle Alerts', '⚠️'], ['high', 'Hoch & Kritisch', '🟠'], ['critical', 'Nur Kritisch', '🔴']] as const).map(([val, label, icon]) => (
                <button key={val} onClick={() => save({ ...settings, severity: val })} className={`p-3 rounded-xl border text-sm font-medium transition ${settings.severity === val ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                  <div className="text-xl mb-1">{icon}</div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Prüffrequenz</h2>
            <div className="grid grid-cols-4 gap-3">
              {([['15', '15 Min'], ['30', '30 Min'], ['60', '1 Std'], ['360', '6 Std']] as const).map(([val, label]) => (
                <button key={val} onClick={() => save({ ...settings, frequency: val })} className={`p-3 rounded-xl border text-sm font-medium transition ${settings.frequency === val ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Test */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Test-Benachrichtigung</h2>
                <p className="text-sm text-slate-400 mt-1">Prüfe ob Benachrichtigungen funktionieren</p>
              </div>
              <button onClick={testNotif} disabled={permission !== 'granted'} className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed">
                🔔 Testen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Laden...</div>}>
      <NotifContent />
    </Suspense>
  )
}
