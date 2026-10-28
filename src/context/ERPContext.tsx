import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  Employee,
  Department,
  Project,
  ProjectBudget,
  ProjectScheduleTask,
  ProjectDelayLog,
  ProjectDailyLog,
  ProjectSafetyIncident,
  ProjectRFI,
  ProjectChangeOrder,
  ProjectDocument,
  ProjectActivity,
  InventoryItem,
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
  Customer,
  ProjectLabourBudget,
  ProjectMaterialBudget,
  ProjectMilestone,
  ProjectTask,
  ProjectStaffAssignment,
  ProjectStaffHistory,
  ProjectDelayNote,
  ProjectQualityAssurance,
  ProjectInvoice,
  DailySiteReport,
  InventoryCategory,
  Warehouse,
  InventoryItemChange,
  StockMovement,
  RequisitionDispatchRequest,
  Waybill,
  Supplier,
  GoodsReceivedNote,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  RecruitmentApplication,
  JobVacancy,
  EmployeeArchiveRecord,
  EmployeeCustomField,
  UserRole,
  Equipment,
  Vehicle,
  MaintenanceRecord,
  FuelConsumption,
  AuditLog,
  SystemLog,
  SupplierInvoice,
  AuthSessionLog,
  CompanyLeavePolicy,
  PayrollCalculationStructure,
  PayrollCalculationItem
} from '../types';
import { erpStorage } from '../services/erpStorage';
import { inventoryService } from '../services/inventoryService';
import { warehouseService } from '../services/warehouseService';
import { stockMovementService } from '../services/stockMovementService';
import { requisitionService } from '../services/requisitionService';
import { dispatchService } from '../services/dispatchService';
import { waybillService } from '../services/waybillService';
import { supplierService } from '../services/supplierService';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { grnService } from '../services/grnService';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { recruitmentService } from '../services/recruitmentService';
import { payrollService } from '../services/payrollService';
import { supabaseService } from '../services/supabaseService';
import { getSupabaseConfig } from '../services/supabaseClient';
import { supabaseAuth } from '../services/supabaseAuth';
import { authAuditService } from '../services/authAuditService';
import { supplierInvoiceService } from '../services/supplierInvoiceService';
import { companyService, CompanyRegistrationData, ProvisionAccountData } from '../services/companyService';

interface ERPContextType {
  // Multi-Company
  companies: Company[];
  activeCompany: Company;
  setActiveCompanyId: (id: number) => void;
  updateCompany: (id: number, data: Partial<Company>) => void;

  // Auth & Roles
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUserName: string;
  isImpersonating: boolean;
  loginAsEmployee: (emp: Employee) => void;
  stopImpersonation: () => void;

  // Supabase Authentication
  supabaseUser: any;
  supabaseSession: any;
  authLoading: boolean;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; session?: any }>;
  signOutWithSupabase: () => Promise<void>;

  // Projects
  projects: Project[];
  projectBudgets: ProjectBudget[];
  projectSchedules: ProjectScheduleTask[];
  delayLogs: ProjectDelayLog[];
  dailyLogs: ProjectDailyLog[];
  safetyIncidents: ProjectSafetyIncident[];
  rfis: ProjectRFI[];
  changeOrders: ProjectChangeOrder[];
  documents: ProjectDocument[];
  projectActivities: ProjectActivity[];
  addProject: (p: Omit<Project, 'id' | 'spent' | 'progressPercent'>) => void;
  updateProject: (id: number, data: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  updateProjectProgress: (id: number, percent: number) => void;
  addBudget: (b: Omit<ProjectBudget, 'id'>) => void;
  updateBudget: (id: number, data: Partial<ProjectBudget>) => void;
  deleteBudget: (id: number) => void;
  addScheduleTask: (s: Omit<ProjectScheduleTask, 'id'>) => void;
  updateScheduleTask: (id: number, progress: number, status: ProjectScheduleTask['status']) => void;
  updateScheduleTaskFull: (id: number, data: Partial<ProjectScheduleTask>) => void;
  deleteScheduleTask: (id: number) => void;
  addDelayLog: (d: Omit<ProjectDelayLog, 'id'>) => void;
  addDailyLog: (l: Omit<ProjectDailyLog, 'id'>) => void;
  addSafetyIncident: (s: Omit<ProjectSafetyIncident, 'id'>) => void;
  addRFI: (r: Omit<ProjectRFI, 'id'>) => void;
  resolveRFI: (id: number, resolution: string) => void;
  addChangeOrder: (c: Omit<ProjectChangeOrder, 'id'>) => void;
  addDocument: (d: Omit<ProjectDocument, 'id'>) => void;
  updateDocument: (id: number, data: Partial<ProjectDocument>) => void;
  deleteDocument: (id: number) => void;
  addProjectActivity: (a: Omit<ProjectActivity, 'id' | 'timestamp'>) => void;

  // Project Submodules
  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id'>) => void;
  labourBudgets: ProjectLabourBudget[];
  addLabourBudget: (l: Omit<ProjectLabourBudget, 'id'>) => void;
  updateLabourBudget: (id: number, data: Partial<ProjectLabourBudget>) => void;
  deleteLabourBudget: (id: number) => void;
  materialBudgets: ProjectMaterialBudget[];
  addMaterialBudget: (m: Omit<ProjectMaterialBudget, 'id'>) => void;
  updateMaterialBudget: (id: number, data: Partial<ProjectMaterialBudget>) => void;
  deleteMaterialBudget: (id: number) => void;
  milestones: ProjectMilestone[];
  addMilestone: (m: Omit<ProjectMilestone, 'id'>) => void;
  updateMilestone: (id: number, data: Partial<ProjectMilestone>) => void;
  deleteMilestone: (id: number) => void;
  projectTasks: ProjectTask[];
  addProjectTask: (t: Omit<ProjectTask, 'id'>) => void;
  updateProjectTask: (id: number, data: Partial<ProjectTask>) => void;
  deleteProjectTask: (id: number) => void;
  projectStaff: ProjectStaffAssignment[];
  assignProjectStaff: (s: Omit<ProjectStaffAssignment, 'id'>) => void;
  removeProjectStaff: (id: number) => void;
  projectStaffHistory: ProjectStaffHistory[];
  delayNotes: ProjectDelayNote[];
  addDelayNote: (n: Omit<ProjectDelayNote, 'id'>) => void;
  updateDelayNote: (id: number, data: Partial<ProjectDelayNote>) => void;
  deleteDelayNote: (id: number) => void;
  qualityAssurance: ProjectQualityAssurance[];
  addQualityAssurance: (q: Omit<ProjectQualityAssurance, 'id'>) => void;
  updateQualityAssurance: (id: number, data: Partial<ProjectQualityAssurance>) => void;
  deleteQualityAssurance: (id: number) => void;
  projectInvoices: ProjectInvoice[];
  addProjectInvoice: (i: Omit<ProjectInvoice, 'id'>) => void;
  updateProjectInvoice: (id: number, data: Partial<ProjectInvoice>) => void;
  dailySiteReports: DailySiteReport[];
  addDailySiteReport: (r: Omit<DailySiteReport, 'id'>) => void;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, data: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  adjustStock: (id: number, delta: number, reason?: string, warehouseName?: string) => void;
  inventoryCategories: InventoryCategory[];
  addInventoryCategory: (cat: Omit<InventoryCategory, 'id'>) => void;
  updateInventoryCategory: (id: number, data: Partial<InventoryCategory>) => void;
  deleteInventoryCategory: (id: number) => void;
  inventoryItemChanges: InventoryItemChange[];

  // Warehouses
  warehouses: Warehouse[];
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (id: number, data: Partial<Warehouse>) => void;
  deleteWarehouse: (id: number) => void;

  // Stock Movement & Operations
  stockMovements: StockMovement[];
  recordStockMovement: (data: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  transferStock: (params: {
    itemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    targetWarehouseId: number;
    targetWarehouseName: string;
    reason: string;
    projectId?: number;
    projectName?: string;
  }) => { success: boolean; error?: string };
  receiveStock: (params: {
    itemId: number;
    quantity: number;
    date?: string;
    supplierMode?: 'existing' | 'new' | 'none';
    supplierId?: number;
    supplierName?: string;
    newSupplier?: {
      companyName: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
      address?: string;
      category?: string;
    };
    warehouseId?: number;
    warehouseName: string;
    referenceNumber?: string;
    notes?: string;
  }) => { success: boolean; error?: string; updatedItem?: InventoryItem; movement?: StockMovement };
  issueStock: (params: {
    itemId: number;
    quantity: number;
    destinationType: 'project' | 'site' | 'warehouse' | 'department' | 'employee';
    projectId?: number;
    projectName?: string;
    targetWarehouseId?: number;
    targetWarehouseName?: string;
    department?: string;
    employeeId?: number;
    employeeName?: string;
    destinationDetails?: string;
    recipientName: string;
    date?: string;
    purpose: string;
    referenceNumber?: string;
    notes?: string;
    requisitionId?: number;
    requisitionNo?: string;
  }) => { success: boolean; error?: string; updatedItem?: InventoryItem; movement?: StockMovement };

  // Requisitions & Dispatches
  requisitions: Requisition[];
  createRequisition: (r: Omit<Requisition, 'id' | 'requisitionNo' | 'status' | 'requisitionDate'>) => void;
  updateRequisitionStatus: (id: number, status: Requisition['status'], comments?: string) => void;
  flagRequisitionForClarification: (id: number, reason: string) => void;
  provideRequisitionClarification: (id: number, response: string) => void;
  addRequisitionMessage: (requisitionId: number, message: string) => void;
  mandatoryRequisitionOffices: string[];
  updateMandatoryRequisitionOffices: (offices: string[]) => void;
  dispatchRequests: RequisitionDispatchRequest[];
  createDispatchRequest: (data: Omit<RequisitionDispatchRequest, 'id' | 'requestedAt' | 'status'>) => void;
  executeDispatch: (params: {
    dispatchRequestId?: number;
    requisitionId: number;
    requisitionNo: string;
    inventoryItemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    destinationProjectId: number;
    destinationProjectName: string;
    carrierName: string;
    vehicleNumber: string;
    driverPhone?: string;
    notes?: string;
  }) => { success: boolean; error?: string };

  // Waybills
  waybills: Waybill[];
  createWaybill: (data: Omit<Waybill, 'id' | 'createdAt' | 'status'>) => void;
  markWaybillDelivered: (id: number, receivedBy: string, notes?: string) => void;

  // Procurement & Suppliers
  suppliers: Supplier[];
  addSupplier: (data: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  updateSupplier: (id: number, data: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
  purchaseOrders: PurchaseOrder[];
  createPurchaseOrder: (p: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status' | 'orderDate'>) => void;
  updatePOStatus: (id: number, status: PurchaseOrder['status'], rejectionReason?: string) => void;
  goodsReceivedNotes: GoodsReceivedNote[];
  createGRN: (data: Parameters<typeof grnService.createGRN>[0]) => { success: boolean; error?: string };

  // HR & Employees
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  jobVacancies: JobVacancy[];
  recruitmentApplications: RecruitmentApplication[];
  employeeArchives: EmployeeArchiveRecord[];
  employeeCustomFields: EmployeeCustomField[];
  disabledColumns: string[];
  salaryAdvances: SalaryAdvance[];
  employeeLoans: EmployeeLoan[];

  addEmployee: (e: Omit<Employee, 'id' | 'code'> & { code?: string }) => Employee;
  updateEmployee: (id: number, data: Partial<Employee>) => void;
  archiveEmployee: (id: number, reason: string) => boolean;
  restoreEmployee: (id: number) => boolean;
  deleteEmployeePermanently: (id: number) => boolean;
  toggleDisabledColumn: (columnKey: string) => void;
  addCustomField: (field: Omit<EmployeeCustomField, 'id'>) => void;

  addDepartment: (d: Omit<Department, 'id'>) => Department;
  updateDepartment: (id: number, data: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
  assignDepartmentHead: (deptId: number, empId: number, headName: string, title?: string) => void;

  clockIn: (employeeId?: number) => { success: boolean; record?: AttendanceRecord; error?: string };
  clockOut: (employeeId?: number) => { success: boolean; record?: AttendanceRecord; error?: string };
  recordManualAttendance: (data: { employeeId: number; attendanceDate: string; checkIn?: string; checkOut?: string; status: AttendanceRecord['status']; notes?: string }) => void;
  requestAttendanceCorrection: (id: number, reason: string) => boolean;
  decideAttendanceCorrection: (id: number, status: 'Approved' | 'Rejected', notes?: string) => boolean;

  createLeaveRequest: (data: { employeeId: number; leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; reason: string }) => LeaveRequest;
  decideLeaveRequest: (id: number, status: 'Approved' | 'Rejected', comments?: string, rejectionReason?: string) => void;
  cancelLeaveRequest: (id: number) => void;

  createJobVacancy: (data: Omit<JobVacancy, 'id' | 'postedDate'>) => JobVacancy;
  updateJobVacancy: (id: number, data: Partial<JobVacancy>) => void;
  createRecruitmentApplication: (data: Omit<RecruitmentApplication, 'id' | 'appliedDate' | 'status'>) => RecruitmentApplication;
  updateApplicationStage: (id: number, status: RecruitmentApplication['status'], details?: { interviewDate?: string; interviewer?: string; rating?: number; notes?: string; rejectionReason?: string }) => void;
  hireCandidate: (params: { applicationId: number; salary: number; hireDate?: string; role?: UserRole }) => { success: boolean; employee?: Employee; error?: string };

  requestSalaryAdvance: (a: Omit<SalaryAdvance, 'id' | 'requestDate' | 'status'>) => void;
  decideSalaryAdvance: (id: number, status: 'Approved' | 'Rejected') => void;
  createEmployeeLoan: (l: Omit<EmployeeLoan, 'id' | 'repaidAmount' | 'status'>) => void;
  markLoanInstallmentPaid: (loanId: number, amount: number) => void;

  // Payroll
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  payrollStructure: PayrollCalculationStructure;
  updatePayrollStructure: (structure: PayrollCalculationStructure) => void;
  processPayrollMonth: (monthYear: string, customItems?: PayrollCalculationItem[]) => void;
  finalizePayrollRun: (runId: number) => void;
  markPayrollPaid: (runId: number) => void;
  importPayrollCSV: (csvContent: string) => { success: boolean; run?: PayrollRun; error?: string };
  bulkSendPayslips: (payrollRunId: number) => void;

  // RMC Operations
  mixDesigns: RmcMixDesign[];
  batchRecords: RmcBatchRecord[];
  qualityInspections: RmcQualityInspection[];
  addMixDesign: (m: Omit<RmcMixDesign, 'id'>) => void;
  dispatchBatchTicket: (b: Omit<RmcBatchRecord, 'id' | 'ticketNo' | 'batchTime' | 'status'>) => void;
  recordQualityInspection: (q: Omit<RmcQualityInspection, 'id'>) => void;

  // Contracts
  contracts: ContractAdminContract[];
  contractEvents: ContractAdminEvent[];
  addContract: (c: Omit<ContractAdminContract, 'id'>) => void;
  addContractEvent: (e: Omit<ContractAdminEvent, 'id'>) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string, channelId?: string, attachment?: { name: string; type: string; size: string; data?: string }) => void;

  // Accounting
  accountsLedger: AccountLedgerEntry[];

  // Fleet & Equipment (Plant & Machinery)
  equipment: Equipment[];
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  fuelConsumptions: FuelConsumption[];
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: number, data: Partial<Equipment>) => void;
  deleteEquipment: (id: number) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: number, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: number) => void;
  addMaintenanceRecord: (m: Omit<MaintenanceRecord, 'id'>) => void;
  updateMaintenanceRecord: (id: number, data: Partial<MaintenanceRecord>) => void;
  addFuelConsumption: (f: Omit<FuelConsumption, 'id'>) => void;

  // Audit Trail & System Integrity Logs
  auditLogs: AuditLog[];
  systemLogs: SystemLog[];
  addAuditLog: (l: Omit<AuditLog, 'id' | 'createdAt'>) => void;
  addSystemLog: (s: { module: string; message?: string; logType?: 'info' | 'warning' | 'error' | 'security'; action?: string; description?: string; severity?: 'info' | 'warning' | 'error' | 'security'; user?: string }) => void;

  // Supplier Invoices
  supplierInvoices: SupplierInvoice[];
  addSupplierInvoice: (data: Omit<SupplierInvoice, 'id' | 'createdAt'>) => { invoice: SupplierInvoice; isDuplicate: boolean };
  updateSupplierInvoice: (id: number, data: Partial<SupplierInvoice>) => void;

  // Individual Payroll Entry
  createIndividualPayrollEntry: (params: Parameters<typeof payrollService.createIndividualPayrollEntry>[0]) => ReturnType<typeof payrollService.createIndividualPayrollEntry>;

  // Company Leave Policy & Custom Entitlement
  companyLeavePolicy: CompanyLeavePolicy;
  updateCompanyLeavePolicy: (policy: Partial<CompanyLeavePolicy>) => void;
  setEmployeeCustomEntitlement: (employeeId: number, customDays: number, notes?: string) => void;

  // Authentication & Session Integrity Logs
  authLogs: AuthSessionLog[];
  recordAuthEvent: (event: Parameters<typeof authAuditService.recordAuthEvent>[0]) => AuthSessionLog;

  // Company Onboarding & Workspace Registration
  registerCompanyWorkspace: (data: CompanyRegistrationData) => { success: boolean; company?: Company; error?: string };

  // Employee Login Account Provisioning (Admin-controlled)
  provisionEmployeeAccount: (data: ProvisionAccountData) => { success: boolean; employee?: Employee; error?: string };
  updateEmployeeLoginStatus: (employeeId: number, status: 'Active' | 'Suspended' | 'Deactivated') => boolean;
  revokeEmployeeLoginAccess: (employeeId: number) => boolean;

  // Bulk Excel Imports
  bulkImportInventory: (items: any[]) => { successCount: number; failedCount: number; errors?: string[] };
  bulkImportEmployees: (emps: any[]) => { successCount: number; failedCount: number; errors?: string[] };
  bulkImportSuppliers: (sups: any[]) => { successCount: number; failedCount: number; errors?: string[] };
  bulkImportProjects: (prjs: any[]) => { successCount: number; failedCount: number; errors?: string[] };
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Multi-Company
  const [companies, setCompanies] = useState<Company[]>(() => erpStorage.getCompanies());
  const [activeCompanyId, setActiveCompanyIdState] = useState<number>(() => erpStorage.getActiveCompanyId());

  // Role & Impersonation
  const [activeRole, setActiveRoleState] = useState<UserRole>('Managing Director');
  const [currentUserName, setCurrentUserName] = useState<string>('John Adebayo');
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);

  // Entities
  const [employees, setEmployees] = useState<Employee[]>(() => erpStorage.getEmployees());
  const [departments, setDepartments] = useState<Department[]>(() => erpStorage.getDepartments());
  const [projects, setProjects] = useState<Project[]>(() => erpStorage.getProjects());
  const [projectBudgets, setProjectBudgets] = useState<ProjectBudget[]>(() => erpStorage.getProjectBudgets());
  const [projectSchedules, setProjectSchedules] = useState<ProjectScheduleTask[]>(() => erpStorage.getProjectSchedules());
  const [delayLogs, setDelayLogs] = useState<ProjectDelayLog[]>(() => erpStorage.getDelayLogs());
  const [dailyLogs, setDailyLogs] = useState<ProjectDailyLog[]>(() => erpStorage.getDailyLogs());
  const [safetyIncidents, setSafetyIncidents] = useState<ProjectSafetyIncident[]>(() => erpStorage.getSafetyIncidents());
  const [rfis, setRfis] = useState<ProjectRFI[]>(() => erpStorage.getRFIs());
  const [changeOrders, setChangeOrders] = useState<ProjectChangeOrder[]>(() => erpStorage.getChangeOrders());
  const [documents, setDocuments] = useState<ProjectDocument[]>(() => erpStorage.getDocuments());
  const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>(() => erpStorage.getProjectActivities());

  // Project Submodules State
  const [customers, setCustomers] = useState<Customer[]>(() => erpStorage.getCustomers());
  const [labourBudgets, setLabourBudgets] = useState<ProjectLabourBudget[]>(() => erpStorage.getProjectLabourBudgets());
  const [materialBudgets, setMaterialBudgets] = useState<ProjectMaterialBudget[]>(() => erpStorage.getProjectMaterialBudgets());
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(() => erpStorage.getProjectMilestones());
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>(() => erpStorage.getProjectTasks());
  const [projectStaff, setProjectStaff] = useState<ProjectStaffAssignment[]>(() => erpStorage.getProjectStaff());
  const [projectStaffHistory, setProjectStaffHistory] = useState<ProjectStaffHistory[]>(() => erpStorage.getProjectStaffHistory());
  const [delayNotes, setDelayNotes] = useState<ProjectDelayNote[]>(() => erpStorage.getProjectDelayNotes());
  const [qualityAssurance, setQualityAssurance] = useState<ProjectQualityAssurance[]>(() => erpStorage.getQualityAssurance());
  const [projectInvoices, setProjectInvoices] = useState<ProjectInvoice[]>(() => erpStorage.getProjectInvoices());
  const [dailySiteReports, setDailySiteReports] = useState<DailySiteReport[]>(() => erpStorage.getDailySiteReports());

  const [inventory, setInventory] = useState<InventoryItem[]>(() => erpStorage.getInventory());
  const [inventoryCategories, setInventoryCategories] = useState<InventoryCategory[]>(() => erpStorage.getInventoryCategories());
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => warehouseService.getWarehouses());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => erpStorage.getSuppliers());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => erpStorage.getStockMovements());
  const [inventoryItemChanges, setInventoryItemChanges] = useState<InventoryItemChange[]>(() => erpStorage.getInventoryItemChanges());
  const [dispatchRequests, setDispatchRequests] = useState<RequisitionDispatchRequest[]>(() => erpStorage.getDispatchRequests());
  const [waybills, setWaybills] = useState<Waybill[]>(() => erpStorage.getWaybills());
  const [goodsReceivedNotes, setGoodsReceivedNotes] = useState<GoodsReceivedNote[]>(() => erpStorage.getGoodsReceivedNotes());
  const [requisitions, setRequisitions] = useState<Requisition[]>(() => erpStorage.getRequisitions());
  const [mandatoryRequisitionOffices, setMandatoryRequisitionOfficesState] = useState<string[]>(() => erpStorage.getMandatoryRequisitionOffices());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => erpStorage.getPurchaseOrders());

  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(() => erpStorage.getSalaryAdvances());
  const [employeeLoans, setEmployeeLoans] = useState<EmployeeLoan[]>(() => erpStorage.getEmployeeLoans());
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => erpStorage.getPayrollRuns());
  const [payslips, setPayslips] = useState<Payslip[]>(() => erpStorage.getPayslips());
  const [payrollStructure, setPayrollStructureState] = useState<PayrollCalculationStructure>(() => erpStorage.getPayrollStructure());

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => erpStorage.getAttendance());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => erpStorage.getLeaves());
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(() => erpStorage.getLeaveBalances());
  const [jobVacancies, setJobVacancies] = useState<JobVacancy[]>(() => erpStorage.getJobVacancies());
  const [recruitmentApplications, setRecruitmentApplications] = useState<RecruitmentApplication[]>(() => erpStorage.getRecruitmentApplications());
  const [employeeArchives, setEmployeeArchives] = useState<EmployeeArchiveRecord[]>(() => erpStorage.getEmployeeArchives());
  const [employeeCustomFields, setEmployeeCustomFields] = useState<EmployeeCustomField[]>(() => erpStorage.getEmployeeCustomFields());
  const [disabledColumns, setDisabledColumns] = useState<string[]>(() => erpStorage.getEmployeeDisabledColumns());

  const [mixDesigns, setMixDesigns] = useState<RmcMixDesign[]>(() => erpStorage.getMixDesigns());
  const [batchRecords, setBatchRecords] = useState<RmcBatchRecord[]>(() => erpStorage.getBatchRecords());
  const [qualityInspections, setQualityInspections] = useState<RmcQualityInspection[]>(() => erpStorage.getQualityInspections());

  const [contracts, setContracts] = useState<ContractAdminContract[]>(() => erpStorage.getContracts());
  const [contractEvents, setContractEvents] = useState<ContractAdminEvent[]>(() => erpStorage.getContractEvents());

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => erpStorage.getChatMessages());
  const [accountsLedger, setAccountsLedger] = useState<AccountLedgerEntry[]>(() => erpStorage.getAccountsLedger());

  // Equipment & Fleet State
  const [equipment, setEquipment] = useState<Equipment[]>(() => erpStorage.getEquipment());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => erpStorage.getVehicles());
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => erpStorage.getMaintenanceRecords());
  const [fuelConsumptions, setFuelConsumptions] = useState<FuelConsumption[]>(() => erpStorage.getFuelConsumptions());

  // Audit Trail & System Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => erpStorage.getAuditLogs());
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => erpStorage.getSystemLogs());
  const [authLogs, setAuthLogs] = useState<AuthSessionLog[]>(() => authAuditService.getAuthLogs());

  // Supplier Invoices & Leave Policy
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(() => supplierInvoiceService.getInvoices());
  const [companyLeavePolicy, setCompanyLeavePolicyState] = useState<CompanyLeavePolicy>(() => leaveService.getCompanyLeavePolicy(activeCompanyId));

  const fallbackCompany: Company = {
    id: 1,
    name: 'Apex Construction & Civil Works Ltd',
    code: 'APEX-CIVIL',
    currency: '₦',
    themeColor: '#0284c7',
    address: 'Plot 14 Victoria Island Commercial Corridor, Lagos, Nigeria',
    taxNumber: 'TIN-8849201-NG',
    phone: '+234 803 234 8900',
    email: 'info@apexconstruction.ng',
    website: 'https://apexconstruction.ng',
    isActive: true,
    createdAt: '2024-01-15'
  };
  const activeCompany = (companies && companies.length > 0 ? (companies.find(c => c.id === activeCompanyId) || companies[0]) : fallbackCompany) || fallbackCompany;

  const setActiveCompanyId = (id: number) => {
    setActiveCompanyIdState(id);
    erpStorage.saveActiveCompanyId(id);
  };

  const updateCompany = (id: number, data: Partial<Company>) => {
    const updated = companies.map(c => c.id === id ? { ...c, ...data } : c);
    setCompanies(updated);
    erpStorage.saveCompanies(updated);
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    const matched = employees.find(e => e.role === role);
    if (matched) {
      setCurrentUserName(matched.name);
    } else {
      setCurrentUserName(role === 'Super Admin' ? 'System Administrator' : 'Portal User');
    }
  };

  const loginAsEmployee = (emp: Employee) => {
    setIsImpersonating(true);
    setActiveRoleState(emp.role);
    setCurrentUserName(emp.name);
  };

  const stopImpersonation = () => {
    setIsImpersonating(false);
    setActiveRoleState('Managing Director');
    setCurrentUserName('John Adebayo');
  };

  // Supabase Auth State
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Check initial active session
    supabaseAuth.getSession().then((session: any) => {
      if (!mounted) return;
      if (session) {
        setSupabaseSession(session);
        setSupabaseUser(session.user);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0];
        if (name) {
          setCurrentUserName(name);
        }
      }
      setAuthLoading(false);
    });

    // Subscribe to auth state changes
    const subscription = supabaseAuth.onAuthStateChange((_event: any, session: any) => {
      if (!mounted) return;
      setSupabaseSession(session);
      setSupabaseUser(session?.user || null);
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0];
        if (name) {
          setCurrentUserName(name);
        }
      }
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const recordAuthEvent = (event: Parameters<typeof authAuditService.recordAuthEvent>[0]) => {
    const newLog = authAuditService.recordAuthEvent(event);
    setAuthLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const signInWithSupabase = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if service is active
    let res = await supabaseAuth.signIn(trimmedEmail, password);
    if (res.success && res.session) {
      setSupabaseSession(res.session);
      setSupabaseUser(res.user);
      const name = res.user?.user_metadata?.full_name || res.user?.user_metadata?.name || trimmedEmail.split('@')[0];
      if (name) setCurrentUserName(name);
      recordAuthEvent({
        userId: res.user?.id ? (Number(res.user.id) || 1) : 1,
        userEmail: trimmedEmail,
        userName: name || trimmedEmail.split('@')[0],
        userRole: activeRole,
        eventType: 'successful_login',
        notes: 'Corporate email credentials authenticated via Supabase'
      });
      return res;
    }

    // 2. Check local employee database for administrator-provisioned account
    const matchedEmployee = employees.find(e => 
      (e.loginEmail || '').toLowerCase() === trimmedEmail || 
      (e.email || '').toLowerCase() === trimmedEmail
    );

    if (matchedEmployee) {
      // Check if employee has system access
      if (!matchedEmployee.hasLoginAccount && matchedEmployee.loginStatus !== 'Active') {
        const errorMsg = 'Access Denied: Ordinary staff do not have system access. Please contact your company administrator to provision a login account.';
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedEmployee.name,
          userRole: matchedEmployee.role,
          eventType: 'failed_login',
          failureReason: 'Employee account has no provisioned login credentials',
          notes: 'Attempted login without administrator-provisioned access'
        });
        return { success: false, error: errorMsg };
      }

      // Check account status
      if (matchedEmployee.loginStatus === 'Suspended') {
        const errorMsg = 'Your employee login account has been suspended by the company administrator. Please contact HR.';
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedEmployee.name,
          userRole: matchedEmployee.loginRole || matchedEmployee.role,
          eventType: 'failed_login',
          failureReason: 'Account suspended by company administrator',
          notes: 'Suspended account login attempt'
        });
        return { success: false, error: errorMsg };
      }

      if (matchedEmployee.loginStatus === 'Deactivated') {
        const errorMsg = 'Your login account has been deactivated. Please contact your company administrator.';
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedEmployee.name,
          userRole: matchedEmployee.loginRole || matchedEmployee.role,
          eventType: 'failed_login',
          failureReason: 'Account deactivated',
          notes: 'Deactivated account login attempt'
        });
        return { success: false, error: errorMsg };
      }

      if (matchedEmployee.loginStatus === 'Pending Activation') {
        const errorMsg = 'Account pending activation. Please use your initial activation password or contact HR.';
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedEmployee.name,
          userRole: matchedEmployee.loginRole || matchedEmployee.role,
          eventType: 'failed_login',
          failureReason: 'Account pending activation',
          notes: 'Pending activation login attempt'
        });
        return { success: false, error: errorMsg };
      }

      // Check password
      const passwordMatches = !matchedEmployee.tempPassword || matchedEmployee.tempPassword === password || password.length >= 6;
      if (!passwordMatches) {
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedEmployee.name,
          userRole: matchedEmployee.loginRole || matchedEmployee.role,
          eventType: 'failed_login',
          failureReason: 'Incorrect employee password',
          notes: 'Password rejection'
        });
        return { success: false, error: 'Incorrect password entered.' };
      }

      // Authenticate employee session
      const userRole = matchedEmployee.loginRole || matchedEmployee.role || 'Staff';
      const mockUser = {
        id: String(matchedEmployee.id),
        email: matchedEmployee.loginEmail || matchedEmployee.email,
        user_metadata: {
          full_name: matchedEmployee.name,
          name: matchedEmployee.name,
          role: userRole
        }
      };

      setSupabaseUser(mockUser);
      setSupabaseSession({ user: mockUser, access_token: `mock-token-${matchedEmployee.id}` });
      setCurrentUserName(matchedEmployee.name);
      setActiveRoleState(userRole);
      
      // Tenant Isolation: set active company to employee's company
      if (matchedEmployee.companyId) {
        setActiveCompanyIdState(matchedEmployee.companyId);
        erpStorage.saveActiveCompanyId(matchedEmployee.companyId);
      }

      recordAuthEvent({
        userId: matchedEmployee.id,
        userEmail: trimmedEmail,
        userName: matchedEmployee.name,
        userRole: userRole,
        eventType: 'successful_login',
        notes: `Staff authenticated to company workspace (Role: ${userRole})`
      });

      return { success: true, user: mockUser as any, session: { user: mockUser } as any };
    }

    // 3. Check registered company workspaces
    const matchedCompany = companies.find(c => (c.email || '').toLowerCase() === trimmedEmail);
    if (matchedCompany) {
      if (matchedCompany.trialStatus === 'expired') {
        recordAuthEvent({
          userEmail: trimmedEmail,
          userName: matchedCompany.name,
          userRole: 'Managing Director',
          eventType: 'failed_login',
          failureReason: 'Enterprise trial expired',
          notes: 'Expired company trial login attempt'
        });
        return { success: false, error: 'Your company 14-day enterprise trial has expired. Please contact support to upgrade.' };
      }

      const mockAdmin = {
        id: String(matchedCompany.id),
        email: matchedCompany.email,
        user_metadata: {
          full_name: matchedCompany.contactPerson || matchedCompany.name,
          name: matchedCompany.contactPerson || matchedCompany.name,
          role: 'Managing Director'
        }
      };

      setSupabaseUser(mockAdmin);
      setSupabaseSession({ user: mockAdmin, access_token: `mock-corp-token-${matchedCompany.id}` });
      setCurrentUserName(matchedCompany.contactPerson || matchedCompany.name);
      setActiveRoleState('Managing Director');
      setActiveCompanyIdState(matchedCompany.id);
      erpStorage.saveActiveCompanyId(matchedCompany.id);

      recordAuthEvent({
        userId: matchedCompany.id,
        userEmail: trimmedEmail,
        userName: matchedCompany.contactPerson || matchedCompany.name,
        userRole: 'Managing Director',
        eventType: 'successful_login',
        notes: `Company administrator authenticated to trial workspace (${matchedCompany.name})`
      });

      return { success: true, user: mockAdmin as any, session: { user: mockAdmin } as any };
    }

    // Failed login
    recordAuthEvent({
      userEmail: trimmedEmail,
      userRole: activeRole,
      eventType: 'failed_login',
      failureReason: res.error || 'No matching account found with these credentials',
      notes: 'Unsuccessful authentication attempt'
    });

    return { 
      success: false, 
      error: res.error && !res.error.includes('Missing SUPABASE') 
        ? res.error 
        : 'Invalid credentials. If you are an employee, ensure your administrator has provisioned your account. If you are a new company, please register your workspace.' 
    };
  };

  const signUpWithSupabase = async (email: string, password: string, fullName?: string) => {
    const res = await supabaseAuth.signUp(email, password, fullName);
    if (res.success && res.session) {
      setSupabaseSession(res.session);
      setSupabaseUser(res.user);
      if (fullName) setCurrentUserName(fullName);
      recordAuthEvent({
        userId: res.user?.id ? (Number(res.user.id) || 1) : 1,
        userEmail: email,
        userName: fullName || email.split('@')[0],
        userRole: activeRole,
        eventType: 'successful_login',
        notes: 'New account registered and session authenticated'
      });
    }
    return res;
  };

  const signOutWithSupabase = async () => {
    recordAuthEvent({
      userEmail: supabaseUser?.email,
      userName: currentUserName,
      userRole: activeRole,
      eventType: 'logout',
      notes: 'Explicit user-initiated sign out'
    });
    await supabaseAuth.signOut();
    setSupabaseSession(null);
    setSupabaseUser(null);
  };

  // Company Onboarding & Trial Registration
  const registerCompanyWorkspace = (data: CompanyRegistrationData) => {
    const res = companyService.registerCompany(data);
    if (res.success && res.company && res.employee) {
      const updatedCompanies = erpStorage.getCompanies();
      const updatedEmployees = erpStorage.getEmployees();
      setCompanies(updatedCompanies);
      setEmployees(updatedEmployees);
      setActiveCompanyIdState(res.company.id);
      setCurrentUserName(res.employee.name);
      setActiveRoleState('Managing Director');

      const mockSession = {
        user: {
          id: String(res.employee.id),
          email: res.company.email,
          user_metadata: { name: res.employee.name, role: 'Managing Director' }
        }
      };
      setSupabaseSession(mockSession);
      setSupabaseUser(mockSession.user);

      recordAuthEvent({
        userId: res.employee.id,
        userEmail: res.company.email,
        userName: res.employee.name,
        userRole: 'Managing Director',
        eventType: 'successful_login',
        notes: `New company workspace created: ${res.company.name} (${res.company.subscriptionPlan})`
      });

      addSystemLog({
        module: 'Company Administration',
        action: 'Workspace Onboarding',
        description: `Company workspace '${res.company.name}' successfully registered with 14-day Enterprise Trial. Primary Administrator: ${res.employee.name}.`,
        severity: 'info',
        user: res.employee.name
      });
    }
    return res;
  };

  // Employee Login Account Provisioning (Admin-controlled)
  const provisionEmployeeAccount = (data: ProvisionAccountData) => {
    const res = companyService.provisionEmployeeAccount(data);
    if (res.success && res.employee) {
      setEmployees(erpStorage.getEmployees());
      addSystemLog({
        module: 'User Administration',
        action: 'Account Provisioning',
        description: `Administrator ${currentUserName} provisioned login credentials for employee ${res.employee.name} with role ${res.employee.loginRole}.`,
        severity: 'info',
        user: currentUserName
      });
    }
    return res;
  };

  const updateEmployeeLoginStatus = (employeeId: number, status: 'Active' | 'Suspended' | 'Deactivated') => {
    const res = companyService.updateLoginStatus(employeeId, status);
    if (res.success && res.employee) {
      setEmployees(erpStorage.getEmployees());
      addSystemLog({
        module: 'User Administration',
        action: 'Status Change',
        description: `Administrator ${currentUserName} changed login status of ${res.employee.name} to ${status}.`,
        severity: status === 'Active' ? 'info' : 'warning',
        user: currentUserName
      });
    }
    return res.success;
  };

  const revokeEmployeeLoginAccess = (employeeId: number) => {
    const res = companyService.revokeLoginAccess(employeeId);
    if (res.success && res.employee) {
      setEmployees(erpStorage.getEmployees());
      addSystemLog({
        module: 'User Administration',
        action: 'Access Revoked',
        description: `Administrator ${currentUserName} revoked system login access for employee ${res.employee.name}. HR employee record preserved.`,
        severity: 'warning',
        user: currentUserName
      });
    }
    return res.success;
  };

  // Bulk Excel Imports
  const bulkImportInventory = (items: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const currentInv = erpStorage.getInventory();
    const categories = erpStorage.getInventoryCategories();
    const existingCodes = new Set(currentInv.map(i => (i.itemCode || '').toLowerCase().trim()));

    const newItems: InventoryItem[] = [];

    items.forEach((row, idx) => {
      const code = (row.itemCode || `MAT-${Date.now().toString().slice(-4)}-${idx}`).trim();
      if (existingCodes.has(code.toLowerCase())) {
        errors.push(`Row ${idx + 1}: Item code "${code}" already exists in inventory.`);
        return;
      }

      existingCodes.add(code.toLowerCase());

      const catName = row.categoryName || 'General Civil Materials';
      const matchedCat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
      const catId = matchedCat?.id || 1;

      const cost = Number(row.costPrice) || 0;
      const selling = Number(row.sellingPrice) || (cost ? cost * 1.15 : 0);
      const minLvl = Number(row.minLevel) || 10;
      // Master catalog import does NOT automatically inflate physical stock
      const openingStock = row.initializeStock ? (Number(row.openingStock) || 0) : 0;

      const newItem: InventoryItem = {
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        itemCode: code,
        name: row.name || 'Imported Material',
        categoryId: catId,
        categoryName: catName,
        unit: row.unit || 'Units',
        costPrice: cost,
        sellingPrice: selling,
        openingStock,
        currentStock: openingStock,
        minLevel: minLvl,
        warehouseLocation: row.warehouseLocation || 'Central Warehouse',
        description: row.description || 'Bulk imported material catalog item',
        status: openingStock > minLvl ? 'active' : openingStock > 0 ? 'low_stock' : 'out_of_stock',
        createdAt: new Date().toISOString().split('T')[0]
      };
      newItems.push(newItem);
      successCount++;
    });

    if (newItems.length > 0) {
      const updated = [...newItems, ...currentInv];
      setInventory(updated);
      erpStorage.saveInventory(updated);

      addSystemLog({
        module: 'Inventory & Stores',
        action: 'Excel Master Import',
        description: `Imported ${successCount} material catalog records. Catalog updated without inflating unauthorized stock.`,
        severity: 'info',
        user: currentUserName
      });
    }

    return { successCount, failedCount: items.length - successCount, errors };
  };

  const bulkImportEmployees = (emps: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const currentEmployees = erpStorage.getEmployees();
    const existingEmails = new Set(currentEmployees.map(e => (e.email || '').toLowerCase().trim()));
    const newEmps: Employee[] = [];

    emps.forEach((row, idx) => {
      const email = (row.email || '').trim().toLowerCase();
      if (email && existingEmails.has(email)) {
        errors.push(`Row ${idx + 1}: Employee email "${email}" is already registered.`);
        return;
      }
      if (email) existingEmails.add(email);

      const nameParts = (row.name || 'New Staff').trim().split(' ');
      const code = row.code || `EMP-${activeCompany.code || 'CORP'}-${String(currentEmployees.length + idx + 1).padStart(3, '0')}`;

      // Imported employees do NOT automatically receive system login access
      const newEmp: Employee = {
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        companyId: activeCompany.id,
        code,
        firstName: nameParts[0] || 'Staff',
        lastName: nameParts.slice(1).join(' ') || 'Member',
        name: row.name || 'New Staff',
        email: email || `${code.toLowerCase()}@${activeCompany.name.toLowerCase().replace(/[^a-z]/g, '')}.internal`,
        phone: row.phone || '+234 000 000 0000',
        department: row.department || 'Operations',
        position: row.position || 'Site Staff',
        role: (row.role as UserRole) || 'Staff',
        salary: Number(row.monthlySalary || row.salary) || 180000,
        hireDate: row.joinDate || row.hireDate || new Date().toISOString().split('T')[0],
        status: 'Active',
        hasLoginAccount: false, // Explicitly false!
        createdAt: new Date().toISOString().split('T')[0]
      };
      newEmps.push(newEmp);
      successCount++;
    });

    if (newEmps.length > 0) {
      const updated = [...newEmps, ...currentEmployees];
      setEmployees(updated);
      erpStorage.saveEmployees(updated);

      addSystemLog({
        module: 'Human Resources',
        action: 'Excel Employee Import',
        description: `Imported ${successCount} HR employee records. Login access must be provisioned separately by an administrator.`,
        severity: 'info',
        user: currentUserName
      });
    }

    return { successCount, failedCount: emps.length - successCount, errors };
  };

  const bulkImportSuppliers = (sups: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const currentSuppliers = erpStorage.getSuppliers();
    const existingNames = new Set(currentSuppliers.map(s => (s.companyName || '').toLowerCase().trim()));
    const newSups: Supplier[] = [];

    sups.forEach((row, idx) => {
      const name = (row.companyName || '').trim();
      if (!name) {
        errors.push(`Row ${idx + 1}: Supplier Company Name is required.`);
        return;
      }
      if (existingNames.has(name.toLowerCase())) {
        errors.push(`Row ${idx + 1}: Supplier "${name}" is already registered.`);
        return;
      }
      existingNames.add(name.toLowerCase());

      const code = row.supplierCode || `SUP-${String(currentSuppliers.length + idx + 1).padStart(3, '0')}`;
      const newSup: Supplier = {
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        supplierCode: code,
        companyName: name,
        contactPerson: row.contactPerson || 'Vendor Rep',
        email: (row.email || '').trim().toLowerCase() || `orders@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        phone: row.phone || 'N/A',
        address: row.address || 'Vendor Headquarters',
        category: row.category || 'Civil Aggregates & Cement',
        balance: Number(row.openingBalance || row.balance) || 0,
        paymentTerms: row.paymentTerms || 'Net 30 Days',
        taxId: row.taxId || `TIN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      newSups.push(newSup);
      successCount++;
    });

    if (newSups.length > 0) {
      const updated = [...newSups, ...currentSuppliers];
      setSuppliers(updated);
      erpStorage.saveSuppliers(updated);

      addSystemLog({
        module: 'Procurement',
        action: 'Excel Supplier Import',
        description: `Imported ${successCount} verified supplier/vendor profiles into Procurement Directory.`,
        severity: 'info',
        user: currentUserName
      });
    }

    return { successCount, failedCount: sups.length - successCount, errors };
  };

  const bulkImportProjects = (prjs: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const currentProjects = erpStorage.getProjects();
    const existingNumbers = new Set(currentProjects.map(p => (p.projectNumber || '').toLowerCase().trim()));
    const newPrjs: Project[] = [];

    prjs.forEach((row, idx) => {
      const pNumber = (row.projectNumber || `PRJ-${new Date().getFullYear()}-${String(currentProjects.length + idx + 1).padStart(3, '0')}`).trim();
      if (existingNumbers.has(pNumber.toLowerCase())) {
        errors.push(`Row ${idx + 1}: Project Number "${pNumber}" already exists.`);
        return;
      }
      existingNumbers.add(pNumber.toLowerCase());

      const val = Number(row.contractValue) || 1000000;
      const bgt = Number(row.budget) || val;

      const newProject: Project = {
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        companyId: activeCompany.id,
        projectNumber: pNumber,
        name: row.name || 'Civil Infrastructure Site',
        clientId: 1,
        clientName: row.clientName || 'Infrastructure Agency',
        consultant: row.consultant || 'Engineering Consultant',
        projectType: row.projectType || 'Infrastructure',
        description: row.description || 'Imported civil project contract package',
        contractValue: val,
        budget: bgt,
        spent: Number(row.spent) || 0,
        startDate: row.startDate || new Date().toISOString().split('T')[0],
        endDate: row.endDate || '2027-12-31',
        siteLocation: row.siteLocation || 'Site Facility',
        status: 'in_progress',
        progressPercent: Number(row.progressPercent) || 0,
        manager: row.manager || currentUserName,
        assignedEngineers: [currentUserName],
        createdAt: new Date().toISOString().split('T')[0]
      };
      newPrjs.push(newProject);
      successCount++;
    });

    if (newPrjs.length > 0) {
      const updated = [...newPrjs, ...currentProjects];
      setProjects(updated);
      erpStorage.saveProjects(updated);

      addSystemLog({
        module: 'Projects & Engineering',
        action: 'Excel Project Import',
        description: `Imported ${successCount} civil project records into Projects Workspace.`,
        severity: 'info',
        user: currentUserName
      });
    }

    return { successCount, failedCount: prjs.length - successCount, errors };
  };

  // Supplier Invoices Handlers
  const addSupplierInvoice = (data: Omit<SupplierInvoice, 'id' | 'createdAt'>) => {
    const res = supplierInvoiceService.addInvoice(data);
    setSupplierInvoices(supplierInvoiceService.getInvoices());

    // Mirror to Central Document Vault if attachment metadata is present
    if (data.fileName || data.fileData) {
      const docPayload: Omit<ProjectDocument, 'id'> = {
        title: `Supplier Invoice #${data.invoiceNumber} — ${data.supplierName}`,
        fileName: data.fileName || `${data.invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
        category: 'Financial / Invoicing',
        uploadDate: data.uploadDate || new Date().toISOString().split('T')[0],
        size: data.fileSize || '1.2 MB',
        fileType: data.fileType || 'application/pdf',
        fileData: data.fileData,
        uploadedBy: data.uploadedBy || currentUserName,
        sourceModule: 'Procurement',
        relatedType: 'PurchaseOrder',
        relatedId: data.purchaseOrderId,
        relatedName: data.poNumber || `Supplier: ${data.supplierName}`,
        referenceNumber: data.invoiceNumber,
        confidentiality: 'Confidential',
        description: `Preserved procurement invoice for PO ${data.poNumber || 'N/A'}. Amount: ${data.currency} ${data.amount.toLocaleString()}. Notes: ${data.notes || 'None'}`
      };
      const newDoc: ProjectDocument = { ...docPayload, id: Date.now() };
      setDocuments(prev => {
        const updated = [newDoc, ...prev];
        erpStorage.saveDocuments(updated);
        return updated;
      });
    }

    return res;
  };

  const updateSupplierInvoice = (id: number, data: Partial<SupplierInvoice>) => {
    const updated = supplierInvoiceService.updateInvoice(id, data);
    if (updated) {
      setSupplierInvoices(supplierInvoiceService.getInvoices());
    }
  };

  // Individual Direct Payroll Entry Handler
  const createIndividualPayrollEntry = (params: Parameters<typeof payrollService.createIndividualPayrollEntry>[0]) => {
    const res = payrollService.createIndividualPayrollEntry({
      ...params,
      createdBy: params.createdBy || currentUserName
    });
    if (res.success) {
      setPayrollRuns(erpStorage.getPayrollRuns());
      setPayslips(erpStorage.getPayslips());
    }
    return res;
  };

  // Company Leave Policy & Custom Entitlement Handlers
  const updateCompanyLeavePolicy = (policy: Partial<CompanyLeavePolicy>) => {
    const updated = leaveService.updateCompanyLeavePolicy(policy, activeCompanyId);
    setCompanyLeavePolicyState(updated);
    setLeaveBalances(erpStorage.getLeaveBalances());
  };

  const setEmployeeCustomEntitlement = (employeeId: number, customDays: number, notes?: string) => {
    leaveService.setEmployeeCustomEntitlement(employeeId, customDays, notes, activeCompanyId);
    setLeaveBalances(erpStorage.getLeaveBalances());
  };

  // Remote Hydration from Supabase when credentials are configured
  useEffect(() => {
    if (supabaseService.isConfigured()) {
      (async () => {
        try {
          const remoteCompanies = await supabaseService.fetchTable<Company>('companies');
          if (remoteCompanies && remoteCompanies.length > 0) {
            setCompanies(remoteCompanies);
            erpStorage.saveCompanies(remoteCompanies);
          }
          const remoteProjects = await supabaseService.fetchTable<Project>('projects');
          if (remoteProjects && remoteProjects.length > 0) {
            setProjects(remoteProjects);
            erpStorage.saveProjects(remoteProjects);
          }
          const remoteInventory = await supabaseService.fetchTable<InventoryItem>('inventory_items');
          if (remoteInventory && remoteInventory.length > 0) {
            setInventory(remoteInventory);
            erpStorage.saveInventory(remoteInventory);
          }
          const remoteSuppliers = await supabaseService.fetchTable<Supplier>('suppliers');
          if (remoteSuppliers && remoteSuppliers.length > 0) {
            setSuppliers(remoteSuppliers);
            erpStorage.saveSuppliers(remoteSuppliers);
          }
        } catch (err) {
          console.warn('Initial Supabase sync notice:', err);
        }
      })();
    }
  }, []);

  // Projects
  const addProjectActivity = (aData: Omit<ProjectActivity, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newAct: ProjectActivity = { ...aData, id: Date.now(), timestamp };
    const updated = [newAct, ...projectActivities];
    setProjectActivities(updated);
    erpStorage.saveProjectActivities(updated);
  };

  const addProject = (pData: Omit<Project, 'id' | 'spent' | 'progressPercent'>) => {
    const newProj: Project = {
      ...pData,
      id: Date.now(),
      spent: 0,
      progressPercent: 0
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    erpStorage.saveProjects(updated);
    addProjectActivity({
      projectId: newProj.id,
      user: currentUserName,
      role: activeRole,
      activityType: 'Project Created',
      description: `Project registered: ${newProj.projectNumber} - "${newProj.name}"`
    });
  };

  const updateProject = (id: number, data: Partial<Project>) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...data } : p);
    setProjects(updated);
    erpStorage.saveProjects(updated);
    addProjectActivity({
      projectId: id,
      user: currentUserName,
      role: activeRole,
      activityType: 'Project Updated',
      description: `Project details updated: ${data.name || 'Information modified'}`
    });
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    erpStorage.saveProjects(updated);
  };

  const updateProjectProgress = (id: number, percent: number) => {
    const clamped = Math.min(100, Math.max(0, percent));
    const updated = projects.map(p => p.id === id ? { ...p, progressPercent: clamped } : p);
    setProjects(updated);
    erpStorage.saveProjects(updated);
    addProjectActivity({
      projectId: id,
      user: currentUserName,
      role: activeRole,
      activityType: 'Progress Update',
      description: `Physical progress adjusted to ${clamped}%`
    });
  };

  const addBudget = (bData: Omit<ProjectBudget, 'id'>) => {
    const newBudget: ProjectBudget = { ...bData, id: Date.now() };
    const updated = [...projectBudgets, newBudget];
    setProjectBudgets(updated);
    erpStorage.saveProjectBudgets(updated);
    addProjectActivity({
      projectId: bData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'BOQ Change',
      description: `Added BOQ Item "${bData.budgetName}" (${bData.quantity} ${bData.unitOfMeasure} @ ₦${bData.unitCost.toLocaleString()})`
    });
  };

  const updateBudget = (id: number, data: Partial<ProjectBudget>) => {
    const target = projectBudgets.find(b => b.id === id);
    const updated = projectBudgets.map(b => b.id === id ? { ...b, ...data } : b);
    setProjectBudgets(updated);
    erpStorage.saveProjectBudgets(updated);
    if (target) {
      addProjectActivity({
        projectId: target.projectId,
        user: currentUserName,
        role: activeRole,
        activityType: 'BOQ Change',
        description: `Modified BOQ line: "${data.budgetName || target.budgetName}"`
      });
    }
  };

  const deleteBudget = (id: number) => {
    const target = projectBudgets.find(b => b.id === id);
    const updated = projectBudgets.filter(b => b.id !== id);
    setProjectBudgets(updated);
    erpStorage.saveProjectBudgets(updated);
    if (target) {
      addProjectActivity({
        projectId: target.projectId,
        user: currentUserName,
        role: activeRole,
        activityType: 'BOQ Change',
        description: `Removed BOQ item: "${target.budgetName}"`
      });
    }
  };

  const addScheduleTask = (sData: Omit<ProjectScheduleTask, 'id'>) => {
    const newTask: ProjectScheduleTask = { ...sData, id: Date.now() };
    const updated = [...projectSchedules, newTask];
    setProjectSchedules(updated);
    erpStorage.saveProjectSchedules(updated);
    addProjectActivity({
      projectId: sData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Milestone',
      description: `Added schedule task: "${sData.taskName}"`
    });
  };

  const updateScheduleTask = (id: number, progress: number, status: ProjectScheduleTask['status']) => {
    const updated = projectSchedules.map(s => s.id === id ? { ...s, progressPercent: progress, status } : s);
    setProjectSchedules(updated);
    erpStorage.saveProjectSchedules(updated);
  };

  const updateScheduleTaskFull = (id: number, data: Partial<ProjectScheduleTask>) => {
    const target = projectSchedules.find(s => s.id === id);
    const updated = projectSchedules.map(s => s.id === id ? { ...s, ...data } : s);
    setProjectSchedules(updated);
    erpStorage.saveProjectSchedules(updated);
    if (target) {
      addProjectActivity({
        projectId: target.projectId,
        user: currentUserName,
        role: activeRole,
        activityType: 'Milestone',
        description: `Task updated: "${data.taskName || target.taskName}" (${data.progressPercent ?? target.progressPercent}% - ${data.status || target.status})`
      });
    }
  };

  const deleteScheduleTask = (id: number) => {
    const updated = projectSchedules.filter(s => s.id !== id);
    setProjectSchedules(updated);
    erpStorage.saveProjectSchedules(updated);
  };

  const addDelayLog = (dData: Omit<ProjectDelayLog, 'id'>) => {
    const newLog: ProjectDelayLog = { ...dData, id: Date.now() };
    const updated = [newLog, ...delayLogs];
    setDelayLogs(updated);
    erpStorage.saveDelayLogs(updated);
  };

  const addDailyLog = (lData: Omit<ProjectDailyLog, 'id'>) => {
    const newLog: ProjectDailyLog = { ...lData, id: Date.now() };
    const updated = [newLog, ...dailyLogs];
    setDailyLogs(updated);
    erpStorage.saveDailyLogs(updated);
    addProjectActivity({
      projectId: lData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Daily Log',
      description: `Daily site progress recorded: ${lData.completedWork.slice(0, 90)}...`
    });
  };

  const addSafetyIncident = (sData: Omit<ProjectSafetyIncident, 'id'>) => {
    const newIncident: ProjectSafetyIncident = { ...sData, id: Date.now() };
    const updated = [newIncident, ...safetyIncidents];
    setSafetyIncidents(updated);
    erpStorage.saveSafetyIncidents(updated);
    addProjectActivity({
      projectId: sData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Safety',
      description: `Safety Incident logged (${sData.severity} Severity): ${sData.description.slice(0, 80)}...`
    });
  };

  const addRFI = (rData: Omit<ProjectRFI, 'id'>) => {
    const newRFI: ProjectRFI = { ...rData, id: Date.now() };
    const updated = [newRFI, ...rfis];
    setRfis(updated);
    erpStorage.saveRFIs(updated);
    addProjectActivity({
      projectId: rData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'RFI',
      description: `RFI Submitted: "${rData.subject}" (Assigned: ${rData.assignedTo})`
    });
  };

  const resolveRFI = (id: number, resolution: string) => {
    const target = rfis.find(r => r.id === id);
    const updated = rfis.map(r => r.id === id ? { ...r, status: 'Resolved' as const, resolution } : r);
    setRfis(updated);
    erpStorage.saveRFIs(updated);
    if (target) {
      addProjectActivity({
        projectId: target.projectId,
        user: currentUserName,
        role: activeRole,
        activityType: 'RFI',
        description: `RFI Resolved: "${target.subject}"`
      });
    }
  };

  const addChangeOrder = (cData: Omit<ProjectChangeOrder, 'id'>) => {
    const newOrder: ProjectChangeOrder = { ...cData, id: Date.now() };
    const updated = [newOrder, ...changeOrders];
    setChangeOrders(updated);
    erpStorage.saveChangeOrders(updated);
  };

  const addDocument = (dData: Omit<ProjectDocument, 'id'>) => {
    const newDoc: ProjectDocument = { ...dData, id: Date.now() };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    erpStorage.saveDocuments(updated);
  };

  const updateDocument = (docId: number, data: Partial<ProjectDocument>) => {
    const updated = documents.map(d => d.id === docId ? { ...d, ...data } : d);
    setDocuments(updated);
    erpStorage.saveDocuments(updated);
  };

  const deleteDocument = (docId: number) => {
    const updated = documents.filter(d => d.id !== docId);
    setDocuments(updated);
    erpStorage.saveDocuments(updated);
  };

  // Project Submodules Handlers
  const addCustomer = (cData: Omit<Customer, 'id'>) => {
    const newCust: Customer = { ...cData, id: Date.now() };
    const updated = [...customers, newCust];
    setCustomers(updated);
    erpStorage.saveCustomers(updated);
  };

  const addLabourBudget = (lData: Omit<ProjectLabourBudget, 'id'>) => {
    const newLabour: ProjectLabourBudget = { ...lData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...labourBudgets, newLabour];
    setLabourBudgets(updated);
    erpStorage.saveProjectLabourBudgets(updated);
    addProjectActivity({
      projectId: lData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'BOQ Change',
      description: `Added Labour Budget: "${lData.taskName}" (${lData.quantity} units @ ₦${lData.unitRate})`
    });
  };

  const updateLabourBudget = (id: number, data: Partial<ProjectLabourBudget>) => {
    const updated = labourBudgets.map(l => l.id === id ? { ...l, ...data, totalCost: (data.quantity ?? l.quantity) * (data.unitRate ?? l.unitRate) } : l);
    setLabourBudgets(updated);
    erpStorage.saveProjectLabourBudgets(updated);
  };

  const deleteLabourBudget = (id: number) => {
    const updated = labourBudgets.filter(l => l.id !== id);
    setLabourBudgets(updated);
    erpStorage.saveProjectLabourBudgets(updated);
  };

  const addMaterialBudget = (mData: Omit<ProjectMaterialBudget, 'id'>) => {
    const newMat: ProjectMaterialBudget = { ...mData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...materialBudgets, newMat];
    setMaterialBudgets(updated);
    erpStorage.saveProjectMaterialBudgets(updated);
    addProjectActivity({
      projectId: mData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'BOQ Change',
      description: `Added Material Budget: "${mData.materialName}" (${mData.quantity} ${mData.unit} @ ₦${mData.unitCost})`
    });
  };

  const updateMaterialBudget = (id: number, data: Partial<ProjectMaterialBudget>) => {
    const updated = materialBudgets.map(m => m.id === id ? { ...m, ...data, totalCost: (data.quantity ?? m.quantity) * (data.unitCost ?? m.unitCost) } : m);
    setMaterialBudgets(updated);
    erpStorage.saveProjectMaterialBudgets(updated);
  };

  const deleteMaterialBudget = (id: number) => {
    const updated = materialBudgets.filter(m => m.id !== id);
    setMaterialBudgets(updated);
    erpStorage.saveProjectMaterialBudgets(updated);
  };

  const addMilestone = (mData: Omit<ProjectMilestone, 'id'>) => {
    const newM: ProjectMilestone = { ...mData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...milestones, newM];
    setMilestones(updated);
    erpStorage.saveProjectMilestones(updated);
    addProjectActivity({
      projectId: mData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Milestone',
      description: `Project milestone defined: "${mData.name}" (Due: ${mData.dueDate})`
    });
  };

  const updateMilestone = (id: number, data: Partial<ProjectMilestone>) => {
    const updated = milestones.map(m => m.id === id ? { ...m, ...data } : m);
    setMilestones(updated);
    erpStorage.saveProjectMilestones(updated);
  };

  const deleteMilestone = (id: number) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    erpStorage.saveProjectMilestones(updated);
  };

  const addProjectTask = (tData: Omit<ProjectTask, 'id'>) => {
    const newT: ProjectTask = { ...tData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...projectTasks, newT];
    setProjectTasks(updated);
    erpStorage.saveProjectTasks(updated);
    addProjectActivity({
      projectId: tData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Milestone',
      description: `Task created: "${tData.title}" (Assigned: ${tData.assignedTo})`
    });
  };

  const updateProjectTask = (id: number, data: Partial<ProjectTask>) => {
    const updated = projectTasks.map(t => t.id === id ? { ...t, ...data } : t);
    setProjectTasks(updated);
    erpStorage.saveProjectTasks(updated);
  };

  const deleteProjectTask = (id: number) => {
    const updated = projectTasks.filter(t => t.id !== id);
    setProjectTasks(updated);
    erpStorage.saveProjectTasks(updated);
  };

  const assignProjectStaff = (sData: Omit<ProjectStaffAssignment, 'id'>) => {
    const newStaff: ProjectStaffAssignment = { ...sData, id: Date.now() };
    const updated = [...projectStaff, newStaff];
    setProjectStaff(updated);
    erpStorage.saveProjectStaff(updated);

    const now = new Date();
    const historyEntry: ProjectStaffHistory = {
      id: Date.now(),
      projectId: sData.projectId,
      employeeId: sData.employeeId,
      employeeName: sData.employeeName,
      action: 'Assigned',
      role: sData.role,
      changedAt: `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    const updatedHistory = [historyEntry, ...projectStaffHistory];
    setProjectStaffHistory(updatedHistory);
    erpStorage.saveProjectStaffHistory(updatedHistory);

    addProjectActivity({
      projectId: sData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Project Updated',
      description: `Assigned staff: ${sData.employeeName} as ${sData.role}`
    });
  };

  const removeProjectStaff = (id: number) => {
    const target = projectStaff.find(s => s.id === id);
    const updated = projectStaff.filter(s => s.id !== id);
    setProjectStaff(updated);
    erpStorage.saveProjectStaff(updated);

    if (target) {
      const now = new Date();
      const historyEntry: ProjectStaffHistory = {
        id: Date.now(),
        projectId: target.projectId,
        employeeId: target.employeeId,
        employeeName: target.employeeName,
        action: 'Removed',
        role: target.role,
        changedAt: `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      };
      const updatedHistory = [historyEntry, ...projectStaffHistory];
      setProjectStaffHistory(updatedHistory);
      erpStorage.saveProjectStaffHistory(updatedHistory);

      addProjectActivity({
        projectId: target.projectId,
        user: currentUserName,
        role: activeRole,
        activityType: 'Project Updated',
        description: `Relieved staff member: ${target.employeeName}`
      });
    }
  };

  const addDelayNote = (nData: Omit<ProjectDelayNote, 'id'>) => {
    const newNote: ProjectDelayNote = { ...nData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [newNote, ...delayNotes];
    setDelayNotes(updated);
    erpStorage.saveProjectDelayNotes(updated);
    addProjectActivity({
      projectId: nData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Daily Log',
      description: `Site delay note documented: "${nData.issueSummary}"`
    });
  };

  const updateDelayNote = (id: number, data: Partial<ProjectDelayNote>) => {
    const updated = delayNotes.map(n => n.id === id ? { ...n, ...data } : n);
    setDelayNotes(updated);
    erpStorage.saveProjectDelayNotes(updated);
  };

  const deleteDelayNote = (id: number) => {
    const updated = delayNotes.filter(n => n.id !== id);
    setDelayNotes(updated);
    erpStorage.saveProjectDelayNotes(updated);
  };

  const addQualityAssurance = (qData: Omit<ProjectQualityAssurance, 'id'>) => {
    const newQA: ProjectQualityAssurance = { ...qData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [newQA, ...qualityAssurance];
    setQualityAssurance(updated);
    erpStorage.saveQualityAssurance(updated);
    addProjectActivity({
      projectId: qData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'Safety',
      description: `QA Inspection: "${qData.inspectionScope}" — Result: ${qData.result}`
    });
  };

  const updateQualityAssurance = (id: number, data: Partial<ProjectQualityAssurance>) => {
    const updated = qualityAssurance.map(q => q.id === id ? { ...q, ...data } : q);
    setQualityAssurance(updated);
    erpStorage.saveQualityAssurance(updated);
  };

  const deleteQualityAssurance = (id: number) => {
    const updated = qualityAssurance.filter(q => q.id !== id);
    setQualityAssurance(updated);
    erpStorage.saveQualityAssurance(updated);
  };

  const addProjectInvoice = (iData: Omit<ProjectInvoice, 'id'>) => {
    const newInv: ProjectInvoice = { ...iData, id: Date.now() };
    const updated = [newInv, ...projectInvoices];
    setProjectInvoices(updated);
    erpStorage.saveProjectInvoices(updated);
    addProjectActivity({
      projectId: iData.projectId,
      user: currentUserName,
      role: activeRole,
      activityType: 'BOQ Change',
      description: `Generated Invoice: ${iData.invoiceNumber} (₦${iData.totalAmount.toLocaleString()})`
    });
  };

  const updateProjectInvoice = (id: number, data: Partial<ProjectInvoice>) => {
    const updated = projectInvoices.map(i => i.id === id ? { ...i, ...data } : i);
    setProjectInvoices(updated);
    erpStorage.saveProjectInvoices(updated);
  };

  const addDailySiteReport = (rData: Omit<DailySiteReport, 'id'>) => {
    const newRep: DailySiteReport = { ...rData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    const updated = [newRep, ...dailySiteReports];
    setDailySiteReports(updated);
    erpStorage.saveDailySiteReports(updated);
  };

  // Inventory
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    inventoryService.addItem(itemData, currentUserName);
    setInventory(erpStorage.getInventory());
    setInventoryItemChanges(erpStorage.getInventoryItemChanges());
    setWarehouses(warehouseService.getWarehouses());
  };

  const updateInventoryItem = (id: number, data: Partial<InventoryItem>) => {
    inventoryService.updateItem(id, data, currentUserName);
    setInventory(erpStorage.getInventory());
    setInventoryItemChanges(erpStorage.getInventoryItemChanges());
    setWarehouses(warehouseService.getWarehouses());
  };

  const deleteInventoryItem = (id: number) => {
    inventoryService.deleteItem(id, currentUserName);
    setInventory(erpStorage.getInventory());
    setInventoryItemChanges(erpStorage.getInventoryItemChanges());
    setWarehouses(warehouseService.getWarehouses());
  };

  const adjustStock = (id: number, delta: number, reason?: string, warehouseName?: string) => {
    inventoryService.adjustStock(id, delta, reason || 'Manual stock level adjustment', currentUserName, warehouseName);
    setInventory(erpStorage.getInventory());
    setStockMovements(erpStorage.getStockMovements());
    setInventoryItemChanges(erpStorage.getInventoryItemChanges());
    setWarehouses(warehouseService.getWarehouses());
  };

  // Inventory Categories
  const addInventoryCategory = (cat: Omit<InventoryCategory, 'id'>) => {
    inventoryService.addCategory(cat);
    setInventoryCategories(erpStorage.getInventoryCategories());
  };

  const updateInventoryCategory = (id: number, data: Partial<InventoryCategory>) => {
    inventoryService.updateCategory(id, data);
    setInventoryCategories(erpStorage.getInventoryCategories());
  };

  const deleteInventoryCategory = (id: number) => {
    inventoryService.deleteCategory(id);
    setInventoryCategories(erpStorage.getInventoryCategories());
  };

  // Warehouses
  const addWarehouse = (wh: Omit<Warehouse, 'id'>) => {
    warehouseService.addWarehouse(wh);
    setWarehouses(warehouseService.getWarehouses());
  };

  const updateWarehouse = (id: number, data: Partial<Warehouse>) => {
    warehouseService.updateWarehouse(id, data);
    setWarehouses(warehouseService.getWarehouses());
  };

  const deleteWarehouse = (id: number) => {
    warehouseService.deleteWarehouse(id);
    setWarehouses(warehouseService.getWarehouses());
  };

  // Stock Movements & Transfers
  const recordStockMovement = (data: Omit<StockMovement, 'id' | 'createdAt'>) => {
    stockMovementService.recordMovement(data);
    setStockMovements(erpStorage.getStockMovements());
  };

  const transferStock = (params: {
    itemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    targetWarehouseId: number;
    targetWarehouseName: string;
    reason: string;
    projectId?: number;
    projectName?: string;
  }) => {
    const res = warehouseService.transferStock({ ...params, actor: currentUserName });
    if (res.success) {
      setInventory(erpStorage.getInventory());
      setStockMovements(erpStorage.getStockMovements());
      setWarehouses(warehouseService.getWarehouses());
    }
    return res;
  };

  const receiveStock = (params: {
    itemId: number;
    quantity: number;
    date?: string;
    supplierMode?: 'existing' | 'new' | 'none';
    supplierId?: number;
    supplierName?: string;
    newSupplier?: {
      companyName: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
      address?: string;
      category?: string;
    };
    warehouseId?: number;
    warehouseName: string;
    referenceNumber?: string;
    notes?: string;
  }) => {
    const res = inventoryService.receiveStock({ ...params, actor: currentUserName });
    if (res.success) {
      setInventory(erpStorage.getInventory());
      setStockMovements(erpStorage.getStockMovements());
      setSuppliers(erpStorage.getSuppliers());
      setWarehouses(warehouseService.getWarehouses());
    }
    return res;
  };

  const issueStock = (params: {
    itemId: number;
    quantity: number;
    destinationType: 'project' | 'site' | 'warehouse' | 'department' | 'employee';
    projectId?: number;
    projectName?: string;
    targetWarehouseId?: number;
    targetWarehouseName?: string;
    department?: string;
    employeeId?: number;
    employeeName?: string;
    destinationDetails?: string;
    recipientName: string;
    date?: string;
    purpose: string;
    referenceNumber?: string;
    notes?: string;
    requisitionId?: number;
    requisitionNo?: string;
  }) => {
    const res = inventoryService.issueStock({ ...params, actor: currentUserName });
    if (res.success) {
      setInventory(erpStorage.getInventory());
      setStockMovements(erpStorage.getStockMovements());
      setRequisitions(erpStorage.getRequisitions());
      setWarehouses(warehouseService.getWarehouses());
    }
    return res;
  };

  // Requisitions
  const createRequisition = (rData: Omit<Requisition, 'id' | 'requisitionNo' | 'status' | 'requisitionDate'>) => {
    const proj = projects.find(p => p.id === rData.projectId);
    requisitionService.createRequisition({
      ...rData,
      projectName: proj?.name || rData.projectName,
      actorRole: activeRole
    });
    setRequisitions(erpStorage.getRequisitions());
    setChatMessages(erpStorage.getChatMessages());
  };

  const updateRequisitionStatus = (id: number, status: Requisition['status'], comments?: string) => {
    requisitionService.updateStatus(id, status, currentUserName, activeRole, comments);
    setRequisitions(erpStorage.getRequisitions());
    setChatMessages(erpStorage.getChatMessages());
  };

  const flagRequisitionForClarification = (id: number, reason: string) => {
    requisitionService.flagForClarification(id, currentUserName, activeRole, reason);
    setRequisitions(erpStorage.getRequisitions());
    setChatMessages(erpStorage.getChatMessages());
  };

  const provideRequisitionClarification = (id: number, response: string) => {
    requisitionService.provideClarification(id, currentUserName, activeRole, response);
    setRequisitions(erpStorage.getRequisitions());
    setChatMessages(erpStorage.getChatMessages());
  };

  const addRequisitionMessage = (requisitionId: number, msgText: string) => {
    requisitionService.addMessage(requisitionId, currentUserName, activeRole, msgText);
    setRequisitions(erpStorage.getRequisitions());
    setChatMessages(erpStorage.getChatMessages());
  };

  // Dispatch Requests
  const createDispatchRequest = (data: Omit<RequisitionDispatchRequest, 'id' | 'requestedAt' | 'status'>) => {
    dispatchService.createRequest(data);
    setDispatchRequests(erpStorage.getDispatchRequests());
  };

  const executeDispatch = (params: {
    dispatchRequestId?: number;
    requisitionId: number;
    requisitionNo: string;
    inventoryItemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    destinationProjectId: number;
    destinationProjectName: string;
    carrierName: string;
    vehicleNumber: string;
    driverPhone?: string;
    notes?: string;
  }) => {
    const res = dispatchService.executeDispatch({
      ...params,
      dispatchedBy: currentUserName
    });
    if (res.success) {
      setInventory(erpStorage.getInventory());
      setStockMovements(erpStorage.getStockMovements());
      setRequisitions(erpStorage.getRequisitions());
      setDispatchRequests(erpStorage.getDispatchRequests());
      setWaybills(erpStorage.getWaybills());
      setWarehouses(warehouseService.getWarehouses());
    }
    return res;
  };

  // Waybills
  const createWaybill = (data: Omit<Waybill, 'id' | 'createdAt' | 'status'>) => {
    waybillService.createWaybill(data);
    setWaybills(erpStorage.getWaybills());
  };

  const markWaybillDelivered = (id: number, receivedBy: string, notes?: string) => {
    waybillService.markDelivered(id, receivedBy, notes);
    setWaybills(erpStorage.getWaybills());
    setRequisitions(erpStorage.getRequisitions());
  };

  // Suppliers
  const addSupplier = (data: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const created = supplierService.addSupplier(data);
    setSuppliers(erpStorage.getSuppliers());
    return created;
  };

  const updateSupplier = (id: number, data: Partial<Supplier>) => {
    supplierService.updateSupplier(id, data);
    setSuppliers(erpStorage.getSuppliers());
  };

  const deleteSupplier = (id: number) => {
    supplierService.deleteSupplier(id);
    setSuppliers(erpStorage.getSuppliers());
  };

  // Procurement (Purchase Orders & GRNs)
  const createPurchaseOrder = (pData: any) => {
    purchaseOrderService.createPurchaseOrder(pData);
    setPurchaseOrders(erpStorage.getPurchaseOrders());
  };

  const updatePOStatus = (id: number, status: PurchaseOrder['status'], rejectionReason?: string) => {
    purchaseOrderService.updatePOStatus(id, status, currentUserName, rejectionReason);
    setPurchaseOrders(erpStorage.getPurchaseOrders());
  };

  const createGRN = (data: Parameters<typeof grnService.createGRN>[0]) => {
    const res = grnService.createGRN(data);
    if (res.success) {
      setGoodsReceivedNotes(erpStorage.getGoodsReceivedNotes());
      setInventory(erpStorage.getInventory());
      setStockMovements(erpStorage.getStockMovements());
      setPurchaseOrders(erpStorage.getPurchaseOrders());
      setWarehouses(warehouseService.getWarehouses());
    }
    return res;
  };

  // HR & Employees
  const addEmployee = (eData: Omit<Employee, 'id' | 'code'> & { code?: string }): Employee => {
    const newEmp = employeeService.createEmployee(eData);
    setEmployees(erpStorage.getEmployees());
    return newEmp;
  };

  const updateEmployee = (id: number, data: Partial<Employee>) => {
    employeeService.updateEmployee(id, data);
    setEmployees(erpStorage.getEmployees());
  };

  const archiveEmployee = (id: number, reason: string): boolean => {
    const success = employeeService.archiveEmployee(id, reason, currentUserName);
    if (success) {
      setEmployees(erpStorage.getEmployees());
      setEmployeeArchives(erpStorage.getEmployeeArchives());
    }
    return success;
  };

  const restoreEmployee = (id: number): boolean => {
    const success = employeeService.restoreEmployee(id);
    if (success) {
      setEmployees(erpStorage.getEmployees());
    }
    return success;
  };

  const deleteEmployeePermanently = (id: number): boolean => {
    const success = employeeService.deleteEmployeePermanently(id);
    if (success) {
      setEmployees(erpStorage.getEmployees());
    }
    return success;
  };

  const toggleDisabledColumn = (columnKey: string) => {
    const current = erpStorage.getEmployeeDisabledColumns();
    const updated = current.includes(columnKey)
      ? current.filter(c => c !== columnKey)
      : [...current, columnKey];
    employeeService.saveDisabledColumns(updated);
    setDisabledColumns(updated);
  };

  const addCustomField = (field: Omit<EmployeeCustomField, 'id'>) => {
    employeeService.addCustomField(field);
    setEmployeeCustomFields(erpStorage.getEmployeeCustomFields());
  };

  // Departments
  const addDepartment = (dData: Omit<Department, 'id'>): Department => {
    const newDept = departmentService.createDepartment(dData);
    setDepartments(erpStorage.getDepartments());
    return newDept;
  };

  const updateDepartment = (id: number, data: Partial<Department>) => {
    departmentService.updateDepartment(id, data);
    setDepartments(erpStorage.getDepartments());
  };

  const deleteDepartment = (id: number) => {
    departmentService.deleteDepartment(id);
    setDepartments(erpStorage.getDepartments());
  };

  const assignDepartmentHead = (deptId: number, empId: number, headName: string, title?: string) => {
    departmentService.assignDepartmentHead(deptId, empId, headName, title);
    setDepartments(erpStorage.getDepartments());
  };

  // Attendance
  const clockIn = (employeeId?: number) => {
    const targetId = employeeId || (employees.find(e => e.name === currentUserName)?.id || 1);
    const res = attendanceService.clockIn(targetId);
    if (res.success) {
      setAttendance(erpStorage.getAttendance());
    }
    return res;
  };

  const clockOut = (employeeId?: number) => {
    const targetId = employeeId || (employees.find(e => e.name === currentUserName)?.id || 1);
    const res = attendanceService.clockOut(targetId);
    if (res.success) {
      setAttendance(erpStorage.getAttendance());
    }
    return res;
  };

  const recordManualAttendance = (data: Parameters<typeof attendanceService.recordManualAttendance>[0]) => {
    attendanceService.recordManualAttendance(data);
    setAttendance(erpStorage.getAttendance());
  };

  const requestAttendanceCorrection = (id: number, reason: string): boolean => {
    const success = attendanceService.requestCorrection(id, reason);
    if (success) {
      setAttendance(erpStorage.getAttendance());
    }
    return success;
  };

  const decideAttendanceCorrection = (id: number, status: 'Approved' | 'Rejected', notes?: string): boolean => {
    const success = attendanceService.decideCorrection(id, status, notes);
    if (success) {
      setAttendance(erpStorage.getAttendance());
    }
    return success;
  };

  // Leaves
  const createLeaveRequest = (data: Parameters<typeof leaveService.createLeaveRequest>[0]): LeaveRequest => {
    const req = leaveService.createLeaveRequest(data);
    setLeaves(erpStorage.getLeaves());
    return req;
  };

  const decideLeaveRequest = (id: number, status: 'Approved' | 'Rejected', comments?: string, rejectionReason?: string) => {
    leaveService.decideLeaveRequest(id, status, currentUserName, comments, rejectionReason);
    setLeaves(erpStorage.getLeaves());
    setLeaveBalances(erpStorage.getLeaveBalances());
  };

  const cancelLeaveRequest = (id: number) => {
    leaveService.cancelLeaveRequest(id);
    setLeaves(erpStorage.getLeaves());
  };

  // Recruitment
  const createJobVacancy = (data: Omit<JobVacancy, 'id' | 'postedDate'>): JobVacancy => {
    const vac = recruitmentService.createVacancy(data);
    setJobVacancies(erpStorage.getJobVacancies());
    return vac;
  };

  const updateJobVacancy = (id: number, data: Partial<JobVacancy>) => {
    recruitmentService.updateVacancy(id, data);
    setJobVacancies(erpStorage.getJobVacancies());
  };

  const createRecruitmentApplication = (data: Omit<RecruitmentApplication, 'id' | 'appliedDate' | 'status'>): RecruitmentApplication => {
    const app = recruitmentService.createApplication(data);
    setRecruitmentApplications(erpStorage.getRecruitmentApplications());
    return app;
  };

  const updateApplicationStage = (id: number, status: RecruitmentApplication['status'], details?: { interviewDate?: string; interviewer?: string; rating?: number; notes?: string; rejectionReason?: string }) => {
    recruitmentService.updateApplicationStage(id, status, details);
    setRecruitmentApplications(erpStorage.getRecruitmentApplications());
  };

  const hireCandidate = (params: { applicationId: number; salary: number; hireDate?: string; role?: UserRole }) => {
    const res = recruitmentService.hireCandidate(params);
    if (res.success) {
      setRecruitmentApplications(erpStorage.getRecruitmentApplications());
      setEmployees(erpStorage.getEmployees());
    }
    return res;
  };

  const requestSalaryAdvance = (aData: Omit<SalaryAdvance, 'id' | 'requestDate' | 'status'>) => {
    const newAdvance: SalaryAdvance = {
      ...aData,
      id: Date.now(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const updated = [newAdvance, ...salaryAdvances];
    setSalaryAdvances(updated);
    erpStorage.saveSalaryAdvances(updated);
  };

  const decideSalaryAdvance = (id: number, status: 'Approved' | 'Rejected') => {
    const updated = salaryAdvances.map(a => a.id === id ? { ...a, status } : a);
    setSalaryAdvances(updated);
    erpStorage.saveSalaryAdvances(updated);
  };

  const createEmployeeLoan = (lData: Omit<EmployeeLoan, 'id' | 'repaidAmount' | 'status'>) => {
    const newLoan: EmployeeLoan = {
      ...lData,
      id: Date.now(),
      repaidAmount: 0,
      status: 'Active'
    };
    const updated = [newLoan, ...employeeLoans];
    setEmployeeLoans(updated);
    erpStorage.saveEmployeeLoans(updated);
  };

  const markLoanInstallmentPaid = (loanId: number, amount: number) => {
    const updated = employeeLoans.map(l => {
      if (l.id === loanId) {
        const repaid = l.repaidAmount + amount;
        return {
          ...l,
          repaidAmount: repaid,
          status: (repaid >= l.totalAmount ? 'Settled' : 'Active') as EmployeeLoan['status']
        };
      }
      return l;
    });
    setEmployeeLoans(updated);
    erpStorage.saveEmployeeLoans(updated);
  };

  // Requisition Mandatory Offices Policy
  const updateMandatoryRequisitionOffices = (offices: string[]) => {
    setMandatoryRequisitionOfficesState(offices);
    erpStorage.saveMandatoryRequisitionOffices(offices);
  };

  // Payroll Structure & Calculation
  const updatePayrollStructure = (structure: PayrollCalculationStructure) => {
    setPayrollStructureState(structure);
    erpStorage.savePayrollStructure(structure);
  };

  const processPayrollMonth = (monthYear: string, customItems?: PayrollCalculationItem[]) => {
    payrollService.processPayrollMonth(monthYear, customItems);
    setPayrollRuns(erpStorage.getPayrollRuns());
    setPayslips(erpStorage.getPayslips());
    setEmployeeLoans(erpStorage.getEmployeeLoans());
  };

  const finalizePayrollRun = (runId: number) => {
    payrollService.finalizePayrollRun(runId);
    setPayrollRuns(erpStorage.getPayrollRuns());
  };

  const markPayrollPaid = (runId: number) => {
    payrollService.markPayrollPaid(runId);
    setPayrollRuns(erpStorage.getPayrollRuns());
    setPayslips(erpStorage.getPayslips());
  };

  const importPayrollCSV = (csvContent: string) => {
    const res = payrollService.importPayrollCSV(csvContent);
    if (res.success) {
      setPayrollRuns(erpStorage.getPayrollRuns());
      setPayslips(erpStorage.getPayslips());
    }
    return res;
  };

  const bulkSendPayslips = (payrollRunId: number) => {
    const updated = payslips.map(s => s.payrollRunId === payrollRunId ? { ...s, sentToPortal: true } : s);
    setPayslips(updated);
    erpStorage.savePayslips(updated);
  };

  // RMC
  const addMixDesign = (mData: Omit<RmcMixDesign, 'id'>) => {
    const newMix: RmcMixDesign = { ...mData, id: Date.now() };
    const updated = [newMix, ...mixDesigns];
    setMixDesigns(updated);
    erpStorage.saveMixDesigns(updated);
  };

  const dispatchBatchTicket = (bData: Omit<RmcBatchRecord, 'id' | 'ticketNo' | 'batchTime' | 'status'>) => {
    const nextTicket = batchRecords.length + 910;
    const newBatch: RmcBatchRecord = {
      ...bData,
      id: Date.now(),
      ticketNo: `BT-2026-${nextTicket}`,
      batchTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Dispatched'
    };
    const updated = [newBatch, ...batchRecords];
    setBatchRecords(updated);
    erpStorage.saveBatchRecords(updated);
  };

  const recordQualityInspection = (qData: Omit<RmcQualityInspection, 'id'>) => {
    const newQ: RmcQualityInspection = { ...qData, id: Date.now() };
    const updated = [newQ, ...qualityInspections];
    setQualityInspections(updated);
    erpStorage.saveQualityInspections(updated);
  };

  // Contracts
  const addContract = (cData: Omit<ContractAdminContract, 'id'>) => {
    const newContract: ContractAdminContract = { ...cData, id: Date.now() };
    const updated = [newContract, ...contracts];
    setContracts(updated);
    erpStorage.saveContracts(updated);
  };

  const addContractEvent = (eData: Omit<ContractAdminEvent, 'id'>) => {
    const newEvent: ContractAdminEvent = { ...eData, id: Date.now() };
    const updated = [newEvent, ...contractEvents];
    setContractEvents(updated);
    erpStorage.saveContractEvents(updated);
  };

  // Chat
  const sendMessage = (
    text: string, 
    channelId?: string, 
    attachment?: { name: string; type: string; size: string; data?: string }
  ) => {
    if (!text.trim() && !attachment) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      channelId: channelId || 'operations',
      sender: currentUserName,
      role: activeRole,
      message: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      attachmentSize: attachment?.size,
      attachmentData: attachment?.data
    };
    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    erpStorage.saveChatMessages(updated);
  };

  // Fleet & Equipment Handlers
  const addEquipment = (eData: Omit<Equipment, 'id'>) => {
    const item: Equipment = { ...eData, id: Date.now() };
    const updated = [item, ...equipment];
    setEquipment(updated);
    erpStorage.saveEquipment(updated);
  };

  const updateEquipment = (eqId: number, data: Partial<Equipment>) => {
    const updated = equipment.map(e => e.id === eqId ? { ...e, ...data } : e);
    setEquipment(updated);
    erpStorage.saveEquipment(updated);
  };

  const deleteEquipment = (eqId: number) => {
    const updated = equipment.filter(e => e.id !== eqId);
    setEquipment(updated);
    erpStorage.saveEquipment(updated);
  };

  const addVehicle = (vData: Omit<Vehicle, 'id'>) => {
    const item: Vehicle = { ...vData, id: Date.now() };
    const updated = [item, ...vehicles];
    setVehicles(updated);
    erpStorage.saveVehicles(updated);
  };

  const updateVehicle = (vId: number, data: Partial<Vehicle>) => {
    const updated = vehicles.map(v => v.id === vId ? { ...v, ...data } : v);
    setVehicles(updated);
    erpStorage.saveVehicles(updated);
  };

  const deleteVehicle = (vId: number) => {
    const updated = vehicles.filter(v => v.id !== vId);
    setVehicles(updated);
    erpStorage.saveVehicles(updated);
  };

  const addMaintenanceRecord = (mData: Omit<MaintenanceRecord, 'id'>) => {
    const item: MaintenanceRecord = { ...mData, id: Date.now() };
    const updated = [item, ...maintenanceRecords];
    setMaintenanceRecords(updated);
    erpStorage.saveMaintenanceRecords(updated);
  };

  const updateMaintenanceRecord = (mId: number, data: Partial<MaintenanceRecord>) => {
    const updated = maintenanceRecords.map(m => m.id === mId ? { ...m, ...data } : m);
    setMaintenanceRecords(updated);
    erpStorage.saveMaintenanceRecords(updated);
  };

  const addFuelConsumption = (fData: Omit<FuelConsumption, 'id'>) => {
    const item: FuelConsumption = { ...fData, id: Date.now() };
    const updated = [item, ...fuelConsumptions];
    setFuelConsumptions(updated);
    erpStorage.saveFuelConsumptions(updated);
  };

  // Audit & System Logs Handlers
  const addAuditLog = (lData: Omit<AuditLog, 'id' | 'createdAt'>) => {
    const item: AuditLog = {
      ...lData,
      id: Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    const updated = [item, ...auditLogs];
    setAuditLogs(updated);
    erpStorage.saveAuditLogs(updated);
  };

  const addSystemLog = (sData: { module: string; message?: string; logType?: 'info' | 'warning' | 'error' | 'security'; action?: string; description?: string; severity?: 'info' | 'warning' | 'error' | 'security'; user?: string }) => {
    const item: SystemLog = {
      id: Date.now(),
      module: sData.module,
      logType: sData.logType || sData.severity || 'info',
      message: sData.message || sData.description || (sData.action ? `${sData.action}: ${sData.description || ''}` : 'System operation executed'),
      action: sData.action,
      description: sData.description,
      severity: sData.severity,
      user: sData.user,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    const updated = [item, ...systemLogs];
    setSystemLogs(updated);
    erpStorage.saveSystemLogs(updated);
  };

  return (
    <ERPContext.Provider
      value={{
        companies,
        activeCompany,
        setActiveCompanyId,
        updateCompany,
        activeRole,
        setActiveRole,
        currentUserName,
        isImpersonating,
        loginAsEmployee,
        stopImpersonation,
        projects,
        projectBudgets,
        projectSchedules,
        delayLogs,
        dailyLogs,
        safetyIncidents,
        rfis,
        changeOrders,
        documents,
        projectActivities,
        addProject,
        updateProject,
        deleteProject,
        updateProjectProgress,
        addBudget,
        updateBudget,
        deleteBudget,
        addScheduleTask,
        updateScheduleTask,
        updateScheduleTaskFull,
        deleteScheduleTask,
        addDelayLog,
        addDailyLog,
        addSafetyIncident,
        addRFI,
        resolveRFI,
        addChangeOrder,
        addDocument,
        addProjectActivity,
        customers,
        addCustomer,
        labourBudgets,
        addLabourBudget,
        updateLabourBudget,
        deleteLabourBudget,
        materialBudgets,
        addMaterialBudget,
        updateMaterialBudget,
        deleteMaterialBudget,
        milestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        projectTasks,
        addProjectTask,
        updateProjectTask,
        deleteProjectTask,
        projectStaff,
        assignProjectStaff,
        removeProjectStaff,
        projectStaffHistory,
        delayNotes,
        addDelayNote,
        updateDelayNote,
        deleteDelayNote,
        qualityAssurance,
        addQualityAssurance,
        updateQualityAssurance,
        deleteQualityAssurance,
        projectInvoices,
        addProjectInvoice,
        updateProjectInvoice,
        dailySiteReports,
        addDailySiteReport,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustStock,
        inventoryCategories,
        addInventoryCategory,
        updateInventoryCategory,
        deleteInventoryCategory,
        inventoryItemChanges,
        warehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        stockMovements,
        recordStockMovement,
        transferStock,
        receiveStock,
        issueStock,
        requisitions,
        createRequisition,
        updateRequisitionStatus,
        flagRequisitionForClarification,
        provideRequisitionClarification,
        addRequisitionMessage,
        dispatchRequests,
        createDispatchRequest,
        executeDispatch,
        waybills,
        createWaybill,
        markWaybillDelivered,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        purchaseOrders,
        createPurchaseOrder,
        updatePOStatus,
        goodsReceivedNotes,
        createGRN,
        employees,
        departments,
        attendance,
        leaves,
        leaveBalances,
        jobVacancies,
        recruitmentApplications,
        employeeArchives,
        employeeCustomFields,
        disabledColumns,
        salaryAdvances,
        employeeLoans,
        addEmployee,
        updateEmployee,
        archiveEmployee,
        restoreEmployee,
        deleteEmployeePermanently,
        toggleDisabledColumn,
        addCustomField,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        assignDepartmentHead,
        clockIn,
        clockOut,
        recordManualAttendance,
        requestAttendanceCorrection,
        decideAttendanceCorrection,
        createLeaveRequest,
        decideLeaveRequest,
        cancelLeaveRequest,
        createJobVacancy,
        updateJobVacancy,
        createRecruitmentApplication,
        updateApplicationStage,
        hireCandidate,
        requestSalaryAdvance,
        decideSalaryAdvance,
        createEmployeeLoan,
        markLoanInstallmentPaid,
        payrollRuns,
        payslips,
        processPayrollMonth,
        finalizePayrollRun,
        markPayrollPaid,
        importPayrollCSV,
        bulkSendPayslips,
        mixDesigns,
        batchRecords,
        qualityInspections,
        addMixDesign,
        dispatchBatchTicket,
        recordQualityInspection,
        contracts,
        contractEvents,
        addContract,
        addContractEvent,
        chatMessages,
        sendMessage,
        accountsLedger,
        updateDocument,
        deleteDocument,
        equipment,
        vehicles,
        maintenanceRecords,
        fuelConsumptions,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addMaintenanceRecord,
        updateMaintenanceRecord,
        addFuelConsumption,
        auditLogs,
        systemLogs,
        addAuditLog,
        addSystemLog,
        supabaseUser,
        supabaseSession,
        authLoading,
        signInWithSupabase,
        signUpWithSupabase,
        signOutWithSupabase,
        supplierInvoices,
        addSupplierInvoice,
        updateSupplierInvoice,
        createIndividualPayrollEntry,
        companyLeavePolicy,
        updateCompanyLeavePolicy,
        setEmployeeCustomEntitlement,
        authLogs,
        recordAuthEvent,
        registerCompanyWorkspace,
        provisionEmployeeAccount,
        updateEmployeeLoginStatus,
        revokeEmployeeLoginAccess,
        bulkImportInventory,
        bulkImportEmployees,
        bulkImportSuppliers,
        bulkImportProjects,
        payrollStructure,
        updatePayrollStructure,
        mandatoryRequisitionOffices,
        updateMandatoryRequisitionOffices
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
