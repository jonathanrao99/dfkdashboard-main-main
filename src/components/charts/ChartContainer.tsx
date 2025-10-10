import { ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  children: ReactNode
  className?: string
}

export default function ChartContainer({ title, children, className = '' }: ChartContainerProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-card p-6 ${className}`}>
      <div className="text-sm text-gray-600 mb-4">{title}</div>
      {children}
    </div>
  )
}