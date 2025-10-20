'use client'

import { Bell, FileDown, FileSpreadsheet, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateRangeButton } from './DateRangeButton'

export function Topbar() {
  const handleApplyDateRange = (range: { start: Date; end: Date; preset?: string }) => {
    console.log('Date range applied:', range)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Mobile menu button is in Sidebar component */}
        {/* This div is for spacing alignment */}
        <div className="w-16 lg:hidden" />
        <div className="hidden lg:block lg:w-64" />


        <div className="flex flex-1 items-center justify-end gap-2">
          <DateRangeButton onApply={handleApplyDateRange} />
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            <span className="hidden md:inline">Export PDF</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Add Expense</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
