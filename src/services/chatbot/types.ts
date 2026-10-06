import { 
  Project, 
  InventoryItem, 
  Requisition, 
  PurchaseOrder, 
  Employee, 
  UserRole,
  Company,
  PayrollRun,
  AccountLedgerEntry
} from '../../types';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ProjectCardData {
  id: number;
  name: string;
  client: string;
  location: string;
  progress: number;
  status: string;
  budget: number;
  spent: number;
  contractValue: number;
  isBehindSchedule?: boolean;
}

export interface InventoryCardData {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minLevel: number;
  unit: string;
  category: string;
  warehouse?: string;
  isLow: boolean;
}

export interface RequisitionCardData {
  id: number;
  requisitionNo: string;
  requestedBy: string;
  projectName: string;
  totalAmount: number;
  status: string;
  itemsCount: number;
  date: string;
}

export interface PurchaseOrderCardData {
  id: number;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  status: string;
  deliveryStatus: string;
  date: string;
}

export interface EmployeeCardData {
  id: number;
  name: string;
  department: string;
  position: string;
  status: string;
  code: string;
  phone?: string;
}

export interface PayrollSummaryData {
  monthYear: string;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: string;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  change?: string;
  color?: string;
}

export interface StructuredResponseData {
  type: 
    | 'projects' 
    | 'inventory' 
    | 'requisitions' 
    | 'purchaseOrders' 
    | 'employees' 
    | 'payroll' 
    | 'metrics' 
    | 'general';
  title?: string;
  projects?: ProjectCardData[];
  inventory?: InventoryCardData[];
  requisitions?: RequisitionCardData[];
  purchaseOrders?: PurchaseOrderCardData[];
  employees?: EmployeeCardData[];
  payroll?: PayrollSummaryData;
  metrics?: MetricCardData[];
}

export interface ToolAction {
  id: string;
  type: 'navigate' | 'filter' | 'view';
  label: string;
  path?: string;
  payload?: Record<string, any>;
}

export interface SuggestedAction {
  id: string;
  label: string;
  query: string;
  category?: 'projects' | 'inventory' | 'requisitions' | 'procurement' | 'hr' | 'finance';
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  structuredData?: StructuredResponseData;
  suggestedFollowUps?: string[];
  actions?: ToolAction[];
  isError?: boolean;
}

export interface ERPContextData {
  activeCompany: Company;
  activeRole: UserRole;
  currentUserName: string;
  projects: Project[];
  inventory: InventoryItem[];
  requisitions: Requisition[];
  purchaseOrders: PurchaseOrder[];
  employees: Employee[];
  payrollRuns: PayrollRun[];
  accountsLedger: AccountLedgerEntry[];
}

export interface ChatRequest {
  query: string;
  history: ChatMessage[];
  context: ERPContextData;
}

export interface ChatResponse {
  message: string;
  structuredData?: StructuredResponseData;
  suggestedFollowUps?: string[];
  actions?: ToolAction[];
}
