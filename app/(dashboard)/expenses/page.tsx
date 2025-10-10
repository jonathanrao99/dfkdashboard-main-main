import { EnhancedCard, KpiCard } from '@/components/ui/enhanced-card'

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
              <p className="text-gray-600 text-sm mt-1">Track and manage all your food truck expenses</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard
            title="Total Expenses (MTD)"
            value="$2,847"
            change={{ value: "-8%", trend: "down", period: "from last month" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          
          <KpiCard
            title="Food & Supplies"
            value="$1,842"
            change={{ value: "+12%", trend: "up", period: "from last month" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          
          <KpiCard
            title="Operational Costs"
            value="$1,005"
            change={{ value: "-5%", trend: "down", period: "from last month" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* Expenses Table */}
        <EnhancedCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Expenses</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search expenses..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Receipt</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: 'Feb 12, 2024', vendor: 'Sysco Houston', category: 'Food Supplies', description: 'Weekly grocery order - chicken, rice, spices', amount: 485.67, receipt: true },
                  { date: 'Feb 12, 2024', vendor: 'Shell Gas Station', category: 'Fuel', description: 'Truck fuel fill-up', amount: 89.45, receipt: true },
                  { date: 'Feb 11, 2024', vendor: 'Restaurant Depot', category: 'Food Supplies', description: 'Bulk vegetables and dairy', amount: 234.89, receipt: true },
                  { date: 'Feb 11, 2024', vendor: 'Square', category: 'Processing Fees', description: 'Payment processing fees', amount: 67.23, receipt: false },
                  { date: 'Feb 10, 2024', vendor: 'City of Katy', category: 'Permits & Licenses', description: 'Food truck permit renewal', amount: 150.00, receipt: true },
                  { date: 'Feb 10, 2024', vendor: 'Home Depot', category: 'Equipment', description: 'Propane tanks and supplies', amount: 78.34, receipt: true },
                  { date: 'Feb 9, 2024', vendor: 'Costco Business', category: 'Food Supplies', description: 'Bulk spices and condiments', amount: 145.78, receipt: true },
                  { date: 'Feb 9, 2024', vendor: 'Verizon', category: 'Utilities', description: 'Mobile hotspot for truck', amount: 45.99, receipt: false },
                ].map((expense, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-900">{expense.date}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{expense.vendor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{expense.description}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">${expense.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-center">
                      {expense.receipt ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EnhancedCard>
      </div>
    </div>
  )
}