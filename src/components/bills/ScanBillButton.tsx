'use client'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ScanBillButton({ onScanComplete }: { onScanComplete?: () => void }) {
  const [scanning, setScanning] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/bills/scan', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Scan failed')

      const data = await res.json()
      toast.success(`Bill scanned! ${data.inventoryItemsUpdated} inventory items updated`)
      onScanComplete?.()
    } catch (error) {
      console.error('Scan error:', error)
      toast.error('Failed to scan bill')
    } finally {
      setScanning(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="bill-scan-input"
      />
      <Button
        onClick={() => document.getElementById('bill-scan-input')?.click()}
        disabled={scanning}
        className="bg-[--brand-600] hover:bg-[--brand-700]"
      >
        {scanning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Scan Bill
          </>
        )}
      </Button>
    </div>
  )
}
