'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, LabelList } from 'recharts'
import ChartContainer from './ChartContainer'
import { SourceNet } from '@/lib/pnl'

export function ChannelMix({ data }: { data: SourceNet[] }) {
  const colors = ["#84cc16", "#a3e635", "#bef264", "#d9f99d"];

  return (
    <ChartContainer title="Sales Report">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="source"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            width={100}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              borderRadius: 'var(--radius)',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Bar dataKey="net" radius={4}>
            <LabelList dataKey="net" position="right" style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
