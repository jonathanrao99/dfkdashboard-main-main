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
import { IntegrationStatus } from '@/components/dashboard/IntegrationStatus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Real data will be fetched from API

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dashboardRes, reconciliationRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/reconciliation')
        ])
        
        const dashboardData = await dashboardRes.json()
        const reconciliationData = await reconciliationRes.json()
        
        if (dashboardData.error) {
          setError(dashboardData.error)
        } else {
          setDashboardData({
            ...dashboardData,
            reconciliation: reconciliationData.error ? { error: reconciliationData.error } : reconciliationData
          })
        }
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Desi Flavors Katy</h1>
            <p className="text-muted-foreground">Authentic Indian cuisine food truck - Financial Dashboard</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Desi Flavors Katy</h1>
            <p className="text-muted-foreground">Authentic Indian cuisine food truck - Financial Dashboard</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium">Error: {error}</div>
          <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">Desi Flavors Katy</h1>
          <p className="text-muted-foreground">Authentic Indian cuisine food truck - Financial Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Net Sales (This Week)" value={dashboardData?.kpis?.netSales?.value || "$0"} delta={{label: dashboardData?.kpis?.netSales?.delta || "No data", tone: dashboardData?.kpis?.netSales?.tone || 'neutral'}} />
        <KpiCard title="Food Costs" value={dashboardData?.kpis?.foodCosts?.value || "$0"} delta={{label: dashboardData?.kpis?.foodCosts?.delta || "No data", tone: dashboardData?.kpis?.foodCosts?.tone || 'neutral'}} />
        <KpiCard title="Labor Costs" value={dashboardData?.kpis?.labor?.value || "$0"} delta={{label: dashboardData?.kpis?.labor?.delta || "No data", tone: dashboardData?.kpis?.labor?.tone || 'neutral'}} />
        <KpiCard title="Net Profit" value={dashboardData?.kpis?.netProfit?.value || "$0"} delta={{label: dashboardData?.kpis?.netProfit?.delta || "No data", tone: dashboardData?.kpis?.netProfit?.tone || 'neutral'}} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart data={dashboardData?.dailySales || []} />
        </div>
        <div className="lg:col-span-2">
          <ExpensesDonut data={dashboardData?.channelMix || []} />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-600">🍛</span>
                Popular Items This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dashboardData?.popularItems || []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">${item.revenue.toFixed(0)}</p>
                      <p className="text-sm text-gray-600">${(item.revenue / item.orders).toFixed(2)} avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-600">⏰</span>
                Peak Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(dashboardData?.peakHours || []).map((hour: any, index: number) => {
                  const maxOrders = Math.max(...(dashboardData?.peakHours || []).map((h: any) => h.orders), 1)
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{hour.hour}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(hour.orders / maxOrders) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{hour.orders}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <IntegrationStatus 
            squareData={dashboardData?.squareData || { ordersCount: 0, paymentsCount: 0, catalogItems: 0, lastSynced: null }}
            bankingData={dashboardData?.bankingData || { totalBalance: 0, netFlow: 0, accountCount: 0, accounts: [] }}
            aiInsights={dashboardData?.aiInsights || { menuAnalysis: {}, businessInsights: {} }}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-600">⚠️</span>
                Alerts & Reconciliation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.reconciliation?.error ? (
                <div className="space-y-2 text-sm">
                  <p className="text-destructive">Error: {dashboardData.reconciliation.error}</p>
                </div>
              ) : dashboardData?.reconciliation ? (
                <div className="space-y-2 text-sm">
                  <p>Payouts: {dashboardData.reconciliation.payoutsMatched} / {dashboardData.reconciliation.payoutsTotal} matched</p>
                  <p>Unmatched Deposits: {dashboardData.reconciliation.bankUnmatched}</p>
                  <div className="pt-2">
                    {(dashboardData.reconciliation.alerts || []).map((alert: string, i: number) => (
                      <p key={i} className="text-destructive">{alert}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  {(dashboardData?.alerts || []).map((alert: string, i: number) => (
                    <div key={i} className={`p-3 rounded-lg ${
                      alert.includes('✅') ? 'bg-green-50' : 
                      alert.includes('⚠️') ? 'bg-yellow-50' : 
                      'bg-blue-50'
                    }`}>
                      <p className={`font-medium ${
                        alert.includes('✅') ? 'text-green-800' : 
                        alert.includes('⚠️') ? 'text-yellow-800' : 
                        'text-blue-800'
                      }`}>{alert}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
