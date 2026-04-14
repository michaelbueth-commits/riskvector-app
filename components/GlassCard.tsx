export default function GlassCard({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl ${hover ? 'hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  )
}
