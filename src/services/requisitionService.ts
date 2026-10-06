import { Requisition, RequisitionItem, RequisitionMessage } from '../types';
import { erpStorage } from './erpStorage';

export const requisitionService = {
  getRequisitions: (filters?: {
    status?: string;
    projectId?: number;
    priority?: string;
    searchTerm?: string;
  }): Requisition[] => {
    let list = erpStorage.getRequisitions();

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter(r => r.status === filters.status);
    }

    if (filters.projectId) {
      list = list.filter(r => r.projectId === filters.projectId);
    }

    if (filters.priority && filters.priority !== 'All') {
      list = list.filter(r => r.priority === filters.priority);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(r =>
        r.requisitionNo.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.requestedBy.toLowerCase().includes(q) ||
        (r.department && r.department.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getRequisitionById: (id: number): Requisition | undefined => {
    return erpStorage.getRequisitions().find(r => r.id === id);
  },

  createRequisition: (data: {
    projectId: number;
    projectName: string;
    requestedBy: string;
    department?: string;
    priority: Requisition['priority'];
    title: string;
    trade?: string;
    supplier?: string;
    supplierAddress?: string;
    description?: string;
    items: RequisitionItem[];
    totalEstimatedAmount?: number;
    remarks?: string;
    actorRole?: string;
  }): Requisition => {
    const list = erpStorage.getRequisitions();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const reqNo = `REQ-2026-0${100 + newId}`;

    const computedTotal = data.items.reduce((acc, i) => acc + (i.value || (i.price * i.quantityRequired)), 0);

    const newReq: Requisition = {
      id: newId,
      requisitionNo: reqNo,
      companyId: 1,
      projectId: data.projectId,
      projectName: data.projectName,
      requestedBy: data.requestedBy,
      department: data.department || 'Civil Engineering & Construction',
      requisitionDate: new Date().toISOString().split('T')[0],
      priority: data.priority,
      status: 'Pending Review',
      title: data.title || `Material Requisition for ${data.projectName}`,
      trade: data.trade,
      supplier: data.supplier,
      supplierAddress: data.supplierAddress,
      description: data.description,
      items: data.items.map((item, idx) => ({
        ...item,
        id: item.id || idx + 1,
        requisitionId: newId,
        quantityApproved: item.quantityApproved ?? item.quantityRequired,
        quantityDispatched: item.quantityDispatched ?? 0,
        status: 'pending'
      })),
      totalEstimatedAmount: data.totalEstimatedAmount || computedTotal,
      remarks: data.remarks,
      messages: [
        {
          id: 1,
          requisitionId: newId,
          userName: data.requestedBy,
          role: data.actorRole || 'Site Engineer',
          message: `Requisition ${reqNo} formally drafted and submitted for executive site material approval.`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      approvalHistory: [
        {
          id: 1,
          level: 'Level 1 - Site Generation',
          action: 'Submitted',
          actorName: data.requestedBy,
          actorRole: data.actorRole || 'Site Engineer',
          comments: 'Initial submission of bill of quantities required for active construction works.',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ]
    };

    list.unshift(newReq);
    erpStorage.saveRequisitions(list);
    return newReq;
  },

  updateStatus: (
    id: number,
    status: Requisition['status'],
    actorName: string,
    actorRole: string,
    comments?: string
  ): Requisition | null => {
    const list = erpStorage.getRequisitions();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;

    const req = list[index];
    req.status = status;

    if (status === 'Approved') {
      req.approvedBy = actorName;
      req.approvalDate = new Date().toISOString().split('T')[0];
      req.items.forEach(i => {
        i.quantityApproved = i.quantityRequired;
        i.status = 'approved';
      });
    } else if (status === 'Rejected') {
      req.rejectionReason = comments || 'Rejected by reviewing management authority.';
      req.items.forEach(i => {
        i.status = 'rejected';
      });
    }

    // Add to history
    if (!req.approvalHistory) req.approvalHistory = [];
    req.approvalHistory.push({
      id: req.approvalHistory.length + 1,
      level: status === 'Approved' ? 'Level 2 - Executive Approval' : 'Workflow Transition',
      action: status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : status === 'Dispatched' ? 'Dispatched' : 'Created',
      actorName,
      actorRole,
      comments: comments || `Status transitioned to ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    list[index] = req;
    erpStorage.saveRequisitions(list);
    return req;
  },

  addMessage: (
    requisitionId: number,
    userName: string,
    role: string,
    message: string
  ): RequisitionMessage | null => {
    const list = erpStorage.getRequisitions();
    const req = list.find(r => r.id === requisitionId);
    if (!req) return null;

    if (!req.messages) req.messages = [];
    const newMsg: RequisitionMessage = {
      id: req.messages.length + 1,
      requisitionId,
      userName,
      role,
      message,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    req.messages.push(newMsg);
    erpStorage.saveRequisitions(list);
    return newMsg;
  }
};
