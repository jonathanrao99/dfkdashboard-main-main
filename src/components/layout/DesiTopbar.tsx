export default function DesiTopbar() {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side - Page title */}
        <div className="flex items-center gap-6">
        </div>
        
        {/* Center - Enhanced Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search anything in Desi Flavors..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Right side - Actions matching reference */}
        <div className="flex items-center gap-3">
          {/* Date Range Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            January 2024 - May 2024
          </button>
          
          {/* Export Button */}
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          {/* Add new product button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md group">
            <span className="text-sm">Add new expense</span>
            <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors">
              <svg className="w-2 h-2 text-gray-300" fill="currentColor" viewBox="0 0 8 8">
                <path d="M3 0v3H0v2h3v3h2V5h3V3H5V0H3z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}










