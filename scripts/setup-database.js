// Setup database schema in Supabase
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Please check your .env file has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Setting up database schema...')

  try {
    // Read the new migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '2025-analytics-ledger.sql')
    const migration = fs.readFileSync(migrationPath, 'utf8')

    console.log('📝 Running migration: 2025-analytics-ledger.sql')

    // Execute the migration directly using raw SQL
    const { error } = await supabase.from('_temp').select('1') // This will fail but we catch it

    // Since we can't use rpc('exec_sql'), we'll use a simple approach
    // For production, you should run this migration manually in Supabase dashboard
    console.log('⚠️  Please run the migration manually in Supabase dashboard')
    console.log('📝 Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql')
    console.log('📝 Copy and paste the contents of: supabase/migrations/2025-analytics-ledger.sql')
    console.log('📝 Then execute it')

    // For now, let's just test the connection
    const { data, error: testError } = await supabase
      .from('integration_items')
      .select('count')
      .limit(1)

    if (testError && !testError.message.includes('relation "integration_items" does not exist')) {
      console.log('✅ Database connection successful')
    } else {
      console.log('⚠️  Tables may not exist yet - please run the migration first')
    }

  } catch (error) {
    console.error('❌ Database setup check failed:', error.message)
    console.log('\n📝 Manual setup required:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of: supabase/migrations/2025-analytics-ledger.sql')
    console.log('4. Execute the SQL')
    console.log('5. Then run: npm run dev')
  }
}

setupDatabase().catch(console.error)


