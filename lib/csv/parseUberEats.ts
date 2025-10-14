// Note: Structure adapted from parseDoorDash.ts, field names need to be verified with actual UberEats CSV format.
export function parseUberEatsRow(row: Record<string,string>){
  const num = (v?:string)=> Number((v||'0').replace(/[^0-9.-]/g,''))
  return {
    order_id: row['Order ID'],
    order_datetime: new Date(row['Date']),
    items_gross: num(row['Subtotal']),
    discounts: num(row['Promotions']),
    tax: num(row['Tax']),
    tips: num(row['Tip']),
    platform_commission: num(row['Marketplace Fee']),
    processing_fees: num(row['Processing Fee']),
    adjustments: num(row['Adjustments']),
    payout_amount: num(row['Payout']),
  }
}
