-- Core tables for analytics-ledger system
-- This migration replaces the complex existing schema with a streamlined ledger-first approach

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Integration items (Square locations, Plaid items)
CREATE TABLE IF NOT EXISTS integration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,                        -- 'square' | 'plaid'
  external_id TEXT NOT NULL,                     -- location_id | item_id
  access_token_enc TEXT NOT NULL,                -- encrypted; see comment below
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON integration_items(provider, external_id);

-- Vendors for bill tracking
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  square_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Central ledger transactions table
CREATE TABLE IF NOT EXISTS ledger_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,                          -- 'square_order' | 'plaid_txn' | 'bill'
  external_id TEXT NOT NULL UNIQUE,              -- provider id / bill id
  occurred_at TIMESTAMPTZ NOT NULL,              -- store as UTC
  amount_cents BIGINT NOT NULL,                  -- integer cents (signed)
  direction TEXT NOT NULL,                       -- 'inflow' | 'outflow'
  account TEXT NOT NULL,                         -- 'sales' | 'bank' | 'ap'
  currency TEXT NOT NULL DEFAULT 'USD',
  location_id TEXT,
  vendor_id UUID REFERENCES vendors(id),
  category TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON ledger_txns(occurred_at);
CREATE INDEX ON ledger_txns(source);
CREATE INDEX ON ledger_txns(vendor_id);

-- Bills for AP tracking
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  upload_id TEXT NOT NULL,                       -- Supabase Storage key
  invoice_number TEXT,
  invoice_date DATE,
  due_date DATE,
  subtotal_cents BIGINT,
  tax_cents BIGINT,
  total_cents BIGINT,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft',          -- 'draft' | 'posted'
  lines JSONB NOT NULL DEFAULT '[]',
  raw_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store hours/settings for filtering
CREATE TABLE IF NOT EXISTS store_hours_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timezone TEXT NOT NULL DEFAULT 'America/Chicago',
  use_hours_filter BOOLEAN NOT NULL DEFAULT TRUE,
  days JSONB NOT NULL DEFAULT '[]',              -- [{weekday,open:'17:00',close:'01:00',bufferMin:59,isClosed:false}]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security: read-only public for analytics via server; writes require service role
ALTER TABLE integration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_hours_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (if you want client-side charts). Server writes use service role.
CREATE POLICY "read_ledger" ON ledger_txns FOR SELECT USING (TRUE);
CREATE POLICY "read_vendors" ON vendors FOR SELECT USING (TRUE);
CREATE POLICY "read_bills" ON bills FOR SELECT USING (TRUE);
CREATE POLICY "read_hours" ON store_hours_settings FOR SELECT USING (TRUE);
-- No insert/update/delete policies → only service role can write by default.

-- Optional RPC for fast monthly/daily/hourly sales aggregation (NET already in ledger)
CREATE OR REPLACE FUNCTION analytics_sales(
  p_start TIMESTAMPTZ,
  p_end   TIMESTAMPTZ,
  p_tz    TEXT,
  p_grain TEXT,               -- 'hour' | 'day' | 'month'
  p_offset_min INT
)
RETURNS TABLE(bucket TIMESTAMPTZ, sales_cents BIGINT)
LANGUAGE SQL STABLE AS $$
  WITH base AS (
    SELECT (occurred_at AT TIME ZONE p_tz)    AS ts_local,
           amount_cents
    FROM ledger_txns
    WHERE source = 'square_order'
      AND direction = 'inflow'
      AND occurred_at >= p_start
      AND occurred_at <  p_end
  ),
  shifted AS (
    SELECT ts_local - MAKE_INTERVAL(mins => p_offset_min) AS ts_shifted,
           amount_cents
    FROM base
  ),
  buck AS (
    SELECT DATE_TRUNC(p_grain, ts_shifted) AS b, SUM(amount_cents) AS sales_cents
    FROM shifted
    GROUP BY 1
  )
  SELECT b + MAKE_INTERVAL(mins => p_offset_min) AS bucket, sales_cents
  FROM buck
  ORDER BY 1;
$$;

-- Insert default store hours settings
INSERT INTO store_hours_settings (timezone, use_hours_filter, days)
VALUES ('America/Chicago', TRUE, '[]'::JSONB)
ON CONFLICT DO NOTHING;
