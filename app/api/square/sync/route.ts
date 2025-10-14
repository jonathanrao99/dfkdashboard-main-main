import { NextResponse } from 'next/server'
import { mcp_square_api } from '@/lib/mcp-client'
import { admin } from '@/lib/supabase'
import { transformSquareOrder } from '@/lib/square'

// A secure route to trigger a sync of Square orders
export async function POST(req: Request) {
  const { locationId, startDate, endDate } = await req.json()

  if (!locationId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing locationId, startDate, or endDate' }, { status: 400 })
  }

  try {
    const response = await mcp_square_api.searchOrders({
      location_ids: [locationId],
      query: {
        filter: {
          date_time_filter: {
            closed_at: {
              start_at: startDate,
              end_at: endDate,
            },
          },
          state_filter: {
            states: ['COMPLETED'],
          },
        },
        sort: {
          sort_field: 'CLOSED_AT',
          sort_order: 'ASC',
        },
      },
    })
    
    const orders = response.orders || [];
    if (orders.length === 0) {
      return NextResponse.json({ message: 'No new orders to sync.' });
    }

    const revenueOrders = orders.map(transformSquareOrder)

    const { error } = await admin()
      .from('revenue_orders')
      .upsert(revenueOrders, { onConflict: 'order_id,source' })

    if (error) {
      throw error;
    }

    return NextResponse.json({ synced: revenueOrders.length })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to sync Square orders', details: errorMessage }, { status: 500 })
  }
}
