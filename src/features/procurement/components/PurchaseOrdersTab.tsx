import React, { useState, useEffect } from 'react';
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
import { PurchaseOrderVoucherModal } from './PurchaseOrderVoucherModal';
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
  ArrowRight,
  MessageSquare,
  Send,
  User,
  ClipboardList,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface PurchaseOrdersTabProps {
  onOpenCreateGRNForPO?: (po: PurchaseOrder) => void;
  prefillRequisitionId?: number;
}

export const PurchaseOrdersTab: React.FC<PurchaseOrdersTabProps> = ({ 
  onOpenCreateGRNForPO,
  prefillRequisitionId
}) => {
  const {
    purchaseOrders,
    createPurchaseOrder,
    updatePOStatus,
    addPOMessage,
    suppliers,
    projects,
    warehouses,
    inventory,
    requisitions,
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
  const [voucherPO, setVoucherPO] = useState<PurchaseOrder | null>(null);
  const [showApproveModal, setShowApproveModal] = useState<PurchaseOrder | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<PurchaseOrder | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<number | ''>('');
  const [poDetailTab, setPoDetailTab] = useState<'details' | 'history' | 'discussion'>('details');
  const [poChatMessage, setPoChatMessage] = useState('');

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
    if (!po) return false;
    const matchesStatus = activeStatusTab === 'all' || po.status === activeStatusTab;
    const matchesSupplier = supplierFilter === 'All' || String(po.supplierId) === supplierFilter;
    const matchesProject = projectFilter === 'All' || String(po.projectId) === projectFilter;
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      (po.poNumber || '').toLowerCase().includes(q) ||
      (po.supplierName || '').toLowerCase().includes(q) ||
      (po.projectName && po.projectName.toLowerCase().includes(q)) ||
      (po.items && po.items.some(i => (i.description || '').toLowerCase().includes(q)));

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

  const handleSourceRequisition = (reqIdStr: string) => {
    const reqId = Number(reqIdStr);
    if (!reqId) {
      setSelectedRequisitionId('');
      return;
    }
    setSelectedRequisitionId(reqId);
    const req = requisitions.find(r => r.id === reqId);
    if (req) {
      const proj = projects.find(p => p.id === req.projectId);
      setFormData(prev => ({
        ...prev,
        projectId: req.projectId,
        projectName: req.projectName,
        deliveryAddress: proj ? `${proj.name} Compound, ${proj.siteLocation || 'Main Construction Gate'}` : prev.deliveryAddress,
        notes: `Procurement generated directly for Site Requisition ${req.requisitionNo} (${req.title}). Requested by: ${req.requestedBy}.`
      }));

      if (req.items && req.items.length > 0) {
        const mappedItems = req.items.map((ri: any) => {
          const matchingInv = inventory.find(i => 
            (ri.inventoryItemId && i.id === ri.inventoryItemId) || 
            (i.name && ri.itemName && i.name.toLowerCase() === ri.itemName.toLowerCase())
          );
          return {
            inventoryItemId: matchingInv?.id || ri.inventoryItemId || inventory[0]?.id || 1,
            itemCode: matchingInv?.itemCode || ri.itemCode || 'MAT-REQ',
            description: ri.itemName || ri.description || 'Requested Material',
            quantity: ri.quantityRequired || ri.quantity || 1,
            unit: ri.unit || matchingInv?.unit || 'Units',
            unitPrice: ri.price || ri.estimatedRate || matchingInv?.costPrice || 50,
            discountPercent: 0,
            taxPercent: 5
          };
        });
        setPoItems(mappedItems);
      }
    }
  };

  useEffect(() => {
    if (prefillRequisitionId) {
      handleSourceRequisition(String(prefillRequisitionId));
      setShowCreateModal(true);
    }
  }, [prefillRequisitionId]);

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

    const linkedReq = selectedRequisitionId ? requisitions.find(r => r.id === selectedRequisitionId) : undefined;

    createPurchaseOrder({
      ...formData,
      requisitionId: linkedReq ? linkedReq.id : undefined,
      requisitionNo: linkedReq ? linkedReq.requisitionNo : undefined,
      subtotal: calcSubtotal,
      discountTotal: calcDiscount,
      taxTotal: calcTax,
      totalAmount: calcTotal,
      items: formattedItems
    });

    setShowCreateModal(false);
    setSelectedRequisitionId('');
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
        <Box overflowX="auto" w="100%">
          <Table.Root size="sm" variant="outline" minW="850px">
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
                      <Flex align="center" gap={1.5} wrap="wrap" mt={0.5}>
                        {po.warehouseName && (
                          <Text fontSize="10px" color="#64748b">{po.warehouseName}</Text>
                        )}
                        {po.requisitionNo && (
                          <Badge size="xs" colorPalette="purple" variant="subtle">
                            <ClipboardList size={10} style={{ marginRight: 2 }} /> Req: {po.requisitionNo}
                          </Badge>
                        )}
                      </Flex>
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
                          title="View PO Details & Workflow"
                          onClick={() => {
                            setSelectedPO(po);
                            setPoDetailTab('details');
                          }}
                        >
                          <Eye size={14} /> Review
                        </Button>

                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="gray"
                          title="Print Official PO Voucher"
                          onClick={() => setVoucherPO(po)}
                        >
                          <Printer size={13} /> Voucher
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
        </Box>
      </Card.Root>

      {/* Modal: View & Review Purchase Order */}
      {selectedPO && (() => {
        const activePO = purchaseOrders.find(p => p.id === selectedPO.id) || selectedPO;
        const isApproved = activePO.status === 'approved' || activePO.status === 'partially_received';
        const isPending = activePO.status === 'pending_approval';

        const handleSendChat = (e: React.FormEvent) => {
          e.preventDefault();
          if (!poChatMessage.trim()) return;
          addPOMessage(activePO.id, poChatMessage.trim());
          setPoChatMessage('');
        };

        return (
          <Box
            position="fixed"
            inset="0"
            zIndex="1100"
            bg="rgba(15, 23, 42, 0.65)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={{ base: 2, sm: 4 }}
            backdropFilter="blur(2px)"
          >
            <Box bg="white" borderRadius="16px" p={{ base: 4, sm: 6 }} maxW="880px" w="100%" boxShadow="2xl" maxH="92vh" overflowY="auto">
              {/* Action Bar */}
              <Flex justify="space-between" align="center" pb={4} mb={4} borderBottom="1px solid #e2e8f0" wrap="wrap" gap={3}>
                <Flex align="center" gap={2} wrap="wrap">
                  <Badge size="md" colorPalette="blue" fontFamily="mono" fontSize="sm">
                    {activePO.poNumber}
                  </Badge>
                  <Badge
                    size="sm"
                    colorPalette={
                      activePO.status === 'received' ? 'green' :
                      activePO.status === 'approved' ? 'teal' :
                      activePO.status === 'partially_received' ? 'blue' :
                      activePO.status === 'rejected' ? 'red' : 'orange'
                    }
                  >
                    {activePO.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {activePO.requisitionNo && (
                    <Badge size="sm" colorPalette="purple" variant="subtle">
                      <ClipboardList size={12} style={{ marginRight: 3 }} /> Req: {activePO.requisitionNo}
                    </Badge>
                  )}
                </Flex>

                <Flex gap={2} wrap="wrap">
                  <Button size="xs" colorPalette="blue" variant="outline" onClick={() => setVoucherPO(activePO)}>
                    <Printer size={13} /> Official Voucher
                  </Button>

                  {isPending && canApprove && (
                    <>
                      <Button size="xs" colorPalette="green" onClick={() => setShowApproveModal(activePO)}>
                        <CheckCircle2 size={13} /> Approve
                      </Button>
                      <Button size="xs" variant="outline" colorPalette="red" onClick={() => setShowRejectModal(activePO)}>
                        <XCircle size={13} /> Reject
                      </Button>
                    </>
                  )}

                  {isApproved && canReceive && onOpenCreateGRNForPO && (
                    <Button
                      size="xs"
                      colorPalette="purple"
                      onClick={() => {
                        onOpenCreateGRNForPO(activePO);
                        setSelectedPO(null);
                      }}
                    >
                      <PackageCheck size={13} /> Receive GRN
                    </Button>
                  )}

                  <Button size="xs" variant="ghost" onClick={() => setSelectedPO(null)}>
                    Close
                  </Button>
                </Flex>
              </Flex>

              {/* Header Title & Sub-tabs */}
              <Flex justify="space-between" align="flex-start" wrap="wrap" gap={2} mb={4}>
                <Box>
                  <Heading size="md" color="#0f172a">{activePO.supplierName}</Heading>
                  <Text fontSize="xs" color="#64748b" mt={0.5}>
                    Target Project: <Text as="span" fontWeight="bold" color="#2563eb">{activePO.projectName || 'Central Warehouse'}</Text> • Delivery: {activePO.expectedDelivery}
                  </Text>
                </Box>
                <Text fontSize="lg" fontWeight="black" color="#0f172a">
                  {activeCompany.currency} {activePO.totalAmount.toLocaleString()}
                </Text>
              </Flex>

              {/* Navigation Tabs */}
              <Flex gap={2} borderBottom="1px solid #e2e8f0" pb={3} mb={5} wrap="wrap">
                <Button
                  size="xs"
                  variant={poDetailTab === 'details' ? 'solid' : 'ghost'}
                  colorPalette={poDetailTab === 'details' ? 'blue' : 'gray'}
                  onClick={() => setPoDetailTab('details')}
                >
                  <FileText size={13} /> Order Items & Terms
                </Button>
                <Button
                  size="xs"
                  variant={poDetailTab === 'history' ? 'solid' : 'ghost'}
                  colorPalette={poDetailTab === 'history' ? 'blue' : 'gray'}
                  onClick={() => setPoDetailTab('history')}
                >
                  <Clock size={13} /> Approval Trail ({activePO.approvalHistory?.length || 0})
                </Button>
                <Button
                  size="xs"
                  variant={poDetailTab === 'discussion' ? 'solid' : 'ghost'}
                  colorPalette={poDetailTab === 'discussion' ? 'blue' : 'gray'}
                  onClick={() => setPoDetailTab('discussion')}
                >
                  <MessageSquare size={13} /> Coordination Discussion ({activePO.messages?.length || 0})
                </Button>
              </Flex>

              {/* Tab 1: Details */}
              {poDetailTab === 'details' && (
                <Stack gap={4}>
                  {activePO.requisitionNo && (
                    <Box p={3} bg="#f5f3ff" borderRadius="8px" border="1px solid #ddd6fe" fontSize="xs">
                      <Flex align="center" gap={2}>
                        <ClipboardList size={16} color="#7c3aed" />
                        <Text fontWeight="bold" color="#6d28d9">
                          Originating Site Requisition: {activePO.requisitionNo}
                        </Text>
                      </Flex>
                      <Text color="#5b21b6" mt={1}>
                        This purchase order is linked to job site material requirements. Once items arrive and GRN is issued, the requisition will be flagged ready for store dispatch.
                      </Text>
                    </Box>
                  )}

                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} p={3.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0" fontSize="xs">
                    <Box>
                      <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">VENDOR DETAILS</Text>
                      <Text fontWeight="bold" color="#0f172a" mt={1}>{activePO.supplierName}</Text>
                      <Text color="#475569">{activePO.supplierAddress || 'Official Supplier Address On File'}</Text>
                      <Text color="#475569">Phone: {activePO.supplierPhone || 'N/A'}</Text>
                      <Text color="#475569">Payment Terms: <Text as="span" fontWeight="semibold">{activePO.paymentTerms}</Text></Text>
                    </Box>
                    <Box>
                      <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">DELIVERY DESTINATION</Text>
                      <Text fontWeight="bold" color="#0f172a" mt={1}>{activePO.projectName || 'Central Logistics Warehouse'}</Text>
                      <Text color="#475569">{activePO.deliveryAddress || 'Central Stores Compound Gate 1'}</Text>
                      <Text color="#475569">Receiving Warehouse: {activePO.warehouseName || 'Yard Main Store'}</Text>
                    </Box>
                  </SimpleGrid>

                  <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline" minW="650px">
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
                        {activePO.items.map((item, idx) => (
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
                  </Box>

                  <Flex justify="flex-end">
                    <Box w={{ base: '100%', sm: '280px' }} fontSize="xs">
                      <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                        <Text color="#64748b">Subtotal:</Text>
                        <Text fontWeight="semibold">{activeCompany.currency} {(activePO.subtotal || activePO.totalAmount).toLocaleString()}</Text>
                      </Flex>
                      {activePO.discountTotal !== undefined && activePO.discountTotal > 0 && (
                        <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9" color="#16a34a">
                          <Text>Discount Total:</Text>
                          <Text>- {activeCompany.currency} {activePO.discountTotal.toLocaleString()}</Text>
                        </Flex>
                      )}
                      {activePO.taxTotal !== undefined && activePO.taxTotal > 0 && (
                        <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                          <Text color="#64748b">Tax / VAT:</Text>
                          <Text fontWeight="semibold">+ {activeCompany.currency} {activePO.taxTotal.toLocaleString()}</Text>
                        </Flex>
                      )}
                      <Flex justify="space-between" py={2} borderTop="2px solid #0f172a" fontSize="sm" fontWeight="bold" color="#0f172a">
                        <Text>Grand Total:</Text>
                        <Text>{activeCompany.currency} {activePO.totalAmount.toLocaleString()}</Text>
                      </Flex>
                    </Box>
                  </Flex>

                  {activePO.notes && (
                    <Box p={3} bg="#f8fafc" borderRadius="6px" fontSize="11px" color="#475569">
                      <Text fontWeight="bold" color="#334155" mb={1}>Notes & Special Instructions:</Text>
                      <Text>{activePO.notes}</Text>
                    </Box>
                  )}
                </Stack>
              )}

              {/* Tab 2: Approval Trail */}
              {poDetailTab === 'history' && (
                <Stack gap={3}>
                  <Text fontSize="xs" color="#64748b">
                    Multi-level workflow audit trail showing when this purchase order was raised, reviewed, and approved.
                  </Text>
                  {(!activePO.approvalHistory || activePO.approvalHistory.length === 0) ? (
                    <Box p={6} textAlign="center" bg="#f8fafc" borderRadius="8px" color="#94a3b8" fontSize="xs">
                      No workflow history events logged yet.
                    </Box>
                  ) : (
                    activePO.approvalHistory.map((step, idx) => (
                      <Card.Root key={idx} p={3.5} borderRadius="10px" border="1px solid #e2e8f0" bg="#fbfcfd">
                        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={2}>
                          <Flex align="center" gap={2}>
                            <Box p={1.5} bg={step.action.includes('Approved') ? '#dcfce7' : step.action.includes('Rejected') ? '#fee2e2' : '#eff6ff'} borderRadius="8px">
                              <ShieldCheck size={16} color={step.action.includes('Approved') ? '#16a34a' : step.action.includes('Rejected') ? '#dc2626' : '#2563eb'} />
                            </Box>
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="#0f172a">{step.action}</Text>
                              <Text fontSize="11px" color="#64748b">
                                By <Text as="span" fontWeight="semibold" color="#334155">{step.actorName}</Text> ({step.actorRole})
                              </Text>
                            </Box>
                          </Flex>
                          <Badge size="xs" colorPalette="gray">{step.timestamp || (step as any).date}</Badge>
                        </Flex>
                        {(step.comments || (step as any).notes) && (
                          <Box mt={2} p={2} bg="white" borderRadius="6px" border="1px solid #f1f5f9" fontSize="11px" color="#475569">
                            {step.comments || (step as any).notes}
                          </Box>
                        )}
                      </Card.Root>
                    ))
                  )}
                </Stack>
              )}

              {/* Tab 3: Coordination Discussion */}
              {poDetailTab === 'discussion' && (
                <Stack gap={4}>
                  <Text fontSize="xs" color="#64748b">
                    Internal supply chain collaboration thread between Procurement, Site Engineers, Storekeepers, and Finance.
                  </Text>

                  <Box maxH="280px" overflowY="auto" p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                    {(!activePO.messages || activePO.messages.length === 0) ? (
                      <Box p={6} textAlign="center" color="#94a3b8" fontSize="xs">
                        No messages yet. Start a coordination thread below.
                      </Box>
                    ) : (
                      <Stack gap={2.5}>
                        {activePO.messages.map((msg, idx) => (
                          <Box key={idx} p={2.5} bg="white" borderRadius="8px" border="1px solid #e2e8f0" fontSize="xs">
                            <Flex justify="space-between" align="center" mb={1}>
                              <Flex align="center" gap={1.5}>
                                <User size={13} color="#2563eb" />
                                <Text fontWeight="bold" color="#0f172a">{msg.userName}</Text>
                                <Badge size="xs" colorPalette="blue" variant="subtle">{msg.role}</Badge>
                              </Flex>
                              <Text fontSize="10px" color="#94a3b8">{msg.createdAt || (msg as any).timestamp}</Text>
                            </Flex>
                            <Text color="#334155">{msg.message}</Text>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>

                  <form onSubmit={handleSendChat}>
                    <Flex gap={2}>
                      <Input
                        size="sm"
                        placeholder="Add coordination note, delivery update, or QC question..."
                        value={poChatMessage}
                        onChange={(e) => setPoChatMessage(e.target.value)}
                      />
                      <Button size="sm" colorPalette="blue" type="submit" disabled={!poChatMessage.trim()}>
                        <Send size={14} /> Send
                      </Button>
                    </Flex>
                  </form>
                </Stack>
              )}
            </Box>
          </Box>
        );
      })()}

      {/* Official Voucher Printable Modal */}
      {voucherPO && (
        <PurchaseOrderVoucherModal
          po={voucherPO}
          onClose={() => setVoucherPO(null)}
        />
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
          p={{ base: 2, sm: 4 }}
          backdropFilter="blur(2px)"
        >
          <Box bg="white" borderRadius="16px" p={{ base: 3, sm: 6 }} maxW="840px" w="100%" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="#0f172a">Create Supplier Purchase Order</Heading>
              <Button size="xs" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </Flex>

            <form onSubmit={handleSubmitPO}>
              <Stack gap={4} fontSize="xs">
                {/* Source from Requisition (Module Cross-Communication) */}
                <Box p={3.5} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe">
                  <Flex align="center" justify="space-between" mb={1.5} wrap="wrap" gap={2}>
                    <Flex align="center" gap={1.5}>
                      <ClipboardList size={16} color="#2563eb" />
                      <Text fontWeight="bold" color="#1e40af" fontSize="xs">
                        Source from Approved Site Requisition (Optional)
                      </Text>
                    </Flex>
                    {selectedRequisitionId && (
                      <Badge size="xs" colorPalette="blue">Linked Requisition Active</Badge>
                    )}
                  </Flex>
                  <Text fontSize="11px" color="#3b82f6" mb={2}>
                    Selecting an approved site requisition automatically fills project details, delivery destination, and required line items.
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      aria-label="Source Requisition"
                      value={selectedRequisitionId}
                      onChange={(e) => handleSourceRequisition(e.target.value)}
                      bg="white"
                    >
                      <option value="">-- Standalone Procurement (Manual Entry) --</option>
                      {requisitions
                        .filter(r => r.status === 'Approved' || r.status === 'Ready for Dispatch' || r.status === 'Pending Review')
                        .map(r => (
                          <option key={r.id} value={r.id}>
                            [{r.requisitionNo}] {r.title} — {r.projectName} ({r.items?.length || 0} items, {r.status})
                          </option>
                        ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="14px" p={{ base: 4, sm: 5 }} maxW="460px" w="100%" boxShadow="2xl">
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="14px" p={{ base: 4, sm: 5 }} maxW="460px" w="100%" boxShadow="2xl">
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
