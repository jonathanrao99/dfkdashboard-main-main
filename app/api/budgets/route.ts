import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month') // Format: YYYY-MM-01
    
    const sb = supabaseServer()
    
    let query = sb
      .from('budgets')
      .select(`
        *,
        categories(id, name, color)
      `)
      .order('month', { ascending: false })

    if (month) {
      query = query.eq('month', month)
    }

    const { data: budgets, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, budgets })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { category_id, month, cap } = body

    if (!category_id || !month || !cap) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: category_id, month, cap' },
        { status: 400 }
      )
    }

    const sb = supabaseServer()

    // Check if budget already exists for this category and month
    const { data: existing } = await sb
      .from('budgets')
      .select('id')
      .eq('category_id', category_id)
      .eq('month', month)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Budget already exists for this category and month' },
        { status: 409 }
      )
    }

    const { data: budget, error } = await sb
      .from('budgets')
      .insert({ category_id, month, cap })
      .select(`
        *,
        categories(id, name, color)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'CREATE_BUDGET',
      payload: { budget_id: budget.id, category_id, month, cap },
      actor: 'system'
    })

    return NextResponse.json({ success: true, budget })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}

