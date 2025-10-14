/**
 * Dashboard Overview Page
 * Main dashboard with KPIs, charts, and reconciliation alerts
 * Following PRD specifications - minimal, Stripe-grade UI
 */

'use client'

import { useEffect, useState } from 'react'
import KpiCard from '@/components/kpi/KpiCard'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { ExpensesDonut } from '@/components/charts/ExpensesDonut'
import { TransactionsList } from '@/components/dashboard/TransactionsList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const mockData = {
  kpis: {
    netIncome: { value: "$193,000", delta: "+35% from last month", tone: 'up' },
    totalReturn: { value: "$32,000", delta: "-24% from last month", tone: 'down' },
  },
  revenue: Array.from({ length: 12 }, (_, i) => ({ d: `Month ${i + 1}`, net: 15000 + Math.random() * 10000 })),
  performance: [
    { category: 'View Count', value: 382850 },
    { category: 'Sales', value: 129375 },
    { category: 'Other', value: 50825 },
  ],
}

export default function DashboardPage() {
  const [reconciliation, setReconciliation] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/reconciliation')
      .then(res => res.json())
      .then(data => setReconciliation(data))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">An any way to manage sales with care and precision.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Net Income" value={mockData.kpis.netIncome.value} delta={{label: mockData.kpis.netIncome.delta, tone: 'up'}} />
        <KpiCard title="Total Return" value={mockData.kpis.totalReturn.value} delta={{label: mockData.kpis.totalReturn.delta, tone: 'down'}} />
        <div className="lg:col-span-1 bg-sidebar-background text-sidebar-foreground p-5 rounded-lg">
          <p className="text-sm">Update</p>
          <p className="text-xs text-sidebar-foreground/70 mt-2">Feb 12th 2024</p>
          <p className="mt-2 font-semibold">Sales revenue increased 40% in 1 week</p>
          <Button variant="link" className="p-0 h-auto text-xs mt-2 text-sidebar-foreground/70">See Statistics &gt;</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart data={mockData.revenue} />
        </div>
        <div className="lg:col-span-2">
          <ExpensesDonut data={mockData.performance} />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionsList />
        </div>
        <div className="lg:col-span-1">
          {/* This is where alerts and other info can go */}
          <Card>
            <CardHeader><CardTitle>Alerts & Reconciliation</CardTitle></CardHeader>
            <CardContent>
              {reconciliation ? (
                <div className="space-y-2 text-sm">
                  <p>Payouts: {reconciliation.payoutsMatched} / {reconciliation.payoutsTotal} matched</p>
                  <p>Unmatched Deposits: {reconciliation.bankUnmatched}</p>
                  <div className="pt-2">
                    {reconciliation.alerts.map((alert: string, i: number) => (
                      <p key={i} className="text-destructive">{alert}</p>
                    ))}
                  </div>
                </div>
              ) : <p>Loading reconciliation data...</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
