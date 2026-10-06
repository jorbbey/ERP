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
import { StockMovement, InventoryItem } from '../../../types';
import {
  ArrowDownUp,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Sliders,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StockMovementsTab: React.FC = () => {
  const { stockMovements, transferStock, inventory, warehouses, projects, activeCompany } = useERP();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    itemId: inventory[0]?.id || 1,
    quantity: 5,
    sourceWarehouseId: warehouses[0]?.id || 1,
    targetWarehouseId: warehouses[1]?.id || 2,
    projectId: projects[0]?.id || 1,
    reason: 'Inter-store transfer for active site execution works'
  });

  const [transferFeedback, setTransferFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const filteredMovements = stockMovements.filter((m) => {
    const matchesType = typeFilter === 'all' || m.movementType === typeFilter;
    const matchesWarehouse = warehouseFilter === 'all' || 
      m.warehouseName.toLowerCase().includes(warehouseFilter.toLowerCase()) ||
      m.source.toLowerCase().includes(warehouseFilter.toLowerCase()) ||
      m.destination.toLowerCase().includes(warehouseFilter.toLowerCase());
    const matchesSearch = 
      m.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesWarehouse && matchesSearch;
  });

  const selectedItemForTransfer = inventory.find(i => i.id === transferForm.itemId) || inventory[0];

  const handleOpenTransfer = () => {
    setTransferFeedback(null);
    setTransferForm({
      itemId: inventory[0]?.id || 1,
      quantity: 5,
      sourceWarehouseId: warehouses[0]?.id || 1,
      targetWarehouseId: warehouses[1]?.id || warehouses[0]?.id || 1,
      projectId: projects[0]?.id || 1,
      reason: 'Inter-store transfer for scheduled concrete casting'
    });
    setShowTransferModal(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferFeedback(null);

    if (transferForm.sourceWarehouseId === transferForm.targetWarehouseId) {
      setTransferFeedback({ type: 'error', message: 'Source store and destination store must be different.' });
      return;
    }

    if (transferForm.quantity <= 0) {
      setTransferFeedback({ type: 'error', message: 'Transfer quantity must be greater than zero.' });
      return;
    }

    const srcWh = warehouses.find(w => w.id === transferForm.sourceWarehouseId);
    const tgtWh = warehouses.find(w => w.id === transferForm.targetWarehouseId);
    const prj = projects.find(p => p.id === transferForm.projectId);

    const res = transferStock({
      itemId: transferForm.itemId,
      quantity: Number(transferForm.quantity),
      sourceWarehouseId: transferForm.sourceWarehouseId,
      sourceWarehouseName: srcWh?.name || 'Main Yard A',
      targetWarehouseId: transferForm.targetWarehouseId,
      targetWarehouseName: tgtWh?.name || 'Site Camp B',
      reason: transferForm.reason,
      projectId: transferForm.projectId,
      projectName: prj?.name
    });

    if (res.success) {
      setTransferFeedback({ type: 'success', message: 'Stock successfully transferred and movement logged.' });
      setTimeout(() => {
        setShowTransferModal(false);
      }, 700);
    } else {
      setTransferFeedback({ type: 'error', message: res.error || 'Failed to complete transfer.' });
    }
  };

  const getMovementBadge = (type: StockMovement['movementType']) => {
    switch (type) {
      case 'receipt':
        return <Badge size="xs" colorPalette="green"><ArrowDownLeft size={11} style={{ display: 'inline' }} /> Receipt (GRN)</Badge>;
      case 'issue':
        return <Badge size="xs" colorPalette="blue"><ArrowUpRight size={11} style={{ display: 'inline' }} /> Issue (Site)</Badge>;
      case 'transfer':
        return <Badge size="xs" colorPalette="purple"><ArrowRightLeft size={11} style={{ display: 'inline' }} /> Transfer</Badge>;
      case 'adjustment':
        return <Badge size="xs" colorPalette="orange"><Sliders size={11} style={{ display: 'inline' }} /> Adjustment</Badge>;
      case 'return':
        return <Badge size="xs" colorPalette="teal"><RotateCcw size={11} style={{ display: 'inline' }} /> Return</Badge>;
      default:
        return <Badge size="xs">{type}</Badge>;
    }
  };

  return (
    <Stack gap={5}>
      {/* Action & Filter Bar */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
        <Flex gap={2} flex="1" maxW={{ md: '450px' }}>
          <Box position="relative" flex="1">
            <Input
              size="sm"
              placeholder="Search reference, SKU, material, source, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="#cbd5e1"
            />
          </Box>
        </Flex>

        <Flex gap={2} flexWrap="wrap" align="center">
          <Flex align="center" gap={1.5}>
            <Text fontSize="xs" color="#64748b" fontWeight="medium">Type:</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                bg="white"
                borderColor="#cbd5e1"
              >
                <option value="all">All Movements</option>
                <option value="receipt">Goods Receipt (GRN)</option>
                <option value="issue">Site Material Issue</option>
                <option value="transfer">Store Transfer</option>
                <option value="adjustment">Stock Adjustment</option>
                <option value="return">Site Return</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Flex>

          <Flex align="center" gap={1.5}>
            <Text fontSize="xs" color="#64748b" fontWeight="medium">Store:</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                bg="white"
                borderColor="#cbd5e1"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Flex>

          <Button size="sm" colorPalette="blue" onClick={handleOpenTransfer} fontWeight="semibold">
            <ArrowRightLeft size={16} /> Inter-Store Transfer
          </Button>
        </Flex>
      </Flex>

      {/* Movements Table */}
      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row bg="#f8fafc">
                <Table.ColumnHeader fontSize="10px">Ref # & Date</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Type</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material / SKU</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Movement Quantity</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Source → Destination</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Performer</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Reason / Document</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredMovements.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={8} color="#64748b" fontSize="xs">
                    No stock movement operations recorded matching current filter parameters.
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredMovements.map((m) => (
                  <Table.Row key={m.id} _hover={{ bg: '#f8fafc' }}>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="bold" fontFamily="mono" color="#0f172a">{m.referenceNumber}</Text>
                      <Text fontSize="10px" color="#94a3b8">{m.movementDate}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      {getMovementBadge(m.movementType)}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="semibold" color="#0f172a">{m.itemName}</Text>
                      <Badge size="xs" variant="outline" fontFamily="mono">{m.itemCode}</Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="black">
                      <Text color={m.quantity < 0 ? '#dc2626' : m.movementType === 'receipt' ? '#16a34a' : '#2563eb'}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                      </Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Flex align="center" gap={1} color="#334155">
                        <Text truncate maxW="130px" fontWeight="medium">{m.source}</Text>
                        <Text color="#94a3b8">→</Text>
                        <Text truncate maxW="130px" fontWeight="semibold" color="#0f172a">{m.destination}</Text>
                      </Flex>
                      {m.projectName && (
                        <Text fontSize="10px" color="#2563eb">{m.projectName}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#475569">
                      {m.performedBy}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b" maxW="200px">
                      <Text truncate>{m.reason}</Text>
                      {m.relatedDocumentRef && (
                        <Badge size="xs" variant="subtle" colorPalette="gray" mt={0.5}>
                          {m.relatedDocumentType}: {m.relatedDocumentRef}
                        </Badge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {/* Inter-Store Transfer Modal */}
      {showTransferModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="560px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Execute Inter-Store Material Transfer
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Relocate materials between warehouse yards and active site supply caches.
            </Text>

            {transferFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg={transferFeedback.type === 'error' ? '#fef2f2' : '#f0fdf4'} border="1px solid" borderColor={transferFeedback.type === 'error' ? '#fecaca' : '#bbf7d0'} fontSize="xs" color={transferFeedback.type === 'error' ? '#b91c1c' : '#166534'}>
                {transferFeedback.message}
              </Box>
            )}

            <form onSubmit={handleExecuteTransfer}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material SKU to Transfer *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={transferForm.itemId}
                      onChange={(e) => setTransferForm({ ...transferForm, itemId: Number(e.target.value) })}
                    >
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.itemCode} - {item.name} (Current Available: {item.currentStock} {item.unit})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Source Warehouse / Yard *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={transferForm.sourceWarehouseId}
                        onChange={(e) => setTransferForm({ ...transferForm, sourceWarehouseId: Number(e.target.value) })}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Destination Warehouse / Store *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={transferForm.targetWarehouseId}
                        onChange={(e) => setTransferForm({ ...transferForm, targetWarehouseId: Number(e.target.value) })}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                      Quantity ({selectedItemForTransfer?.unit}) *
                    </Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      max={selectedItemForTransfer?.currentStock || 1000}
                      value={transferForm.quantity}
                      onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                      required
                    />
                    <Text fontSize="10px" color="#64748b" mt={0.5}>
                      Max available: {selectedItemForTransfer?.currentStock} {selectedItemForTransfer?.unit}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Allocated Project</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={transferForm.projectId}
                        onChange={(e) => setTransferForm({ ...transferForm, projectId: Number(e.target.value) })}
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.projectNumber} - {p.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Reason / Material Purpose *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Relocating rebar from Central Depot to Pier 4 site staging yard"
                    value={transferForm.reason}
                    onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowTransferModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Complete Stock Transfer
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
