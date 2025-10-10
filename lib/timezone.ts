// Simple timezone handling without dayjs for now
export const BUSINESS_TZ = process.env.BUSINESS_TZ ?? 'America/Chicago'
export const REPORTING_OFFSET_MIN = Number(process.env.REPORTING_OFFSET_MIN ?? 120) // 2:00 AM
export const SALES_TIMESTAMP_FIELD: 'closed_at' | 'paid_at' | 'created_at' = 'closed_at'

// Simple timezone offset calculation
function getTimezoneOffset(timezone: string): number {
  const timezoneOffsets: { [key: string]: number } = {
    'America/New_York': -5 * 60, // EST
    'America/Chicago': -6 * 60,  // CST
    'America/Denver': -7 * 60,   // MST
    'America/Los_Angeles': -8 * 60, // PST
    'UTC': 0
  }
  
  return timezoneOffsets[timezone] || -6 * 60 // Default to CST
}

// Get time window for a given range preset
export function getWindow(range: string, tz: string, offsetMin: number) {
  const now = new Date()
  const tzOffset = getTimezoneOffset(tz)
  const localNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 60000))
  
  // Get start of day in the timezone
  const startOfToday = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate())
  
  // Apply reporting day offset (2:00 AM = 120 minutes)
  const reportingStart = new Date(startOfToday.getTime() + (offsetMin * 60000))
  const reportingEnd = new Date(reportingStart.getTime() + (24 * 60 * 60 * 1000))

  switch (range) {
    case 'today': {
      return { 
        start: reportingStart, 
        end: reportingEnd 
      }
    }
    case 'yesterday': {
      const yesterdayStart = new Date(reportingStart.getTime() - (24 * 60 * 60 * 1000))
      return { 
        start: yesterdayStart, 
        end: reportingStart 
      }
    }
    case 'last7': {
      const last7Start = new Date(reportingStart.getTime() - (6 * 24 * 60 * 60 * 1000))
      return { 
        start: last7Start, 
        end: reportingEnd 
      }
    }
    case 'last30': {
      const last30Start = new Date(reportingStart.getTime() - (29 * 24 * 60 * 60 * 1000))
      return { 
        start: last30Start, 
        end: reportingEnd 
      }
    }
    case 'thisMonth': {
      const monthStart = new Date(localNow.getFullYear(), localNow.getMonth(), 1)
      const monthStartReporting = new Date(monthStart.getTime() + (offsetMin * 60000))
      const nextMonthStart = new Date(localNow.getFullYear(), localNow.getMonth() + 1, 1)
      const nextMonthStartReporting = new Date(nextMonthStart.getTime() + (offsetMin * 60000))
      return { 
        start: monthStartReporting, 
        end: nextMonthStartReporting 
      }
    }
    case 'thisYear': {
      const yearStart = new Date(localNow.getFullYear(), 0, 1)
      const yearStartReporting = new Date(yearStart.getTime() + (offsetMin * 60000))
      const nextYearStart = new Date(localNow.getFullYear() + 1, 0, 1)
      const nextYearStartReporting = new Date(nextYearStart.getTime() + (offsetMin * 60000))
      return { 
        start: yearStartReporting, 
        end: nextYearStartReporting 
      }
    }
    default: {
      const defaultStart = new Date(reportingStart.getTime() - (29 * 24 * 60 * 60 * 1000))
      return { 
        start: defaultStart, 
        end: reportingEnd 
      }
    }
  }
}

// Map preset to grain
export function presetToGrain(p: string): 'hour' | 'day' | 'month' {
  if (p === 'today' || p === 'yesterday') return 'hour'
  if (p === 'thisYear') return 'month'
  return 'day'
}

// Generate time buckets with proper offset handling
export function generateTimeBuckets(start: Date, end: Date, grain: 'hour' | 'day' | 'month'): string[] {
  const buckets: string[] = []
  const current = new Date(start)
  
  while (current < end) {
    let bucketKey: string
    
    switch (grain) {
      case 'hour':
        bucketKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}T${String(current.getHours()).padStart(2, '0')}:00:00`
        current.setHours(current.getHours() + 1)
        break
      case 'day':
        bucketKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}T00:00:00`
        current.setDate(current.getDate() + 1)
        break
      case 'month':
        bucketKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01T00:00:00`
        current.setMonth(current.getMonth() + 1)
        break
    }
    
    buckets.push(bucketKey)
  }
  
  return buckets
}

// Aggregate data by grain with proper offset handling
export function aggregateByGrain(data: any[], grain: 'hour' | 'day' | 'month', start: Date, end: Date) {
  const aggregated = new Map<string, number>()
  
  data.forEach(item => {
    // Use the correct timestamp field
    const timestamp = item.closed_at || item.paid_at || item.order_datetime || item.created_at
    const date = new Date(timestamp)
    
    let key: string
    
    switch (grain) {
      case 'hour':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:00:00`
        break
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01T00:00:00`
        break
    }
    
    const amount = Number(item.payout_amount || item.amount || 0) || 0
    aggregated.set(key, (aggregated.get(key) || 0) + amount)
  })
  
  // Generate all buckets and zero-fill missing ones
  const allBuckets = generateTimeBuckets(start, end, grain)
  
  return allBuckets.map(bucket => ({
    ts: bucket,
    value: Math.round((aggregated.get(bucket) || 0) * 100) / 100
  }))
}