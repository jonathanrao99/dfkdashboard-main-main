'use client'

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from 'recharts'
import { TimePoint, Grain } from '@/types/dashboard'

interface Props {
  data: TimePoint[]
  grain: Grain
  height?: number
  stroke?: string
  fill?: string
}

export default function SparkNetSales({ data, grain, height = 160, stroke = '#22C55E', fill = '#22C55E' }: Props) {
  // Format data for chart
  const chartData = data.map(point => ({
    ts: point.tsISO || (point as any).ts,
    value: point.value
  }))

  // Format x-axis labels based on grain
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem)
    switch (grain) {
      case 'hour':
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short' })
      default:
        return tickItem
    }
  }

  // Format tooltip label
  const formatTooltipLabel = (label: string) => {
    const date = new Date(label)
    switch (grain) {
      case 'hour':
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      default:
        return label
    }
  }

  console.log('SparkNetSales rendering with data:', data.length, 'points')

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 md:h-48 text-gray-500 text-sm">
        No data for selected range
      </div>
    )
  }

  return (
    <div className="h-40 md:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity={0.18}/>
              <stop offset="100%" stopColor={fill} stopOpacity={0.04}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="ts"
            tickFormatter={formatXAxisLabel}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Area
            dataKey="value"
            type="monotone"
            stroke={stroke}
            strokeWidth={2}
            fill="url(#netFill)"
            dot={false}
            activeDot={{ r: 4, stroke: stroke, strokeWidth: 2, fill: '#fff' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              boxShadow: '0 6px 18px rgba(16,24,40,.06)'
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Net Sales']}
            labelFormatter={formatTooltipLabel}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}






