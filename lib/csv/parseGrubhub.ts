// Note: Structure adapted from parseDoorDash.ts, field names need to be verified with actual Grubhub CSV format.
export function parseGrubhubRow(row: Record<string,string>){
  const num = (v?:string)=> Number((v||'0').replace(/[^0-9.-]/g,''))
  return {
    order_id: row['Order #'],
    order_datetime: new Date(row['Date']),
    items_gross: num(row['Food & Beverage']),
    discounts: num(row['Adjustments & Fees']), // This might need splitting
    tax: num(row['Sales Tax']),
    tips: num(row['Tip']),
    platform_commission: num(row['Commission']),
    processing_fees: num(row['Processing Fee']),
    adjustments: 0, // Assuming adjustments are included in 'Adjustments & Fees'
    payout_amount: num(row['Net Deposit']),
  }
}
