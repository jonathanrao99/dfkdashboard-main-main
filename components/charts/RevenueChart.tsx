'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from './ChartContainer'
import { DailyNet } from '@/lib/pnl'

export function RevenueChart({ data }: { data: DailyNet[] }) {
  return (
    <ChartContainer title="Revenue">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis 
            dataKey="d" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              borderRadius: 'var(--radius)',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Bar dataKey="net" fill="#84cc16" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
