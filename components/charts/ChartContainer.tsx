import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

export default function ChartContainer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}
