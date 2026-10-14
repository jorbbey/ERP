-- ==============================================================================
-- CONSTRUCTION ERP SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Ready for execution in the Supabase Dashboard SQL Editor
-- Includes Table Definitions, Foreign Keys, Indexes, RLS Policies & Nigerian Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CORE MASTER DATA TABLES
-- ==============================================================================

-- Companies (Holdings & Subsidiaries)
CREATE TABLE IF NOT EXISTS public.companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    currency VARCHAR(10) DEFAULT '₦',
    theme_color VARCHAR(20) DEFAULT '#0284c7',
    logo_path TEXT,
    address TEXT NOT NULL,
    tax_number VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    head_employee_id BIGINT,
    head_name VARCHAR(150),
    head_title VARCHAR(150),
    roles TEXT[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles Definitions
CREATE TABLE IF NOT EXISTS public.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    department VARCHAR(150),
    privilege_level VARCHAR(50) DEFAULT 'Standard',
    module_keys TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees (Human Capital)
CREATE TABLE IF NOT EXISTS public.employees (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    department VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    salary NUMERIC(15, 2) DEFAULT 0,
    hire_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    profile_picture TEXT,
    nin VARCHAR(50),
    tin VARCHAR(50),
    bank_name VARCHAR(150),
    account_name VARCHAR(150),
    account_number VARCHAR(50),
    pfa VARCHAR(150),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    qualifications TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (System Access)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    employee_id BIGINT REFERENCES public.employees(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50),
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    avatar TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers / Clients
CREATE TABLE IF NOT EXISTS public.customers (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    balance NUMERIC(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PROJECTS & CONSTRUCTION SITES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    project_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    client_id BIGINT REFERENCES public.customers(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_contact_person VARCHAR(150),
    client_email VARCHAR(150),
    client_phone VARCHAR(50),
    client_address TEXT,
    consultant VARCHAR(255),
    project_type VARCHAR(100),
    description TEXT,
    contract_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
    budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
    spent NUMERIC(15, 2) NOT NULL DEFAULT 0,
    contract_date DATE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    expected_completion_date DATE,
    actual_completion_date DATE,
    site_location TEXT NOT NULL,
    progress_percent INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'planned',
    manager VARCHAR(150) NOT NULL,
    assigned_engineers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project BOQ Budgets
CREATE TABLE IF NOT EXISTS public.project_budgets (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    budget_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    quantity NUMERIC(15, 2) NOT NULL,
    unit_cost NUMERIC(15, 2) NOT NULL,
    total_cost NUMERIC(15, 2) NOT NULL,
    supplier VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Staff Assignments (Site Deployment)
CREATE TABLE IF NOT EXISTS public.project_staff_assignments (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(200) NOT NULL,
    role VARCHAR(150) NOT NULL,
    assigned_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_active_staff_project UNIQUE(project_id, employee_id, status)
);

-- Project Staff Mobilization History
CREATE TABLE IF NOT EXISTS public.project_staff_history (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(200) NOT NULL,
    action VARCHAR(50) NOT NULL,
    role VARCHAR(150) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Daily Site Logs
CREATE TABLE IF NOT EXISTS public.project_daily_logs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weather VARCHAR(100) NOT NULL,
    completed_work TEXT NOT NULL,
    manpower TEXT NOT NULL,
    equipment TEXT NOT NULL,
    safety_note TEXT,
    workers_on_site INTEGER DEFAULT 0,
    safety_incident BOOLEAN DEFAULT false,
    logged_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    progress_percent INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PROCUREMENT, STORES & INVENTORY
-- ==============================================================================

-- Inventory Categories
CREATE TABLE IF NOT EXISTS public.inventory_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouses & Storage Yards
CREATE TABLE IF NOT EXISTS public.warehouses (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    store_keeper_id BIGINT REFERENCES public.employees(id) ON DELETE SET NULL,
    store_keeper_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    capacity VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers & Subcontractors
CREATE TABLE IF NOT EXISTS public.suppliers (
    id BIGSERIAL PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    category VARCHAR(150) NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0,
    tax_id VARCHAR(100),
    payment_terms VARCHAR(100) DEFAULT 'Net 30 Days',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Materials & Stock Catalog
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id BIGSERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT REFERENCES public.inventory_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(150) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    current_stock NUMERIC(15, 2) NOT NULL DEFAULT 0,
    opening_stock NUMERIC(15, 2) DEFAULT 0,
    min_level NUMERIC(15, 2) NOT NULL DEFAULT 10,
    cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(15, 2) DEFAULT 0,
    warehouse_id BIGINT REFERENCES public.warehouses(id) ON DELETE SET NULL,
    warehouse_location VARCHAR(255) NOT NULL,
    supplier_id BIGINT REFERENCES public.suppliers(id) ON DELETE SET NULL,
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(150),
    supplier_phone VARCHAR(50),
    supplier_email VARCHAR(150),
    supplier_address TEXT,
    status VARCHAR(50) DEFAULT 'active',
    last_restock_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock Movement History (Receipts, Issuances, Transfers)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id BIGSERIAL PRIMARY KEY,
    reference_number VARCHAR(100) NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'receipt', 'issue', 'transfer', 'adjustment'
    item_id BIGINT NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(15, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    destination_type VARCHAR(50), -- 'project', 'site', 'warehouse', 'department', 'employee'
    recipient_name VARCHAR(150),
    employee_id BIGINT REFERENCES public.employees(id) ON DELETE SET NULL,
    department VARCHAR(150),
    warehouse_id BIGINT REFERENCES public.warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255),
    project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255),
    performed_by VARCHAR(150) NOT NULL,
    movement_date TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    related_document_type VARCHAR(50), -- 'GRN', 'Waybill', 'Requisition', 'Manual'
    related_document_ref VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. REQUISITIONS & COLLABORATIVE APPROVAL WORKFLOW
-- ==============================================================================

-- Requisitions
CREATE TABLE IF NOT EXISTS public.requisitions (
    id BIGSERIAL PRIMARY KEY,
    requisition_no VARCHAR(50) NOT NULL UNIQUE,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    requested_by VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    requisition_date DATE NOT NULL,
    priority VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'Pending Review',
    title VARCHAR(255) NOT NULL,
    trade VARCHAR(150),
    supplier VARCHAR(255),
    supplier_address TEXT,
    description TEXT,
    total_estimated_amount NUMERIC(15, 2), -- Optional for unpriced requests
    approved_by VARCHAR(150),
    approval_date DATE,
    rejection_reason TEXT,
    flag_reason TEXT,
    flagged_by VARCHAR(150),
    flagged_date TIMESTAMPTZ,
    approver_ids BIGINT[] DEFAULT '{}',
    approvers JSONB DEFAULT '[]'::jsonb,
    chat_channel_id VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requisition Line Items (Flexible & Optional Pricing)
CREATE TABLE IF NOT EXISTS public.requisition_items (
    id BIGSERIAL PRIMARY KEY,
    requisition_id BIGINT NOT NULL REFERENCES public.requisitions(id) ON DELETE CASCADE,
    inventory_item_id BIGINT REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    item_code VARCHAR(50),
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) DEFAULT 'material', -- 'material', 'service', 'equipment', 'other'
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    quantity_required NUMERIC(15, 2) NOT NULL,
    quantity_in_stock NUMERIC(15, 2) DEFAULT 0,
    quantity_to_purchase NUMERIC(15, 2) DEFAULT 0,
    quantity_approved NUMERIC(15, 2) DEFAULT 0,
    quantity_dispatched NUMERIC(15, 2) DEFAULT 0,
    price NUMERIC(15, 2), -- Optional: NULL for unpriced requisitions
    value NUMERIC(15, 2), -- Optional: NULL for unpriced requisitions
    is_custom_item BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requisition Approval Audit Timeline
CREATE TABLE IF NOT EXISTS public.requisition_approval_history (
    id BIGSERIAL PRIMARY KEY,
    requisition_id BIGINT NOT NULL REFERENCES public.requisitions(id) ON DELETE CASCADE,
    level VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'Submitted', 'Approved', 'Flagged for Clarification', 'Clarification Provided', 'Rejected', 'Dispatched'
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(150) NOT NULL,
    comments TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Requisition Dedicated Group Discussion Messages
CREATE TABLE IF NOT EXISTS public.requisition_messages (
    id BIGSERIAL PRIMARY KEY,
    requisition_id BIGINT NOT NULL REFERENCES public.requisitions(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_system_event BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    supplier_name VARCHAR(255) NOT NULL,
    project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255),
    warehouse_id BIGINT REFERENCES public.warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255),
    order_date DATE NOT NULL,
    expected_delivery DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    subtotal NUMERIC(15, 2) DEFAULT 0,
    tax_total NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    payment_terms VARCHAR(100) DEFAULT 'Net 30 Days',
    delivery_address TEXT,
    approved_by VARCHAR(150),
    approval_date DATE,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for standard anon / authenticated operations
-- ==============================================================================

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'companies', 'departments', 'roles', 'employees', 'users', 'customers',
        'projects', 'project_budgets', 'project_staff_assignments', 'project_staff_history',
        'project_daily_logs', 'project_milestones', 'inventory_categories', 'warehouses',
        'suppliers', 'inventory_items', 'stock_movements', 'requisitions',
        'requisition_items', 'requisition_approval_history', 'requisition_messages',
        'purchase_orders'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow full access to anon and authenticated" ON public.%I;', t);
        EXECUTE format('CREATE POLICY "Allow full access to anon and authenticated" ON public.%I FOR ALL USING (true) WITH CHECK (true);', t);
    END LOOP;
END $$;

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_warehouse ON public.inventory_items(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON public.stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_project ON public.stock_movements(project_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_project ON public.requisitions(project_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_status ON public.requisitions(status);
CREATE INDEX IF NOT EXISTS idx_requisition_items_req ON public.requisition_items(requisition_id);
CREATE INDEX IF NOT EXISTS idx_requisition_messages_req ON public.requisition_messages(requisition_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_project ON public.project_staff_assignments(project_id);

-- ==============================================================================
-- 8. INITIAL NIGERIAN SEED DATA
-- Pre-populates the database immediately upon execution
-- ==============================================================================

INSERT INTO public.companies (id, name, code, currency, theme_color, address, tax_number, phone, email, is_active)
VALUES 
(1, 'Apex Construction & Civil Works Ltd', 'APEX-CIVIL', '₦', '#0284c7', 'Plot 14 Victoria Island Commercial Corridor, Lagos, Nigeria', 'TIN-8849201-NG', '+234 803 234 8900', 'info@apexconstruction.ng', true),
(2, 'BuildCraft Infrastructure Nigeria Ltd', 'BC-INFRA', '₦', '#059669', 'Plot 12 Central Business District, Abuja, Nigeria', 'TIN-9920144-NG', '+234 802 794 6091', 'contact@buildcraft-infra.ng', true),
(3, 'Metro Ready-Mix Concrete & Materials Ltd', 'METRO-RMC', '₦', '#d97706', 'Batching Plant Yard 7, Ibeju-Lekki Expressway, Lagos, Nigeria', 'TIN-3301982-NG', '+234 805 891 4455', 'dispatch@metrormc.ng', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employees (id, company_id, code, first_name, last_name, name, email, phone, department, position, role, salary, hire_date, status, bank_name, account_number)
VALUES
(1, 1, 'EMP-001', 'John', 'Adebayo', 'John Adebayo', 'j.adebayo@apexconstruction.ng', '+234 803 291 2831', 'Executive Directorate', 'Managing Director', 'Managing Director', 1250000.00, '2021-03-15', 'Active', 'First Bank of Nigeria', '1098234812'),
(2, 1, 'EMP-002', 'Chioma', 'Okon', 'Chioma Okon', 'c.okon@apexconstruction.ng', '+234 802 419 8821', 'Civil Engineering & Construction', 'Senior Site Engineer', 'Site Engineer', 680000.00, '2022-06-01', 'Active', 'Zenith Bank PLC', '4481920381'),
(3, 1, 'EMP-003', 'Babajide', 'Sanusi', 'Babajide Sanusi', 'b.sanusi@apexconstruction.ng', '+234 812 619 4412', 'Commercial & Cost Management', 'Lead Quantity Surveyor', 'Site Quantity Surveyor', 620000.00, '2022-09-12', 'Active', 'Guaranty Trust Bank (GTBank)', '5581920391'),
(4, 1, 'EMP-004', 'Ibrahim', 'Musa', 'Ibrahim Musa', 'i.musa@apexconstruction.ng', '+234 814 319 9134', 'Procurement & Stores', 'Chief Procurement Officer', 'Procurement Officer', 540000.00, '2023-01-10', 'Active', 'Access Bank PLC', '3391820394'),
(5, 1, 'EMP-005', 'Zainab', 'Abubakar', 'Zainab Abubakar', 'z.abubakar@apexconstruction.ng', '+234 809 819 3382', 'Finance & Accounts', 'Head of Finance & Accounts', 'Finance Manager', 890000.00, '2021-08-20', 'Active', 'Standard Chartered Nigeria', '9981293810'),
(6, 1, 'EMP-006', 'Amara', 'Okafor', 'Amara Okafor', 'a.okafor@apexconstruction.ng', '+234 818 519 7711', 'Human Resources & Admin', 'HR & Personnel Manager', 'HR Manager', 710000.00, '2022-02-14', 'Active', 'United Bank for Africa (UBA)', '8819203912'),
(7, 1, 'EMP-007', 'Farouk', 'Umar', 'Farouk Umar', 'f.umar@apexconstruction.ng', '+234 807 419 5567', 'Finance & Accounts', 'Senior Project Accountant', 'Accountant', 580000.00, '2023-04-18', 'Active', 'Fidelity Bank Nigeria', '1192837465'),
(8, 1, 'EMP-008', 'Femi', 'Oladipo', 'Femi Oladipo', 'f.oladipo@apexconstruction.ng', '+234 813 919 6632', 'Civil Engineering & Construction', 'Field Works Coordinator', 'Staff', 380000.00, '2023-08-01', 'Active', 'First Bank of Nigeria', '7781920381')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.customers (id, customer_code, company_name, contact_person, email, phone, address, balance, status)
VALUES
(1, 'CUST-001', 'Federal Ministry of Works & Housing', 'Engr. Bello Danjuma', 'info@works.gov.ng', '+234 803 400 9922', 'Mabushi Headquarters, Abuja, Nigeria', 0, 'active'),
(2, 'CUST-002', 'Lekki Free Zone Development Co', 'Mr. Kunle Adekunle', 'procurement@lekkifz.com', '+234 802 888 7711', 'Lekki Coastal Corridor, Lagos, Nigeria', 15000000, 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, company_id, project_number, name, client_id, client_name, site_location, manager, contract_value, budget, spent, start_date, end_date, progress_percent, status)
VALUES
(1, 1, 'PRJ-2026-001', 'Bridge Extension & Dual Carriageway', 1, 'Federal Ministry of Works & Housing', 'Lagos-Ibadan Expressway Km 32', 'Engr. Babatunde Fashola', 1450000000.00, 1200000000.00, 680000000.00, '2025-01-10', '2026-12-20', 58, 'in_progress'),
(2, 1, 'PRJ-2026-002', 'Skyline Commercial Center & Plaza Phase 1', 2, 'Lekki Free Zone Development Co', 'Plot 4 Victoria Island, Lagos', 'Chioma Okon', 890000000.00, 750000000.00, 310000000.00, '2025-06-01', '2027-02-28', 35, 'in_progress')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventory_categories (id, name, description, item_count)
VALUES
(1, 'Structural Steel & Rebar', 'High tensile rebar, structural I-beams, BRC wire mesh', 12),
(2, 'Civil Aggregates & Cement', 'Ordinary Portland Cement, granite, sharp sand, stone base', 18),
(3, 'Heavy Plant & Machinery Spares', 'Hydraulic hoses, track rollers, filters, lubricants', 24),
(4, 'Safety & Site PPE', 'Hard hats, high-vis vests, steel toe boots, fall arrest harnesses', 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.warehouses (id, company_id, code, name, location, store_keeper_name, phone, capacity, status)
VALUES
(1, 1, 'WH-MAIN-01', 'Main Yard Central Warehouse - Civil Stores', 'Plot 10 Industrial Layout, Ikeja, Lagos', 'Olumide Bakare', '+234 803 234 8901', '50,000 MT', 'active'),
(2, 1, 'WH-STEEL-02', 'Central Structural Steel Depot & Yard', 'Ibafo Storage Staging Depot, Ogun/Lagos border', 'Olumide Bakare', '+234 803 234 8902', '20,000 MT', 'active'),
(3, 1, 'WH-RMC-03', 'Batching Plant Aggregates Bunkers', 'Batching Plant Yard 7, Ibeju-Lekki, Lagos', 'Chukwuma Obi', '+234 803 234 8903', '80,000 MT', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.suppliers (id, supplier_code, company_name, contact_person, email, phone, address, category, balance, status)
VALUES
(1, 'SUP-STEEL-001', 'Continental Steel Mills Corp', 'Alhaji Mansur Ibrahim', 'sales@continentalsteel.ng', '+234 803 111 8822', 'Plot 12 Steel Industrial Layout, Ikeja', 'Structural Steel & Rebar', 4500000.00, 'active'),
(2, 'SUP-CEM-002', 'Lafarge & Holcim Cement Dist', 'Mrs. Folashade Adeyemi', 'commercial@lafarge-dist.ng', '+234 802 444 9911', 'Depot 5, Bulk Terminal Expressway, Ewekoro', 'Civil Aggregates & Cement', 1820000.00, 'active'),
(3, 'SUP-AGGR-003', 'Metro Quarry & Aggregates Ltd', 'Engr. Patrick Chukwu', 'orders@metroquarry.ng', '+234 818 777 3300', 'Km 24 Quarry Road, Mpape Hills, Abuja', 'Civil Aggregates & Cement', 950000.00, 'active'),
(4, 'SUP-SAFE-004', 'Safety First Industrial Supplies Ltd', 'Nkechi Ekwueme', 'orders@safetyfirst.ng', '+234 803 555 9812', 'Plot 88 Industrial Avenue, Ilupeju, Lagos', 'Safety & PPE', 0.00, 'active'),
(5, 'SUP-EQP-005', 'Putzmeister OEM Machinery Parts West Africa', 'Engr. Chidubem Okafor', 'service@putzmeister-parts.ng', '+234 802 712 5990', 'Trans-Amadi Industrial Layout, Port Harcourt', 'Heavy Equipment & Spares', 1240000.00, 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventory_items (id, item_code, name, category_id, category_name, unit, current_stock, opening_stock, min_level, cost_price, selling_price, warehouse_id, warehouse_location, supplier_id, supplier_name)
VALUES
(1, 'CEM-OPC-50', 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)', 2, 'Civil Aggregates & Cement', 'Bags', 840, 500, 200, 8500.00, 9200.00, 1, 'Main Yard Central Warehouse - Civil Stores', 2, 'Lafarge & Holcim Cement Dist'),
(2, 'STEEL-TMT-16MM', 'High-Tensile TMT Deformed Rebar 16mm (12m Length)', 1, 'Structural Steel & Rebar', 'Tons', 145, 100, 30, 980000.00, 1080000.00, 2, 'Central Structural Steel Depot & Yard', 1, 'Continental Steel Mills Corp'),
(3, 'STEEL-TMT-20MM', 'High-Tensile TMT Deformed Rebar 20mm (12m Length)', 1, 'Structural Steel & Rebar', 'Tons', 92, 60, 25, 995000.00, 1100000.00, 2, 'Central Structural Steel Depot & Yard', 1, 'Continental Steel Mills Corp'),
(4, 'AGG-GRAVEL-20MM', 'Crushed Granite Coarse Aggregate 20mm', 2, 'Civil Aggregates & Cement', 'Tons', 320, 200, 100, 14500.00, 18000.00, 3, 'Batching Plant Aggregates Bunkers', 3, 'Metro Quarry & Aggregates Ltd')
ON CONFLICT (id) DO NOTHING;

-- Synchronize sequences for autoincrement primary keys
SELECT setval('public.companies_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.companies));
SELECT setval('public.departments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.departments));
SELECT setval('public.employees_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.employees));
SELECT setval('public.customers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.customers));
SELECT setval('public.projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.projects));
SELECT setval('public.inventory_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.inventory_categories));
SELECT setval('public.warehouses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.warehouses));
SELECT setval('public.suppliers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.suppliers));
SELECT setval('public.inventory_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.inventory_items));
