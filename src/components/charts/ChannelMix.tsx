'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChannelMixProps {
  data?: Array<{ source: string; net: number }>
}

const colors = ['#22C55E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

export default function ChannelMix({ data: propData }: ChannelMixProps) {
  // Use prop data or fallback to mock data
  const rawData = propData || [
    { source: 'Square', net: 45800 },
    { source: 'DoorDash', net: 29340 },
    { source: 'UberEats', net: 19810 },
    { source: 'Grubhub', net: 7530 },
    { source: 'Catering', net: 2500 }
  ]

  // Sort by value descending (max 5 sources)
  const data = rawData
    .sort((a, b) => b.net - a.net)
    .slice(0, 5)
    .map((item, index) => ({
      name: item.source,
      value: item.net,
      color: colors[index % colors.length]
    }))
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number"
            stroke="#CBD5E1"
            fontSize={12}
            tick={{ fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#CBD5E1"
            fontSize={12}
            tick={{ fill: '#475569' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              boxShadow: '0 6px 18px rgba(16,24,40,.06)'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Revenue']}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} height={14}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
