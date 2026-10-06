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
import { useERP } from '../../context/ERPContext';
import { InventoryItem } from '../../types';
import { WarehousesTab } from './components/WarehousesTab';
import { StockMovementsTab } from './components/StockMovementsTab';
import { CategoriesTab } from './components/CategoriesTab';
import { InventoryAuditTab } from './components/InventoryAuditTab';
import { InventoryReportsTab } from './components/InventoryReportsTab';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowDownUp,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Building2,
  Tag,
  History,
  FileSpreadsheet,
  Edit,
  Trash2,
  Eye,
  Sliders,
  CheckCircle2,
  PackageX,
  Download
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    inventoryCategories,
    warehouses,
    suppliers,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [activeTab, setActiveTab] = useState<'items' | 'warehouses' | 'movements' | 'categories' | 'audit' | 'reports'>('items');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  // Stock Adjustment Form
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState('Physical stock count reconciliation');
  const [adjustWarehouse, setAdjustWarehouse] = useState(warehouses[0]?.name || 'Main Yard Warehouse A');

  // Add Item Form
  const [itemForm, setItemForm] = useState({
    itemCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    categoryId: inventoryCategories[0]?.id || 1,
    categoryName: inventoryCategories[0]?.name || 'Cement & Aggregates',
    unit: 'Bags',
    supplierId: suppliers[0]?.id || 1,
    supplierName: suppliers[0]?.companyName || 'General Supplier Ltd',
    costPrice: 25,
    sellingPrice: 30,
    openingStock: 100,
    currentStock: 100,
    minLevel: 25,
    warehouseId: warehouses[0]?.id || 1,
    warehouseLocation: warehouses[0]?.name || 'Yard Warehouse A - Bay 1',
    description: ''
  });

  const totalValuation = inventory.reduce((acc, i) => acc + (i.currentStock * i.costPrice), 0);
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minLevel && i.currentStock > 0).length;
  const outOfStockCount = inventory.filter(i => i.currentStock <= 0).length;

  const filteredItems = inventory.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.categoryName === categoryFilter;
    const matchesWarehouse = warehouseFilter === 'All' || 
      item.warehouseLocation.toLowerCase().includes(warehouseFilter.toLowerCase());
    
    let matchesStatus = true;
    if (stockStatusFilter === 'low_stock') {
      matchesStatus = item.currentStock <= item.minLevel && item.currentStock > 0;
    } else if (stockStatusFilter === 'out_of_stock') {
      matchesStatus = item.currentStock <= 0;
    } else if (stockStatusFilter === 'in_stock') {
      matchesStatus = item.currentStock > item.minLevel;
    }

    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(q) ||
      item.itemCode.toLowerCase().includes(q) ||
      item.warehouseLocation.toLowerCase().includes(q) ||
      (item.supplierName && item.supplierName.toLowerCase().includes(q));

    return matchesCat && matchesWarehouse && matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setItemForm({
      itemCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      categoryId: inventoryCategories[0]?.id || 1,
      categoryName: inventoryCategories[0]?.name || 'Cement & Aggregates',
      unit: 'Bags',
      supplierId: suppliers[0]?.id || 1,
      supplierName: suppliers[0]?.companyName || 'General Supplier Ltd',
      costPrice: 25,
      sellingPrice: 30,
      openingStock: 100,
      currentStock: 100,
      minLevel: 25,
      warehouseId: warehouses[0]?.id || 1,
      warehouseLocation: warehouses[0]?.name || 'Yard Warehouse A - Bay 1',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;

    const cat = inventoryCategories.find(c => c.id === itemForm.categoryId);
    const wh = warehouses.find(w => w.id === itemForm.warehouseId);
    const sup = suppliers.find(s => s.id === itemForm.supplierId);

    addInventoryItem({
      ...itemForm,
      categoryName: cat?.name || itemForm.categoryName,
      warehouseLocation: wh?.name || itemForm.warehouseLocation,
      supplierName: sup?.companyName || itemForm.supplierName,
      costPrice: Number(itemForm.costPrice),
      sellingPrice: Number(itemForm.sellingPrice),
      openingStock: Number(itemForm.openingStock),
      currentStock: Number(itemForm.currentStock),
      minLevel: Number(itemForm.minLevel)
    });

    setShowAddModal(false);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      itemCode: item.itemCode,
      name: item.name,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      unit: item.unit,
      supplierId: item.supplierId || suppliers[0]?.id || 1,
      supplierName: item.supplierName || '',
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      openingStock: item.openingStock || item.currentStock,
      currentStock: item.currentStock,
      minLevel: item.minLevel,
      warehouseId: item.warehouseId || warehouses[0]?.id || 1,
      warehouseLocation: item.warehouseLocation,
      description: item.description || ''
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !itemForm.name.trim()) return;

    const cat = inventoryCategories.find(c => c.id === itemForm.categoryId);
    const wh = warehouses.find(w => w.id === itemForm.warehouseId);
    const sup = suppliers.find(s => s.id === itemForm.supplierId);

    updateInventoryItem(editingItem.id, {
      ...itemForm,
      categoryName: cat?.name || itemForm.categoryName,
      warehouseLocation: wh?.name || itemForm.warehouseLocation,
      supplierName: sup?.companyName || itemForm.supplierName,
      costPrice: Number(itemForm.costPrice),
      sellingPrice: Number(itemForm.sellingPrice),
      currentStock: Number(itemForm.currentStock),
      minLevel: Number(itemForm.minLevel)
    });

    setEditingItem(null);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    const delta = adjustType === 'add' ? adjustAmount : -adjustAmount;
    adjustStock(adjustItem.id, delta, adjustReason, adjustWarehouse);
    setAdjustItem(null);
  };

  const handleExportCSV = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'Unit', 'Current Stock', 'Min Level', 'Cost Price', 'Selling Price', 'Total Valuation', 'Location'];
    const rows = filteredItems.map(i => [
      i.itemCode,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.categoryName}"`,
      i.unit,
      i.currentStock,
      i.minLevel,
      i.costPrice,
      i.sellingPrice,
      (i.currentStock * i.costPrice).toFixed(2),
      `"${i.warehouseLocation}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={4}>
          <Box>
            <Flex align="center" gap={3}>
              <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
                <Boxes size={26} />
              </Box>
              <Box>
                <Heading size="lg" color="#0f172a" fontWeight="bold">
                  Stores & Material Inventory Management
                </Heading>
                <Text fontSize="xs" color="#64748b" mt={0.5}>
                  Warehouse stocking, inter-store transfers, minimum safety thresholds, and inventory valuation.
                </Text>
              </Box>
            </Flex>
          </Box>
          <Flex gap={2}>
            <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#334155" onClick={handleExportCSV}>
              <Download size={15} /> Export CSV
            </Button>
            <Button size="sm" colorPalette="blue" onClick={handleOpenAddModal} fontWeight="semibold">
              <Plus size={16} /> Add Material SKU
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      {/* KPI Metrics Row */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Stock Valuation</Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalValuation.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>{inventory.length} total active material SKUs</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Reorder Thresholds</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <AlertTriangle size={20} color="#dc2626" />
            <Text fontSize="xl" fontWeight="black" color="#dc2626">{lowStockCount} Items Low</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Below minimum safety buffer</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Out of Stock</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <PackageX size={20} color="#b91c1c" />
            <Text fontSize="xl" fontWeight="black" color="#b91c1c">{outOfStockCount} Depleted</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Requires immediate PO creation</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Active Storage Yards</Text>
          <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>{warehouses.length} Facilities</Text>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Central Yards & Site Camps</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Main Tabs Navigation */}
      <Flex borderBottom="2px solid #e2e8f0" gap={4} overflowX="auto" pb="1px">
        {[
          { id: 'items', label: `Inventory Catalog (${inventory.length})` },
          { id: 'warehouses', label: `Warehouses & Yards (${warehouses.length})` },
          { id: 'movements', label: 'Stock Movements & Transfers' },
          { id: 'categories', label: `Categories (${inventoryCategories.length})` },
          { id: 'audit', label: 'Audit Trail & Changes' },
          { id: 'reports', label: 'Valuation & Low-Stock Reports' }
        ].map((tab) => (
          <Box
            key={tab.id}
            as="button"
            pb={3}
            fontSize="sm"
            fontWeight={activeTab === tab.id ? 'bold' : 'medium'}
            color={activeTab === tab.id ? '#2563eb' : '#64748b'}
            borderBottom={activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent'}
            cursor="pointer"
            whiteSpace="nowrap"
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </Box>
        ))}
      </Flex>

      {/* TAB 1: INVENTORY ITEMS */}
      {activeTab === 'items' && (
        <Stack gap={4}>
          {/* Search & Multi-Filter Bar */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ lg: 'center' }} gap={3}>
              <Box maxW={{ base: '100%', lg: '340px' }} w="100%">
                <Flex align="center" bg="#f8fafc" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
                  <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input 
                    placeholder="Search SKU, material name, or location..." 
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
                      <option value="All">All Categories</option>
                      {inventoryCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>

                <Flex align="center" gap={1.5}>
                  <Text fontSize="xs" color="#64748b" fontWeight="medium">Warehouse:</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={warehouseFilter}
                      onChange={(e) => setWarehouseFilter(e.target.value)}
                      bg="white"
                      borderColor="#cbd5e1"
                    >
                      <option value="All">All Warehouses</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.name}>{w.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>

                <Flex align="center" gap={1.5}>
                  <Text fontSize="xs" color="#64748b" fontWeight="medium">Stock Status:</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={stockStatusFilter}
                      onChange={(e) => setStockStatusFilter(e.target.value as any)}
                      bg="white"
                      borderColor="#cbd5e1"
                    >
                      <option value="all">All Statuses</option>
                      <option value="in_stock">In Stock (Normal)</option>
                      <option value="low_stock">Low Stock Warning</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              </Flex>
            </Flex>
          </Card.Root>

          {/* Table */}
          <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
            <Box overflowX="auto">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">SKU Code</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Material Description</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Category</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Stock On Hand</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Min Buffer Limit</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Unit Cost</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Total Valuation</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Storage Facility</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredItems.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={9} textAlign="center" py={8} color="#64748b" fontSize="xs">
                        No materials found matching current search and filter criteria.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredItems.map((item) => {
                      const isLow = item.currentStock <= item.minLevel && item.currentStock > 0;
                      const isOut = item.currentStock <= 0;
                      const lineValuation = item.currentStock * item.costPrice;

                      return (
                        <Table.Row key={item.id} _hover={{ bg: '#f8fafc' }}>
                          <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">
                            {item.itemCode}
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Text fontWeight="semibold" color="#0f172a">{item.name}</Text>
                            {item.supplierName && (
                              <Text fontSize="10px" color="#94a3b8">Supplier: {item.supplierName}</Text>
                            )}
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Badge size="xs" colorPalette="blue">{item.categoryName}</Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Flex align="center" gap={1.5}>
                              <Text fontWeight="bold" color={isOut ? '#dc2626' : isLow ? '#d97706' : '#0f172a'}>
                                {item.currentStock} {item.unit}
                              </Text>
                              {isOut && <Badge size="xs" colorPalette="red">DEPLETED</Badge>}
                              {isLow && <Badge size="xs" colorPalette="orange">LOW</Badge>}
                            </Flex>
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="#64748b">
                            {item.minLevel} {item.unit}
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            {activeCompany.currency} {item.costPrice.toFixed(2)}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" fontWeight="bold" color="#16a34a">
                            {activeCompany.currency} {lineValuation.toLocaleString()}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="#475569" maxW="160px">
                            <Flex align="center" gap={1}>
                              <MapPin size={12} color="#94a3b8" />
                              <Text truncate>{item.warehouseLocation}</Text>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell fontSize="xs" textAlign="right">
                            <Flex justify="flex-end" gap={1}>
                              <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setViewingItem(item)} title="View Item Details">
                                <Eye size={13} />
                              </Button>
                              <Button size="xs" variant="ghost" colorPalette="purple" onClick={() => { setAdjustItem(item); setAdjustAmount(10); }} title="Adjust Stock">
                                <Sliders size={13} />
                              </Button>
                              <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleOpenEdit(item)} title="Edit SKU">
                                <Edit size={13} />
                              </Button>
                              <Button size="xs" variant="ghost" colorPalette="red" onClick={() => deleteInventoryItem(item.id)} title="Delete / Archive SKU">
                                <Trash2 size={13} />
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
        </Stack>
      )}

      {/* TAB 2: WAREHOUSES & YARDS */}
      {activeTab === 'warehouses' && (
        <WarehousesTab onInitiateTransfer={() => setActiveTab('movements')} />
      )}

      {/* TAB 3: STOCK MOVEMENTS & TRANSFERS */}
      {activeTab === 'movements' && (
        <StockMovementsTab />
      )}

      {/* TAB 4: CATEGORIES */}
      {activeTab === 'categories' && (
        <CategoriesTab />
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <InventoryAuditTab />
      )}

      {/* TAB 6: REPORTS */}
      {activeTab === 'reports' && (
        <InventoryReportsTab />
      )}

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>Register New Material SKU</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define catalog item code, unit rate, safety buffer threshold, and warehouse location.
            </Text>

            <form onSubmit={handleCreateItem}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material SKU Code *</Text>
                    <Input
                      size="sm"
                      value={itemForm.itemCode}
                      onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.categoryId}
                        onChange={(e) => setItemForm({ ...itemForm, categoryId: Number(e.target.value) })}
                      >
                        {inventoryCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material / Item Name *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Ordinary Portland Cement Grade 42.5N"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={3} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit of Measure *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.unit}
                        onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                      >
                        <option value="Bags">Bags</option>
                        <option value="Tons">Tons</option>
                        <option value="Pieces">Pieces</option>
                        <option value="Litres">Litres</option>
                        <option value="Meters">Meters</option>
                        <option value="Units">Units</option>
                        <option value="Bundles">Bundles</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Stock Qty</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={0}
                      value={itemForm.currentStock}
                      onChange={(e) => setItemForm({ ...itemForm, currentStock: Number(e.target.value), openingStock: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Min Buffer Threshold</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      value={itemForm.minLevel}
                      onChange={(e) => setItemForm({ ...itemForm, minLevel: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Cost Price ({activeCompany.currency}) *</Text>
                    <Input
                      type="number"
                      step="any"
                      size="sm"
                      value={itemForm.costPrice}
                      onChange={(e) => setItemForm({ ...itemForm, costPrice: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Selling / Transfer Price ({activeCompany.currency})</Text>
                    <Input
                      type="number"
                      step="any"
                      size="sm"
                      value={itemForm.sellingPrice}
                      onChange={(e) => setItemForm({ ...itemForm, sellingPrice: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Warehouse *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.warehouseId}
                        onChange={(e) => setItemForm({ ...itemForm, warehouseId: Number(e.target.value) })}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Default Supplier</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.supplierId}
                        onChange={(e) => setItemForm({ ...itemForm, supplierId: Number(e.target.value) })}
                      >
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.companyName}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Register Material SKU
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>Edit Material SKU Specifications</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Updating item details automatically writes to the persistent audit change trail.
            </Text>

            <form onSubmit={handleSaveEdit}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material SKU Code</Text>
                    <Input
                      size="sm"
                      value={itemForm.itemCode}
                      onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.categoryId}
                        onChange={(e) => setItemForm({ ...itemForm, categoryId: Number(e.target.value) })}
                      >
                        {inventoryCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material Name *</Text>
                  <Input
                    size="sm"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={3} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit</Text>
                    <Input
                      size="sm"
                      value={itemForm.unit}
                      onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Current Stock</Text>
                    <Input
                      type="number"
                      size="sm"
                      value={itemForm.currentStock}
                      onChange={(e) => setItemForm({ ...itemForm, currentStock: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Min Buffer Threshold</Text>
                    <Input
                      type="number"
                      size="sm"
                      value={itemForm.minLevel}
                      onChange={(e) => setItemForm({ ...itemForm, minLevel: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Cost Price ({activeCompany.currency})</Text>
                    <Input
                      type="number"
                      step="any"
                      size="sm"
                      value={itemForm.costPrice}
                      onChange={(e) => setItemForm({ ...itemForm, costPrice: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Storage Facility</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={itemForm.warehouseId}
                        onChange={(e) => setItemForm({ ...itemForm, warehouseId: Number(e.target.value) })}
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Save Changes
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* ADJUST STOCK MODAL */}
      {adjustItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Physical Stock Adjustment
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Adjusting stock for: <Text as="span" fontWeight="bold" color="#0f172a">{adjustItem.name} ({adjustItem.itemCode})</Text>
            </Text>

            <Box p={3} mb={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" fontSize="xs">
              <Flex justify="space-between">
                <Text color="#64748b">Current Stock Level:</Text>
                <Text fontWeight="bold" color="#0f172a">{adjustItem.currentStock} {adjustItem.unit}</Text>
              </Flex>
              <Flex justify="space-between" mt={1}>
                <Text color="#64748b">Resulting Stock Level:</Text>
                <Text fontWeight="bold" color={adjustType === 'add' ? '#16a34a' : '#dc2626'}>
                  {adjustType === 'add' ? adjustItem.currentStock + adjustAmount : Math.max(0, adjustItem.currentStock - adjustAmount)} {adjustItem.unit}
                </Text>
              </Flex>
            </Box>

            <form onSubmit={handleApplyAdjustment}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Operation</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as any)}
                      >
                        <option value="add">Add Stock (Surplus / Recovery)</option>
                        <option value="subtract">Deduct Stock (Damage / Discrepancy)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity ({adjustItem.unit}) *</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Reason / Audit Note *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Broken bags identified during physical warehouse count"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Warehouse Location</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={adjustWarehouse}
                      onChange={(e) => setAdjustWarehouse(e.target.value)}
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.name}>{w.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setAdjustItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette={adjustType === 'add' ? 'green' : 'red'} type="submit">
                    Confirm Stock Adjustment
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* VIEW ITEM MODAL */}
      {viewingItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Badge size="xs" colorPalette="blue" fontFamily="mono">{viewingItem.itemCode}</Badge>
                <Heading size="md" color="#0f172a" mt={1}>{viewingItem.name}</Heading>
                <Text fontSize="xs" color="#64748b">{viewingItem.categoryName}</Text>
              </Box>
              <Button size="xs" variant="outline" onClick={() => setViewingItem(null)}>Close</Button>
            </Flex>

            <SimpleGrid columns={2} gap={3} mb={4}>
              <Box bg="#f8fafc" p={3} borderRadius="10px">
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Current Stock</Text>
                <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                  {viewingItem.currentStock} {viewingItem.unit}
                </Text>
                <Text fontSize="10px" color="#94a3b8">Min Threshold: {viewingItem.minLevel} {viewingItem.unit}</Text>
              </Box>

              <Box bg="#f8fafc" p={3} borderRadius="10px">
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Total Valuation</Text>
                <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                  {activeCompany.currency} {(viewingItem.currentStock * viewingItem.costPrice).toLocaleString()}
                </Text>
                <Text fontSize="10px" color="#64748b">Unit Cost: {activeCompany.currency}{viewingItem.costPrice.toFixed(2)}</Text>
              </Box>
            </SimpleGrid>

            <Stack gap={2} fontSize="xs" borderTop="1px dashed #e2e8f0" pt={3}>
              <Flex justify="space-between">
                <Text color="#64748b">Storage Yard / Bay:</Text>
                <Text fontWeight="semibold" color="#0f172a">{viewingItem.warehouseLocation}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Preferred Supplier:</Text>
                <Text fontWeight="semibold" color="#0f172a">{viewingItem.supplierName || 'N/A'}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Selling / Transfer Rate:</Text>
                <Text fontWeight="semibold" color="#0f172a">{activeCompany.currency} {viewingItem.sellingPrice.toFixed(2)}</Text>
              </Flex>
            </Stack>

            <Flex justify="flex-end" gap={2} mt={5}>
              <Button size="sm" variant="subtle" colorPalette="blue" onClick={() => { const item = viewingItem; setViewingItem(null); handleOpenEdit(item); }}>
                Edit Material Specifications
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
