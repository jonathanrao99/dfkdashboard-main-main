import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

// GET - Fetch inventory transactions
export async function GET(req: NextRequest) {
  const sb = supabaseServer()
  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get('itemId')
  
  try {
    let query = sb
      .from('inventory_transactions')
      .select(`
        *,
        item:inventory_items(id, name, sku)
      `)
      .order('occurred_at', { ascending: false })
      .limit(100)

    if (itemId) {
      query = query.eq('item_id', itemId)
    }

    const { data: transactions, error } = await query

    if (error) throw error

    return Response.json({ transactions: transactions || [] })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return new Response('Failed to fetch transactions', { status: 500 })
  }
}

// POST - Create inventory transaction
export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  
  try {
    const body = await req.json()
    const { item_id, transaction_type, quantity, unit_cost_cents, reference_id, reference_type, notes } = body

    if (!item_id || !transaction_type || !quantity) {
      return new Response('Missing required fields', { status: 400 })
    }

    const { data: transaction, error } = await sb
      .from('inventory_transactions')
      .insert({
        item_id,
        transaction_type,
        quantity,
        unit_cost_cents,
        reference_id,
        reference_type,
        notes
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ transaction })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return new Response('Failed to create transaction', { status: 500 })
  }
}
