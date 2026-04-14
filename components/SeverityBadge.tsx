const styles: Record<string, string> = {
  CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30',
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
}
export default function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${styles[severity] || styles.low}`}>
      {severity}
    </span>
  )
}
