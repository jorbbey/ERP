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
    approverIds?: number[];
    approvers?: Requisition['approvers'];
    attachments?: Requisition['attachments'];
  }): Requisition => {
    const list = erpStorage.getRequisitions();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const reqNo = `REQ-2026-0${100 + newId}`;
    const chatChannelId = `req-${reqNo.toLowerCase()}`;

    const computedTotal = data.items.reduce((acc, i) => {
      const lineVal = i.value !== undefined ? i.value : (i.price ? i.price * i.quantityRequired : 0);
      return acc + lineVal;
    }, 0);

    const approverNames = data.approvers && data.approvers.length > 0
      ? data.approvers.map(a => `${a.name} (${a.role})`).join(', ')
      : 'Executive Review Board';

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
      totalEstimatedAmount: data.totalEstimatedAmount !== undefined ? data.totalEstimatedAmount : computedTotal,
      approverIds: data.approverIds,
      approvers: data.approvers,
      chatChannelId,
      attachments: data.attachments,
      remarks: data.remarks,
      messages: [
        {
          id: 1,
          requisitionId: newId,
          userName: 'Apex System',
          role: 'System Notification',
          message: `Dedicated group coordination thread opened for ${reqNo}. Participants tagged: ${data.requestedBy} (Requester) & [${approverNames}].`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystemEvent: true
        },
        {
          id: 2,
          requisitionId: newId,
          userName: data.requestedBy,
          role: data.actorRole || 'Site Engineer',
          message: `Requisition ${reqNo} formally drafted and submitted for site material review. Ready for review and feedback.`,
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
          comments: `Initial submission of requirement for active construction works. Designated approvers: ${approverNames}.`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ]
    };

    list.unshift(newReq);
    erpStorage.saveRequisitions(list);

    // Sync to main enterprise chat messages as well
    const allChat = erpStorage.getChatMessages();
    allChat.push({
      id: Date.now(),
      channelId: chatChannelId,
      sender: 'System Notice',
      role: 'System',
      message: `Group coordination thread initialized for ${reqNo} (${newReq.title}). Participants: ${data.requestedBy} and ${approverNames}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    erpStorage.saveChatMessages(allChat);

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

    // Prevent duplicate decisions
    if (req.status === 'Approved' && status === 'Approved') {
      return req;
    }
    if (req.status === 'Rejected' && status === 'Rejected') {
      return req;
    }

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

    // Add automated audit message to group discussion
    if (!req.messages) req.messages = [];
    const actionLabel = status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : status;
    const icon = status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : 'ℹ️';
    req.messages.push({
      id: req.messages.length + 1,
      requisitionId: req.id,
      userName: actorName,
      role: actorRole,
      message: `${icon} Requisition decision: ${actionLabel.toUpperCase()} by ${actorName} (${actorRole}). Note: ${comments || 'No remarks provided.'}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemEvent: true
    });

    list[index] = req;
    erpStorage.saveRequisitions(list);

    // Sync to main chat if channel exists
    if (req.chatChannelId) {
      const allChat = erpStorage.getChatMessages();
      allChat.push({
        id: Date.now(),
        channelId: req.chatChannelId,
        sender: actorName,
        role: actorRole,
        message: `${icon} Requisition ${req.requisitionNo} ${actionLabel}. Note: ${comments || 'No remarks'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      erpStorage.saveChatMessages(allChat);
    }

    return req;
  },

  flagForClarification: (
    id: number,
    actorName: string,
    actorRole: string,
    clarificationReason: string
  ): Requisition | null => {
    const list = erpStorage.getRequisitions();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;

    const req = list[index];
    req.status = 'Flagged for Clarification';
    req.flagReason = clarificationReason;
    req.flaggedBy = actorName;
    req.flaggedDate = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Add to approval history audit trail
    if (!req.approvalHistory) req.approvalHistory = [];
    req.approvalHistory.push({
      id: req.approvalHistory.length + 1,
      level: 'Review Evaluation',
      action: 'Flagged for Clarification',
      actorName,
      actorRole,
      comments: clarificationReason,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    // Add to group conversation
    if (!req.messages) req.messages = [];
    req.messages.push({
      id: req.messages.length + 1,
      requisitionId: req.id,
      userName: actorName,
      role: actorRole,
      message: `⚠️ FLAGGED FOR CLARIFICATION: "${clarificationReason}". Action required by requester before approval can proceed.`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemEvent: true
    });

    list[index] = req;
    erpStorage.saveRequisitions(list);

    // Sync to main enterprise chat
    if (req.chatChannelId) {
      const allChat = erpStorage.getChatMessages();
      allChat.push({
        id: Date.now(),
        channelId: req.chatChannelId,
        sender: actorName,
        role: actorRole,
        message: `⚠️ Requisition ${req.requisitionNo} FLAGGED FOR CLARIFICATION: "${clarificationReason}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      erpStorage.saveChatMessages(allChat);
    }

    return req;
  },

  provideClarification: (
    id: number,
    actorName: string,
    actorRole: string,
    clarificationResponse: string
  ): Requisition | null => {
    const list = erpStorage.getRequisitions();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;

    const req = list[index];
    req.status = 'Pending Review'; // Return to pending review for approver

    // Add to approval history
    if (!req.approvalHistory) req.approvalHistory = [];
    req.approvalHistory.push({
      id: req.approvalHistory.length + 1,
      level: 'Requester Response',
      action: 'Clarification Provided',
      actorName,
      actorRole,
      comments: clarificationResponse,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    // Add message
    if (!req.messages) req.messages = [];
    req.messages.push({
      id: req.messages.length + 1,
      requisitionId: req.id,
      userName: actorName,
      role: actorRole,
      message: `💬 CLARIFICATION PROVIDED: "${clarificationResponse}". Status returned to Pending Review for approver action.`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    list[index] = req;
    erpStorage.saveRequisitions(list);

    // Sync to main enterprise chat
    if (req.chatChannelId) {
      const allChat = erpStorage.getChatMessages();
      allChat.push({
        id: Date.now(),
        channelId: req.chatChannelId,
        sender: actorName,
        role: actorRole,
        message: `💬 Clarification for ${req.requisitionNo}: "${clarificationResponse}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      erpStorage.saveChatMessages(allChat);
    }

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

    // Also mirror to main enterprise chat channel
    if (req.chatChannelId) {
      const allChat = erpStorage.getChatMessages();
      allChat.push({
        id: Date.now(),
        channelId: req.chatChannelId,
        sender: userName,
        role,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      erpStorage.saveChatMessages(allChat);
    }

    return newMsg;
  }
};
