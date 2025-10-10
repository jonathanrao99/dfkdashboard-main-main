export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 text-sm mt-1">Get help with Desi Flavors Katy Dashboard and find answers to common questions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600">Common questions and answers about using the dashboard</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">How do I upload expense data?</h4>
                  <p className="text-sm text-gray-600">Go to the Expenses page and click "Upload CSV" to import your expense data from DoorDash, UberEats, or Grubhub. Make sure your CSV files are in the correct format.</p>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Why is my revenue data not matching?</h4>
                  <p className="text-sm text-gray-600">Revenue reconciliation issues usually occur when payout data hasn't been uploaded or processed. Check the Reconciliation & Alerts section for specific mismatches and upload missing payout files.</p>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">How often should I update my data?</h4>
                  <p className="text-sm text-gray-600">We recommend updating your data weekly for accurate insights. Daily updates provide the most current view of your business performance.</p>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Can I export my reports?</h4>
                  <p className="text-sm text-gray-600">Yes! You can export any report or dashboard data using the export button in the top navigation bar. Reports are available in CSV and PDF formats.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>
                <p className="text-sm text-gray-600">Get personalized help from our team</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Email Support</div>
                    <div className="text-xs text-gray-600">support@desiflavors.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Phone Support</div>
                    <div className="text-xs text-gray-600">(281) 555-0123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}