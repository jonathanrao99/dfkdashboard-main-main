import { StoreHoursSettings } from '@/lib/dateWindow'

export async function getStoreHoursSettings(): Promise<StoreHoursSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/store-hours`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch store hours settings')
    }
    
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching store hours settings:', error)
    // Return default settings
    return {
      timezone: 'America/Chicago',
      useHoursFilter: true,
      days: [
        { weekday: 0, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 1, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 2, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 3, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 4, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 5, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
        { weekday: 6, open: '17:00', close: '01:00', bufferMin: 59, isClosed: false },
      ]
    }
  }
}




