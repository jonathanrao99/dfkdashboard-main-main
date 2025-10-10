interface ReconciliationAndAlertsProps {
  payoutsMatched: number
  payoutsTotal: number
  bankUnmatched: number
  alerts: string[]
}

export default function ReconciliationAndAlerts({ 
  payoutsMatched = 12, 
  payoutsTotal = 12, 
  bankUnmatched = 1, 
  alerts = [
    'Fuel spend +22% vs last week',
    'DoorDash take-rate 31% (target ≤28%)',
    'UberEats CSV upload pending'
  ]
}: ReconciliationAndAlertsProps) {
  return (
    <div className="space-y-4">
      {/* Compact Reconciliation Status */}
      <div className="text-sm text-gray-700">
        <span>Payouts matched {payoutsMatched}/{payoutsTotal}</span>
        <span className="mx-2">✅</span>
        <span>• Bank deposits unmatched {bankUnmatched}</span>
        <span className="mx-2">❗</span>
      </div>

      {/* Compact Alerts */}
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <span>{alert}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
