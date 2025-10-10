'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { 
    href: '/dashboard', 
    label: 'Overview', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    href: '/statistics', 
    label: 'Statistics', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    href: '/customers', 
    label: 'Customers', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  { 
    href: '/product', 
    label: 'Product', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    href: '/messages', 
    label: 'Messages', 
    badge: '18',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  { 
    href: '/transactions', 
    label: 'Transactions', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
]

const generalItems = [
  { 
    href: '/settings', 
    label: 'Settings', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    href: '/security', 
    label: 'Security', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
]

export default function EnhancedSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-emerald-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-xl font-bold">Siohioma</span>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="flex-1 px-4 py-6">
        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4 px-3">
          MENU
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map(({ href, label, icon, badge }) => {
            const isActive = pathname === href || (href === '/dashboard' && pathname === '/dashboard')
            return (
              <Link 
                key={href} 
                href={href} 
                className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-800/50 text-white shadow-lg' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
                    {icon}
                  </div>
                  <span>{label}</span>
                </div>
                {badge && (
                  <div className="bg-emerald-500 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                    {badge}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* General Section */}
      <div className="px-4 py-4">
        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4 px-3">
          GENERAL
        </div>
        
        <nav className="space-y-1">
          {generalItems.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link 
                key={href} 
                href={href} 
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-800/50 text-white shadow-lg' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/30'
                }`}
              >
                <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
                  {icon}
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-emerald-800/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-emerald-900 font-bold text-sm">
            FP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Fandawy Punx</div>
            <div className="text-xs text-emerald-300 truncate">fandawy6@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}










