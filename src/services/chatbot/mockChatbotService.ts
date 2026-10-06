import { 
  ChatRequest, 
  ChatResponse, 
  StructuredResponseData, 
  ToolAction,
  ProjectCardData,
  InventoryCardData,
  RequisitionCardData,
  PurchaseOrderCardData,
  EmployeeCardData
} from './types';

// Helper to check permission for financial data
const hasFinanceAccess = (role: string): boolean => {
  return [
    'Super Admin',
    'Managing Director',
    'Finance Manager',
    'Accountant'
  ].includes(role);
};

// Helper to check permission for HR / Payroll data
const hasPayrollAccess = (role: string): boolean => {
  return [
    'Super Admin',
    'Managing Director',
    'Finance Manager',
    'HR Manager',
    'Accountant'
  ].includes(role);
};

export class MockChatbotService {
  async processQuery(request: ChatRequest): Promise<ChatResponse> {
    // Artificial small delay to simulate realistic natural language inference
    await new Promise(resolve => setTimeout(resolve, 350));

    const q = request.query.trim().toLowerCase();
    const { context } = request;
    const { 
      projects = [], 
      inventory = [], 
      requisitions = [], 
      purchaseOrders = [], 
      employees = [], 
      payrollRuns = [],
      accountsLedger = [],
      activeRole,
      activeCompany
    } = context;

    const currency = activeCompany?.currency || 'USD';

    // 1. WHICH PROJECTS ARE BEHIND SCHEDULE?
    if (
      q.includes('behind schedule') || 
      q.includes('delayed project') || 
      q.includes('projects delayed') ||
      q.includes('schedule delay')
    ) {
      // Find projects that are in_progress and progress < 50% or explicitly marked behind schedule
      const behindProjects = projects.filter(p => 
        p.status === 'in_progress' && (p.progressPercent < 45 || p.spent > p.budget * 0.7)
      );

      if (behindProjects.length === 0) {
        return {
          message: `All current active projects are operating within their scheduled completion margins and milestone targets.`,
          suggestedFollowUps: [
            'Show me active projects',
            'What items are low in stock?',
            'Show pending requisitions'
          ]
        };
      }

      const projectCards: ProjectCardData[] = behindProjects.map(p => ({
        id: p.id,
        name: p.name,
        client: p.clientName,
        location: p.siteLocation || 'Main Sector',
        progress: p.progressPercent,
        status: p.status,
        budget: p.budget || 0,
        spent: p.spent || 0,
        contractValue: p.contractValue || p.budget || 0,
        isBehindSchedule: true
      }));

      const summaryList = behindProjects
        .map((p, idx) => `${idx + 1}. **${p.name}** — ${p.progressPercent}% complete (Budget spent: ${currency} ${(p.spent || 0).toLocaleString()})`)
        .join('\n');

      return {
        message: `Based on current site activity and milestone metrics, ${behindProjects.length} ${behindProjects.length === 1 ? 'project is' : 'projects are'} currently flagged behind schedule:\n\n${summaryList}\n\nWould you like to inspect the project details or daily site logs?`,
        structuredData: {
          type: 'projects',
          title: 'Flagged Projects (Schedule Variance)',
          projects: projectCards
        },
        actions: behindProjects.slice(0, 2).map(p => ({
          id: `view-project-${p.id}`,
          type: 'navigate',
          label: `View ${p.name.substring(0, 20)}...`,
          path: `/projects/${p.id}`
        })),
        suggestedFollowUps: [
          'Show me active projects',
          'Show pending requisitions for these projects',
          'What items are low in stock?'
        ]
      };
    }

    // 2. ACTIVE PROJECTS / SHOW ME PROJECTS
    if (
      q.includes('active project') || 
      q.includes('show projects') || 
      q.includes('list projects') || 
      q.includes('all projects') ||
      q.includes('project status') ||
      q === 'projects'
    ) {
      const activeList = projects.filter(p => p.status === 'in_progress' || p.status === 'planned');
      const targetProjects = activeList.length > 0 ? activeList : projects;

      const projectCards: ProjectCardData[] = targetProjects.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        client: p.clientName,
        location: p.siteLocation || 'Main Sector',
        progress: p.progressPercent,
        status: p.status,
        budget: p.budget || 0,
        spent: p.spent || 0,
        contractValue: p.contractValue || p.budget || 0
      }));

      const totalVal = targetProjects.reduce((sum, p) => sum + (p.contractValue || p.budget || 0), 0);
      const avgProgress = targetProjects.length > 0 
        ? Math.round(targetProjects.reduce((sum, p) => sum + (p.progressPercent || 0), 0) / targetProjects.length) 
        : 0;

      return {
        message: `You currently have **${targetProjects.length} active civil projects** under management for ${activeCompany.name}, with an aggregate contract value of **${currency} ${totalVal.toLocaleString()}** and an average physical completion rate of **${avgProgress}%**.`,
        structuredData: {
          type: 'projects',
          title: 'Active Civil & Infrastructure Projects',
          projects: projectCards
        },
        actions: [
          {
            id: 'go-to-projects',
            type: 'navigate',
            label: 'Open Full Projects Directory',
            path: '/projects'
          }
        ],
        suggestedFollowUps: [
          'Which projects are behind schedule?',
          'What items are low in stock?',
          'Show pending requisitions'
        ]
      };
    }

    // 3. LOW IN STOCK / INVENTORY ITEMS
    if (
      q.includes('low in stock') || 
      q.includes('low stock') || 
      q.includes('out of stock') || 
      q.includes('reorder') ||
      q.includes('stock alert') ||
      q.includes('inventory status') ||
      q.includes('show inventory') ||
      q === 'inventory'
    ) {
      const lowItems = inventory.filter(item => item.currentStock <= item.minLevel);

      if (lowItems.length === 0) {
        return {
          message: `All ${inventory.length} storehouse SKUs are currently operating above their minimum reorder safety thresholds. No replenishment orders are critical today.`,
          suggestedFollowUps: [
            'Show me active projects',
            'Show pending requisitions',
            'What purchase orders are awaiting delivery?'
          ]
        };
      }

      const inventoryCards: InventoryCardData[] = lowItems.slice(0, 6).map(item => ({
        id: item.id,
        name: item.name,
        sku: item.itemCode,
        currentStock: item.currentStock,
        minLevel: item.minLevel,
        unit: item.unit,
        category: item.categoryName,
        isLow: true
      }));

      const itemList = lowItems.slice(0, 4)
        .map(i => `• **${i.name}** (Code: ${i.itemCode}): Current stock is **${i.currentStock} ${i.unit}** (Minimum reorder threshold: ${i.minLevel} ${i.unit})`)
        .join('\n');

      return {
        message: `Found **${lowItems.length} inventory items** at or below minimum reorder thresholds across your warehouses:\n\n${itemList}\n\nImmediate requisition or purchase order creation is advised to prevent site downtime.`,
        structuredData: {
          type: 'inventory',
          title: 'Low Stock & Reorder Alerts',
          inventory: inventoryCards
        },
        actions: [
          {
            id: 'go-to-inventory',
            type: 'navigate',
            label: 'Open Central Inventory',
            path: '/inventory'
          },
          {
            id: 'create-req',
            type: 'navigate',
            label: 'Create Material Requisition',
            path: '/requisitions'
          }
        ],
        suggestedFollowUps: [
          'Show pending requisitions',
          'What purchase orders are awaiting delivery?',
          'Which projects are behind schedule?'
        ]
      };
    }

    // 4. PENDING REQUISITIONS
    if (
      q.includes('pending requisition') || 
      q.includes('requisitions awaiting') || 
      q.includes('approval') ||
      q.includes('show requisitions') || 
      q.includes('material requisitions') ||
      q === 'requisitions'
    ) {
      const pendingReqs = requisitions.filter(r => 
        r.status === 'Pending Review' || (r.status as string).includes('Pending')
      );

      const targetReqs = pendingReqs.length > 0 ? pendingReqs : requisitions.slice(0, 5);

      const reqCards: RequisitionCardData[] = targetReqs.slice(0, 5).map(r => ({
        id: r.id,
        requisitionNo: r.requisitionNo,
        requestedBy: r.requestedBy,
        projectName: r.projectName,
        totalAmount: r.totalEstimatedAmount || 0,
        status: r.status,
        itemsCount: r.items?.length || 1,
        date: r.requisitionDate
      }));

      const totalPendingValue = targetReqs.reduce((sum, r) => sum + (r.totalEstimatedAmount || 0), 0);

      return {
        message: pendingReqs.length > 0 
          ? `There are **${pendingReqs.length} material requisitions** pending approval with a combined estimated value of **${currency} ${totalPendingValue.toLocaleString()}**.`
          : `There are currently no requisitions awaiting review. Here are the most recent material requisitions on record:`,
        structuredData: {
          type: 'requisitions',
          title: 'Pending Material Requisitions',
          requisitions: reqCards
        },
        actions: [
          {
            id: 'go-to-requisitions',
            type: 'navigate',
            label: 'Manage Requisitions',
            path: '/requisitions'
          }
        ],
        suggestedFollowUps: [
          'What items are low in stock?',
          'What purchase orders are awaiting delivery?',
          'Show me active projects'
        ]
      };
    }

    // 5. PURCHASE ORDERS / AWAITING DELIVERY / PROCUREMENT
    if (
      q.includes('purchase order') || 
      q.includes('po awaiting') || 
      q.includes('awaiting delivery') || 
      q.includes('procurement') ||
      q.includes('suppliers') ||
      q.includes('vendor') ||
      q === 'procurement'
    ) {
      const pendingPOs = purchaseOrders.filter(po => 
        po.status !== 'received' && po.status !== 'cancelled'
      );
      const targetPOs = pendingPOs.length > 0 ? pendingPOs : purchaseOrders.slice(0, 5);

      const poCards: PurchaseOrderCardData[] = targetPOs.slice(0, 5).map(po => ({
        id: po.id,
        poNumber: po.poNumber,
        supplierName: po.supplierName,
        totalAmount: po.totalAmount || 0,
        status: po.status,
        deliveryStatus: po.status === 'received' ? 'Delivered' : po.status === 'partially_received' ? 'Partially Received' : 'Pending Delivery',
        date: po.orderDate
      }));

      const totalPOValue = targetPOs.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

      return {
        message: `Currently tracking **${targetPOs.length} purchase orders** totaling **${currency} ${totalPOValue.toLocaleString()}** in the procurement pipeline awaiting site delivery or Goods Received Notes (GRN) verification.`,
        structuredData: {
          type: 'purchaseOrders',
          title: 'Procurement Purchase Orders',
          purchaseOrders: poCards
        },
        actions: [
          {
            id: 'go-to-procurement',
            type: 'navigate',
            label: 'Open Procurement & POs',
            path: '/procurement'
          }
        ],
        suggestedFollowUps: [
          'What items are low in stock?',
          'Show pending requisitions',
          'Give me a summary of this month\'s payroll'
        ]
      };
    }

    // 6. PAYROLL SUMMARY
    if (
      q.includes('payroll') || 
      q.includes('salary') || 
      q.includes('payslip') || 
      q.includes('compensation') ||
      q === 'payroll'
    ) {
      // Permission check!
      if (!hasPayrollAccess(activeRole)) {
        return {
          message: `**Access Restricted:** Your current profile role (**${activeRole}**) does not have permission to view sensitive company payroll figures and employee remuneration. Authorized roles include: Managing Director, Finance Manager, HR Manager, Accountant, and Super Admin.`,
          suggestedFollowUps: [
            'Show me active projects',
            'What items are low in stock?',
            'Show pending requisitions'
          ]
        };
      }

      const latestRun = payrollRuns[0] || {
        id: 1,
        monthYear: 'October 2026',
        employeeCount: employees.length || 24,
        totalGross: 4850000,
        totalDeductions: 820000,
        totalNet: 4030000,
        status: 'Processed'
      };

      const staffCount = latestRun.employeeCount || employees.length || 24;

      return {
        message: `Here is the payroll summary for **${latestRun.monthYear}**:\n\n• **Enrolled Staff:** ${staffCount} personnel\n• **Gross Payroll:** ${currency} ${latestRun.totalGross.toLocaleString()}\n• **Tax & Statutory Deductions:** ${currency} ${latestRun.totalDeductions.toLocaleString()}\n• **Total Net Disbursed:** ${currency} ${latestRun.totalNet.toLocaleString()}\n• **Status:** ${latestRun.status}`,
        structuredData: {
          type: 'payroll',
          title: `Payroll Summary (${latestRun.monthYear})`,
          payroll: {
            monthYear: latestRun.monthYear,
            totalEmployees: staffCount,
            totalGross: latestRun.totalGross,
            totalDeductions: latestRun.totalDeductions,
            totalNet: latestRun.totalNet,
            status: latestRun.status
          }
        },
        actions: [
          {
            id: 'go-to-payroll',
            type: 'navigate',
            label: 'Open Payroll Module',
            path: '/payroll'
          }
        ],
        suggestedFollowUps: [
          'Show employees in HR',
          'Show accounts ledger summary',
          'Show me active projects'
        ]
      };
    }

    // 7. EMPLOYEES / HR / STAFF
    if (
      q.includes('employee') || 
      q.includes('staff') || 
      q.includes('personnel') || 
      q.includes('hr') || 
      q.includes('workers') ||
      q.includes('attendance') ||
      q === 'hr'
    ) {
      const activeStaff = employees.filter(e => e.status === 'Active');
      const targetEmployees = activeStaff.length > 0 ? activeStaff : employees;

      const empCards: EmployeeCardData[] = targetEmployees.slice(0, 6).map(e => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        department: e.department || 'Operations',
        position: e.designation || e.role || 'Personnel',
        status: e.status || 'Active',
        code: e.code || `EMP-${e.id}`,
        phone: e.phone
      }));

      return {
        message: `Apex Construction currently maintains **${employees.length} registered personnel** across civil engineering, site survey, heavy machinery operations, and administration.`,
        structuredData: {
          type: 'employees',
          title: 'Registered Company Personnel',
          employees: empCards
        },
        actions: [
          {
            id: 'go-to-hr',
            type: 'navigate',
            label: 'Open HR & Personnel Hub',
            path: '/hr'
          }
        ],
        suggestedFollowUps: [
          'Give me a summary of this month\'s payroll',
          'Show me active projects',
          'Show pending requisitions'
        ]
      };
    }

    // 8. ACCOUNTING / FINANCIALS / LEDGER
    if (
      q.includes('accounting') || 
      q.includes('ledger') || 
      q.includes('financial') || 
      q.includes('balance') ||
      q.includes('revenue') ||
      q === 'accounting'
    ) {
      if (!hasFinanceAccess(activeRole)) {
        return {
          message: `**Access Restricted:** Financial and General Ledger balances are restricted from the **${activeRole}** role. You must be authenticated as Managing Director, Finance Manager, Accountant, or Super Admin to view company books.`,
          suggestedFollowUps: [
            'Show me active projects',
            'What items are low in stock?',
            'Show pending requisitions'
          ]
        };
      }

      const totalAssets = accountsLedger.filter(e => e.type === 'Asset').reduce((sum, e) => sum + (e.balance || 0), 0) || 12450000;
      const totalExpenses = accountsLedger.filter(e => e.type === 'Expense').reduce((sum, e) => sum + (e.balance || 0), 0) || 4850000;

      return {
        message: `General Ledger status for **${activeCompany.name}**:\n\n• **Recorded Assets:** ${currency} ${totalAssets.toLocaleString()}\n• **Operating Expenses:** ${currency} ${totalExpenses.toLocaleString()}\n• **Reconciliation Status:** Balanced & Audit-Cleared\n• **Active Cost Centers:** 4 Major Civil Construction Sites`,
        structuredData: {
          type: 'metrics',
          title: 'Financial Health & Ledger',
          metrics: [
            { label: 'Total Assets', value: `${currency} ${totalAssets.toLocaleString()}`, color: 'blue' },
            { label: 'Operating Expenses', value: `${currency} ${totalExpenses.toLocaleString()}`, color: 'red' },
            { label: 'Audit Trail', value: '100% Reconciled', color: 'purple' },
            { label: 'Bank Cash Balance', value: `${currency} 3,420,000`, color: 'amber' }
          ]
        },
        actions: [
          {
            id: 'go-to-accounting',
            type: 'navigate',
            label: 'Open General Ledger',
            path: '/accounting'
          }
        ],
        suggestedFollowUps: [
          'Give me a summary of this month\'s payroll',
          'Show me active projects',
          'What purchase orders are awaiting delivery?'
        ]
      };
    }

    // 9. RECENT BUSINESS ACTIVITY / OVERVIEW
    if (
      q.includes('recent activity') || 
      q.includes('business activity') || 
      q.includes('company status') || 
      q.includes('overview') ||
      q.includes('what is happening')
    ) {
      const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
      const pendingReqsCount = requisitions.filter(r => r.status.includes('Pending')).length;
      const lowStockCount = inventory.filter(i => i.currentStock <= i.minLevel).length;

      return {
        message: `Here is the current operational snapshot for **${activeCompany.name}**:\n\n• **Civil Projects:** ${activeProjectsCount} active sites in progress\n• **Material Requisitions:** ${pendingReqsCount} pending site requisitions\n• **Warehouse Stores:** ${lowStockCount} items flagged for replenishment\n• **Active Personnel:** ${employees.length} staff checked into active rosters\n• **System State:** All ERP modules synced and operational.`,
        structuredData: {
          type: 'metrics',
          title: 'Executive Operational Summary',
          metrics: [
            { label: 'Active Sites', value: activeProjectsCount, color: 'blue' },
            { label: 'Pending Requisitions', value: pendingReqsCount, color: 'orange' },
            { label: 'Low Stock Alerts', value: lowStockCount, color: 'red' },
            { label: 'Enrolled Staff', value: employees.length, color: 'green' }
          ]
        },
        actions: [
          {
            id: 'go-to-dashboard',
            type: 'navigate',
            label: 'Open Executive Dashboard',
            path: '/dashboard'
          }
        ],
        suggestedFollowUps: [
          'Which projects are behind schedule?',
          'What items are low in stock?',
          'Show pending requisitions',
          'What purchase orders are awaiting delivery?'
        ]
      };
    }

    // 10. SPECIFIC PROJECT SEARCH (BY NAME)
    const matchingProject = projects.find(p => 
      p.name.toLowerCase().includes(q) || 
      (p.projectNumber && p.projectNumber.toLowerCase().includes(q))
    );

    if (matchingProject) {
      return {
        message: `Found project record for **${matchingProject.name}** (${matchingProject.projectNumber || 'PRJ'}):\n\n• **Client:** ${matchingProject.clientName}\n• **Site Location:** ${matchingProject.siteLocation}\n• **Progress:** ${matchingProject.progressPercent}%\n• **Status:** ${matchingProject.status}\n• **Contract Value:** ${currency} ${(matchingProject.contractValue || matchingProject.budget || 0).toLocaleString()}\n• **Spent to Date:** ${currency} ${(matchingProject.spent || 0).toLocaleString()}`,
        structuredData: {
          type: 'projects',
          title: `Project Details: ${matchingProject.name}`,
          projects: [{
            id: matchingProject.id,
            name: matchingProject.name,
            client: matchingProject.clientName,
            location: matchingProject.siteLocation || 'Site',
            progress: matchingProject.progressPercent,
            status: matchingProject.status,
            budget: matchingProject.budget || 0,
            spent: matchingProject.spent || 0,
            contractValue: matchingProject.contractValue || matchingProject.budget || 0
          }]
        },
        actions: [
          {
            id: `view-project-${matchingProject.id}`,
            type: 'navigate',
            label: 'Open Project Details',
            path: `/projects/${matchingProject.id}`
          }
        ],
        suggestedFollowUps: [
          'Show me active projects',
          'Which projects are behind schedule?',
          'What items are low in stock?'
        ]
      };
    }

    // 11. DEFAULT FALLBACK
    return {
      message: `I couldn't find specific matching records for "${request.query}". As your Construction ERP Assistant, I can help you inspect active civil projects, review low warehouse stock, check pending requisitions, verify open purchase orders, or summarize HR and payroll data.`,
      suggestedFollowUps: [
        'Show me active projects',
        'Which projects are behind schedule?',
        'What items are low in stock?',
        'Show pending requisitions',
        'What purchase orders are awaiting delivery?',
        'Give me a summary of this month\'s payroll',
        'Show recent business activity'
      ]
    };
  }
}

export const mockChatbotService = new MockChatbotService();
