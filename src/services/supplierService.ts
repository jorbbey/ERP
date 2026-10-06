import { Supplier, PurchaseOrder, GoodsReceivedNote } from '../types';
import { erpStorage } from './erpStorage';

export const supplierService = {
  getSuppliers: (filters?: {
    category?: string;
    status?: string;
    searchTerm?: string;
  }): Supplier[] => {
    let list = erpStorage.getSuppliers();

    if (!filters) return list;

    if (filters.category && filters.category !== 'All') {
      list = list.filter(s => s.category === filters.category);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(s => s.status === filters.status);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(s =>
        s.companyName.toLowerCase().includes(q) ||
        s.supplierCode.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getSupplierById: (id: number): Supplier | undefined => {
    return erpStorage.getSuppliers().find(s => s.id === id);
  },

  addSupplier: (data: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const list = erpStorage.getSuppliers();
    const newId = list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1;
    const newSupplier: Supplier = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newSupplier);
    erpStorage.saveSuppliers(list);
    return newSupplier;
  },

  updateSupplier: (id: number, updates: Partial<Supplier>): Supplier | null => {
    const list = erpStorage.getSuppliers();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    erpStorage.saveSuppliers(list);
    return list[index];
  },

  deleteSupplier: (id: number): boolean => {
    const list = erpStorage.getSuppliers();
    const filtered = list.filter(s => s.id !== id);
    erpStorage.saveSuppliers(filtered);
    return true;
  },

  getSupplierPOs: (supplierId: number): PurchaseOrder[] => {
    return erpStorage.getPurchaseOrders().filter(p => p.supplierId === supplierId);
  },

  getSupplierGRNs: (supplierId: number): GoodsReceivedNote[] => {
    return erpStorage.getGoodsReceivedNotes().filter(g => g.supplierId === supplierId);
  }
};
