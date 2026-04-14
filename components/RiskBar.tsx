export default function RiskBar({ value, label, icon }: { value: number; label: string; icon?: string }) {
  const color = value >= 70 ? 'bg-red-500' : value >= 45 ? 'bg-amber-500' : value >= 25 ? 'bg-yellow-500' : 'bg-emerald-500'
  const textColor = value >= 70 ? 'text-red-400' : value >= 45 ? 'text-amber-400' : value >= 25 ? 'text-yellow-400' : 'text-emerald-400'
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300">{label}</span>
          <span className={`font-bold ${textColor}`}>{value}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  )
}
