'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarRange, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

type Preset = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear'
type Grain = 'hour' | 'day' | 'month'

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'thisWeek', label: 'This week' },
  { key: 'lastWeek', label: 'Last week' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'thisYear', label: 'This year' },
  { key: 'lastYear', label: 'Last year' }
]

export default function DateRangeButton() {
  const router = useRouter()
  const q = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // derive current selection from URL (fallback = thisYear)
  const currentRange = (q.get('range') ?? 'thisYear') as Preset

  const handlePresetSelect = (preset: Preset) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const grain = preset === 'thisYear' || preset === 'lastYear' ? 'month' : (preset === 'today' || preset === 'yesterday' ? 'hour' : 'day')
    router.replace(`?range=${preset}&tz=${encodeURIComponent(tz)}&grain=${grain}`)
    setIsOpen(false)
  }

  const getDisplayLabel = () => {
    const preset = PRESETS.find(p => p.key === currentRange)
    return preset?.label || 'This year'
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarRange className="h-4 w-4" />
        {getDisplayLabel()}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {PRESETS.map(preset => (
              <button
                key={preset.key}
                onClick={() => handlePresetSelect(preset.key)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  currentRange === preset.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}