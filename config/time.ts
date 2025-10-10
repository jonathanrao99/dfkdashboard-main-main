export const BUSINESS_TZ = process.env.NEXT_PUBLIC_BUSINESS_TZ ?? 'America/Chicago'
export const REPORTING_OFFSET_MIN = Number(process.env.NEXT_PUBLIC_REPORTING_OFFSET_MIN ?? 120) // 2:00 AM
export const SALES_TIMESTAMP_FIELD: 'closed_at' | 'paid_at' | 'created_at' = 'closed_at'




