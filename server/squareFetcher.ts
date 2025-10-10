export type RawTxn = {
  id: string
  closed_at: string // ISO
  location_id: string
  amounts: {
    items: number
    discounts: number
    service_charges: number
    returns: number
    gross_sales: number
    net_sales: number
    tax: number
    tip: number
  }
  source?: string
}

export async function fetchOrdersClosedBetween(
  startISO: string, 
  endISO: string, 
  locationIds?: string[]
): Promise<RawTxn[]> {
  // For now, we'll use the existing Supabase data
  // In production, this would call Square API directly
  const { supabaseAdmin } = await import('@/lib/supabase')
  
  const { data, error } = await supabaseAdmin
    .from('revenue_orders')
    .select('*')
    .gte('order_datetime', startISO)
    .lt('order_datetime', endISO)
    .order('order_datetime', { ascending: true })

  if (error) throw error

  // Transform to RawTxn format
  return (data || []).map(order => ({
    id: order.id || '',
    closed_at: order.order_datetime,
    location_id: order.location_id || '',
    amounts: {
      items: Number(order.items_amount) || 0,
      discounts: Number(order.discounts_amount) || 0,
      service_charges: Number(order.service_charges_amount) || 0,
      returns: Number(order.returns_amount) || 0,
      gross_sales: Number(order.gross_sales) || 0,
      net_sales: Number(order.payout_amount) || 0,
      tax: Number(order.tax_amount) || 0,
      tip: Number(order.tip_amount) || 0
    },
    source: order.source
  }))
}

export function metricFromRaw(a: RawTxn['amounts'], basis: 'NET' | 'GROSS') {
  if (basis === 'GROSS') return a.gross_sales
  // Match Square "Net Sales"
  return a.items - a.discounts + a.service_charges - a.returns
}




