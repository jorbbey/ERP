import { GoodsReceivedNote, GRNItem, StockMovement } from '../types';
import { erpStorage } from './erpStorage';

export const grnService = {
  getGRNs: (filters?: {
    status?: string;
    supplierId?: number;
    warehouseId?: number;
    searchTerm?: string;
  }): GoodsReceivedNote[] => {
    let list = erpStorage.getGoodsReceivedNotes();

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter(g => g.status === filters.status);
    }

    if (filters.supplierId) {
      list = list.filter(g => g.supplierId === filters.supplierId);
    }

    if (filters.warehouseId) {
      list = list.filter(g => g.warehouseId === filters.warehouseId);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(g =>
        g.grnNumber.toLowerCase().includes(q) ||
        g.poNumber.toLowerCase().includes(q) ||
        g.supplierName.toLowerCase().includes(q) ||
        g.warehouseName.toLowerCase().includes(q) ||
        g.receivedBy.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getGRNById: (id: number): GoodsReceivedNote | undefined => {
    return erpStorage.getGoodsReceivedNotes().find(g => g.id === id);
  },

  createGRN: (data: {
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
    qcInspectionStatus: 'Passed' | 'Passed with Conditions' | 'Failed';
    remarks?: string;
    items: Array<{
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
    }>;
  }): { success: boolean; grn?: GoodsReceivedNote; error?: string } => {
    const list = erpStorage.getGoodsReceivedNotes();
    const newId = list.length > 0 ? Math.max(...list.map(g => g.id)) + 1 : 1;
    const grnNumber = `GRN-2026-0${10 + newId}`;

    let totalVal = 0;
    const grnItems: GRNItem[] = data.items.map((i, idx) => {
      const lineTotal = i.quantityAccepted * i.unitPrice;
      totalVal += lineTotal;
      return {
        id: idx + 1,
        inventoryItemId: i.inventoryItemId,
        itemCode: i.itemCode,
        description: i.description,
        unit: i.unit,
        quantityOrdered: i.quantityOrdered,
        quantityPreviouslyReceived: i.quantityPreviouslyReceived,
        quantityReceived: i.quantityReceived,
        quantityAccepted: i.quantityAccepted,
        quantityRejected: i.quantityRejected,
        rejectionReason: i.rejectionReason,
        unitPrice: i.unitPrice,
        lineTotal
      };
    });

    const isRejected = data.qcInspectionStatus === 'Failed' || grnItems.every(i => i.quantityAccepted === 0);
    const grnStatus: GoodsReceivedNote['status'] = isRejected
      ? 'rejected'
      : grnItems.some(i => i.quantityRejected > 0)
        ? 'partially_accepted'
        : 'inspected_received';

    const newGRN: GoodsReceivedNote = {
      id: newId,
      grnNumber,
      purchaseOrderId: data.purchaseOrderId,
      poNumber: data.poNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      warehouseId: data.warehouseId,
      warehouseName: data.warehouseName,
      receivedDate: data.receivedDate || new Date().toISOString().split('T')[0],
      receivedBy: data.receivedBy,
      inspectedBy: data.inspectedBy,
      vendorDeliveryNote: data.vendorDeliveryNote,
      waybillRef: data.waybillRef,
      vehicleNumber: data.vehicleNumber,
      status: grnStatus,
      qcInspectionStatus: data.qcInspectionStatus,
      remarks: data.remarks,
      items: grnItems,
      totalReceivedValue: totalVal,
      createdAt: new Date().toISOString()
    };

    // 1. Update Inventory Stock for accepted quantities
    const inventory = erpStorage.getInventory();
    const movements = erpStorage.getStockMovements();

    grnItems.forEach(item => {
      if (item.quantityAccepted > 0) {
        // Find matching inventory item
        let invItem = inventory.find(i => 
          (item.inventoryItemId && i.id === item.inventoryItemId) || 
          (item.itemCode && i.itemCode.toLowerCase() === item.itemCode.toLowerCase())
        );

        if (invItem) {
          invItem.currentStock += item.quantityAccepted;
          if (invItem.currentStock > invItem.minLevel) {
            invItem.status = 'active';
          } else if (invItem.currentStock > 0) {
            invItem.status = 'low_stock';
          }
        }

        // Record Stock Movement (Receipt)
        const movRef = `SM-REC-${Date.now().toString().slice(-6)}`;
        const movement: StockMovement = {
          id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
          referenceNumber: movRef,
          movementType: 'receipt',
          itemId: invItem?.id || 1,
          itemCode: item.itemCode || invItem?.itemCode || 'MAT-GEN',
          itemName: item.description,
          quantity: item.quantityAccepted,
          unit: item.unit,
          source: data.supplierName,
          destination: data.warehouseName,
          warehouseId: data.warehouseId,
          warehouseName: data.warehouseName,
          performedBy: data.receivedBy,
          movementDate: data.receivedDate,
          reason: `Goods receipt against ${data.poNumber} (${grnNumber})`,
          relatedDocumentType: 'GRN',
          relatedDocumentRef: grnNumber,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        movements.unshift(movement);
      }
    });

    erpStorage.saveInventory(inventory);
    erpStorage.saveStockMovements(movements);

    // 2. Update Purchase Order Status & Received Quantities
    const pos = erpStorage.getPurchaseOrders();
    const po = pos.find(p => p.id === data.purchaseOrderId);
    if (po) {
      let allFullyReceived = true;
      let anyReceived = false;

      po.items.forEach(poItem => {
        const receivedItem = grnItems.find(g => 
          (g.itemCode && poItem.itemCode && g.itemCode === poItem.itemCode) ||
          g.description.toLowerCase().trim() === poItem.description.toLowerCase().trim()
        );

        if (receivedItem) {
          poItem.quantityReceived = (poItem.quantityReceived || 0) + receivedItem.quantityAccepted;
          poItem.quantityRemaining = Math.max(0, poItem.quantity - poItem.quantityReceived);
        }

        if ((poItem.quantityReceived || 0) < poItem.quantity) {
          allFullyReceived = false;
        }
        if ((poItem.quantityReceived || 0) > 0) {
          anyReceived = true;
        }
      });

      po.status = allFullyReceived ? 'received' : anyReceived ? 'partially_received' : po.status;
      erpStorage.savePurchaseOrders(pos);
    }

    // 3. Save GRN
    list.unshift(newGRN);
    erpStorage.saveGoodsReceivedNotes(list);

    return { success: true, grn: newGRN };
  }
};
