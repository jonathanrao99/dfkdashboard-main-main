'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  delta?: {
    label: string
    tone: 'up' | 'down' | 'neutral'
  }
  icon?: ReactNode
  chart?: ReactNode
  variant?: 'default' | 'primary'
}

const toneClasses = {
  up: 'text-emerald-600 bg-emerald-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-gray-600 bg-gray-100'
}

export default function KpiCardV2({ title, value, delta, icon, chart, variant = 'default' }: KpiCardProps) {
  const cardClasses = variant === 'primary' 
    ? 'bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-lg' 
    : 'bg-white border border-gray-200 shadow-sm'
    
  const titleClasses = variant === 'primary' ? 'text-green-100' : 'text-gray-500'
  const valueClasses = variant === 'primary' ? 'text-white' : 'text-gray-900'
  const deltaToneClasses = variant === 'primary' 
    ? 'text-white bg-white/20' 
    : toneClasses[delta?.tone || 'neutral']

  return (
    <Card className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${titleClasses}`}>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className={`text-4xl font-bold ${valueClasses}`}>{value}</div>
            {delta && (
              <div className="flex items-center text-xs mt-2">
                <span className={`px-2 py-0.5 rounded-full font-medium ${deltaToneClasses}`}>
                  {delta.label}
                </span>
              </div>
            )}
          </div>
          {chart && <div className="w-24 h-12 -mb-2 -mr-2">{chart}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

