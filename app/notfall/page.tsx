'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { findCountry, EMERGENCY_DATA, type CountryEmergency } from '@/lib/emergency-data'

interface Facility {
  name: string
  type: string
  address: string
  phone: string
  lat: number
  lng: number
  distance: number
  openingHours?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

type Tab = 'numbers' | 'hospital' | 'pharmacy' | 'chat'

function getCountryList(): { name: string; key: string }[] {
  const seen = new Set<string>()
  return Object.entries(EMERGENCY_DATA)
    .map(([, v]) => ({ name: v.country, key: v.country }))
    .filter(x => {
      if (seen.has(x.key)) return false
      seen.add(x.key)
      return true
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function EmergencyContent() {
  const searchParams = useSearchParams()
  const [country, setCountry] = useState<CountryEmergency | null>(null)
  const [countryInput, setCountryInput] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('numbers')
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facLoading, setFacLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [geoLat, setGeoLat] = useState<number | null>(null)
  const [geoLng, setGeoLng] = useState<number | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load country from URL or localStorage
  useEffect(() => {
    const urlCountry = searchParams.get('country')
    const saved = localStorage.getItem('rv_emergency_country')
    const name = urlCountry || saved
    if (name) {
      const found = findCountry(name)
      if (found) {
        setCountry(found)
        if (!urlCountry) setCountryInput(found.country)
      }
    }
  }, [searchParams])

  // Save country to localStorage
  useEffect(() => {
    if (country) {
      localStorage.setItem('rv_emergency_country', country.country)
    }
  }, [country])

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem('rv_chat_history')
    if (saved) {
      try { setChatMessages(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Save chat history
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('rv_chat_history', JSON.stringify(chatMessages.slice(-50)))
    }
  }, [chatMessages])

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setGeoLat(pos.coords.latitude); setGeoLng(pos.coords.longitude) },
        () => {}
      )
    }
  }, [])

  // Fetch facilities when tab changes
  const fetchFacilities = useCallback(async (type: string) => {
    if (!country) return
    const lat = geoLat ?? country.coordinates.lat
    const lng = geoLng ?? country.coordinates.lng
    setFacLoading(true)
    try {
      const r = await fetch(`/api/emergency/facilities?lat=${lat}&lng=${lng}&type=${type}`)
      if (r.ok) {
        const data = await r.json()
        setFacilities(data.facilities || [])
      }
    } catch {}
    setFacLoading(false)
  }, [country, geoLat, geoLng])

  useEffect(() => {
    if (country && (activeTab === 'hospital' || activeTab === 'pharmacy')) {
      fetchFacilities(activeTab === 'hospital' ? 'hospital' : 'pharmacy')
    }
  }, [activeTab, country, fetchFacilities])

  // Chat scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const selectCountry = (name: string) => {
    const found = findCountry(name)
    if (found) {
      setCountry(found)
      setCountryInput(found.country)
    }
  }

  const sendMessage = async (text?: string) => {
    const msg = text || chatInput.trim()
    if (!msg || chatLoading) return
    setChatInput('')
    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    setChatMessages(prev => [...prev, userMsg])
    setChatLoading(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, country: country?.country }),
      })
      if (r.ok) {
        const data = await r.json()
        const aiMsg: ChatMessage = { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }
        setChatMessages(prev => [...prev, aiMsg])
      }
    } catch {}
    setChatLoading(false)
  }

  const quickActions = [
    { emoji: '🚨', label: 'Notruf', msg: 'Notrufnummern' },
    { emoji: '🏥', label: 'Krankenhaus', msg: 'Wo ist das nächste Krankenhaus?' },
    { emoji: '💊', label: 'Apotheke', msg: 'Ich brauche eine Apotheke' },
    { emoji: '🛡️', label: 'Botschaft', msg: 'Ich brauche die Botschaft' },
    { emoji: '🗣️', label: 'Übersetzung', msg: 'Übersetzung - wie sage ich auf der Landessprache dass ich Hilfe brauche?' },
  ]

  const filteredCountries = getCountryList().filter(c =>
    c.name.toLowerCase().includes(countryInput.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#030714]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
              🛡️ Risk<span className="text-indigo-400">Vector</span>
            </Link>
            <span className="text-red-400 font-bold text-sm">🆘 Notfall</span>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="pt-16 pb-4 px-4 max-w-5xl mx-auto">
        {/* Country selector */}
        {!country ? (
          <div className="py-20 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">🆘 Notfall-Hilfe</h1>
            <p className="text-slate-400 mb-8">Wähle dein Reiseland für Notfallinformationen</p>
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                value={countryInput}
                onChange={e => setCountryInput(e.target.value)}
                placeholder="Land suchen..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {countryInput && filteredCountries.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                  {filteredCountries.map(c => (
                    <button
                      key={c.key}
                      onClick={() => selectCountry(c.name)}
                      className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Country header */}
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold text-white">🆘 Notfall — {country.country}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    📱 Offline verfügbar
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setCountry(null); setCountryInput('') }}
                className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                Land wechseln
              </button>
            </div>

            {/* Emergency numbers - always visible */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a href={`tel:${country.general}`} className="bg-red-500/10 rounded-xl p-3 text-center hover:bg-red-500/20 transition">
                  <div className="text-xs text-red-300 mb-1">🚨 Notruf</div>
                  <div className="text-2xl font-bold text-red-400">{country.general}</div>
                </a>
                <a href={`tel:${country.police}`} className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition">
                  <div className="text-xs text-slate-400 mb-1">🚔 Polizei</div>
                  <div className="text-xl font-bold text-white">{country.police}</div>
                </a>
                <a href={`tel:${country.ambulance}`} className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition">
                  <div className="text-xs text-slate-400 mb-1">🚑 Rettungsdienst</div>
                  <div className="text-xl font-bold text-white">{country.ambulance}</div>
                </a>
                <a href={`tel:${country.fire}`} className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition">
                  <div className="text-xs text-slate-400 mb-1">🚒 Feuerwehr</div>
                  <div className="text-xl font-bold text-white">{country.fire}</div>
                </a>
              </div>
              {country.poisonControl && (
                <a href={`tel:${country.poisonControl.replace(/\s/g, '')}`} className="block mt-2 bg-white/5 rounded-xl p-2 text-center hover:bg-white/10 transition">
                  <span className="text-xs text-slate-400">🏥 Giftnotruf:</span>
                  <span className="text-lg font-bold text-white ml-2">{country.poisonControl}</span>
                </a>
              )}
            </div>

            {/* Embassy */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">🇩🇪 Deutsche Botschaft</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
                <div>📍 {country.germanEmbassy.address}</div>
                <div>
                  📞 <a href={`tel:${country.germanEmbassy.phone}`} className="text-indigo-400 hover:underline">{country.germanEmbassy.phone}</a>
                </div>
                <div>📧 <a href={`mailto:${country.germanEmbassy.email}`} className="text-indigo-400 hover:underline">{country.germanEmbassy.email}</a></div>
                <div>🕐 {country.germanEmbassy.hours}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4 overflow-x-auto">
              {([
                { key: 'numbers', label: '📞 Phrasen' },
                { key: 'hospital', label: '🏥 Krankenhaus' },
                { key: 'pharmacy', label: '💊 Apotheke' },
                { key: 'chat', label: '🤖 KI-Chat' },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'numbers' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">🗣️ Notfallphrasen in Landessprache</h3>
                {Object.entries(country.emergencyPhrases).map(([key, phrase]) => (
                  <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-sm text-slate-400 mb-1 capitalize">{key === 'allergic' ? 'Allergie' : key === 'lost' ? 'Verlaufen' : key === 'help' ? 'Hilfe' : key === 'police' ? 'Polizei' : key === 'pain' ? 'Schmerzen' : key}</div>
                    <div className="text-lg font-bold text-white mb-1">{phrase.local}</div>
                    <div className="text-sm text-indigo-400">Aussprache: {phrase.phonetic}</div>
                    <div className="text-xs text-slate-500 mt-1">🇩🇪 {phrase.german}</div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'hospital' || activeTab === 'pharmacy') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {activeTab === 'hospital' ? '🏥' : '💊'} Nächste {activeTab === 'hospital' ? 'Krankenhäuser' : 'Apotheken'}
                  {geoLat && <span className="text-xs text-slate-500 ml-2">(mit GPS-Distanz)</span>}
                </h3>
                {facLoading ? (
                  <div className="text-center py-8 text-slate-400">Suche {activeTab === 'hospital' ? 'Krankenhäuser' : 'Apotheken'}...</div>
                ) : facilities.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">Keine Ergebnisse gefunden. Versuche einen anderen Standort.</div>
                ) : (
                  <div className="space-y-2">
                    {facilities.map((f, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-white">{f.name}</div>
                            <div className="text-sm text-slate-400">{f.address}</div>
                            {f.phone && (
                              <a href={`tel:${f.phone}`} className="text-sm text-indigo-400 hover:underline">
                                📞 {f.phone}
                              </a>
                            )}
                            {f.openingHours && (
                              <div className="text-xs text-slate-500 mt-1">🕐 {f.openingHours}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-indigo-400">{f.distance} km</div>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-400 hover:underline"
                            >
                              Navigation ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col" style={{ height: 'calc(100vh - 420px)', minHeight: '300px' }}>
                {/* Disclaimer */}
                <div className="text-xs text-center text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-1.5 mb-2">
                  ⚠️ KI-Assistent — bei Notfällen immer zuerst den örtlichen Notruf wählen!
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-2 pr-1">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-8">
                      Stelle mir eine Frage — ich helfe dir bei Notfällen, Übersetzungen, Botschaftssuche und mehr.
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick actions */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
                  {quickActions.map(qa => (
                    <button
                      key={qa.label}
                      onClick={() => sendMessage(qa.msg)}
                      className="flex-shrink-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                      {qa.emoji} {qa.label}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
                    placeholder="Frage stellen..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!chatInput.trim() || chatLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-medium transition"
                  >
                    ➤
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function NotfallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030714] flex items-center justify-center text-slate-400">
        Lade Notfall-Seite...
      </div>
    }>
      <EmergencyContent />
    </Suspense>
  )
}
