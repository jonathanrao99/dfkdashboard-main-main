import { Calendar, Download, Search, Bell, Share } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-border">
      <div className="h-[72px] flex items-center justify-between px-6 md:px-8">
        {/* Left side - Title and breadcrumb */}
        <div>
          <div className="text-lg font-medium text-text-primary">Sales Admin</div>
          <div className="text-sm text-text-secondary">An any way to manage sales with care and precision.</div>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search anything in Siohioma..."
              className="w-full pl-10 pr-4 py-2 form-input"
            />
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            January 2024 - May 2024
          </button>
          <button className="btn-secondary">
            <Bell className="w-4 h-4" />
          </button>
          <button className="btn-secondary">
            <Share className="w-4 h-4" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <span className="w-4 h-4">+</span>
            Add new product
          </button>
        </div>
      </div>
    </div>
  )
}