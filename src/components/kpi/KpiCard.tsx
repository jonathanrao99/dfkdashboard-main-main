interface KpiCardProps {
  title: string
  value: string | number
  delta?: {
    label: string
    tone: 'up' | 'down' | 'neutral'
  }
}

export default function KpiCard({ title, value, delta }: KpiCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-card p-6">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="text-3xl font-semibold text-gray-900 mb-2">{value}</div>
      {delta && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          delta.tone === 'up' 
            ? 'bg-emerald-50 text-emerald-700' 
            : delta.tone === 'down' 
            ? 'bg-red-50 text-red-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          {delta.tone === 'up' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          )}
          {delta.tone === 'down' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
            </svg>
          )}
          {delta.label}
        </div>
      )}
    </div>
  )
}