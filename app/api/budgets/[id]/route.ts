import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { cap } = body

    if (cap === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: cap' },
        { status: 400 }
      )
    }

    const sb = supabaseServer()

    const { data: budget, error } = await sb
      .from('budgets')
      .update({ cap })
      .eq('id', id)
      .select(`
        *,
        categories(id, name, color)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'UPDATE_BUDGET',
      payload: { budget_id: id, new_cap: cap },
      actor: 'system'
    })

    return NextResponse.json({ success: true, budget })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
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
      .from('budgets')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'DELETE_BUDGET',
      payload: { budget_id: id },
      actor: 'system'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}

