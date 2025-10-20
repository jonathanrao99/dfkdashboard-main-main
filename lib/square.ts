// Square API utilities and transformations

export interface SquareOrder {
  id: string
  locationId: string
  createdAt: string
  closedAt?: string
  state: string
  totalMoney: {
    amount: number
    currency: string
  }
  netAmounts: {
    totalMoney: {
      amount: number
      currency: string
    }
  }
  lineItems?: Array<{
    name: string
    quantity: string
    totalMoney: {
      amount: number
      currency: string
    }
  }>
  taxes?: Array<{
    name: string
    percentage: string
    appliedMoney: {
      amount: number
      currency: string
    }
  }>
  discounts?: Array<{
    name: string
    percentage: string
    amountMoney: {
      amount: number
      currency: string
    }
  }>
  serviceCharges?: Array<{
    name: string
    percentage: string
    amountMoney: {
      amount: number
      currency: string
    }
  }>
  tips?: Array<{
    name: string
    percentage: string
    amountMoney: {
      amount: number
      currency: string
    }
  }>
}

export function transformSquareOrder(order: SquareOrder) {
  const totalAmount = order.totalMoney?.amount || 0
  const netAmount = order.netAmounts?.totalMoney?.amount || totalAmount
  
  // Calculate tax amount
  const taxAmount = order.taxes?.reduce((sum, tax) => sum + (tax.appliedMoney?.amount || 0), 0) || 0
  
  // Calculate discount amount
  const discountAmount = order.discounts?.reduce((sum, discount) => sum + (discount.amountMoney?.amount || 0), 0) || 0
  
  // Calculate tip amount
  const tipAmount = order.tips?.reduce((sum, tip) => sum + (tip.amountMoney?.amount || 0), 0) || 0
  
  // Calculate service charge amount
  const serviceChargeAmount = order.serviceCharges?.reduce((sum, charge) => sum + (charge.amountMoney?.amount || 0), 0) || 0
  
  // Calculate items gross (total before discounts, taxes, tips)
  const itemsGross = totalAmount - taxAmount - tipAmount - serviceChargeAmount + discountAmount
  
  // Calculate platform commission (typically 2.9% + $0.30 for Square)
  const platformCommission = Math.round(itemsGross * 0.029 + 30) // 2.9% + $0.30
  
  // Calculate processing fees (same as platform commission for Square)
  const processingFees = platformCommission
  
  // Calculate final payout amount
  const payoutAmount = netAmount - platformCommission - processingFees

  return {
    source: 'Square',
    order_id: order.id,
    order_datetime: order.closedAt || order.createdAt,
    items_gross: itemsGross / 100, // Convert from cents to dollars
    discounts: discountAmount / 100,
    tax: taxAmount / 100,
    tips: tipAmount / 100,
    platform_commission: platformCommission / 100,
    processing_fees: processingFees / 100,
    adjustments: 0,
    payout_amount: payoutAmount / 100,
    raw: order
  }
}

export function calculateSquareFees(amount: number): number {
  // Square's standard processing fee: 2.9% + $0.30
  return Math.round(amount * 0.029 + 30)
}

export function formatSquareAmount(amount: number): string {
  // Convert from cents to dollars and format
  return (amount / 100).toFixed(2)
}
