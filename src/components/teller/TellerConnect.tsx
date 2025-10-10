'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { useEffect } from 'react'

declare global {
  interface Window {
    TellerConnect: {
      setup: (config: any) => any
    }
  }
}

export function TellerConnect() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.teller.io/connect/connect.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openTellerConnect = () => {
    const tellerConnect = window.TellerConnect.setup({
      applicationId: process.env.NEXT_PUBLIC_TELLER_APP_ID,
      onSuccess: async (enrollment: any) => {
        const res = await fetch('/api/teller/exchange-access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: enrollment.accessToken,
            institutionName: enrollment.enrollment.institution.name,
          }),
        })

        if (res.ok) {
          console.log('Teller access token exchanged successfully')
        } else {
          console.error('Failed to exchange Teller access token')
        }
      },
      onExit: () => {
        console.log('User closed Teller Connect')
      },
    })
    tellerConnect.open()
  }

  return (
    <EnhancedCard hover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm2 4h-2v-2h2v2zm0-4h-2V8h2v4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Bank Account (Teller)
            </h3>
            <p className="text-sm text-gray-600">Connect your bank</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">Connected</span> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openTellerConnect}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Connect
        </button>
      </div>
    </EnhancedCard>
  )
}

