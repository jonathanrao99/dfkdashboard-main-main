'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { day: 1, dailyNet: 2100, ma7: 1950 },
  { day: 2, dailyNet: 2450, ma7: 2000 },
  { day: 3, dailyNet: 1890, ma7: 2050 },
  { day: 4, dailyNet: 2780, ma7: 2100 },
  { day: 5, dailyNet: 3120, ma7: 2150 },
  { day: 6, dailyNet: 2890, ma7: 2200 },
  { day: 7, dailyNet: 3450, ma7: 2250 },
  { day: 8, dailyNet: 2980, ma7: 2300 },
  { day: 9, dailyNet: 2670, ma7: 2350 },
  { day: 10, dailyNet: 3250, ma7: 2400 },
  { day: 11, dailyNet: 3780, ma7: 2450 },
  { day: 12, dailyNet: 3420, ma7: 2500 },
  { day: 13, dailyNet: 3890, ma7: 2550 },
  { day: 14, dailyNet: 3560, ma7: 2600 },
  { day: 15, dailyNet: 4120, ma7: 2650 }
]

export default function NetSalesTrend() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            stroke="#CBD5E1"
            fontSize={12}
            tick={{ fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#CBD5E1"
            fontSize={12}
            tick={{ fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              boxShadow: '0 6px 18px rgba(16,24,40,.06)'
            }}
            labelStyle={{ color: '#475569', fontSize: '12px' }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === 'dailyNet' ? 'Daily Net Sales' : '7-day Moving Avg'
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px', color: '#475569' }}
          />
          <Line
            type="monotone"
            dataKey="dailyNet"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Daily Net Sales"
          />
          <Line
            type="monotone"
            dataKey="ma7"
            stroke="#6b7280"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="7-day Moving Avg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}







