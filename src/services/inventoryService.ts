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
