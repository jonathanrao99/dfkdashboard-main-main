'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CategoricalPoint } from '@/types/dashboard'

interface ExpensesDonutProps {
  data?: CategoricalPoint[]
}

const colors = ['#10b981', '#6366f1', '#f97316', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']

export default function ExpensesDonut({ data: propData }: ExpensesDonutProps) {
  console.log('ExpensesDonut received data:', propData?.length || 0, 'items')

  // Use prop data or fallback to mock data
  const rawData = propData || [
    { category: 'COGS', value: 28736 },
    { category: 'Payroll', value: 18500 },
    { category: 'Fees', value: 3274 },
    { category: 'Packaging', value: 4892 },
    { category: 'Fuel', value: 3456 },
    { category: 'Rent', value: 2200 },
    { category: 'Loan', value: 1800 },
    { category: 'Misc', value: 2342 }
  ]

  // Sort by value and add colors
  const sortedData = rawData
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      name: item.category,
      value: item.value,
      color: colors[index % colors.length]
    }))

  // Keep top 4 categories + aggregate rest into "Other"
  const topCategories = sortedData.slice(0, 4)
  const otherCategories = sortedData.slice(4)
  const otherTotal = otherCategories.reduce((sum, item) => sum + item.value, 0)

  const data = [
    ...topCategories,
    ...(otherTotal > 0 ? [{ name: 'Other', value: otherTotal, color: '#94a3b8' }] : [])
  ]

  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div className="h-80 flex items-center">
      <div className="w-2/3">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                boxShadow: '0 6px 18px rgba(16,24,40,.06)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/3 pl-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900">${(totalExpenses / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-500">Total Expenses</div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-600 truncate">{item.name}</span>
              <span className="text-xs text-gray-400 ml-auto">${(item.value / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}