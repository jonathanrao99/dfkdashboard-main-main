export default function TopbarFixed() {
  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-border">
      <div className="h-[72px] flex items-center justify-between px-6 md:px-8">
        {/* Left side - Title */}
        <div>
          <div className="text-lg font-medium text-text-primary">Dashboard</div>
          <div className="text-sm text-text-secondary">Desi Flavors Katy Financial Dashboard</div>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-4 py-2 form-input"
            />
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            Jan–May 2025
          </button>
          <button className="btn-secondary">
            Export
          </button>
          <button className="btn-primary">
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}










