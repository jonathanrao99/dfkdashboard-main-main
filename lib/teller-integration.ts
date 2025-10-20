// Teller API integration for banking data
const TELLER_API_BASE = 'https://api.teller.io'

export interface TellerAccount {
  id: string
  name: string
  type: string
  currency: string
  balance: number
}

export interface TellerTransaction {
  id: string
  account_id: string
  amount: number
  description: string
  date: string
  type: 'debit' | 'credit'
  category?: string
}

export async function getTellerAccounts(): Promise<TellerAccount[]> {
  try {
    const response = await fetch(`${TELLER_API_BASE}/accounts`, {
      headers: {
        'Authorization': `Bearer ${process.env.TELLER_Token_Key}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Teller API error: ${response.status}`)
    }

    const accounts = await response.json()
    return accounts.map((account: any) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      currency: account.currency,
      balance: parseFloat(account.balance)
    }))
  } catch (error) {
    console.error('Error fetching Teller accounts:', error)
    return []
  }
}

export async function getTellerTransactions(accountId: string, startDate?: string, endDate?: string): Promise<TellerTransaction[]> {
  try {
    const params = new URLSearchParams()
    if (startDate) params.append('from', startDate)
    if (endDate) params.append('to', endDate)

    const response = await fetch(`${TELLER_API_BASE}/accounts/${accountId}/transactions?${params}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TELLER_Token_Key}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Teller API error: ${response.status}`)
    }

    const transactions = await response.json()
    return transactions.map((txn: any) => ({
      id: txn.id,
      account_id: txn.account_id,
      amount: parseFloat(txn.amount),
      description: txn.description,
      date: txn.date,
      type: txn.type,
      category: txn.category
    }))
  } catch (error) {
    console.error('Error fetching Teller transactions:', error)
    return []
  }
}

export async function getBankingSummary() {
  try {
    const accounts = await getTellerAccounts()
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
    
    // Get recent transactions from all accounts
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const allTransactions = await Promise.all(
      accounts.map(account => getTellerTransactions(account.id, startDate, endDate))
    )
    
    const transactions = allTransactions.flat()
    const totalInflow = transactions
      .filter(txn => txn.type === 'credit')
      .reduce((sum, txn) => sum + txn.amount, 0)
    
    const totalOutflow = transactions
      .filter(txn => txn.type === 'debit')
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)

    return {
      totalBalance,
      totalInflow,
      totalOutflow,
      netFlow: totalInflow - totalOutflow,
      accountCount: accounts.length,
      transactionCount: transactions.length,
      accounts: accounts.map(account => ({
        id: account.id,
        name: account.name,
        balance: account.balance,
        type: account.type
      }))
    }
  } catch (error) {
    console.error('Error getting banking summary:', error)
    return {
      totalBalance: 0,
      totalInflow: 0,
      totalOutflow: 0,
      netFlow: 0,
      accountCount: 0,
      transactionCount: 0,
      accounts: []
    }
  }
}
