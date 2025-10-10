import dayjs from 'dayjs'
import { Grain } from './reportingWindow'

export function bucketKey(tsLocal: dayjs.Dayjs, grain: Grain, offsetMin: number) {
  const shifted = tsLocal.subtract(offsetMin, 'minute')
  const trunc = shifted.startOf(grain as any)
  return trunc.add(offsetMin, 'minute').toISOString()
}

export function zeroBuckets(startISO: string, endISO: string, grain: Grain) {
  const out: string[] = []
  let c = dayjs(startISO)
  const step = grain === 'hour' ? 'hour' : (grain === 'day' ? 'day' : 'month')
  while (c.isBefore(endISO)) {
    out.push(c.toISOString())
    c = c.add(1, step as any)
  }
  return out
}

export function aggregateByGrain(
  data: any[],
  grain: Grain,
  startISO: string,
  endISO: string,
  tz: string,
  offsetMin: number,
  getValue: (item: any) => number
) {
  const aggregated = new Map<string, number>()
  
  data.forEach(item => {
    const timestamp = item.closed_at || item.paid_at || item.order_datetime || item.created_at
    const date = dayjs(timestamp).tz(tz)
    const key = bucketKey(date, grain, offsetMin)
    const value = getValue(item)
    aggregated.set(key, (aggregated.get(key) || 0) + value)
  })
  
  // Generate all buckets and zero-fill missing ones
  const allBuckets = zeroBuckets(startISO, endISO, grain)
  
  return allBuckets.map(bucket => ({
    ts: bucket,
    value: Math.round((aggregated.get(bucket) || 0) * 100) / 100
  }))
}




