import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = supabaseServer()
    
    const { data: rules, error } = await sb
      .from('categorization_rules')
      .select(`
        *,
        categories(id, name, color),
        vendors(id, name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error('Error fetching categorization rules:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categorization rules' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { matcher, category_id, vendor_id } = body

    if (!matcher) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: matcher' },
        { status: 400 }
      )
    }

    if (!category_id && !vendor_id) {
      return NextResponse.json(
        { success: false, error: 'At least one of category_id or vendor_id must be provided' },
        { status: 400 }
      )
    }

    const sb = supabaseServer()

    const { data: rule, error } = await sb
      .from('categorization_rules')
      .insert({
        matcher,
        category_id: category_id || null,
        vendor_id: vendor_id || null
      })
      .select(`
        *,
        categories(id, name, color),
        vendors(id, name)
      `)
      .single()

    if (error) throw error

    // Log audit event
    await sb.from('audit_log').insert({
      event: 'CREATE_CATEGORIZATION_RULE',
      payload: { rule_id: rule.id, matcher },
      actor: 'system'
    })

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error('Error creating categorization rule:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create categorization rule' },
      { status: 500 }
    )
  }
}

