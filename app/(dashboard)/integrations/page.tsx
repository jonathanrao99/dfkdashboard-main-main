import { TellerConnect } from '@/components/teller/TellerConnect'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600 text-sm mt-1">Connect your payment platforms and banking services</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Integration Cards */}
          <div className="col-span-8 space-y-6">
            {/* Payment Platforms */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Square */}
                <EnhancedCard hover>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.01 4.01h15.98v15.98H4.01V4.01z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Square</h3>
                        <p className="text-sm text-gray-600">Point of sale system</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Connected</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last sync</span>
                      <span className="font-medium text-gray-900">2 minutes ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions synced</span>
                      <span className="font-medium text-gray-900">1,247 this month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue processed</span>
                      <span className="font-medium text-gray-900">$45,800</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Configure
                    </button>
                    <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                      Disconnect
                    </button>
                  </div>
                </EnhancedCard>

                {/* Teller Banking */}
                <TellerConnect />
              </div>
            </div>

            {/* Delivery Platforms */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* DoorDash */}
                <EnhancedCard hover>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DD</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">DoorDash</h3>
                        <p className="text-xs text-gray-600">CSV Upload</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs font-medium text-yellow-700">Manual</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last upload</span>
                      <span className="font-medium text-gray-900">3 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-medium text-gray-900">$29,340</span>
                    </div>
                  </div>
                  
                  <button className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Upload CSV
                  </button>
                </EnhancedCard>

                {/* UberEats */}
                <EnhancedCard hover>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">UE</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">UberEats</h3>
                        <p className="text-xs text-gray-600">CSV Upload</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs font-medium text-yellow-700">Manual</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last upload</span>
                      <span className="font-medium text-gray-900">5 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-medium text-gray-900">$19,810</span>
                    </div>
                  </div>
                  
                  <button className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Upload CSV
                  </button>
                </EnhancedCard>

                {/* Grubhub */}
                <EnhancedCard hover>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GH</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Grubhub</h3>
                        <p className="text-xs text-gray-600">CSV Upload</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs font-medium text-yellow-700">Manual</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last upload</span>
                      <span className="font-medium text-gray-900">1 week ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-medium text-gray-900">$7,530</span>
                    </div>
                  </div>
                  
                  <button className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Upload CSV
                  </button>
                </EnhancedCard>
              </div>
            </div>
          </div>

          {/* Right Column - CSV Upload & Instructions */}
          <div className="col-span-4 space-y-6">
            {/* CSV Upload Zone */}
            <EnhancedCard>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Upload Sales Data</h3>
                <p className="text-sm text-gray-600">Drag and drop CSV files from delivery platforms</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Drop CSV files here or
                </div>
                <button className="text-emerald-600 font-medium text-sm hover:text-emerald-700">
                  browse files
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                Supported formats: CSV files from DoorDash, UberEats, Grubhub
              </div>
            </EnhancedCard>

            {/* Integration Status */}
            <EnhancedCard>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Integration Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Square API</span>
                  </div>
                  <span className="text-xs text-green-700 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Bank (Teller)</span>
                  </div>
                  <span className="text-xs text-green-700 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Delivery Apps</span>
                  </div>
                  <span className="text-xs text-yellow-700 font-medium">Manual</span>
                </div>
              </div>
            </EnhancedCard>

            {/* Quick Instructions */}
            <EnhancedCard>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Quick Start</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-700">1</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Connect Square</div>
                    <div className="text-xs text-gray-600">Automatically sync sales data</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-700">2</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Link Bank Account</div>
                    <div className="text-xs text-gray-600">Track deposits and reconcile</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-700">3</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Upload Delivery Data</div>
                    <div className="text-xs text-gray-600">CSV files from apps weekly</div>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </div>
  )
}