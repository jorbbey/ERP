import {
  InventoryItem,
  InventoryCategory,
  InventoryItemChange,
  StockMovement
} from '../types';
import { erpStorage } from './erpStorage';

export const inventoryService = {
  getItems: (): InventoryItem[] => erpStorage.getInventory(),
  
  getItemById: (id: number): InventoryItem | undefined => {
    return erpStorage.getInventory().find(i => i.id === id);
  },

  saveItems: (items: InventoryItem[]): void => {
    erpStorage.saveInventory(items);
  },

  addItem: (item: Omit<InventoryItem, 'id'>, actor = 'System'): InventoryItem => {
    const items = erpStorage.getInventory();
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem: InventoryItem = {
      ...item,
      id: newId,
      status: item.currentStock <= 0 ? 'out_of_stock' : item.currentStock <= item.minLevel ? 'low_stock' : 'active',
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    erpStorage.saveInventory(items);

    // Record change log
    inventoryService.logChange(
      newId,
      newItem.itemCode,
      newItem.name,
      'Initial item creation and catalog registration',
      '{}',
      JSON.stringify(newItem),
      actor
    );

    return newItem;
  },

  updateItem: (id: number, updates: Partial<InventoryItem>, actor = 'System'): InventoryItem | null => {
    const items = erpStorage.getInventory();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    const oldItem = items[index];
    const updated: InventoryItem = {
      ...oldItem,
      ...updates,
      status: (updates.currentStock ?? oldItem.currentStock) <= 0 
        ? 'out_of_stock' 
        : (updates.currentStock ?? oldItem.currentStock) <= (updates.minLevel ?? oldItem.minLevel) 
          ? 'low_stock' 
          : 'active'
    };

    items[index] = updated;
    erpStorage.saveInventory(items);

    inventoryService.logChange(
      id,
      updated.itemCode,
      updated.name,
      'Item specifications and stock parameters updated',
      JSON.stringify(oldItem),
      JSON.stringify(updated),
      actor
    );

    return updated;
  },

  deleteItem: (id: number, actor = 'System'): boolean => {
    const items = erpStorage.getInventory();
    const existing = items.find(i => i.id === id);
    if (!existing) return false;

    inventoryService.logChange(
      id,
      existing.itemCode,
      existing.name,
      'Item archived from active inventory catalog',
      JSON.stringify(existing),
      JSON.stringify({ status: 'archived' }),
      actor
    );

    const filtered = items.filter(i => i.id !== id);
    erpStorage.saveInventory(filtered);
    return true;
  },

  adjustStock: (
    id: number,
    delta: number,
    reason: string,
    actor = 'System',
    warehouseName = 'Main Yard Warehouse A'
  ): InventoryItem | null => {
    const items = erpStorage.getInventory();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    const oldItem = items[index];
    const newStock = Math.max(0, oldItem.currentStock + delta);
    const updated: InventoryItem = {
      ...oldItem,
      currentStock: newStock,
      status: newStock <= 0 ? 'out_of_stock' : newStock <= oldItem.minLevel ? 'low_stock' : 'active'
    };

    items[index] = updated;
    erpStorage.saveInventory(items);

    // Record change log
    inventoryService.logChange(
      id,
      oldItem.itemCode,
      oldItem.name,
      `Physical Stock Adjustment (${delta >= 0 ? `+${delta}` : delta}): ${reason}`,
      JSON.stringify({ stock: oldItem.currentStock }),
      JSON.stringify({ stock: newStock }),
      actor
    );

    // Record stock movement
    const movements = erpStorage.getStockMovements();
    const ref = `SM-ADJ-${Date.now().toString().slice(-6)}`;
    const newMovement: StockMovement = {
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      referenceNumber: ref,
      movementType: 'adjustment',
      itemId: oldItem.id,
      itemCode: oldItem.itemCode,
      itemName: oldItem.name,
      quantity: delta,
      unit: oldItem.unit,
      source: delta >= 0 ? 'Inventory Count Surplus' : warehouseName,
      destination: delta >= 0 ? warehouseName : 'Adjustment / Write-off',
      warehouseName,
      performedBy: actor,
      movementDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason,
      relatedDocumentType: 'PhysicalAudit',
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    movements.unshift(newMovement);
    erpStorage.saveStockMovements(movements);

    return updated;
  },

  // Categories
  getCategories: (): InventoryCategory[] => erpStorage.getInventoryCategories(),

  addCategory: (cat: Omit<InventoryCategory, 'id'>): InventoryCategory => {
    const cats = erpStorage.getInventoryCategories();
    const newId = cats.length > 0 ? Math.max(...cats.map(c => c.id)) + 1 : 1;
    const newCat: InventoryCategory = {
      ...cat,
      id: newId,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    cats.push(newCat);
    erpStorage.saveInventoryCategories(cats);
    return newCat;
  },

  updateCategory: (id: number, updates: Partial<InventoryCategory>): InventoryCategory | null => {
    const cats = erpStorage.getInventoryCategories();
    const index = cats.findIndex(c => c.id === id);
    if (index === -1) return null;
    cats[index] = { ...cats[index], ...updates };
    erpStorage.saveInventoryCategories(cats);
    return cats[index];
  },

  deleteCategory: (id: number): boolean => {
    const cats = erpStorage.getInventoryCategories();
    const filtered = cats.filter(c => c.id !== id);
    erpStorage.saveInventoryCategories(filtered);
    return true;
  },

  // Stock Receipt (Inward)
  receiveStock: (params: {
    itemId: number;
    quantity: number;
    date?: string;
    supplierMode?: 'existing' | 'new' | 'none';
    supplierId?: number;
    supplierName?: string;
    newSupplier?: {
      companyName: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
      address?: string;
      category?: string;
    };
    warehouseId?: number;
    warehouseName: string;
    referenceNumber?: string;
    notes?: string;
    actor?: string;
  }): { success: boolean; error?: string; updatedItem?: InventoryItem; movement?: StockMovement } => {
    if (params.quantity <= 0) {
      return { success: false, error: 'Received quantity must be greater than zero.' };
    }

    const items = erpStorage.getInventory();
    const index = items.findIndex(i => i.id === params.itemId);
    if (index === -1) {
      return { success: false, error: 'Target inventory item not found.' };
    }

    const oldItem = items[index];

    // Handle new supplier creation or existing supplier reuse
    let effectiveSupplierId = params.supplierId || oldItem.supplierId;
    let effectiveSupplierName = params.supplierName || oldItem.supplierName;

    if (params.supplierMode === 'new' && params.newSupplier?.companyName) {
      const suppliers = erpStorage.getSuppliers();
      const existingSup = suppliers.find(
        s => s.companyName.trim().toLowerCase() === params.newSupplier!.companyName.trim().toLowerCase()
      );

      if (existingSup) {
        effectiveSupplierId = existingSup.id;
        effectiveSupplierName = existingSup.companyName;
      } else {
        const newSupId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
        const newSupRecord: any = {
          id: newSupId,
          supplierCode: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
          companyName: params.newSupplier.companyName.trim(),
          contactPerson: params.newSupplier.contactPerson || 'Account Desk',
          phone: params.newSupplier.phone || '+234 800 000 0000',
          email: params.newSupplier.email || 'orders@supplier.com',
          address: params.newSupplier.address || 'Industrial Layout',
          category: params.newSupplier.category || oldItem.categoryName || 'Building Materials',
          balance: 0,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        };
        suppliers.unshift(newSupRecord);
        erpStorage.saveSuppliers(suppliers);
        effectiveSupplierId = newSupId;
        effectiveSupplierName = newSupRecord.companyName;
      }
    }

    const newStock = oldItem.currentStock + params.quantity;
    const updated: InventoryItem = {
      ...oldItem,
      currentStock: newStock,
      supplierId: effectiveSupplierId,
      supplierName: effectiveSupplierName,
      warehouseLocation: params.warehouseName || oldItem.warehouseLocation,
      status: newStock <= 0 ? 'out_of_stock' : newStock <= oldItem.minLevel ? 'low_stock' : 'active'
    };

    items[index] = updated;
    erpStorage.saveInventory(items);

    // Record Stock Movement
    const movements = erpStorage.getStockMovements();
    const ref = params.referenceNumber || `REC-GRN-${Date.now().toString().slice(-6)}`;
    const newMovement: StockMovement = {
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      referenceNumber: ref,
      movementType: 'receipt',
      itemId: oldItem.id,
      itemCode: oldItem.itemCode,
      itemName: oldItem.name,
      quantity: params.quantity,
      unit: oldItem.unit,
      source: effectiveSupplierName || 'Direct Delivery / Vendor Consignment',
      destination: params.warehouseName || oldItem.warehouseLocation,
      warehouseId: params.warehouseId || oldItem.warehouseId,
      warehouseName: params.warehouseName || oldItem.warehouseLocation,
      performedBy: params.actor || 'Store Keeper',
      movementDate: params.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: params.notes || `Stock receipt into ${params.warehouseName || oldItem.warehouseLocation}`,
      relatedDocumentType: 'GRN',
      relatedDocumentRef: ref,
      status: 'completed',
      notes: params.notes,
      createdAt: new Date().toISOString()
    };
    movements.unshift(newMovement);
    erpStorage.saveStockMovements(movements);

    // Log Change
    inventoryService.logChange(
      oldItem.id,
      oldItem.itemCode,
      oldItem.name,
      `Stock Receipt (+${params.quantity} ${oldItem.unit}) from ${effectiveSupplierName || 'Supplier'}`,
      JSON.stringify({ currentStock: oldItem.currentStock }),
      JSON.stringify({ currentStock: newStock, supplier: effectiveSupplierName }),
      params.actor || 'Store Keeper'
    );

    return { success: true, updatedItem: updated, movement: newMovement };
  },

  // Stock Issuance (Outward / Site Dispatch)
  issueStock: (params: {
    itemId: number;
    quantity: number;
    destinationType: 'project' | 'site' | 'warehouse' | 'department' | 'employee';
    projectId?: number;
    projectName?: string;
    targetWarehouseId?: number;
    targetWarehouseName?: string;
    department?: string;
    employeeId?: number;
    employeeName?: string;
    destinationDetails?: string;
    recipientName: string;
    date?: string;
    purpose: string;
    referenceNumber?: string;
    notes?: string;
    requisitionId?: number;
    requisitionNo?: string;
    actor?: string;
  }): { success: boolean; error?: string; updatedItem?: InventoryItem; movement?: StockMovement } => {
    if (params.quantity <= 0) {
      return { success: false, error: 'Issued quantity must be greater than zero.' };
    }

    const items = erpStorage.getInventory();
    const index = items.findIndex(i => i.id === params.itemId);
    if (index === -1) {
      return { success: false, error: 'Target inventory item not found.' };
    }

    const oldItem = items[index];

    // Validate available quantity
    if (params.quantity > oldItem.currentStock) {
      return {
        success: false,
        error: `Insufficient stock available. Requested ${params.quantity} ${oldItem.unit}, but only ${oldItem.currentStock} ${oldItem.unit} is available in stores.`
      };
    }

    const newStock = oldItem.currentStock - params.quantity;
    const updated: InventoryItem = {
      ...oldItem,
      currentStock: newStock,
      status: newStock <= 0 ? 'out_of_stock' : newStock <= oldItem.minLevel ? 'low_stock' : 'active'
    };

    items[index] = updated;
    erpStorage.saveInventory(items);

    // Format destination label
    let destinationLabel = params.destinationDetails || '';
    if (!destinationLabel) {
      if (params.destinationType === 'project' || params.destinationType === 'site') {
        destinationLabel = params.projectName || 'Site Project';
      } else if (params.destinationType === 'warehouse') {
        destinationLabel = params.targetWarehouseName || 'Sub-warehouse';
      } else if (params.destinationType === 'department') {
        destinationLabel = `Department: ${params.department || 'Operations'}`;
      } else if (params.destinationType === 'employee') {
        destinationLabel = `Field Custody: ${params.employeeName || params.recipientName}`;
      }
    }

    // Record Stock Movement
    const movements = erpStorage.getStockMovements();
    const ref = params.referenceNumber || `ISS-${Date.now().toString().slice(-6)}`;
    const newMovement: StockMovement = {
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      referenceNumber: ref,
      movementType: 'issue',
      itemId: oldItem.id,
      itemCode: oldItem.itemCode,
      itemName: oldItem.name,
      quantity: params.quantity,
      unit: oldItem.unit,
      source: oldItem.warehouseLocation,
      destination: `${destinationLabel} (Received by: ${params.recipientName})`,
      destinationType: params.destinationType,
      recipientName: params.recipientName,
      employeeId: params.employeeId,
      department: params.department,
      projectId: params.projectId,
      projectName: params.projectName,
      warehouseName: oldItem.warehouseLocation,
      performedBy: params.actor || 'Store Keeper',
      movementDate: params.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: params.purpose,
      relatedDocumentType: params.requisitionId ? 'Requisition' : 'Manual',
      relatedDocumentRef: params.requisitionNo || ref,
      status: 'completed',
      notes: params.notes,
      createdAt: new Date().toISOString()
    };
    movements.unshift(newMovement);
    erpStorage.saveStockMovements(movements);

    // Update linked Requisition if applicable
    if (params.requisitionId) {
      const requisitions = erpStorage.getRequisitions();
      const req = requisitions.find(r => r.id === params.requisitionId);
      if (req) {
        let matchingItem = req.items.find(i => i.inventoryItemId === oldItem.id || i.itemName.toLowerCase() === oldItem.name.toLowerCase());
        if (!matchingItem && req.items.length > 0) {
          matchingItem = req.items[0];
        }

        if (matchingItem) {
          matchingItem.quantityDispatched = (matchingItem.quantityDispatched || 0) + params.quantity;
          if (matchingItem.quantityDispatched >= matchingItem.quantityRequired) {
            matchingItem.status = 'dispatched';
          } else {
            matchingItem.status = 'partially_dispatched';
          }
        }

        // Add history step
        if (!req.approvalHistory) req.approvalHistory = [];
        req.approvalHistory.push({
          id: req.approvalHistory.length + 1,
          level: 'Stores Issuance',
          action: 'Dispatched',
          actorName: params.actor || 'Store Keeper',
          actorRole: 'Store Officer',
          comments: `Issued ${params.quantity} ${oldItem.unit} of ${oldItem.name} to ${params.recipientName} (${destinationLabel}). Gate Pass / Ref: ${ref}.`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        });

        // Add note to discussion
        if (!req.messages) req.messages = [];
        req.messages.push({
          id: req.messages.length + 1,
          requisitionId: req.id,
          userName: params.actor || 'Store Keeper',
          role: 'Store Officer',
          message: `📦 STOCK ISSUED: ${params.quantity} ${oldItem.unit} of "${oldItem.name}" dispatched to ${params.recipientName} for ${params.purpose}. Ref: ${ref}.`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystemEvent: true
        });

        erpStorage.saveRequisitions(requisitions);
      }
    }

    // Log Change
    inventoryService.logChange(
      oldItem.id,
      oldItem.itemCode,
      oldItem.name,
      `Stock Issuance (-${params.quantity} ${oldItem.unit}) to ${destinationLabel}`,
      JSON.stringify({ currentStock: oldItem.currentStock }),
      JSON.stringify({ currentStock: newStock, destination: destinationLabel, recipient: params.recipientName }),
      params.actor || 'Store Keeper'
    );

    return { success: true, updatedItem: updated, movement: newMovement };
  },

  // Change History
  getChangeHistory: (itemId?: number): InventoryItemChange[] => {
    const history = erpStorage.getInventoryItemChanges();
    return itemId ? history.filter(h => h.itemId === itemId) : history;
  },

  logChange: (
    itemId: number,
    itemCode: string,
    itemName: string,
    changeReason: string,
    beforeData: string,
    afterData: string,
    changedBy = 'System'
  ): void => {
    const history = erpStorage.getInventoryItemChanges();
    const newId = history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1;
    history.unshift({
      id: newId,
      itemId,
      itemCode,
      itemName,
      changeReason,
      beforeData,
      afterData,
      changedBy,
      changedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });
    erpStorage.saveInventoryItemChanges(history);
  }
};
