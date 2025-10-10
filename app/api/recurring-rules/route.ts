import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = supabaseServer()
    
    const { data: rules, error } = await sb
      .from('recurring_rules')
      .select(`
        *,
        categories(id, name),
        vendors(id, name)
      `)
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error('Error fetching recurring rules:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recurring rules' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, day_of_month, amount, category_id, vendor_id } = body

    if (!name || !day_of_month || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, day_of_month, amount' },
        { status: 400 }
      )
    }

    if (day_of_month < 1 || day_of_month > 28) {
      return NextResponse.json(
        { success: false, error: 'day_of_month must be between 1 and 28' },
        { status: 400 }
      )
    }

    const sb = supabaseServer()

    const { data: rule, error } = await sb
      .from('recurring_rules')
      .insert({
        name,
        day_of_month,
        amount,
        category_id: category_id || null,
        vendor_id: vendor_id || null
      })
      .select(`
        *,
        categories(id, name),
        vendors(id, name)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'CREATE_RECURRING_RULE',
      payload: { rule_id: rule.id, name: rule.name },
      actor: 'system' // Replace with actual user ID when auth is implemented
    })

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error('Error creating recurring rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create recurring rule' },
      { status: 500 }
    )
  }
}

