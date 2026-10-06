import { Waybill } from '../types';
import { erpStorage } from './erpStorage';

export const waybillService = {
  getWaybills: (filters?: {
    status?: string;
    projectId?: number;
    searchTerm?: string;
  }): Waybill[] => {
    let list = erpStorage.getWaybills();

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter(w => w.status === filters.status);
    }

    if (filters.projectId) {
      list = list.filter(w => w.projectId === filters.projectId);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(w =>
        w.waybillNumber.toLowerCase().includes(q) ||
        (w.requisitionNo && w.requisitionNo.toLowerCase().includes(q)) ||
        w.projectName.toLowerCase().includes(q) ||
        w.carrierName.toLowerCase().includes(q) ||
        w.vehicleNumber.toLowerCase().includes(q) ||
        w.destinationSite.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getWaybillById: (id: number): Waybill | undefined => {
    return erpStorage.getWaybills().find(w => w.id === id);
  },

  createWaybill: (data: Omit<Waybill, 'id' | 'createdAt' | 'status'>): Waybill => {
    const list = erpStorage.getWaybills();
    const newId = list.length > 0 ? Math.max(...list.map(w => w.id)) + 1 : 1;
    const waybill: Waybill = {
      ...data,
      id: newId,
      status: 'Prepared',
      createdAt: new Date().toISOString()
    };
    list.unshift(waybill);
    erpStorage.saveWaybills(list);
    return waybill;
  },

  markDelivered: (
    id: number,
    receivedBy: string,
    notes?: string
  ): Waybill | null => {
    const list = erpStorage.getWaybills();
    const wb = list.find(w => w.id === id);
    if (!wb) return null;

    wb.status = 'Delivered';
    wb.receivedBy = receivedBy;
    wb.receivedDate = new Date().toISOString().split('T')[0];
    if (notes) {
      wb.notes = wb.notes ? `${wb.notes} | ${notes}` : notes;
    }

    wb.items.forEach(i => {
      i.quantityReceived = i.quantityDispatched;
      i.condition = 'Good';
    });

    erpStorage.saveWaybills(list);

    // If linked to a requisition, mark that requisition as 'Delivered'
    if (wb.requisitionId) {
      const requisitions = erpStorage.getRequisitions();
      const req = requisitions.find(r => r.id === wb.requisitionId);
      if (req) {
        req.status = 'Delivered';
        erpStorage.saveRequisitions(requisitions);
      }
    }

    return wb;
  }
};
