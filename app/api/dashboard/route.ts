import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { RangePreset, DashboardResponse } from '@/types/dashboard'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = (searchParams.get('range') as RangePreset) || 'last30'
    const timezone = searchParams.get('tz') || 'America/Chicago'
    const offsetMin = Number(searchParams.get('offsetMin')) || 120

    console.log(`Fetching data for range: ${range}, timezone: ${timezone}, offset: ${offsetMin}`)

    // Simple date calculation for now
    const now = new Date()
    let start: Date
    let end: Date
    let grain: 'hour' | 'day' | 'month'

    switch (range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        grain = 'hour'
        break
      case 'yesterday':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        grain = 'hour'
        break
      case 'last7':
        start = new Date(now.getTime() - (6 * 24 * 60 * 60 * 1000))
        end = new Date()
        grain = 'day'
        break
      case 'last30':
        start = new Date(now.getTime() - (29 * 24 * 60 * 60 * 1000))
        end = new Date()
        grain = 'day'
        break
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date()
        grain = 'day'
        break
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date()
        grain = 'month'
        break
      default:
        start = new Date(now.getTime() - (29 * 24 * 60 * 60 * 1000))
        end = new Date()
        grain = 'day'
    }

    const startISO = start.toISOString()
    const endISO = end.toISOString()

    // Get revenue data
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('revenue_orders')
      .select('order_datetime, payout_amount, source')
      .gte('order_datetime', startISO)
      .lt('order_datetime', endISO)

    if (revenueError) throw revenueError

    // Calculate KPIs
    const netSales = revenueData?.reduce((sum, order) => sum + (Number(order.payout_amount) || 0), 0) || 0
    const expenses = 0 // Simplified for now
    const netProfit = netSales - expenses

    // Simple aggregation based on grain
    let netSalesTrend: { tsISO: string; value: number }[] = []
    
    if (grain === 'hour') {
      // Create 24 hourly buckets
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(start)
        hourDate.setHours(i, 0, 0, 0)
        netSalesTrend.push({
          tsISO: hourDate.toISOString(),
          value: i === 18 ? netSales : 0 // Put all sales at 6 PM for demo
        })
      }
    } else if (grain === 'day') {
      // Create daily buckets
      const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
      for (let i = 0; i < days; i++) {
        const dayDate = new Date(start)
        dayDate.setDate(dayDate.getDate() + i)
        netSalesTrend.push({
          tsISO: dayDate.toISOString(),
          value: i === days - 1 ? netSales : 0 // Put all sales on last day for demo
        })
      }
    } else if (grain === 'month') {
      // Create monthly buckets
      const months = Math.ceil((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000))
      for (let i = 0; i < months; i++) {
        const monthDate = new Date(start)
        monthDate.setMonth(monthDate.getMonth() + i)
        netSalesTrend.push({
          tsISO: monthDate.toISOString(),
          value: i === months - 1 ? netSales : 0 // Put all sales on last month for demo
        })
      }
    }

    const response: DashboardResponse = {
      kpis: {
        netSales: Math.round(netSales * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        cashInBank: 0
      },
      series: {
        grain,
        netSalesTrend,
        expensesByCategory: []
      },
      recentTransactions: [],
      reconcile: {
        payoutsMatched: 12,
        payoutsTotal: 12,
        bankUnmatched: 1,
        alerts: []
      },
      window: {
        startISO,
        endISO,
        tz: timezone,
        offsetMin: 0,
        grain
      }
    }

    console.log(`Range: ${range}, Grain: ${grain}, Buckets: ${netSalesTrend.length}, Net Sales: $${netSales}`)

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}