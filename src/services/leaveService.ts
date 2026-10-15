import { LeaveRequest, LeaveBalance, CompanyLeavePolicy } from '../types';
import { erpStorage } from './erpStorage';

const LEAVE_POLICY_KEY = 'construction_erp_company_leave_policy';

export const defaultCompanyLeavePolicy: CompanyLeavePolicy = {
  companyId: 1,
  leaveYear: 2026,
  defaultAnnualDays: 30, // Configurable company standard (e.g. 30 calendar days)
  leaveUnit: 'calendar_days', // 'calendar_days' | 'working_days'
  allowUnpaidOverflow: true,
  requireApprovalForUnpaid: true
};

export const leaveService = {
  getCompanyLeavePolicy: (companyId = 1): CompanyLeavePolicy => {
    try {
      const stored = localStorage.getItem(`${LEAVE_POLICY_KEY}_${companyId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse leave policy:', e);
    }
    return defaultCompanyLeavePolicy;
  },

  updateCompanyLeavePolicy: (
    policy: Partial<CompanyLeavePolicy>,
    companyId = 1
  ): CompanyLeavePolicy => {
    const current = leaveService.getCompanyLeavePolicy(companyId);
    const updated: CompanyLeavePolicy = { ...current, ...policy, companyId };
    try {
      localStorage.setItem(`${LEAVE_POLICY_KEY}_${companyId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update leave policy:', e);
    }
    return updated;
  },

  calculateLeaveDays: (
    startDate: string,
    endDate: string,
    unit: 'calendar_days' | 'working_days' = 'calendar_days'
  ): number => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;

    if (unit === 'calendar_days') {
      const diffTime = end.getTime() - start.getTime();
      return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);
    }

    // Working days calculation (Monday to Friday, skipping Sat/Sun)
    let workingDays = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, workingDays);
  },

  calculateLeaveBreakdown: (
    employeeId: number,
    startDate: string,
    endDate: string,
    leaveType: LeaveRequest['leaveType'],
    companyId = 1
  ): {
    totalDays: number;
    paidDays: number;
    unpaidDays: number;
    isOverflow: boolean;
    remainingPaidBefore: number;
    remainingPaidAfter: number;
    policyUnit: 'calendar_days' | 'working_days';
  } => {
    const policy = leaveService.getCompanyLeavePolicy(companyId);
    const totalDays = leaveService.calculateLeaveDays(startDate, endDate, policy.leaveUnit);
    const balance = leaveService.getLeaveBalance(employeeId, companyId);
    const remainingPaidBefore = balance.annualRemaining;

    if (leaveType === 'Unpaid Leave') {
      return {
        totalDays,
        paidDays: 0,
        unpaidDays: totalDays,
        isOverflow: true,
        remainingPaidBefore,
        remainingPaidAfter: remainingPaidBefore,
        policyUnit: policy.leaveUnit
      };
    }

    if (leaveType === 'Annual Leave') {
      if (totalDays <= remainingPaidBefore) {
        return {
          totalDays,
          paidDays: totalDays,
          unpaidDays: 0,
          isOverflow: false,
          remainingPaidBefore,
          remainingPaidAfter: remainingPaidBefore - totalDays,
          policyUnit: policy.leaveUnit
        };
      } else {
        const paidDays = Math.max(0, remainingPaidBefore);
        const unpaidDays = totalDays - paidDays;
        return {
          totalDays,
          paidDays,
          unpaidDays,
          isOverflow: true,
          remainingPaidBefore,
          remainingPaidAfter: 0,
          policyUnit: policy.leaveUnit
        };
      }
    }

    // Other paid categories (Sick, Casual, etc.)
    return {
      totalDays,
      paidDays: totalDays,
      unpaidDays: 0,
      isOverflow: false,
      remainingPaidBefore,
      remainingPaidAfter: remainingPaidBefore,
      policyUnit: policy.leaveUnit
    };
  },

  getLeaveRequests: (filters?: {
    employeeId?: number;
    department?: string;
    status?: string;
    leaveType?: string;
    searchTerm?: string;
  }): LeaveRequest[] => {
    let list = erpStorage.getLeaves();

    if (!filters) return list;

    if (filters.employeeId) {
      list = list.filter(l => l.employeeId === filters.employeeId);
    }

    if (filters.department && filters.department !== 'All') {
      list = list.filter(l => l.department === filters.department);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(l => l.status === filters.status);
    }

    if (filters.leaveType && filters.leaveType !== 'All') {
      list = list.filter(l => l.leaveType === filters.leaveType);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(l =>
        l.employeeName.toLowerCase().includes(q) ||
        l.employeeCode.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q)
      );
    }

    return list;
  },

  createLeaveRequest: (data: {
    employeeId: number;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
    companyId?: number;
  }): LeaveRequest => {
    const list = erpStorage.getLeaves();
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === data.employeeId);

    const breakdown = leaveService.calculateLeaveBreakdown(
      data.employeeId,
      data.startDate,
      data.endDate,
      data.leaveType,
      data.companyId || 1
    );

    const newId = list.length > 0 ? Math.max(...list.map(l => l.id)) + 1 : 1;
    const newRequest: LeaveRequest = {
      id: newId,
      employeeId: data.employeeId,
      employeeName: emp?.name || 'Staff Member',
      employeeCode: emp?.code || 'EMP-GEN',
      department: emp?.department || 'Operations',
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: breakdown.totalDays,
      paidDays: breakdown.paidDays,
      unpaidDays: breakdown.unpaidDays,
      leaveYear: 2026,
      reason: data.reason,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    list.unshift(newRequest);
    erpStorage.saveLeaves(list);
    return newRequest;
  },

  decideLeaveRequest: (
    id: number,
    status: 'Approved' | 'Rejected',
    approverName: string,
    comments?: string,
    rejectionReason?: string
  ): LeaveRequest | null => {
    const list = erpStorage.getLeaves();
    const req = list.find(l => l.id === id);
    if (!req) return null;

    req.status = status;
    req.approvedBy = approverName;
    req.approvalDate = new Date().toISOString().split('T')[0];
    if (comments) req.comments = comments;
    if (rejectionReason) req.rejectionReason = rejectionReason;

    erpStorage.saveLeaves(list);

    // Synchronize Leave Balance based authoritatively on Approved requests
    leaveService.recalculateEmployeeBalance(req.employeeId);

    return req;
  },

  cancelLeaveRequest: (id: number): boolean => {
    const list = erpStorage.getLeaves();
    const req = list.find(l => l.id === id);
    if (!req) return false;

    req.status = 'Cancelled';
    erpStorage.saveLeaves(list);
    leaveService.recalculateEmployeeBalance(req.employeeId);
    return true;
  },

  setEmployeeCustomEntitlement: (
    employeeId: number,
    customDays: number,
    notes?: string,
    companyId = 1
  ): LeaveBalance => {
    const balances = erpStorage.getLeaveBalances();
    let empBal = balances.find(b => b.employeeId === employeeId);
    if (!empBal) {
      empBal = leaveService.getLeaveBalance(employeeId, companyId);
      balances.push(empBal);
    }

    empBal.isCustomEntitlement = true;
    empBal.customEntitlementDays = customDays;
    empBal.annualAllocated = customDays;
    empBal.entitlementNotes = notes;

    erpStorage.saveLeaveBalances(balances);
    return leaveService.recalculateEmployeeBalance(employeeId, companyId);
  },

  recalculateEmployeeBalance: (employeeId: number, companyId = 1): LeaveBalance => {
    const balances = erpStorage.getLeaveBalances();
    const policy = leaveService.getCompanyLeavePolicy(companyId);
    const allLeaves = erpStorage.getLeaves().filter(l => l.employeeId === employeeId);

    let empBalance = balances.find(b => b.employeeId === employeeId);
    if (!empBalance) {
      empBalance = {
        employeeId,
        leaveYear: policy.leaveYear,
        leaveUnit: policy.leaveUnit,
        annualAllocated: policy.defaultAnnualDays,
        annualUsed: 0,
        annualRemaining: policy.defaultAnnualDays,
        annualApprovedPaidTaken: 0,
        annualPendingRequested: 0,
        unpaidLeaveDays: 0,
        sickAllocated: 12,
        sickUsed: 0,
        sickRemaining: 12,
        casualAllocated: 5,
        casualUsed: 0,
        casualRemaining: 5
      };
      balances.push(empBalance);
    }

    // Determine configured allocated days (custom exception or default policy)
    const annualAllocated = empBalance.isCustomEntitlement && empBalance.customEntitlementDays !== undefined
      ? empBalance.customEntitlementDays
      : policy.defaultAnnualDays;

    empBalance.annualAllocated = annualAllocated;
    empBalance.leaveYear = policy.leaveYear;
    empBalance.leaveUnit = policy.leaveUnit;

    // Tally APPROVED requests only for reducing entitlement
    const approvedAnnual = allLeaves.filter(
      l => l.status === 'Approved' && l.leaveType === 'Annual Leave'
    );
    const approvedPaidTaken = approvedAnnual.reduce((sum, l) => sum + (l.paidDays !== undefined ? l.paidDays : l.daysCount), 0);
    const approvedUnpaidDays = allLeaves
      .filter(l => l.status === 'Approved')
      .reduce((sum, l) => sum + (l.unpaidDays || (l.leaveType === 'Unpaid Leave' ? l.daysCount : 0)), 0);

    // Tally PENDING requests (tracking them without deducting from official entitlement)
    const pendingAnnual = allLeaves.filter(
      l => l.status === 'Pending' && (l.leaveType === 'Annual Leave' || l.leaveType === 'Unpaid Leave')
    );
    const pendingRequested = pendingAnnual.reduce((sum, l) => sum + l.daysCount, 0);

    empBalance.annualApprovedPaidTaken = approvedPaidTaken;
    empBalance.annualUsed = approvedPaidTaken;
    empBalance.annualRemaining = Math.max(0, annualAllocated - approvedPaidTaken);
    empBalance.annualPendingRequested = pendingRequested;
    empBalance.unpaidLeaveDays = approvedUnpaidDays;

    // Sick and Casual tallies
    const approvedSick = allLeaves.filter(l => l.status === 'Approved' && l.leaveType === 'Sick Leave');
    empBalance.sickUsed = approvedSick.reduce((sum, l) => sum + l.daysCount, 0);
    empBalance.sickRemaining = Math.max(0, empBalance.sickAllocated - empBalance.sickUsed);

    const approvedCasual = allLeaves.filter(l => l.status === 'Approved' && l.leaveType === 'Casual');
    empBalance.casualUsed = approvedCasual.reduce((sum, l) => sum + l.daysCount, 0);
    empBalance.casualRemaining = Math.max(0, empBalance.casualAllocated - empBalance.casualUsed);

    erpStorage.saveLeaveBalances(balances);
    return empBalance;
  },

  getLeaveBalance: (employeeId: number, companyId = 1): LeaveBalance => {
    const balances = erpStorage.getLeaveBalances();
    const found = balances.find(b => b.employeeId === employeeId);
    if (found) {
      return leaveService.recalculateEmployeeBalance(employeeId, companyId);
    }

    const policy = leaveService.getCompanyLeavePolicy(companyId);
    const newBal: LeaveBalance = {
      employeeId,
      leaveYear: policy.leaveYear,
      leaveUnit: policy.leaveUnit,
      annualAllocated: policy.defaultAnnualDays,
      annualUsed: 0,
      annualRemaining: policy.defaultAnnualDays,
      annualApprovedPaidTaken: 0,
      annualPendingRequested: 0,
      unpaidLeaveDays: 0,
      sickAllocated: 12,
      sickUsed: 0,
      sickRemaining: 12,
      casualAllocated: 5,
      casualUsed: 0,
      casualRemaining: 5
    };
    balances.push(newBal);
    erpStorage.saveLeaveBalances(balances);
    return leaveService.recalculateEmployeeBalance(employeeId, companyId);
  }
};
