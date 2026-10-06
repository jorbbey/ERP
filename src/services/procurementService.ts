import { erpStorage } from './erpStorage';
import { purchaseOrderService } from './purchaseOrderService';
import { grnService } from './grnService';
import { supplierService } from './supplierService';

export const procurementService = {
  ...purchaseOrderService,
  ...grnService,
  ...supplierService,

  getProcurementKPIs: () => {
    const suppliers = erpStorage.getSuppliers();
    const pos = erpStorage.getPurchaseOrders();
    const grns = erpStorage.getGoodsReceivedNotes();

    const activeSuppliersCount = suppliers.filter(s => s.status === 'active').length;
    const pendingPOsCount = pos.filter(p => p.status === 'pending_approval').length;
    const approvedOpenPOs = pos.filter(p => p.status === 'approved' || p.status === 'partially_received').length;
    const totalCommittedSpend = pos.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
    const totalReceivedValue = grns.reduce((acc, g) => acc + (g.totalReceivedValue || 0), 0);

    return {
      activeSuppliersCount,
      pendingPOsCount,
      approvedOpenPOs,
      totalCommittedSpend,
      totalReceivedValue,
      totalOrdersCount: pos.length,
      totalGRNsCount: grns.length
    };
  }
};
