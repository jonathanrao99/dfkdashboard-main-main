'use client'

import { useState, useEffect } from 'react'
import { ExpensesTable } from '@/components/tables/ExpensesTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Expense } from '@/lib/pnl'
import { ExpenseForm } from '@/components/forms/ExpenseForm'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setFormOpen] = useState(false)

  // These would be fetched from the DB
  const mockCategories = [{id: 'cat1', name: 'Food'}, {id: 'cat2', name: 'Supplies'}]
  const mockVendors = [{id: 'ven1', name: 'Restaurant Depot'}, {id: 'ven2', name: 'Sysco'}]


  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => {
        setExpenses(data.items)
        setLoading(false)
      })
  }, [])

  const handleFormSubmit = async (data: any) => {
    // Logic to create/update expense
    console.log(data)
    setFormOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>
      
      <ExpensesTable data={expenses} />

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        categories={mockCategories}
        vendors={mockVendors}
      />
    </div>
  )
}
