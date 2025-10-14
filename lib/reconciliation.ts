import { admin } from './supabase'

// As per PRD §12 & §13

// Fetches payouts and bank deposits within a date range
async function getReconciliationData(startDate: string, endDate: string) {
  const supa = admin()
  const { data: payouts, error: payoutError } = await supa
    .from('payouts')
    .select('*')
    .gte('payout_date', startDate)
    .lte('payout_date', endDate)

  const { data: deposits, error: depositError } = await supa
    .from('transactions')
    .select('*')
    .eq('type', 'deposit')
    .gte('txn_date', startDate)
    .lte('txn_date', endDate)

  if (payoutError || depositError) {
    throw new Error(payoutError?.message || depositError?.message)
  }
  return { payouts, deposits }
}

// Simple matching logic based on amount and date proximity (naive)
function matchTransactions(payouts: any[], deposits: any[]) {
  let matchedCount = 0
  const unmatchedDeposits = [...deposits]

  for (const payout of payouts) {
    const potentialMatchIndex = unmatchedDeposits.findIndex(
      d => Math.abs(d.amount - payout.payout_amount) < 1.00 // Match within $1 tolerance
    )

    if (potentialMatchIndex !== -1) {
      matchedCount++
      unmatchedDeposits.splice(potentialMatchIndex, 1) // Remove matched deposit
    }
  }
  return { matchedCount, unmatchedCount: unmatchedDeposits.length }
}

// Generates alerts based on various rules
async function generateAlerts() {
  // PRD §13 - Alert Rules (stubs)
  const alerts: string[] = []
  // 1. High take-rate alert (TODO)
  // 2. Fuel anomaly (TODO)
  // 3. Missing CSV (TODO)
  // 4. Cash leak (TODO)

  // Example alert for unmatched deposits
  // This would be fleshed out with real data in the full implementation.
  alerts.push("Example Alert: 5 unmatched bank deposits found from last week.")

  return alerts
}

export async function runReconciliation(startDate: string, endDate: string) {
  const { payouts, deposits } = await getReconciliationData(startDate, endDate)
  const { matchedCount, unmatchedCount } = matchTransactions(payouts, deposits)
  const alerts = await generateAlerts()
  
  // Add an alert if there are unmatched deposits
  if (unmatchedCount > 0) {
    alerts.push(`Action required: ${unmatchedCount} bank deposits do not match any payouts.`)
  }

  return {
    payoutsTotal: payouts.length,
    payoutsMatched: matchedCount,
    bankUnmatched: unmatchedCount,
    alerts,
  }
}
