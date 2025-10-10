import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client for browser usage (read-only for analytics)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client for server-side operations (service role for writes)
export const supabaseServer = () =>
  createClient(supabaseUrl, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

// Alias for backward compatibility
export const supabaseAdmin = supabaseServer()

// Database types for new ledger-first schema
export interface IntegrationItem {
  id: string
  provider: 'square' | 'plaid'
  external_id: string
  access_token_enc: string
  status: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  name: string
  square_id?: string
  created_at: string
  updated_at: string
}

export interface LedgerTxn {
  id: string
  source: 'square_order' | 'plaid_txn' | 'bill'
  external_id: string
  occurred_at: string
  amount_cents: number
  direction: 'inflow' | 'outflow'
  account: 'sales' | 'bank' | 'ap'
  currency: string
  location_id?: string
  vendor_id?: string
  category?: string
  meta?: any
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  vendor_id?: string
  upload_id: string
  invoice_number?: string
  invoice_date?: string
  due_date?: string
  subtotal_cents?: number
  tax_cents?: number
  total_cents?: number
  currency: string
  status: 'draft' | 'posted'
  lines: any[]
  raw_json: any
  created_at: string
  updated_at: string
}

export interface StoreHoursSettings {
  id: string
  timezone: string
  use_hours_filter: boolean
  days: any[]
  created_at: string
  updated_at: string
}

// Legacy types (keeping for backward compatibility during transition)
export interface Account {
  id: string
  name: string
  type: 'platform' | 'bank' | 'cash'
  external_id?: string
  created_at: string
}

export interface Upload {
  id: string
  source: string
  filename: string
  rows_loaded: number
  uploaded_at: string
  notes?: string
}

export interface RevenueOrder {
  id: string
  upload_id?: string
  source: string
  order_id: string
  order_datetime: string
  items_gross: number
  discounts: number
  tax: number
  tips: number
  platform_commission: number
  processing_fees: number
  adjustments: number
  payout_amount: number
  raw?: any
}

export interface Payout {
  id: string
  account_id: string
  source: string
  payout_id?: string
  payout_date: string
  amount: number
  raw?: any
}

export interface Category {
  id: string
  name: string
  parent_id?: string
}

export interface Transaction {
  id: string
  account_id: string
  txn_date: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  description?: string
  vendor_id?: string
  category_id?: string
  source?: string
  external_id?: string
  receipt_url?: string
  created_at: string
}

export interface Reconciliation {
  id: string
  revenue_order_id?: string
  payout_id?: string
  transaction_id?: string
  linked_at: string
}

