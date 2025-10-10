import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export type RangePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'thisYear'
export type Grain = 'hour' | 'day' | 'month'

export function presetToGrain(p: RangePreset): Grain {
  if (p === 'today' || p === 'yesterday') return 'hour'
  if (p === 'thisYear') return 'month'
  return 'day'
}

// Start of "reporting day" with offset (e.g., 2:00 AM)
export function startOfReportingDay(d: dayjs.Dayjs, tz: string, offsetMin: number) {
  const shifted = d.tz(tz).subtract(offsetMin, 'minute')
  return shifted.startOf('day').add(offsetMin, 'minute')
}

export function getWindow(preset: RangePreset, tz: string, offsetMin: number) {
  const now = dayjs().tz(tz)
  const todayStart = startOfReportingDay(now, tz, offsetMin)
  const tomorrowStart = todayStart.add(1, 'day')

  switch (preset) {
    case 'today':
      return { start: todayStart, end: tomorrowStart }
    case 'yesterday':
      return { start: todayStart.subtract(1, 'day'), end: todayStart }
    case 'last7':
      return { start: todayStart.subtract(6, 'day'), end: tomorrowStart }
    case 'last30':
      return { start: todayStart.subtract(29, 'day'), end: tomorrowStart }
    case 'thisMonth': {
      const m0 = startOfReportingDay(now.startOf('month'), tz, offsetMin)
      const m1 = startOfReportingDay(now.add(1, 'month').startOf('month'), tz, offsetMin)
      return { start: m0, end: m1 }
    }
    case 'thisYear': {
      const y0 = startOfReportingDay(now.startOf('year'), tz, offsetMin)
      const y1 = startOfReportingDay(now.add(1, 'year').startOf('year'), tz, offsetMin)
      return { start: y0, end: y1 }
    }
  }
}

// Store hours types
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sun=0
export type StoreDayHours = {
  weekday: Weekday
  open: string   // '17:00'  (24h local)
  close: string  // '01:00'  (24h local; may be < open meaning crosses midnight)
  bufferMin: number // e.g., 59
  isClosed: boolean
}

export type StoreHoursSettings = {
  timezone: string // IANA
  useHoursFilter: boolean
  days: StoreDayHours[]
}

// Given a local date (reporting day) and store hours for that weekday,
// return the active window for that reporting day.
export function reportingDayActiveWindow(
  reportingDayStart: dayjs.Dayjs, // start of day with offset, local tz
  tz: string,
  day: { open: string; close: string; bufferMin: number; isClosed: boolean }
) {
  if (day.isClosed) return null

  const [oH, oM] = day.open.split(':').map(Number)
  const [cH, cM] = day.close.split(':').map(Number)

  const openTs = reportingDayStart.tz(tz).hour(oH).minute(oM).second(0).millisecond(0)
  let closeBase = reportingDayStart.tz(tz).hour(cH).minute(cM).second(59).millisecond(999)

  // if close < open → overnight into next reporting day
  const crossesMidnight = (cH < oH) || (cH === oH && cM <= oM)
  if (crossesMidnight) closeBase = closeBase.add(1, 'day')

  const endTs = closeBase.add(day.bufferMin ?? 0, 'minute')
  return { start: openTs, end: endTs }
}

// Generate zero-filled buckets for a time range
export function generateTimeBuckets(start: dayjs.Dayjs, end: dayjs.Dayjs, grain: Grain): string[] {
  const buckets: string[] = []
  let current = start.clone()
  
  while (current.isBefore(end)) {
    let bucketKey: string
    
    switch (grain) {
      case 'hour':
        bucketKey = current.format('YYYY-MM-DDTHH:00:00')
        current = current.add(1, 'hour')
        break
      case 'day':
        bucketKey = current.format('YYYY-MM-DDTHH:mm:ss')
        current = current.add(1, 'day')
        break
      case 'month':
        bucketKey = current.format('YYYY-MM-01THH:mm:ss')
        current = current.add(1, 'month')
        break
    }
    
    buckets.push(bucketKey)
  }
  
  return buckets
}

// Aggregate data by grain with proper offset handling
export function aggregateByGrain(
  data: any[], 
  grain: Grain, 
  start: dayjs.Dayjs, 
  end: dayjs.Dayjs, 
  tz: string, 
  offsetMin: number
) {
  const aggregated = new Map<string, number>()
  
  data.forEach(item => {
    // Use the correct timestamp field
    const timestamp = item.closed_at || item.paid_at || item.order_datetime || item.created_at
    const date = dayjs(timestamp).tz(tz)
    
    // Apply reporting day offset
    const shifted = date.subtract(offsetMin, 'minute')
    let key: string
    
    switch (grain) {
      case 'hour':
        key = shifted.startOf('hour').add(offsetMin, 'minute').format('YYYY-MM-DDTHH:00:00')
        break
      case 'day':
        key = shifted.startOf('day').add(offsetMin, 'minute').format('YYYY-MM-DDTHH:mm:ss')
        break
      case 'month':
        key = shifted.startOf('month').add(offsetMin, 'minute').format('YYYY-MM-01THH:mm:ss')
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




