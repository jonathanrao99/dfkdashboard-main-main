import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KpiCardProps {
  title: string
  value: string | number
  delta?: { label: string; tone: 'up' | 'down' | 'neutral' }
}

export default function KpiCard({ title, value, delta }: KpiCardProps) {
  const toneClasses = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2">
        <h2 className="text-3xl font-bold">{value}</h2>
        {delta && <p className={`text-xs mt-1 ${toneClasses[delta.tone]}`}>{delta.label}</p>}
      </div>
    </div>
  )
}
