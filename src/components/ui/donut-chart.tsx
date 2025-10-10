'use client'

import { useEffect, useState } from 'react'

interface DonutChartProps {
  data: Array<{
    label: string
    value: number
    color: string
    percentage: number
  }>
  size?: number
  strokeWidth?: number
  centerContent?: React.ReactNode
}

export function DonutChart({ 
  data, 
  size = 160, 
  strokeWidth = 12, 
  centerContent 
}: DonutChartProps) {
  const [mounted, setMounted] = useState(false)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  useEffect(() => {
    setMounted(true)
  }, [])

  let cumulativePercentage = 0

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Data segments */}
        {data.map((segment, index) => {
          const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = -cumulativePercentage * circumference / 100
          
          const result = (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={mounted ? strokeDasharray : '0 1000'}
              strokeDashoffset={mounted ? strokeDashoffset : 0}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${index * 200}ms` }}
            />
          )
          
          cumulativePercentage += segment.percentage
          return result
        })}
      </svg>
      
      {/* Center content */}
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {centerContent}
        </div>
      )}
    </div>
  )
}

interface PercentageBadgeProps {
  percentage: number
  color: string
  position: 'top' | 'middle' | 'bottom'
}

export function PercentageBadge({ percentage, color, position }: PercentageBadgeProps) {
  const positionClasses = {
    top: 'top-4',
    middle: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-4'
  }

  return (
    <div className={`absolute right-4 ${positionClasses[position]} transform`}>
      <div 
        className="px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {percentage}%
      </div>
    </div>
  )
}










