'use client'

interface KpiCardProps {
  title: string
  value: string | number
  delta?: {
    label: string
    tone: 'up' | 'down' | 'neutral'
  }
}

export default function KpiCardSimple({ title, value, delta }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="kpi-title">{title}</div>
        {delta && (
          <div className={`kpi-delta ${delta.tone}`}>
            {delta.tone === 'up' && <span>↗</span>}
            {delta.tone === 'down' && <span>↘</span>}
            {delta.label}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  )
}










