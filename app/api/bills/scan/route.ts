import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { supabaseServer } from '@/lib/supabase'

const oai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function POST(req: NextRequest) {
  if (!oai) {
    return new Response('Bill scanning feature requires OPENAI_API_KEY to be configured', { status: 503 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return new Response('No file provided', { status: 400 })
  }

  const sb = supabaseServer()

  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    // Extract bill data using GPT-4 Vision
    const response = await oai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a bill/invoice extraction assistant. Extract structured data from bill images and return valid JSON only.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract all information from this bill/invoice. Return a JSON object with:
              - vendorName: string
              - invoiceNumber: string
              - invoiceDate: string (YYYY-MM-DD)
              - dueDate: string (YYYY-MM-DD)
              - subtotalCents: number (in cents)
              - taxCents: number (in cents)
              - totalCents: number (in cents)
              - lineItems: array of {description: string, quantity: number, unitPriceCents: number, totalPriceCents: number}
              
              Return ONLY valid JSON, no additional text.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })

    const extractedData = JSON.parse(response.choices[0]?.message?.content || '{}')

    if (!extractedData.vendorName || !extractedData.totalCents) {
      return new Response('Failed to extract required bill data', { status: 400 })
    }

    // Upsert vendor
    const { data: vendor, error: vendorError } = await sb
      .from('vendors')
      .upsert({
        name: extractedData.vendorName
      }, { onConflict: 'name' })
      .select('id')
      .single()

    if (vendorError || !vendor) {
      throw new Error('Failed to create/find vendor')
    }

    // Upload file to storage
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const { error: uploadError } = await sb.storage
      .from('bills')
      .upload(fileName, buffer, {
        contentType: mimeType
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
    }

    // Create bill record
    const billData = {
      vendor_id: vendor.id,
      upload_id: fileName,
      invoice_number: extractedData.invoiceNumber,
      invoice_date: extractedData.invoiceDate,
      due_date: extractedData.dueDate,
      subtotal_cents: extractedData.subtotalCents,
      tax_cents: extractedData.taxCents,
      total_cents: extractedData.totalCents,
      currency: 'USD',
      status: 'draft' as const,
      lines: extractedData.lineItems || [],
      raw_json: extractedData
    }

    const { data: bill, error: billError } = await sb
      .from('bills')
      .insert(billData)
      .select()
      .single()

    if (billError) throw billError

    // Process line items and update inventory
    const inventoryUpdates = []
    
    for (const item of extractedData.lineItems || []) {
      // Try to find matching inventory item by description
      const { data: inventoryItem } = await sb
        .from('inventory_items')
        .select('id, name')
        .ilike('name', `%${item.description}%`)
        .limit(1)
        .single()

      if (inventoryItem) {
        // Create inventory transaction
        inventoryUpdates.push({
          item_id: inventoryItem.id,
          transaction_type: 'purchase',
          quantity: item.quantity,
          unit_cost_cents: item.unitPriceCents,
          reference_id: bill.id,
          reference_type: 'bill',
          notes: `Auto-imported from bill ${extractedData.invoiceNumber || bill.id}`
        })
      }
    }

    if (inventoryUpdates.length > 0) {
      await sb.from('inventory_transactions').insert(inventoryUpdates)
    }

    return Response.json({
      success: true,
      bill,
      inventoryItemsUpdated: inventoryUpdates.length,
      message: 'Bill scanned and processed successfully'
    })

  } catch (error) {
    console.error('Bill scan error:', error)
    return new Response('Failed to scan bill', { status: 500 })
  }
}
