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
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { RequisitionDispatchRequest, InventoryItem } from '../../../types';
import {
  Truck,
  PackageCheck,
  AlertCircle,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight
} from 'lucide-react';

export const DispatchRequestsTab: React.FC = () => {
  const {
    dispatchRequests,
    executeDispatch,
    inventory,
    warehouses,
    activeCompany,
    activeRole
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispatched'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RequisitionDispatchRequest | null>(null);

  // Dispatch Execution Form
  const [carrierName, setCarrierName] = useState('Apex Logistics Fleet');
  const [vehicleNumber, setVehicleNumber] = useState('TRK-442-LAG');
  const [driverPhone, setDriverPhone] = useState('+234 803 555 9182');
  const [dispatchQty, setDispatchQty] = useState(10);
  const [sourceWarehouseId, setSourceWarehouseId] = useState(warehouses[0]?.id || 1);
  const [notes, setNotes] = useState('Inspect before loading; secure tied bundles.');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const canDispatch = ['Store Officer', 'Head Store Keeper', 'Procurement Officer', 'Managing Director', 'Super Admin'].includes(activeRole);

  const filteredRequests = dispatchRequests.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      d.requisitionNo.toLowerCase().includes(q) ||
      d.itemName.toLowerCase().includes(q) ||
      d.itemCode.toLowerCase().includes(q) ||
      d.destinationProjectName.toLowerCase().includes(q) ||
      d.sourceWarehouseName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleOpenDispatch = (req: RequisitionDispatchRequest) => {
    setSelectedRequest(req);
    setDispatchQty(req.quantity);
    setSourceWarehouseId(req.sourceWarehouseId || warehouses[0]?.id || 1);
    setFeedback(null);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setFeedback(null);

    const wh = warehouses.find(w => w.id === sourceWarehouseId) || warehouses[0];

    const res = executeDispatch({
      dispatchRequestId: selectedRequest.id,
      requisitionId: selectedRequest.requisitionId,
      requisitionNo: selectedRequest.requisitionNo,
      inventoryItemId: selectedRequest.inventoryItemId,
      quantity: Number(dispatchQty),
      sourceWarehouseId,
      sourceWarehouseName: wh.name,
      destinationProjectId: selectedRequest.destinationProjectId,
      destinationProjectName: selectedRequest.destinationProjectName,
      carrierName,
      vehicleNumber,
      driverPhone,
      notes
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Materials dispatched! Waybill generated and stock deducted from stores.' });
      setTimeout(() => {
        setSelectedRequest(null);
      }, 800);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to dispatch material.' });
    }
  };

  return (
    <Stack gap={5}>
      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={3}>
        <Box maxW="380px" w="100%">
          <Flex align="center" bg="white" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
            <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              placeholder="Search dispatch request, requisition #, material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </Flex>
        </Box>

        <Flex align="center" gap={1.5}>
          <Text fontSize="xs" color="#64748b" fontWeight="medium">Status:</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              bg="white"
              borderColor="#cbd5e1"
            >
              <option value="all">All Dispatch Requests</option>
              <option value="pending">Pending Store Dispatch</option>
              <option value="dispatched">Dispatched to Site</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Flex>
      </Flex>

      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row bg="#f8fafc">
                <Table.ColumnHeader fontSize="10px">Requisition #</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material Item</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Quantity Required</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Source Store</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Destination Project</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Status</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredRequests.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={8} color="#64748b" fontSize="xs">
                    No dispatch queue records found matching criteria.
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredRequests.map((req) => {
                  const invItem = inventory.find(i => i.id === req.inventoryItemId);
                  const isStockAvailable = invItem ? invItem.currentStock >= req.quantity : false;

                  return (
                    <Table.Row key={req.id} _hover={{ bg: '#f8fafc' }}>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="bold" fontFamily="mono" color="#2563eb">{req.requisitionNo}</Text>
                        <Text fontSize="10px" color="#94a3b8">{req.requestedAt}</Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="semibold" color="#0f172a">{req.itemName}</Text>
                        <Badge size="xs" variant="outline" fontFamily="mono">{req.itemCode}</Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold">
                        {req.quantity} {req.unit}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">
                        <Text>{req.sourceWarehouseName}</Text>
                        {invItem && (
                          <Text fontSize="10px" color={isStockAvailable ? '#16a34a' : '#dc2626'}>
                            Available: {invItem.currentStock} {invItem.unit}
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#0f172a" fontWeight="medium">
                        {req.destinationProjectName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Badge
                          size="xs"
                          colorPalette={req.status === 'dispatched' ? 'purple' : 'orange'}
                        >
                          {req.status === 'dispatched' ? 'DISPATCHED' : 'PENDING STORES'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right">
                        {req.status === 'pending' ? (
                          canDispatch ? (
                            <Button
                              size="xs"
                              colorPalette="blue"
                              onClick={() => handleOpenDispatch(req)}
                              disabled={!isStockAvailable}
                              title={!isStockAvailable ? 'Insufficient stock in stores' : 'Prepare gate pass and waybill'}
                            >
                              <Truck size={13} /> Dispatch to Site
                            </Button>
                          ) : (
                            <Badge size="xs" colorPalette="gray">Store Officer Auth</Badge>
                          )
                        ) : (
                          <Badge size="xs" colorPalette="green">Completed</Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {/* Dispatch Modal */}
      {selectedRequest && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Issue Material Gate Pass & Waybill
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Requisition: <Text as="span" fontWeight="bold" color="#2563eb">{selectedRequest.requisitionNo}</Text> • Item: <Text as="span" fontWeight="bold" color="#0f172a">{selectedRequest.itemName}</Text>
            </Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg={feedback.type === 'error' ? '#fef2f2' : '#f0fdf4'} border="1px solid" borderColor={feedback.type === 'error' ? '#fecaca' : '#bbf7d0'} fontSize="xs" color={feedback.type === 'error' ? '#b91c1c' : '#166534'}>
                {feedback.message}
              </Box>
            )}

            <form onSubmit={handleConfirmDispatch}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Source Warehouse Yard *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={sourceWarehouseId}
                        onChange={(e) => setSourceWarehouseId(Number(e.target.value))}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity to Dispatch ({selectedRequest.unit}) *</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      max={selectedRequest.quantity}
                      value={dispatchQty}
                      onChange={(e) => setDispatchQty(Number(e.target.value))}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Haulage Carrier / Transporter *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Apex Haulage Fleet"
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Truck / Vehicle Plate # *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. TRK-442-LAG"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Driver Contact Phone</Text>
                  <Input
                    size="sm"
                    placeholder="+234 803 555 9182"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Store Inspection & Gate-Out Notes</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Rebar bundles weighed on weighbridge; verified by storekeeper"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setSelectedRequest(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Generate Waybill & Gate Out
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
