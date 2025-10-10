'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Paperclip, MoreHorizontal } from 'lucide-react'

// Mock data
const expenses = [
  {
    id: 1,
    date: '2024-07-12',
    vendor: 'Premium T-Shirt',
    category: 'Inventory',
    amount: 150.00,
    notes: 'Quality cotton t-shirts for summer collection',
    receipt: true,
    status: 'Completed'
  },
  {
    id: 2,
    date: '2024-07-12',
    vendor: 'Playstation 5',
    category: 'Equipment',
    amount: 499.99,
    notes: 'Gaming console for break room',
    receipt: false,
    status: 'Pending'
  },
  {
    id: 3,
    date: '2024-07-12',
    vendor: 'Hoodie Gombrong',
    category: 'Inventory',
    amount: 85.00,
    notes: 'Oversized hoodies for streetwear line',
    receipt: true,
    status: 'Pending'
  },
  {
    id: 4,
    date: '2024-07-12',
    vendor: 'iPhone 15 Pro Max',
    category: 'Equipment',
    amount: 1199.00,
    notes: 'Business phone upgrade',
    receipt: true,
    status: 'Completed'
  },
  {
    id: 5,
    date: '2024-07-12',
    vendor: 'Lotse',
    category: 'Supplies',
    amount: 25.50,
    notes: 'Coffee supplies for office',
    receipt: true,
    status: 'Completed'
  },
  {
    id: 6,
    date: '2024-07-12',
    vendor: 'Starbucks',
    category: 'Meals',
    amount: 12.75,
    notes: 'Team meeting coffee',
    receipt: true,
    status: 'Completed'
  },
  {
    id: 7,
    date: '2024-07-12',
    vendor: 'Tinek Detstar T-Shirt',
    category: 'Inventory',
    amount: 45.00,
    notes: 'Limited edition graphic tees',
    receipt: true,
    status: 'Completed'
  }
]

export default function ExpensesTable() {
  const [data] = useState(expenses)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="status-badge success">{status}</Badge>
      case 'Pending':
        return <Badge className="status-badge warning">{status}</Badge>
      default:
        return <Badge className="status-badge neutral">{status}</Badge>
    }
  }

  return (
    <div className="dashboard-card">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Receipt</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td className="font-medium">{expense.vendor}</td>
                <td>{expense.category}</td>
                <td className="font-medium">${expense.amount.toFixed(2)}</td>
                <td className="text-text-secondary max-w-xs truncate">{expense.notes}</td>
                <td>
                  {expense.receipt ? (
                    <Paperclip className="w-4 h-4 text-text-muted" />
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td>{getStatusBadge(expense.status)}</td>
                <td>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
