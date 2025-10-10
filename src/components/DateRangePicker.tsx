'use client'
import { useState } from 'react'

export type PickerValue =
  | { mode: 'preset'; preset: string }
  | { mode: 'custom'; startISO: string; endISO: string }

const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'thisWeek', label: 'This week' },
  { key: 'lastWeek', label: 'Last week' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'thisYear', label: 'This year' },
  { key: 'lastYear', label: 'Last year' },
  { key: 'custom', label: 'Custom' },
]

export default function DateRangePicker({
  value,
  onChange
}: {
  value: PickerValue
  onChange: (v: PickerValue, grain: 'hour' | 'day' | 'month') => void
}) {
  const [activePreset, setActivePreset] = useState(value.mode === 'preset' ? value.preset : 'custom')

  const applyPreset = (p: string) => {
    setActivePreset(p)
    if (p === 'custom') return // wait for user to pick range
    
    let grain: 'hour' | 'day' | 'month' = 'day'
    if (p === 'today' || p === 'yesterday') grain = 'hour'
    if (p === 'thisYear' || p === 'lastYear') grain = 'month'
    
    onChange({ mode: 'preset', preset: p }, grain)
  }

  return (
    <div className="flex w-[400px] gap-3 p-2">
      {/* Presets */}
      <div className="w-48 border rounded-lg p-2">
        {PRESETS.map(p => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
              activePreset === p.key ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Simple info */}
      <div className="flex-1 border rounded-lg p-3">
        <div className="text-sm text-gray-600">
          <p>Selected: {value.mode === 'preset' ? value.preset : 'Custom'}</p>
          <p className="text-xs text-gray-500 mt-2">
            Reporting day: starts at 2:00 AM local; end is exclusive.
          </p>
        </div>
      </div>
    </div>
  )
}