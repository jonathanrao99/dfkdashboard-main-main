'use client'

import { useState, useEffect } from 'react'
import { InventoryTable } from '@/components/tables/InventoryTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { InventoryItem } from '@/lib/pnl'

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inventory/items')
      .then(res => res.json())
      .then(data => {
        setItems(data.items)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      
      {loading ? <p>Loading inventory...</p> : <InventoryTable data={items} />}
    </div>
  )
}
