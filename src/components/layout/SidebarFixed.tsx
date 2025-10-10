'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/expenses', label: 'Expenses' },
  { href: '/reports', label: 'Reports' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/settings', label: 'Settings' },
]

export default function SidebarFixed() {
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
        {navigationItems.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link 
              key={href} 
              href={href} 
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto space-y-1 text-white/80">
        <Link href="#" className="sidebar-item">
          Help
        </Link>
        <Link href="#" className="sidebar-item">
          Logout
        </Link>
      </div>
    </div>
  )
}










