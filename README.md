# Construction ERP System

An enterprise-grade ERP platform for construction companies migrated to Node.js and React SPA with Vite, TypeScript, and modern UI.

## Features
- **Executive Dashboard**: Real-time project CapEx vs actual spend, pending requisition metrics, low inventory alerts, and live site stats.
- **Projects & Sites Management**: Multi-project tracking, budget utilization, daily site logs (weather, worker counts, safety record), and technical engineering RFIs.
- **Material Requisition Workflow**: Multi-tier approval workflow (Managing Director/Finance Review → Procurement Dispatch → Site Engineer Delivery Confirmation with Delivery Note generation).
- **Stores & Inventory**: Material SKU management, category tagging, low-stock reorder thresholds, and bin stock adjustments.
- **Procurement & Purchase Orders**: Supplier purchase order creation, vendor payment terms, and Goods Receipt Notes (GRN) that replenish inventory.
- **HR & Personnel**: Comprehensive employee directory, department/role assignments, salary advance applications & approvals, and loan amortization.
- **Payroll & Accounting**: Monthly payroll execution, statutory deductions (tax, pension, loan deductions), and printable electronic payslips.
- **Ready-Mix Concrete (RMC)**: Mix design formulations (M25, M30, M35, M45), water-cement ratios, slump QA testing, and transit mixer fleet dispatching.
- **Team Communications**: Live internal coordination channel between site engineers, procurement, and management.
- **Multi-Company Architecture**: Instant workspace switching between corporate subsidiaries with custom theme colors and tax profiles.

## Tech Stack
- **Frontend**: React 19, TypeScript, Lucide Icons, Tailwind CSS
- **Build Tool**: Vite
- **Runtime**: Node.js 22

## Running the App
```bash
npm run dev
```
The application will run on `http://0.0.0.0:3000`.
