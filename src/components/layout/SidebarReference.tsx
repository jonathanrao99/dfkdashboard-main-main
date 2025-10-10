'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/statistics', label: 'Statistics', icon: '📈' },
  { href: '/customers', label: 'Customers', icon: '👥' },
  { href: '/product', label: 'Product', icon: '📦' },
  { href: '/messages', label: 'Messages', icon: '💬', badge: '18' },
  { href: '/transactions', label: 'Transactions', icon: '💳' },
]

const generalItems = [
  { href: '/settings', label: 'Settings', icon: '⚙️' },
  { href: '/security', label: 'Security', icon: '🔒' },
]

export default function SidebarReference() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-brand-700">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-white">
          <div className="text-xl">✨</div>
          <span className="text-lg font-semibold">Siohioma</span>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="px-4">
        <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
          MENU
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map(({ href, label, icon, badge }) => {
            const isActive = pathname === href || (href === '/dashboard' && pathname === '/dashboard')
            return (
              <Link 
                key={href} 
                href={href} 
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{icon}</span>
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* General Section */}
      <div className="px-4 mt-8">
        <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
          GENERAL
        </div>
        
        <nav className="space-y-1">
          {generalItems.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link 
                key={href} 
                href={href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* User Profile at bottom */}
      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            FP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Fandawy Punx</div>
            <div className="text-xs text-white/60 truncate">fandawy6@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}










