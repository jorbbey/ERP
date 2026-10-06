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
        p.poNumber.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        p.paymentTerms.toLowerCase().includes(q)
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
      items: formattedItems,
      createdAt: new Date().toISOString()
    };

    list.unshift(newPO);
    erpStorage.savePurchaseOrders(list);
    return newPO;
  },

  updatePOStatus: (
    id: number,
    status: PurchaseOrder['status'],
    actorName?: string,
    rejectionReason?: string
  ): PurchaseOrder | null => {
    const list = erpStorage.getPurchaseOrders();
    const po = list.find(p => p.id === id);
    if (!po) return null;

    po.status = status;
    if (status === 'approved') {
      po.approvedBy = actorName || 'Managing Director';
      po.approvalDate = new Date().toISOString().split('T')[0];
    } else if (status === 'cancelled') {
      po.rejectionReason = rejectionReason || 'Cancelled by authorized management.';
    }

    erpStorage.savePurchaseOrders(list);
    return po;
  }
};
