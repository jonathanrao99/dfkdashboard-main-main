'use client'

import { useState } from 'react'
import { DropCSV } from '@/components/uploads/DropCSV'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ConnectionCard({ name, description, connected }: { name: string, description: string, connected: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <Button variant="destructive">Disconnect</Button>
        ) : (
          <Button>Connect</Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function IntegrationsPage() {
  const [uploadCount, setUploadCount] = useState(0)

  const handleUploadSuccess = () => {
    // This could trigger a re-fetch of data or show a summary
    setUploadCount(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Manage your data connections and upload CSVs.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Live Connections</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ConnectionCard 
            name="Square" 
            description="Live sync for sales and transaction data."
            connected={true} // Placeholder
          />
          <ConnectionCard 
            name="Plaid" 
            description="Connect your bank accounts for expense tracking."
            connected={false} // Placeholder
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">CSV Uploads</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>DoorDash</CardTitle>
            </CardHeader>
            <CardContent>
              <DropCSV source="DoorDash" onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>UberEats</CardTitle>
            </CardHeader>
            <CardContent>
              <DropCSV source="UberEats" onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Grubhub</CardTitle>
            </CardHeader>
            <CardContent>
              <DropCSV source="Grubhub" onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
