import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Card,
  Table,
  Stack,
  Input
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { InventoryItem, StockMovement, InventoryItemChange } from '../../../types';
import {
  History,
  Printer,
  Download,
  X,
  Package,
  Calendar,
  Building2,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Sliders,
  CheckCircle2,
  Filter,
  Search,
  FileText
} from 'lucide-react';

interface StockHistoryReportModalProps {
  item: InventoryItem | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const StockHistoryReportModal: React.FC<StockHistoryReportModalProps> = ({ item, isOpen = true, onClose }) => {
  if (!isOpen || !item) return null;

  const { stockMovements, inventoryItemChanges, activeCompany } = useERP();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Gather all movement logs for this item
  const itemMovements = stockMovements.filter(m => m.itemId === item.id);

  // 2. Gather all specification / attribute edit changes for this item
  const itemEdits = inventoryItemChanges.filter(c => c.itemId === item.id);

  // 3. Synthesize into unified chronological trail
  interface UnifiedTrailEntry {
    id: string;
    date: string;
    type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'edit';
    typeLabel: string;
    performedBy: string;
    quantityChange?: number;
    reference: string;
    locationOrDest: string;
    notes: string;
    badgeColor: string;
  }

  const unifiedTrail: UnifiedTrailEntry[] = [
    ...itemMovements.map(m => {
      let label = 'Stock Movement';
      let color = 'gray';
      if (m.movementType === 'receipt') { label = 'Order Receipt (GRN)'; color = 'green'; }
      else if (m.movementType === 'issue') { label = 'Site Material Issue'; color = 'blue'; }
      else if (m.movementType === 'transfer') { label = 'Store Transfer'; color = 'purple'; }
      else if (m.movementType === 'adjustment') { label = 'Stock Adjustment'; color = 'orange'; }

      return {
        id: `mov-${m.id}`,
        date: m.movementDate,
        type: m.movementType as any,
        typeLabel: label,
        performedBy: m.performedBy || 'Storekeeper',
        quantityChange: m.movementType === 'receipt' ? Math.abs(m.quantity) : -Math.abs(m.quantity),
        reference: m.referenceNumber || `MOV-${m.id}`,
        locationOrDest: m.destination || m.warehouseName || 'Warehouse',
        notes: m.reason || 'Routine store operation',
        badgeColor: color
      };
    }),
    ...itemEdits.map(e => ({
      id: `edit-${e.id}`,
      date: e.changedAt,
      type: 'edit' as const,
      typeLabel: 'Catalog Edit / Revaluation',
      performedBy: e.changedBy || 'Inventory Admin',
      quantityChange: undefined,
      reference: `AUD-${e.id}`,
      locationOrDest: 'Catalog Master Record',
      notes: `${e.changeReason} [Before: ${e.beforeData} -> After: ${e.afterData}]`,
      badgeColor: 'teal'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTrail = unifiedTrail.filter(entry => {
    const matchesType = filterType === 'all' || entry.type === filterType;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      entry.reference.toLowerCase().includes(q) ||
      entry.performedBy.toLowerCase().includes(q) ||
      entry.locationOrDest.toLowerCase().includes(q) ||
      entry.notes.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  // Calculate metrics safely
  const currentStockVal = Number(item.currentStock) || 0;
  const costPriceVal = Number(item.costPrice) || 0;
  const totalValuation = currentStockVal * costPriceVal;

  const totalReceived = itemMovements
    .filter(m => m.movementType === 'receipt')
    .reduce((sum, m) => sum + Math.abs(Number(m.quantity) || 0), 0);

  const totalIssued = itemMovements
    .filter(m => m.movementType === 'issue')
    .reduce((sum, m) => sum + Math.abs(Number(m.quantity) || 0), 0);

  const handlePrintReport = () => {
    const printContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stock History Report - ${item.name} (${item.itemCode})</title>
  <style>
    @page { size: A4 landscape; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; padding: 20px; font-size: 12px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
    .kpi { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 10px; }
    .kpi-title { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; }
    .kpi-val { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
    th { background: #f1f5f9; text-align: left; padding: 6px 8px; border-bottom: 1px solid #cbd5e1; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    .signatures { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
    .sig-line { border-bottom: 1px solid #0f172a; height: 30px; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 style="font-size: 18px; font-weight: bold;">${activeCompany.name}</h2>
      <div style="font-size: 12px; font-weight: bold; color: #2563eb;">OFFICIAL STOCK LIFECYCLE AUDIT REPORT</div>
      <div style="font-size: 11px; color: #64748b;">Material: ${item.name} (${item.itemCode}) • Category: ${item.categoryName}</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      Generated: ${new Date().toISOString().split('T')[0]}<br>
      Total Ledger Entries: ${unifiedTrail.length}
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-title">Current On-Hand Stock</div>
      <div class="kpi-val" style="color: #2563eb;">${currentStockVal.toLocaleString()} ${item.unit || 'Units'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">Total Inward GRN Receipts</div>
      <div class="kpi-val" style="color: #16a34a;">+${totalReceived.toLocaleString()} ${item.unit || 'Units'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">Total Site Dispatches</div>
      <div class="kpi-val" style="color: #dc2626;">-${totalIssued.toLocaleString()} ${item.unit || 'Units'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">Current Asset Valuation</div>
      <div class="kpi-val">${activeCompany.currency} ${totalValuation.toLocaleString()}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date & Time</th>
        <th>Event Type</th>
        <th>Reference #</th>
        <th>Qty Impact</th>
        <th>Location / Destination</th>
        <th>Actor / User</th>
        <th>Action Description & Notes</th>
      </tr>
    </thead>
    <tbody>
      ${unifiedTrail.map(e => `
        <tr>
          <td>${e.date}</td>
          <td><strong>${e.typeLabel}</strong></td>
          <td style="font-family: monospace;">${e.reference}</td>
          <td style="font-weight: bold; color: ${e.quantityChange ? (e.quantityChange > 0 ? '#16a34a' : '#dc2626') : '#64748b'};">
            ${e.quantityChange !== undefined ? `${e.quantityChange > 0 ? '+' : ''}${e.quantityChange} ${item.unit}` : 'Specification'}
          </td>
          <td>${e.locationOrDest}</td>
          <td>${e.performedBy}</td>
          <td>${e.notes}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <div style="font-weight: bold;">Storekeeper Audit Sign-off</div>
      <div style="font-size: 10px; color: #64748b;">Date: ________________________</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div style="font-weight: bold;">Internal Auditor Certification</div>
      <div style="font-size: 10px; color: #64748b;">Date: ________________________</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div style="font-weight: bold;">Finance & Accounts Approval</div>
      <div style="font-size: 10px; color: #64748b;">Date: ________________________</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([printContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const win = document.createElement('iframe');
    win.style.position = 'fixed';
    win.style.right = '0';
    win.style.bottom = '0';
    win.style.width = '0';
    win.style.height = '0';
    win.style.border = '0';
    document.body.appendChild(win);
    win.contentWindow?.document.open();
    win.contentWindow?.document.write(printContent);
    win.contentWindow?.document.close();
    setTimeout(() => {
      win.contentWindow?.focus();
      win.contentWindow?.print();
    }, 200);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'EventType', 'Reference', 'QuantityImpact', 'Unit', 'LocationOrDest', 'PerformedBy', 'Notes'];
    const rows = unifiedTrail.map(e => [
      e.date,
      `"${e.typeLabel}"`,
      `"${e.reference}"`,
      e.quantityChange !== undefined ? e.quantityChange : 0,
      `"${item.unit}"`,
      `"${e.locationOrDest}"`,
      `"${e.performedBy}"`,
      `"${e.notes.replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stock_Audit_Trail_${item.itemCode}_${new Date().toISOString().split('T')[0]}.csv`;
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
        maxW="850px"
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
              <History size={22} color="#2563eb" />
              <Heading size="md" color="#0f172a">{item.name}</Heading>
              <Badge colorPalette="blue" size="sm" fontFamily="mono">{item.itemCode}</Badge>
            </Flex>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Complete Material Lifecycle, Inflow Receipts, Site Issues, and Audit Trail History
            </Text>
          </Box>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X size={16} />
          </Button>
        </Flex>

        {/* Metrics Overview Cards */}
        <SimpleGrid columns={{ base: 2, sm: 4 }} gap={3} mb={4}>
          <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b">Current Stock</Text>
            <Text fontSize="lg" fontWeight="black" color="#2563eb" mt={0.5}>
              {currentStockVal.toLocaleString()} {item.unit || 'Units'}
            </Text>
            <Text fontSize="10px" color="#64748b">Min buffer: {item.minLevel ?? 0} {item.unit || 'Units'}</Text>
          </Box>

          <Box p={3} bg="#f0fdf4" borderRadius="10px" border="1px solid #bbf7d0">
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#166534">Total GRN Received</Text>
            <Text fontSize="lg" fontWeight="black" color="#16a34a" mt={0.5}>
              +{totalReceived.toLocaleString()} {item.unit || 'Units'}
            </Text>
            <Text fontSize="10px" color="#166534">Inward procurement</Text>
          </Box>

          <Box p={3} bg="#fef2f2" borderRadius="10px" border="1px solid #fecaca">
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#991b1b">Total Site Dispatched</Text>
            <Text fontSize="lg" fontWeight="black" color="#dc2626" mt={0.5}>
              -{totalIssued.toLocaleString()} {item.unit || 'Units'}
            </Text>
            <Text fontSize="10px" color="#991b1b">Approved site requisitions</Text>
          </Box>

          <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b">Asset Valuation</Text>
            <Text fontSize="lg" fontWeight="black" color="#0f172a" mt={0.5}>
              {activeCompany.currency} {totalValuation.toLocaleString()}
            </Text>
            <Text fontSize="10px" color="#64748b">@{activeCompany.currency} {costPriceVal.toLocaleString()}/{item.unit || 'Units'}</Text>
          </Box>
        </SimpleGrid>

        {/* Filter & Search Bar */}
        <Flex justify="space-between" align="center" gap={3} mb={3} wrap="wrap">
          <Flex gap={2} align="center" flex="1" maxW="360px">
            <Box position="relative" w="100%">
              <Input
                size="sm"
                placeholder="Search reference, destination, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </Flex>

          <Flex gap={2} align="center">
            <Button
              size="xs"
              variant={filterType === 'all' ? 'solid' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              All ({unifiedTrail.length})
            </Button>
            <Button
              size="xs"
              colorPalette="green"
              variant={filterType === 'receipt' ? 'solid' : 'outline'}
              onClick={() => setFilterType('receipt')}
            >
              GRN Receipts
            </Button>
            <Button
              size="xs"
              colorPalette="blue"
              variant={filterType === 'issue' ? 'solid' : 'outline'}
              onClick={() => setFilterType('issue')}
            >
              Site Issues
            </Button>
            <Button
              size="xs"
              colorPalette="purple"
              variant={filterType === 'transfer' ? 'solid' : 'outline'}
              onClick={() => setFilterType('transfer')}
            >
              Transfers
            </Button>
            <Button
              size="xs"
              colorPalette="teal"
              variant={filterType === 'edit' ? 'solid' : 'outline'}
              onClick={() => setFilterType('edit')}
            >
              Edits
            </Button>
          </Flex>
        </Flex>

        {/* Audit Trail Ledger Table */}
        <Card.Root bg="white" borderRadius="12px" border="1px solid #e2e8f0" overflow="hidden">
          <Box overflowX="auto" maxH="380px" overflowY="auto">
            <Table.Root size="sm" striped>
              <Table.Header>
                <Table.Row bg="#f8fafc">
                  <Table.ColumnHeader fontSize="10px">Date & Ref</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Action Type</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Quantity Change</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Target Site / Store</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Performed By</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Notes & Reason</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredTrail.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} textAlign="center" py={6} color="#64748b" fontSize="xs">
                      No audit or movement events match the current filter.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredTrail.map(entry => (
                    <Table.Row key={entry.id}>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="bold" color="#0f172a">{entry.date}</Text>
                        <Badge size="xs" variant="outline" fontFamily="mono">{entry.reference}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={entry.badgeColor as any}>
                          {entry.typeLabel}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold">
                        {entry.quantityChange !== undefined ? (
                          <Text color={entry.quantityChange > 0 ? '#16a34a' : '#dc2626'}>
                            {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange} {item.unit}
                          </Text>
                        ) : (
                          <Badge size="xs" variant="subtle" colorPalette="teal">Specification Edit</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="medium" color="#334155">
                        {entry.locationOrDest}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">
                        {entry.performedBy}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#0f172a" maxW="200px">
                        <Text truncate title={entry.notes}>{entry.notes}</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Root>

        {/* Footer Actions */}
        <Flex justify="space-between" align="center" gap={2} mt={5} pt={3} borderTop="1px solid #f1f5f9">
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download size={14} /> Export Audit Log CSV
          </Button>
          <Flex gap={2}>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" colorPalette="blue" onClick={handlePrintReport}>
              <Printer size={14} /> Print Stock Audit Dossier
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
