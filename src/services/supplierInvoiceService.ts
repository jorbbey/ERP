import { SupplierInvoice } from '../types';

const SUPPLIER_INVOICE_STORAGE_KEY = 'construction_erp_supplier_invoices';

export const initialSupplierInvoices: SupplierInvoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-CSM-2026-0941',
    supplierId: 1,
    supplierName: 'Continental Steel Mills Corp',
    invoiceDate: '2026-09-28',
    dueDate: '2026-10-28',
    amount: 18800,
    currency: '₦',
    purchaseOrderId: 1,
    poNumber: 'PO-2026-0089',
    goodsReceivedNoteId: 1,
    grnNumber: 'GRN-2026-001',
    status: 'Matched',
    uploadedBy: 'Musa YarAdua',
    uploadDate: '2026-09-29',
    fileName: 'continental_steel_inv_0941.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    notes: 'Direct 3-way match against PO-2026-0089 and GRN-2026-001 rebar delivery',
    isDuplicateWarning: false,
    verifiedMatch: true,
    createdAt: '2026-09-29'
  },
  {
    id: 2,
    invoiceNumber: 'INV-LAF-88201',
    supplierId: 2,
    supplierName: 'Lafarge & Holcim Cement Dist',
    invoiceDate: '2026-09-22',
    dueDate: '2026-10-22',
    amount: 14250,
    currency: '₦',
    purchaseOrderId: 2,
    poNumber: 'PO-2026-0088',
    status: 'Pending Verification',
    uploadedBy: 'Babatunde Adeleke',
    uploadDate: '2026-09-23',
    fileName: 'lafarge_bulk_cement_tax_invoice.pdf',
    fileSize: '820 KB',
    fileType: 'application/pdf',
    notes: '500 Bags Elephant Supaset 42.5R delivered to Skyline Commercial site',
    isDuplicateWarning: false,
    verifiedMatch: false,
    createdAt: '2026-09-23'
  },
  {
    id: 3,
    invoiceNumber: 'INV-TOTAL-YARD-550',
    supplierId: 1,
    supplierName: 'Continental Steel Mills Corp',
    invoiceDate: '2026-10-02',
    dueDate: '2026-11-02',
    amount: 9400,
    currency: '₦',
    purchaseOrderId: 1,
    poNumber: 'PO-2026-0089',
    status: 'Under Query',
    uploadedBy: 'Chioma Okon',
    uploadDate: '2026-10-03',
    fileName: 'secondary_hauling_steel_bill.pdf',
    fileSize: '540 KB',
    fileType: 'application/pdf',
    notes: 'Disputed delivery surcharge pending site QS verification',
    isDuplicateWarning: false,
    verifiedMatch: false,
    createdAt: '2026-10-03'
  }
];

export const supplierInvoiceService = {
  getInvoices: (): SupplierInvoice[] => {
    try {
      const stored = localStorage.getItem(SUPPLIER_INVOICE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse supplier invoices from storage:', e);
    }
    localStorage.setItem(SUPPLIER_INVOICE_STORAGE_KEY, JSON.stringify(initialSupplierInvoices));
    return initialSupplierInvoices;
  },

  checkDuplicateInvoiceNumber: (
    supplierId: number,
    invoiceNumber: string,
    excludeId?: number
  ): boolean => {
    const invoices = supplierInvoiceService.getInvoices();
    const cleanNum = invoiceNumber.trim().toLowerCase();
    return invoices.some(
      inv => inv.supplierId === supplierId &&
             inv.invoiceNumber.trim().toLowerCase() === cleanNum &&
             inv.id !== excludeId
    );
  },

  addInvoice: (data: Omit<SupplierInvoice, 'id' | 'createdAt'>): { invoice: SupplierInvoice; isDuplicate: boolean } => {
    const invoices = supplierInvoiceService.getInvoices();
    const isDuplicate = supplierInvoiceService.checkDuplicateInvoiceNumber(
      data.supplierId,
      data.invoiceNumber
    );

    const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1;
    const newInvoice: SupplierInvoice = {
      ...data,
      id: newId,
      isDuplicateWarning: isDuplicate,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newInvoice, ...invoices];
    try {
      localStorage.setItem(SUPPLIER_INVOICE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save supplier invoice:', e);
    }

    return { invoice: newInvoice, isDuplicate };
  },

  updateInvoice: (id: number, data: Partial<SupplierInvoice>): SupplierInvoice | null => {
    const invoices = supplierInvoiceService.getInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) return null;

    invoices[index] = { ...invoices[index], ...data };
    try {
      localStorage.setItem(SUPPLIER_INVOICE_STORAGE_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to update supplier invoice:', e);
    }
    return invoices[index];
  },

  getInvoicesByPO: (poId: number): SupplierInvoice[] => {
    return supplierInvoiceService.getInvoices().filter(i => i.purchaseOrderId === poId);
  },

  getInvoicesBySupplier: (supplierId: number): SupplierInvoice[] => {
    return supplierInvoiceService.getInvoices().filter(i => i.supplierId === supplierId);
  }
};
