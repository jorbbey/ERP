import { PurchaseOrder, PurchaseOrderItem } from '../types';
import { erpStorage } from './erpStorage';

export const purchaseOrderService = {
  getPurchaseOrders: (filters?: {
    status?: string;
    supplierId?: number;
    projectId?: number;
    searchTerm?: string;
  }): PurchaseOrder[] => {
    let list = erpStorage.getPurchaseOrders();

    if (!filters) return list;

    if (filters.status && filters.status !== 'all') {
      list = list.filter(p => p.status === filters.status);
    }

    if (filters.supplierId) {
      list = list.filter(p => p.supplierId === filters.supplierId);
    }

    if (filters.projectId) {
      list = list.filter(p => p.projectId === filters.projectId);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(p =>
        (p.poNumber || '').toLowerCase().includes(q) ||
        (p.supplierName || '').toLowerCase().includes(q) ||
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        (p.paymentTerms || '').toLowerCase().includes(q)
      );
    }

    return list;
  },

  getPOById: (id: number): PurchaseOrder | undefined => {
    return erpStorage.getPurchaseOrders().find(p => p.id === id);
  },

  createPurchaseOrder: (data: {
    supplierId: number;
    supplierName: string;
    supplierAddress?: string;
    supplierPhone?: string;
    projectId?: number;
    projectName?: string;
    warehouseId?: number;
    warehouseName?: string;
    expectedDelivery: string;
    paymentTerms: string;
    deliveryAddress?: string;
    notes?: string;
    requisitionId?: number;
    requisitionNo?: string;
    actorName?: string;
    actorRole?: string;
    items: Array<{
      inventoryItemId?: number;
      itemCode?: string;
      description: string;
      quantity: number;
      unit?: string;
      unitPrice: number;
      discountPercent?: number;
      taxPercent?: number;
    }>;
  }): PurchaseOrder => {
    const list = erpStorage.getPurchaseOrders();
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const poNumber = `PO-2026-0${100 + newId}`;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const formattedItems: PurchaseOrderItem[] = data.items.map((i, idx) => {
      const lineBase = i.quantity * i.unitPrice;
      const discount = i.discountPercent ? (lineBase * i.discountPercent) / 100 : 0;
      const taxable = lineBase - discount;
      const tax = i.taxPercent ? (taxable * i.taxPercent) / 100 : 0;
      const lineTotal = taxable + tax;

      subtotal += lineBase;
      totalDiscount += discount;
      totalTax += tax;

      return {
        id: idx + 1,
        inventoryItemId: i.inventoryItemId,
        itemCode: i.itemCode,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit || 'Units',
        unitPrice: i.unitPrice,
        discountPercent: i.discountPercent || 0,
        taxPercent: i.taxPercent || 0,
        total: lineTotal,
        quantityReceived: 0,
        quantityRemaining: i.quantity
      };
    });

    const grandTotal = subtotal - totalDiscount + totalTax;
    const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newPO: PurchaseOrder = {
      id: newId,
      poNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      supplierAddress: data.supplierAddress,
      supplierPhone: data.supplierPhone,
      projectId: data.projectId,
      projectName: data.projectName,
      warehouseId: data.warehouseId || 1,
      warehouseName: data.warehouseName || 'Main Yard Warehouse A - Civil Stores',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: data.expectedDelivery,
      status: 'pending_approval',
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      totalAmount: grandTotal,
      paymentTerms: data.paymentTerms,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      requisitionId: data.requisitionId,
      requisitionNo: data.requisitionNo,
      approvalHistory: [
        {
          id: 1,
          action: 'Created & Submitted',
          actorName: data.actorName || 'Procurement Officer',
          actorRole: data.actorRole || 'Procurement',
          comments: data.notes || (data.requisitionNo ? `Created from site requisition ${data.requisitionNo}.` : 'Submitted for management review and budget clearance.'),
          timestamp: nowStr
        }
      ],
      messages: [
        {
          id: 1,
          userName: 'System Bot',
          role: 'Notification',
          message: data.requisitionNo
            ? `Purchase Order generated from approved Requisition ${data.requisitionNo} for project "${data.projectName || 'Civil Site'}".`
            : `Purchase Order submitted for vendor "${data.supplierName}". Total: ₦${grandTotal.toLocaleString()}.`,
          createdAt: nowStr
        }
      ],
      items: formattedItems,
      createdAt: new Date().toISOString()
    };

    list.unshift(newPO);
    erpStorage.savePurchaseOrders(list);

    // Cross-module update: If tied to a Requisition, link the PO on that Requisition
    if (data.requisitionId || data.requisitionNo) {
      const allReqs = erpStorage.getRequisitions();
      const targetReq = allReqs.find(r => r.id === data.requisitionId || r.requisitionNo === data.requisitionNo);
      if (targetReq) {
        targetReq.purchaseOrderId = newId;
        targetReq.purchaseOrderNo = poNumber;
        if (!targetReq.messages) targetReq.messages = [];
        targetReq.messages.push({
          id: Date.now(),
          requisitionId: targetReq.id,
          userName: 'Procurement Desk',
          role: 'Procurement Officer',
          message: `Official Purchase Order ${poNumber} has been issued to ${data.supplierName} for required materials.`,
          createdAt: nowStr,
          isSystemEvent: true
        });
        erpStorage.saveRequisitions(allReqs);
      }
    }

    return newPO;
  },

  updatePOStatus: (
    id: number,
    status: PurchaseOrder['status'],
    actorName?: string,
    actorRole?: string,
    comments?: string
  ): PurchaseOrder | null => {
    const list = erpStorage.getPurchaseOrders();
    const po = list.find(p => p.id === id);
    if (!po) return null;

    po.status = status;
    const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (!po.approvalHistory) {
      po.approvalHistory = [];
    }

    if (status === 'approved') {
      po.approvedBy = actorName || 'Managing Director';
      po.approvalDate = new Date().toISOString().split('T')[0];
      po.approvalHistory.push({
        id: Date.now(),
        action: 'Executive Approval',
        actorName: actorName || 'Managing Director',
        actorRole: actorRole || 'Executive Authority',
        comments: comments || 'Purchase order verified against project budget and authorized for vendor placement.',
        timestamp: nowStr
      });
    } else if (status === 'cancelled' || status === 'rejected') {
      po.rejectionReason = comments || 'Cancelled by authorized management.';
      po.approvalHistory.push({
        id: Date.now(),
        action: 'Cancelled / Rejected',
        actorName: actorName || 'Management',
        actorRole: actorRole || 'Executive Authority',
        comments: comments || 'Order cancelled or rejected during budget review.',
        timestamp: nowStr
      });
    }

    erpStorage.savePurchaseOrders(list);
    return po;
  },

  addPOMessage: (id: number, userName: string, role: string, message: string): PurchaseOrder | null => {
    const list = erpStorage.getPurchaseOrders();
    const po = list.find(p => p.id === id);
    if (!po) return null;

    if (!po.messages) po.messages = [];
    const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    po.messages.push({
      id: Date.now(),
      userName,
      role,
      message,
      createdAt: nowStr
    });

    erpStorage.savePurchaseOrders(list);
    return po;
  }
};
