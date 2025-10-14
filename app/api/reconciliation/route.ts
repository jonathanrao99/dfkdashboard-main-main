import { NextResponse } from 'next/server'
import { runReconciliation } from '@/lib/reconciliation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate') || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
  const endDate = searchParams.get('endDate') || new Date().toISOString()

  try {
    const reconciliationData = await runReconciliation(startDate, endDate)
    return NextResponse.json(reconciliationData)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
