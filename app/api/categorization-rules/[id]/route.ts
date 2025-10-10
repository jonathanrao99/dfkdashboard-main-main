import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { matcher, category_id, vendor_id } = body

    const sb = supabaseServer()

    const updateData: any = {}
    if (matcher !== undefined) updateData.matcher = matcher
    if (category_id !== undefined) updateData.category_id = category_id
    if (vendor_id !== undefined) updateData.vendor_id = vendor_id

    const { data: rule, error } = await sb
      .from('categorization_rules')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories(id, name, color),
        vendors(id, name)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'UPDATE_CATEGORIZATION_RULE',
      payload: { rule_id: id, changes: updateData },
      actor: 'system'
    })

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error('Error updating categorization rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update categorization rule' },
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
      .from('categorization_rules')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'DELETE_CATEGORIZATION_RULE',
      payload: { rule_id: id },
      actor: 'system'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting categorization rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete categorization rule' },
      { status: 500 }
    )
  }
}

