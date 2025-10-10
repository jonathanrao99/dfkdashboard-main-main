import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { SquareService } from '@/lib/square'

export async function POST(req: NextRequest) {
  const { locationId, startISO, endISO } = await req.json()

  if (!locationId || !startISO || !endISO) {
    return new Response('Missing required parameters: locationId, startISO, endISO', { status: 400 })
  }

  try {
    // For now, use the access token from environment (existing setup)
    // Later, this will use the database-stored tokens from OAuth
    const accessToken = process.env.SQUARE_ACCESS_TOKEN

    if (!accessToken) {
      return new Response('SQUARE_ACCESS_TOKEN not configured', { status: 500 })
    }

    // Initialize Supabase client
    const sb = supabaseServer()

    // Temporarily override the access token and location in Square service
    const originalToken = process.env.SQUARE_ACCESS_TOKEN
    const originalLocation = process.env.SQUARE_LOCATION_ID
    process.env.SQUARE_ACCESS_TOKEN = accessToken
    process.env.SQUARE_LOCATION_ID = locationId

    console.log('Fetching Square orders...')
    // Fetch Square Orders (Closed Checks) in the date range
    const orders = await SquareService.getOrders(startISO, endISO)
    console.log(`Found ${orders.length} orders`)

    // Restore original values
    process.env.SQUARE_ACCESS_TOKEN = originalToken
    process.env.SQUARE_LOCATION_ID = originalLocation

    console.log('Processing orders...')
    // Convert orders to ledger transactions
    const rows = []
    for (const order of orders) {
      try {
        console.log(`Processing order ${order.id}`)

        // Calculate gross sales (total - tax)
        const totalMoney = (order as any).total_money?.amount || order.totalMoney?.amount || 0
        const taxMoney = (order as any).total_tax_money?.amount || order.totalTaxMoney?.amount || 0
        const tipMoney = (order as any).total_tip_money?.amount || order.totalTipMoney?.amount || 0
        const discountMoney = (order as any).total_discount_money?.amount || order.totalDiscountMoney?.amount || 0

        // Gross sales = total - tax (revenue before tax)
        const grossSalesCents = totalMoney - taxMoney

        console.log(`Order ${order.id}: total=${totalMoney}, tax=${taxMoney}, tip=${tipMoney}, discount=${discountMoney}, gross=${grossSalesCents}`)

        rows.push({
          externalId: order.id,
          occurred_at: (order as any).closed_at || (order as any).closedAt || (order as any).created_at || (order as any).createdAt,
          amount_cents: grossSalesCents,
          location_id: locationId,
          meta: {
            state: order.state,
            totalMoney: (order as any).total_money || order.totalMoney,
            totalTaxMoney: (order as any).total_tax_money || order.totalTaxMoney,
            totalTipMoney: (order as any).total_tip_money || order.totalTipMoney,
            totalDiscountMoney: (order as any).total_discount_money || order.totalDiscountMoney,
            lineItems: (order as any).line_items || order.lineItems,
            tenders: order.tenders
          }
        })
      } catch (orderError) {
        console.error('Error processing order:', order.id, orderError)
        console.error('Order data:', JSON.stringify(order, null, 2))
        // Skip this order and continue with others
      }
    }
    console.log(`Processed ${rows.length} rows for database insert`)

    // Batch upsert into ledger_txns
    const upserts = rows.map(r => {
      console.log(`Upserting order ${r.externalId} with amount ${r.amount_cents} cents`)
      return {
        source: 'square_order' as const,
        external_id: r.externalId,
        occurred_at: r.occurred_at,
        amount_cents: r.amount_cents,
        direction: 'inflow' as const,
        account: 'sales' as const,
        currency: 'USD',
        location_id: r.location_id,
        vendor_id: null,  // Will be linked later if needed
        category: null,   // Will be set based on order data if needed
        meta: r.meta ?? {}
      }
    })

    console.log(`Attempting to insert ${upserts.length} records into database...`)
    try {
      const { data, error } = await sb
        .from('ledger_txns')
        .upsert(upserts, { onConflict: 'external_id' })

      if (error) {
        console.error('Database insert error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw error
      }
      console.log('Database insert successful')
      console.log('Inserted data:', data)
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      console.error('Error type:', typeof dbError)
      console.error('Error properties:', Object.getOwnPropertyNames(dbError))
      throw dbError
    }

    return Response.json({
      inserted: upserts.length,
      message: `Synced ${upserts.length} orders from ${startISO} to ${endISO}`
    })

  } catch (error) {
    console.error('=== SQUARE SYNC ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Is Error instance:', error instanceof Error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)

    // Try to get more details about the error object
    try {
      console.error('Error object keys:', Object.getOwnPropertyNames(error))
      console.error('Error toString:', error?.toString())
      console.error('Error JSON:', JSON.stringify(error, null, 2))
    } catch (logError) {
      console.error('Could not log error details:', logError.message)
    }

    // Provide more specific error messages based on error type
    let errorMessage = 'Unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      errorMessage = `Object error: ${JSON.stringify(error)}`
    }

    return new Response(`Failed to sync Square data: ${errorMessage}`, { status: 500 })
  }
}

