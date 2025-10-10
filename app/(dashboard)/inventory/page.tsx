'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Package, TrendingDown, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  unit: string
  current_quantity: number
  reorder_point: number
  unit_cost_cents: number
  vendor?: { id: string; name: string }
}

interface InventoryStats {
  totalItems: number
  lowStock: number
  totalValue: number
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0
  })

  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'unit',
    current_quantity: 0,
    reorder_point: 0,
    unit_cost_cents: 0
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredItems(filtered)

    // Calculate stats
    const lowStock = filtered.filter(item => item.current_quantity <= item.reorder_point).length
    const totalValue = filtered.reduce((sum, item) => sum + (item.current_quantity * item.unit_cost_cents), 0)
    
    setStats({
      totalItems: filtered.length,
      lowStock,
      totalValue
    })
  }, [searchQuery, items])

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory')
      const data = await res.json()
      setItems(data.items || [])
      setFilteredItems(data.items || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })

      if (!res.ok) throw new Error('Failed to create item')

      toast.success('Inventory item created')
      setDialogOpen(false)
      setNewItem({
        name: '',
        sku: '',
        category: '',
        unit: 'unit',
        current_quantity: 0,
        reorder_point: 0,
        unit_cost_cents: 0
      })
      fetchInventory()
    } catch (error) {
      console.error('Error creating item:', error)
      toast.error('Failed to create inventory item')
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-app] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[--text-primary]">Inventory Management</h1>
            <p className="text-sm text-[--text-secondary] mt-1">Track and manage your inventory items</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[--brand-600] hover:bg-[--brand-700] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                  <Label>Item Name *</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={newItem.sku}
                      onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unit</Label>
                    <Select value={newItem.unit} onValueChange={(val) => setNewItem({ ...newItem, unit: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="lb">Pound</SelectItem>
                        <SelectItem value="oz">Ounce</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Current Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.current_quantity}
                      onChange={(e) => setNewItem({ ...newItem, current_quantity: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reorder Point</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.reorder_point}
                      onChange={(e) => setNewItem({ ...newItem, reorder_point: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.unit_cost_cents / 100}
                      onChange={(e) => setNewItem({ ...newItem, unit_cost_cents: Math.round(parseFloat(e.target.value) * 100) })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[--brand-600] hover:bg-[--brand-700]">
                    Create Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Total Items</p>
                <p className="text-2xl font-semibold text-[--text-primary] mt-1">{stats.totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-[--brand-600]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Low Stock Items</p>
                <p className="text-2xl font-semibold text-[--accent-2] mt-1">{stats.lowStock}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-[--accent-2]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Total Value</p>
                <p className="text-2xl font-semibold text-[--text-primary] mt-1">
                  ${(stats.totalValue / 100).toFixed(2)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-[--brand-600]" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[--text-secondary]" />
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border-subtle]">
                  <th className="text-left p-4 text-sm font-medium text-[--text-secondary]">Item</th>
                  <th className="text-left p-4 text-sm font-medium text-[--text-secondary]">SKU</th>
                  <th className="text-left p-4 text-sm font-medium text-[--text-secondary]">Category</th>
                  <th className="text-right p-4 text-sm font-medium text-[--text-secondary]">Quantity</th>
                  <th className="text-right p-4 text-sm font-medium text-[--text-secondary]">Unit Cost</th>
                  <th className="text-right p-4 text-sm font-medium text-[--text-secondary]">Total Value</th>
                  <th className="text-center p-4 text-sm font-medium text-[--text-secondary]">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[--text-secondary]">
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[--text-secondary]">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLowStock = item.current_quantity <= item.reorder_point
                    const totalValue = (item.current_quantity * item.unit_cost_cents) / 100

                    return (
                      <tr key={item.id} className="border-b border-[--border-subtle] hover:bg-[--bg-hover]">
                        <td className="p-4">
                          <div className="font-medium text-[--text-primary]">{item.name}</div>
                          {item.vendor && (
                            <div className="text-xs text-[--text-secondary] mt-1">{item.vendor.name}</div>
                          )}
                        </td>
                        <td className="p-4 text-sm text-[--text-secondary]">{item.sku || '-'}</td>
                        <td className="p-4 text-sm text-[--text-secondary]">{item.category || '-'}</td>
                        <td className="p-4 text-right text-sm text-[--text-primary]">
                          {item.current_quantity} {item.unit}
                        </td>
                        <td className="p-4 text-right text-sm text-[--text-primary]">
                          ${(item.unit_cost_cents / 100).toFixed(2)}
                        </td>
                        <td className="p-4 text-right text-sm font-medium text-[--text-primary]">
                          ${totalValue.toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[--accent-2]/10 text-[--accent-2] text-xs font-medium">
                              <AlertCircle className="w-3 h-3" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-[--accent-1]/10 text-[--accent-1] text-xs font-medium">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
