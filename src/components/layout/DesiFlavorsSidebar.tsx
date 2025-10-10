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
    href: '/expenses', 
    label: 'Expenses', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/vendors', 
    label: 'Vendors', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    href: '/reports', 
    label: 'Reports', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    href: '/integrations', 
    label: 'Integrations', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
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
    href: '/help', 
    label: 'Help & Support', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
]

export default function DesiFlavorsSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-emerald-900 text-white overflow-hidden">
      {/* Logo - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-emerald-800/30">
        <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Desi Flavors Katy" className="w-10 h-8" />
          <div>
            <div className="text-lg font-bold">Desi Flavors Katy</div>
            <div className="text-xs text-emerald-300 font-medium">Dashboard</div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Menu Section */}
        <div className="px-4 py-6">
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4 px-3">
            MENU
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || (href === '/dashboard' && pathname === '/dashboard')
              return (
                <Link 
                  key={href} 
                  href={href} 
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-800/50 text-white shadow-lg border border-emerald-700/50' 
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
      </div>
      
      {/* General Section - Fixed above user profile */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-emerald-800/30">
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
                    ? 'bg-emerald-800/50 text-white shadow-lg border border-emerald-700/50' 
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
      
      {/* User Profile - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-emerald-800/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-emerald-900 font-bold text-sm">
            JR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Jonathan Rao</div>
            <div className="text-xs text-emerald-300 truncate">Owner, Desi Flavors Katy</div>
          </div>
        </div>
      </div>
    </div>
  )
}
