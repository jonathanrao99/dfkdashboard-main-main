import { NextRequest, NextResponse } from 'next/server'
import { SquareService } from '@/lib/square'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 7 days
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    console.log(`Testing Square API connection from ${startDate} to ${endDate}`)

    // Test Square API connection
    const [orders, payments, location] = await Promise.all([
      SquareService.getOrders(startDate, endDate),
      SquareService.getPayments(startDate, endDate),
      SquareService.getLocation()
    ])

    // Calculate some basic stats
    const netSales = SquareService.calculateNetSales(orders)
    const tips = SquareService.calculateTips(orders)
    const tax = SquareService.calculateTax(orders)
    const processingFees = SquareService.calculateProcessingFees(payments)

    return NextResponse.json({
      success: true,
      data: {
        location: {
          name: location.name,
          address: location.address,
          timezone: location.timezone
        },
        orders: {
          count: orders.length,
          netSales: Math.round(netSales * 100) / 100,
          tips: Math.round(tips * 100) / 100,
          tax: Math.round(tax * 100) / 100
        },
        payments: {
          count: payments.length,
          processingFees: Math.round(processingFees * 100) / 100
        },
        sampleOrder: orders[0] || null,
        samplePayment: payments[0] || null
      }
    })
  } catch (error) {
    console.error('Square API test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to Square API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}




