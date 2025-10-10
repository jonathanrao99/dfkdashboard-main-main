const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = 'https://your-project.supabase.co' // Replace with your actual Supabase URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need to set this
const supabase = createClient(supabaseUrl, supabaseKey)

// Recent orders from Square API (from the MCP response)
const orders = [
  {
    id: "ZZuscD5uYV2hzP46xKWGgtRoZ5HZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T00:17:26.181Z",
    closed_at: "2025-10-03T00:17:35.540Z",
    total_money: { amount: 4867, currency: "USD" },
    total_tax_money: { amount: 371, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "NpzFirX87AtHiNnjsu4HAubnr8LZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T01:51:18.791Z",
    closed_at: "2025-10-03T01:53:22.203Z",
    total_money: { amount: 1838, currency: "USD" },
    total_tax_money: { amount: 140, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "TeGwpZl7rGOMhFgK4YCiuu0YpeIZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T03:35:45.921Z",
    closed_at: "2025-10-03T03:45:01.351Z",
    total_money: { amount: 10808, currency: "USD" },
    total_tax_money: { amount: 824, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "d1J53l0SUFUxBel1itoKPRfi5VWZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T03:37:02.105Z",
    closed_at: "2025-10-03T03:37:08.078Z",
    total_money: { amount: 2810, currency: "USD" },
    total_tax_money: { amount: 214, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "fkCIizh3zUabmPpdnDyoA63sjUXZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T04:44:17.373Z",
    closed_at: "2025-10-03T04:46:21.398Z",
    total_money: { amount: 4110, currency: "USD" },
    total_tax_money: { amount: 313, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "DQPAFx5fmDJmHl1uh9jwjdvKqzGZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-03T22:23:17.337Z",
    closed_at: "2025-10-03T22:25:21.545Z",
    total_money: { amount: 2812, currency: "USD" },
    total_tax_money: { amount: 214, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "hdMFKI39bhnWiJfNPgBPykLbe4RZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-04T00:02:40.613Z",
    closed_at: "2025-10-04T00:04:43.744Z",
    total_money: { amount: 2378, currency: "USD" },
    total_tax_money: { amount: 181, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "ruSzDbxsEzcnyaTRRRThOYrJiCYZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-04T01:05:08.842Z",
    closed_at: "2025-10-04T01:24:56.369Z",
    total_money: { amount: 4000, currency: "USD" },
    total_tax_money: { amount: 305, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "7akhGpN5TIsQPhJQG6YmbIrrIPWZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-04T01:05:28.794Z",
    closed_at: "2025-10-04T01:06:22.486Z",
    total_money: { amount: 1406, currency: "USD" },
    total_tax_money: { amount: 107, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  },
  {
    id: "5D7CUWZ7gZdAxWYqMh5I7lVn5FUZY",
    location_id: "LRWAJVBMEHEXE",
    created_at: "2025-10-04T02:19:51.124Z",
    closed_at: "2025-10-04T02:19:56.357Z",
    total_money: { amount: 1406, currency: "USD" },
    total_tax_money: { amount: 107, currency: "USD" },
    total_tip_money: { amount: 0, currency: "USD" },
    total_discount_money: { amount: 0, currency: "USD" },
    state: "COMPLETED"
  }
  // Add more orders as needed...
]

async function syncOrders() {
  console.log(`Processing ${orders.length} orders...`)
  
  for (const order of orders) {
    try {
      // Calculate net amount (total - tax - tip + discount)
      const netAmountCents = order.total_money.amount - order.total_tax_money.amount - order.total_tip_money.amount + order.total_discount_money.amount
      
      console.log(`Processing order ${order.id}: net amount = $${netAmountCents / 100}`)
      
      // Insert into ledger_txns table
      const { data, error } = await supabase
        .from('ledger_txns')
        .upsert({
          source: 'square_order',
          external_id: order.id,
          occurred_at: order.closed_at || order.created_at,
          amount_cents: netAmountCents,
          direction: 'inflow',
          account: 'sales',
          currency: 'USD',
          location_id: order.location_id,
          vendor_id: null,
          category: null,
          meta: {
            state: order.state,
            totalMoney: order.total_money,
            totalTaxMoney: order.total_tax_money,
            totalTipMoney: order.total_tip_money,
            totalDiscountMoney: order.total_discount_money
          }
        }, { onConflict: 'external_id' })
      
      if (error) {
        console.error(`Error inserting order ${order.id}:`, error)
      } else {
        console.log(`Successfully inserted order ${order.id}`)
      }
    } catch (error) {
      console.error(`Error processing order ${order.id}:`, error)
    }
  }
  
  console.log('Sync completed!')
}

// Run the sync
syncOrders().catch(console.error)

