'use client'

import { useState } from 'react'
import { RangePreset } from '@/types/dashboard'

interface DateRangeDropdownProps {
  value: RangePreset
  onChange: (value: RangePreset) => void
  className?: string
  isLoading?: boolean
}

const rangeOptions: { value: RangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisYear', label: 'This Year' },
]

export default function DateRangeDropdown({ 
  value, 
  onChange, 
  className = '', 
  isLoading = false 
}: DateRangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = rangeOptions.find(option => option.value === value) || rangeOptions[2] // Default to Last 30 Days

  const handleOptionClick = (optionValue: RangePreset) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {isLoading ? 'Loading...' : selectedOption.label}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                option.value === value 
                  ? 'bg-emerald-50 text-emerald-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
