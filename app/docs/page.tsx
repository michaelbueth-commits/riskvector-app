import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'API Documentation - RiskVector' }

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-indigo-400 text-sm font-mono">{children}</code>
}

function Endpoint({ method, path, desc, params, response }: { method: string; path: string; desc: string; params?: { name: string; type: string; desc: string }[]; response: string }) {
  const color = method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : method === 'POST' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-violet-500/10 text-violet-400 border-violet-500/30'
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${color}`}>{method}</span>
        <Code>{path}</Code>
      </div>
      <p className="text-slate-400 text-sm mb-4">{desc}</p>
      {params && <div className="mb-4"><p className="text-xs font-semibold text-slate-300 mb-2">Parameters</p>
        <div className="space-y-1">{params.map(p => <div key={p.name} className="flex gap-2 text-sm"><Code>{p.name}</Code><span className="text-slate-500">{p.type}</span><span className="text-slate-400">— {p.desc}</span></div>)}</div>
      </div>}
      <details className="cursor-pointer"><summary className="text-xs text-slate-500 hover:text-slate-300">Response Example</summary>
        <pre className="mt-2 bg-black/50 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto font-mono">{response}</pre>
      </details>
    </div>
  )
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="pt-8 mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">API Documentation</h1>
          <p className="text-slate-400">Real-time risk intelligence via REST API. Base URL: <Code>https://riskvector.app</Code></p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Authentication</h2>
          <p className="text-slate-400 text-sm mb-2">Include your API key in the header:</p>
          <pre className="bg-black/50 rounded-lg p-4 text-sm font-mono text-slate-300">Authorization: Bearer YOUR_API_KEY</pre>
          <p className="text-slate-500 text-xs mt-2">Get an API key on our <Link href="/pricing" className="text-indigo-400 hover:underline">pricing page</Link>.</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-indigo-400">Endpoints</h2>

        <Endpoint method="GET" path="/api/risk/{country}" desc="Get comprehensive risk assessment for a country."
          params={[{ name: 'country', type: 'string', desc: 'Country name (URL-encoded)' }]}
          response={`{"country":"Germany","overall":25,"political":30,"health":15,"weather":20,"infrastructure":18}`}
        />
        <Endpoint method="GET" path="/api/alerts" desc="Get latest global alerts from GDACS, USGS, NOAA."
          response={`{"alerts":[{"id":"...","type":"high","title":"M6.2 - Turkey"}]}`}
        />
        <Endpoint method="POST" path="/api/simulate" desc="Run a risk simulation scenario."
          params={[{ name: 'question', type: 'string', desc: 'Scenario description (min 5 chars)' }]}
          response={`{"success":true,"report":{"overallRisk":75,"riskLevel":"HIGH"}}`}
        />
        <Endpoint method="GET" path="/api/risk/{country}/historical" desc="Get historical risk score data."
          params={[{ name: 'country', type: 'string', desc: 'Country name' }]}
          response={`{"country":"Iran","history":[{"date":"2026-04-01","overall":92}]}`}
        />

        <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
          <h3 className="text-indigo-400 font-semibold mb-2">Rate Limits</h3>
          <p className="text-slate-300 text-sm">Free tier: 60 requests/hour. Pro: Unlimited.</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-500/25">Get API Key</Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
