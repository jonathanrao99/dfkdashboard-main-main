/**
 * Dashboard Layout
 * Wraps all dashboard pages with Sidebar
 * Following PRD specifications - mobile-first, fully responsive
 */

import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
