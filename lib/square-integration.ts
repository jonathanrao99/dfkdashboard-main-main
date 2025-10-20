import { SquareClient, SquareEnvironment } from 'square'

// Initialize Square client
const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox
} as any)

export async function getSquareOrders(startDate: string, endDate: string) {
  try {
    const response = await squareClient.ordersApi.searchOrders({
      locationIds: [process.env.SQUARE_LOCATION_ID!],
      query: {
        filter: {
          dateTimeFilter: {
            createdAt: {
              startAt: startDate,
              endAt: endDate
            }
          }
        },
        sort: {
          sortField: 'CREATED_AT',
          sortOrder: 'DESC'
        }
      },
      limit: 100
    })

    return response.result.orders || []
  } catch (error) {
    console.error('Error fetching Square orders:', error)
    // Return empty array instead of throwing to prevent dashboard crashes
    return []
  }
}

export async function getSquarePayments(startDate: string, endDate: string) {
  try {
    const response = await squareClient.paymentsApi.listPayments({
      beginTime: startDate,
      endTime: endDate,
      locationId: process.env.SQUARE_LOCATION_ID!,
      limit: 100
    })

    return response.result.payments || []
  } catch (error) {
    console.error('Error fetching Square payments:', error)
    return []
  }
}

export async function getSquareCatalog() {
  try {
    const response = await squareClient.catalogApi.listCatalog({
      types: ['ITEM', 'ITEM_VARIATION']
    })

    return response.result.objects || []
  } catch (error) {
    console.error('Error fetching Square catalog:', error)
    return []
  }
}

export async function syncSquareData() {
  try {
    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [orders, payments, catalog] = await Promise.all([
      getSquareOrders(startDate, endDate),
      getSquarePayments(startDate, endDate),
      getSquareCatalog()
    ])

    return {
      orders,
      payments,
      catalog,
      syncedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error syncing Square data:', error)
    return {
      orders: [],
      payments: [],
      catalog: [],
      syncedAt: null
    }
  }
}
