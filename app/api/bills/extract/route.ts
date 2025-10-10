import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { supabaseServer } from '@/lib/supabase'

const oai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

const BILL_SCHEMA = {
  type: 'object',
  properties: {
    vendorName: { type: 'string' },
    invoiceNumber: { type: 'string' },
    invoiceDate: { type: 'string', format: 'date' },
    dueDate: { type: 'string', format: 'date' },
    subtotalCents: { type: 'integer' },
    taxCents: { type: 'integer' },
    totalCents: { type: 'integer' },
    lineItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          quantity: { type: 'number' },
          unitPriceCents: { type: 'integer' },
          totalPriceCents: { type: 'integer' }
        },
        required: ['description', 'quantity', 'unitPriceCents', 'totalPriceCents']
      }
    }
  },
  required: ['vendorName', 'invoiceDate', 'totalCents', 'lineItems']
}

export async function POST(req: NextRequest) {
  if (!oai) {
    return new Response('Bill extraction feature requires OPENAI_API_KEY to be configured', { status: 503 })
  }

  const { filePath, vendorNameHint } = await req.json()

  if (!filePath) {
    return new Response('Missing filePath', { status: 400 })
  }

  try {
    // Download file from Supabase Storage
    const sb = supabaseServer()
    const { data: fileData, error: downloadError } = await sb.storage
      .from('bills')
      .download(filePath)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    // Convert file to text (for now, assume it's a text file or PDF that can be read as text)
    // TODO: For PDFs, you might need a PDF parsing library or vision API
    const fileText = await fileData.text()

    // Extract structured data using OpenAI
    const prompt = `Extract bill/invoice information from the following text. ${vendorNameHint ? `Vendor name hint: ${vendorNameHint}` : ''}

Return valid JSON matching this schema:
${JSON.stringify(BILL_SCHEMA, null, 2)}

Text content:
${fileText}`

    const resp = await oai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a bill/invoice extraction assistant. Extract structured data from bill text and return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })

    const extractedData = JSON.parse(resp.choices[0]?.message?.content || '{}')

    // Validate required fields
    if (!extractedData.vendorName || !extractedData.invoiceDate || !extractedData.totalCents) {
      return new Response('Failed to extract required fields from bill', { status: 400 })
    }

    // Upsert vendor if needed
    const { data: vendor } = await sb
      .from('vendors')
      .upsert({
        name: extractedData.vendorName,
        square_id: null // Will be linked later if needed
      }, { onConflict: 'name' })
      .select('id')
      .single()

    if (!vendor) {
      throw new Error('Failed to create/find vendor')
    }

    // Create bill record
    const billData = {
      vendor_id: vendor.id,
      upload_id: filePath,
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

    const { data: bill, error: insertError } = await sb
      .from('bills')
      .insert(billData)
      .select()
      .single()

    if (insertError) throw insertError

    return Response.json({
      billId: bill.id,
      extracted: extractedData,
      message: 'Bill extracted successfully'
    })

  } catch (error) {
    console.error('Bill extraction error:', error)
    return new Response('Failed to extract bill data', { status: 500 })
  }
}
