import { EnhancedCard, KpiCard } from '@/components/ui/enhanced-card'

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your suppliers and track spending</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search vendors..."
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Vendors"
            value="24"
            change={{ value: "+3", trend: "up", period: "this month" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          
          <KpiCard
            title="Monthly Spend"
            value="$28,736"
            change={{ value: "+12%", trend: "up", period: "from last month" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          
          <KpiCard
            title="Top Vendor"
            value="Sysco"
            change={{ value: "$8,945", trend: "up", period: "monthly spend" }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          
          <KpiCard
            title="New This Month"
            value="3"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* Vendors List */}
        <EnhancedCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Vendor Directory</h3>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Categories</option>
                <option>Food Supplies</option>
                <option>Equipment</option>
                <option>Services</option>
                <option>Utilities</option>
              </select>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Sysco Houston',
                category: 'Food Supplies',
                contact: 'orders@sysco.com',
                phone: '(713) 555-0123',
                monthlySpend: 8945.67,
                lastOrder: '2 days ago',
                status: 'active',
                rating: 4.8
              },
              {
                name: 'Restaurant Depot',
                category: 'Food Supplies',
                contact: 'bulk@restaurantdepot.com',
                phone: '(281) 555-0456',
                monthlySpend: 5234.89,
                lastOrder: '5 days ago',
                status: 'active',
                rating: 4.6
              },
              {
                name: 'Shell Fleet Services',
                category: 'Fuel',
                contact: 'fleet@shell.com',
                phone: '(713) 555-0789',
                monthlySpend: 3456.78,
                lastOrder: '1 day ago',
                status: 'active',
                rating: 4.5
              },
              {
                name: 'Home Depot Pro',
                category: 'Equipment',
                contact: 'pro@homedepot.com',
                phone: '(832) 555-0321',
                monthlySpend: 1234.56,
                lastOrder: '1 week ago',
                status: 'active',
                rating: 4.3
              },
              {
                name: 'CenterPoint Energy',
                category: 'Utilities',
                contact: 'business@centerpointenergy.com',
                phone: '(713) 555-0654',
                monthlySpend: 234.50,
                lastOrder: '2 weeks ago',
                status: 'active',
                rating: 4.0
              },
              {
                name: 'Square',
                category: 'Payment Processing',
                contact: 'support@squareup.com',
                phone: '(855) 555-0987',
                monthlySpend: 2456.78,
                lastOrder: 'Daily',
                status: 'active',
                rating: 4.7
              },
              {
                name: 'Costco Business',
                category: 'Food Supplies',
                contact: 'business@costco.com',
                phone: '(281) 555-0147',
                monthlySpend: 1876.45,
                lastOrder: '3 days ago',
                status: 'active',
                rating: 4.4
              },
              {
                name: 'City of Katy',
                category: 'Permits & Licenses',
                contact: 'permits@cityofkaty.com',
                phone: '(281) 555-0258',
                monthlySpend: 150.00,
                lastOrder: '1 month ago',
                status: 'active',
                rating: 3.8
              },
              {
                name: 'Verizon Business',
                category: 'Telecommunications',
                contact: 'business@verizon.com',
                phone: '(800) 555-0369',
                monthlySpend: 89.99,
                lastOrder: 'Monthly',
                status: 'active',
                rating: 4.2
              }
            ].map((vendor, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">
                        {vendor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{vendor.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{vendor.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-gray-900">${vendor.monthlySpend.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Monthly spend</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{vendor.lastOrder}</div>
                    <div className="text-xs text-gray-500">Last order</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
    </div>
  )
}