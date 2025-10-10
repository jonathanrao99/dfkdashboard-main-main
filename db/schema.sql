-- Desi Flavors Katy Financial Dashboard Database Schema
-- This file contains the complete database schema for the financial dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accounts table for different payment sources
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('platform', 'bank', 'cash')),
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upload tracking for CSV files
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  filename TEXT NOT NULL,
  rows_loaded INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Revenue orders from various sources
CREATE TABLE revenue_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upload_id UUID REFERENCES uploads(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  order_id TEXT NOT NULL,
  order_datetime TIMESTAMPTZ NOT NULL,
  items_gross NUMERIC(12,2) DEFAULT 0,
  discounts NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  tips NUMERIC(12,2) DEFAULT 0,
  platform_commission NUMERIC(12,2) DEFAULT 0,
  processing_fees NUMERIC(12,2) DEFAULT 0,
  adjustments NUMERIC(12,2) DEFAULT 0,
  payout_amount NUMERIC(12,2) DEFAULT 0,
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts from platforms and banks
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id),
  source TEXT NOT NULL,
  payout_id TEXT,
  payout_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors for expense tracking
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  default_category UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- All transactions (income, expenses, transfers)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) NOT NULL,
  txn_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL, -- positive for income, negative for expenses
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  description TEXT,
  vendor_id UUID REFERENCES vendors(id),
  category_id UUID REFERENCES categories(id),
  source TEXT,
  external_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reconciliation links between orders, payouts, and transactions
CREATE TABLE reconciliations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revenue_order_id UUID REFERENCES revenue_orders(id),
  payout_id UUID REFERENCES payouts(id),
  transaction_id UUID REFERENCES transactions(id),
  linked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_revenue_orders_source ON revenue_orders(source);
CREATE INDEX idx_revenue_orders_datetime ON revenue_orders(order_datetime);
CREATE INDEX idx_transactions_date ON transactions(txn_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_payouts_date ON payouts(payout_date);
CREATE INDEX idx_payouts_source ON payouts(source);

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Inventory'),
('Equipment'),
('Supplies'),
('Meals'),
('Logistics'),
('Marketing'),
('Rent'),
('Insurance'),
('Utilities'),
('Professional Services');

-- New tables for enhanced functionality
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id),
  month DATE NOT NULL,       -- first day of month
  cap NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recurring_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,        -- 'Rent', 'Loan Repayment'
  day_of_month INTEGER NOT NULL, -- 1..28
  amount NUMERIC(12,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categorization_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matcher TEXT NOT NULL,     -- SQL ilike pattern or regex
  category_id UUID REFERENCES categories(id),
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event TEXT NOT NULL,       -- 'CREATE_TXN','UPDATE_TXN','UPLOAD_CSV'
  payload JSONB,
  actor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default accounts
INSERT INTO accounts (name, type) VALUES 
('Square', 'platform'),
('DoorDash', 'platform'),
('UberEats', 'platform'),
('Grubhub', 'platform'),
('Main Business Account', 'bank'),
('Cash', 'cash');

