import { Warehouse, InventoryItem, StockMovement } from '../types';
import { erpStorage } from './erpStorage';

export const warehouseService = {
  getWarehouses: (): Warehouse[] => {
    const warehouses = erpStorage.getWarehouses();
    const inventory = erpStorage.getInventory();

    // Dynamically calculate itemCount and totalValuation for each warehouse
    return warehouses.map(w => {
      const itemsInWarehouse = inventory.filter(i => 
        i.warehouseId === w.id || 
        i.warehouseLocation.toLowerCase().includes(w.name.toLowerCase()) ||
        i.warehouseLocation.toLowerCase().includes(w.code.toLowerCase())
      );
      const totalVal = itemsInWarehouse.reduce((acc, item) => acc + (item.currentStock * item.costPrice), 0);
      return {
        ...w,
        itemCount: itemsInWarehouse.length,
        totalValuation: totalVal
      };
    });
  },

  getWarehouseById: (id: number): Warehouse | undefined => {
    return warehouseService.getWarehouses().find(w => w.id === id);
  },

  addWarehouse: (wh: Omit<Warehouse, 'id'>): Warehouse => {
    const warehouses = erpStorage.getWarehouses();
    const newId = warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1;
    const newWarehouse: Warehouse = {
      ...wh,
      id: newId,
      itemCount: 0,
      totalValuation: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    warehouses.push(newWarehouse);
    erpStorage.saveWarehouses(warehouses);
    return newWarehouse;
  },

  updateWarehouse: (id: number, updates: Partial<Warehouse>): Warehouse | null => {
    const warehouses = erpStorage.getWarehouses();
    const index = warehouses.findIndex(w => w.id === id);
    if (index === -1) return null;
    warehouses[index] = { ...warehouses[index], ...updates };
    erpStorage.saveWarehouses(warehouses);
    return warehouses[index];
  },

  deleteWarehouse: (id: number): boolean => {
    const warehouses = erpStorage.getWarehouses();
    const filtered = warehouses.filter(w => w.id !== id);
    erpStorage.saveWarehouses(filtered);
    return true;
  },

  transferStock: (params: {
    itemId: number;
    quantity: number;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    targetWarehouseId: number;
    targetWarehouseName: string;
    reason: string;
    actor: string;
    projectId?: number;
    projectName?: string;
  }): { success: boolean; movement?: StockMovement; error?: string } => {
    const inventory = erpStorage.getInventory();
    const item = inventory.find(i => i.id === params.itemId);

    if (!item) {
      return { success: false, error: 'Inventory SKU not found.' };
    }

    if (item.currentStock < params.quantity) {
      return { 
        success: false, 
        error: `Insufficient stock for transfer. Available: ${item.currentStock} ${item.unit}, Requested: ${params.quantity} ${item.unit}.` 
      };
    }

    // Update item location info or internal transfer record
    item.warehouseId = params.targetWarehouseId;
    item.warehouseLocation = `${params.targetWarehouseName} (Transferred from ${params.sourceWarehouseName})`;
    erpStorage.saveInventory(inventory);

    // Record Stock Movement
    const movements = erpStorage.getStockMovements();
    const ref = `SM-XFER-${Date.now().toString().slice(-6)}`;
    const movement: StockMovement = {
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      referenceNumber: ref,
      movementType: 'transfer',
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      quantity: params.quantity,
      unit: item.unit,
      source: params.sourceWarehouseName,
      destination: params.targetWarehouseName,
      warehouseId: params.sourceWarehouseId,
      warehouseName: params.sourceWarehouseName,
      targetWarehouseId: params.targetWarehouseId,
      targetWarehouseName: params.targetWarehouseName,
      projectId: params.projectId,
      projectName: params.projectName,
      performedBy: params.actor,
      movementDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: params.reason || `Inter-store stock transfer from ${params.sourceWarehouseName} to ${params.targetWarehouseName}`,
      relatedDocumentType: 'Waybill',
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    movements.unshift(movement);
    erpStorage.saveStockMovements(movements);

    return { success: true, movement };
  }
};
