import React from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Stack,
  Table
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import {
  Printer,
  Download,
  X,
  FileCheck2,
  Truck,
  CheckCircle2,
  Package,
  Calendar,
  Building2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export interface StoreReceiptData {
  type: 'order_receipt' | 'delivery_order_receipt';
  receiptNo: string;
  date: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalValue?: number;
  warehouseName: string;
  // Specific to Order Receipt
  supplierName?: string;
  purchaseOrderNo?: string;
  receivedBy?: string;
  inspectorName?: string;
  conditionNotes?: string;
  // Specific to Delivery Order Receipt
  requisitionNo?: string;
  projectName?: string;
  recipientName?: string;
  purpose?: string;
  gatePassNo?: string;
  dispatchedBy?: string;
  notes?: string;
}

interface StoreReceiptModalProps {
  receipt?: StoreReceiptData | null;
  receiptData?: StoreReceiptData | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const StoreReceiptModal: React.FC<StoreReceiptModalProps> = ({
  receipt: propReceipt,
  receiptData,
  isOpen = true,
  onClose
}) => {
  const { activeCompany } = useERP();
  const receipt = propReceipt || receiptData;

  if (!isOpen || !receipt) return null;

  const isOrderReceipt = receipt.type === 'order_receipt';
  const title = isOrderReceipt ? 'Official Store Order Receipt (GRN)' : 'Store Delivery Order Receipt & Gate Pass';
  const subtitle = isOrderReceipt
    ? 'Goods Received Note (GRN) • Inward Material Inspection & Intake Voucher'
    : 'Material Delivery Order (DOR) • Site Issuance Gate Pass Voucher';

  const qtyVal = Number(receipt.quantity) || 0;
  const unitCostVal = receipt.unitCost !== undefined && receipt.unitCost !== null ? Number(receipt.unitCost) : undefined;
  const lineTotalVal = receipt.totalValue !== undefined && receipt.totalValue !== null
    ? Number(receipt.totalValue)
    : (unitCostVal !== undefined ? qtyVal * unitCostVal : undefined);

  const generateHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${receipt.receiptNo} - ${title}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 24px;
      font-size: 13px;
      line-height: 1.4;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .company-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .voucher-title {
      font-size: 12px;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 3px;
    }
    .voucher-pill {
      font-size: 12px;
      font-weight: 700;
      background: ${isOrderReceipt ? '#ecfdf5' : '#eff6ff'};
      color: ${isOrderReceipt ? '#047857' : '#1d4ed8'};
      border: 1px solid ${isOrderReceipt ? '#a7f3d0' : '#bfdbfe'};
      padding: 5px 12px;
      border-radius: 9999px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 12px;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    .label { color: #64748b; }
    .val { font-weight: 600; color: #0f172a; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th {
      background: #f1f5f9;
      text-align: left;
      padding: 8px 10px;
      font-size: 11px;
      text-transform: uppercase;
      color: #475569;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .signatures {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px dashed #94a3b8;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
    .sig-line {
      border-bottom: 1.5px solid #0f172a;
      height: 38px;
      margin-bottom: 6px;
    }
    .sig-role {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 3px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-title">${activeCompany.name}</div>
      <div class="voucher-title">${title}</div>
      <div style="font-size: 11px; color: #64748b;">${subtitle}</div>
    </div>
    <div class="voucher-pill">${receipt.receiptNo}</div>
  </div>

  <div class="grid-2">
    <div class="info-box">
      <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Voucher Tracking Details</div>
      <div class="info-row"><span class="label">Date / Time:</span> <span class="val">${receipt.date}</span></div>
      <div class="info-row"><span class="label">Store Location:</span> <span class="val">${receipt.warehouseName}</span></div>
      ${isOrderReceipt
        ? `<div class="info-row"><span class="label">Purchase Order Ref:</span> <span class="val" style="font-family: monospace;">${receipt.purchaseOrderNo || 'PO-STANDARD'}</span></div>`
        : `<div class="info-row"><span class="label">Approved Requisition (MR):</span> <span class="val" style="font-family: monospace; color: #2563eb;">${receipt.requisitionNo || 'MR-APPROVED'}</span></div>`
      }
    </div>
    <div class="info-box">
      <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: #475569; margin-bottom: 6px;">
        ${isOrderReceipt ? 'Vendor / Source Details' : 'Destination & Recipient Site'}
      </div>
      ${isOrderReceipt
        ? `<div class="info-row"><span class="label">Supplier Entity:</span> <span class="val">${receipt.supplierName || 'Commercial Vendor'}</span></div>
           <div class="info-row"><span class="label">Quality Condition:</span> <span class="val" style="color: #047857;">Verified & Accepted</span></div>`
        : `<div class="info-row"><span class="label">Target Project / Site:</span> <span class="val">${receipt.projectName || 'Civil Project Site'}</span></div>
           <div class="info-row"><span class="label">Site Recipient:</span> <span class="val">${receipt.recipientName || 'Resident Engineer'}</span></div>
           <div class="info-row"><span class="label">Gate Pass / Voucher:</span> <span class="val" style="font-family: monospace;">${receipt.gatePassNo || receipt.receiptNo}</span></div>`
      }
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>SKU Code</th>
        <th>Material Description</th>
        <th>Quantity</th>
        <th>Unit</th>
        ${receipt.unitCost ? `<th>Unit Benchmark Cost</th><th>Total Value</th>` : `<th>Work Scope / Purpose</th>`}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${receipt.itemCode}</td>
        <td style="font-weight: 600;">${receipt.itemName}</td>
        <td style="font-weight: 700; color: ${isOrderReceipt ? '#047857' : '#2563eb'};">${qtyVal.toLocaleString()}</td>
        <td>${receipt.unit || 'Units'}</td>
        ${unitCostVal !== undefined
          ? `<td>${activeCompany.currency} ${unitCostVal.toLocaleString()}</td><td style="font-weight: 700;">${activeCompany.currency} ${(lineTotalVal || 0).toLocaleString()}</td>`
          : `<td>${receipt.purpose || 'Direct operational site use'}</td>`
        }
      </tr>
    </tbody>
  </table>

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <div class="sig-role">${isOrderReceipt ? 'Received By Storekeeper' : 'Issued By Storekeeper'}</div>
      <div class="sig-meta">Name: ${isOrderReceipt ? (receipt.receivedBy || 'Storekeeper') : (receipt.dispatchedBy || 'Store Officer')}</div>
      <div class="sig-meta">Date: ${receipt.date}</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div class="sig-role">${isOrderReceipt ? 'Inspected By Quality Officer' : 'Received By Site Representative'}</div>
      <div class="sig-meta">Name: ${isOrderReceipt ? (receipt.inspectorName || 'Lead QC Inspector') : (receipt.recipientName || 'Site Engineer')}</div>
      <div class="sig-meta">Date: ${receipt.date}</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div class="sig-role">${isOrderReceipt ? 'Audited By Stores Manager' : 'Security Gate Clearance Stamp'}</div>
      <div class="sig-meta">Name: __________________________</div>
      <div class="sig-meta">Date / Stamp: ___________________</div>
    </div>
  </div>

  <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px;">
    Official Corporate Warehouse Document • ${activeCompany.name} • Internal Supply Chain & Logistics Control
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    try {
      let printFrame = document.getElementById('store-receipt-print-frame') as HTMLIFrameElement | null;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'store-receipt-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }
      const doc = printFrame.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generateHtml());
        doc.close();
        setTimeout(() => {
          try {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
          } catch {
            window.print();
          }
        }, 150);
        return;
      }
    } catch {
      window.print();
    }
  };

  const handleDownload = () => {
    const html = generateHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.receiptNo}_${isOrderReceipt ? 'Order_Receipt' : 'Delivery_Order_Receipt'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1500}
      bg="rgba(15, 23, 42, 0.65)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 2, sm: 4 }}
    >
      <Box
        bg="white"
        borderRadius="16px"
        maxW="600px"
        w="100%"
        p={{ base: 4, sm: 6 }}
        border="1px solid #e2e8f0"
        boxShadow="2xl"
        maxH="90vh"
        overflowY="auto"
      >
        {/* Header */}
        <Flex justify="space-between" align="center" borderBottom="2px solid #0f172a" pb={3} mb={4}>
          <Box>
            <Flex align="center" gap={2}>
              {isOrderReceipt ? <FileCheck2 size={20} color="#16a34a" /> : <Truck size={20} color="#2563eb" />}
              <Heading size="md" color="#0f172a">{activeCompany.name}</Heading>
            </Flex>
            <Text fontSize="xs" fontWeight="bold" color={isOrderReceipt ? '#16a34a' : '#2563eb'} mt={0.5}>
              {title}
            </Text>
            <Text fontSize="10px" color="#64748b">{subtitle}</Text>
          </Box>
          <Badge colorPalette={isOrderReceipt ? 'green' : 'blue'} size="md" fontFamily="mono">
            {receipt.receiptNo}
          </Badge>
        </Flex>

        {/* Content details */}
        <Stack gap={3.5} fontSize="xs">
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
            <Box p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
              <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b" mb={1.5}>
                Receipt Metadata
              </Text>
              <Flex justify="space-between" py={0.5}>
                <Text color="#64748b">Date & Time:</Text>
                <Text fontWeight="semibold">{receipt.date}</Text>
              </Flex>
              <Flex justify="space-between" py={0.5}>
                <Text color="#64748b">Warehouse:</Text>
                <Text fontWeight="semibold">{receipt.warehouseName}</Text>
              </Flex>
              {isOrderReceipt ? (
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">PO Reference:</Text>
                  <Text fontFamily="mono" fontWeight="bold">{receipt.purchaseOrderNo || 'PO-STANDARD'}</Text>
                </Flex>
              ) : (
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Linked Requisition:</Text>
                  <Text fontFamily="mono" fontWeight="bold" color="#2563eb">{receipt.requisitionNo || 'MR-APPROVED'}</Text>
                </Flex>
              )}
            </Box>

            <Box p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
              <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b" mb={1.5}>
                {isOrderReceipt ? 'Supplier / Origin' : 'Destination / Consignee'}
              </Text>
              {isOrderReceipt ? (
                <>
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Supplier:</Text>
                    <Text fontWeight="semibold">{receipt.supplierName || 'Commercial Vendor'}</Text>
                  </Flex>
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Intake Status:</Text>
                    <Badge size="xs" colorPalette="green">Inspected & Accepted</Badge>
                  </Flex>
                </>
              ) : (
                <>
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Project / Site:</Text>
                    <Text fontWeight="semibold">{receipt.projectName || 'Civil Project Site'}</Text>
                  </Flex>
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Recipient Rep:</Text>
                    <Text fontWeight="semibold">{receipt.recipientName || 'Site Engineer'}</Text>
                  </Flex>
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Gate Pass #:</Text>
                    <Text fontFamily="mono" fontWeight="bold">{receipt.gatePassNo || receipt.receiptNo}</Text>
                  </Flex>
                </>
              )}
            </Box>
          </SimpleGrid>

          {/* Item details */}
          <Box p={3} bg={isOrderReceipt ? '#f0fdf4' : '#eff6ff'} borderRadius="8px" border={isOrderReceipt ? '1px solid #bbf7d0' : '1px solid #bfdbfe'}>
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color={isOrderReceipt ? '#166534' : '#1e40af'} mb={1.5}>
              Material Line Specification
            </Text>
            <Flex justify="space-between" py={0.5}>
              <Text color="#64748b">Item SKU & Name:</Text>
              <Text fontWeight="bold" color="#0f172a">{receipt.itemCode} - {receipt.itemName}</Text>
            </Flex>
            <Flex justify="space-between" py={0.5}>
              <Text color="#64748b">{isOrderReceipt ? 'Intake Quantity:' : 'Issued Quantity:'}</Text>
              <Text fontWeight="bold" fontSize="sm" color={isOrderReceipt ? '#16a34a' : '#2563eb'}>
                {qtyVal.toLocaleString()} {receipt.unit || 'Units'}
              </Text>
            </Flex>
            {unitCostVal !== undefined && (
              <Flex justify="space-between" py={0.5} borderTop="1px solid #e2e8f0" mt={1} pt={1}>
                <Text color="#64748b">Standard Valuation:</Text>
                <Text fontWeight="bold">{activeCompany.currency} {(lineTotalVal || 0).toLocaleString()}</Text>
              </Flex>
            )}
            {receipt.purpose && !isOrderReceipt && (
              <Flex justify="space-between" py={0.5}>
                <Text color="#64748b">Issuance Scope:</Text>
                <Text fontWeight="medium" color="#334155">{receipt.purpose}</Text>
              </Flex>
            )}
          </Box>

          {/* Signature placeholders */}
          <SimpleGrid columns={3} gap={4} pt={4} borderTop="1px dashed #cbd5e1">
            <Box>
              <Box borderBottom="1px solid #0f172a" h="28px" mb={1} />
              <Text fontSize="10px" fontWeight="bold" color="#0f172a">
                {isOrderReceipt ? 'Received By Storekeeper' : 'Issued By Storekeeper'}
              </Text>
              <Text fontSize="9px" color="#64748b">{receipt.receivedBy || receipt.dispatchedBy || 'Store Officer'}</Text>
            </Box>
            <Box>
              <Box borderBottom="1px solid #0f172a" h="28px" mb={1} />
              <Text fontSize="10px" fontWeight="bold" color="#0f172a">
                {isOrderReceipt ? 'Quality Inspector' : 'Site Consignee'}
              </Text>
              <Text fontSize="9px" color="#64748b">{receipt.inspectorName || receipt.recipientName || 'Site Rep'}</Text>
            </Box>
            <Box>
              <Box borderBottom="1px solid #0f172a" h="28px" mb={1} />
              <Text fontSize="10px" fontWeight="bold" color="#0f172a">
                {isOrderReceipt ? 'Stores Manager' : 'Gate Clearance'}
              </Text>
              <Text fontSize="9px" color="#64748b">Verified & Stamped</Text>
            </Box>
          </SimpleGrid>
        </Stack>

        {/* Action buttons */}
        <Flex justify="space-between" align="center" gap={2} mt={6} pt={3} borderTop="1px solid #f1f5f9">
          <Button size="sm" variant="ghost" onClick={handleDownload}>
            <Download size={14} /> Download Receipt
          </Button>
          <Flex gap={2}>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" colorPalette={isOrderReceipt ? 'green' : 'blue'} onClick={handlePrint}>
              <Printer size={14} /> Print Receipt Voucher
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
