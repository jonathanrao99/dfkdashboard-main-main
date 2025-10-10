import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { StoreHoursSettings } from '@/lib/dateWindow'

export async function GET() {
  try {
    const sb = supabaseServer()
    const { data, error } = await sb.from('store_hours_settings').select('*').single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('Error fetching store hours settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store hours settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sb = supabaseServer()
    const body = await request.json()
    const { id, timezone, useHoursFilter, days, reportingOffsetMin } = body as StoreHoursSettings & { id: string }

    if (!id || !timezone || !Array.isArray(days)) {
      return NextResponse.json(
        { success: false, error: 'Invalid store hours data' },
        { status: 400 }
      )
    }
    
    const { data, error } = await sb
      .from('store_hours_settings')
      .update({
        timezone,
        use_hours_filter: useHoursFilter,
        days,
        reporting_offset_min: reportingOffsetMin,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('Error updating store hours settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update store hours settings' },
      { status: 500 }
    )
  }
}




