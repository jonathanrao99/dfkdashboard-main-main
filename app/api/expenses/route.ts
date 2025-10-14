import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'

// GET /api/expenses - List all expenses
export async function GET() {
  const { data, error } = await admin()
    .from('transactions')
    .select('*, vendors(name), categories(name)')
    .eq('type', 'expense')
    .order('txn_date', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data for the client
  const items = data.map(t => ({
    id: t.id,
    date: t.txn_date,
    vendor: (t.vendors as { name: string })?.name || 'N/A',
    category: (t.categories as { name: string })?.name || 'Uncategorized',
    amount: -t.amount, // amount is stored negative for expenses
    notes: t.description,
    receiptUrl: t.receipt_url,
  }))

  return NextResponse.json({ items })
}

// POST /api/expenses - Create a new expense
export async function POST(req: Request) {
  const body = await req.json()
  
  // Basic validation
  if (!body.date || !body.amount || !body.vendor || !body.category_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await admin()
    .from('transactions')
    .insert({
      account_id: body.account_id, // This needs to be determined, will use a placeholder for now
      txn_date: body.date,
      amount: -Math.abs(body.amount), // Ensure amount is negative for expenses
      type: 'expense',
      description: body.notes,
      vendor_id: body.vendor_id,
      category_id: body.category_id,
      receipt_url: body.receipt_url,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ id: data.id })
}

// PATCH /api/expenses - Update an expense
export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...updateData } = body

  if (!id) {
    return NextResponse.json({ error: 'ID is required for update' }, { status: 400 })
  }

  const { data, error } = await admin()
    .from('transactions')
    .update({
      txn_date: updateData.date,
      amount: -Math.abs(updateData.amount),
      description: updateData.notes,
      vendor_id: updateData.vendor_id,
      category_id: updateData.category_id,
      receipt_url: updateData.receipt_url,
    })
    .eq('id', id)
    .eq('type', 'expense')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ id })
}

// DELETE /api/expenses - Delete an expense
export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 })
  }

  const { error } = await admin()
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('type', 'expense')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
