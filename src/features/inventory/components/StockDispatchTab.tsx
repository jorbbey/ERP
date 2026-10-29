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
  NativeSelect,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { InventoryItem, Waybill } from '../../../types';
import { StoreReceiptModal, StoreReceiptData } from './StoreReceiptModal';
import {
  Truck,
  Plus,
  Package,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Search,
  FileText,
  Printer,
  RotateCcw,
  Boxes,
  MapPin,
  Check,
  User,
  Phone
} from 'lucide-react';

export const StockDispatchTab: React.FC = () => {
  const {
    inventory,
    allocateStock,
    deallocateStock,
    dispatchAllocatedStock,
    waybills,
    markWaybillDelivered,
    projects,
    warehouses,
    requisitions,
    activeCompany,
    currentUserName
  } = useERP();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');

  // Allocation Modal State
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateForm, setAllocateForm] = useState({
    itemId: inventory[0]?.id || 1,
    quantity: 10,
    projectId: projects[0]?.id || 1,
    notes: 'Allocated for site delivery mobilization'
  });
  const [allocateFeedback, setAllocateFeedback] = useState<string | null>(null);

  // Dispatch Modal State
  const [dispatchItem, setDispatchItem] = useState<InventoryItem | null>(null);
  const [dispatchForm, setDispatchForm] = useState({
    quantity: 1,
    projectId: projects[0]?.id || 1,
    projectName: projects[0]?.name || 'Site Project',
    carrierName: 'Internal Fleet Logistics',
    vehicleNumber: 'TRK-2026-DX',
    driverPhone: '+234 802 555 0192',
    recipientName: 'Site Receiving Officer',
    requisitionNo: '',
    notes: 'Approved stock dispatch from central stores',
    gatePassNo: `GP-${Math.floor(100000 + Math.random() * 900000)}`
  });
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  // Deallocate Modal / Confirmation
  const [deallocateItem, setDeallocateItem] = useState<InventoryItem | null>(null);
  const [deallocateQty, setDeallocateQty] = useState(1);

  // Receipt Modal State for generated gate pass / waybill
  const [receiptData, setReceiptData] = useState<StoreReceiptData | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Filtered allocated materials
  const allocatedItems = inventory.filter(item => (Number(item.allocatedStock) || 0) > 0);
  const filteredAllocated = allocatedItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWh = selectedWarehouse === 'All' || item.warehouseLocation === selectedWarehouse;
    return matchesSearch && matchesWh;
  });

  // Metrics
  const totalAllocatedItemsCount = allocatedItems.length;
  const totalAllocatedUnits = inventory.reduce((sum, i) => sum + (Number(i.allocatedStock) || 0), 0);
  const totalFreeUnits = inventory.reduce((sum, i) => sum + (Number(i.freeStock) || 0), 0);
  const totalWaybillsCount = waybills.length;

  const handleOpenDispatch = (item: InventoryItem) => {
    const defaultQty = Number(item.allocatedStock) || 1;
    const defaultProj = projects[0];
    setDispatchItem(item);
    setDispatchFeedback(null);
    setDispatchForm({
      quantity: defaultQty,
      projectId: defaultProj?.id || 1,
      projectName: defaultProj?.name || 'Project Site',
      carrierName: 'Heavy Haul Logistics Ltd',
      vehicleNumber: `KTU-${Math.floor(100 + Math.random() * 899)}-XY`,
      driverPhone: '+234 803 712 8900',
      recipientName: 'Engr. Site Manager',
      requisitionNo: requisitions[0]?.requisitionNo || '',
      notes: `Dispatch of ${defaultQty} ${item.unit} ${item.name} from ${item.warehouseLocation}`,
      gatePassNo: `GP-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchItem) return;

    const qty = Number(dispatchForm.quantity);
    const allocated = Number(dispatchItem.allocatedStock) || 0;

    if (qty <= 0) {
      setDispatchFeedback('Dispatch quantity must be greater than zero.');
      return;
    }
    if (qty > allocated) {
      setDispatchFeedback(`Cannot dispatch more than allocated stock (${allocated} ${dispatchItem.unit}).`);
      return;
    }

    const proj = projects.find(p => p.id === Number(dispatchForm.projectId));

    const result = dispatchAllocatedStock({
      itemId: dispatchItem.id,
      quantity: qty,
      projectId: Number(dispatchForm.projectId),
      projectName: proj?.name || dispatchForm.projectName,
      carrierName: dispatchForm.carrierName.trim(),
      vehicleNumber: dispatchForm.vehicleNumber.trim(),
      driverPhone: dispatchForm.driverPhone.trim(),
      recipientName: dispatchForm.recipientName.trim(),
      requisitionNo: dispatchForm.requisitionNo.trim() || undefined,
      notes: dispatchForm.notes.trim(),
      gatePassNo: dispatchForm.gatePassNo.trim()
    });

    if (result.success && result.waybill) {
      const receipt: StoreReceiptData = {
        type: 'delivery_order_receipt',
        receiptNo: result.waybill.waybillNo || result.waybill.waybillNumber,
        date: result.waybill.dispatchDate,
        itemName: dispatchItem.name,
        itemCode: dispatchItem.itemCode,
        quantity: qty,
        unit: dispatchItem.unit,
        unitCost: dispatchItem.costPrice,
        totalValue: (dispatchItem.costPrice || 0) * qty,
        warehouseName: dispatchItem.warehouseLocation,
        requisitionNo: dispatchForm.requisitionNo,
        projectName: proj?.name || dispatchForm.projectName,
        recipientName: dispatchForm.recipientName,
        purpose: dispatchForm.notes,
        gatePassNo: dispatchForm.gatePassNo,
        dispatchedBy: currentUserName,
        notes: `Carrier: ${dispatchForm.carrierName} | Truck: ${dispatchForm.vehicleNumber} | Driver Contact: ${dispatchForm.driverPhone}`
      };

      setReceiptData(receipt);
      setDispatchItem(null);
      setShowReceiptModal(true);
    } else {
      setDispatchFeedback(result.error || 'Failed to dispatch allocated stock.');
    }
  };

  const handleExecuteAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = inventory.find(i => i.id === Number(allocateForm.itemId));
    if (!targetItem) return;

    const qty = Number(allocateForm.quantity);
    const free = Number(targetItem.freeStock) || 0;

    if (qty <= 0) {
      setAllocateFeedback('Allocation quantity must be greater than zero.');
      return;
    }
    if (qty > free) {
      setAllocateFeedback(`Requested quantity (${qty}) exceeds available free stock (${free} ${targetItem.unit}).`);
      return;
    }

    const proj = projects.find(p => p.id === Number(allocateForm.projectId));
    const note = `Allocated ${qty} ${targetItem.unit} for ${proj?.name || 'Site mobilization'}: ${allocateForm.notes}`;

    const res = allocateStock(targetItem.id, qty, note);
    if (res.success) {
      setShowAllocateModal(false);
      setAllocateFeedback(null);
    } else {
      setAllocateFeedback(res.error || 'Failed to allocate stock.');
    }
  };

  const handleConfirmDeallocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deallocateItem) return;

    const qty = Number(deallocateQty);
    const res = deallocateStock(deallocateItem.id, qty);
    if (res.success) {
      setDeallocateItem(null);
    }
  };

  return (
    <Stack gap={6}>
      {/* Metric Cards Header */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Allocated Material SKUs</Text>
              <Heading size="xl" color="#d97706" mt={1}>
                {totalAllocatedItemsCount} Items
              </Heading>
              <Text fontSize="11px" color="#d97706" mt={0.5}>Reserved & Awaiting Dispatch</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <Boxes size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Allocated Units</Text>
              <Heading size="xl" color="#2563eb" mt={1}>
                {totalAllocatedUnits.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#2563eb" mt={0.5}>Staged in stores for loading</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <Truck size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Free Available Stock</Text>
              <Heading size="xl" color="#059669" mt={1}>
                {totalFreeUnits.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#059669" mt={0.5}>Uncommitted for new allocations</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <CheckCircle2 size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Active Waybills / Dispatches</Text>
              <Heading size="xl" color="#7c3aed" mt={1}>
                {totalWaybillsCount}
              </Heading>
              <Text fontSize="11px" color="#7c3aed" mt={0.5}>Truck deliveries logged</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#f5f3ff" color="#7c3aed">
              <FileText size={22} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Main Dispatch Queue Section */}
      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Box p={4} borderBottom="1px solid #e2e8f0">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
            <Box>
              <Flex align="center" gap={2}>
                <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                  <Truck size={20} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">
                    Allocated Stock Dispatch Queue
                  </Heading>
                  <Text fontSize="xs" color="#64748b">
                    Materials committed and allocated for specific project sites. Execute physical dispatch, assign haulage truck, and generate official Waybills & Gate Passes.
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Flex gap={2} align="center" flexWrap="wrap">
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => {
                  setAllocateFeedback(null);
                  setShowAllocateModal(true);
                }}
                fontWeight="semibold"
              >
                <Plus size={15} /> Allocate Stock from Catalogue
              </Button>
            </Flex>
          </Flex>

          {/* Search and Filters toolbar */}
          <Flex direction={{ base: 'column', sm: 'row' }} gap={3} mt={4} align="center">
            <Box flex="1" maxW={{ sm: '380px' }} w="100%">
              <Flex align="center" bg="#f8fafc" px={3} py={1.5} borderRadius="8px" border="1px solid #cbd5e1">
                <Search size={15} color="#94a3b8" style={{ marginRight: '8px' }} />
                <input
                  placeholder="Filter by SKU code, item name, or location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%', fontSize: '12px', background: 'transparent', border: 'none', outline: 'none' }}
                />
              </Flex>
            </Box>

            <NativeSelect.Root size="sm" maxW={{ sm: '220px' }}>
              <NativeSelect.Field
                value={selectedWarehouse}
                onChange={e => setSelectedWarehouse(e.target.value)}
              >
                <option value="All">All Storage Locations</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Flex>
        </Box>

        {/* Allocated Items Table */}
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline" minW="880px">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader fontSize="10px">SKU Code</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material Description</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Storage Location</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Allocated Stock (Committed)</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Free Stock (Available)</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Total On-Hand</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Status</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Dispatch Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredAllocated.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py={10} color="#64748b">
                    <Flex direction="column" align="center" gap={2}>
                      <Boxes size={32} color="#94a3b8" />
                      <Text fontWeight="semibold" fontSize="sm" color="#334155">
                        No materials currently allocated in the dispatch queue.
                      </Text>
                      <Text fontSize="xs" color="#94a3b8" maxW="420px">
                        Allocate stock from your free inventory to stage materials for site loading, or click "Allocate Stock from Catalogue" above.
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredAllocated.map(item => {
                  const allocated = Number(item.allocatedStock) || 0;
                  const free = Number(item.freeStock) || 0;
                  const current = Number(item.currentStock) || 0;

                  return (
                    <Table.Row key={item.id} _hover={{ bg: '#f8fafc' }}>
                      <Table.Cell fontSize="xs">
                        <Badge size="xs" colorPalette="blue" fontFamily="mono">{item.itemCode}</Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="bold" color="#0f172a">{item.name}</Text>
                        <Text fontSize="10px" color="#64748b">{item.categoryName}</Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#475569">
                        <Flex align="center" gap={1}>
                          <MapPin size={12} color="#94a3b8" />
                          <Text>{item.warehouseLocation}</Text>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Badge size="sm" colorPalette="orange" fontWeight="bold">
                          {allocated.toLocaleString()} {item.unit}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#059669" fontWeight="bold">
                        {free.toLocaleString()} {item.unit}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">
                        {current.toLocaleString()} {item.unit}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Badge size="xs" colorPalette="purple">
                          READY FOR DISPATCH
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={1.5}>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="red"
                            onClick={() => {
                              setDeallocateItem(item);
                              setDeallocateQty(allocated);
                            }}
                            title="Deallocate and release stock back to Free Stock"
                          >
                            <RotateCcw size={12} /> Release
                          </Button>
                          <Button
                            size="xs"
                            colorPalette="blue"
                            fontWeight="bold"
                            onClick={() => handleOpenDispatch(item)}
                          >
                            <Truck size={13} /> Dispatch Truck
                          </Button>
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

      {/* Dispatched Deliveries & Waybills Ledger */}
      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Box p={4} borderBottom="1px solid #e2e8f0">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="md" color="#0f172a">
                Waybills & Site Delivery Manifests ({waybills.length})
              </Heading>
              <Text fontSize="xs" color="#64748b">
                Permanent audit ledger of all dispatches executed from allocated inventory.
              </Text>
            </Box>
            <Badge size="sm" colorPalette="blue">{waybills.length} Dispatched Records</Badge>
          </Flex>
        </Box>

        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline" minW="850px">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader fontSize="10px">Waybill / Gate Pass #</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Date & Time</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material & Quantity</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Destination Project</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Carrier & Truck Plate</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Recipient Officer</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Delivery Status</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Print Voucher</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {waybills.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py={8} color="#94a3b8" fontSize="xs">
                    No waybills or truck dispatches recorded yet.
                  </Table.Cell>
                </Table.Row>
              ) : (
                waybills.map(wb => (
                  <Table.Row key={wb.id} _hover={{ bg: '#f8fafc' }}>
                    <Table.Cell fontSize="xs">
                      <Badge size="xs" colorPalette="blue" fontFamily="mono">
                        {wb.waybillNo || wb.waybillNumber}
                      </Badge>
                      {wb.gatePassNo && (
                        <Text fontSize="10px" color="#64748b">{wb.gatePassNo}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {wb.dispatchDate}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="bold" color="#0f172a">{wb.itemName || wb.items[0]?.itemName || 'Materials'}</Text>
                      <Badge size="xs" colorPalette="green" fontWeight="bold">
                        {(wb.quantity ?? wb.items[0]?.quantityDispatched ?? 0).toLocaleString()} {wb.unit || wb.items[0]?.unit || 'Units'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="semibold" color="#2563eb">
                      {wb.destinationProject || wb.projectName}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="medium" color="#0f172a">{wb.carrierName}</Text>
                      <Text fontSize="10px" color="#64748b" fontFamily="mono">{wb.vehicleNumber}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#475569">
                      {wb.recipientName || wb.receivedBy || 'Site Officer'}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Badge
                        size="xs"
                        colorPalette={wb.status === 'Delivered' ? 'green' : 'blue'}
                      >
                        {wb.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={1}>
                        {wb.status === 'In Transit' && (
                          <Button
                            size="xs"
                            variant="subtle"
                            colorPalette="green"
                            onClick={() => markWaybillDelivered(wb.id, currentUserName)}
                            title="Confirm site delivery receipt"
                          >
                            <Check size={12} /> Confirm Delivered
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          colorPalette="blue"
                          onClick={() => {
                            const rec: StoreReceiptData = {
                              type: 'delivery_order_receipt',
                              receiptNo: wb.waybillNo || wb.waybillNumber,
                              date: wb.dispatchDate,
                              itemName: wb.itemName || wb.items[0]?.itemName || 'Materials',
                              itemCode: wb.itemCode || wb.items[0]?.itemCode || '',
                              quantity: wb.quantity ?? wb.items[0]?.quantityDispatched ?? 1,
                              unit: wb.unit || wb.items[0]?.unit || 'Units',
                              warehouseName: wb.sourceWarehouse || wb.sourceWarehouseName || 'Central Warehouse',
                              requisitionNo: wb.requisitionNo,
                              projectName: wb.destinationProject || wb.projectName,
                              recipientName: wb.recipientName || wb.receivedBy || 'Site Storekeeper',
                              gatePassNo: wb.gatePassNo,
                              dispatchedBy: wb.dispatchedBy,
                              notes: `Carrier: ${wb.carrierName} | Truck: ${wb.vehicleNumber} | Driver Phone: ${wb.driverPhone || 'N/A'}`
                            };
                            setReceiptData(rec);
                            setShowReceiptModal(true);
                          }}
                          title="View & Print Official Gate Pass Voucher"
                        >
                          <Printer size={13} /> Gate Pass
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {/* DISPATCH EXECUTION MODAL */}
      {dispatchItem && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(15, 23, 42, 0.65)"
          zIndex="1400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="580px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                  <Truck size={20} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">Dispatch Allocated Stock</Heading>
                  <Text fontSize="xs" color="#64748b">
                    Issue physical stock from store, assign transport vehicle, and generate gate pass.
                  </Text>
                </Box>
              </Flex>
            </Flex>

            {/* Material Summary Card */}
            <Card.Root bg="#f8fafc" p={3.5} borderRadius="10px" border="1px solid #e2e8f0" my={3}>
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={2}>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Material SKU</Text>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">{dispatchItem.itemCode}</Text>
                  <Text fontSize="11px" color="#475569" truncate>{dispatchItem.name}</Text>
                </Box>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Allocated in Store</Text>
                  <Text fontSize="sm" fontWeight="black" color="#d97706">
                    {dispatchItem.allocatedStock} {dispatchItem.unit}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Storage Yard</Text>
                  <Text fontSize="xs" fontWeight="semibold" color="#0f172a">{dispatchItem.warehouseLocation}</Text>
                </Box>
              </SimpleGrid>
            </Card.Root>

            {dispatchFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {dispatchFeedback}
              </Box>
            )}

            <form onSubmit={handleConfirmDispatch}>
              <Stack gap={3}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                      Quantity to Dispatch ({dispatchItem.unit}) *
                    </Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      max={dispatchItem.allocatedStock}
                      value={dispatchForm.quantity}
                      onChange={e => setDispatchForm({ ...dispatchForm, quantity: Math.max(1, Number(e.target.value)) })}
                      required
                    />
                    <Text fontSize="10px" color="#64748b" mt={0.5}>
                      Max dispatchable: {dispatchItem.allocatedStock} {dispatchItem.unit}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                      Destination Project Site *
                    </Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={dispatchForm.projectId}
                        onChange={e => {
                          const prj = projects.find(p => p.id === Number(e.target.value));
                          setDispatchForm({
                            ...dispatchForm,
                            projectId: Number(e.target.value),
                            projectName: prj?.name || ''
                          });
                        }}
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.projectNumber})</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Haulier / Carrier Company *</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.carrierName}
                      onChange={e => setDispatchForm({ ...dispatchForm, carrierName: e.target.value })}
                      placeholder="e.g. Apex Haulage & Logistics"
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Truck Registration Plate *</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.vehicleNumber}
                      onChange={e => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                      placeholder="e.g. KSF-482-XA"
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Driver Contact Phone</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.driverPhone}
                      onChange={e => setDispatchForm({ ...dispatchForm, driverPhone: e.target.value })}
                      placeholder="+234..."
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Receiving Officer *</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.recipientName}
                      onChange={e => setDispatchForm({ ...dispatchForm, recipientName: e.target.value })}
                      placeholder="Site Storekeeper / Engineer"
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Gate Pass Ref #</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.gatePassNo}
                      onChange={e => setDispatchForm({ ...dispatchForm, gatePassNo: e.target.value })}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Linked Requisition No</Text>
                    <Input
                      size="sm"
                      value={dispatchForm.requisitionNo}
                      onChange={e => setDispatchForm({ ...dispatchForm, requisitionNo: e.target.value })}
                      placeholder="e.g. REQ-2026-001"
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Dispatch & Inspection Notes</Text>
                  <Textarea
                    size="sm"
                    rows={2}
                    value={dispatchForm.notes}
                    onChange={e => setDispatchForm({ ...dispatchForm, notes: e.target.value })}
                    placeholder="Inspection remarks, seal numbers, batch IDs..."
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setDispatchItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    <Truck size={14} /> Confirm Truck Dispatch & Issue Waybill
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* ALLOCATE STOCK MODAL */}
      {showAllocateModal && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(15, 23, 42, 0.65)"
          zIndex="1400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="520px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>
              Allocate Free Stock for Project Dispatch
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Reserve materials from free warehouse stock. The allocated quantity will move into the Dispatch Queue awaiting logistics mobilization.
            </Text>

            {allocateFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {allocateFeedback}
              </Box>
            )}

            <form onSubmit={handleExecuteAllocate}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Material SKU *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={allocateForm.itemId}
                      onChange={e => {
                        const target = inventory.find(i => i.id === Number(e.target.value));
                        setAllocateForm({
                          ...allocateForm,
                          itemId: Number(e.target.value),
                          quantity: Math.min(10, Number(target?.freeStock) || 1)
                        });
                      }}
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.itemCode} - {inv.name} (Free: {inv.freeStock} {inv.unit} in {inv.warehouseLocation})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity to Allocate *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      value={allocateForm.quantity}
                      onChange={e => setAllocateForm({ ...allocateForm, quantity: Math.max(1, Number(e.target.value)) })}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Destination Project *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={allocateForm.projectId}
                        onChange={e => setAllocateForm({ ...allocateForm, projectId: Number(e.target.value) })}
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Allocation Purpose / Justification</Text>
                  <Input
                    size="sm"
                    value={allocateForm.notes}
                    onChange={e => setAllocateForm({ ...allocateForm, notes: e.target.value })}
                    placeholder="e.g. Reserved for Foundation Pours in Sector 4"
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAllocateModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Reserve & Allocate Stock
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* DEALLOCATE / RELEASE MODAL */}
      {deallocateItem && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(15, 23, 42, 0.65)"
          zIndex="1400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="440px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Release Allocated Stock
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Release committed units of <strong>{deallocateItem.name}</strong> back into Free Stock.
            </Text>

            <form onSubmit={handleConfirmDeallocate}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Quantity to Release ({deallocateItem.unit}) *</Text>
                  <Input
                    size="sm"
                    type="number"
                    min={1}
                    max={deallocateItem.allocatedStock}
                    value={deallocateQty}
                    onChange={e => setDeallocateQty(Math.max(1, Math.min(Number(deallocateItem.allocatedStock) || 1, Number(e.target.value))))}
                    required
                  />
                  <Text fontSize="10px" color="#64748b" mt={0.5}>
                    Allocated quantity: {deallocateItem.allocatedStock} {deallocateItem.unit}
                  </Text>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setDeallocateItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="red" type="submit" fontWeight="bold">
                    Confirm Release to Free Stock
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Printable Delivery Order & Gate Pass Voucher Modal */}
      <StoreReceiptModal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setReceiptData(null);
        }}
        receiptData={receiptData}
      />
    </Stack>
  );
};
