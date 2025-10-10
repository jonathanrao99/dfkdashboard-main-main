import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

export type Preset =
  | 'today' | 'yesterday' | 'thisWeek' | 'lastWeek'
  | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear'
  | 'custom'

export type Grain = 'hour' | 'day' | 'month'

export const startOfReportingDay = (d: dayjs.Dayjs, z: string, off: number) =>
  d.tz(z).subtract(off, 'minute').startOf('day').add(off, 'minute')

export const presetToGrain = (p: Preset): Grain =>
  p === 'thisYear' || p === 'lastYear' ? 'month' : (p === 'today' || p === 'yesterday' ? 'hour' : 'day')

export const autoGrain = (sISO: string, eISO: string): Grain => {
  const days = dayjs(eISO).diff(dayjs(sISO), 'day', true)
  if (days <= 1.01) return 'hour'
  if (days <= 90.01) return 'day'
  return 'month'
}

export function getWindow(p: Preset, z: string, off: number) {
  const now = dayjs().tz(z)
  const s = startOfReportingDay(now, z, off)
  const t = s.add(1, 'day')

  if (p === 'today') return { start: s, end: t }
  if (p === 'yesterday') return { start: s.subtract(1, 'day'), end: s }
  if (p === 'thisWeek') {
    const mon = s.subtract((s.day() + 6) % 7, 'day')
    return { start: mon, end: mon.add(7, 'day') }
  }
  if (p === 'lastWeek') {
    const mon = s.subtract((s.day() + 6) % 7 + 7, 'day')
    return { start: mon, end: mon.add(7, 'day') }
  }
  if (p === 'thisMonth') {
    const m0 = startOfReportingDay(now.startOf('month'), z, off)
    const m1 = startOfReportingDay(now.add(1, 'month').startOf('month'), z, off)
    return { start: m0, end: m1 }
  }
  if (p === 'lastMonth') {
    const m0 = startOfReportingDay(now.subtract(1, 'month').startOf('month'), z, off)
    const m1 = startOfReportingDay(now.startOf('month'), z, off)
    return { start: m0, end: m1 }
  }
  if (p === 'thisYear') {
    const y0 = startOfReportingDay(now.startOf('year'), z, off)
    const y1 = startOfReportingDay(now.add(1, 'year').startOf('year'), z, off)
    return { start: y0, end: y1 }
  }
  if (p === 'lastYear') {
    const y0 = startOfReportingDay(now.subtract(1, 'year').startOf('year'), z, off)
    const y1 = startOfReportingDay(now.startOf('year'), z, off)
    return { start: y0, end: y1 }
  }
  throw new Error('Custom requires explicit start/end.')
}

// Store-hours window for a reporting day
export function activeWindowForDay(
  reportingDayStart: dayjs.Dayjs,
  tz: string,
  hours: { open: string; close: string; bufferMin: number; isClosed: boolean }
) {
  if (hours.isClosed) return null
  const [oH, oM] = hours.open.split(':').map(Number)
  const [cH, cM] = hours.close.split(':').map(Number)
  const open = reportingDayStart.tz(tz).hour(oH).minute(oM).second(0).millisecond(0)
  let close = reportingDayStart.tz(tz).hour(cH).minute(cM).second(59).millisecond(999)
  const crosses = (cH < oH) || (cH === oH && cM <= oM)
  if (crosses) close = close.add(1, 'day')
  return { start: open, end: close.add(hours.bufferMin ?? 0, 'minute') }
}