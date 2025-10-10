import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

// GET - Fetch all inventory items
export async function GET(req: NextRequest) {
  const sb = supabaseServer()
  
  try {
    const { data: items, error } = await sb
      .from('inventory_items')
      .select(`
        *,
        vendor:vendors(id, name)
      `)
      .order('name')

    if (error) throw error

    return Response.json({ items: items || [] })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return new Response('Failed to fetch inventory', { status: 500 })
  }
}

// POST - Create new inventory item
export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  
  try {
    const body = await req.json()
    const { name, sku, category, unit, reorder_point, unit_cost_cents, vendor_id, current_quantity } = body

    if (!name || !unit) {
      return new Response('Missing required fields', { status: 400 })
    }

    const { data: item, error } = await sb
      .from('inventory_items')
      .insert({
        name,
        sku,
        category,
        unit,
        reorder_point: reorder_point || 0,
        unit_cost_cents: unit_cost_cents || 0,
        vendor_id,
        current_quantity: current_quantity || 0
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ item })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return new Response('Failed to create inventory item', { status: 500 })
  }
}

// PATCH - Update inventory item
export async function PATCH(req: NextRequest) {
  const sb = supabaseServer()
  
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return new Response('Missing item ID', { status: 400 })
    }

    const { data: item, error } = await sb
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return Response.json({ item })
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return new Response('Failed to update inventory item', { status: 500 })
  }
}
