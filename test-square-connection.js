// Simple test to check Square API connection
require('dotenv').config()

async function testSquareConnection() {
  console.log('🔗 Testing Square API connection...')

  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!accessToken) {
    console.error('❌ SQUARE_ACCESS_TOKEN not found in .env')
    return
  }

  if (!locationId) {
    console.error('❌ SQUARE_LOCATION_ID not found in .env')
    return
  }

  console.log(`📍 Location ID: ${locationId}`)
  console.log(`🔑 Token: ${accessToken.substring(0, 10)}...`)

  try {
    // Test basic location info
    const response = await fetch(`https://connect.squareup.com/v2/locations/${locationId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2023-10-18',
        'Content-Type': 'application/json'
      }
    })

    console.log(`📊 Response status: ${response.status}`)

    if (response.ok) {
      const location = await response.json()
      console.log('✅ Square API connection successful!')
      console.log(`🏪 Location: ${location.location?.name || 'Unknown'}`)
      console.log(`🏙️  City: ${location.location?.address?.locality || 'Unknown'}`)

      // Now test orders API
      console.log('\n🧪 Testing orders API...')
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const ordersResponse = await fetch('https://connect.squareup.com/v2/orders/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2023-10-18',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location_ids: [locationId],
          query: {
            filter: {
              date_time_filter: {
                created_at: {
                  start_at: `${startDate}T00:00:00Z`,
                  end_at: `${endDate}T23:59:59Z`
                }
              },
              state_filter: {
                states: ['COMPLETED']
              }
            }
          },
          limit: 10
        })
      })

      console.log(`📊 Orders response status: ${ordersResponse.status}`)

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        console.log(`✅ Orders API working! Found ${ordersData.orders?.length || 0} orders`)
      } else {
        const errorText = await ordersResponse.text()
        console.error('❌ Orders API failed:', errorText)
      }

    } else {
      const errorText = await response.text()
      console.error('❌ Square API connection failed:', errorText)
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testSquareConnection().catch(console.error)
