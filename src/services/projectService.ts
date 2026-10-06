import {
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
  ProjectActivity
} from '../types';
import { erpStorage } from './erpStorage';

export const projectService = {
  // Projects
  getAllProjects: (): Project[] => erpStorage.getProjects(),
  getProjectById: (id: number): Project | undefined => {
    return erpStorage.getProjects().find(p => p.id === id);
  },
  saveProjects: (projects: Project[]): void => {
    erpStorage.saveProjects(projects);
  },

  // Customers
  getCustomers: (): Customer[] => erpStorage.getCustomers(),
  saveCustomers: (customers: Customer[]): void => {
    erpStorage.saveCustomers(customers);
  },

  // Labour Budgets
  getLabourBudgets: (projectId?: number): ProjectLabourBudget[] => {
    const all = erpStorage.getProjectLabourBudgets();
    return projectId ? all.filter(l => l.projectId === projectId) : all;
  },
  saveLabourBudgets: (budgets: ProjectLabourBudget[]): void => {
    erpStorage.saveProjectLabourBudgets(budgets);
  },

  // Material Budgets
  getMaterialBudgets: (projectId?: number): ProjectMaterialBudget[] => {
    const all = erpStorage.getProjectMaterialBudgets();
    return projectId ? all.filter(m => m.projectId === projectId) : all;
  },
  saveMaterialBudgets: (budgets: ProjectMaterialBudget[]): void => {
    erpStorage.saveProjectMaterialBudgets(budgets);
  },

  // Milestones
  getMilestones: (projectId?: number): ProjectMilestone[] => {
    const all = erpStorage.getProjectMilestones();
    return projectId ? all.filter(m => m.projectId === projectId) : all;
  },
  saveMilestones: (milestones: ProjectMilestone[]): void => {
    erpStorage.saveProjectMilestones(milestones);
  },

  // Tasks
  getTasks: (projectId?: number): ProjectTask[] => {
    const all = erpStorage.getProjectTasks();
    return projectId ? all.filter(t => t.projectId === projectId) : all;
  },
  saveTasks: (tasks: ProjectTask[]): void => {
    erpStorage.saveProjectTasks(tasks);
  },

  // Project Staff & History
  getStaff: (projectId?: number): ProjectStaffAssignment[] => {
    const all = erpStorage.getProjectStaff();
    return projectId ? all.filter(s => s.projectId === projectId) : all;
  },
  saveStaff: (staff: ProjectStaffAssignment[]): void => {
    erpStorage.saveProjectStaff(staff);
  },
  getStaffHistory: (projectId?: number): ProjectStaffHistory[] => {
    const all = erpStorage.getProjectStaffHistory();
    return projectId ? all.filter(h => h.projectId === projectId) : all;
  },
  saveStaffHistory: (history: ProjectStaffHistory[]): void => {
    erpStorage.saveProjectStaffHistory(history);
  },

  // Delay Notes
  getDelayNotes: (projectId?: number): ProjectDelayNote[] => {
    const all = erpStorage.getProjectDelayNotes();
    return projectId ? all.filter(n => n.projectId === projectId) : all;
  },
  saveDelayNotes: (notes: ProjectDelayNote[]): void => {
    erpStorage.saveProjectDelayNotes(notes);
  },

  // Quality Assurance
  getQualityAssurance: (projectId?: number): ProjectQualityAssurance[] => {
    const all = erpStorage.getQualityAssurance();
    return projectId ? all.filter(q => q.projectId === projectId) : all;
  },
  saveQualityAssurance: (qa: ProjectQualityAssurance[]): void => {
    erpStorage.saveQualityAssurance(qa);
  },

  // Project Invoices
  getInvoices: (projectId?: number): ProjectInvoice[] => {
    const all = erpStorage.getProjectInvoices();
    return projectId ? all.filter(i => i.projectId === projectId) : all;
  },
  saveInvoices: (invoices: ProjectInvoice[]): void => {
    erpStorage.saveProjectInvoices(invoices);
  },

  // Daily Site Reports
  getDailySiteReports: (projectId?: number): DailySiteReport[] => {
    const all = erpStorage.getDailySiteReports();
    return projectId ? all.filter(r => r.projectId === projectId) : all;
  },
  saveDailySiteReports: (reports: DailySiteReport[]): void => {
    erpStorage.saveDailySiteReports(reports);
  },

  // Financial Calculations
  calculateFinancials: (project: Project, budgets: ProjectBudget[], invoices: ProjectInvoice[]) => {
    const projectBudgetsTotal = budgets
      .filter(b => b.projectId === project.id)
      .reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);

    const projectInvoicedTotal = invoices
      .filter(i => i.projectId === project.id)
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const projectPaidTotal = invoices
      .filter(i => i.projectId === project.id)
      .reduce((sum, i) => sum + i.paidAmount, 0);

    const remainingBudget = project.budget - project.spent;
    const profitMargin = project.contractValue - project.budget;
    const profitMarginPercent = project.contractValue > 0
      ? Math.round((profitMargin / project.contractValue) * 100)
      : 0;

    const burnRatePercent = project.budget > 0
      ? Math.round((project.spent / project.budget) * 100)
      : 0;

    return {
      contractValue: project.contractValue,
      budget: project.budget,
      totalBOQCost: projectBudgetsTotal > 0 ? projectBudgetsTotal : project.budget,
      actualSpent: project.spent,
      remainingBudget,
      profitMargin,
      profitMarginPercent,
      burnRatePercent,
      totalInvoiced: projectInvoicedTotal,
      totalPaid: projectPaidTotal,
      outstandingReceivables: projectInvoicedTotal - projectPaidTotal
    };
  }
};
