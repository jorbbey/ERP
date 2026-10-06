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
import { Warehouse, InventoryItem } from '../../../types';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  User,
  Boxes,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Eye,
  ArrowRightLeft
} from 'lucide-react';

interface WarehousesTabProps {
  onInitiateTransfer?: (warehouseId: number) => void;
}

export const WarehousesTab: React.FC<WarehousesTabProps> = ({ onInitiateTransfer }) => {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse, inventory, activeCompany } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    location: string;
    storeKeeperName: string;
    phone: string;
    capacity: string;
    status: 'active' | 'inactive';
  }>({
    code: `WH-0${warehouses.length + 1}`,
    name: '',
    location: '',
    storeKeeperName: '',
    phone: '',
    capacity: '5,000 MT',
    status: 'active'
  });

  const filteredWarehouses = warehouses.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.storeKeeperName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      code: `WH-0${warehouses.length + 1}`,
      name: '',
      location: '',
      storeKeeperName: '',
      phone: '',
      capacity: '5,000 MT',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (w: Warehouse) => {
    setEditingWarehouse(w);
    setFormData({
      code: w.code,
      name: w.name,
      location: w.location,
      storeKeeperName: w.storeKeeperName,
      phone: w.phone || '',
      capacity: w.capacity || '5,000 MT',
      status: w.status
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) return;

    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, formData);
      setEditingWarehouse(null);
    } else {
      addWarehouse(formData);
      setShowAddModal(false);
    }
  };

  const getItemsForWarehouse = (w: Warehouse): InventoryItem[] => {
    return inventory.filter(i => 
      i.warehouseId === w.id ||
      i.warehouseLocation.toLowerCase().includes(w.name.toLowerCase()) ||
      i.warehouseLocation.toLowerCase().includes(w.code.toLowerCase())
    );
  };

  return (
    <Stack gap={5}>
      {/* Header & Search */}
      <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
        <Box maxW="380px" w="100%">
          <Flex align="center" bg="white" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
            <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              placeholder="Search store name, code, location or storekeeper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </Flex>
        </Box>

        <Button size="sm" colorPalette="blue" onClick={handleOpenAdd} fontWeight="semibold">
          <Plus size={16} /> Add Storage Depot / Yard
        </Button>
      </Flex>

      {/* Warehouses Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {filteredWarehouses.map((w) => {
          const items = getItemsForWarehouse(w);
          const totalVal = items.reduce((acc, i) => acc + (i.currentStock * i.costPrice), 0);

          return (
            <Card.Root key={w.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Flex align="center" gap={2}>
                    <Badge size="xs" colorPalette="blue" fontFamily="mono">{w.code}</Badge>
                    <Badge size="xs" colorPalette={w.status === 'active' ? 'green' : 'gray'}>
                      {w.status.toUpperCase()}
                    </Badge>
                  </Flex>
                  <Heading size="md" color="#0f172a" mt={2} display="flex" alignItems="center" gap={2}>
                    <Building2 size={18} color="#2563eb" /> {w.name}
                  </Heading>
                </Box>

                <Flex gap={1}>
                  <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setViewingWarehouse(w)} title="View Inventory">
                    <Eye size={14} />
                  </Button>
                  <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleOpenEdit(w)} title="Edit Store">
                    <Edit size={14} />
                  </Button>
                  {warehouses.length > 1 && (
                    <Button size="xs" variant="ghost" colorPalette="red" onClick={() => deleteWarehouse(w.id)} title="Delete Store">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </Flex>
              </Flex>

              <Stack gap={1.5} mt={3} fontSize="xs" color="#64748b">
                <Flex align="center" gap={1.5}>
                  <MapPin size={14} color="#94a3b8" />
                  <Text>{w.location}</Text>
                </Flex>
                <Flex align="center" gap={1.5}>
                  <User size={14} color="#94a3b8" />
                  <Text>Storekeeper: <Text as="span" fontWeight="semibold" color="#0f172a">{w.storeKeeperName}</Text></Text>
                  {w.phone && (
                    <Text as="span" color="#94a3b8">• <Phone size={11} style={{ display: 'inline' }} /> {w.phone}</Text>
                  )}
                </Flex>
              </Stack>

              {/* Stored Stats */}
              <SimpleGrid columns={2} gap={3} mt={4} pt={3} borderTop="1px dashed #e2e8f0">
                <Box bg="#f8fafc" p={2.5} borderRadius="10px">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Stored SKUs</Text>
                  <Text fontSize="md" fontWeight="bold" color="#0f172a" mt={0.5}>
                    {items.length} Materials
                  </Text>
                </Box>
                <Box bg="#f8fafc" p={2.5} borderRadius="10px">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Stored Valuation</Text>
                  <Text fontSize="md" fontWeight="bold" color="#16a34a" mt={0.5}>
                    {activeCompany.currency} {totalVal.toLocaleString()}
                  </Text>
                </Box>
              </SimpleGrid>

              <Flex justify="space-between" align="center" mt={3}>
                <Text fontSize="11px" color="#94a3b8">Capacity: {w.capacity || 'Standard'}</Text>
                {onInitiateTransfer && (
                  <Button size="xs" variant="subtle" colorPalette="blue" onClick={() => onInitiateTransfer(w.id)}>
                    <ArrowRightLeft size={13} /> Transfer Stock
                  </Button>
                )}
              </Flex>
            </Card.Root>
          );
        })}
      </SimpleGrid>

      {/* Add / Edit Modal */}
      {(showAddModal || editingWarehouse) && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              {editingWarehouse ? 'Edit Storage Yard / Warehouse' : 'Register New Storage Yard / Warehouse'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Specify storage location address, capacity rating, and assigned head storekeeper.
            </Text>

            <form onSubmit={handleSave}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Store Code *</Text>
                    <Input
                      size="sm"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Operational Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="active">Active Operational</option>
                        <option value="inactive">Inactive / Under Renovation</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Store / Warehouse Name *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Marina Wharf Staging Depot"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Physical Site Location / Address *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Kilometer 14 Express Yard, Industrial District"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Storekeeper Name *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. David O'Connor"
                      value={formData.storeKeeperName}
                      onChange={(e) => setFormData({ ...formData, storeKeeperName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contact Phone</Text>
                    <Input
                      size="sm"
                      placeholder="+1 (555) 234-8904"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Storage Capacity / Spec</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. 5,000 MT / 3 Enclosed Bunkers"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWarehouse(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    {editingWarehouse ? 'Save Changes' : 'Register Store'}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* View Warehouse Stored Items Modal */}
      {viewingWarehouse && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="700px" w="100%" p={6} boxShadow="2xl" maxH="85vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="md" color="#0f172a">{viewingWarehouse.name}</Heading>
                <Text fontSize="xs" color="#64748b">{viewingWarehouse.location} • Head Storekeeper: {viewingWarehouse.storeKeeperName}</Text>
              </Box>
              <Button size="xs" variant="outline" onClick={() => setViewingWarehouse(null)}>Close</Button>
            </Flex>

            {getItemsForWarehouse(viewingWarehouse).length === 0 ? (
              <Box p={6} textAlign="center" bg="#f8fafc" borderRadius="10px" color="#64748b" fontSize="xs">
                No inventory materials currently registered under this warehouse.
              </Box>
            ) : (
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">SKU Code</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Material Description</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">In Stock</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Unit Rate</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Stock Valuation</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getItemsForWarehouse(viewingWarehouse).map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">{item.itemCode}</Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="medium">{item.name}</Text>
                        <Text fontSize="10px" color="#94a3b8">{item.categoryName}</Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold">
                        {item.currentStock} {item.unit}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        {activeCompany.currency} {item.costPrice.toFixed(2)}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#16a34a">
                        {activeCompany.currency} {(item.currentStock * item.costPrice).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Box>
        </Box>
      )}
    </Stack>
  );
};
