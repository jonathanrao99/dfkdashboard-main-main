/**
 * P&L (Profit & Loss) Calculation Functions
 * Financial formulas for the dashboard
 * Following PRD specifications
 */

// Types for financial data
export type DailyNet = { d: string; net: number }
export type CategorySpend = { category: string; value: number; color?: string }
export type SourceNet = {
  source: 'Square' | 'DoorDash' | 'UberEats' | 'Grubhub' | 'Catering'
  net: number
}

export type ReconcileStats = { payoutsMatched: number; payoutsTotal: number; bankUnmatched: number; alerts: string[] };

export type Expense = { id: string; date: string; vendor: string; category: string; amount: number; notes?: string; receiptUrl?: string };

export type InventoryItem = {
  id: string; sku?: string; name: string; unit: string; costPerUnit: number;
  unitsPerCase?: number; onHand: number; reorderPoint?: number; parLevel?: number;
  vendor?: string; category?: string
};
export type InventoryMove = {
  id: string; itemId: string; moveDate: string; qty: number; unitCost: number;
  type: 'purchase'|'usage'|'adjustment'|'waste'|'stocktake'; referenceId?: string; notes?: string
};

export interface RevenueOrder {
  items_gross: number
  discounts: number
  tax: number
  tips: number
  platform_commission: number
  processing_fees: number
  adjustments: number
  payout_amount: number
  source: string
  order_datetime: string
}

export interface Transaction {
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category_id?: string
  txn_date: string
}

// As per PRD §6
export const orderNet = (r: {
  items_gross:number, discounts:number, tax:number, tips:number, platform_commission:number, processing_fees:number, adjustments:number
}) =>
  r.items_gross - r.discounts + r.tax + r.tips - r.platform_commission - r.processing_fees + r.adjustments;

/**
 * Calculate net revenue from a revenue order
 * Formula from PRD: items_gross - discounts + tax + tips - platform_commission - processing_fees + adjustments
 */
export function calculateOrderNet(order: RevenueOrder): number {
  return (
    order.items_gross -
    order.discounts +
    order.tax +
    order.tips -
    order.platform_commission -
    order.processing_fees +
    order.adjustments
  )
}

/**
 * Calculate total net sales from multiple orders
 */
export function calculateTotalNetSales(orders: RevenueOrder[]): number {
  return orders.reduce((sum, order) => sum + calculateOrderNet(order), 0)
}

/**
 * Calculate total gross sales (before fees)
 */
export function calculateTotalGrossSales(orders: RevenueOrder[]): number {
  return orders.reduce((sum, order) => sum + order.items_gross, 0)
}

/**
 * Calculate total expenses from transactions
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

/**
 * Calculate net profit (revenue - expenses)
 */
export function calculateNetProfit(revenue: number, expenses: number): number {
  return revenue - expenses
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMargin(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0
  return (netProfit / revenue) * 100
}

/**
 * Group revenue orders by source
 */
export function groupRevenueBySource(orders: RevenueOrder[]): SourceNet[] {
  const sourceMap = new Map<string, number>()

  orders.forEach(order => {
    const currentNet = sourceMap.get(order.source) || 0
    sourceMap.set(order.source, currentNet + calculateOrderNet(order))
  })

  return Array.from(sourceMap.entries())
    .map(([source, net]) => ({
      source: source as SourceNet['source'],
      net: Math.round(net * 100) / 100
    }))
    .sort((a, b) => b.net - a.net)
}

/**
 * Group expenses by category
 */
export function groupExpensesByCategory(
  transactions: Transaction[],
  categories: Map<string, { name: string; color?: string }>
): CategorySpend[] {
  const categoryMap = new Map<string, number>()

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const categoryId = t.category_id || 'uncategorized'
      const currentValue = categoryMap.get(categoryId) || 0
      categoryMap.set(categoryId, currentValue + Math.abs(t.amount))
    })

  return Array.from(categoryMap.entries())
    .map(([categoryId, value]) => {
      const category = categories.get(categoryId)
      return {
        category: category?.name || 'Uncategorized',
        value: Math.round(value * 100) / 100,
        color: category?.color
      }
    })
    .sort((a, b) => b.value - a.value)
}

/**
 * Calculate daily net sales for sparkline/trend
 */
export function calculateDailyNetSales(orders: RevenueOrder[]): DailyNet[] {
  const dailyMap = new Map<string, number>()

  orders.forEach(order => {
    const date = new Date(order.order_datetime).toISOString().split('T')[0]
    const day = new Date(date).getDate().toString()
    const net = calculateOrderNet(order)

    dailyMap.set(day, (dailyMap.get(day) || 0) + net)
  })

  return Array.from(dailyMap.entries())
    .map(([d, net]) => ({
      d,
      net: Math.round(net * 100) / 100
    }))
    .sort((a, b) => parseInt(a.d) - parseInt(b.d))
}

/**
 * Calculate daily expenses
 */
export function calculateDailyExpenses(transactions: Transaction[]): DailyNet[] {
  const dailyMap = new Map<string, number>()

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const date = new Date(t.txn_date).toISOString().split('T')[0]
      const day = new Date(date).getDate().toString()
      const amount = Math.abs(t.amount)

      dailyMap.set(day, (dailyMap.get(day) || 0) + amount)
    })

  return Array.from(dailyMap.entries())
    .map(([d, net]) => ({
      d,
      net: Math.round(net * 100) / 100
    }))
    .sort((a, b) => parseInt(a.d) - parseInt(b.d))
}

/**
 * Calculate total sales tax collected
 */
export function calculateTotalSalesTax(orders: RevenueOrder[]): number {
  return orders.reduce((sum, order) => sum + order.tax, 0)
}

/**
 * Calculate total tips received
 */
export function calculateTotalTips(orders: RevenueOrder[]): number {
  return orders.reduce((sum, order) => sum + order.tips, 0)
}

/**
 * Calculate total platform fees (commissions + processing fees)
 */
export function calculateTotalPlatformFees(orders: RevenueOrder[]): number {
  return orders.reduce(
    (sum, order) => sum + order.platform_commission + order.processing_fees,
    0
  )
}

/**
 * Calculate average order value
 */
export function calculateAverageOrderValue(orders: RevenueOrder[]): number {
  if (orders.length === 0) return 0
  const totalNet = calculateTotalNetSales(orders)
  return totalNet / orders.length
}

/**
 * Calculate take rate (percentage of gross that goes to fees)
 */
export function calculateTakeRate(orders: RevenueOrder[]): number {
  const totalGross = calculateTotalGrossSales(orders)
  const totalFees = calculateTotalPlatformFees(orders)
  if (totalGross === 0) return 0
  return (totalFees / totalGross) * 100
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, includeCents: boolean = true): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0
  })
  return formatter.format(amount)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Calculate month-to-date totals
 */
export function filterMTD<T extends { order_datetime?: string; txn_date?: string }>(
  items: T[]
): T[] {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return items.filter(item => {
    const dateStr = item.order_datetime || item.txn_date
    if (!dateStr) return false
    const itemDate = new Date(dateStr)
    return itemDate >= startOfMonth && itemDate <= now
  })
}

/**
 * Calculate week-to-date totals
 */
export function filterWTD<T extends { order_datetime?: string; txn_date?: string }>(
  items: T[]
): T[] {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday
  startOfWeek.setHours(0, 0, 0, 0)

  return items.filter(item => {
    const dateStr = item.order_datetime || item.txn_date
    if (!dateStr) return false
    const itemDate = new Date(dateStr)
    return itemDate >= startOfWeek && itemDate <= now
  })
}

/**
 * Filter items by date range
 */
export function filterByDateRange<T extends { order_datetime?: string; txn_date?: string }>(
  items: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return items.filter(item => {
    const dateStr = item.order_datetime || item.txn_date
    if (!dateStr) return false
    const itemDate = new Date(dateStr)
    return itemDate >= startDate && itemDate <= endDate
  })
}
