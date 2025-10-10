// Test script to verify Supabase integration
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('accounts')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

async function testTables() {
  console.log('\n🔍 Testing database tables...')
  
  const tables = [
    'accounts',
    'categories', 
    'vendors',
    'transactions',
    'revenue_orders',
    'uploads',
    'payouts',
    'reconciliations'
  ]
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: OK`)
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }
}

async function testSampleData() {
  console.log('\n🔍 Testing sample data...')
  
  try {
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name')
      .limit(5)
    
    if (catError) {
      console.log('❌ Categories:', catError.message)
    } else {
      console.log('✅ Categories:', categories?.map(c => c.name).join(', ') || 'None')
    }
    
    // Test accounts
    const { data: accounts, error: accError } = await supabase
      .from('accounts')
      .select('name, type')
      .limit(5)
    
    if (accError) {
      console.log('❌ Accounts:', accError.message)
    } else {
      console.log('✅ Accounts:', accounts?.map(a => `${a.name} (${a.type})`).join(', ') || 'None')
    }
    
  } catch (err) {
    console.error('❌ Sample data error:', err.message)
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase integration tests...\n')
  
  const connected = await testConnection()
  if (!connected) {
    process.exit(1)
  }
  
  await testTables()
  await testSampleData()
  
  console.log('\n✅ All tests completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Run the database schema: db/schema.sql')
  console.log('2. Start the development server: npm run dev')
  console.log('3. Test the API endpoints in your browser')
}

runTests().catch(console.error)


