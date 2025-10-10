import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const code = sp.get('code')
  const state = sp.get('state')

  if (!code) {
    return new Response('Missing authorization code', { status: 400 })
  }

  try {
    // Exchange auth code for access token with Square
    const tokenResponse = await fetch('https://connect.squareup.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APP_ID,
        client_secret: process.env.SQUARE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.SQUARE_REDIRECT_URI
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()

    // Get merchant and location info
    const locationsResponse = await fetch('https://connect.squareup.com/v2/locations', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Square-Version': '2023-10-18'
      }
    })

    if (!locationsResponse.ok) {
      throw new Error(`Locations fetch failed: ${locationsResponse.status}`)
    }

    const locationsData = await locationsResponse.json()
    const locations = locationsData.locations || []

    // Store each location in integration_items
    const sb = supabaseServer()
    const upserts = locations.map((location: any) => ({
      provider: 'square' as const,
      external_id: location.id,
      access_token_enc: tokenData.access_token, // TODO: encrypt this
      status: 'active' as const
    }))

    await sb.from('integration_items').upsert(upserts, { onConflict: 'provider,external_id' })

    // Redirect to success page or dashboard
    return new Response(`
      <html>
        <body>
          <h1>Square Connected Successfully!</h1>
          <p>You can now close this window and return to the dashboard.</p>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    })

  } catch (error) {
    console.error('Square OAuth error:', error)
    return new Response('OAuth setup failed', { status: 500 })
  }
}
