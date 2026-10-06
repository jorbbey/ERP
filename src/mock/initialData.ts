import {
  Company,
  Employee,
  Department,
  Project,
  ProjectBudget,
  ProjectLabourBudget,
  ProjectMaterialBudget,
  ProjectMilestone,
  ProjectTask,
  ProjectStaffAssignment,
  ProjectStaffHistory,
  ProjectDelayNote,
  ProjectQualityAssurance,
  ProjectInvoice,
  Customer,
  DailySiteReport,
  ProjectScheduleTask,
  ProjectDelayLog,
  ProjectDailyLog,
  ProjectSafetyIncident,
  ProjectRFI,
  ProjectChangeOrder,
  ProjectDocument,
  ProjectActivity,
  InventoryItem,
  InventoryCategory,
  Warehouse,
  InventoryItemChange,
  StockMovement,
  RequisitionDispatchRequest,
  Waybill,
  Supplier,
  GoodsReceivedNote,
  Requisition,
  PurchaseOrder,
  SalaryAdvance,
  EmployeeLoan,
  PayrollRun,
  Payslip,
  RmcMixDesign,
  RmcBatchRecord,
  RmcQualityInspection,
  ContractAdminContract,
  ContractAdminEvent,
  ChatMessage,
  AccountLedgerEntry,
  User,
  RoleDefinition,
  ModuleAccessPermission,
  ERPNotification,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  RecruitmentApplication,
  JobVacancy,
  EmployeeArchiveRecord,
  EmployeeCustomField,
  Equipment,
  Vehicle,
  MaintenanceRecord,
  FuelConsumption,
  AuditLog,
  SystemLog
} from '../types';

export const initialCompanies: Company[] = [
  {
    id: 1,
    name: 'Apex Construction & Civil Works Ltd',
    code: 'APEX-CIVIL',
    currency: 'USD',
    themeColor: '#0284c7', // Sky-600
    address: 'Plot 44 Industrial Area, Tower Suite 500',
    taxNumber: 'TAX-8849201-US',
    phone: '+1 (555) 234-8900',
    email: 'info@apexconstruction.com',
    website: 'https://apexconstruction.com',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'BuildCraft Infrastructure Group',
    code: 'BC-INFRA',
    currency: 'EUR',
    themeColor: '#059669', // Emerald-600
    address: '12 Harbor Expressway, Pier 3',
    taxNumber: 'TAX-9920144-EU',
    phone: '+44 20 7946 0912',
    email: 'contact@buildcraft-infra.com',
    website: 'https://buildcraft-infra.com',
    isActive: true,
    createdAt: '2024-06-01'
  },
  {
    id: 3,
    name: 'Metro Ready-Mix Concrete & Materials',
    code: 'METRO-RMC',
    currency: 'USD',
    themeColor: '#d97706', // Amber-600
    address: 'Batching Plant Yard 7, Quarry Road',
    taxNumber: 'TAX-3301982-US',
    phone: '+1 (555) 891-4455',
    email: 'dispatch@metrormc.com',
    website: 'https://metrormc.com',
    isActive: true,
    createdAt: '2025-02-10'
  }
];

export const initialUsers: User[] = [
  {
    id: 1,
    companyId: 1,
    name: 'John Adebayo',
    email: 'j.adebayo@apexconstruction.com',
    phone: '+1 (555) 019-2831',
    role: 'Managing Director',
    employeeId: 1,
    status: 'active',
    lastLogin: '2026-10-03 08:15',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    companyId: 1,
    name: 'Sarah Jenkins',
    email: 's.jenkins@apexconstruction.com',
    phone: '+1 (555) 019-8821',
    role: 'Site Engineer',
    employeeId: 2,
    status: 'active',
    lastLogin: '2026-10-03 07:45',
    createdAt: '2024-06-01'
  },
  {
    id: 3,
    companyId: 1,
    name: 'Michael Chen',
    email: 'm.chen@apexconstruction.com',
    phone: '+1 (555) 019-4412',
    role: 'Site Quantity Surveyor',
    employeeId: 3,
    status: 'active',
    lastLogin: '2026-10-02 16:30',
    createdAt: '2024-09-10'
  },
  {
    id: 4,
    companyId: 1,
    name: 'Fatima Yusuf',
    email: 'f.yusuf@apexconstruction.com',
    phone: '+1 (555) 019-9923',
    role: 'Procurement Officer',
    employeeId: 4,
    status: 'active',
    lastLogin: '2026-10-03 09:00',
    createdAt: '2024-11-05'
  },
  {
    id: 5,
    companyId: 1,
    name: 'Elena Rostova',
    email: 'e.rostova@apexconstruction.com',
    phone: '+1 (555) 019-3382',
    role: 'Finance Manager',
    employeeId: 5,
    status: 'active',
    lastLogin: '2026-10-02 18:20',
    createdAt: '2024-08-20'
  },
  {
    id: 6,
    companyId: 1,
    name: 'Amara Okafor',
    email: 'a.okafor@apexconstruction.com',
    phone: '+1 (555) 019-7711',
    role: 'HR Manager',
    employeeId: 6,
    status: 'active',
    lastLogin: '2026-10-02 17:15',
    createdAt: '2025-02-14'
  },
  {
    id: 7,
    companyId: 1,
    name: 'Tariq Mansoor',
    email: 't.mansoor@apexconstruction.com',
    phone: '+1 (555) 019-5567',
    role: 'Accountant',
    employeeId: 7,
    status: 'active',
    lastLogin: '2026-10-01 14:00',
    createdAt: '2025-04-18'
  },
  {
    id: 8,
    companyId: 1,
    name: 'Kofi Asante',
    email: 'k.asante@apexconstruction.com',
    phone: '+1 (555) 019-6632',
    role: 'Staff',
    employeeId: 8,
    status: 'active',
    lastLogin: '2026-09-28 11:30',
    createdAt: '2025-08-01'
  },
  {
    id: 9,
    companyId: 2,
    name: 'David O\'Connor',
    email: 'd.oconnor@buildcraft-infra.com',
    phone: '+44 20 7946 0881',
    role: 'Managing Director',
    status: 'active',
    lastLogin: '2026-10-01 10:10',
    createdAt: '2025-01-20'
  },
  {
    id: 10,
    companyId: 1,
    name: 'System Administrator',
    email: 'admin@apexconstruction.com',
    phone: '+1 (555) 000-1111',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2026-10-03 06:00',
    createdAt: '2023-01-01'
  }
];

export const initialRoles: RoleDefinition[] = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Unrestricted enterprise administrative privileges, subsidiary workspace provisioning, and database access.',
    department: 'IT & System Governance',
    privilegeLevel: 'Executive',
    moduleKeys: ['dashboard', 'projects', 'requisitions', 'inventory', 'procurement', 'hr', 'payroll', 'rmc', 'contracts', 'accounting', 'chat', 'workflow', 'portals', 'settings', 'users', 'roles']
  },
  {
    id: 2,
    name: 'Managing Director',
    description: 'Corporate executive oversight, CapEx releases, tender authorizations, and group financial sign-off.',
    department: 'Executive Directorate',
    privilegeLevel: 'Executive',
    moduleKeys: ['dashboard', 'projects', 'requisitions', 'inventory', 'procurement', 'hr', 'payroll', 'rmc', 'contracts', 'accounting', 'chat', 'workflow', 'portals', 'settings']
  },
  {
    id: 3,
    name: 'Finance Manager',
    description: 'Treasury operations, accounts payable, banking reconciliations, tax compliance, and payroll finalization.',
    department: 'Finance & Accounts',
    privilegeLevel: 'Management',
    moduleKeys: ['dashboard', 'accounting', 'payroll', 'procurement', 'requisitions', 'contracts', 'workflow', 'chat']
  },
  {
    id: 4,
    name: 'HR Manager',
    description: 'Personnel records, workforce recruitment, staff attendance, leave processing, salary advances, and employee loans.',
    department: 'Human Resources & Admin',
    privilegeLevel: 'Management',
    moduleKeys: ['dashboard', 'hr', 'payroll', 'workflow', 'chat']
  },
  {
    id: 5,
    name: 'Procurement Officer',
    description: 'Vendor relationship management, supplier quotations, Purchase Order (PO) issuance, and stores receipting.',
    department: 'Procurement & Supply Chain',
    privilegeLevel: 'Operational',
    moduleKeys: ['dashboard', 'procurement', 'inventory', 'requisitions', 'chat']
  },
  {
    id: 6,
    name: 'Site Engineer',
    description: 'Field construction management, daily site progress logs, RFI submissions, safety checks, and concrete batch verification.',
    department: 'Civil Engineering & Construction',
    privilegeLevel: 'Operational',
    moduleKeys: ['dashboard', 'projects', 'requisitions', 'rmc', 'chat']
  },
  {
    id: 7,
    name: 'Site Quantity Surveyor',
    description: 'Measurement, BOQ budget management, contractor change orders, interim claims, and material requisition estimation.',
    department: 'Commercial & Cost Management',
    privilegeLevel: 'Operational',
    moduleKeys: ['dashboard', 'projects', 'requisitions', 'contracts', 'inventory', 'chat']
  },
  {
    id: 8,
    name: 'Accountant',
    description: 'General ledger journal vouchers, accounts chart updates, petty cash expenses, and payment certificates.',
    department: 'Finance & Accounts',
    privilegeLevel: 'Operational',
    moduleKeys: ['dashboard', 'accounting', 'payroll', 'procurement', 'chat']
  },
  {
    id: 9,
    name: 'Department Head',
    description: 'Departmental staff coordination, internal approvals, and requisitions review for unit resources.',
    department: 'Operations',
    privilegeLevel: 'Management',
    moduleKeys: ['dashboard', 'requisitions', 'workflow', 'chat']
  },
  {
    id: 10,
    name: 'Staff',
    description: 'Standard employee portal access for salary advances, leave applications, and corporate chat.',
    department: 'General Staff',
    privilegeLevel: 'Standard',
    moduleKeys: ['dashboard', 'chat']
  }
];

export const initialModulePermissions: ModuleAccessPermission[] = [
  { companyId: 1, userId: 1, moduleKey: 'projects', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'requisitions', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'inventory', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'procurement', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'hr', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'payroll', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'rmc', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'contracts', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'accounting', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'chat', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'settings', hasAccess: true },
  { companyId: 1, userId: 1, moduleKey: 'users', hasAccess: true },
  { companyId: 1, userId: 2, moduleKey: 'projects', hasAccess: true },
  { companyId: 1, userId: 2, moduleKey: 'requisitions', hasAccess: true },
  { companyId: 1, userId: 2, moduleKey: 'rmc', hasAccess: true },
  { companyId: 1, userId: 2, moduleKey: 'chat', hasAccess: true }
];

export const initialNotifications: ERPNotification[] = [
  {
    id: 1,
    title: 'Material Requisition Approval Pending',
    message: 'Requisition REQ-2026-0046 (Abuja Bridge Extension) is awaiting Managing Director signoff.',
    category: 'requisition',
    timestamp: '10 mins ago',
    read: false,
    link: '/requisitions'
  },
  {
    id: 2,
    title: 'Low Safety Stock Threshold Alert',
    message: 'High-Tensile Steel Rebar 16mm is down to 42 tons in Main Yard (Safety threshold: 50 tons).',
    category: 'inventory',
    timestamp: '45 mins ago',
    read: false,
    link: '/inventory'
  },
  {
    id: 3,
    title: 'Daily Site Progress Log Filed',
    message: 'Sarah Jenkins logged 42m³ M35 concrete pour on Pier 3 cap with zero safety incidents.',
    category: 'project',
    timestamp: '2 hours ago',
    read: false,
    link: '/projects/1'
  },
  {
    id: 4,
    title: 'Vendor Purchase Order Authorized',
    message: 'PO-2026-081 for Continental Steel Mills was approved by Finance Manager.',
    category: 'procurement',
    timestamp: '4 hours ago',
    read: true,
    link: '/procurement'
  },
  {
    id: 5,
    title: 'Payroll Dispatched to Employee Portal',
    message: 'September finalized payroll run processed; 8 electronic payslips released.',
    category: 'payroll',
    timestamp: '1 day ago',
    read: true,
    link: '/payroll'
  }
];

export const initialDepartments: Department[] = [
  {
    id: 1,
    companyId: 1,
    name: 'Civil Engineering & Construction',
    headEmployeeId: 2,
    headName: 'Sarah Jenkins',
    headTitle: 'Senior Site Engineer & Operations Lead',
    roles: ['Site Engineer', 'Project Manager', 'Foreman', 'Structural Engineer'],
    description: 'On-site execution, structural civil construction, concrete works, earthworks, and machinery deployment.'
  },
  {
    id: 2,
    companyId: 1,
    name: 'Commercial & Cost Management',
    headEmployeeId: 3,
    headName: 'Michael Chen',
    headTitle: 'Chief Quantity Surveyor',
    roles: ['Site Quantity Surveyor', 'Cost Estimator', 'Contracts Specialist'],
    description: 'BOQ pricing, material budgets, subcontractor interim certificates, and contract variations.'
  },
  {
    id: 3,
    companyId: 1,
    name: 'Procurement & Stores',
    headEmployeeId: 4,
    headName: 'David O\'Connor',
    headTitle: 'Procurement & Logistics Lead',
    roles: ['Procurement Officer', 'Store Officer', 'Inventory Officer', 'Logistics Coordinator'],
    description: 'Material vendor selection, PO issuance, store receipts, gate passes, and inventory movements.'
  },
  {
    id: 4,
    companyId: 1,
    name: 'Finance & Accounts',
    headEmployeeId: 5,
    headName: 'Elena Rostova',
    headTitle: 'Head of Finance & Treasury',
    roles: ['Finance Manager', 'Accountant', 'Cashier', 'Internal Auditor'],
    description: 'Corporate treasury, project cost accounting, vendor payments, tax compliance, and payroll.'
  },
  {
    id: 5,
    companyId: 1,
    name: 'Human Resources & Admin',
    headEmployeeId: 6,
    headName: 'Amara Okafor',
    headTitle: 'Human Resources Manager',
    roles: ['HR Manager', 'Recruitment Specialist', 'Admin Officer', 'Compliance Executive'],
    description: 'Employee lifecycle, attendance monitoring, statutory leave records, talent acquisition, and workforce welfare.'
  },
  {
    id: 6,
    companyId: 1,
    name: 'Executive Directorate',
    headEmployeeId: 1,
    headName: 'John Adebayo',
    headTitle: 'Managing Director & CEO',
    roles: ['Managing Director', 'General Manager', 'Executive Director'],
    description: 'Executive governance, joint-venture partnerships, project board sign-offs, and strategic expansion.'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 1,
    code: 'EMP-001',
    firstName: 'John',
    lastName: 'Adebayo',
    name: 'John Adebayo',
    email: 'j.adebayo@apexconstruction.com',
    phone: '+1 (555) 019-2831',
    department: 'Executive Directorate',
    position: 'Managing Director',
    role: 'Managing Director',
    salary: 12500,
    hireDate: '2021-03-15',
    status: 'Active',
    nin: 'NIN-8930192841',
    tin: 'TIN-44910284',
    bankName: 'First Commercial Bank',
    accountNumber: '1098234812',
    pfa: 'Apex Pension Trust'
  },
  {
    id: 2,
    code: 'EMP-002',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    name: 'Sarah Jenkins',
    email: 's.jenkins@apexconstruction.com',
    phone: '+1 (555) 019-8821',
    department: 'Civil Engineering & Construction',
    position: 'Senior Site Engineer',
    role: 'Site Engineer',
    salary: 6800,
    hireDate: '2022-06-01',
    status: 'Active',
    nin: 'NIN-4491823901',
    tin: 'TIN-99182391',
    bankName: 'Global Fidelity Bank',
    accountNumber: '4481920381',
    pfa: 'Alliance Pension Managers'
  },
  {
    id: 3,
    code: 'EMP-003',
    firstName: 'Michael',
    lastName: 'Chen',
    name: 'Michael Chen',
    email: 'm.chen@apexconstruction.com',
    phone: '+1 (555) 019-4412',
    department: 'Commercial & Cost Management',
    position: 'Lead Quantity Surveyor',
    role: 'Site Quantity Surveyor',
    salary: 6200,
    hireDate: '2022-09-12',
    status: 'Active',
    nin: 'NIN-1928491823',
    tin: 'TIN-19283741',
    bankName: 'Zenith City Bank',
    accountNumber: '5581920391',
    pfa: 'Apex Pension Trust'
  },
  {
    id: 4,
    code: 'EMP-004',
    firstName: 'David',
    lastName: 'O\'Connor',
    name: 'David O\'Connor',
    email: 'd.oconnor@apexconstruction.com',
    phone: '+1 (555) 019-9134',
    department: 'Procurement & Stores',
    position: 'Chief Procurement Officer',
    role: 'Procurement Officer',
    salary: 5400,
    hireDate: '2023-01-10',
    status: 'Active',
    nin: 'NIN-9918238123',
    tin: 'TIN-88192301',
    bankName: 'First Commercial Bank',
    accountNumber: '3391820394',
    pfa: 'Stanbic Retirement'
  },
  {
    id: 5,
    code: 'EMP-005',
    firstName: 'Elena',
    lastName: 'Rostova',
    name: 'Elena Rostova',
    email: 'e.rostova@apexconstruction.com',
    phone: '+1 (555) 019-3382',
    department: 'Finance & Accounts',
    position: 'Head of Finance & Accounts',
    role: 'Finance Manager',
    salary: 8900,
    hireDate: '2021-08-20',
    status: 'Active',
    nin: 'NIN-7718293812',
    tin: 'TIN-33918204',
    bankName: 'Standard Chartered',
    accountNumber: '9981293810',
    pfa: 'Alliance Pension Managers'
  },
  {
    id: 6,
    code: 'EMP-006',
    firstName: 'Amara',
    lastName: 'Okafor',
    name: 'Amara Okafor',
    email: 'a.okafor@apexconstruction.com',
    phone: '+1 (555) 019-7711',
    department: 'Human Resources & Admin',
    position: 'HR & Personnel Manager',
    role: 'HR Manager',
    salary: 7100,
    hireDate: '2022-02-14',
    status: 'Active',
    nin: 'NIN-5591829301',
    tin: 'TIN-44918203',
    bankName: 'Zenith City Bank',
    accountNumber: '8819203912',
    pfa: 'Apex Pension Trust'
  },
  {
    id: 7,
    code: 'EMP-007',
    firstName: 'Tariq',
    lastName: 'Mansoor',
    name: 'Tariq Mansoor',
    email: 't.mansoor@apexconstruction.com',
    phone: '+1 (555) 019-5567',
    department: 'Finance & Accounts',
    position: 'Senior Project Accountant',
    role: 'Accountant',
    salary: 5800,
    hireDate: '2023-04-18',
    status: 'Active',
    nin: 'NIN-2281920394',
    tin: 'TIN-55819203',
    bankName: 'Global Fidelity Bank',
    accountNumber: '1192837465',
    pfa: 'Stanbic Retirement'
  },
  {
    id: 8,
    code: 'EMP-008',
    firstName: 'Kofi',
    lastName: 'Asante',
    name: 'Kofi Asante',
    email: 'k.asante@apexconstruction.com',
    phone: '+1 (555) 019-6632',
    department: 'Civil Engineering & Construction',
    position: 'Field Works Coordinator',
    role: 'Staff',
    salary: 3800,
    hireDate: '2023-08-01',
    status: 'Active',
    nin: 'NIN-3391827465',
    tin: 'TIN-66718293',
    bankName: 'First Commercial Bank',
    accountNumber: '7781920381',
    pfa: 'Apex Pension Trust'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    employeeCode: 'EMP-002',
    department: 'Civil Engineering & Construction',
    attendanceDate: '2026-10-05',
    checkIn: '07:45:00',
    checkOut: '17:15:00',
    status: 'present',
    hoursWorked: 9.5,
    notes: 'On-site flyover pier 3 supervision'
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Michael Chen',
    employeeCode: 'EMP-003',
    department: 'Commercial & Cost Management',
    attendanceDate: '2026-10-05',
    checkIn: '08:05:00',
    checkOut: '17:00:00',
    status: 'present',
    hoursWorked: 8.9,
    notes: 'Subcontractor measurement verification'
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    employeeCode: 'EMP-004',
    department: 'Procurement & Stores',
    attendanceDate: '2026-10-05',
    checkIn: '08:35:00',
    checkOut: '17:10:00',
    status: 'late',
    hoursWorked: 8.5,
    notes: 'Delayed by traffic near port container terminal'
  },
  {
    id: 4,
    employeeId: 5,
    employeeName: 'Elena Rostova',
    employeeCode: 'EMP-005',
    department: 'Finance & Accounts',
    attendanceDate: '2026-10-05',
    checkIn: '07:55:00',
    checkOut: '17:30:00',
    status: 'present',
    hoursWorked: 9.5,
    notes: 'Quarterly bank reconciliation audit'
  },
  {
    id: 5,
    employeeId: 6,
    employeeName: 'Amara Okafor',
    employeeCode: 'EMP-006',
    department: 'Human Resources & Admin',
    attendanceDate: '2026-10-05',
    checkIn: '08:00:00',
    checkOut: '17:00:00',
    status: 'present',
    hoursWorked: 9.0,
    notes: 'Staff biometric enrollment & records'
  },
  {
    id: 6,
    employeeId: 7,
    employeeName: 'Tariq Mansoor',
    employeeCode: 'EMP-007',
    department: 'Finance & Accounts',
    attendanceDate: '2026-10-05',
    checkIn: '08:10:00',
    checkOut: '17:05:00',
    status: 'present',
    hoursWorked: 8.9,
    notes: 'Payroll vouchers check'
  },
  {
    id: 7,
    employeeId: 8,
    employeeName: 'Kofi Asante',
    employeeCode: 'EMP-008',
    department: 'Civil Engineering & Construction',
    attendanceDate: '2026-10-05',
    checkIn: '07:30:00',
    checkOut: '16:30:00',
    status: 'present',
    hoursWorked: 9.0,
    notes: 'Early batch plant aggregate unloading'
  },
  {
    id: 8,
    employeeId: 1,
    employeeName: 'John Adebayo',
    employeeCode: 'EMP-001',
    department: 'Executive Directorate',
    attendanceDate: '2026-10-05',
    checkIn: '08:20:00',
    checkOut: '18:00:00',
    status: 'present',
    hoursWorked: 9.6,
    notes: 'Ministry ministerial infrastructure briefing'
  },
  {
    id: 9,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    employeeCode: 'EMP-002',
    department: 'Civil Engineering & Construction',
    attendanceDate: '2026-10-04',
    checkIn: '07:50:00',
    checkOut: '17:20:00',
    status: 'present',
    hoursWorked: 9.5
  },
  {
    id: 10,
    employeeId: 3,
    employeeName: 'Michael Chen',
    employeeCode: 'EMP-003',
    department: 'Commercial & Cost Management',
    attendanceDate: '2026-10-04',
    checkIn: '09:10:00',
    checkOut: '17:00:00',
    status: 'late',
    hoursWorked: 7.8,
    correctionRequested: true,
    correctionReason: 'Biometric gate reader failed; arrived at 07:55 AM verified by Site Security log',
    correctionStatus: 'Pending'
  },
  {
    id: 11,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    employeeCode: 'EMP-004',
    department: 'Procurement & Stores',
    attendanceDate: '2026-10-04',
    checkIn: '08:00:00',
    checkOut: '17:00:00',
    status: 'present',
    hoursWorked: 9.0
  },
  {
    id: 12,
    employeeId: 7,
    employeeName: 'Tariq Mansoor',
    employeeCode: 'EMP-007',
    department: 'Finance & Accounts',
    attendanceDate: '2026-10-04',
    checkIn: undefined,
    checkOut: undefined,
    status: 'absent',
    hoursWorked: 0,
    notes: 'Unexcused site absence'
  },
  {
    id: 13,
    employeeId: 8,
    employeeName: 'Kofi Asante',
    employeeCode: 'EMP-008',
    department: 'Civil Engineering & Construction',
    attendanceDate: '2026-10-03',
    checkIn: '07:40:00',
    checkOut: '17:00:00',
    status: 'present',
    hoursWorked: 9.3
  }
];

export const initialLeaves: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    employeeCode: 'EMP-002',
    department: 'Civil Engineering & Construction',
    leaveType: 'Annual Leave',
    startDate: '2026-10-19',
    endDate: '2026-10-23',
    daysCount: 5,
    reason: 'Scheduled annual rest vacation after completion of flyover foundation piles',
    status: 'Pending',
    createdAt: '2026-10-03'
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Michael Chen',
    employeeCode: 'EMP-003',
    department: 'Commercial & Cost Management',
    leaveType: 'Sick Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-16',
    daysCount: 3,
    reason: 'Acute fever with medical doctor certificate from St. Nicholas Hospital',
    status: 'Approved',
    approvedBy: 'Amara Okafor',
    approvalDate: '2026-09-14',
    comments: 'Certified by HR. Medical bill filed with insurance.',
    createdAt: '2026-09-13'
  },
  {
    id: 3,
    employeeId: 8,
    employeeName: 'Kofi Asante',
    employeeCode: 'EMP-008',
    department: 'Civil Engineering & Construction',
    leaveType: 'Casual',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    daysCount: 2,
    reason: 'Family naming ceremony in home district',
    status: 'Approved',
    approvedBy: 'Sarah Jenkins',
    approvalDate: '2026-10-04',
    comments: 'Work covered by assistant supervisor',
    createdAt: '2026-10-02'
  },
  {
    id: 4,
    employeeId: 7,
    employeeName: 'Tariq Mansoor',
    employeeCode: 'EMP-007',
    department: 'Finance & Accounts',
    leaveType: 'Study / Examination',
    startDate: '2026-11-02',
    endDate: '2026-11-06',
    daysCount: 5,
    reason: 'ICAN professional certification final exam revision & sitting',
    status: 'Pending',
    createdAt: '2026-10-04'
  },
  {
    id: 5,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    employeeCode: 'EMP-004',
    department: 'Procurement & Stores',
    leaveType: 'Annual Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-21',
    daysCount: 10,
    reason: 'Summer family leave',
    status: 'Approved',
    approvedBy: 'John Adebayo',
    approvalDate: '2026-08-05',
    createdAt: '2026-08-01'
  }
];

export const initialLeaveBalances: LeaveBalance[] = [
  { employeeId: 1, annualAllocated: 25, annualUsed: 5, annualRemaining: 20, sickAllocated: 12, sickUsed: 0, sickRemaining: 12, casualAllocated: 5, casualUsed: 1, casualRemaining: 4 },
  { employeeId: 2, annualAllocated: 21, annualUsed: 0, annualRemaining: 21, sickAllocated: 12, sickUsed: 1, sickRemaining: 11, casualAllocated: 5, casualUsed: 0, casualRemaining: 5 },
  { employeeId: 3, annualAllocated: 21, annualUsed: 4, annualRemaining: 17, sickAllocated: 12, sickUsed: 3, sickRemaining: 9, casualAllocated: 5, casualUsed: 1, casualRemaining: 4 },
  { employeeId: 4, annualAllocated: 21, annualUsed: 10, annualRemaining: 11, sickAllocated: 12, sickUsed: 0, sickRemaining: 12, casualAllocated: 5, casualUsed: 2, casualRemaining: 3 },
  { employeeId: 5, annualAllocated: 21, annualUsed: 6, annualRemaining: 15, sickAllocated: 12, sickUsed: 2, sickRemaining: 10, casualAllocated: 5, casualUsed: 0, casualRemaining: 5 },
  { employeeId: 6, annualAllocated: 21, annualUsed: 3, annualRemaining: 18, sickAllocated: 12, sickUsed: 0, sickRemaining: 12, casualAllocated: 5, casualUsed: 1, casualRemaining: 4 },
  { employeeId: 7, annualAllocated: 18, annualUsed: 2, annualRemaining: 16, sickAllocated: 10, sickUsed: 0, sickRemaining: 10, casualAllocated: 4, casualUsed: 1, casualRemaining: 3 },
  { employeeId: 8, annualAllocated: 18, annualUsed: 0, annualRemaining: 18, sickAllocated: 10, sickUsed: 0, sickRemaining: 10, casualAllocated: 4, casualUsed: 2, casualRemaining: 2 }
];

export const initialJobVacancies: JobVacancy[] = [
  {
    id: 1,
    title: 'Senior Structural Steel Project Engineer',
    department: 'Civil Engineering & Construction',
    openings: 2,
    experienceLevel: '5 - 8 Years',
    employmentType: 'Full-Time',
    location: 'Bridge Extension Site, Abuja',
    salaryRange: '$6,000 - $7,500 / month',
    status: 'Active',
    postedDate: '2026-09-15',
    closingDate: '2026-10-31',
    description: 'Lead structural detailing, steel truss installation, bolted/welded connection inspection, and heavy crane erection coordination.'
  },
  {
    id: 2,
    title: 'QA/QC Concrete Lab & Materials Technologist',
    department: 'Civil Engineering & Construction',
    openings: 1,
    experienceLevel: '3 - 5 Years',
    employmentType: 'Full-Time',
    location: 'Central Batch Plant Yard',
    salaryRange: '$4,200 - $5,000 / month',
    status: 'Active',
    postedDate: '2026-09-20',
    closingDate: '2026-10-25',
    description: 'Perform slump tests, cube compression crushing tests at 7 & 28 days, aggregate sieve analyses, and moisture compensation adjustments.'
  },
  {
    id: 3,
    title: 'Assistant Quantity Surveyor & Subcontracts Officer',
    department: 'Commercial & Cost Management',
    openings: 1,
    experienceLevel: '2 - 4 Years',
    employmentType: 'Full-Time',
    location: 'Headquarters & Site Rotation',
    salaryRange: '$4,000 - $4,800 / month',
    status: 'Active',
    postedDate: '2026-09-28',
    closingDate: '2026-11-15',
    description: 'Assist in monthly interim subcontractor valuations, takeoff measurements, price rate build-ups, and variation order logs.'
  },
  {
    id: 4,
    title: 'Heavy Plant Mechanical Maintenance Supervisor',
    department: 'Procurement & Stores',
    openings: 1,
    experienceLevel: '6+ Years',
    employmentType: 'Site-Based',
    location: 'Central Equipment Yard',
    salaryRange: '$5,000 - $6,200 / month',
    status: 'Draft',
    postedDate: '2026-10-01',
    closingDate: '2026-11-30',
    description: 'Fleet preventive maintenance for tower cranes, excavators, transit mixers, and concrete boom pumps.'
  }
];

export const initialRecruitmentApplications: RecruitmentApplication[] = [
  {
    id: 1,
    applicantName: 'Chidubem Nwosu',
    email: 'c.nwosu@constructeng.com',
    phone: '+234 803 912 3481',
    position: 'Senior Structural Steel Project Engineer',
    department: 'Civil Engineering & Construction',
    experienceYears: 7,
    status: 'interview',
    appliedDate: '2026-09-22',
    resumeFileName: 'Chidubem_Nwosu_CV_COREN.pdf',
    interviewDate: '2026-10-08 10:00',
    interviewer: 'Sarah Jenkins (Site Operations Lead)',
    rating: 4,
    notes: 'COREN registered engineer. Strong experience with cable-stayed and post-tensioned flyover spans.'
  },
  {
    id: 2,
    applicantName: 'Grace Omotola',
    email: 'grace.omotola@materials-lab.ng',
    phone: '+234 812 449 8192',
    position: 'QA/QC Concrete Lab & Materials Technologist',
    department: 'Civil Engineering & Construction',
    experienceYears: 4,
    status: 'screening',
    appliedDate: '2026-09-28',
    resumeFileName: 'Grace_Omotola_QAQC_Resume.pdf',
    notes: 'HND Civil Engineering. Extensive laboratory experience with high-strength C40 self-compacting mixes.'
  },
  {
    id: 3,
    applicantName: 'Ibrahim Danladi',
    email: 'i.danladi@qs-assoc.com',
    phone: '+234 809 123 9084',
    position: 'Assistant Quantity Surveyor & Subcontracts Officer',
    department: 'Commercial & Cost Management',
    experienceYears: 3,
    status: 'applied',
    appliedDate: '2026-10-02',
    resumeFileName: 'Ibrahim_Danladi_NIQS.pdf',
    notes: 'NIQS probationary member. Proficient in PlanSwift and AutoCAD takeoff.'
  },
  {
    id: 4,
    applicantName: 'Samuel Mensah',
    email: 's.mensah@infra-works.gh',
    phone: '+233 24 555 0192',
    position: 'Senior Structural Steel Project Engineer',
    department: 'Civil Engineering & Construction',
    experienceYears: 9,
    status: 'screening',
    appliedDate: '2026-09-25',
    resumeFileName: 'Samuel_Mensah_Steel_Specialist.pdf',
    rating: 5,
    notes: 'Previously led bridge deck erection on Tema Interchange Project.'
  },
  {
    id: 5,
    applicantName: 'Femi Balogun',
    email: 'femi.b@gmail.com',
    phone: '+234 805 332 1190',
    position: 'QA/QC Concrete Lab & Materials Technologist',
    department: 'Civil Engineering & Construction',
    experienceYears: 1,
    status: 'rejected',
    appliedDate: '2026-09-21',
    rejectionReason: 'Does not meet the minimum 3 years of concrete mix design quality testing requirement.'
  },
  {
    id: 6,
    applicantName: 'Victoria Eke',
    email: 'v.eke@civilbuild.org',
    phone: '+234 814 990 2831',
    position: 'Senior Structural Steel Project Engineer',
    department: 'Civil Engineering & Construction',
    experienceYears: 6,
    status: 'hired',
    appliedDate: '2026-09-16',
    interviewDate: '2026-09-28',
    interviewer: 'John Adebayo & Sarah Jenkins',
    rating: 5,
    notes: 'Offered position with start date on November 1st, 2026. Accepted offer.'
  }
];

export const initialEmployeeArchives: EmployeeArchiveRecord[] = [
  {
    id: 1,
    companyId: 1,
    employeeId: 99,
    employeeCode: 'EMP-099',
    employeeName: 'Benedict Larsson',
    department: 'Civil Engineering & Construction',
    position: 'Temporary Soil Mechanics Consultant',
    reason: 'Contract term completed upon final subsoil geotechnical test report delivery.',
    employeeData: JSON.stringify({
      code: 'EMP-099',
      name: 'Benedict Larsson',
      department: 'Civil Engineering & Construction',
      position: 'Temporary Soil Mechanics Consultant',
      salary: 4500,
      hireDate: '2024-01-10',
      terminationDate: '2025-12-31'
    }),
    deletedAt: '2026-01-05 14:30:00',
    archivedBy: 'Amara Okafor'
  }
];

export const initialEmployeeCustomFields: EmployeeCustomField[] = [
  { id: 1, fieldName: 'emergency_contact', fieldLabel: 'Emergency Contact Person & Phone', fieldType: 'text' },
  { id: 2, fieldName: 'driver_license_no', fieldLabel: 'National Commercial Driver License', fieldType: 'text' },
  { id: 3, fieldName: 'next_of_kin', fieldLabel: 'Next of Kin & Relationship', fieldType: 'text' },
  { id: 4, fieldName: 'site_access_badge_no', fieldLabel: 'Site RFID Security Badge ID', fieldType: 'text' }
];

export const initialCustomers: Customer[] = [
  {
    id: 1,
    customerCode: 'IHVN-1787044615',
    companyName: 'IHVN / Federal Highway Agency',
    contactPerson: 'Engr. Bello Danjuma',
    email: 'contracts@ihvn.org',
    phone: '+234 803 555 0192',
    address: 'Plot 250 Cadastral Zone, Central Business District, Abuja',
    balance: 0.0,
    status: 'active'
  },
  {
    id: 2,
    customerCode: 'CUST-GCF-8802',
    companyName: 'Global Cargo & Freight Ltd',
    contactPerson: 'David Van Der Bilt',
    email: 'procurement@globalcargo.com',
    phone: '+1 (555) 349-8812',
    address: 'Terminal 4, Deepwater Port Authority, Rotterdam / Lagos',
    balance: 145000.0,
    status: 'active'
  },
  {
    id: 3,
    customerCode: 'CUST-SKY-4412',
    companyName: 'Skyline Properties Development Corp',
    contactPerson: 'Victoria Alabi',
    email: 'developments@skylinegroup.com',
    phone: '+234 812 449 0182',
    address: '14 Marina Waterfront Tower, Victoria Island',
    balance: 280000.0,
    status: 'active'
  }
];

export const initialProjects: Project[] = [
  {
    id: 1,
    projectNumber: 'PRJ-TEST-1001',
    name: 'Bridge Extension & Dual Carriageway',
    clientId: 1,
    clientName: 'IHVN / Federal Highway Agency',
    clientContactPerson: 'Engr. Bello Danjuma',
    clientEmail: 'contracts@ihvn.org',
    clientPhone: '+234 803 555 0192',
    clientAddress: 'Plot 250 Cadastral Zone, CBD, Abuja',
    consultant: 'Arup Consulting Engineers',
    projectType: 'Highway & Bridges',
    description: 'Construction of a 4-span post-tensioned flyover bridge with 3.8km dual carriageway asphalt approaches, storm drainage culverts, and street lighting.',
    contractValue: 1250000,
    budget: 1250000,
    spent: 420000,
    contractDate: '2025-07-28',
    startDate: '2025-08-18',
    endDate: '2027-02-28',
    expectedCompletionDate: '2027-02-28',
    siteLocation: 'Abuja Corridor Section B',
    progressPercent: 35,
    status: 'in_progress',
    manager: 'Sarah Jenkins',
    assignedEngineers: ['Sarah Jenkins', 'Michael Chen'],
    companyId: 1,
    createdAt: '2025-08-18 10:22:00'
  },
  {
    id: 2,
    projectNumber: 'PRJ-LOG-2001',
    name: 'Skyline Commercial Center & Plaza Phase 1',
    clientId: 1,
    clientName: 'IHVN / Skyline Properties',
    clientContactPerson: 'Victoria Alabi',
    clientEmail: 'developments@skylinegroup.com',
    clientPhone: '+234 812 449 0182',
    clientAddress: '14 Marina Waterfront Tower, Victoria Island',
    consultant: 'Foster & Partners Consult',
    projectType: 'Commercial Building',
    description: 'Multi-storey commercial shopping complex including 5 levels of reinforced concrete framing, basement car park, structural steel atrium roof, and MEP installations.',
    contractValue: 2000000,
    budget: 2000000,
    spent: 850000,
    contractDate: '2025-09-12',
    startDate: '2025-10-01',
    endDate: '2026-12-18',
    expectedCompletionDate: '2026-12-18',
    siteLocation: '450 North Central Ave, City Center',
    progressPercent: 52,
    status: 'in_progress',
    manager: 'Sarah Jenkins',
    assignedEngineers: ['Sarah Jenkins', 'David O\'Connor'],
    companyId: 1,
    createdAt: '2025-10-01 09:15:00'
  },
  {
    id: 3,
    projectNumber: 'PRJ-2026-03',
    name: 'Harbor Logistics Distribution Warehouse Phase 2',
    clientId: 2,
    clientName: 'Global Cargo & Freight Ltd',
    clientContactPerson: 'David Van Der Bilt',
    clientEmail: 'procurement@globalcargo.com',
    clientPhone: '+1 (555) 349-8812',
    clientAddress: 'Terminal 4, Deepwater Port Authority',
    consultant: 'Maritime Infrastructure Partners',
    projectType: 'Industrial',
    description: '12,000m² heavy duty logistics distribution warehouse with high-tolerance laser screed concrete flooring, portal steel frame, dock levelers, and container apron yard.',
    contractValue: 3100000,
    budget: 3100000,
    spent: 620000,
    contractDate: '2026-01-15',
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    expectedCompletionDate: '2026-11-30',
    siteLocation: 'Deepwater Terminal Zone C',
    progressPercent: 20,
    status: 'in_progress',
    manager: 'Sarah Jenkins',
    assignedEngineers: ['Sarah Jenkins'],
    companyId: 1,
    createdAt: '2026-02-01 08:30:00'
  }
];

export const initialProjectLabourBudgets: ProjectLabourBudget[] = [
  {
    id: 1,
    projectId: 1,
    taskName: 'Pier Cap Shuttering & Scaffolding',
    labourType: 'Formwork Carpenters',
    quantity: 120,
    unitRate: 85,
    totalCost: 10200,
    notes: 'Skilled carpentry for curved pier cap formwork',
    createdAt: '2025-08-20'
  },
  {
    id: 2,
    projectId: 1,
    taskName: 'Deck Slab High-Tensile Rebar Tying',
    labourType: 'Steel Fixers',
    quantity: 160,
    unitRate: 90,
    totalCost: 14400,
    notes: 'Tying bottom and top mat rebar for 4 bridge spans',
    createdAt: '2025-08-22'
  },
  {
    id: 3,
    projectId: 1,
    taskName: 'Mass Concrete Vibrating & Placement',
    labourType: 'Concrete Masons & Vibrator Operators',
    quantity: 80,
    unitRate: 75,
    totalCost: 6000,
    notes: 'Night pours for monolithic temperature control',
    createdAt: '2025-08-25'
  },
  {
    id: 4,
    projectId: 2,
    taskName: 'Level 1 to 5 Structural Framing',
    labourType: 'Tower Crane Operators & Riggers',
    quantity: 90,
    unitRate: 110,
    totalCost: 9900,
    notes: 'Certified crane lifting operations',
    createdAt: '2025-10-05'
  },
  {
    id: 5,
    projectId: 2,
    taskName: 'Blockwork Partition Walls',
    labourType: 'Bricklayers & Mortar Helpers',
    quantity: 140,
    unitRate: 65,
    totalCost: 9100,
    notes: 'Internal retail shop division walling',
    createdAt: '2025-10-10'
  }
];

export const initialProjectMaterialBudgets: ProjectMaterialBudget[] = [
  {
    id: 1,
    projectId: 1,
    materialName: 'Structural Portland Cement 42.5N',
    category: 'Concrete',
    unit: 'Bag',
    quantity: 1500,
    unitCost: 12.5,
    totalCost: 18750,
    supplier: 'Dangote / Lafarge Cement Ltd',
    createdAt: '2025-08-20'
  },
  {
    id: 2,
    projectId: 1,
    materialName: 'High-Tensile TMT Steel Rebar 16mm',
    category: 'Steel',
    unit: 'Ton',
    quantity: 45,
    unitCost: 950,
    totalCost: 42750,
    supplier: 'Continental Steel Mills',
    createdAt: '2025-08-20'
  },
  {
    id: 3,
    projectId: 1,
    materialName: 'River Sand & Crushed Granite Aggregate 20mm',
    category: 'Aggregates',
    unit: 'm³',
    quantity: 800,
    unitCost: 35,
    totalCost: 28000,
    supplier: 'Apex Quarry Works',
    createdAt: '2025-08-22'
  },
  {
    id: 4,
    projectId: 2,
    materialName: 'H-Section Structural Steel Columns Grade 50',
    category: 'Steel',
    unit: 'Ton',
    quantity: 80,
    unitCost: 1100,
    totalCost: 88000,
    supplier: 'Apex Steel Mills',
    createdAt: '2025-10-05'
  },
  {
    id: 5,
    projectId: 2,
    materialName: 'Hollow Sandcrete Blocks 9-inch',
    category: 'Masonry',
    unit: 'Pcs',
    quantity: 12000,
    unitCost: 1.8,
    totalCost: 21600,
    supplier: 'City Block Molding Yard',
    createdAt: '2025-10-08'
  }
];

export const initialProjectMilestones: ProjectMilestone[] = [
  {
    id: 1,
    projectId: 1,
    name: 'Site Mobilization & Geo-Technical Piling',
    dueDate: '2025-11-30',
    status: 'completed',
    progressPercent: 100,
    notes: 'All 64 bored piles cast and integrity sonic-tested with zero non-conformances.',
    createdAt: '2025-08-18'
  },
  {
    id: 2,
    projectId: 1,
    name: 'Substructure Abutments & Pier Caps Complete',
    dueDate: '2026-05-15',
    status: 'pending',
    progressPercent: 65,
    notes: 'Piers 1, 2, 3 cast and approved. Pier 4 cap reinforcement in progress.',
    createdAt: '2025-08-18'
  },
  {
    id: 3,
    projectId: 1,
    name: 'Precast Beam Launching & Deck Post-Tensioning',
    dueDate: '2026-10-30',
    status: 'pending',
    progressPercent: 0,
    notes: 'Launching gantry mobilization scheduled for Q4.',
    createdAt: '2025-08-18'
  },
  {
    id: 4,
    projectId: 2,
    name: 'Substructure & Basement Car Park Raft Slab',
    dueDate: '2026-01-31',
    status: 'completed',
    progressPercent: 100,
    notes: '2,200m² waterproofed concrete raft foundation handed over.',
    createdAt: '2025-10-01'
  },
  {
    id: 5,
    projectId: 2,
    name: 'Level 1 to 5 Concrete Superstructure Topping Out',
    dueDate: '2026-07-31',
    status: 'pending',
    progressPercent: 55,
    notes: 'Currently casting Level 4 suspended slab.',
    createdAt: '2025-10-01'
  }
];

export const initialProjectTasks: ProjectTask[] = [
  {
    id: 1,
    projectId: 1,
    title: 'Install temporary dewatering pumps in Pier 4 excavation pit',
    description: 'Set up dual 4-inch submersible dewatering pumps to clear groundwater seepage prior to bottom mat steel placement.',
    assignedTo: 'Sarah Jenkins',
    assignedToId: 2,
    startDate: '2026-10-01',
    dueDate: '2026-10-05',
    status: 'completed',
    priority: 'High',
    progressPercent: 100,
    createdAt: '2026-10-01'
  },
  {
    id: 2,
    projectId: 1,
    title: 'Verify elastomeric bearing pad seating on Pier 3 cap',
    description: 'Survey levels with total station and confirm 5mm tolerance for bridge girder expansion bearing plates.',
    assignedTo: 'Michael Chen',
    assignedToId: 3,
    startDate: '2026-10-03',
    dueDate: '2026-10-08',
    status: 'in_progress',
    priority: 'Critical',
    progressPercent: 50,
    createdAt: '2026-10-02'
  },
  {
    id: 3,
    projectId: 1,
    title: 'Prepare cube crush test reports for 28-day Pier 2 pour',
    description: 'Retrieve concrete test cylinders from curing tank, conduct compressive strength break, and submit certs to consultant.',
    assignedTo: 'Sarah Jenkins',
    assignedToId: 2,
    startDate: '2026-10-06',
    dueDate: '2026-10-12',
    status: 'pending',
    priority: 'Medium',
    progressPercent: 0,
    createdAt: '2026-10-02'
  },
  {
    id: 4,
    projectId: 2,
    title: 'Deliver fire suppression pipe risers to Level 3',
    description: 'Coordinate tower crane hoist lift for scheduled MEP contractor installation.',
    assignedTo: 'David O\'Connor',
    assignedToId: 4,
    startDate: '2026-10-04',
    dueDate: '2026-10-07',
    status: 'in_progress',
    priority: 'Medium',
    progressPercent: 60,
    createdAt: '2026-10-03'
  }
];

export const initialProjectStaff: ProjectStaffAssignment[] = [
  {
    id: 1,
    projectId: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    role: 'Resident Senior Site Engineer',
    assignedDate: '2025-08-18',
    status: 'Active'
  },
  {
    id: 2,
    projectId: 1,
    employeeId: 3,
    employeeName: 'Michael Chen',
    role: 'Site Quantity Surveyor & Cost Controller',
    assignedDate: '2025-08-18',
    status: 'Active'
  },
  {
    id: 3,
    projectId: 1,
    employeeId: 8,
    employeeName: 'Kofi Asante',
    role: 'General Field Works Foreman',
    assignedDate: '2025-09-01',
    status: 'Active'
  },
  {
    id: 4,
    projectId: 2,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    role: 'Supervising Project Manager',
    assignedDate: '2025-10-01',
    status: 'Active'
  },
  {
    id: 5,
    projectId: 2,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    role: 'Site Logistics & Stores Officer',
    assignedDate: '2025-10-01',
    status: 'Active'
  }
];

export const initialProjectStaffHistory: ProjectStaffHistory[] = [
  {
    id: 1,
    projectId: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    action: 'Assigned',
    role: 'Resident Senior Site Engineer',
    changedAt: '2025-08-18 10:30'
  },
  {
    id: 2,
    projectId: 1,
    employeeId: 3,
    employeeName: 'Michael Chen',
    action: 'Assigned',
    role: 'Site Quantity Surveyor',
    changedAt: '2025-08-18 10:30'
  },
  {
    id: 3,
    projectId: 1,
    employeeId: 8,
    employeeName: 'Kofi Asante',
    action: 'Assigned',
    role: 'General Field Works Foreman',
    changedAt: '2025-09-01 08:00'
  },
  {
    id: 4,
    projectId: 2,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    action: 'Assigned',
    role: 'Site Logistics & Stores Officer',
    changedAt: '2025-10-01 09:00'
  }
];

export const initialProjectDelayNotes: ProjectDelayNote[] = [
  {
    id: 1,
    projectId: 1,
    logDate: '2026-03-12',
    issueSummary: 'Torrential River Surge & Heavy Downpour Delay',
    impact: 'Reduced productivity on bridge abutment excavation; 5 days lost.',
    actionTaken: 'Deployed twin high-capacity diesel dewatering pumps and placed riprap geotextile armor along embankment.',
    status: 'resolved',
    createdAt: '2026-03-12'
  },
  {
    id: 2,
    projectId: 1,
    logDate: '2026-07-20',
    issueSummary: 'Buried High-Voltage Cable Line Uncharted on Survey Map',
    impact: 'Suspended piling on Grid C until power authority safely isolated circuit.',
    actionTaken: 'Consulted municipal electric transmission agency; completed manual hand-trenching survey and rerouted cable tray.',
    status: 'resolved',
    createdAt: '2026-07-20'
  },
  {
    id: 3,
    projectId: 2,
    logDate: '2026-08-15',
    issueSummary: 'Supply Chain Port Terminal Clearance Delay for Structural Bolts',
    impact: 'Fabrication crew experienced 4 days waiting time for Grade 8.8 structural fasteners.',
    actionTaken: 'Procured interim certified batch from domestic ISO-certified distributor.',
    status: 'resolved',
    createdAt: '2026-08-15'
  }
];

export const initialQualityAssurance: ProjectQualityAssurance[] = [
  {
    id: 1,
    projectId: 1,
    inspectionDate: '2026-09-28',
    inspector: 'Engr. D. Kalu (Arup Consulting)',
    inspectionScope: 'Pier 3 Concrete Reinforcement Rebar Cage Spacing & Cover Spacers',
    result: 'Passed',
    defectsFound: 'None. Concrete cover blocks placed at required 50mm intervals.',
    remarks: 'Approved for concrete pour. Certified inspection sheet signed by Resident Engineer.',
    createdAt: '2026-09-28'
  },
  {
    id: 2,
    projectId: 1,
    inspectionDate: '2026-09-15',
    inspector: 'Michael Chen (Quality Surveyor)',
    inspectionScope: 'TMT Rebar Tensile Yield Strength & Chemical Mill Certs (Batch 42-B)',
    result: 'Passed',
    defectsFound: 'Tensile yield verified at 512 MPa (Standard min: 500 MPa).',
    remarks: 'Batch verified and entered into structural compliance register.',
    createdAt: '2026-09-15'
  },
  {
    id: 3,
    projectId: 2,
    inspectionDate: '2026-09-22',
    inspector: 'Foster & Partners QA Team',
    inspectionScope: 'Level 3 Welded Flange Connections on Primary Steel Girders',
    result: 'Conditional Pass',
    defectsFound: 'Minor slag inclusion on Column 4 joint fillet weld.',
    correctiveAction: 'Grind out weld seam and perform ultrasonic magnetic particle test after re-weld.',
    remarks: 'Re-inspection completed 24 hours later and approved.',
    createdAt: '2026-09-22'
  }
];

export const initialProjectInvoices: ProjectInvoice[] = [
  {
    id: 1,
    projectId: 1,
    invoiceNumber: 'INV-2025-0104',
    invoiceDate: '2025-10-15',
    dueDate: '2025-11-15',
    totalAmount: 250000,
    paidAmount: 250000,
    status: 'paid',
    description: 'Interim Payment Certificate #1: Mobilization, site camp setup, and test piling completion.'
  },
  {
    id: 2,
    projectId: 1,
    invoiceNumber: 'INV-2026-0218',
    invoiceDate: '2026-04-30',
    dueDate: '2026-05-30',
    totalAmount: 380000,
    paidAmount: 380000,
    status: 'paid',
    description: 'Interim Payment Certificate #2: Substructure pier footing casting and Pier 1-3 completion.'
  },
  {
    id: 3,
    projectId: 1,
    invoiceNumber: 'INV-2026-0391',
    invoiceDate: '2026-09-20',
    dueDate: '2026-10-20',
    totalAmount: 185000,
    paidAmount: 0,
    status: 'sent',
    description: 'Interim Payment Certificate #3: Pier 4 cap shuttering and deck precast girder fabrication advance.'
  },
  {
    id: 4,
    projectId: 2,
    invoiceNumber: 'INV-2026-0155',
    invoiceDate: '2026-03-10',
    dueDate: '2026-04-10',
    totalAmount: 500000,
    paidAmount: 500000,
    status: 'paid',
    description: 'IPC #1: Raft foundation casting, waterproofing, and basement columns.'
  },
  {
    id: 5,
    projectId: 2,
    invoiceNumber: 'INV-2026-0290',
    invoiceDate: '2026-08-15',
    dueDate: '2026-09-15',
    totalAmount: 420000,
    paidAmount: 420000,
    status: 'paid',
    description: 'IPC #2: Ground floor and Level 1-2 post-tensioned floor slab pours.'
  }
];

export const initialDailySiteReports: DailySiteReport[] = [
  {
    id: 1,
    projectId: 1,
    reportDate: '2026-10-02',
    summary: 'Executive Summary: Pier 3 cap pour finalized with 42m³ M35 concrete. Stripping of Pier 2 formwork accomplished with zero defect patching required. 38 workers on site under good weather.',
    engineer: 'Sarah Jenkins',
    createdAt: '2026-10-02 18:00'
  },
  {
    id: 2,
    projectId: 2,
    reportDate: '2026-10-02',
    summary: 'Level 4 cantilever rebar placement inspection witnessed by consulting engineer. Tower crane lift cycles reached 48 loads without incident.',
    engineer: 'Sarah Jenkins',
    createdAt: '2026-10-02 18:30'
  }
];

export const initialProjectBudgets: ProjectBudget[] = [
  {
    id: 1,
    projectId: 1,
    budgetName: 'Structural Cement Grade 42.5N',
    category: 'Materials',
    unitOfMeasure: 'Bags',
    quantity: 1500,
    unitCost: 12.5,
    totalCost: 18750,
    supplier: 'Dangote / Lafarge',
    notes: 'Total bags required for Pier 1 to 4 concrete pouring',
    status: 'actual'
  },
  {
    id: 2,
    projectId: 1,
    budgetName: 'High-Tensile Steel Rebar 16mm',
    category: 'Materials',
    unitOfMeasure: 'Tons',
    quantity: 45,
    unitCost: 950,
    totalCost: 42750,
    supplier: 'Continental Steel Mills',
    notes: 'Substructure rebar cage fabrication',
    status: 'approved'
  },
  {
    id: 3,
    projectId: 1,
    budgetName: 'Ready-Mix Concrete Grade M35',
    category: 'Materials',
    unitOfMeasure: 'm³',
    quantity: 650,
    unitCost: 180,
    totalCost: 117000,
    supplier: 'Metro Ready-Mix Concrete',
    notes: 'Bridge pier columns & abutment walls',
    status: 'approved'
  },
  {
    id: 4,
    projectId: 1,
    budgetName: 'Formwork Carpenters & Iron Benders',
    category: 'Labour',
    unitOfMeasure: 'Days',
    quantity: 120,
    unitCost: 85,
    totalCost: 10200,
    supplier: 'Direct Site Workforce',
    notes: 'Floor slab and column shuttering',
    status: 'approved'
  },
  {
    id: 5,
    projectId: 1,
    budgetName: '50-Ton Mobile Hydraulic Crane Rental',
    category: 'Equipment',
    unitOfMeasure: 'Months',
    quantity: 4,
    unitCost: 8500,
    totalCost: 34000,
    supplier: 'Heavy Crane Logistics Ltd',
    notes: 'Precast girder lifting and positioning',
    status: 'approved'
  },
  {
    id: 6,
    projectId: 1,
    budgetName: 'Post-Tensioning & Cable Stressing Subcontract',
    category: 'Subcontract',
    unitOfMeasure: 'Lump Sum',
    quantity: 1,
    unitCost: 85000,
    totalCost: 85000,
    supplier: 'VSL Post-Tensioning Systems',
    notes: 'Specialist bridge deck tensioning',
    status: 'pending'
  },
  {
    id: 7,
    projectId: 1,
    budgetName: 'Site Health, Safety & Environmental Equipment',
    category: 'Overhead',
    unitOfMeasure: 'Set',
    quantity: 1,
    unitCost: 9500,
    totalCost: 9500,
    supplier: 'SafetyTech Solutions',
    notes: 'Fall arrest harnesses, perimeter barricades, PPE',
    status: 'approved'
  },
  {
    id: 8,
    projectId: 2,
    budgetName: 'Structural Steel Columns Grade 50',
    category: 'Materials',
    unitOfMeasure: 'Tons',
    quantity: 80,
    unitCost: 1100,
    totalCost: 88000,
    supplier: 'Apex Steel Mills',
    notes: 'Multi-storey frame structural members',
    status: 'approved'
  },
  {
    id: 9,
    projectId: 2,
    budgetName: 'HVAC Ducting & Primary Chiller Subcontract',
    category: 'Subcontract',
    unitOfMeasure: 'Lump Sum',
    quantity: 1,
    unitCost: 145000,
    totalCost: 145000,
    supplier: 'Carrier / Daikin MEP Systems',
    notes: 'Commercial mall central cooling installation',
    status: 'pending'
  }
];

export const initialProjectActivities: ProjectActivity[] = [
  {
    id: 1,
    projectId: 1,
    timestamp: '2026-10-02 16:30',
    user: 'Sarah Jenkins',
    role: 'Site Engineer',
    activityType: 'Daily Log',
    description: 'Submitted Daily Progress Report: Poured 42m³ M35 concrete on Pier 3 cap with zero safety incidents.'
  },
  {
    id: 2,
    projectId: 1,
    timestamp: '2026-09-30 11:15',
    user: 'Babajide Cole',
    role: 'Site Engineer',
    activityType: 'RFI',
    description: 'RFI #1 "Structural Column Rebar Spacing Clarification" marked Resolved by Arup Consulting Engineers.'
  },
  {
    id: 3,
    projectId: 1,
    timestamp: '2026-09-25 14:00',
    user: 'Michael Chen',
    role: 'Site Quantity Surveyor',
    activityType: 'BOQ Change',
    description: 'Added BOQ Line Item: "Ready-Mix Concrete Grade M35" - 650 m³ at $180/m³ (Total: $117,000).'
  },
  {
    id: 4,
    projectId: 1,
    timestamp: '2026-09-20 09:45',
    user: 'John Adebayo',
    role: 'Managing Director',
    activityType: 'Milestone',
    description: 'Project milestone reached: Site Clearing & Geo-Technical Piling completed at 100%.'
  },
  {
    id: 5,
    projectId: 1,
    timestamp: '2026-09-14 11:00',
    user: 'Sarah Jenkins',
    role: 'Site Engineer',
    activityType: 'Safety',
    description: 'Logged Low severity safety incident (superficial finger scrape). Reissued Level-4 cut-resistant gloves.'
  },
  {
    id: 6,
    projectId: 2,
    timestamp: '2026-10-02 17:00',
    user: 'Sarah Jenkins',
    role: 'Site Engineer',
    activityType: 'Daily Log',
    description: 'Daily progress recorded: Level 4 cantilever rebar placement verified by consultant.'
  }
];

export const initialProjectSchedules: ProjectScheduleTask[] = [
  {
    id: 1,
    projectId: 1,
    taskName: 'Site Clearing & Geo-Technical Piling',
    startDate: '2025-08-20',
    endDate: '2025-11-30',
    status: 'completed',
    progressPercent: 100,
    assignedTo: 'Sarah Jenkins',
    notes: 'All 64 bored piles cast and integrity tested.'
  },
  {
    id: 2,
    projectId: 1,
    taskName: 'Pier Cap Construction & Bearings Placement',
    startDate: '2025-12-01',
    endDate: '2026-05-15',
    status: 'in_progress',
    progressPercent: 65,
    assignedTo: 'Sarah Jenkins',
    notes: 'Piers 1, 2, and 3 completed. Pier 4 rebar tying ongoing.'
  },
  {
    id: 3,
    projectId: 1,
    taskName: 'Post-Tensioned Concrete Deck Beam Launching',
    startDate: '2026-05-20',
    endDate: '2026-10-30',
    status: 'planned',
    progressPercent: 0,
    assignedTo: 'Sarah Jenkins'
  }
];

export const initialDelayLogs: ProjectDelayLog[] = [
  {
    id: 1,
    projectId: 1,
    scheduleId: 2,
    delayDate: '2026-03-12',
    delayDays: 5,
    reason: 'Heavy Tropical Downpour & Site Flash Flooding',
    details: 'Excavation trench flooded requiring 48 hours of centrifugal pump dewatering.'
  }
];

export const initialDailyLogs: ProjectDailyLog[] = [
  {
    id: 1,
    projectId: 1,
    logDate: '2026-10-02',
    weather: 'Clear, 28°C',
    completedWork: 'Poured 42m³ M35 concrete on Pier 3 cap. Stripped formwork on Pier 2.',
    manpower: '12 Carpenters, 16 Steel Fixers, 8 Masons, 2 Crane Operators',
    equipment: '1x 50T Mobile Crane, 2x Transit Mixers, 1x Stationary Concrete Pump',
    workersOnSite: 38,
    safetyIncident: false,
    loggedBy: 'Sarah Jenkins'
  },
  {
    id: 2,
    projectId: 2,
    logDate: '2026-10-02',
    weather: 'Overcast, 22°C',
    completedWork: 'Level 4 cantilever rebar placement verified by structural consultant.',
    manpower: '22 Steel Fixers, 6 Foremen, 14 General Helpers',
    equipment: '1x Tower Crane, 1x Hoist Lift',
    workersOnSite: 42,
    safetyIncident: false,
    loggedBy: 'Sarah Jenkins'
  }
];

export const initialSafetyIncidents: ProjectSafetyIncident[] = [
  {
    id: 1,
    projectId: 1,
    incidentDate: '2026-09-14',
    severity: 'Low',
    description: 'Minor superficial abrasion to worker hand during rebar tying. First aid kit treated on site.',
    actionTaken: 'Inspected PPE compliance; mandatory level-4 cut-resistant gloves reissued to all ironworkers.',
    status: 'Resolved'
  }
];

export const initialRFIs: ProjectRFI[] = [
  {
    id: 1,
    projectId: 1,
    subject: 'Structural Column Rebar Spacing Clarification - Grid C4',
    submittedBy: 'Sarah Jenkins',
    assignedTo: 'Consulting Structural Engineer',
    status: 'Resolved',
    date: '2026-09-28',
    resolution: 'Consultant stamped revised detail drawing C4-REV2 on 2026-09-30 allowing 150mm tie intervals.'
  },
  {
    id: 2,
    projectId: 2,
    subject: 'HVAC Duct Penetration Sleeves in Post-Tensioned Beams',
    submittedBy: 'Sarah Jenkins',
    assignedTo: 'Lead MEP Consultant',
    status: 'Under Review',
    date: '2026-10-01'
  }
];

export const initialChangeOrders: ProjectChangeOrder[] = [
  {
    id: 1,
    projectId: 1,
    title: 'Addition of Anti-Crash Concrete Barrier Walls on North Ramp',
    description: 'Highway authority revised crash barrier safety standard to NJ 810 profile.',
    amount: 45000,
    status: 'Approved',
    requestedDate: '2026-07-15'
  }
];

export const initialDocuments: ProjectDocument[] = [
  {
    id: 1,
    projectId: 1,
    projectName: 'Flyover Bridge Interchange Phase II',
    title: 'Bridge General Arrangement & Structural Elevation Drawings',
    fileName: 'bridge_ga_elevation_rev4.pdf',
    category: 'Structural',
    uploadDate: '2026-08-19',
    size: '8.4 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Sarah Jenkins',
    relatedType: 'Project',
    relatedId: 1,
    relatedName: 'Flyover Bridge Interchange Phase II',
    version: 'v4.0',
    description: 'Detailed longitudinal sections and reinforcement schedules for piers 1 through 6.'
  },
  {
    id: 2,
    projectId: 1,
    projectName: 'Flyover Bridge Interchange Phase II',
    title: 'Geotechnical Soil Investigation & Core Borings Report',
    fileName: 'geotech_soil_investigation_boreholes.pdf',
    category: 'Structural',
    uploadDate: '2026-08-22',
    size: '4.2 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Michael Chen',
    relatedType: 'Project',
    relatedId: 1,
    relatedName: 'Flyover Bridge Interchange Phase II',
    version: 'v1.0',
    description: 'Subsurface borehole logs, standard penetration test (SPT) N-values, and bearing capacity curves.'
  },
  {
    id: 3,
    projectId: 2,
    projectName: 'Industrial Warehouse Complex & Logistics Hub',
    title: 'Building Permit & Municipal Planning Approval Notice',
    fileName: 'municipal_building_permit_2026.pdf',
    category: 'Permit',
    uploadDate: '2026-09-02',
    size: '1.2 MB',
    fileType: 'application/pdf',
    uploadedBy: 'John Adebayo',
    relatedType: 'Project',
    relatedId: 2,
    relatedName: 'Industrial Warehouse Complex & Logistics Hub',
    version: 'v1.0',
    description: 'Statutory development planning permit granted by Municipal Urban Planning Authority.'
  },
  {
    id: 4,
    projectId: 2,
    projectName: 'Industrial Warehouse Complex & Logistics Hub',
    title: 'High-Tensile Portal Frame Structural Model & CAD',
    fileName: 'warehouse_portal_frame_detailing.dwg',
    category: 'Architectural',
    uploadDate: '2026-09-10',
    size: '12.8 MB',
    fileType: 'image/vnd.dwg',
    uploadedBy: 'Sarah Jenkins',
    relatedType: 'Project',
    relatedId: 2,
    relatedName: 'Industrial Warehouse Complex & Logistics Hub',
    version: 'v2.1',
    description: 'AutoCAD 3D structural drawings for 45m clear span steel portal frames.'
  },
  {
    id: 5,
    projectId: 3,
    projectName: 'Commercial Office Tower (18 Floors)',
    title: 'Main FIDIC Conditions of Contract Execution Deed',
    fileName: 'fidic_red_book_executed_contract.pdf',
    category: 'Contract',
    uploadDate: '2026-07-15',
    size: '6.7 MB',
    fileType: 'application/pdf',
    uploadedBy: 'John Adebayo',
    relatedType: 'Contract',
    relatedId: 1,
    relatedName: 'Metropolitan Commercial Complex Contract',
    version: 'v1.0',
    description: 'Executed FIDIC contract agreement, performance guarantee bonds, and appendix.'
  },
  {
    id: 6,
    projectId: 1,
    projectName: 'Flyover Bridge Interchange Phase II',
    title: 'Pier 3 Concrete Pour Slump & Cube Test QA Certificate',
    fileName: 'pier3_concrete_qa_certificate.pdf',
    category: 'Safety',
    uploadDate: '2026-10-04',
    size: '850 KB',
    fileType: 'application/pdf',
    uploadedBy: 'Sarah Jenkins',
    relatedType: 'Project',
    relatedId: 1,
    relatedName: 'Flyover Bridge Interchange Phase II',
    version: 'v1.0',
    description: 'Laboratory compressive cylinder crush test results verifying 35 N/mm² 28-day target.'
  },
  {
    id: 7,
    title: 'Corporate Engineering Standards & Safety Manual (OSHA / ISO 45001)',
    fileName: 'apex_harness_safety_sop_2026.pdf',
    category: 'Safety',
    uploadDate: '2026-06-10',
    size: '3.1 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Amara Okafor',
    relatedType: 'General',
    version: 'v3.2',
    description: 'Mandatory standard operating procedures for working at heights, deep trenching, and crane operations.'
  },
  {
    id: 8,
    projectId: 4,
    projectName: 'Residential Waterfront Estate Infrastructure',
    title: 'Road Alignment & Stormwater Outfall Layout Plans',
    fileName: 'waterfront_stormwater_drainage.pdf',
    category: 'Architectural',
    uploadDate: '2026-09-18',
    size: '5.5 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Michael Chen',
    relatedType: 'Project',
    relatedId: 4,
    relatedName: 'Residential Waterfront Estate Infrastructure',
    version: 'v1.2',
    description: 'Civil stormwater drainage design, culvert crossings, and hydraulic gradient calculations.'
  }
];

export const initialInventoryCategories: InventoryCategory[] = [
  { id: 1, name: 'Cement & Aggregates', description: 'Binders, ordinary portland cement, gravel, granite & fine sand', itemCount: 2, createdAt: '2025-08-18' },
  { id: 2, name: 'Steel & Rebar', description: 'High-tensile deformed rebar, binding wire, structural steel beams & mesh', itemCount: 2, createdAt: '2025-08-18' },
  { id: 3, name: 'Masonry & Timber', description: 'Hollow blocks, solid blocks, formwork plywood & dimensional lumber', itemCount: 0, createdAt: '2025-08-18' },
  { id: 4, name: 'Plumbing & Drainage', description: 'PVC pipes, HDPE conduits, manhole covers & fittings', itemCount: 0, createdAt: '2025-08-18' },
  { id: 5, name: 'Safety & PPE', description: 'Class E hardhats, high-vis vests, steel-toe boots & harnesses', itemCount: 1, createdAt: '2025-08-18' },
  { id: 6, name: 'Heavy Equipment Parts', description: 'Hydraulic hoses, filters, cutting edges, track pads & lubricants', itemCount: 1, createdAt: '2025-08-18' }
];

export const initialWarehouses: Warehouse[] = [
  {
    id: 1,
    code: 'WH-MAIN-A',
    name: 'Main Yard Warehouse A - Civil Stores',
    location: 'Plot 44 Industrial Area, Main Logistics Yard, Bay 1-4',
    storeKeeperId: 4,
    storeKeeperName: "David O'Connor",
    phone: '+1 (555) 234-8904',
    capacity: '5,000 MT',
    status: 'active',
    itemCount: 4,
    totalValuation: 185400,
    createdAt: '2025-08-18'
  },
  {
    id: 2,
    code: 'WH-STEEL-01',
    name: 'Central Structural Steel Depot & Yard',
    location: 'Heavy Industrial Free Trade Zone, Berth 3 Staging Area',
    storeKeeperId: 8,
    storeKeeperName: 'Kofi Asante',
    phone: '+1 (555) 019-6632',
    capacity: '12,000 MT',
    status: 'active',
    itemCount: 2,
    totalValuation: 165000,
    createdAt: '2025-08-18'
  },
  {
    id: 3,
    code: 'WH-BATCH-01',
    name: 'Batching Plant Aggregates Bunkers',
    location: 'Abuja Corridor KM 12 Ready-Mix Concrete Compound',
    storeKeeperId: 4,
    storeKeeperName: "David O'Connor",
    phone: '+1 (555) 234-8904',
    capacity: '8,500 MT',
    status: 'active',
    itemCount: 1,
    totalValuation: 48500,
    createdAt: '2025-08-20'
  },
  {
    id: 4,
    code: 'WH-SITE-PRJ1',
    name: 'Site Store - Bridge Extension Staging Area',
    location: 'Abuja Corridor Section B Site Camp Stores',
    storeKeeperId: 2,
    storeKeeperName: 'Sarah Jenkins',
    phone: '+1 (555) 019-2834',
    capacity: '1,500 MT',
    status: 'active',
    itemCount: 3,
    totalValuation: 24200,
    createdAt: '2025-09-01'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 1,
    supplierCode: 'SUP-STEEL-001',
    companyName: 'Continental Steel Mills Corp',
    contactPerson: 'Alhaji Mansur Ibrahim',
    email: 'sales@continentalsteel.com',
    phone: '+234 803 111 8822',
    address: 'Plot 12 Steel Industrial Layout, Ajaokuta / Ikeja',
    category: 'Structural Steel & Rebar',
    balance: 45000.0,
    taxId: 'TIN-ST-992014',
    paymentTerms: 'Net 30 Days',
    status: 'active',
    createdAt: '2025-08-18'
  },
  {
    id: 2,
    supplierCode: 'SUP-CEM-002',
    companyName: 'Lafarge & Holcim Cement Dist',
    contactPerson: 'Mrs. Folashade Adeyemi',
    email: 'commercial@lafarge-dist.com',
    phone: '+234 802 444 9911',
    address: 'Depot 5, Bulk Terminal Expressway, Ewekoro',
    category: 'Civil Aggregates & Cement',
    balance: 18200.0,
    taxId: 'TIN-CEM-110294',
    paymentTerms: 'Immediate upon delivery',
    status: 'active',
    createdAt: '2025-08-18'
  },
  {
    id: 3,
    supplierCode: 'SUP-AGGR-003',
    companyName: 'Metro Quarry & Aggregates Ltd',
    contactPerson: 'Engr. Patrick Chukwu',
    email: 'orders@metroquarry.com',
    phone: '+234 818 777 3300',
    address: 'Km 24 Quarry Road, Mpape Hills, Abuja',
    category: 'Civil Aggregates & Cement',
    balance: 9500.0,
    taxId: 'TIN-MQ-384910',
    paymentTerms: 'Net 15 Days',
    status: 'active',
    createdAt: '2025-08-20'
  },
  {
    id: 4,
    supplierCode: 'SUP-SAFE-004',
    companyName: 'Safety First Industrial Supplies Ltd',
    contactPerson: 'Karen Lindqvist',
    email: 'orders@safetyfirst.com',
    phone: '+1 (555) 789-2234',
    address: '88 Protection Way, Safety Park',
    category: 'Safety & PPE',
    balance: 0.0,
    taxId: 'TIN-SF-883921',
    paymentTerms: 'Net 30 Days',
    status: 'active',
    createdAt: '2025-09-01'
  },
  {
    id: 5,
    supplierCode: 'SUP-EQP-005',
    companyName: 'Putzmeister OEM Machinery Parts',
    contactPerson: 'Heinrich Gruber',
    email: 'service@putzmeister-parts.com',
    phone: '+49 7127 599-0',
    address: 'Max-Eyth-Straße 10, Aichtal, Germany',
    category: 'Heavy Equipment & Spares',
    balance: 12400.0,
    taxId: 'DE-811192837',
    paymentTerms: 'Letter of Credit / Net 60',
    status: 'active',
    createdAt: '2025-09-10'
  }
];

export const initialInventoryItemChanges: InventoryItemChange[] = [
  {
    id: 1,
    itemId: 1,
    itemCode: 'CEM-OPC-50',
    itemName: 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)',
    changeReason: 'Goods receipt verified on GRN-2026-0012',
    beforeData: JSON.stringify({ currentStock: 740, costPrice: 12.5 }),
    afterData: JSON.stringify({ currentStock: 840, costPrice: 12.5 }),
    changedBy: "David O'Connor",
    changedAt: '2026-09-25 10:35'
  },
  {
    id: 2,
    itemId: 4,
    itemCode: 'AGG-GRAVEL-20MM',
    itemName: 'Crushed Granite Coarse Aggregate 20mm',
    changeReason: 'Site dispatch on WB-2026-0019',
    beforeData: JSON.stringify({ currentStock: 420 }),
    afterData: JSON.stringify({ currentStock: 320 }),
    changedBy: "David O'Connor",
    changedAt: '2026-09-30 14:20'
  },
  {
    id: 3,
    itemId: 6,
    itemCode: 'HYD-HOSE-2IN',
    itemName: 'Concrete Boom Pump Hydraulic High-Pressure Hose 2"',
    changeReason: 'Stock write-off of damaged hose',
    beforeData: JSON.stringify({ currentStock: 4 }),
    afterData: JSON.stringify({ currentStock: 3 }),
    changedBy: "David O'Connor",
    changedAt: '2026-10-02 16:05'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 1,
    referenceNumber: 'SM-2026-0001',
    movementType: 'receipt',
    itemId: 1,
    itemCode: 'CEM-OPC-50',
    itemName: 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)',
    quantity: 900,
    unit: 'Bags',
    source: 'Lafarge & Holcim Cement Dist',
    destination: 'Main Yard Warehouse A - Bay 1',
    warehouseId: 1,
    warehouseName: 'Main Yard Warehouse A - Civil Stores',
    performedBy: "David O'Connor",
    movementDate: '2026-09-25 10:30',
    reason: 'Goods received against PO-2026-0088',
    relatedDocumentType: 'GRN',
    relatedDocumentRef: 'GRN-2026-0012',
    status: 'completed',
    createdAt: '2026-09-25 10:30:00'
  },
  {
    id: 2,
    referenceNumber: 'SM-2026-0002',
    movementType: 'issue',
    itemId: 4,
    itemCode: 'AGG-GRAVEL-20MM',
    itemName: 'Crushed Granite Coarse Aggregate 20mm',
    quantity: 100,
    unit: 'Tons',
    source: 'Batching Plant Aggregates Bunkers',
    destination: 'Skyline Commercial Center & Plaza Phase 1',
    warehouseId: 3,
    warehouseName: 'Batching Plant Aggregates Bunkers',
    projectId: 2,
    projectName: 'Skyline Commercial Center & Plaza Phase 1',
    performedBy: "David O'Connor",
    movementDate: '2026-09-30 14:15',
    reason: 'Site dispatch against approved Requisition REQ-2026-0041',
    relatedDocumentType: 'Waybill',
    relatedDocumentRef: 'WB-2026-0019',
    status: 'completed',
    createdAt: '2026-09-30 14:15:00'
  },
  {
    id: 3,
    referenceNumber: 'SM-2026-0003',
    movementType: 'transfer',
    itemId: 2,
    itemCode: 'STEEL-TMT-16MM',
    itemName: 'High-Tensile TMT Deformed Rebar 16mm (12m Length)',
    quantity: 6,
    unit: 'Tons',
    source: 'Central Structural Steel Depot & Yard',
    destination: 'Site Store - Bridge Extension Staging Area',
    warehouseId: 2,
    warehouseName: 'Central Structural Steel Depot & Yard',
    targetWarehouseId: 4,
    targetWarehouseName: 'Site Store - Bridge Extension Staging Area',
    projectId: 1,
    projectName: 'Bridge Extension & Dual Carriageway',
    performedBy: 'Kofi Asante',
    movementDate: '2026-10-01 08:45',
    reason: 'Inter-store transfer for scheduled pier cap fabrication',
    relatedDocumentType: 'Waybill',
    relatedDocumentRef: 'WB-2026-0020',
    status: 'completed',
    createdAt: '2026-10-01 08:45:00'
  },
  {
    id: 4,
    referenceNumber: 'SM-2026-0004',
    movementType: 'adjustment',
    itemId: 6,
    itemCode: 'HYD-HOSE-2IN',
    itemName: 'Concrete Boom Pump Hydraulic High-Pressure Hose 2"',
    quantity: -1,
    unit: 'Units',
    source: 'Physical Store Audit Discrepancy',
    destination: 'Scrap / Damaged Write-off',
    warehouseId: 1,
    warehouseName: 'Main Yard Warehouse A - Civil Stores',
    performedBy: "David O'Connor",
    movementDate: '2026-10-02 16:00',
    reason: 'Burst hose replaced on mobile concrete pump during testing; write-off approved',
    relatedDocumentType: 'PhysicalAudit',
    status: 'completed',
    createdAt: '2026-10-02 16:00:00'
  }
];

export const initialDispatchRequests: RequisitionDispatchRequest[] = [
  {
    id: 1,
    requisitionId: 2,
    requisitionNo: 'REQ-2026-0041',
    requisitionItemId: 3,
    companyId: 1,
    inventoryItemId: 4,
    itemCode: 'AGG-GRAVEL-20MM',
    itemName: 'Crushed Granite Coarse Aggregate 20mm',
    quantity: 100,
    unit: 'Tons',
    sourceWarehouseId: 3,
    sourceWarehouseName: 'Batching Plant Aggregates Bunkers',
    destinationProjectId: 2,
    destinationProjectName: 'Skyline Commercial Center & Plaza Phase 1',
    status: 'dispatched',
    requestedAt: '2026-09-29 11:00',
    requestedBy: 'Michael Chen',
    decidedAt: '2026-09-30 09:00',
    decidedBy: 'John Adebayo',
    dispatchNotes: 'Dispatched on 2x 30-ton tri-axle dump trucks to Pier 4 staging yard.'
  },
  {
    id: 2,
    requisitionId: 1,
    requisitionNo: 'REQ-2026-0042',
    requisitionItemId: 1,
    companyId: 1,
    inventoryItemId: 1,
    itemCode: 'CEM-OPC-50',
    itemName: 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)',
    quantity: 200,
    unit: 'Bags',
    sourceWarehouseId: 1,
    sourceWarehouseName: 'Main Yard Warehouse A - Civil Stores',
    destinationProjectId: 1,
    destinationProjectName: 'Bridge Extension & Dual Carriageway',
    status: 'pending',
    requestedAt: '2026-10-01 09:30',
    requestedBy: 'Sarah Jenkins',
    dispatchNotes: 'Awaiting Managing Director executive approval.'
  }
];

export const initialWaybills: Waybill[] = [
  {
    id: 1,
    waybillNumber: 'WB-2026-0019',
    requisitionId: 2,
    requisitionNo: 'REQ-2026-0041',
    dispatchRequestId: 1,
    projectId: 2,
    projectName: 'Skyline Commercial Center & Plaza Phase 1',
    sourceWarehouseId: 3,
    sourceWarehouseName: 'Batching Plant Aggregates Bunkers',
    destinationSite: '450 North Central Ave, City Center Staging Bay',
    carrierName: 'Apex Heavy Haulage Fleet',
    vehicleNumber: 'TRK-224-LAG',
    driverPhone: '+234 803 999 1122',
    dispatchedBy: "David O'Connor",
    dispatchDate: '2026-09-30',
    receivedBy: 'Engr. Bello Danjuma',
    receivedDate: '2026-09-30',
    status: 'Delivered',
    items: [
      {
        itemId: 4,
        itemCode: 'AGG-GRAVEL-20MM',
        itemName: 'Crushed Granite Coarse Aggregate 20mm',
        unit: 'Tons',
        quantityDispatched: 100,
        quantityReceived: 100,
        condition: 'Good',
        notes: 'Weighed on weighbridge ticket #88412'
      }
    ],
    notes: 'Direct haulage for evening batching casting schedule.',
    createdAt: '2026-09-30 14:10:00'
  },
  {
    id: 2,
    waybillNumber: 'WB-2026-0020',
    projectId: 1,
    projectName: 'Bridge Extension & Dual Carriageway',
    sourceWarehouseId: 2,
    sourceWarehouseName: 'Central Structural Steel Depot & Yard',
    destinationSite: 'Abuja Corridor Section B Pier 4',
    carrierName: 'Express Logistics Inter-State',
    vehicleNumber: 'FLT-809-ABJ',
    driverPhone: '+234 812 334 5566',
    dispatchedBy: 'Kofi Asante',
    dispatchDate: '2026-10-01',
    receivedBy: 'Sarah Jenkins',
    receivedDate: '2026-10-01',
    status: 'Delivered',
    items: [
      {
        itemId: 2,
        itemCode: 'STEEL-TMT-16MM',
        itemName: 'High-Tensile TMT Deformed Rebar 16mm (12m Length)',
        unit: 'Tons',
        quantityDispatched: 6,
        quantityReceived: 6,
        condition: 'Good',
        notes: 'Delivered bundled with mill test certificates.'
      }
    ],
    notes: 'Urgent transfer for Pier 4 footing reinforcement cages.',
    createdAt: '2026-10-01 08:30:00'
  }
];

export const initialGoodsReceivedNotes: GoodsReceivedNote[] = [
  {
    id: 1,
    grnNumber: 'GRN-2026-0012',
    purchaseOrderId: 2,
    poNumber: 'PO-2026-0088',
    supplierId: 2,
    supplierName: 'Lafarge & Holcim Cement Dist',
    warehouseId: 1,
    warehouseName: 'Main Yard Warehouse A - Civil Stores',
    receivedDate: '2026-09-25',
    receivedBy: "David O'Connor",
    inspectedBy: 'Sarah Jenkins (QC Site Engineer)',
    vendorDeliveryNote: 'VDN-LAF-99410',
    waybillRef: 'WB-EXT-10492',
    vehicleNumber: 'TKR-881-LAG',
    status: 'inspected_received',
    qcInspectionStatus: 'Passed',
    remarks: 'Cement bags dry, intact packaging, sample batch laboratory test set taken.',
    items: [
      {
        id: 1,
        inventoryItemId: 1,
        itemCode: 'CEM-OPC-50',
        description: 'Ordinary Portland Cement Bulk tanker discharge (50kg Eq)',
        unit: 'Bags',
        quantityOrdered: 900,
        quantityPreviouslyReceived: 0,
        quantityReceived: 900,
        quantityAccepted: 900,
        quantityRejected: 0,
        unitPrice: 12.5,
        lineTotal: 11250
      }
    ],
    totalReceivedValue: 11250,
    createdAt: '2026-09-25 10:20:00'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 1,
    itemCode: 'CEM-OPC-50',
    name: 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)',
    categoryId: 1,
    categoryName: 'Cement & Aggregates',
    unit: 'Bags',
    supplierName: 'Lafarge & Holcim',
    costPrice: 12.5,
    sellingPrice: 15.0,
    currentStock: 840,
    minLevel: 300,
    warehouseLocation: 'Yard Warehouse A - Bay 1'
  },
  {
    id: 2,
    itemCode: 'STEEL-TMT-16MM',
    name: 'High-Tensile TMT Deformed Rebar 16mm (12m Length)',
    categoryId: 2,
    categoryName: 'Steel & Rebar',
    unit: 'Tons',
    supplierName: 'Continental Steel Mills',
    costPrice: 940.0,
    sellingPrice: 1100.0,
    currentStock: 24,
    minLevel: 15,
    warehouseLocation: 'Steel Yard Staging Area'
  },
  {
    id: 3,
    itemCode: 'STEEL-TMT-12MM',
    name: 'High-Tensile TMT Deformed Rebar 12mm (12m Length)',
    categoryId: 2,
    categoryName: 'Steel & Rebar',
    unit: 'Tons',
    supplierName: 'Continental Steel Mills',
    costPrice: 960.0,
    sellingPrice: 1120.0,
    currentStock: 8, // Low stock warning
    minLevel: 12,
    warehouseLocation: 'Steel Yard Staging Area'
  },
  {
    id: 4,
    itemCode: 'AGG-GRAVEL-20MM',
    name: 'Crushed Granite Coarse Aggregate 20mm',
    categoryId: 1,
    categoryName: 'Cement & Aggregates',
    unit: 'Tons',
    supplierName: 'Metro Quarry Ltd',
    costPrice: 38.0,
    sellingPrice: 48.0,
    currentStock: 320,
    minLevel: 100,
    warehouseLocation: 'Batching Plant Aggregate Bunker 2'
  },
  {
    id: 5,
    itemCode: 'PPE-HELMET-WHT',
    name: 'Safety Hardhats (ANSI Z89.1 Class E) White',
    categoryId: 5,
    categoryName: 'Safety & PPE',
    unit: 'Pieces',
    supplierName: 'Safety First Industrial Supplies',
    costPrice: 18.0,
    sellingPrice: 24.0,
    currentStock: 85,
    minLevel: 25,
    warehouseLocation: 'Tool & Safety Store Locker 3'
  },
  {
    id: 6,
    itemCode: 'HYD-HOSE-2IN',
    name: 'Concrete Boom Pump Hydraulic High-Pressure Hose 2"',
    categoryId: 6,
    categoryName: 'Heavy Equipment Parts',
    unit: 'Units',
    supplierName: 'Putzmeister OEM Parts',
    costPrice: 340.0,
    sellingPrice: 420.0,
    currentStock: 3, // Low stock
    minLevel: 5,
    warehouseLocation: 'Equipment Workshop Bay 2'
  }
];

export const initialRequisitions: Requisition[] = [
  {
    id: 1,
    requisitionNo: 'REQ-2026-0042',
    projectId: 1,
    projectName: 'Bridge Extension & Dual Carriageway',
    requestedBy: 'Sarah Jenkins',
    department: 'Civil Engineering & Construction',
    requisitionDate: '2026-10-01',
    priority: 'Urgent',
    status: 'Pending Review',
    title: 'Reinforcement Steel & Cement for Pier 4 Cap',
    totalEstimatedAmount: 7200,
    items: [
      {
        id: 1,
        inventoryItemId: 1,
        itemCode: 'CEM-OPC-50',
        itemName: 'Ordinary Portland Cement (Grade 42.5N - 50kg bag)',
        unit: 'Bags',
        quantityRequired: 200,
        quantityInStock: 840,
        quantityToPurchase: 0,
        price: 12.5,
        value: 2500
      },
      {
        id: 2,
        inventoryItemId: 2,
        itemCode: 'STEEL-TMT-16MM',
        itemName: 'High-Tensile TMT Deformed Rebar 16mm (12m Length)',
        unit: 'Tons',
        quantityRequired: 5,
        quantityInStock: 24,
        quantityToPurchase: 0,
        price: 940.0,
        value: 4700
      }
    ],
    remarks: 'Required for Level 5 cantilever beam reinforcement and cast scheduled for Tuesday.',
    messages: [
      {
        id: 1,
        requisitionId: 1,
        userName: 'Sarah Jenkins',
        role: 'Site Engineer',
        message: 'Rebar fabrication scheduled to commence as soon as approval is granted.',
        createdAt: '2026-10-01 09:30 AM'
      }
    ]
  },
  {
    id: 2,
    requisitionNo: 'REQ-2026-0041',
    projectId: 2,
    projectName: 'Skyline Commercial Center & Plaza Phase 1',
    requestedBy: 'Michael Chen',
    department: 'Commercial & Cost Management',
    requisitionDate: '2026-09-29',
    priority: 'Normal',
    status: 'Approved',
    title: 'Coarse Aggregate for Concrete Floor Pour',
    approvedBy: 'John Adebayo',
    approvalDate: '2026-09-30',
    totalEstimatedAmount: 3800,
    items: [
      {
        id: 3,
        inventoryItemId: 4,
        itemCode: 'AGG-GRAVEL-20MM',
        itemName: 'Crushed Granite Coarse Aggregate 20mm',
        unit: 'Tons',
        quantityRequired: 100,
        quantityInStock: 320,
        quantityToPurchase: 0,
        price: 38.0,
        value: 3800
      }
    ],
    dispatchNote: 'Dispatched on 2x 30-ton tri-axle dump trucks to Pier 4 staging yard.'
  },
  {
    id: 3,
    requisitionNo: 'REQ-2026-0039',
    projectId: 1,
    projectName: 'Bridge Extension & Dual Carriageway',
    requestedBy: 'Sarah Jenkins',
    department: 'Civil Engineering & Construction',
    requisitionDate: '2026-09-26',
    priority: 'Normal',
    status: 'Delivered',
    title: 'Site Safety Equipment & Class E Hardhats',
    approvedBy: 'John Adebayo',
    approvalDate: '2026-09-27',
    totalEstimatedAmount: 1260,
    items: [
      {
        id: 4,
        inventoryItemId: 5,
        itemCode: 'PPE-HELMET-WHT',
        itemName: 'Safety Hardhats (ANSI Z89.1 Class E) White',
        unit: 'Pieces',
        quantityRequired: 70,
        quantityInStock: 85,
        quantityToPurchase: 0,
        price: 18.0,
        value: 1260
      }
    ],
    dispatchNote: 'Delivered via Stores Utility Van; verified by site safety officer.'
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: 'PO-2026-0089',
    supplierId: 1,
    supplierName: 'Continental Steel Mills Corp',
    projectId: 1,
    projectName: 'Bridge Extension & Dual Carriageway',
    orderDate: '2026-09-27',
    expectedDelivery: '2026-10-06',
    status: 'pending_approval',
    totalAmount: 18800,
    paymentTerms: 'Net 30 Days after site verification',
    items: [
      {
        description: 'High-Tensile TMT Deformed Rebar 12mm Grade 500D (12m)',
        quantity: 20,
        unitPrice: 940,
        total: 18800
      }
    ]
  },
  {
    id: 2,
    poNumber: 'PO-2026-0088',
    supplierId: 2,
    supplierName: 'Lafarge & Holcim Cement Dist',
    projectId: 2,
    projectName: 'Skyline Commercial Center & Plaza Phase 1',
    orderDate: '2026-09-20',
    expectedDelivery: '2026-09-25',
    status: 'received',
    totalAmount: 11250,
    paymentTerms: 'Immediate upon delivery',
    items: [
      {
        description: 'Ordinary Portland Cement Bulk tanker discharge (50kg Eq)',
        quantity: 900,
        unitPrice: 12.5,
        total: 11250
      }
    ]
  }
];

export const initialSalaryAdvances: SalaryAdvance[] = [
  {
    id: 1,
    employeeId: 3,
    employeeName: 'Michael Chen',
    amount: 1500,
    reason: 'Emergency medical deductible for family member',
    requestDate: '2026-09-28',
    status: 'Approved',
    deductionMonth: 'October 2026'
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: 'David O\'Connor',
    amount: 800,
    reason: 'Relocation expenses for Highway project site office',
    requestDate: '2026-10-02',
    status: 'Pending',
    deductionMonth: 'November 2026'
  }
];

export const initialEmployeeLoans: EmployeeLoan[] = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    totalAmount: 6000,
    monthlyDeduction: 500,
    repaidAmount: 2500,
    status: 'Active',
    startDate: '2026-04-01'
  }
];

export const initialPayrollRuns: PayrollRun[] = [
  {
    id: 1,
    monthYear: 'September 2026',
    totalGross: 56500,
    totalDeductions: 9800,
    totalNet: 46700,
    employeeCount: 8,
    processedDate: '2026-09-29',
    status: 'Paid'
  }
];

export const initialPayslips: Payslip[] = [
  {
    id: 1,
    payrollRunId: 1,
    employeeId: 1,
    employeeName: 'John Adebayo',
    employeeCode: 'EMP-001',
    department: 'Executive Directorate',
    basicSalary: 12500,
    allowances: 1500,
    grossPay: 14000,
    tax: 2800,
    pension: 700,
    loanDeduction: 0,
    totalDeductions: 3500,
    netPay: 10500,
    sentToPortal: true
  },
  {
    id: 2,
    payrollRunId: 1,
    employeeId: 2,
    employeeName: 'Sarah Jenkins',
    employeeCode: 'EMP-002',
    department: 'Civil Engineering & Construction',
    basicSalary: 6800,
    allowances: 800,
    grossPay: 7600,
    tax: 1250,
    pension: 397,
    loanDeduction: 500,
    totalDeductions: 2147,
    netPay: 5453,
    sentToPortal: true
  },
  {
    id: 3,
    payrollRunId: 1,
    employeeId: 3,
    employeeName: 'Michael Chen',
    employeeCode: 'EMP-003',
    department: 'Commercial & Cost Management',
    basicSalary: 6200,
    allowances: 750,
    grossPay: 6950,
    tax: 1100,
    pension: 360,
    loanDeduction: 0,
    totalDeductions: 1460,
    netPay: 5490,
    sentToPortal: true
  }
];

export const initialMixDesigns: RmcMixDesign[] = [
  {
    id: 1,
    code: 'MIX-M25-PUMP',
    grade: 'M25 Concrete',
    slumpTarget: '120 ± 25 mm',
    cementKg: 340,
    waterLitres: 170,
    fineAggregateKg: 780,
    coarseAggregateKg: 1080,
    admixtureLitres: 2.8,
    target28DayStrength: '31.5 MPa'
  },
  {
    id: 2,
    code: 'MIX-M35-TREMIE',
    grade: 'M35 Self-Compacting / Tremie',
    slumpTarget: '180 ± 20 mm',
    cementKg: 420,
    waterLitres: 165,
    fineAggregateKg: 810,
    coarseAggregateKg: 990,
    admixtureLitres: 4.2,
    target28DayStrength: '43.0 MPa'
  },
  {
    id: 3,
    code: 'MIX-M45-BRIDGE',
    grade: 'M45 Post-Tensioned Bridge Deck',
    slumpTarget: '110 ± 15 mm',
    cementKg: 460,
    waterLitres: 155,
    fineAggregateKg: 740,
    coarseAggregateKg: 1060,
    admixtureLitres: 5.5,
    target28DayStrength: '52.0 MPa'
  }
];

export const initialBatchRecords: RmcBatchRecord[] = [
  {
    id: 1,
    ticketNo: 'BT-2026-904',
    mixDesignCode: 'MIX-M35-TREMIE',
    truckNo: 'TM-08 (Volvo FM 8x4)',
    volumeCuM: 8,
    clientProject: 'Skyline Commercial Center - Slab 4',
    batchTime: '2026-10-02 08:30 AM',
    slumpMeasured: '185 mm (Passed)',
    status: 'Poured'
  },
  {
    id: 2,
    ticketNo: 'BT-2026-905',
    mixDesignCode: 'MIX-M45-BRIDGE',
    truckNo: 'TM-12 (Mercedes Arocs)',
    volumeCuM: 9,
    clientProject: 'Bridge Extension - Pier 3 Cap',
    batchTime: '2026-10-02 11:15 AM',
    slumpMeasured: '115 mm (Passed)',
    status: 'Dispatched'
  }
];

export const initialQualityInspections: RmcQualityInspection[] = [
  {
    id: 1,
    batchTicketNo: 'BT-2026-904',
    inspectionDate: '2026-10-02',
    slumpMm: 185,
    cylinder7DayStrength: '32.4 MPa',
    cylinder28DayStrength: 'Pending 28d',
    passed: true,
    notes: 'Uniform aggregate distribution, no bleeding observed.'
  }
];

export const initialContracts: ContractAdminContract[] = [
  {
    id: 1,
    contractNumber: 'CONT-2025-001',
    title: 'Dual-Carriageway Flyover & Drainage Infrastructure Construction',
    clientName: 'Ministry of Federal Works & Infrastructure',
    contractorName: 'Apex Construction & Civil Works Ltd',
    procurementRoute: 'International Competitive Bidding',
    status: 'active',
    estimatedValue: 14000000,
    awardedValue: 12500000,
    awardDate: '2025-06-15',
    commencementDate: '2025-08-18',
    completionDate: '2027-02-28',
    description: 'FIDIC Red Book construction contract for grade-separated interchange.'
  },
  {
    id: 2,
    contractNumber: 'CONT-2026-004',
    title: 'Skyline Mixed-Use Commercial Complex Architectural Core',
    clientName: 'Skyline Properties Holdings',
    contractorName: 'Apex Construction & Civil Works Ltd',
    procurementRoute: 'Selective Tender',
    status: 'active',
    estimatedValue: 2200000,
    awardedValue: 2000000,
    awardDate: '2025-09-01',
    commencementDate: '2025-10-01',
    completionDate: '2026-12-18',
    description: 'Design and build contract including MEP and interior structural works.'
  }
];

export const initialContractEvents: ContractAdminEvent[] = [
  {
    id: 1,
    contractId: 1,
    eventType: 'Instruction',
    eventDate: '2026-02-10',
    notes: 'Engineer Site Instruction #04: Deepen pile cut-off level by 450mm at Pier 2 due to bedrock depth.'
  },
  {
    id: 2,
    contractId: 1,
    eventType: 'Payment Application',
    eventDate: '2026-09-15',
    notes: 'Interim Payment Certificate IPC-06 issued for $420,000 against certified milestones.'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 1,
    channelId: 'general-operations',
    sender: 'Sarah Jenkins',
    role: 'Site Engineer',
    message: 'Good morning team. Concrete pump is positioned on Pier 3 cap. Ready for Transit Mixer truck #1.',
    timestamp: '08:15 AM'
  },
  {
    id: 2,
    channelId: 'general-operations',
    sender: 'David O\'Connor',
    role: 'Procurement Officer',
    message: 'Mixer TM-08 loaded with 8m³ M35 concrete just dispatched from batching plant. ETA 20 mins.',
    timestamp: '08:32 AM',
    attachmentName: 'batch_ticket_912_dispatch.pdf',
    attachmentType: 'application/pdf',
    attachmentSize: '420 KB'
  },
  {
    id: 3,
    channelId: 'general-operations',
    sender: 'John Adebayo',
    role: 'Managing Director',
    message: 'Understood. Ensure test cubes are molded and curing tank temperature is maintained.',
    timestamp: '08:40 AM'
  },
  {
    id: 4,
    channelId: 'general-operations',
    sender: 'Sarah Jenkins',
    role: 'Site Engineer',
    message: 'QA technician has prepared 6 cylinders for the 7-day and 28-day compression test series.',
    timestamp: '08:45 AM'
  },
  {
    id: 5,
    channelId: 'site-engineers',
    sender: 'Kofi Asante',
    role: 'Site Engineer',
    message: 'Pier 4 rebar cage placement completed. Chief Resident Engineer has scheduled reinforcement inspection for 11:00 AM.',
    timestamp: '09:10 AM',
    attachmentName: 'pier4_rebar_elevation.jpg',
    attachmentType: 'image/jpeg',
    attachmentSize: '1.8 MB'
  },
  {
    id: 6,
    channelId: 'procurement-vendors',
    sender: 'David O\'Connor',
    role: 'Procurement Officer',
    message: 'Dangote Cement depot confirmed delivery of 1,200 bags OPC to Main Yard by 2:00 PM today.',
    timestamp: '09:30 AM'
  },
  {
    id: 7,
    channelId: 'executive-briefing',
    sender: 'Elena Rostova',
    role: 'Finance Manager',
    message: 'Interim Payment Certificate IPC-06 for Flyover Bridge approved by Ministry Consultant. Inflow expected Thursday.',
    timestamp: '10:05 AM'
  }
];

export const initialEquipment: Equipment[] = [
  {
    id: 1,
    equipmentCode: 'EQ-EXC-01',
    name: 'Caterpillar 336D Hydraulic Crawler Excavator',
    type: 'Excavator',
    status: 'in_use',
    projectId: 1,
    projectName: 'Flyover Bridge Interchange Phase II',
    operatorName: 'Samuel Okon',
    hourlyRate: 145,
    serialNumber: 'CAT-336D-99812',
    purchaseDate: '2023-04-12'
  },
  {
    id: 2,
    equipmentCode: 'EQ-CRN-02',
    name: 'Liebherr 550 EC-H 20 Litronic Tower Crane (50m Jib)',
    type: 'Tower Crane',
    status: 'in_use',
    projectId: 2,
    projectName: 'Industrial Warehouse Complex & Logistics Hub',
    operatorName: 'Emeka Nwosu',
    hourlyRate: 195,
    serialNumber: 'LBH-550ECH-2291',
    purchaseDate: '2022-11-05'
  },
  {
    id: 3,
    equipmentCode: 'EQ-PMP-03',
    name: 'Putzmeister BSF 36-4.16 H Truck-Mounted Concrete Boom Pump',
    type: 'Concrete Pump',
    status: 'in_use',
    projectId: 1,
    projectName: 'Flyover Bridge Interchange Phase II',
    operatorName: 'Aliyu Danjuma',
    hourlyRate: 160,
    serialNumber: 'PTZ-36-416-8821',
    purchaseDate: '2024-01-20'
  },
  {
    id: 4,
    equipmentCode: 'EQ-DOZ-04',
    name: 'Komatsu D85EX-15 Heavy Earthmoving Crawler Dozer',
    type: 'Bulldozer',
    status: 'available',
    projectId: 4,
    projectName: 'Residential Waterfront Estate Infrastructure',
    operatorName: 'Babatunde Fashola',
    hourlyRate: 130,
    serialNumber: 'KOM-D85EX-1104',
    purchaseDate: '2023-08-15'
  },
  {
    id: 5,
    equipmentCode: 'EQ-BPL-05',
    name: 'Lintec & Linnhoff CCO 60m³/hr Automated Batching Plant',
    type: 'Batch Plant',
    status: 'in_use',
    operatorName: 'Tariq Mansoor',
    hourlyRate: 220,
    serialNumber: 'LTC-CCO60-3301',
    purchaseDate: '2021-06-30'
  },
  {
    id: 6,
    equipmentCode: 'EQ-ROL-06',
    name: 'Bomag BW 211 D-5 Heavy Vibratory Soil Compactor',
    type: 'Compactor / Roller',
    status: 'maintenance',
    operatorName: 'Garba Mohammed',
    hourlyRate: 85,
    serialNumber: 'BMG-211D5-7721',
    purchaseDate: '2023-02-18'
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 1,
    vehicleCode: 'VH-TM-01',
    plateNumber: 'ABJ-772-XA',
    model: 'Mercedes-Benz Actros 3340 8x4 Concrete Transit Mixer (9m³)',
    type: 'Transit Mixer Truck',
    status: 'active',
    driverName: 'Suleiman Bello',
    currentOdometer: 48200,
    fuelCapacityLiters: 350,
    lastServiceDate: '2026-09-15'
  },
  {
    id: 2,
    vehicleCode: 'VH-TM-02',
    plateNumber: 'ABJ-884-YB',
    model: 'MAN TGS 33.360 6x4 Heavy Transit Mixer (8m³)',
    type: 'Transit Mixer Truck',
    status: 'active',
    driverName: 'Chidi Eze',
    currentOdometer: 52100,
    fuelCapacityLiters: 320,
    lastServiceDate: '2026-09-20'
  },
  {
    id: 3,
    vehicleCode: 'VH-TIP-03',
    plateNumber: 'KNO-551-ZC',
    model: 'Scania P380 6x4 20m³ Quarry Aggregate Tipper',
    type: 'Tipper / Dump Truck',
    status: 'active',
    driverName: 'Mustapha Lawan',
    currentOdometer: 76400,
    fuelCapacityLiters: 400,
    lastServiceDate: '2026-08-30'
  },
  {
    id: 4,
    vehicleCode: 'VH-LOW-04',
    plateNumber: 'LAG-302-AA',
    model: 'Volvo FMX 460 Heavy Lowbed Equipment Hauler (60 Ton)',
    type: 'Flatbed Lowbed',
    status: 'active',
    driverName: 'Kayode Alabi',
    currentOdometer: 64100,
    fuelCapacityLiters: 500,
    lastServiceDate: '2026-09-05'
  },
  {
    id: 5,
    vehicleCode: 'VH-HIL-05',
    plateNumber: 'ABJ-119-KC',
    model: 'Toyota Hilux 2.8 D-4D 4x4 Site Supervisory Pickup',
    type: 'Site Pickup 4x4',
    status: 'active',
    driverName: 'Sarah Jenkins',
    currentOdometer: 31800,
    fuelCapacityLiters: 80,
    lastServiceDate: '2026-09-28'
  },
  {
    id: 6,
    vehicleCode: 'VH-WT-06',
    plateNumber: 'ABJ-663-DT',
    model: 'HOWO Sinotruk 15,000L Dust Suppression Water Tanker',
    type: 'Water Tanker',
    status: 'in_service',
    driverName: 'Ibrahim Musa',
    currentOdometer: 59300,
    fuelCapacityLiters: 300,
    lastServiceDate: '2026-08-14'
  }
];

export const initialMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 1,
    assetType: 'Equipment',
    assetId: 1,
    assetName: 'Caterpillar 336D Hydraulic Crawler Excavator',
    assetCode: 'EQ-EXC-01',
    maintenanceDate: '2026-09-12',
    description: '500-hour preventive servicing: hydraulic fluid change, oil and fuel filter replacements, track tensioning.',
    cost: 1850,
    performedBy: 'Mantrac Caterpillar Authorized Field Service',
    partsReplaced: 'Hydraulic high-pressure filter, engine oil filter, primary fuel water separator',
    nextServiceDate: '2026-12-12',
    status: 'completed'
  },
  {
    id: 2,
    assetType: 'Vehicle',
    assetId: 1,
    assetName: 'Mercedes-Benz Actros 3340 Transit Mixer',
    assetCode: 'VH-TM-01',
    maintenanceDate: '2026-09-15',
    description: 'Drum drive gearbox oil change, hydraulic motor inspection, brake pad replacement on rear axles.',
    cost: 1200,
    performedBy: 'Weststar Motors Commercial Workshop',
    partsReplaced: 'Rear brake shoes, drum hydraulic filter, synthetic gear lubricant',
    nextServiceDate: '2026-11-15',
    status: 'completed'
  },
  {
    id: 3,
    assetType: 'Equipment',
    assetId: 6,
    assetName: 'Bomag BW 211 D-5 Soil Compactor',
    assetCode: 'EQ-ROL-06',
    maintenanceDate: '2026-10-02',
    description: 'Vibration exciter shaft bearing overhaul and rubber buffer replacement.',
    cost: 950,
    performedBy: 'Apex Internal Plant Mechanics Unit',
    partsReplaced: 'Exciter drum elastomer mounts (4x)',
    nextServiceDate: '2027-01-02',
    status: 'in_progress'
  }
];

export const initialFuelConsumptions: FuelConsumption[] = [
  {
    id: 1,
    vehicleId: 1,
    vehicleCode: 'VH-TM-01',
    plateNumber: 'ABJ-772-XA',
    fuelDate: '2026-10-04',
    liters: 140,
    cost: 210,
    odometerKm: 48120,
    driverName: 'Suleiman Bello',
    fuelStation: 'Yard Bulk Diesel Tank #1'
  },
  {
    id: 2,
    vehicleId: 3,
    vehicleCode: 'VH-TIP-03',
    plateNumber: 'KNO-551-ZC',
    fuelDate: '2026-10-04',
    liters: 180,
    cost: 270,
    odometerKm: 76350,
    driverName: 'Mustapha Lawan',
    fuelStation: 'Yard Bulk Diesel Tank #1'
  },
  {
    id: 3,
    vehicleId: 5,
    vehicleCode: 'VH-HIL-05',
    plateNumber: 'ABJ-119-KC',
    fuelDate: '2026-10-03',
    liters: 65,
    cost: 97.5,
    odometerKm: 31750,
    driverName: 'Sarah Jenkins',
    fuelStation: 'TotalEnergies Commercial Filling Point'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 1,
    userName: 'John Adebayo',
    userRole: 'Managing Director',
    action: 'APPROVAL',
    module: 'Procurement',
    details: 'Approved Purchase Order PO-2026-001 for 1,200 bags Ordinary Portland Cement ($10,200)',
    ipAddress: '192.168.1.10',
    createdAt: '2026-10-05 08:30:15'
  },
  {
    id: 2,
    userName: 'Sarah Jenkins',
    userRole: 'Site Engineer',
    action: 'DISPATCH_VERIFY',
    module: 'Requisitions',
    details: 'Verified and signed Delivery Waybill WB-2026-001 for 18mm high-yield deformed rebar at Central Flyover Pier 3',
    ipAddress: '192.168.1.45',
    createdAt: '2026-10-05 08:45:20'
  },
  {
    id: 3,
    userName: 'Elena Rostova',
    userRole: 'Finance Manager',
    action: 'PAYROLL_EXECUTE',
    module: 'Payroll',
    details: 'Executed automated salary calculations and PAYE/Pension withholdings for 8 active personnel for October 2026',
    ipAddress: '192.168.1.18',
    createdAt: '2026-10-05 09:12:00'
  },
  {
    id: 4,
    userName: 'Amara Okafor',
    userRole: 'HR Manager',
    action: 'LEAVE_APPROVE',
    module: 'HR',
    details: 'Approved 5-day annual leave application for Site Engineer Sarah Jenkins',
    ipAddress: '192.168.1.22',
    createdAt: '2026-10-05 09:35:40'
  }
];

export const initialSystemLogs: SystemLog[] = [
  {
    id: 1,
    logType: 'info',
    module: 'Storage & Database',
    message: 'Local relational state cache synchronized. 18 tables verified with zero data corruption.',
    createdAt: '2026-10-05 08:00:00'
  },
  {
    id: 2,
    logType: 'info',
    module: 'Biometric Attendance',
    message: 'Biometric gate clock terminal online. Automated late arrival threshold set to 08:15 AM.',
    createdAt: '2026-10-05 08:00:05'
  },
  {
    id: 3,
    logType: 'warning',
    module: 'Inventory Reorder',
    message: 'Stock alert: Structural Steel Y16 Rebar reached minimum safety threshold (4.5 MT remaining). Reorder suggested.',
    createdAt: '2026-10-05 08:25:30'
  },
  {
    id: 4,
    logType: 'security',
    module: 'Access Control',
    message: 'Super Administrator persona session elevated for current workspace.',
    createdAt: '2026-10-05 08:30:00'
  }
];

export const initialAccountsLedger: AccountLedgerEntry[] = [
  { id: 1, accountCode: '1010', name: 'Operating Cash & Bank Balance', type: 'Asset', balance: 1420500 },
  { id: 2, accountCode: '1200', name: 'Accounts Receivable (Contract Billings)', type: 'Asset', balance: 840000 },
  { id: 3, accountCode: '1300', name: 'Stores & Material Inventory Asset', type: 'Asset', balance: 412800 },
  { id: 4, accountCode: '2010', name: 'Accounts Payable (Subcontractors & Suppliers)', type: 'Liability', balance: 295000 },
  { id: 5, accountCode: '2050', name: 'Accrued Payroll & Statutory Tax Withholding', type: 'Liability', balance: 46700 },
  { id: 6, accountCode: '4010', name: 'Construction Contract Revenue', type: 'Revenue', balance: 3250000 },
  { id: 7, accountCode: '5010', name: 'Direct Material & Rebar Expenses', type: 'Expense', balance: 890000 },
  { id: 8, accountCode: '5020', name: 'Direct Site Equipment & Fuel Expenses', type: 'Expense', balance: 340000 }
];
