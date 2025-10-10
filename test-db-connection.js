// Test database connection and basic insert
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

async function testDatabase() {
  console.log('🧪 Testing database connection...')

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('ledger_txns')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
    } else {
      console.log('✅ Database connection successful')
    }

    // Test insert
    console.log('🧪 Testing database insert...')
    const testRecord = {
      source: 'test',
      external_id: `test-${Date.now()}`,
      occurred_at: new Date().toISOString(),
      amount_cents: 100,
      direction: 'inflow',
      account: 'sales',
      currency: 'USD',
      location_id: 'TEST',
      vendor_id: null,
      category: null,
      meta: { test: true }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('ledger_txns')
      .insert(testRecord)
      .select()

    if (insertError) {
      console.error('❌ Database insert failed:', insertError.message)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
    } else {
      console.log('✅ Database insert successful!')
      console.log('Inserted record:', insertData)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Error stack:', error.stack)
  }
}

testDatabase().catch(console.error)
