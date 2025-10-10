'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  category: z.string().min(1, 'Category is required'),
  contact: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional()
})

type VendorFormData = z.infer<typeof vendorSchema>

interface VendorFormProps {
  vendor?: {
    id: string
    name: string
    category: string
    contact: string
    phone: string
    address?: string
    paymentTerms?: string
    notes?: string
  }
  onSave: (data: VendorFormData) => Promise<void>
  trigger?: React.ReactNode
}

const categories = [
  'Food Supplies',
  'Equipment',
  'Services',
  'Utilities',
  'Fuel',
  'Permits & Licenses',
  'Marketing',
  'Insurance',
  'Other'
]

const paymentTerms = [
  'Net 30',
  'Net 15',
  'Net 7',
  'COD',
  'Weekly',
  'Monthly',
  'Other'
]

export default function VendorForm({ vendor, onSave, trigger }: VendorFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor?.name || '',
      category: vendor?.category || '',
      contact: vendor?.contact || '',
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      paymentTerms: vendor?.paymentTerms || 'Net 30',
      notes: vendor?.notes || ''
    }
  })

  const onSubmit = async (data: VendorFormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error saving vendor:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vendor Name</Label>
            <Input
              id="name"
              placeholder="Enter vendor name"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => form.setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select onValueChange={(value) => form.setValue('paymentTerms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Email</Label>
            <Input
              id="contact"
              type="email"
              placeholder="vendor@example.com"
              {...form.register('contact')}
            />
            {form.formState.errors.contact && (
              <p className="text-sm text-red-600">{form.formState.errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...form.register('phone')}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              placeholder="Enter vendor address"
              {...form.register('address')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              {...form.register('notes')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : vendor ? 'Update' : 'Add'} Vendor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

