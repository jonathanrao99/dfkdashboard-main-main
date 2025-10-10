'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Receipt, 
  FileBarChart2, 
  Store, 
  Plug, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react'

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/reports', label: 'Reports', icon: FileBarChart2 },
  { href: '/vendors', label: 'Vendors', icon: Store },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Logo */}
      <div className="px-2 py-3 font-semibold tracking-tight text-white">
        Desi Flavors<br />
        Katy Dashboard
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link 
              key={href} 
              href={href} 
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
            >
              <Icon className="w-4 h-4 opacity-80" />
              {label}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto space-y-1 text-white/80">
        <Link href="#" className="sidebar-item">
          <HelpCircle className="w-4 h-4" />
          Help
        </Link>
        <Link href="#" className="sidebar-item">
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </div>
  )
}
