'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  Plug,
  Package,
  Settings,
  Menu,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Vendors', href: '/dashboard/vendors', icon: Users },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

function NavContent() {
  const pathname = usePathname()
  return (
    <nav className="flex-1 space-y-2 px-3 py-4">
      <h2 className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">MENU</h2>
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-active-background text-sidebar-active-foreground'
                : 'text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground'
            )}
          >
            <div className={cn('w-6 h-6 flex items-center justify-center', isActive && 'text-sidebar-active-foreground')}>
              <item.icon className="h-5 w-5" />
            </div>
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col bg-sidebar-background text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
          <span className="text-sm font-bold text-white">🍛</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-orange-100">Desi Flavors</h1>
          <p className="text-xs text-orange-200">Katy Food Truck</p>
        </div>
      </div>
      <NavContent />
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-lg">🍛</span>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-100">Desi Flavors Katy</p>
            <p className="text-xs text-orange-200/60">Authentic Indian Cuisine</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-card">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
