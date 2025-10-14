'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

const expenseSchema = z.object({
  id: z.string().optional(), // Add id
  date: z.string().min(1, 'Date is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  notes: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExpenseFormValues) => void
  defaultValues?: Partial<ExpenseFormValues>
  categories: { id: string; name: string }[]
  vendors: { id: string; name: string }[]
}

export function ExpenseForm({ isOpen, onClose, onSubmit, defaultValues, categories, vendors }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  })

  React.useEffect(() => {
    if (isOpen) {
      reset(defaultValues)
    }
  }, [isOpen, defaultValues, reset])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-accent-danger">{errors.date.message}</p>}
          </div>

          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" {...register('vendor')} />
            {errors.vendor && <p className="text-sm text-accent-danger">{errors.vendor.message}</p>}
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select {...register('category_id')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-accent-danger">{errors.category_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-sm text-accent-danger">{errors.amount.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
