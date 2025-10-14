'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would come from your database
const mockTransactions = [
  { id: 'T1', name: 'Premium T-Shirt', date: 'Jul 12th 2024', status: 'Completed', amount: 49.99, icon: '👕' },
  { id: 'T2', name: 'Playstation 5', date: 'Jul 12th 2024', status: 'Pending', amount: 499.99, icon: '🎮' },
  { id: 'T3', name: 'Hoodie Gombrong', date: 'Jul 12th 2024', status: 'Pending', amount: 79.00, icon: '🧥' },
  { id: 'T4', name: 'iPhone 15 Pro Max', date: 'Jul 12th 2024', status: 'Completed', amount: 1199.00, icon: '📱' },
]

export function TransactionsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map(t => (
            <div key={t.id} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">{t.icon}</div>
              <div className="flex-1">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.date}</p>
              </div>
              <div>
                <Badge variant={t.status === 'Completed' ? 'default' : 'secondary'}>{t.status}</Badge>
                <p className="text-sm text-muted-foreground mt-1 text-right">{`OJWEJS7ISNC`}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
