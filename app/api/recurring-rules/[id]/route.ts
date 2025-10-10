import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, day_of_month, amount, category_id, vendor_id } = body

    if (day_of_month && (day_of_month < 1 || day_of_month > 28)) {
      return NextResponse.json(
        { success: false, error: 'day_of_month must be between 1 and 28' },
        { status: 400 }
      )
    }

    const sb = supabaseServer()

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (day_of_month !== undefined) updateData.day_of_month = day_of_month
    if (amount !== undefined) updateData.amount = amount
    if (category_id !== undefined) updateData.category_id = category_id
    if (vendor_id !== undefined) updateData.vendor_id = vendor_id

    const { data: rule, error } = await sb
      .from('recurring_rules')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories(id, name),
        vendors(id, name)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'UPDATE_RECURRING_RULE',
      payload: { rule_id: id, changes: updateData },
      actor: 'system'
    })

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error('Error updating recurring rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update recurring rule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sb = supabaseServer()

    const { error } = await sb
      .from('recurring_rules')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'DELETE_RECURRING_RULE',
      payload: { rule_id: id },
      actor: 'system'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting recurring rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete recurring rule' },
      { status: 500 }
    )
  }
}

