// As per PRD §18 Quick Copy Snippets
export function parseDoorDashRow(row: Record<string,string>){
  const num = (v?:string)=> Number((v||'0').replace(/[^0-9.-]/g,''))
  return {
    order_id: row['Order ID'],
    order_datetime: new Date(row['Order Date']),
    items_gross: num(row['Item Subtotal']),
    discounts: num(row['Discounts']),
    tax: num(row['Tax']),
    tips: num(row['Tip']),
    platform_commission: num(row['Commission']),
    processing_fees: num(row['Processing Fee']),
    adjustments: num(row['Adjustments']),
    payout_amount: num(row['Net Payout']),
  }
}
