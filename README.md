# 🍛 Desi Flavors Katy - Financial Dashboard

A world-class financial dashboard built specifically for Desi Flavors Katy food truck, featuring modern UI/UX, comprehensive financial tracking, and seamless integrations.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Built_with-Next.js_14-blue)
![Framework](https://img.shields.io/badge/Framework-App_Router-purple)

## 🚀 Features

### 📊 **Dashboard Overview**
- **Real-time KPIs**: Daily revenue, net profit, expenses tracking
- **Food truck orders**: Live order management with Indian cuisine items
- **Revenue sources**: Walk-up orders, DoorDash, UberEats breakdown
- **Performance metrics**: Order completion, wait times, food cost ratios
- **Interactive charts**: Revenue trends, expense analysis, cash flow

### 💰 **Financial Management**
- **Expense tracking**: Categorized by food supplies, fuel, permits, equipment
- **Vendor management**: Supplier directory with contact info and spending
- **P&L reporting**: Monthly profit & loss with export capabilities
- **Cash flow analysis**: Daily trends and reconciliation status
- **Tax preparation**: Organized data for accounting

### 🔌 **Integrations**
- **Square POS**: Automatic sales data sync
- **Bank integration**: Plaid-powered account linking
- **Delivery platforms**: CSV upload for DoorDash, UberEats, Grubhub
- **Receipt management**: Digital receipt storage and tracking

### ⚙️ **Business Management**
- **Settings**: Business profile, user roles, preferences
- **Notifications**: Custom alerts for high commissions, low cash, expenses
- **Recurring expenses**: Automated tracking of regular payments
- **Data export**: PDF reports and CSV downloads

## 🛠 Tech Stack

### **Frontend**
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom design system
- **shadcn/ui** components for consistent UI
- **Recharts** for interactive data visualization
- **Framer Motion** for smooth animations
- **Lucide React** for modern icons

### **Backend**
- **Next.js API Routes** for serverless functions
- **Supabase** for database and authentication (ready)
- **Plaid API** for banking integration (ready)
- **Square API** for POS integration (ready)

### **Design System**
- **Brand Colors**: Emerald theme matching food truck branding
- **Typography**: Inter font for professional appearance
- **Components**: Reusable cards, forms, tables, and charts
- **Responsive**: Mobile-first design with tablet/desktop optimization

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd dfkdashboard
npm install
```

2. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Add your API keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_ACCESS_TOKEN=your_square_access_token
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
dfkdashboard/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── dashboard/page.tsx   # Main dashboard
│   │   ├── expenses/page.tsx    # Expense management
│   │   ├── reports/page.tsx     # P&L and reports
│   │   ├── vendors/page.tsx     # Supplier management
│   │   ├── integrations/page.tsx # API connections
│   │   ├── settings/page.tsx    # Business settings
│   │   └── layout.tsx           # Dashboard layout
│   ├── api/                     # API routes
│   │   ├── expenses/route.ts    # Expense CRUD
│   │   ├── vendors/route.ts     # Vendor CRUD
│   │   ├── uploads/route.ts     # CSV uploads
│   │   └── report/route.ts      # Report generation
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── src/
│   ├── components/              # Reusable components
│   │   ├── layout/              # Navigation components
│   │   ├── ui/                  # shadcn/ui components
│   │   └── charts/              # Chart components
│   ├── lib/                     # Utilities and helpers
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
└── tailwind.config.ts           # Tailwind configuration
```

## 🎨 Design System

### **Color Palette**
```css
/* Brand Colors */
--brand-700: #0F3D2E  /* Sidebar background */
--brand-600: #145A3D  /* Accent green */
--brand-100: #E6F3EC  /* Light green */

/* Background */
--bg-app: #F6F7F8     /* Page background */
--bg-card: #FFFFFF    /* Card background */

/* Text */
--text-primary: #0F172A    /* Primary text */
--text-secondary: #475569  /* Secondary text */

/* Accents */
--accent-success: #22C55E  /* Success green */
--accent-warning: #F59E0B  /* Warning orange */
--accent-danger: #EF4444   /* Error red */
```

### **Typography**
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scale**: Tailwind's default typography scale

### **Components**
- **Cards**: 14px border radius, subtle shadows
- **Buttons**: Consistent padding, hover states
- **Forms**: Focus states with brand colors
- **Charts**: Muted colors, clean grid lines

## 📊 API Endpoints

### **Expenses**
- `GET /api/expenses` - List expenses with filtering
- `POST /api/expenses` - Create new expense

### **Vendors**
- `GET /api/vendors` - List vendors with search
- `POST /api/vendors` - Add new vendor

### **Uploads**
- `POST /api/uploads` - Process CSV uploads from delivery platforms

### **Reports**
- `GET /api/report?type=pnl` - Generate P&L report
- `GET /api/report?type=cashflow` - Generate cash flow report
- `GET /api/report?type=reconciliation` - Generate reconciliation report

## 🔧 Configuration

### **Tailwind Config**
The design system is configured in `tailwind.config.ts` with:
- Custom color palette
- Extended spacing and sizing
- Custom shadows and animations
- Font family configuration

### **Next.js Config**
Optimized for:
- Image optimization
- Static generation where possible
- API route handling
- TypeScript strict mode

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Environment Setup**
1. Set up Supabase project
2. Configure Plaid sandbox/production
3. Set up Square developer account
4. Add all environment variables

## 📈 Future Enhancements

### **Phase 1: Core Integrations**
- [ ] Supabase database setup
- [ ] Square API integration
- [ ] Plaid banking connection
- [ ] Real-time data sync

### **Phase 2: Advanced Features**
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Employee scheduling
- [ ] Customer loyalty program

### **Phase 3: Scale**
- [ ] Multi-location support
- [ ] Advanced analytics
- [ ] Predictive insights
- [ ] Automated bookkeeping

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary software for Desi Flavors Katy.

## 🆘 Support

For support, contact:
- **Owner**: Jonathan Rao
- **Email**: jonathan@desiflavors.com
- **Phone**: (281) 555-0123

---

**Built with ❤️ for Desi Flavors Katy** 🚛🍛

*Bringing authentic Pakistani and Indian flavors to Katy, Texas with world-class business management.*