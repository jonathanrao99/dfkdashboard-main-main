export function parseGrubhubRow(row: Record<string, string>) {
  return {
    order_id: row['Order ID'] || row['Order Number'] || '',
    order_datetime: new Date(row['Order Date'] || row['Date'] || '').toISOString(),
    items_gross: parseFloat(row['Item Subtotal'] || row['Subtotal'] || '0') || 0,
    discounts: parseFloat(row['Discounts'] || row['Promo'] || '0') || 0,
    tax: parseFloat(row['Tax'] || row['Tax Amount'] || '0') || 0,
    tips: parseFloat(row['Tip'] || row['Customer Tip'] || '0') || 0,
    platform_commission: parseFloat(row['Commission'] || row['Grubhub Fee'] || '0') || 0,
    processing_fees: parseFloat(row['Processing Fee'] || row['Payment Fee'] || '0') || 0,
    adjustments: parseFloat(row['Adjustments'] || row['Other Fees'] || '0') || 0,
    payout_amount: parseFloat(row['Net Payout'] || row['Total Payout'] || '0') || 0,
    source: 'grubhub',
    raw: row
  }
}

