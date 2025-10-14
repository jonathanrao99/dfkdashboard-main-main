import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'
import { onHandFromMoves } from '@/lib/inventory'

// GET /api/inventory/items - List all inventory items with on-hand counts
export async function GET() {
  const { data: items, error: itemsError } = await admin()
    .from('inventory_items')
    .select('*, vendors(name), categories(name)')

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  const { data: moves, error: movesError } = await admin()
    .from('inventory_moves')
    .select('item_id, qty')

  if (movesError) {
    return NextResponse.json({ error: movesError.message }, { status: 500 })
  }

  // Calculate on-hand quantity for each item
  const itemsWithOnHand = items.map(item => {
    const itemMoves = moves.filter(m => m.item_id === item.id)
    const onHand = onHandFromMoves(itemMoves)
    return { 
      ...item, 
      onHand,
      vendor: (item.vendors as { name: string })?.name || 'N/A',
      category: (item.categories as { name: string })?.name || 'Uncategorized',
    }
  })

  return NextResponse.json({ items: itemsWithOnHand })
}

// POST /api/inventory/items - Create a new inventory item
export async function POST(req: Request) {
  const b = await req.json()
  const { error } = await admin().from('inventory_items').insert({
    sku: b.sku,
    name: b.name,
    unit: b.unit,
    units_per_case: b.unitsPerCase,
    cost_per_unit: b.costPerUnit,
    vendor_id: b.vendorId,
    category_id: b.categoryId,
    reorder_point: b.reorderPoint,
    par_level: b.parLevel,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
