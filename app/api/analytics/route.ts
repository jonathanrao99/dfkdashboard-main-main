import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

async function getReportingOffset(sb: any): Promise<number> {
  const { data, error } = await sb.from('store_hours_settings').select('reporting_offset_min').single()
  if (error || !data) {
    console.error('Failed to get reporting offset, using default.', error)
    return 120 // Default to 2 AM
  }
  return data.reporting_offset_min
}

export async function GET(req: NextRequest) {
  const sb = supabaseServer()
  const sp = req.nextUrl.searchParams
  const range = sp.get('range') ?? 'last30'
  const tz = sp.get('tz') ?? 'America/Chicago'
  const grain = sp.get('grain') ?? 'day'
  const startISO = sp.get('start')
  const endISO = sp.get('end')

  const reportingOffsetMin = await getReportingOffset(sb)

  // Calculate start/end if not provided (for preset ranges)
  let calculatedStartISO = startISO
  let calculatedEndISO = endISO

  if (!startISO || !endISO) {
    const now = dayjs().tz(tz)
    // Adjust "now" to be the logical time for reporting
    const logicalNow = now.subtract(reportingOffsetMin, 'minute')

    let start: dayjs.Dayjs
    let end: dayjs.Dayjs

    switch (range) {
      case 'today':
        start = logicalNow.startOf('day').add(reportingOffsetMin, 'minute')
        end = now
        break
      case 'yesterday':
        start = logicalNow.subtract(1, 'day').startOf('day').add(reportingOffsetMin, 'minute')
        end = logicalNow.subtract(1, 'day').endOf('day').add(reportingOffsetMin, 'minute')
        break
      case 'this_week':
        start = logicalNow.startOf('week').add(reportingOffsetMin, 'minute')
        end = now
        break;
      case 'last_week':
        start = logicalNow.subtract(1, 'week').startOf('week').add(reportingOffsetMin, 'minute')
        end = logicalNow.subtract(1, 'week').endOf('week').add(reportingOffsetMin, 'minute')
        break;
      case 'this_month':
        start = logicalNow.startOf('month').add(reportingOffsetMin, 'minute')
        end = now
        break;
      case 'last_month':
        start = logicalNow.subtract(1, 'month').startOf('month').add(reportingOffsetMin, 'minute')
        end = logicalNow.subtract(1, 'month').endOf('month').add(reportingOffsetMin, 'minute')
        break;
      case 'this_year':
        start = logicalNow.startOf('year').add(reportingOffsetMin, 'minute')
        end = now
        break;
      case 'last_year':
        start = logicalNow.subtract(1, 'year').startOf('year').add(reportingOffsetMin, 'minute')
        end = logicalNow.subtract(1, 'year').endOf('year').add(reportingOffsetMin, 'minute')
        break;
      case 'last7':
        start = logicalNow.subtract(6, 'day').startOf('day').add(reportingOffsetMin, 'minute')
        end = now
        break
      case 'last30':
        start = logicalNow.subtract(29, 'day').startOf('day').add(reportingOffsetMin, 'minute')
        end = now
        break
      default:
        start = logicalNow.subtract(29, 'day').startOf('day').add(reportingOffsetMin, 'minute')
        end = now
    }

    calculatedStartISO = start.toISOString()
    calculatedEndISO = end.toISOString()
  }

  const finalStartISO = calculatedStartISO!
  const finalEndISO = calculatedEndISO!

  // Use DB-side aggregation via RPC for performance
  const { data, error } = await sb.rpc('analytics_sales', {
    p_start: finalStartISO,
    p_end: finalEndISO,
    p_tz: tz,
    p_grain: grain,
    p_offset_min: reportingOffsetMin
  })

  if (error) {
    console.error('Analytics RPC error:', error)
    return new Response(error.message, { status: 500 })
  }

  const series = data.map(r => ({
    tsISO: r.bucket,
    value: Number(r.sales_cents) / 100 // Convert cents to dollars
  }))

  const total = series.reduce((a, b) => a + b.value, 0)

  // TODO: Add expenses calculation when ready
  const expenses = 0

  return Response.json({
    window: {
      tz,
      offsetMin: reportingOffsetMin,
      grain,
      startISO: finalStartISO,
      endISO: finalEndISO
    },
    kpis: {
      netSales: total,
      expenses: expenses,
      netProfit: total - expenses,
      cashInBank: 0  // TODO: Calculate from bank transactions when Plaid is integrated
    },
    series: {
      grain,
      netSalesTrend: series,
      expensesByCategory: []
    },
    reconcile: {
      payoutsMatched: 0,  // TODO: Calculate from reconciled transactions
      payoutsTotal: 0,    // TODO: Calculate from total payouts
      bankUnmatched: 0,   // TODO: Calculate unmatched bank transactions
      alerts: []          // TODO: Add alerts for reconciliation issues
    },
    recentTransactions: []  // TODO: Add recent transaction data when available
  })
}