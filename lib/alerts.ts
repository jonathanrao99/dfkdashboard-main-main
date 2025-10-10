// Alerts Engine - Business Rules for Anomaly Detection
export interface Alert {
  id: string
  type: 'warning' | 'info' | 'error'
  message: string
  timestamp: string
  resolved: boolean
}

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: (data: any) => boolean
  message: (data: any) => string
  type: 'warning' | 'info' | 'error'
}

// Alert Rules
export const alertRules: AlertRule[] = [
  {
    id: 'high-take-rate',
    name: 'High Take-Rate Alert',
    description: 'Platform commission exceeds 28%',
    condition: (data) => data.feeTakeRate > 0.28,
    message: (data) => `${data.platform} take-rate ${(data.feeTakeRate * 100).toFixed(1)}% (target ≤28%)`,
    type: 'warning'
  },
  {
    id: 'fuel-anomaly',
    name: 'Fuel Spend Anomaly',
    description: 'Fuel spend exceeds 1.5x 4-week average',
    condition: (data) => data.currentFuelSpend > data.avgFuelSpend * 1.5,
    message: (data) => `Fuel spend +${Math.round(((data.currentFuelSpend / data.avgFuelSpend) - 1) * 100)}% vs last 4 weeks`,
    type: 'warning'
  },
  {
    id: 'missing-csv',
    name: 'Missing CSV Upload',
    description: 'No CSV upload from delivery platform in 7 days',
    condition: (data) => data.daysSinceLastUpload > 7,
    message: (data) => `${data.platform} CSV upload pending`,
    type: 'info'
  },
  {
    id: 'cash-leak',
    name: 'Cash Leak Detection',
    description: 'Cash sales without deposit in 3 days',
    condition: (data) => data.cashSalesWithoutDeposit > 0 && data.daysSinceLastDeposit > 3,
    message: (data) => `Cash sales $${data.cashSalesWithoutDeposit} without deposit in ${data.daysSinceLastDeposit} days`,
    type: 'warning'
  }
]

// Mock data for alert evaluation
export interface AlertData {
  platforms: {
    doordash: { feeTakeRate: number; lastUpload: string }
    ubereats: { feeTakeRate: number; lastUpload: string }
    grubhub: { feeTakeRate: number; lastUpload: string }
  }
  fuel: {
    currentWeek: number
    fourWeekAvg: number
  }
  cash: {
    salesWithoutDeposit: number
    daysSinceLastDeposit: number
  }
}

// Generate alerts based on current data
export function evaluateAlerts(data: AlertData): Alert[] {
  const alerts: Alert[] = []
  const now = new Date()

  // High take-rate check
  Object.entries(data.platforms).forEach(([platform, platformData]) => {
    if (platformData.feeTakeRate > 0.28) {
      alerts.push({
        id: `high-take-rate-${platform}`,
        type: 'warning',
        message: `${platform} take-rate ${(platformData.feeTakeRate * 100).toFixed(1)}% (target ≤28%)`,
        timestamp: now.toISOString(),
        resolved: false
      })
    }
  })

  // Fuel anomaly check
  if (data.fuel.currentWeek > data.fuel.fourWeekAvg * 1.5) {
    const increase = Math.round(((data.fuel.currentWeek / data.fuel.fourWeekAvg) - 1) * 100)
    alerts.push({
      id: 'fuel-anomaly',
      type: 'warning',
      message: `Fuel spend +${increase}% vs last 4 weeks`,
      timestamp: now.toISOString(),
      resolved: false
    })
  }

  // Missing CSV check
  Object.entries(data.platforms).forEach(([platform, platformData]) => {
    const daysSinceUpload = Math.floor((now.getTime() - new Date(platformData.lastUpload).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceUpload > 7) {
      alerts.push({
        id: `missing-csv-${platform}`,
        type: 'info',
        message: `${platform} CSV upload pending`,
        timestamp: now.toISOString(),
        resolved: false
      })
    }
  })

  // Cash leak check
  if (data.cash.salesWithoutDeposit > 0 && data.cash.daysSinceLastDeposit > 3) {
    alerts.push({
      id: 'cash-leak',
      type: 'warning',
      message: `Cash sales $${data.cash.salesWithoutDeposit} without deposit in ${data.cash.daysSinceLastDeposit} days`,
      timestamp: now.toISOString(),
      resolved: false
    })
  }

  return alerts
}

// Mock current data for demonstration
export function getCurrentAlertData(): AlertData {
  return {
    platforms: {
      doordash: { feeTakeRate: 0.31, lastUpload: '2024-02-10' },
      ubereats: { feeTakeRate: 0.25, lastUpload: '2024-02-08' },
      grubhub: { feeTakeRate: 0.22, lastUpload: '2024-02-12' }
    },
    fuel: {
      currentWeek: 1200,
      fourWeekAvg: 800
    },
    cash: {
      salesWithoutDeposit: 450,
      daysSinceLastDeposit: 2
    }
  }
}

