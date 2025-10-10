import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { accessToken, institutionName } = await req.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      )
    }

    // In a real application, you would exchange the temporary access token
    // for a permanent one and store it securely, associated with the user.
    // For this example, we'll just log it and store it in our integrations table.

    console.log('Received Teller access token:', accessToken)
    console.log('Institution name:', institutionName)

    const sb = supabaseServer()
    await sb.from('integration_items').insert({
      provider: 'teller',
      external_id: institutionName, // Using institution name as a placeholder
      access_token_enc: accessToken, // TODO: Encrypt this
      status: 'active',
    })

    return NextResponse.json({
      message: 'Bank account linked successfully',
      institutionName,
    })
  } catch (error) {
    console.error('Teller token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to link bank account' },
      { status: 500 }
    )
  }
}

