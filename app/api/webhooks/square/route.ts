import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-square-signature')

    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.SQUARE_WEBHOOK_SECRET!)
      .update(body)
      .digest('base64')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const payload = JSON.parse(body)

    // Process order events
    if (payload.type === 'order.updated' && payload.data?.object?.order) {
      const order = payload.data.object.order

      // Only process closed orders
      if (order.state !== 'COMPLETED') {
        return new Response('ok')
      }

      // Calculate net amount (total - tax - tip, etc.)
      const totalMoney = order.totalMoney?.amount || 0
      const taxMoney = order.totalTaxMoney?.amount || 0
      const tipMoney = order.totalTipMoney?.amount || 0
      const discountMoney = order.totalDiscountMoney?.amount || 0

      // Net amount = total - tax - tip + discount (adjust based on your needs)
      const netAmountCents = totalMoney - taxMoney - tipMoney + discountMoney

      const row = {
        source: 'square_order' as const,
        external_id: order.id,
        occurred_at: order.closedAt || order.createdAt,
        amount_cents: netAmountCents,
        direction: 'inflow' as const,
        account: 'sales' as const,
        currency: 'USD',
        location_id: order.locationId,
        meta: {
          state: order.state,
          totalMoney: order.totalMoney,
          totalTaxMoney: order.totalTaxMoney,
          totalTipMoney: order.totalTipMoney,
          totalDiscountMoney: order.totalDiscountMoney,
          lineItems: order.lineItems
        }
      }

      await supabaseServer()
        .from('ledger_txns')
        .upsert(row, { onConflict: 'external_id' })

      console.log(`Processed Square order ${order.id}`)
    }

    return new Response('ok')

  } catch (error) {
    console.error('Square webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
