import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { billId } = await req.json()

  if (!billId) {
    return new Response('Missing billId', { status: 400 })
  }

  const sb = supabaseServer()

  try {
    // Get bill details
    const { data: bill, error: fetchError } = await sb
      .from('bills')
      .select('*')
      .eq('id', billId)
      .single()

    if (fetchError) {
      return new Response('Bill not found', { status: 404 })
    }

    if (bill.status !== 'draft') {
      return new Response('Bill is not in draft status', { status: 400 })
    }

    // Check if already posted
    const { data: existingTxn } = await sb
      .from('ledger_txns')
      .select('id')
      .eq('external_id', `bill:${bill.id}`)
      .single()

    if (existingTxn) {
      return new Response('Bill already posted', { status: 400 })
    }

    // Create AP outflow transaction (negative amount or outflow)
    const txnData = {
      source: 'bill' as const,
      external_id: `bill:${bill.id}`,
      occurred_at: new Date(bill.invoice_date || bill.created_at).toISOString(),
      amount_cents: bill.total_cents,  // positive cents
      direction: 'outflow' as const,
      account: 'ap' as const,
      vendor_id: bill.vendor_id,
      currency: bill.currency ?? 'USD',
      meta: {
        billId: bill.id,
        invoiceNumber: bill.invoice_number,
        lineItems: bill.lines
      }
    }

    const { error: txnError } = await sb
      .from('ledger_txns')
      .insert(txnData)

    if (txnError) throw txnError

    // Update bill status to posted
    const { error: updateError } = await sb
      .from('bills')
      .update({ status: 'posted' })
      .eq('id', bill.id)

    if (updateError) throw updateError

    return Response.json({
      message: 'Bill posted successfully',
      txnId: txnData.external_id
    })

  } catch (error) {
    console.error('Bill posting error:', error)
    return new Response('Failed to post bill', { status: 500 })
  }
}
