// Test script to sync Square data
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testSquareSync() {
  console.log('🧪 Testing Square sync...')

  try {
    // Use a recent date range for testing
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 7) // Last 7 days

    const startISO = startDate.toISOString()
    const endISO = endDate.toISOString()
    const locationId = process.env.SQUARE_LOCATION_ID || 'LRWAJVBMEHEXE'

    console.log(`📅 Syncing from ${startISO} to ${endISO}`)
    console.log(`📍 Location ID: ${locationId}`)

    const response = await fetch('http://localhost:3000/api/square/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        startISO,
        endISO
      })
    })

    const resultText = await response.text()
    console.log(`📊 Sync response status: ${response.status}`)
    console.log(`📄 Response: ${resultText}`)

    if (response.ok) {
      try {
        const result = JSON.parse(resultText)
        console.log('✅ Sync successful!')
        console.log(`📊 Inserted ${result.inserted} orders`)
        console.log(`💬 Message: ${result.message}`)
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError.message)
      }
    } else {
      console.error('❌ Sync failed with status:', response.status)
    }

    // Test analytics API
    console.log('\n🧪 Testing analytics API...')
    const analyticsResponse = await fetch('http://localhost:3000/api/analytics?range=last7&grain=day')
    const analyticsText = await analyticsResponse.text()

    console.log(`📊 Analytics response status: ${analyticsResponse.status}`)

    if (analyticsResponse.ok) {
      try {
        const analyticsResult = JSON.parse(analyticsText)
        console.log('✅ Analytics API working!')
        console.log(`💰 Net Sales: $${analyticsResult.kpis.netSales}`)
        console.log(`📈 Data points: ${analyticsResult.series.netSalesTrend.length}`)
      } catch (parseError) {
        console.error('❌ Failed to parse analytics JSON:', parseError.message)
      }
    } else {
      console.error('❌ Analytics API failed with status:', analyticsResponse.status)
      console.error('Response:', analyticsText)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testSquareSync().catch(console.error)
