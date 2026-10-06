import { StockMovement } from '../types';
import { erpStorage } from './erpStorage';

export const stockMovementService = {
  getMovements: (filters?: {
    type?: StockMovement['movementType'] | 'all';
    itemId?: number;
    warehouseName?: string;
    projectId?: number;
    searchTerm?: string;
  }): StockMovement[] => {
    let list = erpStorage.getStockMovements();

    if (!filters) return list;

    if (filters.type && filters.type !== 'all') {
      list = list.filter(m => m.movementType === filters.type);
    }

    if (filters.itemId) {
      list = list.filter(m => m.itemId === filters.itemId);
    }

    if (filters.warehouseName && filters.warehouseName !== 'all') {
      list = list.filter(m => 
        m.warehouseName.toLowerCase().includes(filters.warehouseName!.toLowerCase()) ||
        m.source.toLowerCase().includes(filters.warehouseName!.toLowerCase()) ||
        m.destination.toLowerCase().includes(filters.warehouseName!.toLowerCase())
      );
    }

    if (filters.projectId) {
      list = list.filter(m => m.projectId === filters.projectId);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(m =>
        m.referenceNumber.toLowerCase().includes(q) ||
        m.itemName.toLowerCase().includes(q) ||
        m.itemCode.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q) ||
        m.destination.toLowerCase().includes(q) ||
        m.performedBy.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q)
      );
    }

    return list;
  },

  recordMovement: (data: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement => {
    const movements = erpStorage.getStockMovements();
    const newId = movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1;
    const movement: StockMovement = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };
    movements.unshift(movement);
    erpStorage.saveStockMovements(movements);
    return movement;
  }
};
