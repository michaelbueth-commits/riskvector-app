import Link from 'next/link'
export default function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string }) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <Link href="/" className="hover:text-slate-300 transition">RiskVector</Link>
        <span>/</span>
        <span className="text-indigo-400 font-medium">{breadcrumb || title}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">{title}</h1>
      {subtitle && <p className="text-slate-400 mt-2 max-w-2xl">{subtitle}</p>}
    </div>
  )
}
