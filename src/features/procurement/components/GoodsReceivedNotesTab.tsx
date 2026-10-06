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
  Input,
  Stack,
  NativeSelect,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { GoodsReceivedNote, PurchaseOrder } from '../../../types';
import {
  PackageCheck,
  Plus,
  Printer,
  Building2,
  Calendar,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Download,
  Eye,
  Warehouse as WarehouseIcon,
  ShieldCheck,
  ShieldAlert,
  Truck
} from 'lucide-react';

interface GoodsReceivedNotesTabProps {
  preSelectedPO?: PurchaseOrder | null;
  onClearPreSelectedPO?: () => void;
}

export const GoodsReceivedNotesTab: React.FC<GoodsReceivedNotesTabProps> = ({
  preSelectedPO,
  onClearPreSelectedPO
}) => {
  const {
    goodsReceivedNotes,
    purchaseOrders,
    warehouses,
    suppliers,
    createGRN,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingGRN, setViewingGRN] = useState<GoodsReceivedNote | null>(null);

  // Form State
  const eligiblePOs = purchaseOrders.filter(p => p.status === 'approved' || p.status === 'partially_received');
  const [selectedPOId, setSelectedPOId] = useState<number>(
    preSelectedPO ? preSelectedPO.id : (eligiblePOs[0]?.id || 1)
  );

  const activePO = purchaseOrders.find(p => p.id === selectedPOId) || eligiblePOs[0];

  const [formData, setFormData] = useState({
    warehouseId: activePO?.warehouseId || warehouses[0]?.id || 1,
    warehouseName: activePO?.warehouseName || warehouses[0]?.name || 'Main Yard Warehouse A',
    receivedDate: new Date().toISOString().split('T')[0],
    receivedBy: currentUserName,
    inspectedBy: 'Chief QC Inspector - Materials',
    vendorDeliveryNote: `DN-${Math.floor(10000 + Math.random() * 90000)}`,
    waybillRef: 'WB-IN-4091',
    vehicleNumber: 'TRK-8820-EX',
    qcInspectionStatus: 'Passed' as 'Passed' | 'Passed with Conditions' | 'Failed',
    remarks: 'Goods inspected against manufacturer mill test certs and approved PO specifications.'
  });

  // Items State for the Form
  const [receiptItems, setReceiptItems] = useState<Array<{
    inventoryItemId?: number;
    itemCode?: string;
    description: string;
    unit: string;
    quantityOrdered: number;
    quantityPreviouslyReceived: number;
    quantityReceived: number;
    quantityAccepted: number;
    quantityRejected: number;
    rejectionReason: string;
    unitPrice: number;
  }>>([]);

  // When active PO changes or when preSelectedPO is provided, initialize receiptItems
  React.useEffect(() => {
    if (preSelectedPO) {
      setSelectedPOId(preSelectedPO.id);
      setShowCreateModal(true);
    }
  }, [preSelectedPO]);

  React.useEffect(() => {
    if (activePO) {
      setReceiptItems(
        activePO.items.map(item => {
          const prev = item.quantityReceived || 0;
          const remaining = Math.max(0, item.quantity - prev);
          return {
            inventoryItemId: item.inventoryItemId,
            itemCode: item.itemCode,
            description: item.description,
            unit: item.unit || 'Units',
            quantityOrdered: item.quantity,
            quantityPreviouslyReceived: prev,
            quantityReceived: remaining,
            quantityAccepted: remaining,
            quantityRejected: 0,
            rejectionReason: '',
            unitPrice: item.unitPrice
          };
        })
      );
    }
  }, [selectedPOId, activePO]);

  const handlePOSelectionChange = (poIdStr: string) => {
    const id = Number(poIdStr);
    setSelectedPOId(id);
    const po = purchaseOrders.find(p => p.id === id);
    if (po && po.warehouseId) {
      setFormData(prev => ({
        ...prev,
        warehouseId: po.warehouseId!,
        warehouseName: po.warehouseName || prev.warehouseName
      }));
    }
  };

  const handleWarehouseSelectionChange = (wIdStr: string) => {
    const id = Number(wIdStr);
    const wh = warehouses.find(w => w.id === id);
    if (wh) {
      setFormData(prev => ({
        ...prev,
        warehouseId: wh.id,
        warehouseName: wh.name
      }));
    }
  };

  const handleItemQtyReceivedChange = (index: number, val: number) => {
    const updated = [...receiptItems];
    const item = updated[index];
    item.quantityReceived = val;
    // Default accepted to received minus rejected
    item.quantityAccepted = Math.max(0, val - item.quantityRejected);
    setReceiptItems(updated);
  };

  const handleItemQtyRejectedChange = (index: number, val: number) => {
    const updated = [...receiptItems];
    const item = updated[index];
    item.quantityRejected = val;
    item.quantityAccepted = Math.max(0, item.quantityReceived - val);
    setReceiptItems(updated);
  };

  const handleItemRejectionReasonChange = (index: number, reason: string) => {
    const updated = [...receiptItems];
    updated[index].rejectionReason = reason;
    setReceiptItems(updated);
  };

  const handleSaveGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePO) return;

    createGRN({
      purchaseOrderId: activePO.id,
      poNumber: activePO.poNumber,
      supplierId: activePO.supplierId,
      supplierName: activePO.supplierName,
      warehouseId: formData.warehouseId,
      warehouseName: formData.warehouseName,
      receivedDate: formData.receivedDate,
      receivedBy: formData.receivedBy,
      inspectedBy: formData.inspectedBy,
      vendorDeliveryNote: formData.vendorDeliveryNote,
      waybillRef: formData.waybillRef,
      vehicleNumber: formData.vehicleNumber,
      qcInspectionStatus: formData.qcInspectionStatus,
      remarks: formData.remarks,
      items: receiptItems
    });

    setShowCreateModal(false);
    if (onClearPreSelectedPO) {
      onClearPreSelectedPO();
    }
  };

  const getStatusLabel = (status: GoodsReceivedNote['status']) => {
    switch (status) {
      case 'inspected_received': return 'Inspected & Received';
      case 'partially_accepted': return 'Partial Receipt';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getStatusColor = (status: GoodsReceivedNote['status']) => {
    switch (status) {
      case 'inspected_received': return 'green';
      case 'partially_accepted': return 'blue';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  // Filter GRNs
  const filteredGRNs = goodsReceivedNotes.filter(g => {
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'All' || String(g.warehouseId) === warehouseFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      g.grnNumber.toLowerCase().includes(q) ||
      g.poNumber.toLowerCase().includes(q) ||
      g.supplierName.toLowerCase().includes(q) ||
      g.receivedBy.toLowerCase().includes(q) ||
      g.warehouseName.toLowerCase().includes(q);

    return matchesStatus && matchesWarehouse && matchesSearch;
  });

  const totalValueReceived = goodsReceivedNotes.reduce((sum, g) => sum + (g.totalReceivedValue || g.totalValueReceived || 0), 0);
  const totalAcceptedCount = goodsReceivedNotes.filter(g => g.qcInspectionStatus === 'Passed').length;
  const conditionalCount = goodsReceivedNotes.filter(g => g.qcInspectionStatus === 'Passed with Conditions').length;
  const rejectedGRNCount = goodsReceivedNotes.filter(g => g.status === 'rejected' || g.qcInspectionStatus === 'Failed').length;

  return (
    <Stack gap={5}>
      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Received Goods Value</Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalValueReceived.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>{goodsReceivedNotes.length} GRNs logged in warehouse</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Passed Quality Inspection</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <ShieldCheck size={18} color="#16a34a" />
            <Text fontSize="xl" fontWeight="black" color="#16a34a">{totalAcceptedCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={0.5}>100% compliant materials</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Conditional Acceptance</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <AlertTriangle size={18} color="#d97706" />
            <Text fontSize="xl" fontWeight="black" color="#d97706">{conditionalCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Minor deviation noted</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Rejected Material Shipments</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <ShieldAlert size={18} color="#dc2626" />
            <Text fontSize="xl" fontWeight="black" color="#dc2626">{rejectedGRNCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#dc2626" mt={0.5}>Returned to vendor / credit pending</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Header and Controls */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
        <Flex gap={2} wrap="wrap">
          {[
            { id: 'All', label: 'All Receipts' },
            { id: 'inspected_received', label: 'Inspected & Received' },
            { id: 'partially_accepted', label: 'Partial Receipt' },
            { id: 'rejected', label: 'Rejected' }
          ].map(tab => (
            <Button
              key={tab.id}
              size="xs"
              variant={statusFilter === tab.id ? 'solid' : 'outline'}
              colorPalette={statusFilter === tab.id ? 'blue' : 'gray'}
              borderColor="#cbd5e1"
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>

        <Flex gap={2}>
          <Button
            size="sm"
            colorPalette="purple"
            fontWeight="semibold"
            disabled={eligiblePOs.length === 0}
            onClick={() => setShowCreateModal(true)}
          >
            <PackageCheck size={16} /> Process Goods Receipt (GRN)
          </Button>
        </Flex>
      </Flex>

      {/* Search and Filters */}
      <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
          <Box position="relative">
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} />
            <Input
              size="sm"
              pl="36px"
              placeholder="Search GRN #, PO #, supplier, or store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Box>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                aria-label="Filter by Warehouse"
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
              >
                <option value="All">All Receiving Warehouses</option>
                {warehouses.map(w => (
                  <option key={w.id} value={String(w.id)}>{w.name}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          <Box>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Receipt Statuses</option>
                <option value="inspected_received">Inspected & Received</option>
                <option value="partially_accepted">Partial Receipt</option>
                <option value="rejected">Rejected</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>
        </SimpleGrid>
      </Card.Root>

      {/* GRN Table */}
      <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Table.Root size="sm" variant="outline">
          <Table.Header bg="#f8fafc">
            <Table.Row>
              <Table.ColumnHeader fontSize="11px" color="#64748b">GRN NUMBER</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">PO REFERENCE</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">SUPPLIER</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">WAREHOUSE</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">DATE</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">QC STATUS</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="right">VALUE RECEIVED</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="center">STATUS</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="center">ACTIONS</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredGRNs.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9} textAlign="center" py={10} color="#94a3b8">
                  No Goods Received Notes found matching current criteria.
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredGRNs.map((grn) => (
                <Table.Row key={grn.id} _hover={{ bg: '#fbfcfd' }}>
                  <Table.Cell fontWeight="bold" fontFamily="mono" color="#9333ea">
                    {grn.grnNumber}
                  </Table.Cell>

                  <Table.Cell fontFamily="mono" fontSize="xs" color="#2563eb">
                    {grn.poNumber}
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontWeight="semibold" color="#0f172a">{grn.supplierName}</Text>
                    {grn.vendorDeliveryNote && (
                      <Text fontSize="10px" color="#64748b">DN: {grn.vendorDeliveryNote}</Text>
                    )}
                  </Table.Cell>

                  <Table.Cell fontSize="xs" color="#334155">
                    {grn.warehouseName}
                  </Table.Cell>

                  <Table.Cell fontSize="xs" color="#64748b">
                    {grn.receivedDate}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      size="xs"
                      colorPalette={
                        grn.qcInspectionStatus === 'Passed' ? 'green' :
                        grn.qcInspectionStatus === 'Passed with Conditions' ? 'orange' : 'red'
                      }
                    >
                      {grn.qcInspectionStatus}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right" fontWeight="bold" color="#0f172a">
                    {activeCompany.currency} {(grn.totalReceivedValue || grn.totalValueReceived || 0).toLocaleString()}
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Badge
                      size="xs"
                      colorPalette={getStatusColor(grn.status)}
                    >
                      {getStatusLabel(grn.status)}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => setViewingGRN(grn)}
                    >
                      <Eye size={13} /> View Voucher
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card.Root>

      {/* Modal: View Official GRN Voucher */}
      {viewingGRN && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1100"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
          backdropFilter="blur(2px)"
        >
          <Box bg="white" borderRadius="16px" p={6} maxW="780px" w="100%" boxShadow="2xl" maxH="90vh" overflowY="auto">
            {/* Action Bar */}
            <Flex justify="space-between" align="center" pb={4} mb={4} borderBottom="1px solid #e2e8f0">
              <Flex align="center" gap={2}>
                <Badge size="md" colorPalette="purple" fontFamily="mono" fontSize="sm">
                  {viewingGRN.grnNumber}
                </Badge>
                <Badge
                  size="sm"
                  colorPalette={getStatusColor(viewingGRN.status)}
                >
                  {getStatusLabel(viewingGRN.status)}
                </Badge>
              </Flex>
              <Flex gap={2}>
                <Button size="xs" variant="outline" onClick={() => window.print()}>
                  <Printer size={13} /> Print GRN
                </Button>
                <Button size="xs" variant="ghost" onClick={() => setViewingGRN(null)}>
                  Close
                </Button>
              </Flex>
            </Flex>

            {/* Printable Document Body */}
            <Box p={6} border="1px solid #cbd5e1" borderRadius="10px" bg="white">
              {/* Header */}
              <Flex justify="space-between" align="flex-start" mb={6}>
                <Box>
                  <Heading size="md" color="#0f172a">{activeCompany.name}</Heading>
                  <Text fontSize="xs" color="#64748b">Store Receiving & Materials Quality Assurance</Text>
                  <Text fontSize="xs" color="#64748b">Central Warehouse Yard • Gate 2 Weighbridge</Text>
                </Box>
                <Box textAlign="right">
                  <Heading size="lg" color="#9333ea" letterSpacing="tight">GOODS RECEIVED NOTE</Heading>
                  <Text fontSize="xs" fontFamily="mono" fontWeight="bold" color="#0f172a">
                    GRN NO: {viewingGRN.grnNumber}
                  </Text>
                  <Text fontSize="xs" color="#64748b">PO Ref: {viewingGRN.poNumber}</Text>
                  <Text fontSize="xs" color="#64748b">Receipt Date: {viewingGRN.receivedDate}</Text>
                </Box>
              </Flex>

              {/* Delivery Meta Grid */}
              <SimpleGrid columns={2} gap={4} p={4} bg="#f8fafc" borderRadius="8px" mb={6} border="1px solid #e2e8f0" fontSize="xs">
                <Box>
                  <Text fontWeight="bold" color="#64748b" textTransform="uppercase">VENDOR & DISPATCH DETAILS</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>{viewingGRN.supplierName}</Text>
                  <Text color="#475569">Delivery Note / Invoice: {viewingGRN.vendorDeliveryNote || 'N/A'}</Text>
                  <Text color="#475569">Waybill / Transporter: {viewingGRN.waybillRef || 'Standard Delivery'}</Text>
                  <Text color="#475569">Vehicle Registration: {viewingGRN.vehicleNumber || 'Direct'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="#64748b" textTransform="uppercase">RECEIVING WAREHOUSE & QC</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>{viewingGRN.warehouseName}</Text>
                  <Text color="#475569">Storekeeper: {viewingGRN.receivedBy}</Text>
                  <Text color="#475569">Inspector: {viewingGRN.inspectedBy || 'Quality Control Lead'}</Text>
                  <Flex align="center" gap={1.5} mt={1}>
                    <Text color="#475569">Inspection Result:</Text>
                    <Badge size="xs" colorPalette={viewingGRN.qcInspectionStatus === 'Passed' ? 'green' : 'orange'}>
                      {viewingGRN.qcInspectionStatus}
                    </Badge>
                  </Flex>
                </Box>
              </SimpleGrid>

              {/* Items Breakdown Table */}
              <Table.Root size="sm" variant="outline" mb={4}>
                <Table.Header bg="#f1f5f9">
                  <Table.Row>
                    <Table.ColumnHeader fontSize="10px">#</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">MATERIAL DESCRIPTION</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">ORDERED</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">DELIVERED</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">ACCEPTED</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">REJECTED</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">VALUE ACCEPTED</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {viewingGRN.items.map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell fontSize="xs">{idx + 1}</Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="semibold" color="#0f172a">{item.description}</Text>
                        {item.rejectionReason && (
                          <Text fontSize="10px" color="#dc2626">Rejection note: {item.rejectionReason}</Text>
                        )}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center">{item.quantityOrdered} {item.unit}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center" fontWeight="bold">{item.quantityReceived}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center" color="#16a34a" fontWeight="bold">
                        {item.quantityAccepted}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center" color={item.quantityRejected > 0 ? '#dc2626' : '#64748b'} fontWeight="bold">
                        {item.quantityRejected}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold">
                        {activeCompany.currency} {item.lineTotal.toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>

              {/* Total Value */}
              <Flex justify="flex-end" mb={6}>
                <Box w="260px" p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0" fontSize="xs">
                  <Flex justify="space-between" fontWeight="bold" color="#0f172a">
                    <Text>Total Credited to Stores:</Text>
                    <Text>{activeCompany.currency} {(viewingGRN.totalReceivedValue || viewingGRN.totalValueReceived || 0).toLocaleString()}</Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Remarks */}
              {viewingGRN.remarks && (
                <Box mb={6} p={3} bg="#f8fafc" borderRadius="6px" fontSize="11px" color="#475569">
                  <Text fontWeight="bold" color="#334155" mb={1}>Inspector Remarks & Material Compliance Log:</Text>
                  <Text>{viewingGRN.remarks}</Text>
                </Box>
              )}

              {/* Signatures */}
              <SimpleGrid columns={3} gap={4} pt={8} borderTop="1px solid #cbd5e1" textAlign="center" fontSize="xs">
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">Delivered By Transporter</Text>
                  <Text fontSize="10px" color="#64748b">Driver Signature</Text>
                </Box>
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">Received into Store By</Text>
                  <Text fontSize="10px" color="#64748b">{viewingGRN.receivedBy}</Text>
                </Box>
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">QC Material Verification</Text>
                  <Text fontSize="10px" color="#64748b">{viewingGRN.inspectedBy || 'Lead QA/QC'}</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal: Process Goods Receipt Note (GRN) */}
      {showCreateModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1100"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
          backdropFilter="blur(2px)"
        >
          <Box bg="white" borderRadius="16px" p={6} maxW="880px" w="100%" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="md" color="#0f172a">Create Goods Received Note (GRN)</Heading>
                <Text fontSize="xs" color="#64748b">
                  Inspect incoming vendor deliveries against Purchase Orders and credit stock into stores.
                </Text>
              </Box>
              <Button size="xs" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </Flex>

            <form onSubmit={handleSaveGRN}>
              <Stack gap={4} fontSize="xs">
                {/* PO Selection & Destination */}
                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Select Purchase Order *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Select Purchase Order"
                        value={selectedPOId}
                        onChange={(e) => handlePOSelectionChange(e.target.value)}
                      >
                        {eligiblePOs.map(po => (
                          <option key={po.id} value={po.id}>
                            {po.poNumber} — {po.supplierName} ({activeCompany.currency} {po.totalAmount.toLocaleString()})
                          </option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Receiving Warehouse *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Receiving Warehouse"
                        value={formData.warehouseId}
                        onChange={(e) => handleWarehouseSelectionChange(e.target.value)}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Receipt Date *</Text>
                    <Input
                      type="date"
                      required
                      size="sm"
                      value={formData.receivedDate}
                      onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                {/* Delivery Logistics */}
                <SimpleGrid columns={{ base: 1, sm: 4 }} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Vendor Delivery Note / Inv</Text>
                    <Input
                      size="sm"
                      value={formData.vendorDeliveryNote}
                      onChange={(e) => setFormData({ ...formData, vendorDeliveryNote: e.target.value })}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Vehicle / Carrier No.</Text>
                    <Input
                      size="sm"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Storekeeper Name</Text>
                    <Input
                      size="sm"
                      value={formData.receivedBy}
                      onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>QA/QC Inspector</Text>
                    <Input
                      size="sm"
                      value={formData.inspectedBy}
                      onChange={(e) => setFormData({ ...formData, inspectedBy: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                {/* Inspection Status */}
                <Box p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                  <Text fontWeight="bold" color="#0f172a" mb={2}>Quality & Compliance Sign-Off</Text>
                  <Flex gap={4}>
                    <Button
                      size="xs"
                      type="button"
                      variant={formData.qcInspectionStatus === 'Passed' ? 'solid' : 'outline'}
                      colorPalette={formData.qcInspectionStatus === 'Passed' ? 'green' : 'gray'}
                      onClick={() => setFormData({ ...formData, qcInspectionStatus: 'Passed' })}
                    >
                      <ShieldCheck size={14} /> Passed (100% Compliant)
                    </Button>
                    <Button
                      size="xs"
                      type="button"
                      variant={formData.qcInspectionStatus === 'Passed with Conditions' ? 'solid' : 'outline'}
                      colorPalette={formData.qcInspectionStatus === 'Passed with Conditions' ? 'orange' : 'gray'}
                      onClick={() => setFormData({ ...formData, qcInspectionStatus: 'Passed with Conditions' })}
                    >
                      <AlertTriangle size={14} /> Passed with Conditions
                    </Button>
                    <Button
                      size="xs"
                      type="button"
                      variant={formData.qcInspectionStatus === 'Failed' ? 'solid' : 'outline'}
                      colorPalette={formData.qcInspectionStatus === 'Failed' ? 'red' : 'gray'}
                      onClick={() => setFormData({ ...formData, qcInspectionStatus: 'Failed' })}
                    >
                      <ShieldAlert size={14} /> Failed (Reject All)
                    </Button>
                  </Flex>
                </Box>

                {/* Items Receiving Table */}
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                  <Heading size="xs" color="#0f172a" mb={2}>Verify Incoming Quantities by Item</Heading>

                  <Table.Root size="sm" variant="outline" bg="white">
                    <Table.Header bg="#f1f5f9">
                      <Table.Row>
                        <Table.ColumnHeader fontSize="10px">ITEM DESCRIPTION</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" textAlign="center">ORDERED</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" textAlign="center">PREV RECV</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" textAlign="center" w="90px">NOW RECV</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" textAlign="center" w="90px">ACCEPTED</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" textAlign="center" w="90px">REJECTED</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="10px" w="180px">REJECTION REASON</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {receiptItems.map((item, idx) => (
                        <Table.Row key={idx}>
                          <Table.Cell>
                            <Text fontWeight="semibold" color="#0f172a">{item.description}</Text>
                            {item.itemCode && <Text fontSize="9px" color="#64748b">Code: {item.itemCode}</Text>}
                          </Table.Cell>
                          <Table.Cell textAlign="center">{item.quantityOrdered} {item.unit}</Table.Cell>
                          <Table.Cell textAlign="center" color="#64748b">{item.quantityPreviouslyReceived}</Table.Cell>
                          <Table.Cell textAlign="center">
                            <Input
                              size="xs"
                              type="number"
                              min="0"
                              value={item.quantityReceived}
                              onChange={(e) => handleItemQtyReceivedChange(idx, Number(e.target.value))}
                            />
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            <Input
                              size="xs"
                              type="number"
                              min="0"
                              value={item.quantityAccepted}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...receiptItems];
                                updated[idx].quantityAccepted = val;
                                updated[idx].quantityRejected = Math.max(0, updated[idx].quantityReceived - val);
                                setReceiptItems(updated);
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            <Input
                              size="xs"
                              type="number"
                              min="0"
                              value={item.quantityRejected}
                              onChange={(e) => handleItemQtyRejectedChange(idx, Number(e.target.value))}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              size="xs"
                              placeholder="e.g. Broken edges, off-spec"
                              disabled={item.quantityRejected === 0}
                              value={item.rejectionReason}
                              onChange={(e) => handleItemRejectionReasonChange(idx, e.target.value)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Inspector Remarks & Storage Notes</Text>
                  <Textarea
                    rows={2}
                    size="sm"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="purple" type="submit" fontWeight="semibold">
                    Confirm Receipt & Update Inventory Stock
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
