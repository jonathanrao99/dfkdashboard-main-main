'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Product Launched', value: 233, fill: '#22C55E' },
  { name: 'Ongoing Product', value: 23, fill: '#F59E0B' },
  { name: 'Product Sold', value: 482, fill: '#145A3D' },
]

export function CashFlow() {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#E2E8F0" />
          <XAxis 
            type="number"
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
            domain={[0, 500]}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
            width={120}
          />
          <Tooltip 
            contentStyle={{ 
              border: '1px solid #E5E7EB', 
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(16,24,40,.06)'
            }} 
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
