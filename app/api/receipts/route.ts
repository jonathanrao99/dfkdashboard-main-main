import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload file to Supabase Storage
  const { error } = await admin().storage.from('receipts').upload(filePath, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get public URL
  const { data } = admin().storage.from('receipts').getPublicUrl(filePath)

  return NextResponse.json({ receiptUrl: data.publicUrl })
}
