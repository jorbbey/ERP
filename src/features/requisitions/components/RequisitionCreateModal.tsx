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
import { RequisitionItem } from '../../../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface RequisitionCreateModalProps {
  onClose: () => void;
}

export const RequisitionCreateModal: React.FC<RequisitionCreateModalProps> = ({ onClose }) => {
  const {
    createRequisition,
    projects,
    inventory,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [projectId, setProjectId] = useState<number>(projects[0]?.id || 1);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('Reinforcement & Concrete Structures');
  const [remarks, setRemarks] = useState('');

  const [items, setItems] = useState<RequisitionItem[]>([
    {
      inventoryItemId: inventory[0]?.id,
      itemCode: inventory[0]?.itemCode,
      itemName: inventory[0]?.name || '',
      unit: inventory[0]?.unit || 'Bags',
      quantityRequired: 20,
      quantityInStock: inventory[0]?.currentStock || 0,
      quantityToPurchase: Math.max(0, 20 - (inventory[0]?.currentStock || 0)),
      price: inventory[0]?.costPrice || 12,
      value: (inventory[0]?.costPrice || 12) * 20
    }
  ]);

  const handleAddItemRow = () => {
    const def = inventory[0];
    setItems([
      ...items,
      {
        inventoryItemId: def?.id,
        itemCode: def?.itemCode,
        itemName: def?.name || '',
        unit: def?.unit || 'Units',
        quantityRequired: 10,
        quantityInStock: def?.currentStock || 0,
        quantityToPurchase: Math.max(0, 10 - (def?.currentStock || 0)),
        price: def?.costPrice || 10,
        value: (def?.costPrice || 10) * 10
      }
    ]);
  };

  const handleItemSelect = (index: number, itemId: number) => {
    const selected = inventory.find(i => i.id === itemId);
    if (!selected) return;
    const updated = [...items];
    const qty = updated[index].quantityRequired || 1;
    updated[index] = {
      inventoryItemId: selected.id,
      itemCode: selected.itemCode,
      itemName: selected.name,
      unit: selected.unit,
      quantityRequired: qty,
      quantityInStock: selected.currentStock,
      quantityToPurchase: Math.max(0, qty - selected.currentStock),
      price: selected.costPrice,
      value: selected.costPrice * qty
    };
    setItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    const unitPrice = updated[index].price || 0;
    const inStock = updated[index].quantityInStock || 0;
    updated[index].quantityRequired = qty;
    updated[index].quantityToPurchase = Math.max(0, qty - inStock);
    updated[index].value = qty * unitPrice;
    setItems(updated);
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...items];
    const qty = updated[index].quantityRequired || 0;
    updated[index].price = price;
    updated[index].value = qty * price;
    setItems(updated);
  };

  const handleRemoveRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCalculated = items.reduce((acc, i) => acc + (i.value || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);

    createRequisition({
      projectId,
      projectName: proj?.name || 'Site Project',
      requestedBy: currentUserName,
      department: 'Civil Engineering & Construction',
      priority,
      title: title || `Material Requisition for ${proj?.name}`,
      trade,
      items,
      totalEstimatedAmount: totalCalculated,
      remarks
    });

    onClose();
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="white" borderRadius="16px" maxW="780px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
        <Heading size="md" color="#0f172a" mb={1}>
          Raise Site Material Requisition (MR)
        </Heading>
        <Text fontSize="xs" color="#64748b" mb={4}>
          Specify bill of materials required for project site execution, checking current warehouse stores.
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            {/* Top Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Allocated Project *</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={projectId}
                    onChange={(e) => setProjectId(Number(e.target.value))}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectNumber} - {p.name}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Urgency / Priority *</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                  >
                    <option value="Normal">Normal Procurement Schedule</option>
                    <option value="High">High (Required within 48 Hours)</option>
                    <option value="Urgent">Urgent / Critical Site Stoppage</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Requisition Title / Summary *</Text>
                <Input
                  size="sm"
                  placeholder="e.g. Reinforcement Steel & Cement for Pier 4 Cap"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Trade / Work Section</Text>
                <Input
                  size="sm"
                  placeholder="e.g. Substructure Concrete & Piling"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                />
              </Box>
            </SimpleGrid>

            {/* Dynamic Items Table */}
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="xs" fontWeight="bold" color="#334155" textTransform="uppercase">
                  Material Line Items
                </Text>
                <Button size="xs" variant="outline" colorPalette="blue" onClick={handleAddItemRow}>
                  <Plus size={13} /> Add Material Line
                </Button>
              </Flex>

              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px" w="35%">Material SKU</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Req Qty</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">In Stores</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">To Purchase</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Est. Rate</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Total</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" w="40px"></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items.map((row, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>
                        <NativeSelect.Root size="xs">
                          <NativeSelect.Field
                            value={row.inventoryItemId}
                            onChange={(e) => handleItemSelect(idx, Number(e.target.value))}
                          >
                            {inventory.map(inv => (
                              <option key={inv.id} value={inv.id}>
                                {inv.itemCode} - {inv.name} ({inv.unit})
                              </option>
                            ))}
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          type="number"
                          size="xs"
                          min={1}
                          w="70px"
                          value={row.quantityRequired}
                          onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                          required
                        />
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#16a34a" fontWeight="medium">
                        {row.quantityInStock}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#d97706" fontWeight="bold">
                        {row.quantityToPurchase}
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          type="number"
                          step="any"
                          size="xs"
                          w="75px"
                          value={row.price}
                          onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                        />
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold">
                        {activeCompany.currency} {(row.value || 0).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        {items.length > 1 && (
                          <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleRemoveRow(idx)}>
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Total & Remarks */}
            <Flex justify="space-between" align="center" bg="#f8fafc" p={3} borderRadius="10px">
              <Box>
                <Text fontSize="11px" color="#64748b">Requesting Engineer: <Text as="span" fontWeight="bold" color="#0f172a">{currentUserName}</Text></Text>
                <Text fontSize="10px" color="#94a3b8">Initial status: Pending Review</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Total Estimated Value</Text>
                <Text fontSize="lg" fontWeight="black" color="#16a34a">
                  {activeCompany.currency} {totalCalculated.toLocaleString()}
                </Text>
              </Box>
            </Flex>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Purpose & Technical Remarks</Text>
              <Input
                size="sm"
                placeholder="e.g. Concrete placement planned for Level 5 cantilever beam on Tuesday"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Box>

            <Flex justify="flex-end" gap={2} mt={3}>
              <Button size="sm" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="blue" type="submit">
                Submit Material Requisition
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
