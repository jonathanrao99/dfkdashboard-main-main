'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

function ProfitAndLossTable() {
  // Mock data for P&L
  const data = {
    revenue: {
      "Gross Sales": 25000,
      "Discounts": -1500,
      "Net Sales": 23500,
    },
    cogs: {
      "Food": 8000,
      "Beverages": 2000,
      "Total COGS": 10000,
    },
    grossProfit: 13500,
    expenses: {
      "Labor": 4000,
      "Rent": 2500,
      "Utilities": 800,
      "Marketing": 1200,
      "Total Expenses": 8500,
    },
    netProfit: 5000,
  }

  const renderSection = (title: string, items: Record<string, number>) => (
    <>
      <TableRow className="font-semibold">
        <TableCell>{title}</TableCell>
        <TableCell />
      </TableRow>
      {Object.entries(items).map(([key, value]) => (
        <TableRow key={key}>
          <TableCell className="pl-8">{key}</TableCell>
          <TableCell className="text-right">{`$${value.toLocaleString()}`}</TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {renderSection('Revenue', data.revenue)}
            <TableRow className="font-semibold bg-muted">
              <TableCell>Gross Profit</TableCell>
              <TableCell className="text-right">{`$${data.grossProfit.toLocaleString()}`}</TableCell>
            </TableRow>
            {renderSection('Cost of Goods Sold', data.cogs)}
            {renderSection('Operating Expenses', data.expenses)}
            <TableRow className="font-semibold bg-muted">
              <TableCell>Net Profit</TableCell>
              <TableCell className="text-right">{`$${data.netProfit.toLocaleString()}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Detailed financial statements and analysis.</p>
      </div>
      <Tabs defaultValue="pnl">
        <TabsList>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="cogs">COGS</TabsTrigger>
        </TabsList>
        <TabsContent value="pnl" className="mt-6">
          <ProfitAndLossTable />
        </TabsContent>
        <TabsContent value="sales">
          <p>Sales reports will go here.</p>
        </TabsContent>
        <TabsContent value="cogs">
          <p>Cost of Goods Sold reports will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
