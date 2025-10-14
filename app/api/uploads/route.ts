import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'
import { parse } from 'papaparse'
import { parseDoorDashRow } from '@/lib/csv/parseDoorDash'
import { parseUberEatsRow } from '@/lib/csv/parseUberEats'
import { parseGrubhubRow } from '@/lib/csv/parseGrubhub'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const source = formData.get('source') as string

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileContent = await file.text()
  
  // Use Papaparse to parse the CSV
  const parsed = parse(fileContent, { header: true, skipEmptyLines: true })
  
  let parser;
  switch (source) {
    case 'DoorDash':
      parser = parseDoorDashRow;
      break;
    case 'UberEats':
      parser = parseUberEatsRow;
      break;
    case 'Grubhub':
      parser = parseGrubhubRow;
      break;
    default:
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }

  const rows = parsed.data.map(row => parser(row as Record<string, string>))
  
  // Create an upload record
  const { data: upload, error: uploadError } = await admin()
    .from('uploads')
    .insert({
      source,
      filename: file.name,
      rows_loaded: rows.length
    })
    .select('*')
    .single()

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }
  
  // Insert the parsed rows into the revenue_orders table
  const { error } = await admin().from('revenue_orders').insert(rows.map(r => ({...r, upload_id: upload.id, source })))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rows_loaded: rows.length })
}
