import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseDoorDashRow } from '@/lib/csv/parseDoorDash'
import { parseUberEatsRow } from '@/lib/csv/parseUberEats'
import { parseGrubhubRow } from '@/lib/csv/parseGrubhub'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const source = formData.get('source') as string // 'doordash', 'ubereats', 'grubhub'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'Source platform not specified' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are supported' },
        { status: 400 }
      )
    }

    // Read file content
    const content = await file.text()
    const lines = content.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'CSV file appears to be empty or invalid' },
        { status: 400 }
      )
    }

    // Parse CSV headers and rows
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    // Parse data based on source
    let parsedData = []
    
    switch (source.toLowerCase()) {
      case 'doordash':
        parsedData = rows.map(row => parseDoorDashRow(row))
        break
      case 'ubereats':
        parsedData = rows.map(row => parseUberEatsRow(row))
        break
      case 'grubhub':
        parsedData = rows.map(row => parseGrubhubRow(row))
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported platform' },
          { status: 400 }
        )
    }

    // Upload file to Supabase Storage
    const fileName = `${source}_${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('csv-uploads')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    // Get file URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('csv-uploads')
      .getPublicUrl(fileName)

    // Create upload record
    const { data: uploadRecord, error: uploadRecordError } = await supabaseAdmin
      .from('uploads')
      .insert({
        source: source.toLowerCase(),
        filename: file.name,
        rows_loaded: parsedData.length,
        notes: `Uploaded via API - ${parsedData.length} records processed`
      })
      .select('id')
      .single()

    if (uploadRecordError) {
      throw uploadRecordError
    }

    // Get platform account ID
    const { data: account } = await supabaseAdmin
      .from('accounts')
      .select('id')
      .eq('name', source.charAt(0).toUpperCase() + source.slice(1))
      .single()

    if (!account) {
      throw new Error(`Account not found for ${source}`)
    }

    // Insert revenue orders
    const revenueOrders = parsedData.map(order => ({
      upload_id: uploadRecord.id,
      source: source.toLowerCase(),
      order_id: order.order_id,
      order_datetime: order.order_datetime,
      items_gross: order.items_gross,
      discounts: order.discounts,
      tax: order.tax,
      tips: order.tips,
      platform_commission: order.platform_commission,
      processing_fees: order.processing_fees,
      adjustments: order.adjustments,
      payout_amount: order.payout_amount,
      raw: order.raw
    }))

    const { error: insertError } = await supabaseAdmin
      .from('revenue_orders')
      .insert(revenueOrders)

    if (insertError) {
      throw insertError
    }

    // Calculate total revenue
    const totalRevenue = parsedData.reduce((sum, record) => sum + (record.payout_amount || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        source,
        recordsProcessed: parsedData.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        uploadedAt: new Date().toISOString(),
        uploadId: uploadRecord.id,
        fileUrl: publicUrl
      },
      message: `Successfully processed ${parsedData.length} records from ${source}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}