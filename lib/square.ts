// Square API configuration
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN!
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
const SQUARE_BASE_URL = SQUARE_ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/v2' 
  : 'https://connect.squareupsandbox.com/v2'

// Square API headers
const getSquareHeaders = () => ({
  'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'Square-Version': '2023-10-18'
})

// Types for Square data
export interface SquareOrder {
  id: string
  locationId: string
  createdAt: string
  updatedAt: string
  state: string
  version: number
  netAmounts: {
    totalMoney: {
      amount: number
      currency: string
    }
    taxMoney: {
      amount: number
      currency: string
    }
    discountMoney: {
      amount: number
      currency: string
    }
    tipMoney: {
      amount: number
      currency: string
    }
    serviceChargeMoney: {
      amount: number
      currency: string
    }
  }
  totalMoney: {
    amount: number
    currency: string
  }
  totalTaxMoney: {
    amount: number
    currency: string
  }
  totalDiscountMoney: {
    amount: number
    currency: string
  }
  totalTipMoney: {
    amount: number
    currency: string
  }
  totalServiceChargeMoney: {
    amount: number
    currency: string
  }
  tenders?: Array<{
    id: string
    type: string
    amountMoney: {
      amount: number
      currency: string
    }
    processingFeeMoney?: {
      amount: number
      currency: string
    }
  }>
  lineItems?: Array<{
    uid: string
    name: string
    quantity: string
    itemType: string
    basePriceMoney: {
      amount: number
      currency: string
    }
    totalMoney: {
      amount: number
      currency: string
    }
    totalTaxMoney: {
      amount: number
      currency: string
    }
    totalDiscountMoney: {
      amount: number
      currency: string
    }
  }>
}

export interface SquarePayment {
  id: string
  createdAt: string
  updatedAt: string
  amountMoney: {
    amount: number
    currency: string
  }
  tipMoney: {
    amount: number
    currency: string
  }
  totalMoney: {
    amount: number
    currency: string
  }
  processingFee: {
    amount: number
    currency: string
  }
  netAmountMoney: {
    amount: number
    currency: string
  }
  status: string
  sourceType: string
  cardDetails?: {
    status: string
    card: {
      cardBrand: string
      last4: string
    }
  }
  locationId: string
  orderId?: string
}

export interface SquareRefund {
  id: string
  paymentId: string
  amountMoney: {
    amount: number
    currency: string
  }
  status: string
  createdAt: string
  updatedAt: string
  locationId: string
}

// Service functions
export class SquareService {
  // Get orders for a date range
  static async getOrders(startDate: string, endDate: string): Promise<SquareOrder[]> {
    try {
      const response = await fetch(`${SQUARE_BASE_URL}/orders/search`, {
        method: 'POST',
        headers: getSquareHeaders(),
        body: JSON.stringify({
          location_ids: [process.env.SQUARE_LOCATION_ID!],
          query: {
            filter: {
              date_time_filter: {
                created_at: {
                  start_at: new Date(startDate).toISOString(),
                  end_at: new Date(endDate).toISOString()
                }
              },
              state_filter: {
                states: ['COMPLETED']
              }
            },
            sort: {
              sort_field: 'CREATED_AT',
              sort_order: 'ASC'
            }
          },
          limit: 500
        })
      })

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.orders || []
    } catch (error) {
      console.error('Error fetching Square orders:', error)
      throw error
    }
  }

  // Get payments for a date range
  static async getPayments(startDate: string, endDate: string): Promise<SquarePayment[]> {
    try {
      const beginTime = new Date(startDate).toISOString()
      const endTime = new Date(endDate).toISOString()
      const locationId = process.env.SQUARE_LOCATION_ID!

      const response = await fetch(`${SQUARE_BASE_URL}/payments?begin_time=${beginTime}&end_time=${endTime}&location_id=${locationId}&limit=500`, {
        method: 'GET',
        headers: getSquareHeaders()
      })

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.payments || []
    } catch (error) {
      console.error('Error fetching Square payments:', error)
      throw error
    }
  }

  // Get refunds for a date range
  static async getRefunds(startDate: string, endDate: string): Promise<SquareRefund[]> {
    try {
      const beginTime = new Date(startDate).toISOString()
      const endTime = new Date(endDate).toISOString()
      const locationId = process.env.SQUARE_LOCATION_ID!

      const response = await fetch(`${SQUARE_BASE_URL}/refunds?begin_time=${beginTime}&end_time=${endTime}&location_id=${locationId}&limit=500`, {
        method: 'GET',
        headers: getSquareHeaders()
      })

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.refunds || []
    } catch (error) {
      console.error('Error fetching Square refunds:', error)
      throw error
    }
  }

  // Get location information
  static async getLocation(): Promise<any> {
    try {
      const locationId = process.env.SQUARE_LOCATION_ID!
      const response = await fetch(`${SQUARE_BASE_URL}/locations/${locationId}`, {
        method: 'GET',
        headers: getSquareHeaders()
      })

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.location
    } catch (error) {
      console.error('Error fetching Square location:', error)
      throw error
    }
  }

  // Calculate net sales from orders
  static calculateNetSales(orders: SquareOrder[]): number {
    return orders.reduce((total, order) => {
      return total + ((order as any).total_money?.amount || order.totalMoney?.amount || 0)
    }, 0) / 100 // Convert from cents to dollars
  }

  // Calculate total tips from orders
  static calculateTips(orders: SquareOrder[]): number {
    return orders.reduce((total, order) => {
      return total + ((order as any).total_tip_money?.amount || order.totalTipMoney?.amount || 0)
    }, 0) / 100 // Convert from cents to dollars
  }

  // Calculate total tax from orders
  static calculateTax(orders: SquareOrder[]): number {
    return orders.reduce((total, order) => {
      return total + ((order as any).total_tax_money?.amount || order.totalTaxMoney?.amount || 0)
    }, 0) / 100 // Convert from cents to dollars
  }

  // Calculate processing fees from payments
  static calculateProcessingFees(payments: SquarePayment[]): number {
    return payments.reduce((total, payment) => {
      const processingFee = (payment as any).processing_fee?.[0]?.amount_money?.amount || payment.processingFee?.amount || 0
      return total + processingFee
    }, 0) / 100 // Convert from cents to dollars
  }

  // Get daily sales data for sparkline
  static getDailySalesData(orders: SquareOrder[]): Array<{ d: string; net: number }> {
    const dailyMap = new Map<string, number>()
    
    orders.forEach(order => {
      const date = new Date((order as any).created_at || order.createdAt).toISOString().split('T')[0]
      const day = new Date(date).getDate().toString()
      const amount = ((order as any).total_money?.amount || order.totalMoney?.amount || 0) / 100
      
      dailyMap.set(day, (dailyMap.get(day) || 0) + amount)
    })

    return Array.from(dailyMap.entries())
      .map(([day, amount]) => ({
        d: day,
        net: Math.round(amount * 100) / 100
      }))
      .sort((a, b) => parseInt(a.d) - parseInt(b.d))
  }

  // Sync orders to database
  static async syncOrdersToDatabase(orders: SquareOrder[]): Promise<void> {
    const { supabaseAdmin } = await import('./supabase')
    
    for (const order of orders) {
      try {
        // Check if order already exists
        const { data: existing } = await supabaseAdmin
          .from('revenue_orders')
          .select('id')
          .eq('order_id', order.id)
          .eq('source', 'Square')
          .single()

        if (existing) continue

        // Calculate net amount
        const netAmount = ((order as any).total_money?.amount || order.totalMoney?.amount || 0) / 100
        const tax = ((order as any).total_tax_money?.amount || order.totalTaxMoney?.amount || 0) / 100
        const tips = ((order as any).total_tip_money?.amount || order.totalTipMoney?.amount || 0) / 100
        const discounts = ((order as any).total_discount_money?.amount || order.totalDiscountMoney?.amount || 0) / 100

        // Insert into revenue_orders table
        await supabaseAdmin
          .from('revenue_orders')
          .insert({
            source: 'Square',
            order_id: order.id,
            order_datetime: (order as any).created_at || order.createdAt,
            items_gross: netAmount + discounts - tax - tips, // Gross before tax/tips
            discounts: discounts,
            tax: tax,
            tips: tips,
            platform_commission: 0, // Square doesn't charge platform commission
            processing_fees: 0, // Will be calculated separately from payments
            adjustments: 0,
            payout_amount: netAmount,
            raw: order
          })
      } catch (error) {
        console.error(`Error syncing order ${order.id}:`, error)
      }
    }
  }

  // Sync payments to database for processing fees
  static async syncPaymentsToDatabase(payments: SquarePayment[]): Promise<void> {
    const { supabaseAdmin } = await import('./supabase')
    
    for (const payment of payments) {
      try {
        // Update the corresponding revenue order with processing fees
        const processingFee = ((payment as any).processing_fee?.[0]?.amount_money?.amount || payment.processingFee?.amount || 0) / 100
        
        if (processingFee > 0 && (payment as any).orderId) {
          await supabaseAdmin
            .from('revenue_orders')
            .update({
              processing_fees: processingFee,
              payout_amount: ((payment as any).total_money?.amount || payment.totalMoney?.amount || 0) / 100
            })
            .eq('order_id', (payment as any).order_id || payment.orderId)
            .eq('source', 'Square')
        }
      } catch (error) {
        console.error(`Error syncing payment ${payment.id}:`, error)
      }
    }
  }
}
