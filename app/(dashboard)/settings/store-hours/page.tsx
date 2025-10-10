'use client'

import { useState, useEffect } from 'react'
import { StoreHoursSettings, Weekday } from '@/lib/dateWindow'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dayjs from 'dayjs'

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export default function StoreHoursPage() {
  const [settings, setSettings] = useState<StoreHoursSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchStoreHours()
  }, [])

  const fetchStoreHours = async () => {
    try {
      const response = await fetch('/api/settings/store-hours')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching store hours:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveStoreHours = async () => {
    if (!settings) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/store-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
        alert('Store hours saved successfully!')
      } else {
        alert('Error saving store hours')
      }
    } catch (error) {
      console.error('Error saving store hours:', error)
      alert('Error saving store hours')
    } finally {
      setIsSaving(false)
    }
  }

  const updateDay = (weekday: Weekday, field: keyof StoreHoursSettings['days'][0], value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      days: settings.days.map(day => 
        day.weekday === weekday 
          ? { ...day, [field]: value }
          : day
      )
    })
  }

  const handleReportingTimeChange = (value: string) => {
    if (!settings) return
    const hour = parseInt(value, 10)
    const offset = hour * 60
    updateGlobalSetting('reportingOffsetMin', offset)
  }

  const updateGlobalSetting = (field: keyof StoreHoursSettings, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [field]: value
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading store hours settings...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">Error loading store hours settings</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Store Hours Settings</h1>
        <p className="text-gray-600 text-sm mt-1">Configure your store hours to filter dashboard data accurately.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Global Settings */}
        <EnhancedCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Global Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="timezone">Business Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => updateGlobalSetting('timezone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reportingTime">Reporting Day Start Time</Label>
              <Select
                value={String(Math.floor((settings.reportingOffsetMin || 0) / 60))}
                onValueChange={handleReportingTimeChange}
              >
                <SelectTrigger id="reportingTime" className="mt-1">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(24).keys()].map((hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {dayjs().hour(hour).minute(0).format('hh:mm A')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="useHoursFilter"
                checked={settings.useHoursFilter}
                onCheckedChange={(checked) => updateGlobalSetting('useHoursFilter', checked)}
              />
              <Label htmlFor="useHoursFilter">Use store hours to filter dashboard totals</Label>
            </div>
          </div>
        </EnhancedCard>

        {/* Store Hours by Day */}
        <EnhancedCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Store Hours by Day</h3>
          <div className="space-y-4">
            {WEEKDAYS.map(({ value, label }) => {
              const day = settings.days.find(d => d.weekday === value)
              if (!day) return null

              return (
                <div key={value} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!day.isClosed}
                        onCheckedChange={(checked) => updateDay(value as Weekday, 'isClosed', !checked)}
                      />
                      <span className="text-sm text-gray-600">
                        {day.isClosed ? 'Closed' : 'Open'}
                      </span>
                    </div>
                  </div>
                  
                  {!day.isClosed && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`open-${value}`}>Open Time</Label>
                        <Input
                          id={`open-${value}`}
                          type="time"
                          value={day.open}
                          onChange={(e) => updateDay(value as Weekday, 'open', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`close-${value}`}>Close Time</Label>
                        <Input
                          id={`close-${value}`}
                          type="time"
                          value={day.close}
                          onChange={(e) => updateDay(value as Weekday, 'close', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`buffer-${value}`}>Buffer (min)</Label>
                        <Input
                          id={`buffer-${value}`}
                          type="number"
                          value={day.bufferMin}
                          onChange={(e) => updateDay(value as Weekday, 'bufferMin', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </EnhancedCard>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveStoreHours} 
          disabled={isSaving}
          className="px-6"
        >
          {isSaving ? 'Saving...' : 'Save Store Hours'}
        </Button>
      </div>

      {/* Info Panel */}
      <EnhancedCard>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          How Store Hours Work
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            • <strong>Reporting Day:</strong> Your business day can start at a
            custom time (e.g., 2:00 AM) for accurate daily reports.
          </p>
          <p>
            • <strong>Store Hours Filter:</strong> When enabled, only
            transactions within your open hours (plus buffer) are counted
          </p>
          <p>• <strong>Overnight Hours:</strong> If close time is before open time, it means you're open overnight</p>
          <p>• <strong>Buffer Minutes:</strong> Additional time after closing to account for late transactions</p>
          <p>• <strong>Example:</strong> Open 5:00 PM, Close 1:00 AM, Buffer 59 min = Active until 1:59 AM</p>
        </div>
      </EnhancedCard>
    </div>
  )
}




