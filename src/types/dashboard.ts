export type RangePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'thisYear' | 'thisWeek' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'custom'
export type Grain = 'hour' | 'day' | 'month'

export interface FetchParams {
  range: RangePreset
  timezone?: string // e.g., 'America/Chicago'
  start?: string
  end?: string
  grain?: Grain
}

export interface KPIResponse {
  netSales: number      // summed over range
  expenses: number      // summed over range
  netProfit: number     // netSales - expenses
  cashInBank?: number   // if available; otherwise omit or keep today's
  deltas?: {
    netSales?: number   // % vs previous comparable period
    expenses?: number
    netProfit?: number
  }
}

export interface TimePoint {
  tsISO: string   // ISO start of bucket (hour/day/month)
  value: number
}

export interface CategoricalPoint {
  category: string
  value: number
}

export interface SeriesResponse {
  grain: Grain
  netSalesTrend: TimePoint[]          // by grain
  expensesByCategory: CategoricalPoint[] // summed over range
}

export interface DashboardResponse {
  window: {
    tz: string
    offsetMin: number
    grain: Grain
    startISO: string
    endISO: string
  }
  kpis: KPIResponse
  series: SeriesResponse
  recentTransactions?: {
    date: string
    time: string
    type: string
    amount: number
    platform: string
    status: string
  }[]
  reconcile?: {
    payoutsMatched: number
    payoutsTotal: number
    bankUnmatched: number
    alerts: string[]
  }
}
