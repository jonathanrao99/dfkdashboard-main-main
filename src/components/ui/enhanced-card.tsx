import React from 'react'

interface EnhancedCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function EnhancedCard({ children, className = '', padding = 'md', hover = false }: EnhancedCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`
      bg-white rounded-2xl border border-gray-100 shadow-sm 
      ${hover ? 'hover:shadow-md hover:border-gray-200 transition-all duration-200' : ''} 
      ${paddingClasses[padding]} 
      ${className}
    `}>
      {children}
    </div>
  )
}

interface KpiCardProps {
  title: string
  value: string
  change?: {
    value: string
    trend: 'up' | 'down'
    period: string
  }
  icon?: React.ReactNode
}

export function KpiCard({ title, value, change, icon }: KpiCardProps) {
  return (
    <EnhancedCard hover className="group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-gray-100 transition-colors">
              {icon}
            </div>
          )}
          <div className="text-sm font-medium text-gray-600">{title}</div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-3">{value}</div>
      
      {change && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
            change.trend === 'up' 
              ? 'text-emerald-700 bg-emerald-50' 
              : 'text-red-700 bg-red-50'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={change.trend === 'up' ? "M7 17l9.2-9.2M17 17V7H7" : "M17 7l-9.2 9.2M7 7v10h10"} />
            </svg>
            <span>{change.value}</span>
          </div>
          <span className="text-sm text-gray-500">{change.period}</span>
        </div>
      )}
    </EnhancedCard>
  )
}

interface ProgressBarProps {
  label: string
  value: number
  total: number
  color?: 'green' | 'blue' | 'yellow' | 'red'
}

export function ProgressBar({ label, value, total, color = 'green' }: ProgressBarProps) {
  const percentage = (value / total) * 100
  
  const colorClasses = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">${value.toLocaleString()} / ${total.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
