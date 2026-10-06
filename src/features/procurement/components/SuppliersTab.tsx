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
import { Supplier, PurchaseOrder, GoodsReceivedNote } from '../../../types';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  FileText,
  PackageCheck,
  DollarSign
} from 'lucide-react';

export const SuppliersTab: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, purchaseOrders, goodsReceivedNotes, activeCompany } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    supplierCode: `SUP-0${suppliers.length + 1}`,
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: 'Civil Aggregates & Cement',
    balance: 0,
    taxId: '',
    paymentTerms: 'Net 30 Days',
    status: 'active' as 'active' | 'inactive'
  });

  const categories = [
    'All',
    'Civil Aggregates & Cement',
    'Structural Steel & Rebar',
    'Heavy Equipment & Spares',
    'Safety & PPE',
    'Finishes & MEP'
  ];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.companyName.toLowerCase().includes(q) ||
      s.supplierCode.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q);

    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      supplierCode: `SUP-0${suppliers.length + 1}`,
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: 'Civil Aggregates & Cement',
      balance: 0,
      taxId: '',
      paymentTerms: 'Net 30 Days',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      supplierCode: s.supplierCode,
      companyName: s.companyName,
      contactPerson: s.contactPerson,
      email: s.email,
      phone: s.phone,
      address: s.address,
      category: s.category,
      balance: s.balance,
      taxId: s.taxId || '',
      paymentTerms: s.paymentTerms || 'Net 30 Days',
      status: s.status
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactPerson.trim()) return;

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
      setEditingSupplier(null);
    } else {
      addSupplier(formData);
      setShowAddModal(false);
    }
  };

  const getPOsForSupplier = (supplierId: number): PurchaseOrder[] => {
    return purchaseOrders.filter(p => p.supplierId === supplierId);
  };

  const getGRNsForSupplier = (supplierId: number): GoodsReceivedNote[] => {
    return goodsReceivedNotes.filter(g => g.supplierId === supplierId);
  };

  return (
    <Stack gap={5}>
      {/* Search and Filters */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
        <Box maxW="380px" w="100%">
          <Flex align="center" bg="white" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
            <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              placeholder="Search supplier, code, contact, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </Flex>
        </Box>

        <Flex gap={2} flexWrap="wrap" align="center">
          <Flex align="center" gap={1.5}>
            <Text fontSize="xs" color="#64748b" fontWeight="medium">Category:</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                bg="white"
                borderColor="#cbd5e1"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Flex>

          <Button size="sm" colorPalette="blue" onClick={handleOpenAdd} fontWeight="semibold">
            <Plus size={16} /> Register Vendor / Supplier
          </Button>
        </Flex>
      </Flex>

      {/* Suppliers Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {filteredSuppliers.map((s) => {
          const supplierPOs = getPOsForSupplier(s.id);
          const totalCommitted = supplierPOs.reduce((acc, p) => acc + (p.totalAmount || 0), 0);

          return (
            <Card.Root key={s.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Flex align="center" gap={2}>
                    <Badge size="xs" colorPalette="blue" fontFamily="mono">{s.supplierCode}</Badge>
                    <Badge size="xs" colorPalette={s.status === 'active' ? 'green' : 'gray'}>
                      {s.status.toUpperCase()}
                    </Badge>
                  </Flex>
                  <Heading size="md" color="#0f172a" mt={2} display="flex" alignItems="center" gap={2}>
                    <Building2 size={18} color="#2563eb" /> {s.companyName}
                  </Heading>
                  <Badge size="xs" colorPalette="purple" mt={1}>{s.category}</Badge>
                </Box>

                <Flex gap={1}>
                  <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setViewingSupplier(s)} title="View Profile">
                    <Eye size={13} />
                  </Button>
                  <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleOpenEdit(s)} title="Edit Vendor">
                    <Edit size={13} />
                  </Button>
                  {suppliers.length > 1 && (
                    <Button size="xs" variant="ghost" colorPalette="red" onClick={() => deleteSupplier(s.id)} title="Delete Vendor">
                      <Trash2 size={13} />
                    </Button>
                  )}
                </Flex>
              </Flex>

              <Stack gap={1.5} mt={3} fontSize="xs" color="#64748b">
                <Text>Contact: <Text as="span" fontWeight="semibold" color="#0f172a">{s.contactPerson}</Text></Text>
                <Flex align="center" gap={2}>
                  <Mail size={12} color="#94a3b8" />
                  <Text>{s.email}</Text>
                  <Text color="#94a3b8">•</Text>
                  <Phone size={12} color="#94a3b8" />
                  <Text>{s.phone}</Text>
                </Flex>
                <Flex align="center" gap={1.5}>
                  <MapPin size={12} color="#94a3b8" />
                  <Text truncate>{s.address}</Text>
                </Flex>
              </Stack>

              <SimpleGrid columns={2} gap={3} mt={4} pt={3} borderTop="1px dashed #e2e8f0">
                <Box bg="#f8fafc" p={2.5} borderRadius="10px">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Purchase Orders</Text>
                  <Text fontSize="md" fontWeight="bold" color="#0f172a" mt={0.5}>
                    {supplierPOs.length} Issued ({activeCompany.currency} {(totalCommitted / 1000).toFixed(1)}k)
                  </Text>
                </Box>
                <Box bg="#f8fafc" p={2.5} borderRadius="10px">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Payment Terms</Text>
                  <Text fontSize="xs" fontWeight="semibold" color="#0f172a" mt={1}>
                    {s.paymentTerms || 'Net 30 Days'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Card.Root>
          );
        })}
      </SimpleGrid>

      {/* Add / Edit Supplier Modal */}
      {(showAddModal || editingSupplier) && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="560px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>
              {editingSupplier ? 'Edit Vendor / Supplier Profile' : 'Register New Vendor / Supplier'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define supplier corporate details, contact officer, and procurement category.
            </Text>

            <form onSubmit={handleSave}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supplier Code *</Text>
                    <Input
                      size="sm"
                      value={formData.supplierCode}
                      onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Procurement Category *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Civil Aggregates & Cement">Civil Aggregates & Cement</option>
                        <option value="Structural Steel & Rebar">Structural Steel & Rebar</option>
                        <option value="Heavy Equipment & Spares">Heavy Equipment & Spares</option>
                        <option value="Safety & PPE">Safety & PPE</option>
                        <option value="Finishes & MEP">Finishes & MEP</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Company / Business Name *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Continental Steel Mills Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contact Person *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Alhaji Mansur Ibrahim"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Direct Phone *</Text>
                    <Input
                      size="sm"
                      placeholder="+234 803 111 8822"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Official Email *</Text>
                    <Input
                      type="email"
                      size="sm"
                      placeholder="sales@continentalsteel.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Payment Terms</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Net 30 Days"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Office / Depot Physical Address *</Text>
                  <Input
                    size="sm"
                    placeholder="Plot 12 Steel Industrial Layout, Ajaokuta / Ikeja"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => { setShowAddModal(false); setEditingSupplier(null); }}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    {editingSupplier ? 'Save Changes' : 'Register Vendor'}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* View Supplier Details Modal */}
      {viewingSupplier && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="700px" w="100%" p={6} boxShadow="2xl" maxH="85vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Flex align="center" gap={2}>
                  <Badge size="xs" colorPalette="blue" fontFamily="mono">{viewingSupplier.supplierCode}</Badge>
                  <Badge size="xs" colorPalette="purple">{viewingSupplier.category}</Badge>
                </Flex>
                <Heading size="md" color="#0f172a" mt={1}>{viewingSupplier.companyName}</Heading>
                <Text fontSize="xs" color="#64748b">Contact: {viewingSupplier.contactPerson} • {viewingSupplier.phone} • {viewingSupplier.email}</Text>
              </Box>
              <Button size="xs" variant="outline" onClick={() => setViewingSupplier(null)}>Close</Button>
            </Flex>

            <Heading size="xs" color="#334155" textTransform="uppercase" mb={2}>
              Linked Purchase Orders ({getPOsForSupplier(viewingSupplier.id).length})
            </Heading>
            {getPOsForSupplier(viewingSupplier.id).length === 0 ? (
              <Box p={4} textAlign="center" bg="#f8fafc" borderRadius="8px" fontSize="xs" color="#64748b" mb={4}>
                No purchase orders issued to this vendor yet.
              </Box>
            ) : (
              <Table.Root size="sm" variant="outline" mb={4}>
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">PO Number</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Project</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Order Date</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Amount</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getPOsForSupplier(viewingSupplier.id).map(po => (
                    <Table.Row key={po.id}>
                      <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">{po.poNumber}</Table.Cell>
                      <Table.Cell fontSize="xs">{po.projectName || 'General Site Stores'}</Table.Cell>
                      <Table.Cell fontSize="xs">{po.orderDate}</Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#16a34a">
                        {activeCompany.currency} {po.totalAmount.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Badge size="xs" colorPalette={po.status === 'received' ? 'green' : 'blue'}>
                          {po.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            <Heading size="xs" color="#334155" textTransform="uppercase" mb={2}>
              Goods Received Notes (GRN) Records ({getGRNsForSupplier(viewingSupplier.id).length})
            </Heading>
            {getGRNsForSupplier(viewingSupplier.id).length === 0 ? (
              <Box p={4} textAlign="center" bg="#f8fafc" borderRadius="8px" fontSize="xs" color="#64748b">
                No delivery receipt notes recorded for this vendor.
              </Box>
            ) : (
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">GRN Number</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">PO Ref</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Received Date</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Store Location</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">QC Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getGRNsForSupplier(viewingSupplier.id).map(g => (
                    <Table.Row key={g.id}>
                      <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">{g.grnNumber}</Table.Cell>
                      <Table.Cell fontSize="xs">{g.poNumber}</Table.Cell>
                      <Table.Cell fontSize="xs">{g.receivedDate}</Table.Cell>
                      <Table.Cell fontSize="xs">{g.warehouseName}</Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Badge size="xs" colorPalette={g.qcInspectionStatus === 'Passed' ? 'green' : 'orange'}>
                          {g.qcInspectionStatus}
                        </Badge>
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
