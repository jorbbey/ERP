import { LeaveRequest, LeaveBalance } from '../types';
import { erpStorage } from './erpStorage';

export const leaveService = {
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
  }): LeaveRequest => {
    const list = erpStorage.getLeaves();
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === data.employeeId);

    // Calculate days difference
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

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
      daysCount,
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

    // If approved, deduct from leave balance
    if (status === 'Approved') {
      const balances = erpStorage.getLeaveBalances();
      let empBalance = balances.find(b => b.employeeId === req.employeeId);
      if (!empBalance) {
        empBalance = {
          employeeId: req.employeeId,
          annualAllocated: 21,
          annualUsed: 0,
          annualRemaining: 21,
          sickAllocated: 12,
          sickUsed: 0,
          sickRemaining: 12,
          casualAllocated: 5,
          casualUsed: 0,
          casualRemaining: 5
        };
        balances.push(empBalance);
      }

      if (req.leaveType === 'Annual Leave') {
        empBalance.annualUsed += req.daysCount;
        empBalance.annualRemaining = Math.max(0, empBalance.annualAllocated - empBalance.annualUsed);
      } else if (req.leaveType === 'Sick Leave') {
        empBalance.sickUsed += req.daysCount;
        empBalance.sickRemaining = Math.max(0, empBalance.sickAllocated - empBalance.sickUsed);
      } else if (req.leaveType === 'Casual') {
        empBalance.casualUsed += req.daysCount;
        empBalance.casualRemaining = Math.max(0, empBalance.casualAllocated - empBalance.casualUsed);
      }

      erpStorage.saveLeaveBalances(balances);
    }

    return req;
  },

  cancelLeaveRequest: (id: number): boolean => {
    const list = erpStorage.getLeaves();
    const req = list.find(l => l.id === id);
    if (!req) return false;

    req.status = 'Cancelled';
    erpStorage.saveLeaves(list);
    return true;
  },

  getLeaveBalance: (employeeId: number): LeaveBalance => {
    const balances = erpStorage.getLeaveBalances();
    const found = balances.find(b => b.employeeId === employeeId);
    if (found) return found;

    return {
      employeeId,
      annualAllocated: 21,
      annualUsed: 0,
      annualRemaining: 21,
      sickAllocated: 12,
      sickUsed: 0,
      sickRemaining: 12,
      casualAllocated: 5,
      casualUsed: 0,
      casualRemaining: 5
    };
  }
};
