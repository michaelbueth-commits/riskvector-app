import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-slate-300">
          🛡️ Risk<span className="text-indigo-400">Vector</span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500">
          <Link href="/pricing" className="hover:text-slate-300 transition">Preise</Link>
          <Link href="/about" className="hover:text-slate-300 transition">Über uns</Link>
          <Link href="/docs" className="hover:text-slate-300 transition">API Docs</Link>
          <Link href="/news" className="hover:text-slate-300 transition">News</Link>
        </div>
        <div className="text-xs text-slate-600">© 2026 RiskVector — Made in Germany 🇩🇪</div>
      </div>
    </footer>
  )
}
