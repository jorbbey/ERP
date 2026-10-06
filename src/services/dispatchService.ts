import { RequisitionDispatchRequest, Waybill, StockMovement } from '../types';
import { erpStorage } from './erpStorage';

export const dispatchService = {
  getRequests: (): RequisitionDispatchRequest[] => erpStorage.getDispatchRequests(),

  createRequest: (data: Omit<RequisitionDispatchRequest, 'id' | 'requestedAt' | 'status'>): RequisitionDispatchRequest => {
    const list = erpStorage.getDispatchRequests();
    const newId = list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1;
    const item: RequisitionDispatchRequest = {
      ...data,
      id: newId,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    list.unshift(item);
    erpStorage.saveDispatchRequests(list);
    return item;
  },

  executeDispatch: (params: {
    dispatchRequestId?: number;
    requisitionId: number;
    requisitionNo: string;
    inventoryItemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    destinationProjectId: number;
    destinationProjectName: string;
    carrierName: string;
    vehicleNumber: string;
    driverPhone?: string;
    dispatchedBy: string;
    notes?: string;
  }): { success: boolean; waybill?: Waybill; error?: string } => {
    const inventory = erpStorage.getInventory();
    const item = inventory.find(i => i.id === params.inventoryItemId);

    if (!item) {
      return { success: false, error: 'Inventory material SKU not found.' };
    }

    if (item.currentStock < params.quantity) {
      return {
        success: false,
        error: `Insufficient stock in stores. Current available: ${item.currentStock} ${item.unit}, Attempted dispatch: ${params.quantity} ${item.unit}.`
      };
    }

    // 1. Deduct Stock
    item.currentStock -= params.quantity;
    if (item.currentStock <= 0) {
      item.status = 'out_of_stock';
    } else if (item.currentStock <= item.minLevel) {
      item.status = 'low_stock';
    }
    erpStorage.saveInventory(inventory);

    // 2. Record Stock Movement (Issue)
    const movements = erpStorage.getStockMovements();
    const movRef = `SM-ISS-${Date.now().toString().slice(-6)}`;
    const movement: StockMovement = {
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      referenceNumber: movRef,
      movementType: 'issue',
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      quantity: params.quantity,
      unit: item.unit,
      source: params.sourceWarehouseName,
      destination: params.destinationProjectName,
      warehouseId: params.sourceWarehouseId,
      warehouseName: params.sourceWarehouseName,
      projectId: params.destinationProjectId,
      projectName: params.destinationProjectName,
      performedBy: params.dispatchedBy,
      movementDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: `Site material issuance against Requisition ${params.requisitionNo}`,
      relatedDocumentType: 'Waybill',
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    movements.unshift(movement);
    erpStorage.saveStockMovements(movements);

    // 3. Update Requisition
    const requisitions = erpStorage.getRequisitions();
    const req = requisitions.find(r => r.id === params.requisitionId);
    if (req) {
      req.status = 'Dispatched';
      req.dispatchNote = `Dispatched ${params.quantity} ${item.unit} via ${params.carrierName} (${params.vehicleNumber})`;
      const reqItem = req.items.find(i => i.inventoryItemId === params.inventoryItemId || i.itemCode === item.itemCode);
      if (reqItem) {
        reqItem.quantityDispatched = (reqItem.quantityDispatched || 0) + params.quantity;
        reqItem.status = 'dispatched';
      }
      erpStorage.saveRequisitions(requisitions);
    }

    // 4. Update or Mark Dispatch Request as Dispatched
    const dispatchRequests = erpStorage.getDispatchRequests();
    if (params.dispatchRequestId) {
      const dr = dispatchRequests.find(d => d.id === params.dispatchRequestId);
      if (dr) {
        dr.status = 'dispatched';
        dr.decidedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
        dr.decidedBy = params.dispatchedBy;
        dr.dispatchNotes = params.notes;
        erpStorage.saveDispatchRequests(dispatchRequests);
      }
    }

    // 5. Create Linked Waybill / Delivery Note
    const waybills = erpStorage.getWaybills();
    const wbNumber = `WB-2026-0${waybills.length + 21}`;
    const newWaybill: Waybill = {
      id: waybills.length > 0 ? Math.max(...waybills.map(w => w.id)) + 1 : 1,
      waybillNumber: wbNumber,
      requisitionId: params.requisitionId,
      requisitionNo: params.requisitionNo,
      dispatchRequestId: params.dispatchRequestId,
      projectId: params.destinationProjectId,
      projectName: params.destinationProjectName,
      sourceWarehouseId: params.sourceWarehouseId,
      sourceWarehouseName: params.sourceWarehouseName,
      destinationSite: `${params.destinationProjectName} Site Staging Yard`,
      carrierName: params.carrierName,
      vehicleNumber: params.vehicleNumber,
      driverPhone: params.driverPhone,
      dispatchedBy: params.dispatchedBy,
      dispatchDate: new Date().toISOString().split('T')[0],
      status: 'In Transit',
      items: [
        {
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.name,
          unit: item.unit,
          quantityDispatched: params.quantity,
          condition: 'Good',
          notes: params.notes || 'Verified and inspected prior to truck gate-out.'
        }
      ],
      notes: params.notes,
      createdAt: new Date().toISOString()
    };
    waybills.unshift(newWaybill);
    erpStorage.saveWaybills(waybills);

    return { success: true, waybill: newWaybill };
  }
};
