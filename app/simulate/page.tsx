'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RiskGauge from '@/components/RiskGauge'

interface SimSection { title: string; content: string; impact: string; affectedAreas: string[] }
interface SimReport { id: string; question: string; summary: string; overallRisk: number; riskLevel: string; sections: SimSection[]; sources: string[]; countries: string[]; generatedAt: string; expiresIn: string; methodology: string }

const impactStyles: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400', high: 'bg-orange-500/10 text-orange-400',
  medium: 'bg-yellow-500/10 text-yellow-400', low: 'bg-emerald-500/10 text-emerald-400',
}

const riskBadgeStyles: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
}

const examples = [
  'What happens if a major earthquake hits Tokyo?',
  'Impact of a cyber attack on European power grids',
  'What if conflict escalates in the South China Sea?',
  'Consequences of a volcanic eruption in Iceland for European aviation',
  'What happens if a pandemic emerges in Southeast Asia?',
  'Impact of Russia cutting gas supplies to Europe',
]

export default function SimulatePage() {
  const [question, setQuestion] = useState('')
  const [report, setReport] = useState<SimReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]))
  const [phase, setPhase] = useState<0 | 1 | 2>(0)
  const canSubmit = question.trim().length >= 5

  const submit = useCallback(async () => {
    if (!canSubmit) return
    setLoading(true); setError(''); setPhase(1); setReport(null)
    try {
      const res = await fetch('/api/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: question.trim() }) })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Unknown error')
      setReport(data.report); setPhase(2); setOpenSections(new Set([0]))
    } catch (err: any) { setError(err.message || 'Simulation failed'); setPhase(0) }
    finally { setLoading(false) }
  }, [question, canSubmit])

  const toggle = (i: number) => { setOpenSections(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n }) }
  const reset = () => { setQuestion(''); setReport(null); setPhase(0); setError(''); setOpenSections(new Set([0])) }

  return (
    <main className="min-h-screen bg-[#030714]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {phase === 0 && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-400 font-medium mb-8">
              ● Multi-Source Intelligence Simulation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Ask a question.<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Get a prediction report.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12">
              Our analysis engine uses data from USGS, GDACS, ACLED, and public sources to generate risk assessments.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {[
                { icon: '❓', title: 'Ask', desc: 'Describe a scenario' },
                { icon: '🌍', title: 'Build World', desc: 'Context from real data' },
                { icon: '🤖', title: 'Simulate', desc: 'Multi-dimensional analysis' },
                { icon: '📊', title: 'Report', desc: 'Structured intelligence' },
              ].map(s => (
                <div key={s.title} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-sm font-semibold text-slate-100 mb-1">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What happens if... (e.g., a major earthquake hits Tokyo)" rows={3} className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none text-base" />
              <button onClick={submit} disabled={!canSubmit} className={`mt-3 w-full py-4 rounded-xl font-semibold text-base transition-all ${canSubmit ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                {canSubmit ? 'Generate Intelligence Report →' : 'Type at least 5 characters...'}
              </button>
              {error && <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            </div>

            <div className="max-w-2xl mx-auto mt-8">
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-3">Try an example:</p>
              <div className="grid gap-2">
                {examples.map((q, i) => (
                  <button key={i} onClick={() => setQuestion(q)} className="text-left px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:border-indigo-500/30 hover:text-white transition cursor-pointer">{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Analyzing: &ldquo;{question}&rdquo;</h2>
            <p className="text-slate-500 text-sm">Fusing data from USGS, GDACS, ACLED, GDELT, NOAA...</p>
          </div>
        )}

        {phase === 2 && report && (
          <div className="animate-fade-in">
            <button onClick={reset} className="text-sm text-slate-500 hover:text-white transition mb-6">← New Simulation</button>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskBadgeStyles[report.riskLevel] || riskBadgeStyles.LOW}`}>{report.riskLevel} RISK</span>
                <span className="text-xs text-slate-600">Report ID: {report.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">{report.question}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{report.summary}</p>
              <div className="flex items-center gap-8 justify-center">
                <RiskGauge score={report.overallRisk} size="lg" />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              {report.sections.map((section, idx) => {
                const isOpen = openSections.has(idx)
                const style = impactStyles[section.impact] || impactStyles.low
                return (
                  <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <button onClick={() => toggle(idx)} className="w-full flex justify-between items-center p-4 cursor-pointer text-left">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${style}`}>{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-slate-100 text-sm">{section.title}</div>
                          <span className="text-[10px] uppercase font-medium" style={{ color: style.includes('red') ? '#f87171' : style.includes('orange') ? '#fb923c' : style.includes('yellow') ? '#fbbf24' : '#34d399' }}>{section.impact} impact</span>
                        </div>
                      </div>
                      <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pl-14">
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">{section.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {section.affectedAreas.map((area, i) => <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-slate-500">{area}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Data Sources</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {report.sources.map((src, i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">📡 {src}</span>)}
              </div>
              <p className="text-xs text-slate-600">{report.methodology}</p>
            </div>

            <button onClick={reset} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-500/25">New Simulation</button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
