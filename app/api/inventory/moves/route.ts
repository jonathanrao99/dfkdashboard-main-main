import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'

// POST /api/inventory/moves - Record a new inventory movement
export async function POST(req: Request) {
  const b = await req.json()
  const { error } = await admin().from('inventory_moves').insert({
    item_id: b.itemId,
    qty: b.qty,
    unit_cost: b.unitCost,
    type: b.type,
    reference_id: b.referenceId,
    notes: b.notes,
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
