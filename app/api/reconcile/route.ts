import { NextRequest, NextResponse } from 'next/server'

export interface ReconcileStats {
  payoutsMatched: number
  payoutsTotal: number
  bankUnmatched: number
  alerts: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Mock reconciliation logic
    // In production, this would:
    // 1. Query revenue_orders for platform payouts
    // 2. Query payouts table for bank deposits
    // 3. Match by date (±1 day) and amount (±$2 tolerance)
    // 4. Create reconciliation records
    // 5. Return unmatched items

    const reconcileStats: ReconcileStats = {
      payoutsMatched: 12,
      payoutsTotal: 12,
      bankUnmatched: 1,
      alerts: [
        'Fuel spend +22% vs last week',
        'DoorDash take-rate 31% (target ≤28%)',
        'UberEats CSV upload pending'
      ]
    }

    return NextResponse.json({
      success: true,
      data: reconcileStats,
      message: 'Reconciliation completed'
    })
  } catch (error) {
    console.error('Reconciliation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to run reconciliation' },
      { status: 500 }
    )
  }
}


