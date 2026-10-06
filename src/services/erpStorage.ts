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
  InventoryCategory,
  Warehouse,
  InventoryItemChange,
  StockMovement,
  RequisitionDispatchRequest,
  Waybill,
  Supplier,
  GoodsReceivedNote,
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

import {
  initialCompanies,
  initialEmployees,
  initialDepartments,
  initialProjects,
  initialProjectBudgets,
  initialCustomers,
  initialProjectLabourBudgets,
  initialProjectMaterialBudgets,
  initialProjectMilestones,
  initialProjectTasks,
  initialProjectStaff,
  initialProjectStaffHistory,
  initialProjectDelayNotes,
  initialQualityAssurance,
  initialProjectInvoices,
  initialDailySiteReports,
  initialProjectSchedules,
  initialDelayLogs,
  initialDailyLogs,
  initialSafetyIncidents,
  initialRFIs,
  initialChangeOrders,
  initialDocuments,
  initialProjectActivities,
  initialInventory,
  initialInventoryCategories,
  initialWarehouses,
  initialSuppliers,
  initialStockMovements,
  initialInventoryItemChanges,
  initialDispatchRequests,
  initialWaybills,
  initialGoodsReceivedNotes,
  initialRequisitions,
  initialPurchaseOrders,
  initialSalaryAdvances,
  initialEmployeeLoans,
  initialPayrollRuns,
  initialPayslips,
  initialMixDesigns,
  initialBatchRecords,
  initialQualityInspections,
  initialContracts,
  initialContractEvents,
  initialChatMessages,
  initialAccountsLedger,
  initialAttendance,
  initialLeaves,
  initialLeaveBalances,
  initialJobVacancies,
  initialRecruitmentApplications,
  initialEmployeeArchives,
  initialEmployeeCustomFields,
  initialEquipment,
  initialVehicles,
  initialMaintenanceRecords,
  initialFuelConsumptions,
  initialAuditLogs,
  initialSystemLogs
} from '../mock/initialData';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`erp_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`erp_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

export const erpStorage = {
  getCompanies: () => getStored<Company[]>('companies', initialCompanies),
  saveCompanies: (c: Company[]) => setStored('companies', c),

  getActiveCompanyId: () => getStored<number>('active_company_id', initialCompanies[0].id),
  saveActiveCompanyId: (id: number) => setStored('active_company_id', id),

  getEmployees: () => getStored<Employee[]>('employees', initialEmployees),
  saveEmployees: (e: Employee[]) => setStored('employees', e),

  getDepartments: () => getStored<Department[]>('departments', initialDepartments),
  saveDepartments: (d: Department[]) => setStored('departments', d),

  getProjects: () => getStored<Project[]>('projects', initialProjects),
  saveProjects: (p: Project[]) => setStored('projects', p),

  getProjectBudgets: () => getStored<ProjectBudget[]>('project_budgets', initialProjectBudgets),
  saveProjectBudgets: (b: ProjectBudget[]) => setStored('project_budgets', b),

  getCustomers: () => getStored<Customer[]>('customers', initialCustomers),
  saveCustomers: (c: Customer[]) => setStored('customers', c),

  getProjectLabourBudgets: () => getStored<ProjectLabourBudget[]>('project_labour_budgets', initialProjectLabourBudgets),
  saveProjectLabourBudgets: (b: ProjectLabourBudget[]) => setStored('project_labour_budgets', b),

  getProjectMaterialBudgets: () => getStored<ProjectMaterialBudget[]>('project_material_budgets', initialProjectMaterialBudgets),
  saveProjectMaterialBudgets: (b: ProjectMaterialBudget[]) => setStored('project_material_budgets', b),

  getProjectMilestones: () => getStored<ProjectMilestone[]>('project_milestones', initialProjectMilestones),
  saveProjectMilestones: (m: ProjectMilestone[]) => setStored('project_milestones', m),

  getProjectTasks: () => getStored<ProjectTask[]>('project_tasks', initialProjectTasks),
  saveProjectTasks: (t: ProjectTask[]) => setStored('project_tasks', t),

  getProjectStaff: () => getStored<ProjectStaffAssignment[]>('project_staff', initialProjectStaff),
  saveProjectStaff: (s: ProjectStaffAssignment[]) => setStored('project_staff', s),

  getProjectStaffHistory: () => getStored<ProjectStaffHistory[]>('project_staff_history', initialProjectStaffHistory),
  saveProjectStaffHistory: (h: ProjectStaffHistory[]) => setStored('project_staff_history', h),

  getProjectDelayNotes: () => getStored<ProjectDelayNote[]>('project_delay_notes', initialProjectDelayNotes),
  saveProjectDelayNotes: (n: ProjectDelayNote[]) => setStored('project_delay_notes', n),

  getQualityAssurance: () => getStored<ProjectQualityAssurance[]>('quality_assurance', initialQualityAssurance),
  saveQualityAssurance: (q: ProjectQualityAssurance[]) => setStored('quality_assurance', q),

  getProjectInvoices: () => getStored<ProjectInvoice[]>('project_invoices', initialProjectInvoices),
  saveProjectInvoices: (i: ProjectInvoice[]) => setStored('project_invoices', i),

  getDailySiteReports: () => getStored<DailySiteReport[]>('daily_site_reports', initialDailySiteReports),
  saveDailySiteReports: (r: DailySiteReport[]) => setStored('daily_site_reports', r),

  getProjectSchedules: () => getStored<ProjectScheduleTask[]>('project_schedules', initialProjectSchedules),
  saveProjectSchedules: (s: ProjectScheduleTask[]) => setStored('project_schedules', s),

  getDelayLogs: () => getStored<ProjectDelayLog[]>('delay_logs', initialDelayLogs),
  saveDelayLogs: (d: ProjectDelayLog[]) => setStored('delay_logs', d),

  getDailyLogs: () => getStored<ProjectDailyLog[]>('daily_logs', initialDailyLogs),
  saveDailyLogs: (l: ProjectDailyLog[]) => setStored('daily_logs', l),

  getSafetyIncidents: () => getStored<ProjectSafetyIncident[]>('safety_incidents', initialSafetyIncidents),
  saveSafetyIncidents: (s: ProjectSafetyIncident[]) => setStored('safety_incidents', s),

  getRFIs: () => getStored<ProjectRFI[]>('rfis', initialRFIs),
  saveRFIs: (r: ProjectRFI[]) => setStored('rfis', r),

  getChangeOrders: () => getStored<ProjectChangeOrder[]>('change_orders', initialChangeOrders),
  saveChangeOrders: (c: ProjectChangeOrder[]) => setStored('change_orders', c),

  getDocuments: () => getStored<ProjectDocument[]>('documents', initialDocuments),
  saveDocuments: (d: ProjectDocument[]) => setStored('documents', d),

  getProjectActivities: () => getStored<ProjectActivity[]>('project_activities', initialProjectActivities),
  saveProjectActivities: (a: ProjectActivity[]) => setStored('project_activities', a),

  getInventory: () => getStored<InventoryItem[]>('inventory', initialInventory),
  saveInventory: (i: InventoryItem[]) => setStored('inventory', i),

  getInventoryCategories: () => getStored<InventoryCategory[]>('inventory_categories', initialInventoryCategories),
  saveInventoryCategories: (c: InventoryCategory[]) => setStored('inventory_categories', c),

  getWarehouses: () => getStored<Warehouse[]>('warehouses', initialWarehouses),
  saveWarehouses: (w: Warehouse[]) => setStored('warehouses', w),

  getSuppliers: () => getStored<Supplier[]>('suppliers', initialSuppliers),
  saveSuppliers: (s: Supplier[]) => setStored('suppliers', s),

  getStockMovements: () => getStored<StockMovement[]>('stock_movements', initialStockMovements),
  saveStockMovements: (m: StockMovement[]) => setStored('stock_movements', m),

  getInventoryItemChanges: () => getStored<InventoryItemChange[]>('inventory_item_changes', initialInventoryItemChanges),
  saveInventoryItemChanges: (c: InventoryItemChange[]) => setStored('inventory_item_changes', c),

  getDispatchRequests: () => getStored<RequisitionDispatchRequest[]>('dispatch_requests', initialDispatchRequests),
  saveDispatchRequests: (d: RequisitionDispatchRequest[]) => setStored('dispatch_requests', d),

  getWaybills: () => getStored<Waybill[]>('waybills', initialWaybills),
  saveWaybills: (w: Waybill[]) => setStored('waybills', w),

  getGoodsReceivedNotes: () => getStored<GoodsReceivedNote[]>('goods_received_notes', initialGoodsReceivedNotes),
  saveGoodsReceivedNotes: (g: GoodsReceivedNote[]) => setStored('goods_received_notes', g),

  getRequisitions: () => getStored<Requisition[]>('requisitions', initialRequisitions),
  saveRequisitions: (r: Requisition[]) => setStored('requisitions', r),

  getPurchaseOrders: () => getStored<PurchaseOrder[]>('purchase_orders', initialPurchaseOrders),
  savePurchaseOrders: (p: PurchaseOrder[]) => setStored('purchase_orders', p),

  getSalaryAdvances: () => getStored<SalaryAdvance[]>('salary_advances', initialSalaryAdvances),
  saveSalaryAdvances: (a: SalaryAdvance[]) => setStored('salary_advances', a),

  getEmployeeLoans: () => getStored<EmployeeLoan[]>('employee_loans', initialEmployeeLoans),
  saveEmployeeLoans: (l: EmployeeLoan[]) => setStored('employee_loans', l),

  getPayrollRuns: () => getStored<PayrollRun[]>('payroll_runs', initialPayrollRuns),
  savePayrollRuns: (r: PayrollRun[]) => setStored('payroll_runs', r),

  getPayslips: () => getStored<Payslip[]>('payslips', initialPayslips),
  savePayslips: (p: Payslip[]) => setStored('payslips', p),

  getMixDesigns: () => getStored<RmcMixDesign[]>('mix_designs', initialMixDesigns),
  saveMixDesigns: (m: RmcMixDesign[]) => setStored('mix_designs', m),

  getBatchRecords: () => getStored<RmcBatchRecord[]>('batch_records', initialBatchRecords),
  saveBatchRecords: (b: RmcBatchRecord[]) => setStored('batch_records', b),

  getQualityInspections: () => getStored<RmcQualityInspection[]>('quality_inspections', initialQualityInspections),
  saveQualityInspections: (q: RmcQualityInspection[]) => setStored('quality_inspections', q),

  getContracts: () => getStored<ContractAdminContract[]>('contracts', initialContracts),
  saveContracts: (c: ContractAdminContract[]) => setStored('contracts', c),

  getContractEvents: () => getStored<ContractAdminEvent[]>('contract_events', initialContractEvents),
  saveContractEvents: (e: ContractAdminEvent[]) => setStored('contract_events', e),

  getChatMessages: () => getStored<ChatMessage[]>('chat_messages', initialChatMessages),
  saveChatMessages: (m: ChatMessage[]) => setStored('chat_messages', m),

  getAccountsLedger: () => getStored<AccountLedgerEntry[]>('accounts_ledger', initialAccountsLedger),
  saveAccountsLedger: (a: AccountLedgerEntry[]) => setStored('accounts_ledger', a),

  getAttendance: () => getStored<AttendanceRecord[]>('attendance', initialAttendance),
  saveAttendance: (a: AttendanceRecord[]) => setStored('attendance', a),

  getLeaves: () => getStored<LeaveRequest[]>('leaves', initialLeaves),
  saveLeaves: (l: LeaveRequest[]) => setStored('leaves', l),

  getLeaveBalances: () => getStored<LeaveBalance[]>('leave_balances', initialLeaveBalances),
  saveLeaveBalances: (b: LeaveBalance[]) => setStored('leave_balances', b),

  getJobVacancies: () => getStored<JobVacancy[]>('job_vacancies', initialJobVacancies),
  saveJobVacancies: (v: JobVacancy[]) => setStored('job_vacancies', v),

  getRecruitmentApplications: () => getStored<RecruitmentApplication[]>('recruitment_applications', initialRecruitmentApplications),
  saveRecruitmentApplications: (r: RecruitmentApplication[]) => setStored('recruitment_applications', r),

  getEmployeeArchives: () => getStored<EmployeeArchiveRecord[]>('employee_archives', initialEmployeeArchives),
  saveEmployeeArchives: (a: EmployeeArchiveRecord[]) => setStored('employee_archives', a),

  getEmployeeCustomFields: () => getStored<EmployeeCustomField[]>('employee_custom_fields', initialEmployeeCustomFields),
  saveEmployeeCustomFields: (f: EmployeeCustomField[]) => setStored('employee_custom_fields', f),

  getEmployeeDisabledColumns: () => getStored<string[]>('employee_disabled_columns', []),
  saveEmployeeDisabledColumns: (cols: string[]) => setStored('employee_disabled_columns', cols),

  getEquipment: () => getStored<Equipment[]>('equipment', initialEquipment),
  saveEquipment: (e: Equipment[]) => setStored('equipment', e),

  getVehicles: () => getStored<Vehicle[]>('vehicles', initialVehicles),
  saveVehicles: (v: Vehicle[]) => setStored('vehicles', v),

  getMaintenanceRecords: () => getStored<MaintenanceRecord[]>('maintenance_records', initialMaintenanceRecords),
  saveMaintenanceRecords: (m: MaintenanceRecord[]) => setStored('maintenance_records', m),

  getFuelConsumptions: () => getStored<FuelConsumption[]>('fuel_consumptions', initialFuelConsumptions),
  saveFuelConsumptions: (f: FuelConsumption[]) => setStored('fuel_consumptions', f),

  getAuditLogs: () => getStored<AuditLog[]>('audit_logs', initialAuditLogs),
  saveAuditLogs: (a: AuditLog[]) => setStored('audit_logs', a),

  getSystemLogs: () => getStored<SystemLog[]>('system_logs', initialSystemLogs),
  saveSystemLogs: (s: SystemLog[]) => setStored('system_logs', s),
};
