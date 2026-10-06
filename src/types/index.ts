export type UserRole = 
  | 'Super Admin'
  | 'Managing Director'
  | 'Finance Manager'
  | 'HR Manager'
  | 'Procurement Officer'
  | 'Site Engineer'
  | 'Site Quantity Surveyor'
  | 'Accountant'
  | 'Department Head'
  | 'Staff';

export interface Company {
  id: number;
  name: string;
  code: string;
  currency: string;
  themeColor: string;
  logoPath?: string;
  address: string;
  taxNumber: string;
  phone: string;
  email: string;
  website?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface User {
  id: number;
  companyId: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  employeeId?: number;
  status: 'active' | 'inactive' | 'locked';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface RoleDefinition {
  id: number;
  name: UserRole;
  description: string;
  department: string;
  privilegeLevel: 'Executive' | 'Management' | 'Operational' | 'Standard';
  moduleKeys: string[];
}

export interface ModuleAccessPermission {
  companyId: number;
  userId: number;
  moduleKey: string;
  hasAccess: boolean;
}

export interface ERPNotification {
  id: number;
  title: string;
  message: string;
  category: 'requisition' | 'inventory' | 'project' | 'payroll' | 'procurement' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface Employee {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  designation?: string;
  role: UserRole;
  salary: number;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Archived' | 'Terminated';
  profilePicture?: string;
  nin?: string;
  tin?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  pfa?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  qualifications?: string[];
  certifications?: string[];
  customFieldValues?: Record<string, string>;
  createdAt?: string;
}

export interface Department {
  id: number;
  name: string;
  companyId?: number;
  headEmployeeId?: number;
  headName?: string;
  headTitle?: string;
  roles: string[];
  description?: string;
}

export interface ProjectBudget {
  id: number;
  projectId: number;
  budgetName: string;
  category: 'Materials' | 'Labour' | 'Subcontract' | 'Equipment' | 'Overhead';
  unitOfMeasure: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'actual';
}

export interface ProjectLabourBudget {
  id: number;
  projectId: number;
  taskName: string;
  labourType: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  notes?: string;
  createdAt?: string;
}

export interface ProjectMaterialBudget {
  id: number;
  projectId: number;
  materialName: string;
  category: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  createdAt?: string;
}

export interface ProjectMilestone {
  id: number;
  projectId: number;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed';
  progressPercent?: number;
  notes?: string;
  createdAt?: string;
}

export interface ProjectTask {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToId?: number;
  startDate?: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  progressPercent?: number;
  createdAt?: string;
}

export interface ProjectStaffAssignment {
  id: number;
  projectId: number;
  employeeId: number;
  employeeName: string;
  role: string;
  assignedDate: string;
  status: 'Active' | 'Relieved' | 'Transferred';
}

export interface ProjectStaffHistory {
  id: number;
  projectId: number;
  employeeId: number;
  employeeName: string;
  action: 'Assigned' | 'Promoted' | 'Reassigned' | 'Removed';
  role: string;
  changedAt: string;
}

export interface ProjectDelayNote {
  id: number;
  projectId: number;
  logDate: string;
  issueSummary: string;
  impact?: string;
  actionTaken?: string;
  status: 'open' | 'monitoring' | 'resolved';
  createdAt?: string;
}

export interface ProjectQualityAssurance {
  id: number;
  projectId: number;
  inspectionDate: string;
  inspector: string;
  inspectionScope: string;
  result: 'Passed' | 'Failed' | 'Conditional Pass' | 'Rework Required';
  defectsFound?: string;
  correctiveAction?: string;
  remarks?: string;
  createdAt?: string;
}

export interface ProjectInvoice {
  id: number;
  projectId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
}

export interface Customer {
  id: number;
  customerCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  balance: number;
  status: 'active' | 'inactive';
}

export interface DailySiteReport {
  id: number;
  projectId: number;
  reportDate: string;
  summary: string;
  engineer: string;
  createdAt?: string;
}

export interface ProjectScheduleTask {
  id: number;
  projectId: number;
  taskName: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  progressPercent: number;
  assignedTo?: string;
  notes?: string;
}

export interface ProjectDelayLog {
  id: number;
  projectId: number;
  scheduleId?: number;
  delayDate: string;
  delayDays: number;
  reason: string;
  details?: string;
}

export interface ProjectDailyLog {
  id: number;
  projectId: number;
  logDate: string;
  weather: string;
  completedWork: string;
  manpower: string;
  equipment: string;
  safetyNote?: string;
  workersOnSite: number;
  safetyIncident: boolean;
  loggedBy: string;
}

export interface ProjectSafetyIncident {
  id: number;
  projectId: number;
  incidentDate: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  actionTaken: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export interface ProjectRFI {
  id: number;
  projectId: number;
  subject: string;
  submittedBy: string;
  assignedTo: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  date: string;
  resolution?: string;
}

export interface ProjectChangeOrder {
  id: number;
  projectId: number;
  title: string;
  description: string;
  amount: number;
  status: 'Proposed' | 'Approved' | 'Rejected';
  requestedDate: string;
}

export interface ProjectDocument {
  id: number;
  projectId?: number;
  projectName?: string;
  title: string;
  fileName: string;
  category: 'Architectural' | 'Structural' | 'Contract' | 'Permit' | 'Site Photo' | 'Invoice' | 'Safety' | 'Staff' | 'General' | 'Technical Drawing' | 'Compliance / Permit' | 'Specification' | 'Financial / Invoicing' | 'HR / Identification' | 'Legal & Contract' | 'Quality & Testing' | string;
  uploadDate: string;
  size: string;
  fileType?: string;
  fileData?: string;
  uploadedBy?: string;
  relatedType?: 'Project' | 'Employee' | 'Contract' | 'General';
  relatedId?: number;
  relatedName?: string;
  version?: string;
  status?: 'Draft' | 'Under Review' | 'Approved' | 'Archived';
  description?: string;
}

export type ERPDocument = ProjectDocument;

export interface ProjectActivity {
  id: number;
  projectId: number;
  timestamp: string;
  user: string;
  role: string;
  activityType: 'Progress Update' | 'BOQ Change' | 'Daily Log' | 'RFI' | 'Milestone' | 'Safety' | 'Document' | 'Project Created' | 'Project Updated';
  description: string;
}

export interface Project {
  id: number;
  projectNumber: string;
  name: string;
  clientId: number;
  clientName: string;
  clientContactPerson?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  consultant?: string;
  projectType?: string;
  description?: string;
  contractValue: number;
  budget: number;
  spent: number;
  contractDate?: string;
  startDate: string;
  endDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  siteLocation: string;
  location?: string;
  progressPercent: number;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  manager: string;
  assignedEngineers: string[];
  companyId?: number;
  createdAt?: string;
}

export interface InventoryCategory {
  id: number;
  name: string;
  description?: string;
  itemCount?: number;
  createdAt?: string;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  storeKeeperId?: number;
  storeKeeperName: string;
  phone?: string;
  capacity?: string;
  status: 'active' | 'inactive';
  itemCount?: number;
  totalValuation?: number;
  createdAt?: string;
}

export interface InventoryItem {
  id: number;
  itemCode: string;
  name: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  supplierId?: number;
  supplierName?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  costPrice: number;
  sellingPrice: number;
  openingStock?: number;
  currentStock: number;
  minLevel: number;
  reorderLevel?: number;
  warehouseId?: number;
  warehouseLocation: string;
  status?: 'active' | 'low_stock' | 'out_of_stock' | 'archived';
  description?: string;
  createdAt?: string;
}

export interface InventoryItemChange {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  changeReason: string;
  beforeData: string;
  afterData: string;
  changedBy?: string;
  changedAt: string;
}

export interface StockMovement {
  id: number;
  referenceNumber: string;
  movementType: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  source: string;
  destination: string;
  warehouseId?: number;
  warehouseName: string;
  targetWarehouseId?: number;
  targetWarehouseName?: string;
  projectId?: number;
  projectName?: string;
  performedBy: string;
  movementDate: string;
  reason: string;
  relatedDocumentType?: 'GRN' | 'Requisition' | 'Waybill' | 'PhysicalAudit' | 'Manual';
  relatedDocumentRef?: string;
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface RequisitionItem {
  id?: number;
  requisitionId?: number;
  inventoryItemId?: number;
  itemCode?: string;
  itemName: string;
  description?: string;
  unit: string;
  quantityRequired: number;
  quantityInStock: number;
  quantityToPurchase: number;
  quantityApproved?: number;
  quantityDispatched?: number;
  price: number;
  value: number;
  status?: 'pending' | 'approved' | 'partially_dispatched' | 'dispatched' | 'rejected';
}

export interface RequisitionDispatchRequest {
  id: number;
  requisitionId: number;
  requisitionNo: string;
  requisitionItemId?: number;
  companyId: number;
  inventoryItemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationProjectId: number;
  destinationProjectName: string;
  status: 'pending' | 'approved' | 'rejected' | 'dispatched';
  requestedAt: string;
  requestedBy: string;
  decidedAt?: string;
  decidedBy?: string;
  dispatchNotes?: string;
}

export interface RequisitionApprovalStep {
  id: number;
  level: string;
  action: 'Created' | 'Submitted' | 'Approved' | 'Partially Approved' | 'Rejected' | 'Dispatched' | 'Cancelled';
  actorName: string;
  actorRole: string;
  comments?: string;
  timestamp: string;
}

export interface RequisitionMessage {
  id: number;
  requisitionId: number;
  userName: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface Requisition {
  id: number;
  requisitionNo: string;
  companyId?: number;
  projectId: number;
  projectName: string;
  requestedBy: string;
  department: string;
  requisitionDate: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Partially Approved' | 'Ready for Dispatch' | 'Dispatched' | 'Delivered' | 'Rejected' | 'Cancelled';
  title: string;
  trade?: string;
  supplier?: string;
  supplierAddress?: string;
  description?: string;
  items: RequisitionItem[];
  totalEstimatedAmount: number;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  dispatchNote?: string;
  remarks?: string;
  messages?: RequisitionMessage[];
  approvalHistory?: RequisitionApprovalStep[];
}

export interface WaybillItem {
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  quantityDispatched: number;
  quantityReceived?: number;
  condition?: 'Good' | 'Damaged' | 'Missing';
  notes?: string;
}

export interface Waybill {
  id: number;
  waybillNumber: string;
  requisitionId?: number;
  requisitionNo?: string;
  dispatchRequestId?: number;
  projectId: number;
  projectName: string;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationSite: string;
  carrierName: string;
  vehicleNumber: string;
  driverPhone?: string;
  dispatchedBy: string;
  dispatchDate: string;
  receivedBy?: string;
  receivedDate?: string;
  status: 'Prepared' | 'In Transit' | 'Delivered' | 'Discrepancy Reported';
  items: WaybillItem[];
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: number;
  supplierCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  balance: number;
  taxId?: string;
  bankDetails?: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PurchaseOrderItem {
  id?: number;
  inventoryItemId?: number;
  itemCode?: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  total: number;
  quantityReceived?: number;
  quantityRemaining?: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  supplierAddress?: string;
  supplierPhone?: string;
  projectId?: number;
  projectName?: string;
  warehouseId?: number;
  warehouseName?: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'partially_received' | 'received' | 'rejected' | 'cancelled';
  subtotal?: number;
  discountTotal?: number;
  discountAmount?: number;
  taxTotal?: number;
  taxAmount?: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryAddress?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  notes?: string;
  items: PurchaseOrderItem[];
  createdAt?: string;
}

export interface GRNItem {
  id: number;
  inventoryItemId?: number;
  itemCode?: string;
  description: string;
  unit: string;
  quantityOrdered: number;
  quantityPreviouslyReceived: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  rejectionReason?: string;
  unitPrice: number;
  lineTotal: number;
}

export interface GoodsReceivedNote {
  id: number;
  grnNumber: string;
  purchaseOrderId: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  receivedDate: string;
  receivedBy: string;
  inspectedBy?: string;
  vendorDeliveryNote?: string;
  waybillRef?: string;
  vehicleNumber?: string;
  status: 'draft' | 'inspected_received' | 'partially_accepted' | 'rejected';
  qcInspectionStatus: 'Passed' | 'Passed with Conditions' | 'Failed';
  remarks?: string;
  items: GRNItem[];
  totalReceivedValue: number;
  totalValueReceived?: number;
  createdAt: string;
}

export interface SalaryAdvance {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  deductionMonth: string;
}

export interface EmployeeLoan {
  id: number;
  employeeId: number;
  employeeName: string;
  totalAmount: number;
  monthlyDeduction: number;
  repaidAmount: number;
  status: 'Active' | 'Settled';
  startDate: string;
}

export interface PayrollRun {
  id: number;
  monthYear: string;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  processedDate: string;
  status: 'Draft' | 'Finalized' | 'Paid';
}

export interface Payslip {
  id: number;
  payrollRunId: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  basicSalary: number;
  allowances: number;
  grossPay: number;
  tax: number;
  pension: number;
  loanDeduction: number;
  totalDeductions: number;
  netPay: number;
  sentToPortal: boolean;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  attendanceDate: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  hoursWorked?: number;
  correctionRequested?: boolean;
  correctionReason?: string;
  correctionStatus?: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  createdAt?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Maternity / Paternity' | 'Compassionate' | 'Casual' | 'Study / Examination';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  comments?: string;
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: number;
  annualAllocated: number;
  annualUsed: number;
  annualRemaining: number;
  sickAllocated: number;
  sickUsed: number;
  sickRemaining: number;
  casualAllocated: number;
  casualUsed: number;
  casualRemaining: number;
}

export interface RecruitmentApplication {
  id: number;
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experienceYears: number;
  status: 'applied' | 'screening' | 'interview' | 'hired' | 'rejected';
  appliedDate: string;
  resumeFileName?: string;
  interviewDate?: string;
  interviewer?: string;
  rating?: number;
  notes?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface JobVacancy {
  id: number;
  title: string;
  department: string;
  openings: number;
  experienceLevel: string;
  employmentType: 'Full-Time' | 'Contract' | 'Site-Based';
  location: string;
  salaryRange: string;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  closingDate: string;
  description: string;
}

export interface EmployeeArchiveRecord {
  id: number;
  companyId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  reason: string;
  employeeData: string;
  deletedAt: string;
  archivedBy: string;
}

export interface EmployeeCustomField {
  id: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'date' | 'select';
}

export interface RmcMixDesign {
  id: number;
  code: string;
  grade: string;
  slumpTarget: string;
  cementKg: number;
  waterLitres: number;
  fineAggregateKg: number;
  coarseAggregateKg: number;
  admixtureLitres: number;
  target28DayStrength: string;
}

export interface RmcBatchRecord {
  id: number;
  ticketNo: string;
  mixDesignCode: string;
  truckNo: string;
  volumeCuM: number;
  clientProject: string;
  batchTime: string;
  slumpMeasured: string;
  status: 'Dispatched' | 'Poured' | 'Tested';
}

export interface RmcQualityInspection {
  id: number;
  batchTicketNo: string;
  inspectionDate: string;
  slumpMm: number;
  cylinder7DayStrength: string;
  cylinder28DayStrength: string;
  passed: boolean;
  notes: string;
}

export interface ContractAdminContract {
  id: number;
  contractNumber: string;
  title: string;
  clientName: string;
  contractorName?: string;
  procurementRoute: string;
  status: 'opportunity' | 'tendering' | 'under_evaluation' | 'awarded' | 'active' | 'completed' | 'unsuccessful' | 'cancelled';
  estimatedValue: number;
  awardedValue: number;
  bidDeadline?: string;
  awardDate?: string;
  commencementDate?: string;
  completionDate?: string;
  description?: string;
}

export interface ContractAdminEvent {
  id: number;
  contractId: number;
  eventType: 'Instruction' | 'Variation' | 'Extension of Time' | 'Payment Application' | 'Certificate' | 'Claim';
  eventDate: string;
  notes: string;
}

export interface ChatMessage {
  id: number;
  channelId?: string;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
  isSelf?: boolean;
  avatar?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: string;
  attachmentData?: string;
}

export interface AccountLedgerEntry {
  id: number;
  accountCode: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface Equipment {
  id: number;
  equipmentCode: string;
  name: string;
  type: 'Excavator' | 'Tower Crane' | 'Bulldozer' | 'Concrete Pump' | 'Motor Grader' | 'Batch Plant' | 'Compactor / Roller' | 'Generator' | 'General Plant';
  status: 'available' | 'in_use' | 'maintenance' | 'breakdown';
  projectId?: number;
  projectName?: string;
  operatorName?: string;
  hourlyRate?: number;
  serialNumber?: string;
  purchaseDate?: string;
  createdAt?: string;
}

export interface Vehicle {
  id: number;
  vehicleCode: string;
  plateNumber: string;
  model: string;
  type: 'Transit Mixer Truck' | 'Tipper / Dump Truck' | 'Flatbed Lowbed' | 'Site Pickup 4x4' | 'Water Tanker' | 'Personnel Van';
  status: 'active' | 'in_service' | 'grounded';
  driverName?: string;
  currentOdometer?: number;
  fuelCapacityLiters?: number;
  lastServiceDate?: string;
  createdAt?: string;
}

export interface MaintenanceRecord {
  id: number;
  assetType: 'Equipment' | 'Vehicle';
  assetId: number;
  assetName: string;
  assetCode: string;
  maintenanceDate: string;
  description: string;
  cost: number;
  performedBy: string;
  partsReplaced?: string;
  nextServiceDate?: string;
  status: 'completed' | 'scheduled' | 'in_progress';
  createdAt?: string;
}

export interface FuelConsumption {
  id: number;
  vehicleId: number;
  vehicleCode: string;
  plateNumber: string;
  fuelDate: string;
  liters: number;
  cost: number;
  odometerKm?: number;
  driverName?: string;
  fuelStation?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: number;
  userId?: number;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemLog {
  id: number;
  logType: 'info' | 'warning' | 'error' | 'security';
  module: string;
  message: string;
  createdAt: string;
}
