'use client'

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts'
import ChartContainer from './ChartContainer'
import { CategorySpend } from '@/lib/pnl'

const COLORS = ['#84cc16', '#f97316', '#22c55e', '#0ea5e9', '#64748b'];

export function ExpensesDonut({ data }: { data: CategorySpend[] }) {
  const chartData = data.length > 5 
    ? [...data.slice(0, 4), { category: 'Other', value: data.slice(4).reduce((acc, cur) => acc + cur.value, 0) }]
    : data;

  const totalValue = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <ChartContainer title="Expenses by Category">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip
            contentStyle={{
              borderRadius: 'var(--radius)',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Legend 
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={60}
            dataKey="value"
            nameKey="category"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-foreground"
          >
            {`$${(totalValue / 1000).toFixed(1)}k`}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
