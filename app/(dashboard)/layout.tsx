import DesiFlavorsSidebar from '@/components/layout/DesiFlavorsSidebar'
import DesiTopbar from '@/components/layout/DesiTopbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <aside className="w-64 flex-shrink-0 shadow-xl h-full">
        <DesiFlavorsSidebar />
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <DesiTopbar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}