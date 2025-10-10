'use client'

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Square', value: 4580, fill: '#22C55E' },
  { name: 'DoorDash', value: 2934, fill: '#22C55E' },
  { name: 'UberEats', value: 1981, fill: '#22C55E' },
  { name: 'Grubhub', value: 753, fill: '#22C55E' },
  { name: 'Catering', value: 620, fill: '#22C55E' },
]

export function RevenueBySource() {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#475569', fontSize: 12 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#475569', fontSize: 12 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              border: '1px solid #E5E7EB', 
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(16,24,40,.06)'
            }} 
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
