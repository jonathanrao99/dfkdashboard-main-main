'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { addDays, startOfDay, endOfDay, format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { DialogFooter } from '@/components/ui/dialog'

const presets = [
  { label: 'Today', range: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
  { label: 'Yesterday', range: () => { const d = addDays(new Date(), -1); return { start: startOfDay(d), end: endOfDay(d) } } },
  { label: 'Last 7 days', range: () => ({ start: addDays(startOfDay(new Date()), -6), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', range: () => ({ start: addDays(startOfDay(new Date()), -29), end: endOfDay(new Date()) }) },
]

export function DateRangeButton({ onApply }: { onApply: (r: { start: Date; end: Date; preset?: string }) => void }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<{ start: Date; end: Date; preset?: string }>({ ...presets[2].range(), preset: 'Last 7 days' })

  const handleApply = () => {
    onApply(range)
    setOpen(false)
  }
  
  const handlePreset = (p: typeof presets[0]) => {
    setRange({ ...p.range(), preset: p.label });
  }

  const displayLabel = range.preset || `${format(range.start, 'MMM d')} - ${format(range.end, 'MMM d, yyyy')}`

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{displayLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader><SheetTitle>Select date range</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {presets.map(p => (
              <Button key={p.label} variant={range.preset === p.label ? 'default' : 'secondary'} onClick={() => handlePreset(p)}>
                {p.label}
              </Button>
            ))}
          </div>
          {/* Calendar component for custom range would go here */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Apply</Button>
          </DialogFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
