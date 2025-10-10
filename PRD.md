Desi Flavors Katy — Financial Dashboard

Single Source of Truth for Cursor
Last updated: 2025-10-05 (America/Chicago)

This document is the one canonical reference for the project. Cursor should treat it as authoritative for file structure, coding conventions, APIs, database, and UX rules. Anything not specified here is out of scope.

0) Vision & Non-Negotiables

Goal: A Stripe-grade, calm, decision-first financial dashboard for a food truck.
North-star KPIs (Overview): Net Sales (MTD), Expenses (MTD), Net Profit (MTD), Cash in Bank (today).
Key Integrations: Square (orders & payouts), Supabase (DB/Auth/Storage/Edge), Plaid (bank), CSV fallbacks (DoorDash/UberEats/Grubhub).
New Features: Scan Bill (OCR → line-items → expense), Inventory (items, stock movements, COGS).
Must-haves: Mobile responsiveness, shadcn/ui consistency, all buttons functional, accurate P&L parity with data.
No Prisma. Use Supabase client (server route handlers + RSC).

1) Tech Stack & Tooling

Frontend: Next.js 14 (App Router, RSC) + TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion, Recharts, TanStack Table, React Hook Form + Zod, date-fns.

Backend: Supabase (Postgres + Auth + Storage + Edge Functions).

Integrations: Square (OAuth + Webhooks), Plaid (Transactions), Delivery CSVs.

Build/Deploy: Vercel + Supabase.

Quality: ESLint, Prettier, TS strict, Husky + lint-staged.

Testing: Vitest/RTL for units, Playwright for happy-paths (upload CSV, add expense, export P&L).

2) Repository Layout
app/
  (dashboard)/
    layout.tsx                 # Sidebar + Topbar (sticky)
    dashboard/page.tsx         # Overview (calm/minimal)
    expenses/page.tsx
    reports/page.tsx
    vendors/page.tsx
    integrations/page.tsx
    inventory/page.tsx         # NEW
    scan-bill/page.tsx         # NEW
    settings/page.tsx
  api/
    expenses/route.ts
    expenses/[id]/route.ts
    uploads/route.ts           # CSV ingest
    report/route.ts            # P&L JSON + PDF
    reconcile/route.ts
    inventory/items/route.ts   # CRUD Items
    inventory/moves/route.ts   # Stock movements
    scan-bill/route.ts         # Parse & draft expense
    square/oauth/route.ts      # OAuth start/callback
    square/webhook/route.ts
    plaid/link/route.ts
    plaid/webhook/route.ts
components/
  layout/Sidebar.tsx, Topbar.tsx
  kpi/KpiCard.tsx
  charts/ChartContainer.tsx
  charts/SparkNetSales.tsx
  charts/ExpensesDonut.tsx
  charts/ChannelMix.tsx
  blocks/ReconciliationAndAlerts.tsx
  tables/ExpensesTable.tsx
  tables/InventoryTable.tsx
  forms/ExpenseForm.tsx, VendorForm.tsx
  uploads/DropCSV.tsx, ReceiptUpload.tsx
  date/DateRangeButton.tsx    # Square-style modal picker (see §7.2)
lib/
  supabase.ts
  pnl.ts
  alerts.ts
  csv/parseDoorDash.ts, parseUberEats.ts, parseGrubhub.ts
  inventory.ts                 # Valuation & COGS helpers
  square.ts                    # SDK helpers
  plaid.ts                     # SDK helpers
  ocr/normalize.ts             # Scan Bill post-OCR normalizer
styles/
  tailwind.config.ts
  app/globals.css
scripts/
  test-supabase.js
db/
  schema.sql

3) Environment & Setup
3.1 .env.local (local dev)
NEXT_PUBLIC_SUPABASE_URL=https://tpncxlxsggpsiswoownv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=___
SERVICE_ROLE_KEY=___

SQUARE_APP_ID=___
SQUARE_APP_SECRET=___
SQUARE_ENV=sandbox            # 'sandbox'|'production'
SQUARE_WEBHOOK_SIGNATURE=___

PLAID_CLIENT_ID=___
PLAID_SECRET=___
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions

# Optional: OCR/LLM provider for Scan Bill (if used)
OCR_PROVIDER=local            # 'local'|'gcloud'|'azure' etc.
LLM_PROVIDER=none             # 'none'|'openai'|'azure' (keep 'none' if not configured)

3.2 Quick start
pnpm i
pnpm dlx shadcn-ui@latest init -d
pnpm dlx shadcn-ui@latest add button card input label select separator badge dropdown-menu sheet tabs table dialog toast tooltip progress skeleton avatar
pnpm run dev

4) Design System (tokens & rules)

Page bg: #F6F7F8; Card bg: #FFFFFF; Border: #E5E7EB; Radius: 14px; Shadow: 0 6px 18px rgba(16,24,40,.06)

Text: primary #0F172A, secondary #475569

Brand: 100 #E6F3EC, 600 #145A3D, 700 #0F3D2E

Accents: success #22C55E, warn #F59E0B, danger #EF4444, info #0EA5E9

Typography: Inter; compact spacing; no neon/saturated fills.

Recharts Theme:
Grid #E2E8F0, Axes #CBD5E1, Ticks 12px #475569, Lines 2px, Area fills 12–18% opacity, Bars radius 6, Tooltips = white card + 14px radius.

Mobile Rules:

1-column grid on xs, 2 on sm, 4 on lg for KPIs.

Tap targets ≥ 40px height.

Sticky Topbar; Sidebar collapses to Sheet.

Tables degrade to card lists on < md.

5) Database (Supabase / Postgres)
5.1 Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

5.2 Core Tables (excerpt; full in db/schema.sql)

accounts(id, name, type, external_id, created_at)

uploads(id, source, filename, rows_loaded, uploaded_at, notes)

revenue_orders(...) — source, order_datetime, items_gross, discounts, tax, tips, platform_commission, processing_fees, adjustments, payout_amount, raw

payouts(account_id, source, payout_date, amount, raw)

categories(id, name unique, parent_id)

vendors(id, name, default_category)

transactions(...) — income positive, expense negative, receipt_url

reconciliations(revenue_order_id, payout_id, transaction_id, linked_at)

budgets(category_id, month, cap)

recurring_rules(name, day_of_month, amount, category_id, vendor_id)

categorization_rules(matcher, category_id, vendor_id)

audit_log(event, payload, actor, created_at)

5.3 Inventory Tables (NEW)
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  unit text not null,          -- 'lb','kg','unit','gal', etc.
  cost_per_unit numeric(12,4) not null default 0,
  reorder_point numeric(12,3) default 0,
  category_id uuid references categories(id),
  vendor_id uuid references vendors(id),
  created_at timestamptz default now()
);

create table if not exists inventory_moves (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references inventory_items(id) not null,
  move_date timestamptz not null default now(),
  qty numeric(14,4) not null,
  unit_cost numeric(12,4) not null default 0,
  type text not null,          -- 'purchase'|'usage'|'adjustment'
  reference_id uuid,           -- link to transaction id or order id if needed
  notes text
);


Inventory Derived:

On purchase, create: transactions(type='expense') and inventory_moves(type='purchase').

On usage, create: inventory_moves(type='usage') to compute COGS (FIFO simple; see lib/inventory.ts).

Show on-hand = Σqty (purchase − usage ± adjustment).

Monthly COGS = Σusage.qty × cost (FIFO or average).

6) Data Contracts (TypeScript)
// charts
export type DailyNet = { d: string; net: number };
export type CategorySpend = { category: string; value: number };
export type SourceNet = { source: 'Square'|'DoorDash'|'UberEats'|'Grubhub'|'Catering'; net: number };

// reconciliation
export type ReconcileStats = { payoutsMatched: number; payoutsTotal: number; bankUnmatched: number; alerts: string[] };

// expenses
export type Expense = { id: string; date: string; vendor: string; category: string; amount: number; notes?: string; receiptUrl?: string };

// inventory
export type InventoryItem = { id: string; sku?: string; name: string; unit: string; costPerUnit: number; onHand: number; reorderPoint?: number; vendor?: string; category?: string };
export type InventoryMove = { id: string; itemId: string; moveDate: string; qty: number; unitCost: number; type: 'purchase'|'usage'|'adjustment'; referenceId?: string; notes?: string };

// scan-bill
export type ScanBillDraft = {
  vendorGuess?: string;
  dateGuess?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  lines: Array<{ name: string; qty: number; unitPrice: number; lineTotal: number; categoryGuess?: string }>;
  raw?: unknown;
};


Formulas

order_net = items_gross - discounts + tax + tips - platform_commission - processing_fees + adjustments
fee_take_rate = (platform_commission + processing_fees) / items_gross

7) UX Blueprints
7.1 Overview (minimal & calm)

Row 1 (4 KPI cards): Net Sales (MTD), Expenses (MTD), Net Profit (MTD), Cash in Bank (today).

Row 2: Sparkline Net Sales (2/3), Expenses Donut (1/3, top 4 + “Other”).

Row 3: Channel Mix (left), Reconciliation & Alerts (right, 3 bullets max).

Height ≤ 1.5 screens on desktop; mobile 1-column.

7.2 Square-style Date Range Picker (component: date/DateRangeButton.tsx)

Trigger Button shows current range (e.g., “Oct 1–5, 2025”).

On click, modal sheet with:

Presets: Today, Yesterday, Last 7 days, Month to date, Last month, Custom…

Two-month calendar; selecting start then end; live range summary.

Apply (primary), Cancel (secondary).

Emits { start: Date, end: Date, preset?: string }.

Must be compact on mobile; accessible (keyboard & screen reader).

7.3 Expenses

Filter bar (date, vendor, category).

Table with inline edit (vendor/category/notes), receipt upload (Supabase Storage).

Add Expense dialog (date, vendor, category, amount>0, notes, receipt).

Bulk CSV import with column mapping preview.

7.4 Reports

P&L (MTD & month selector): Revenue (by source), COGS, Opex, Net Profit.

Sales Tax (sum tax column from revenue_orders).

Reconciliation: unmatched deposits/payouts with suggestions.

Export CSV & PDF (server-side via @react-pdf/renderer).

7.5 Integrations

Cards: Square, Plaid, DoorDash, UberEats, Grubhub.

Show connection state + last sync.

CSV drag-drop for delivery platforms.

7.6 Inventory (NEW)

Items table: Name, SKU, Unit, On-hand, Cost/Unit, Reorder point, Vendor.

Movements tab: chronological list; add Purchase/Usage/Adjustment.

COGS rollup on Reports uses inventory_moves (usage).

Empty state + CTA to add first item.

7.7 Scan Bill (NEW)

Page with Upload (image/PDF) → server extract → draft expense review:

Vendor/date guesses, subtotal/tax/total, parsed line-items, category suggestions.

Buttons: Save as Expense, Attach to Inventory Purchase (creates purchase movements), Discard.

Store original file in Supabase Storage; maintain audit_log event.

8) API Contracts (Route Handlers)
8.1 /api/report (GET)

Returns:

{
  kpis: { netSalesMtd: number; expensesMtd: number; netProfitMtd: number; cashToday: number; salesTaxMtd: number },
  netSalesDailyMtd: DailyNet[],
  expensesByCategory: CategorySpend[],    // top 4 + Other
  netBySource: SourceNet[],               // after fees
  reconcile: ReconcileStats
}

8.2 /api/uploads?source=DoorDash|UberEats|Grubhub (POST multipart)

Parses CSV → revenue_orders, logs uploads.rows_loaded.

Returns { rowsLoaded, warnings?: string[] }.

8.3 /api/expenses (GET/POST), /api/expenses/[id] (PATCH/DELETE)

Standard CRUD per Expense.

8.4 /api/reconcile (POST)

Runs matching: payouts ↔ transactions (±1 day, ±$2).

Returns ReconcileStats.

8.5 /api/inventory/items (GET/POST) & /api/inventory/moves (GET/POST)

Items CRUD; Movements (purchase/usage/adjustment).

On purchase with attachment: create transactions expense + inventory_moves.

8.6 /api/scan-bill (POST)

Body: file (multipart).
Flow: store file → OCR → normalize → draft ScanBillDraft.
Returns draft for UI review; not persisted until user clicks Save.

8.7 Square

/api/square/oauth (GET/redirect) and callback (handles token exchange, stores in accounts.external_id/secure table).

/api/square/webhook (POST) — verify signature, upsert orders/payouts.

8.8 Plaid

/api/plaid/link (POST) — exchange token; store access token in secure table.

/api/plaid/webhook (POST) — new transactions → upsert transactions.

Security: Service role key only on server. Never expose Square/Plaid secrets client-side.

9) Edge Functions (Supabase) — Nightly Jobs

square-sync: Pull orders & payouts (last 7 days window), upsert into revenue_orders/payouts.

plaid-sync: Fetch new bank transactions, upsert transactions.

reconcile: Auto-match based on date/amount heuristics, store reconciliations.

alerts: Evaluate rules in lib/alerts.ts and persist a daily snapshot.

10) Cursor Rules (Very Important)

Never add Prisma. Use @supabase/supabase-js only.

Respect file paths and names exactly as in §2. Create missing files if imported.

Keep Overview minimalist (strict widget count in §7.1). Do not add extra blocks.

Use shadcn/ui for all primitives (Buttons/Dialogs/Tabs/Tables/Sheet/Toasts/Tooltip).

Charts must follow Recharts theme (§4). No neon; bars radius 6; line width 2.

Date range uses DateRangeButton.tsx with modal flow (§7.2).

Mobile first: grid collapses; tables → card lists; all buttons ≥ 40px height.

Forms: React Hook Form + Zod; show inline errors; disable submit while pending.

Storage: receipts & uploads → Supabase Storage; return signed URLs to client.

PDF/CSV exports: server-side only; ensure totals match on-screen P&L.

TypeScript strict: no any; define types in §6.

Accessibility: semantic headings; chart aria-label summarizing trend; keyboard dialogs.

Performance: skeletons over spinners; batch inserts; paginate tables; cache read queries where safe.

Audit: on create/update/delete & upload events, insert into audit_log.

Buttons must work: if a button is rendered, wire it to a real handler or remove it.

Cursor Task Prompts (paste into Cursor):

“Create components/date/DateRangeButton.tsx that opens a compact modal with Square-like presets and a two-month calendar. It should return {start,end,preset} and be responsive as per §7.2.”

“Implement /api/report using Supabase tables and formulas in §6. Return object per §8.1. Add unit tests for pnl aggregation in lib/pnl.ts.”

“Build app/(dashboard)/scan-bill/page.tsx with upload → preview draft → ‘Save as Expense’ & ‘Attach to Inventory Purchase’ flows. Use types in §6 and route in §8.6.”

“Implement inventory pages and APIs in §7.6 & §8.5. Include FIFO COGS helper in lib/inventory.ts with tests.”

“Wire Square OAuth & webhook per §8.7 using official SDK. Store tokens server-side; never expose on client.”

“Add Plaid link & webhook per §8.8. Store transactions; show Cash in Bank KPI on Overview.”

11) Scan Bill — Implementation Notes

Pipeline: Upload → OCR → Normalize → Heuristics → Draft → Human Review → Persist.

OCR: start with local (e.g., Tesseract) if no cloud; allow provider swap via env.

Normalization: lib/ocr/normalize.ts cleans amounts, dates, line text, quantities.

Heuristics: vendor from header keywords; date from patterns; totals cross-check (sum lines + tax ≈ total).

Inventory Option: if the bill is inventory, create inventory_moves(type='purchase') with per-line qty & unit_cost, and one expense transactions record matching bill total (or map to categories).

UI Review: allow editing vendor, date, lines, categories before save.

Storage: always save original file; link receipt_url on transaction(s).

12) Inventory — Implementation Notes

Items: create from Vendors or ad-hoc; optional SKU; unit is mandatory.

On-hand: computed on the fly or via materialized view (optional later).

Movements:

Purchase (+qty, unit_cost); may originate from Scan Bill.

Usage (-qty) recorded daily or via recipe multipliers (future).

Adjustment (+/-) for shrinkage/audit.

COGS: FIFO by default (keep a simple queue per item); fall back to average cost if gaps.

Reports: show MTD usage value → P&L COGS bucket.

13) Alerts Engine (lib/alerts.ts)

Rules evaluated daily or on demand:

High take-rate: weekly average per platform > 0.28 ⇒ warn.

Fuel anomaly: category “Fuel” spend > 1.5× 4-week avg ⇒ warn.

Missing CSV: no DoorDash/UE/GH CSV in last 7 days ⇒ info.

Cash leak: cash sales without deposit > 3 days ⇒ warn.
Return { alerts: string[] } (max 3 for Overview).

14) QA, Acceptance & Definition of Done

Functional

Overview strictly as §7.1.

Date range picker matches §7.2 UX and works across pages.

Expenses CRUD + receipts upload to Supabase Storage.

CSV import handles 5k+ rows < 6s and logs uploads.

Reports P&L equals on-screen KPIs; PDF/CSV exports accurate.

Reconciliation accuracy ≥ 99% on test fixtures.

Inventory on-hand and COGS match movements.

Scan Bill creates accurate drafts and persists correctly.

Square OAuth + webhook functional; Plaid link + webhook functional.

Performance

TTI < 2.5s desktop; charts no layout shift; skeletons visible for ≥300ms.

Accessibility

Keyboardable dialogs; chart aria labels; sufficient contrast.

Mobile

Responsive grids; table → card lists; sticky topbar; tap targets ≥ 40px.

Quality

TS strict; ESLint/Prettier clean; Husky pre-commit runs.

Unit tests for pnl.ts, inventory.ts FIFO, and ocr/normalize.ts.

Playwright flows: upload CSV → dashboard updates; scan bill → save expense; add usage → COGS updates.

15) Development Checklist (Cursor can run in order)

Tailwind + shadcn tokens & globals per §4.

Layout shell (Sidebar, Topbar) + DateRangeButton.

Overview components (SparkNetSales, ExpensesDonut, ChannelMix, Reconciliation & Alerts).

/api/report + lib/pnl.ts (+ tests).

Expenses page (table, form, receipts) + /api/expenses.

CSV uploads + parsers + /api/uploads.

Square OAuth + webhook + Edge function nightly sync.

Plaid link/webhook + nightly sync + Cash KPI.

Inventory pages + APIs + FIFO COGS (+ tests).

Scan Bill page + API + normalizer (+ tests).

Reports page P&L + Sales Tax + Reconciliation + Exports.

Alerts engine + Overview integration.

Playwright scenarios + polish + a11y pass.

16) Troubleshooting

“Table not found” → run db/schema.sql in Supabase.

“Permission denied” → verify service role key server-side only.

“Connection failed” → check Supabase URL/keys; inspect Supabase logs.

Square/Plaid issues → rotate secrets; verify webhook signature and callback URL; confirm environment (sandbox vs production).

OCR poor accuracy → allow manual correction; try higher-res, grayscale; consider provider switch.

17) Appendix — Commands
# Verify Supabase connection
npm i dotenv
node scripts/test-supabase.js

# Dev
pnpm dev

# Lint & test
pnpm lint
pnpm test
pnpm exec playwright test


This document supersedes all previous notes. If any spec here conflicts with older docs, follow this one.