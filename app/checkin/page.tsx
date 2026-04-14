'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface CheckinHistory {
  country: string
  city: string
  message: string
  timestamp: string
  shareText: string
}

interface Contact {
  name: string
  phone: string
}

function CheckinContent() {
  const searchParams = useSearchParams()
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [message, setMessage] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<CheckinHistory[]>([])
  const [showContacts, setShowContacts] = useState(false)

  useEffect(() => {
    try {
      const c = localStorage.getItem('rv_contacts')
      if (c) setContacts(JSON.parse(c))
    } catch {}
    try {
      const h = localStorage.getItem('rv_checkin_history')
      if (h) setHistory(JSON.parse(h))
    } catch {}
  }, [])

  const saveContacts = (c: Contact[]) => {
    setContacts(c)
    localStorage.setItem('rv_contacts', JSON.stringify(c))
  }

  const addContact = () => {
    if (contactName.trim() && contactPhone.trim()) {
      saveContacts([...contacts, { name: contactName.trim(), phone: contactPhone.trim() }])
      setContactName('')
      setContactPhone('')
    }
  }

  const removeContact = (i: number) => {
    saveContacts(contacts.filter((_, idx) => idx !== i))
  }

  const submitCheckin = async () => {
    if (!country.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: country.trim(), city: city.trim(), message: message.trim() }),
      })
      if (r.ok) {
        const data = await r.json()
        setResult(data)
        const entry: CheckinHistory = {
          country: country.trim(),
          city: city.trim(),
          message: message.trim(),
          timestamp: data.timestamp,
          shareText: data.shareText,
        }
        const newHistory = [entry, ...history].slice(0, 20)
        setHistory(newHistory)
        localStorage.setItem('rv_checkin_history', JSON.stringify(newHistory))
      }
    } catch {}
    setLoading(false)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Kopiert!')
  }

  const useGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
            if (r.ok) {
              const data = await r.json()
              setCity(data.address?.city || data.address?.town || '')
              setCountry(data.address?.country || '')
            }
          } catch {}
        },
        () => alert('Standort konnte nicht ermittelt werden.')
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#030714]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
              🛡️ Risk<span className="text-indigo-400">Vector</span>
            </Link>
            <span className="text-emerald-400 font-bold text-sm">🛡️ Check-in</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/watchlist" className="text-xs text-slate-400 hover:text-white transition">⭐ Watchlist</Link>
            <Link href="/dashboard" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🛡️ Ich bin sicher!</h1>
          <p className="text-slate-400">Teile deinen Status mit Freunden & Familie</p>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">📍 Land *</label>
                <div className="flex gap-2">
                  <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="z.B. Turkey" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                  <button onClick={useGeolocation} className="bg-white/5 border border-white/10 rounded-xl px-3 text-slate-400 hover:text-white hover:bg-white/10 transition" title="GPS">📍</button>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">🏙️ Stadt</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="z.B. Istanbul" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">💬 Nachricht</label>
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="z.B. Alles gut hier!" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>

              <button onClick={() => setShowContacts(!showContacts)} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                {showContacts ? '▼' : '▶'} Notfallkontakte ({contacts.length})
              </button>

              {showContacts && (
                <div className="space-y-2 border-t border-white/5 pt-3">
                  {contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 text-sm">
                      <span className="text-slate-300">{c.name} — {c.phone}</span>
                      <button onClick={() => removeContact(i)} className="text-slate-600 hover:text-red-400">✕</button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Name" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Telefon" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                    <button onClick={addContact} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-500">+</button>
                  </div>
                </div>
              )}

              <button onClick={submitCheckin} disabled={!country.trim() || loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50">
                {loading ? '...' : '🛡️ Check-in erstellen'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <div className="text-xl font-bold text-emerald-400 mb-2">Check-in erstellt!</div>
              <div className="bg-white/[0.03] rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap text-left mb-4">{result.shareText}</div>
              <div className="grid grid-cols-2 gap-2">
                <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600/20 border border-green-600/30 rounded-xl py-3 text-sm text-green-400 hover:bg-green-600/30 transition text-center">💬 WhatsApp</a>
                <a href={result.telegramUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600/20 border border-blue-600/30 rounded-xl py-3 text-sm text-blue-400 hover:bg-blue-600/30 transition text-center">✈️ Telegram</a>
                <a href={result.emailUrl} className="bg-amber-600/20 border border-amber-600/30 rounded-xl py-3 text-sm text-amber-400 hover:bg-amber-600/30 transition text-center">📧 Email</a>
                <button onClick={() => copyText(result.shareText)} className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition">📋 Kopieren</button>
              </div>
              <button onClick={() => setResult(null)} className="mt-4 text-sm text-slate-500 hover:text-white transition">Neuer Check-in</button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">📅 Letzte Check-ins</h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((h, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">📍 {h.city ? `${h.city}, ` : ''}{h.country}</span>
                    <span className="text-slate-600">{new Date(h.timestamp).toLocaleString('de-DE')}</span>
                  </div>
                  {h.message && <div className="text-slate-500 text-xs mt-1">💬 {h.message}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-500">Laden...</div>}>
      <CheckinContent />
    </Suspense>
  )
}
