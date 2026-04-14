'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar({ active }: { active?: string }) {
  const [watchlistCount, setWatchlistCount] = useState(0)

  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem('rv_watchlist')
        if (raw) setWatchlistCount(JSON.parse(raw).length)
      } catch {}
    }
    update()
    const interval = setInterval(update, 3000)
    return () => clearInterval(interval)
  }, [])

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/watchlist', label: '⭐', badge: watchlistCount },
    { href: '/checkin', label: '🛡️ Check-in' },
    { href: '/news', label: 'News' },
    { href: '/route', label: 'Route' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/pricing', label: 'Preise' },
    { href: '/notfall', label: '🆘 Notfall' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030714]/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-50">
          🛡️ Risk<span className="text-indigo-400">Vector</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`text-sm px-3 py-1.5 rounded-lg transition hidden sm:flex items-center gap-1 ${active === l.label ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {l.label}
              {l.badge ? <span className="bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{l.badge}</span> : null}
            </Link>
          ))}
          <Link href="/shop" className="ml-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all">
            Shop
          </Link>
        </div>
      </div>
    </nav>
  )
}
