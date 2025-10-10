import { EnhancedCard, KpiCard, ProgressBar } from '@/components/ui/enhanced-card'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 text-sm mt-1">Monthly P&L, cash flow, and reconciliation reports</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                January 2024 - May 2024
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - P&L Summary */}
          <div className="col-span-8 space-y-6">
            {/* Monthly P&L Summary */}
            <EnhancedCard>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Profit & Loss Summary</h3>
                <p className="text-sm text-gray-600">Monthly breakdown of revenue and expenses</p>
              </div>
              
              <div className="space-y-6">
                {/* Revenue Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Revenue</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Square Sales</span>
                      <span className="text-sm font-semibold text-gray-900">$45,800</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">DoorDash</span>
                      <span className="text-sm font-semibold text-gray-900">$29,340</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">UberEats</span>
                      <span className="text-sm font-semibold text-gray-900">$19,810</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Grubhub</span>
                      <span className="text-sm font-semibold text-gray-900">$7,530</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold text-gray-900">Total Revenue</span>
                        <span className="text-md font-bold text-emerald-600">$102,480</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Expenses</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Food & Supplies</span>
                      <span className="text-sm font-semibold text-gray-900">$28,736</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Fuel & Transportation</span>
                      <span className="text-sm font-semibold text-gray-900">$4,892</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Labor</span>
                      <span className="text-sm font-semibold text-gray-900">$18,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Permits & Licenses</span>
                      <span className="text-sm font-semibold text-gray-900">$450</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Equipment & Maintenance</span>
                      <span className="text-sm font-semibold text-gray-900">$2,340</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Processing Fees</span>
                      <span className="text-sm font-semibold text-gray-900">$3,274</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold text-gray-900">Total Expenses</span>
                        <span className="text-md font-bold text-red-600">$58,192</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Net Profit</span>
                    <span className="text-xl font-bold text-emerald-600">$44,288</span>
                  </div>
                  <div className="text-sm text-emerald-700 mt-1">43.2% profit margin</div>
                </div>
              </div>
            </EnhancedCard>

            {/* Cash Flow Chart */}
            <EnhancedCard>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cash Flow Trend</h3>
                <p className="text-sm text-gray-600">Daily cash flow over the past 30 days</p>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-1 p-4 bg-gray-50 rounded-xl">
                {[
                  1200, 1450, 1380, 1620, 1750, 1890, 2100, 1980, 2250, 2180, 2350, 2420, 2380, 2650, 2580,
                  2750, 2890, 2980, 3150, 3080, 3250, 3180, 3420, 3350, 3580, 3650, 3780, 3920, 4050, 4180
                ].map((value, index) => {
                  const height = (value / 4500) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-emerald-500 rounded-t-sm transition-all duration-700 hover:bg-emerald-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </EnhancedCard>
          </div>

          {/* Right Column - Reconciliation & Quick Stats */}
          <div className="col-span-4 space-y-6">
            {/* Reconciliation Status */}
            <EnhancedCard>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Reconciliation Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Square Payouts</div>
                      <div className="text-xs text-gray-600">47 transactions</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Matched</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Bank Deposits</div>
                      <div className="text-xs text-gray-600">12 deposits</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Matched</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">DoorDash Payouts</div>
                      <div className="text-xs text-gray-600">3 pending</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-yellow-700">Pending</span>
                </div>
              </div>
            </EnhancedCard>

            {/* Quick Stats */}
            <div className="space-y-4">
              <KpiCard
                title="Average Daily Revenue"
                value="$3,416"
                change={{ value: "+18%", trend: "up", period: "vs last month" }}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
              />
              
              <KpiCard
                title="Food Cost Ratio"
                value="28.0%"
                change={{ value: "-2%", trend: "down", period: "vs target 30%" }}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>

            {/* Export Actions */}
            <EnhancedCard>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Export Reports</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Monthly P&L Report</span>
                  </div>
                  <span className="text-xs text-gray-500">PDF</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Expense Details</span>
                  </div>
                  <span className="text-xs text-gray-500">CSV</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Tax Summary</span>
                  </div>
                  <span className="text-xs text-gray-500">PDF</span>
                </button>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </div>
  )
}