import { NextRequest, NextResponse } from 'next/server'
import { BUSINESS_TZ, REPORTING_OFFSET_MIN } from '@/config/analytics'
import { getWindow, presetToGrain } from '@/lib/reportingWindow'
import { fetchOrdersClosedBetween, metricFromRaw } from '@/server/squareFetcher'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const preset = searchParams.get('range') || 'yesterday'
    const tz = searchParams.get('tz') || BUSINESS_TZ
    const offsetMin = Number(searchParams.get('offsetMin')) || REPORTING_OFFSET_MIN
    
    const grain = presetToGrain(preset as any)
    const { start, end } = getWindow(preset as any, tz, offsetMin)
    
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    // Fetch raw orders
    const rawOrders = await fetchOrdersClosedBetween(startISO, endISO)

    // Calculate raw sum
    const sumRaw = rawOrders.reduce((sum, order) => 
      sum + metricFromRaw(order.amounts, 'NET'), 0
    )

    // Get first/last 5 transactions
    const first5 = rawOrders.slice(0, 5).map(order => ({
      id: order.id,
      closed_at: order.closed_at,
      local: dayjs(order.closed_at).tz(tz).format('YYYY-MM-DD HH:mm:ss'),
      amount: metricFromRaw(order.amounts, 'NET')
    }))

    const last5 = rawOrders.slice(-5).map(order => ({
      id: order.id,
      closed_at: order.closed_at,
      local: dayjs(order.closed_at).tz(tz).format('YYYY-MM-DD HH:mm:ss'),
      amount: metricFromRaw(order.amounts, 'NET')
    }))

    // Generate bucket edges for validation
    const bucketEdges = []
    let current = start.clone()
    while (current.isBefore(end)) {
      bucketEdges.push({
        bucket: current.toISOString(),
        local: current.tz(tz).format('YYYY-MM-DD HH:mm:ss')
      })
      current = current.add(1, grain === 'hour' ? 'hour' : grain === 'day' ? 'day' : 'month')
    }

    const debug = {
      window: {
        preset,
        tz,
        offsetMin,
        grain,
        startISO,
        endISO
      },
      bucketEdges,
      sumRaw: Math.round(sumRaw * 100) / 100,
      totalOrders: rawOrders.length,
      first5,
      last5
    }

    return NextResponse.json({
      success: true,
      data: debug
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch debug data' },
      { status: 500 }
    )
  }
}




