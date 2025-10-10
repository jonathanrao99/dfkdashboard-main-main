// P&L Builder for Reports
import { supabaseAdmin } from './supabase'

export interface PnLData {
  period: string
  revenue: {
    square: number
    doordash: number
    ubereats: number
    grubhub: number
    catering: number
    total: number
  }
  expenses: {
    foodSupplies: number
    fuel: number
    labor: number
    permits: number
    equipment: number
    processing: number
    total: number
  }
  netProfit: number
  profitMargin: number
}

export interface CashFlowData {
  period: string
  dailyFlow: Array<{
    date: string
    inflow: number
    outflow: number
    net: number
  }>
  summary: {
    totalInflow: number
    totalOutflow: number
    netFlow: number
    endingBalance: number
  }
}

export interface ReconciliationData {
  period: string
  platforms: Record<string, {
    transactions: number
    matched: number
    unmatched: number
    amount: number
    status: 'complete' | 'pending'
  }>
  bankDeposits: {
    total: number
    matched: number
    unmatched: number
    amount: number
  }
}

// Real P&L generator that queries Supabase
export async function generatePnL(startDate: string, endDate: string): Promise<PnLData> {
  try {
    // Get revenue data from revenue_orders (prioritize Square data)
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('revenue_orders')
      .select('source, payout_amount, order_datetime')
      .gte('order_datetime', startDate)
      .lte('order_datetime', endDate)
      .order('source', { ascending: true }) // Square will come first alphabetically

    if (revenueError) throw revenueError

    // Aggregate revenue by source
    const revenue = {
      square: 0,
      doordash: 0,
      ubereats: 0,
      grubhub: 0,
      catering: 0,
      total: 0
    }

    revenueData?.forEach(order => {
      const amount = Number(order.payout_amount) || 0
      revenue.total += amount
      
      switch (order.source.toLowerCase()) {
        case 'square':
          revenue.square += amount
          break
        case 'doordash':
          revenue.doordash += amount
          break
        case 'ubereats':
          revenue.ubereats += amount
          break
        case 'grubhub':
          revenue.grubhub += amount
          break
        case 'catering':
          revenue.catering += amount
          break
        default:
          // Handle any other sources
          console.log(`Unknown revenue source: ${order.source}`)
      }
    })

    // Get expense data from transactions
    const { data: expenseData, error: expenseError } = await supabaseAdmin
      .from('transactions')
      .select(`
        amount,
        categories(name)
      `)
      .eq('type', 'expense')
      .gte('txn_date', startDate)
      .lte('txn_date', endDate)

    if (expenseError) throw expenseError

    // Aggregate expenses by category
    const expenses = {
      foodSupplies: 0,
      fuel: 0,
      labor: 0,
      permits: 0,
      equipment: 0,
      processing: 0,
      total: 0
    }

    expenseData?.forEach(transaction => {
      const amount = Math.abs(Number(transaction.amount)) || 0
      expenses.total += amount
      
      const categoryName = (transaction.categories as any)?.name?.toLowerCase() || ''
      
      if (categoryName.includes('food') || categoryName.includes('supplies') || categoryName.includes('inventory')) {
        expenses.foodSupplies += amount
      } else if (categoryName.includes('fuel') || categoryName.includes('gas')) {
        expenses.fuel += amount
      } else if (categoryName.includes('labor') || categoryName.includes('payroll') || categoryName.includes('wage')) {
        expenses.labor += amount
      } else if (categoryName.includes('permit') || categoryName.includes('license')) {
        expenses.permits += amount
      } else if (categoryName.includes('equipment') || categoryName.includes('maintenance')) {
        expenses.equipment += amount
      } else if (categoryName.includes('processing') || categoryName.includes('fee')) {
        expenses.processing += amount
      }
    })

    const netProfit = revenue.total - expenses.total
    const profitMargin = revenue.total > 0 ? (netProfit / revenue.total) * 100 : 0

    return {
      period: `${startDate} to ${endDate}`,
      revenue,
      expenses,
      netProfit,
      profitMargin: Math.round(profitMargin * 10) / 10
    }
  } catch (error) {
    console.error('Error generating P&L:', error)
    // Return empty data on error
    return {
      period: `${startDate} to ${endDate}`,
      revenue: { square: 0, doordash: 0, ubereats: 0, grubhub: 0, catering: 0, total: 0 },
      expenses: { foodSupplies: 0, fuel: 0, labor: 0, permits: 0, equipment: 0, processing: 0, total: 0 },
      netProfit: 0,
      profitMargin: 0
    }
  }
}

export async function generateCashFlow(startDate: string, endDate: string): Promise<CashFlowData> {
  try {
    // Get daily revenue data
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('revenue_orders')
      .select('order_datetime, payout_amount')
      .gte('order_datetime', startDate)
      .lte('order_datetime', endDate)
      .order('order_datetime', { ascending: true })

    if (revenueError) throw revenueError

    // Get daily expense data
    const { data: expenseData, error: expenseError } = await supabaseAdmin
      .from('transactions')
      .select('txn_date, amount')
      .eq('type', 'expense')
      .gte('txn_date', startDate)
      .lte('txn_date', endDate)
      .order('txn_date', { ascending: true })

    if (expenseError) throw expenseError

    // Group by date
    const dailyMap = new Map<string, { inflow: number; outflow: number }>()

    // Process revenue
    revenueData?.forEach(order => {
      const date = order.order_datetime.split('T')[0]
      const amount = Number(order.payout_amount) || 0
      const existing = dailyMap.get(date) || { inflow: 0, outflow: 0 }
      dailyMap.set(date, { ...existing, inflow: existing.inflow + amount })
    })

    // Process expenses
    expenseData?.forEach(transaction => {
      const date = transaction.txn_date
      const amount = Math.abs(Number(transaction.amount)) || 0
      const existing = dailyMap.get(date) || { inflow: 0, outflow: 0 }
      dailyMap.set(date, { ...existing, outflow: existing.outflow + amount })
    })

    // Convert to array and calculate net
    const dailyFlow = Array.from(dailyMap.entries()).map(([date, amounts]) => ({
      date,
      inflow: amounts.inflow,
      outflow: amounts.outflow,
      net: amounts.inflow - amounts.outflow
    })).sort((a, b) => a.date.localeCompare(b.date))

    // Calculate summary
    const totalInflow = dailyFlow.reduce((sum, day) => sum + day.inflow, 0)
    const totalOutflow = dailyFlow.reduce((sum, day) => sum + day.outflow, 0)
    const netFlow = totalInflow - totalOutflow

    return {
      period: `${startDate} to ${endDate}`,
      dailyFlow,
      summary: {
        totalInflow,
        totalOutflow,
        netFlow,
        endingBalance: netFlow // Simplified - in real app would track actual balance
      }
    }
  } catch (error) {
    console.error('Error generating cash flow:', error)
    return {
      period: `${startDate} to ${endDate}`,
      dailyFlow: [],
      summary: {
        totalInflow: 0,
        totalOutflow: 0,
        netFlow: 0,
        endingBalance: 0
      }
    }
  }
}

export async function generateReconciliation(startDate: string, endDate: string): Promise<ReconciliationData> {
  try {
    // Get revenue orders by platform
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('revenue_orders')
      .select('source, payout_amount, id')
      .gte('order_datetime', startDate)
      .lte('order_datetime', endDate)

    if (revenueError) throw revenueError

    // Get reconciliation data
    const { data: reconciliationData, error: reconError } = await supabaseAdmin
      .from('reconciliations')
      .select('revenue_order_id, payout_id, transaction_id')
      .gte('linked_at', startDate)
      .lte('linked_at', endDate)

    if (reconError) throw reconError

    // Get bank deposits
    const { data: bankData, error: bankError } = await supabaseAdmin
      .from('payouts')
      .select('id, amount, source')
      .gte('payout_date', startDate)
      .lte('payout_date', endDate)

    if (bankError) throw bankError

    // Process platform data
    const platforms: Record<string, any> = {}
    const platformGroups = revenueData?.reduce((acc, order) => {
      const source = order.source.toLowerCase()
      if (!acc[source]) {
        acc[source] = { orders: [], totalAmount: 0 }
      }
      acc[source].orders.push(order)
      acc[source].totalAmount += Number(order.payout_amount) || 0
      return acc
    }, {} as Record<string, any>) || {}

    // Calculate matched/unmatched for each platform
    const reconciledOrderIds = new Set(reconciliationData?.map(r => r.revenue_order_id) || [])
    
    Object.entries(platformGroups).forEach(([platform, data]) => {
      const matched = data.orders.filter((order: any) => reconciledOrderIds.has(order.id)).length
      const total = data.orders.length
      
      platforms[platform] = {
        transactions: total,
        matched,
        unmatched: total - matched,
        amount: data.totalAmount,
        status: matched === total ? 'complete' : 'pending'
      }
    })

    // Process bank deposits
    const totalBankDeposits = bankData?.length || 0
    const matchedBankDeposits = reconciliationData?.filter(r => r.payout_id).length || 0
    const totalBankAmount = bankData?.reduce((sum, deposit) => sum + (Number(deposit.amount) || 0), 0) || 0

    return {
      period: `${startDate} to ${endDate}`,
      platforms,
      bankDeposits: {
        total: totalBankDeposits,
        matched: matchedBankDeposits,
        unmatched: totalBankDeposits - matchedBankDeposits,
        amount: totalBankAmount
      }
    }
  } catch (error) {
    console.error('Error generating reconciliation:', error)
    return {
      period: `${startDate} to ${endDate}`,
      platforms: {},
      bankDeposits: {
        total: 0,
        matched: 0,
        unmatched: 0,
        amount: 0
      }
    }
  }
}

