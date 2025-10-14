/**
 * Dashboard Report API
 * Provides KPIs, charts data, and reports for the dashboard
 * Following PRD specifications
 */

import { NextResponse } from 'next/server'
import { admin } from '@/lib/supabase'

// As per PRD §9.1
export async function GET(){
  const supa = admin()
  // TODO: query revenue_orders, transactions, payouts; compute KPIs & series
  return NextResponse.json({
    kpis: { netSalesMtd: 0, expensesMtd: 0, netProfitMtd: 0, cashToday: 0, salesTaxMtd: 0 },
    netSalesDailyMtd: [],
    expensesByCategory: [],
    netBySource: [],
    reconcile: {payoutsMatched:0, payoutsTotal:0, bankUnmatched:0, alerts:[]}
  })
}
