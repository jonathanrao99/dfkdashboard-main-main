'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface IntegrationStatusProps {
  squareData: {
    ordersCount: number
    paymentsCount: number
    catalogItems: number
    lastSynced: string | null
  }
  bankingData: {
    totalBalance: number
    netFlow: number
    accountCount: number
    accounts: Array<{ id: string; name: string; balance: number; type: string }>
  }
  aiInsights: {
    menuAnalysis: any
    businessInsights: any
  }
}

export function IntegrationStatus({ squareData, bankingData, aiInsights }: IntegrationStatusProps) {
  const integrations = [
    {
      name: 'Square POS',
      status: squareData.lastSynced ? 'connected' : 'disconnected',
      icon: '💳',
      details: `${squareData.ordersCount} orders, ${squareData.paymentsCount} payments`,
      lastSync: squareData.lastSynced
    },
    {
      name: 'Teller Banking',
      status: bankingData.accountCount > 0 ? 'connected' : 'disconnected',
      icon: '🏦',
      details: `$${bankingData.totalBalance.toFixed(0)} balance, ${bankingData.accountCount} accounts`,
      lastSync: null
    },
    {
      name: 'OpenAI Analysis',
      status: aiInsights.menuAnalysis?.topItems?.length > 0 ? 'active' : 'inactive',
      icon: '🤖',
      details: 'AI-powered insights and recommendations',
      lastSync: null
    },
    {
      name: 'Supabase Database',
      status: 'connected',
      icon: '🗄️',
      details: 'Real-time data storage and sync',
      lastSync: new Date().toISOString()
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'disconnected':
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-orange-600">🔗</span>
          Integration Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{integration.name}</p>
                  <p className="text-sm text-gray-600">{integration.details}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-gray-500">
                      Last sync: {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(integration.status)}
                <Badge className={getStatusColor(integration.status)}>
                  {integration.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* AI Insights Summary */}
        {aiInsights.businessInsights?.operationalRecommendations?.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🤖 AI Recommendations</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {aiInsights.businessInsights.operationalRecommendations.slice(0, 3).map((rec: string, index: number) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
