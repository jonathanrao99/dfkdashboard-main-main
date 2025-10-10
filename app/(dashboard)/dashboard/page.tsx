'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import KpiCardV2 from '@/components/kpi/KpiCardV2'
import ChartContainer from '@/components/charts/ChartContainer'
import SparkNetSales from '@/components/charts/SparkNetSales'
import ExpensesDonut from '@/components/charts/ExpensesDonut'
import ChannelMix from '@/components/charts/ChannelMix'
import ReconciliationAndAlerts from '@/components/blocks/ReconciliationAndAlerts'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import DateRangeButton from '@/components/date-range/DateRangeButton'
import { DashboardResponse } from '@/types/dashboard'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw, Clock, Activity } from 'lucide-react'


function DashboardContent() {
  console.log('DashboardPage component rendering')
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const searchParams = useSearchParams()

  const syncSquareData = async () => {
    setIsSyncing(true)
    try {
      // Get date range for sync (last 30 days)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const response = await fetch('/api/square/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LRWAJVBMEHEXE',
          startISO: startDate.toISOString(),
          endISO: endDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`)
      }

      // Refresh dashboard data after sync
      setLastSyncTime(new Date())
      await fetchData()
    } catch (err) {
      console.error('Error syncing Square data:', err)
      setError('Failed to sync Square data')
    } finally {
      setIsSyncing(false)
    }
  }

  const fetchData = async (params?: URLSearchParams) => {
    console.log('fetchData called')
    setIsLoading(true)
    setError(null)

    const currentParams = params || searchParams
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const offsetMin = 120

    // Get URL parameters - use searchParams hook (client-side only)
    const range = currentParams.get('range') || 'last30'
    const tz = currentParams.get('tz') || timezone
    const grain = currentParams.get('grain') || 'day'
    const start = currentParams.get('start')
    const end = currentParams.get('end')

    let url = `/api/analytics?tz=${tz}&offsetMin=${offsetMin}&range=${range}&grain=${grain}`

    if (range === 'custom' && start && end) {
      url += `&start=${start}&end=${end}`
    }

    try {
      console.log('Fetching data from:', url)
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      console.log('API response:', data)
      setData(data)
      console.log('Data set successfully:', data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchParams])

  // Listen for URL changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const handleUrlChange = () => {
      fetchData()
    }

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  // Temporary: Show data if available, otherwise show loading
  if (isLoading && !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 text-sm mt-1">Loading your business data...</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={syncSquareData}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </button>
              <DateRangeButton />
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Loading skeletons */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Use fallback data if no data is available
  const displayData = data || {
    window: {
      tz: 'America/Chicago',
      offsetMin: 120,
      grain: 'month' as const,
      startISO: '2025-01-01T06:00:00.000Z',
      endISO: '2025-10-02T20:29:37.198Z'
    },
    kpis: {
      netSales: 320.6,
      expenses: 0,
      netProfit: 320.6,
      cashInBank: 0
    },
    series: {
      grain: 'month' as const,
      netSalesTrend: [
        { tsISO: '2025-01-01T06:00:00.000Z', value: 0 },
        { tsISO: '2025-02-01T06:00:00.000Z', value: 0 },
        { tsISO: '2025-03-01T06:00:00.000Z', value: 0 },
        { tsISO: '2025-04-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-05-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-06-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-07-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-08-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-09-01T05:00:00.000Z', value: 0 },
        { tsISO: '2025-10-01T05:00:00.000Z', value: 320.6 }
      ],
      expensesByCategory: []
    },
    recentTransactions: [],
    reconcile: {
      payoutsMatched: 12,
      payoutsTotal: 12,
      bankUnmatched: 1,
      alerts: []
    }
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 text-sm mt-1">Error loading data</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={syncSquareData}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </button>
              <DateRangeButton />
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-xl">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Error Loading Data</div>
            <div className="text-gray-500 text-sm">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  const { kpis, series, recentTransactions, reconcile, window: windowData } = displayData
  const totalNetSales = series.netSalesTrend.reduce((sum, point) => sum + point.value, 0)
  const avgPerPeriod = series.netSalesTrend.length > 0 ? Math.round(totalNetSales / series.netSalesTrend.length) : 0

  // Format period label based on grain
  const getPeriodLabel = () => {
    switch (windowData.grain) {
      case 'hour':
        return 'Avg/hour'
      case 'day':
        return 'Avg/day'
      case 'month':
        return 'Avg/month'
      default:
        return 'Avg/period'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your business today.</p>
              {lastSyncTime && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Last synced {new Date(lastSyncTime).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={syncSquareData}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Data'}
            </button>
            <DateRangeButton />
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Average Per Period</p>
              <p className="text-lg font-bold text-gray-900">${avgPerPeriod.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Total Period Sales</p>
              <p className="text-lg font-bold text-gray-900">${totalNetSales.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{series.netSalesTrend.length} periods</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Profit Margin</p>
              <p className="text-lg font-bold text-gray-900">
                {kpis.netSales > 0 ? ((kpis.netProfit / kpis.netSales) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-xs text-gray-500">
                {kpis.netProfit > 0 ? 'Healthy' : 'Review needed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardV2
          title="Gross Sales"
          value={`$${kpis.netSales.toLocaleString()}`}
          delta={{ label: "+8%", tone: "up" }}
          variant="primary"
          icon={<DollarSign className="w-5 h-5 text-green-100" />}
        />
        <KpiCardV2
          title="Expenses"
          value={`$${kpis.expenses.toLocaleString()}`}
          delta={{ label: "-3%", tone: "down" }}
          icon={<TrendingDown className="w-5 h-5 text-gray-400" />}
        />
        <KpiCardV2
          title="Net Profit"
          value={`$${kpis.netProfit.toLocaleString()}`}
          delta={{ label: "+18%", tone: "up" }}
          icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
        />
        <KpiCardV2
          title="Cash in Bank"
          value={`$${kpis.cashInBank.toLocaleString()}`}
          delta={{ label: "+$2,300", tone: "up" }}
          icon={<CreditCard className="w-5 h-5 text-gray-400" />}
        />
      </div>

      {/* Row 2: Net Sales Sparkline (2/3) | Expenses Donut (1/3) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <ChartContainer title="Net Sales Trend" className="lg:col-span-2">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold text-gray-900">${totalNetSales.toLocaleString()}</div>
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                +8%
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">{getPeriodLabel()}: ${avgPerPeriod.toLocaleString()}</div>
          </div>
          <SparkNetSales data={series.netSalesTrend} grain={windowData.grain} />
        </ChartContainer>
        <ChartContainer title="Expenses by Category">
          <ExpensesDonut data={series.expensesByCategory} />
        </ChartContainer>
      </div>

      {/* Row 3: Channel Mix | Reconciliation & Alerts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartContainer title="Revenue by Source (Net)">
          <div className="text-sm text-gray-500 mb-4">After platform + processing fees</div>
          <ChannelMix data={[{ source: 'Square', net: kpis.netSales }]} />
        </ChartContainer>
        <ChartContainer title="Reconciliation & Alerts">
          <ReconciliationAndAlerts 
            payoutsMatched={reconcile.payoutsMatched}
            payoutsTotal={reconcile.payoutsTotal}
            bankUnmatched={reconcile.bankUnmatched}
            alerts={reconcile.alerts}
          />
        </ChartContainer>
      </div>

      {/* Row 4: Recent Transactions */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnhancedCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'Sale' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      <svg className={`w-5 h-5 ${transaction.type === 'Sale' ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {transaction.type === 'Sale' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.type} via {transaction.platform}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                        <div className="text-xs text-gray-400">{transaction.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions in selected range
                </div>
              )}
            </div>
          </EnhancedCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <EnhancedCard>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Orders Completed</div>
                <div className="font-semibold text-gray-900">47</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Avg Order Value</div>
                <div className="font-semibold text-gray-900">$23.45</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Customer Rating</div>
                <div className="flex items-center gap-1">
                  <div className="font-semibold text-gray-900">4.8</div>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Peak Hour</div>
                <div className="font-semibold text-gray-900">12-1 PM</div>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Add Expense</div>
                  <div className="text-sm text-gray-600">Record a new expense</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Create monthly summary</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Upload Data</div>
                  <div className="text-sm text-gray-600">Import CSV files</div>
                </div>
              </button>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm mt-1">Loading...</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}