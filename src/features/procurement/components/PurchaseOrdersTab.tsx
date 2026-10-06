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
import { PurchaseOrder } from '../../../types';
import {
  ShoppingCart,
  Plus,
  PackageCheck,
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
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PurchaseOrdersTabProps {
  onOpenCreateGRNForPO?: (po: PurchaseOrder) => void;
}

export const PurchaseOrdersTab: React.FC<PurchaseOrdersTabProps> = ({ onOpenCreateGRNForPO }) => {
  const {
    purchaseOrders,
    createPurchaseOrder,
    updatePOStatus,
    suppliers,
    projects,
    warehouses,
    inventory,
    activeCompany,
    activeRole,
    currentUserName
  } = useERP();

  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'pending_approval' | 'approved' | 'partially_received' | 'received' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showApproveModal, setShowApproveModal] = useState<PurchaseOrder | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<PurchaseOrder | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    supplierId: suppliers[0]?.id || 1,
    supplierName: suppliers[0]?.companyName || '',
    supplierAddress: suppliers[0]?.address || '',
    supplierPhone: suppliers[0]?.phone || '',
    projectId: projects[0]?.id || 1,
    projectName: projects[0]?.name || '',
    warehouseId: warehouses[0]?.id || 1,
    warehouseName: warehouses[0]?.name || '',
    expectedDelivery: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    paymentTerms: 'Net 30 Days',
    deliveryAddress: 'Main Project Site Storage Yard, Gate 2',
    notes: 'Please quote PO reference on delivery invoice. Deliveries accepted Mon-Sat 08:00 - 17:00.'
  });

  const [poItems, setPoItems] = useState([
    {
      inventoryItemId: inventory[0]?.id || 1,
      itemCode: inventory[0]?.itemCode || 'MAT-101',
      description: inventory[0]?.name || 'Standard Portland Cement Type 1 (50kg)',
      quantity: 50,
      unit: inventory[0]?.unit || 'Bags',
      unitPrice: inventory[0]?.costPrice || 28.5,
      discountPercent: 0,
      taxPercent: 5
    }
  ]);

  const canApprove = ['Managing Director', 'Finance Manager', 'Super Admin'].includes(activeRole);
  const canReceive = ['Procurement Officer', 'Site Engineer', 'Managing Director', 'Super Admin'].includes(activeRole);

  // Filtered POs
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesStatus = activeStatusTab === 'all' || po.status === activeStatusTab;
    const matchesSupplier = supplierFilter === 'All' || String(po.supplierId) === supplierFilter;
    const matchesProject = projectFilter === 'All' || String(po.projectId) === projectFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      po.poNumber.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      (po.projectName && po.projectName.toLowerCase().includes(q)) ||
      po.items.some(i => i.description.toLowerCase().includes(q));

    return matchesStatus && matchesSupplier && matchesProject && matchesSearch;
  });

  // KPI Calculations
  const totalPOAmount = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
  const pendingApprovalCount = purchaseOrders.filter(p => p.status === 'pending_approval').length;
  const approvedCount = purchaseOrders.filter(p => p.status === 'approved' || p.status === 'partially_received').length;
  const receivedCount = purchaseOrders.filter(p => p.status === 'received').length;

  const handleSupplierChange = (supIdStr: string) => {
    const sId = Number(supIdStr);
    const sup = suppliers.find(s => s.id === sId);
    if (sup) {
      setFormData(prev => ({
        ...prev,
        supplierId: sup.id,
        supplierName: sup.companyName,
        supplierAddress: sup.address,
        supplierPhone: sup.phone,
        paymentTerms: sup.paymentTerms || prev.paymentTerms
      }));
    }
  };

  const handleProjectChange = (projIdStr: string) => {
    const pId = Number(projIdStr);
    const proj = projects.find(p => p.id === pId);
    if (proj) {
      setFormData(prev => ({
        ...prev,
        projectId: proj.id,
        projectName: proj.name,
        deliveryAddress: `${proj.name} Site Compound, ${proj.siteLocation || 'Construction Gate'}`
      }));
    }
  };

  const handleWarehouseChange = (whIdStr: string) => {
    const wId = Number(whIdStr);
    const wh = warehouses.find(w => w.id === wId);
    if (wh) {
      setFormData(prev => ({
        ...prev,
        warehouseId: wh.id,
        warehouseName: wh.name
      }));
    }
  };

  const handleAddItemRow = () => {
    setPoItems(prev => [
      ...prev,
      {
        inventoryItemId: inventory[0]?.id || 1,
        itemCode: inventory[0]?.itemCode || 'MAT-GEN',
        description: '',
        quantity: 10,
        unit: 'Units',
        unitPrice: 50,
        discountPercent: 0,
        taxPercent: 5
      }
    ]);
  };

  const handleSelectInventoryItem = (rowIndex: number, itemIdStr: string) => {
    const itemId = Number(itemIdStr);
    const inv = inventory.find(i => i.id === itemId);
    if (inv) {
      const updated = [...poItems];
      updated[rowIndex] = {
        ...updated[rowIndex],
        inventoryItemId: inv.id,
        itemCode: inv.itemCode,
        description: inv.name,
        unit: inv.unit,
        unitPrice: inv.costPrice
      };
      setPoItems(updated);
    }
  };

  const handleUpdateItemField = (index: number, field: string, value: any) => {
    const updated = [...poItems];
    (updated[index] as any)[field] = value;
    setPoItems(updated);
  };

  const handleRemoveItemRow = (index: number) => {
    if (poItems.length <= 1) return;
    setPoItems(poItems.filter((_, idx) => idx !== index));
  };

  // Calculations for Create Modal
  const calcSubtotal = poItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const calcDiscount = poItems.reduce((sum, item) => {
    const base = item.quantity * item.unitPrice;
    return sum + (base * (item.discountPercent || 0)) / 100;
  }, 0);
  const calcTax = poItems.reduce((sum, item) => {
    const base = item.quantity * item.unitPrice;
    const discounted = base - ((base * (item.discountPercent || 0)) / 100);
    return sum + (discounted * (item.taxPercent || 0)) / 100;
  }, 0);
  const calcTotal = calcSubtotal - calcDiscount + calcTax;

  const handleSubmitPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName || poItems.length === 0) return;

    const formattedItems = poItems.map(i => {
      const lineBase = i.quantity * i.unitPrice;
      const discount = (lineBase * (i.discountPercent || 0)) / 100;
      const taxable = lineBase - discount;
      const tax = (taxable * (i.taxPercent || 0)) / 100;
      return {
        ...i,
        total: taxable + tax
      };
    });

    createPurchaseOrder({
      ...formData,
      subtotal: calcSubtotal,
      discountTotal: calcDiscount,
      taxTotal: calcTax,
      totalAmount: calcTotal,
      items: formattedItems
    });

    setShowCreateModal(false);
  };

  const handleApprovePO = () => {
    if (!showApproveModal) return;
    updatePOStatus(showApproveModal.id, 'approved');
    setShowApproveModal(null);
    setApprovalNotes('');
  };

  const handleRejectPO = () => {
    if (!showRejectModal || !rejectionReason.trim()) return;
    updatePOStatus(showRejectModal.id, 'rejected', rejectionReason);
    setShowRejectModal(null);
    setRejectionReason('');
  };

  return (
    <Stack gap={5}>
      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total PO Commitments</Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalPOAmount.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={0.5}>{purchaseOrders.length} Issued Orders</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Awaiting Approval</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <Clock size={18} color="#d97706" />
            <Text fontSize="xl" fontWeight="black" color="#d97706">{pendingApprovalCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Requires Executive Sign-off</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Approved / In Transit</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <CheckCircle2 size={18} color="#2563eb" />
            <Text fontSize="xl" fontWeight="black" color="#2563eb">{approvedCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={0.5}>Eligible for GRN site receiving</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Fully Received to Stores</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <PackageCheck size={18} color="#16a34a" />
            <Text fontSize="xl" fontWeight="black" color="#16a34a">{receivedCount}</Text>
          </Flex>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>Stock credited to warehouse</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Header and Controls */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
        <Flex gap={2} wrap="wrap">
          {(['all', 'pending_approval', 'approved', 'partially_received', 'received', 'cancelled'] as const).map(tab => (
            <Button
              key={tab}
              size="xs"
              variant={activeStatusTab === tab ? 'solid' : 'outline'}
              colorPalette={activeStatusTab === tab ? 'blue' : 'gray'}
              borderColor="#cbd5e1"
              onClick={() => setActiveStatusTab(tab)}
              textTransform="capitalize"
            >
              {tab.replace('_', ' ')}
            </Button>
          ))}
        </Flex>

        <Flex gap={2}>
          <Button
            size="sm"
            colorPalette="blue"
            fontWeight="semibold"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} /> Issue Purchase Order (PO)
          </Button>
        </Flex>
      </Flex>

      {/* Search and Filters Bar */}
      <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
          <Box position="relative">
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} />
            <Input
              size="sm"
              pl="36px"
              placeholder="Search PO #, supplier, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Box>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                aria-label="Filter by Supplier"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="All">All Suppliers / Vendors</option>
                {suppliers.map(s => (
                  <option key={s.id} value={String(s.id)}>{s.companyName}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          <Box>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                aria-label="Filter by Project"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All">All Project Sites</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>
        </SimpleGrid>
      </Card.Root>

      {/* Purchase Orders Table */}
      <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Table.Root size="sm" variant="outline">
          <Table.Header bg="#f8fafc">
            <Table.Row>
              <Table.ColumnHeader fontSize="11px" color="#64748b">PO NUMBER</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">SUPPLIER</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">DESTINATION / PROJECT</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">ORDER DATE</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b">EXPECTED DELIVERY</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="right">TOTAL AMOUNT</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="center">STATUS</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="11px" color="#64748b" textAlign="center">ACTIONS</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPOs.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8} textAlign="center" py={10} color="#94a3b8">
                  No purchase orders found matching current criteria.
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredPOs.map((po) => {
                const isApproved = po.status === 'approved' || po.status === 'partially_received';
                return (
                  <Table.Row key={po.id} _hover={{ bg: '#fbfcfd' }}>
                    <Table.Cell fontWeight="bold" fontFamily="mono" color="#2563eb">
                      {po.poNumber}
                    </Table.Cell>

                    <Table.Cell>
                      <Text fontWeight="semibold" color="#0f172a">{po.supplierName}</Text>
                      <Text fontSize="11px" color="#64748b">{po.paymentTerms}</Text>
                    </Table.Cell>

                    <Table.Cell>
                      <Text fontSize="xs" color="#334155" fontWeight="medium">
                        {po.projectName || 'Central Warehouse'}
                      </Text>
                      {po.warehouseName && (
                        <Text fontSize="10px" color="#64748b">{po.warehouseName}</Text>
                      )}
                    </Table.Cell>

                    <Table.Cell fontSize="xs" color="#64748b">
                      {po.orderDate}
                    </Table.Cell>

                    <Table.Cell fontSize="xs" color="#334155" fontWeight="medium">
                      {po.expectedDelivery}
                    </Table.Cell>

                    <Table.Cell textAlign="right" fontWeight="bold" color="#0f172a">
                      {activeCompany.currency} {po.totalAmount.toLocaleString()}
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Badge
                        size="xs"
                        colorPalette={
                          po.status === 'received' ? 'green' :
                          po.status === 'partially_received' ? 'blue' :
                          po.status === 'approved' ? 'teal' :
                          po.status === 'rejected' ? 'red' :
                          po.status === 'cancelled' ? 'gray' : 'orange'
                        }
                      >
                        {po.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Flex justify="center" gap={1.5}>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="blue"
                          title="View PO Details & Voucher"
                          onClick={() => setSelectedPO(po)}
                        >
                          <Eye size={14} /> View
                        </Button>

                        {po.status === 'pending_approval' && canApprove && (
                          <>
                            <Button
                              size="xs"
                              colorPalette="green"
                              onClick={() => setShowApproveModal(po)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              colorPalette="red"
                              onClick={() => setShowRejectModal(po)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {isApproved && canReceive && onOpenCreateGRNForPO && (
                          <Button
                            size="xs"
                            colorPalette="purple"
                            onClick={() => onOpenCreateGRNForPO(po)}
                          >
                            <PackageCheck size={13} /> Receive GRN
                          </Button>
                        )}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Card.Root>

      {/* Modal: View Official PO Voucher */}
      {selectedPO && (
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
                <Badge size="md" colorPalette="blue" fontFamily="mono" fontSize="sm">
                  {selectedPO.poNumber}
                </Badge>
                <Badge
                  size="sm"
                  colorPalette={
                    selectedPO.status === 'received' ? 'green' :
                    selectedPO.status === 'approved' ? 'teal' :
                    selectedPO.status === 'rejected' ? 'red' : 'orange'
                  }
                >
                  {selectedPO.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </Flex>
              <Flex gap={2}>
                <Button size="xs" variant="outline" onClick={() => window.print()}>
                  <Printer size={13} /> Print PO
                </Button>
                <Button size="xs" variant="ghost" onClick={() => setSelectedPO(null)}>
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
                  <Text fontSize="xs" color="#64748b">Headquarters & Central Procurement Division</Text>
                  <Text fontSize="xs" color="#64748b">{activeCompany.address || '742 Industrial Boulevard, Sector 4'}</Text>
                  <Text fontSize="xs" color="#64748b">Email: procurement@group.com • Tel: +1 (555) 019-2834</Text>
                </Box>
                <Box textAlign="right">
                  <Heading size="lg" color="#2563eb" letterSpacing="tight">PURCHASE ORDER</Heading>
                  <Text fontSize="xs" fontFamily="mono" fontWeight="bold" color="#0f172a">
                    NO: {selectedPO.poNumber}
                  </Text>
                  <Text fontSize="xs" color="#64748b">Order Date: {selectedPO.orderDate}</Text>
                  <Text fontSize="xs" color="#64748b">Expected: {selectedPO.expectedDelivery}</Text>
                </Box>
              </Flex>

              {/* Vendor & Delivery Box */}
              <SimpleGrid columns={2} gap={4} p={4} bg="#f8fafc" borderRadius="8px" mb={6} border="1px solid #e2e8f0">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">VENDOR / SUPPLIER</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>{selectedPO.supplierName}</Text>
                  <Text fontSize="xs" color="#475569">{selectedPO.supplierAddress || 'Official Supplier Address On File'}</Text>
                  <Text fontSize="xs" color="#475569">Phone: {selectedPO.supplierPhone || 'N/A'}</Text>
                  <Text fontSize="xs" color="#475569">Terms: {selectedPO.paymentTerms}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">SHIP TO / PROJECT SITE</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                    {selectedPO.projectName || 'Central Logistics Warehouse'}
                  </Text>
                  <Text fontSize="xs" color="#475569">{selectedPO.deliveryAddress || 'Central Stores Compound Gate 1'}</Text>
                  <Text fontSize="xs" color="#475569">Target Warehouse: {selectedPO.warehouseName || 'Yard Main Store'}</Text>
                </Box>
              </SimpleGrid>

              {/* Items Table */}
              <Table.Root size="sm" variant="outline" mb={4}>
                <Table.Header bg="#f1f5f9">
                  <Table.Row>
                    <Table.ColumnHeader fontSize="10px">#</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">ITEM DESCRIPTION</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">QTY</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="center">UNIT</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">UNIT PRICE</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">DISC %</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">TAX %</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">TOTAL ({activeCompany.currency})</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedPO.items.map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell fontSize="xs">{idx + 1}</Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="medium">
                        {item.description}
                        {item.itemCode && <Text as="span" fontSize="10px" color="#64748b" ml={1}>({item.itemCode})</Text>}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center" fontWeight="bold">{item.quantity}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center">{item.unit || 'Units'}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right">{item.unitPrice.toLocaleString()}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right">{item.discountPercent || 0}%</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right">{item.taxPercent || 0}%</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold">{item.total.toLocaleString()}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>

              {/* Totals Summary */}
              <Flex justify="flex-end" mb={6}>
                <Box w="280px" fontSize="xs">
                  <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                    <Text color="#64748b">Subtotal:</Text>
                    <Text fontWeight="semibold">{activeCompany.currency} {(selectedPO.subtotal || selectedPO.totalAmount).toLocaleString()}</Text>
                  </Flex>
                  {selectedPO.discountTotal !== undefined && selectedPO.discountTotal > 0 && (
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9" color="#16a34a">
                      <Text>Discount Total:</Text>
                      <Text>- {activeCompany.currency} {selectedPO.discountTotal.toLocaleString()}</Text>
                    </Flex>
                  )}
                  {selectedPO.taxTotal !== undefined && selectedPO.taxTotal > 0 && (
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Tax / VAT:</Text>
                      <Text fontWeight="semibold">+ {activeCompany.currency} {selectedPO.taxTotal.toLocaleString()}</Text>
                    </Flex>
                  )}
                  <Flex justify="space-between" py={2} borderTop="2px solid #0f172a" fontSize="sm" fontWeight="bold" color="#0f172a">
                    <Text>Grand Total:</Text>
                    <Text>{activeCompany.currency} {selectedPO.totalAmount.toLocaleString()}</Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Notes & Terms */}
              {selectedPO.notes && (
                <Box mb={6} p={3} bg="#f8fafc" borderRadius="6px" fontSize="11px" color="#475569">
                  <Text fontWeight="bold" color="#334155" mb={1}>Notes & Special Instructions:</Text>
                  <Text>{selectedPO.notes}</Text>
                </Box>
              )}

              {/* Signatures */}
              <SimpleGrid columns={3} gap={4} pt={8} borderTop="1px solid #cbd5e1" textAlign="center" fontSize="xs">
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">Prepared By</Text>
                  <Text fontSize="10px" color="#64748b">Procurement Officer</Text>
                </Box>
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">Authorized Approver</Text>
                  <Text fontSize="10px" color="#64748b">Managing Director / CFO</Text>
                </Box>
                <Box>
                  <Box h="36px" borderBottom="1px dashed #94a3b8" mb={2} />
                  <Text fontWeight="bold" color="#334155">Supplier Acknowledgment</Text>
                  <Text fontSize="10px" color="#64748b">Signature & Company Seal</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal: Create Purchase Order */}
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
          <Box bg="white" borderRadius="16px" p={6} maxW="840px" w="100%" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="#0f172a">Create Supplier Purchase Order</Heading>
              <Button size="xs" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </Flex>

            <form onSubmit={handleSubmitPO}>
              <Stack gap={4} fontSize="xs">
                {/* Header Information */}
                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Select Supplier / Vendor *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Select Supplier"
                        value={formData.supplierId}
                        onChange={(e) => handleSupplierChange(e.target.value)}
                      >
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.companyName} ({s.category})</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Project Allocation</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Project Allocation"
                        value={formData.projectId}
                        onChange={(e) => handleProjectChange(e.target.value)}
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Receiving Warehouse</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Receiving Warehouse"
                        value={formData.warehouseId}
                        onChange={(e) => handleWarehouseChange(e.target.value)}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Expected Delivery Date</Text>
                    <Input
                      type="date"
                      required
                      size="sm"
                      value={formData.expectedDelivery}
                      onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Payment Terms</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        aria-label="Payment Terms"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      >
                        <option value="Net 30 Days">Net 30 Days</option>
                        <option value="Net 60 Days">Net 60 Days</option>
                        <option value="Immediate upon Delivery">Immediate upon Delivery</option>
                        <option value="50% Advance, 50% Site Receipt">50% Advance, 50% Site Receipt</option>
                        <option value="100% Advance Payment">100% Advance Payment</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Delivery Site Address</Text>
                    <Input
                      size="sm"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                {/* Line Items Section */}
                <Box mt={2} p={4} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="xs" color="#0f172a">Purchase Order Line Items ({poItems.length})</Heading>
                    <Button size="xs" colorPalette="blue" variant="subtle" onClick={handleAddItemRow}>
                      <Plus size={12} /> Add Item Row
                    </Button>
                  </Flex>

                  <Stack gap={3}>
                    {poItems.map((item, idx) => (
                      <Box key={idx} p={3} bg="white" borderRadius="8px" border="1px solid #e2e8f0">
                        <SimpleGrid columns={{ base: 1, md: 12 }} gap={2} alignItems="center">
                          <Box gridColumn={{ base: 'span 1', md: 'span 4' }}>
                            <Text fontSize="10px" color="#64748b" mb={1}>Link Catalog Material</Text>
                            <NativeSelect.Root size="xs">
                              <NativeSelect.Field
                                aria-label="Select Catalog Item"
                                value={item.inventoryItemId || ''}
                                onChange={(e) => handleSelectInventoryItem(idx, e.target.value)}
                              >
                                <option value="">-- Custom Non-Stock Item --</option>
                                {inventory.map(inv => (
                                  <option key={inv.id} value={inv.id}>
                                    [{inv.itemCode}] {inv.name}
                                  </option>
                                ))}
                              </NativeSelect.Field>
                            </NativeSelect.Root>
                          </Box>

                          <Box gridColumn={{ base: 'span 1', md: 'span 4' }}>
                            <Text fontSize="10px" color="#64748b" mb={1}>Item Description / Grade</Text>
                            <Input
                              size="xs"
                              required
                              placeholder="Specification / description"
                              value={item.description}
                              onChange={(e) => handleUpdateItemField(idx, 'description', e.target.value)}
                            />
                          </Box>

                          <Box gridColumn={{ base: 'span 1', md: 'span 1' }}>
                            <Text fontSize="10px" color="#64748b" mb={1}>Qty</Text>
                            <Input
                              size="xs"
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemField(idx, 'quantity', Number(e.target.value))}
                            />
                          </Box>

                          <Box gridColumn={{ base: 'span 1', md: 'span 1' }}>
                            <Text fontSize="10px" color="#64748b" mb={1}>Unit</Text>
                            <Input
                              size="xs"
                              value={item.unit}
                              onChange={(e) => handleUpdateItemField(idx, 'unit', e.target.value)}
                            />
                          </Box>

                          <Box gridColumn={{ base: 'span 1', md: 'span 1' }}>
                            <Text fontSize="10px" color="#64748b" mb={1}>Rate ($)</Text>
                            <Input
                              size="xs"
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItemField(idx, 'unitPrice', Number(e.target.value))}
                            />
                          </Box>

                          <Box gridColumn={{ base: 'span 1', md: 'span 1' }} textAlign="center">
                            <Text fontSize="10px" color="#64748b" mb={1}>Action</Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorPalette="red"
                              disabled={poItems.length <= 1}
                              onClick={() => handleRemoveItemRow(idx)}
                            >
                              <Trash2 size={12} />
                            </Button>
                          </Box>
                        </SimpleGrid>
                      </Box>
                    ))}
                  </Stack>

                  {/* Summary Box */}
                  <Flex justify="flex-end" mt={4}>
                    <Box w="260px" bg="white" p={3} borderRadius="8px" border="1px solid #cbd5e1" fontSize="xs">
                      <Flex justify="space-between" mb={1}>
                        <Text color="#64748b">Subtotal:</Text>
                        <Text fontWeight="semibold">{activeCompany.currency} {calcSubtotal.toLocaleString()}</Text>
                      </Flex>
                      <Flex justify="space-between" mb={1}>
                        <Text color="#64748b">Taxes (5%):</Text>
                        <Text fontWeight="semibold">+ {activeCompany.currency} {calcTax.toLocaleString()}</Text>
                      </Flex>
                      <Flex justify="space-between" pt={2} borderTop="1px solid #e2e8f0" fontWeight="bold" color="#0f172a">
                        <Text>Grand Total:</Text>
                        <Text>{activeCompany.currency} {calcTotal.toLocaleString()}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Notes & Terms</Text>
                  <Textarea
                    rows={2}
                    size="sm"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="semibold">
                    Submit Purchase Order for Approval
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Approve PO */}
      {showApproveModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1100"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="14px" p={5} maxW="460px" w="100%" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={2}>Approve Purchase Order</Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Authorize PO <strong>{showApproveModal.poNumber}</strong> for <strong>{showApproveModal.supplierName}</strong> ({activeCompany.currency} {showApproveModal.totalAmount.toLocaleString()}).
            </Text>
            <Box mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Executive Remarks / Notes</Text>
              <Input
                size="sm"
                placeholder="e.g. Approved within Q4 structural materials budget allocation."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </Box>
            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setShowApproveModal(null)}>Cancel</Button>
              <Button size="sm" colorPalette="green" onClick={handleApprovePO}>
                <CheckCircle2 size={15} /> Confirm Approval
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Modal: Reject PO */}
      {showRejectModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1100"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="14px" p={5} maxW="460px" w="100%" boxShadow="2xl">
            <Heading size="md" color="#b91c1c" mb={2}>Reject Purchase Order</Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Please provide the justification for rejecting PO <strong>{showRejectModal.poNumber}</strong>.
            </Text>
            <Box mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reason for Rejection *</Text>
              <Textarea
                rows={3}
                size="sm"
                placeholder="e.g. Quoted steel price exceeds approved project BOQ ceiling rates."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Box>
            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setShowRejectModal(null)}>Cancel</Button>
              <Button size="sm" colorPalette="red" disabled={!rejectionReason.trim()} onClick={handleRejectPO}>
                <XCircle size={15} /> Confirm Rejection
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
