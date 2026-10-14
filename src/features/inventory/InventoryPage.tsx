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
import { InventoryItem, Supplier } from '../../types';
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
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  PackagePlus,
  PackageMinus,
  Check,
  X,
  Truck,
  User,
  Users,
  FileText
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    receiveStock,
    issueStock,
    inventoryCategories,
    warehouses,
    suppliers,
    addSupplier,
    projects,
    employees,
    departments,
    requisitions,
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

  // Receive Stock Modal State
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    itemId: inventory[0]?.id || 1,
    quantity: 50,
    date: new Date().toISOString().split('T')[0],
    supplierMode: 'existing' as 'existing' | 'new' | 'none',
    supplierId: suppliers[0]?.id || 1,
    newSupplierName: '',
    newSupplierContact: '',
    newSupplierPhone: '',
    newSupplierEmail: '',
    newSupplierAddress: '',
    newSupplierCategory: 'Building Materials',
    warehouseId: warehouses[0]?.id || 1,
    warehouseName: warehouses[0]?.name || 'Main Yard Warehouse A',
    referenceNumber: '',
    notes: ''
  });
  const [receiveFeedback, setReceiveFeedback] = useState<string | null>(null);

  // Issue Stock Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({
    itemId: inventory[0]?.id || 1,
    quantity: 10,
    destinationType: 'project' as 'project' | 'site' | 'warehouse' | 'department' | 'employee',
    projectId: projects[0]?.id || 1,
    targetWarehouseId: warehouses[1]?.id || warehouses[0]?.id || 1,
    department: 'Civil Engineering & Construction',
    employeeId: employees[0]?.id || 1,
    recipientName: employees[0]?.name || currentUserName,
    destinationDetails: '',
    requisitionId: 'none',
    date: new Date().toISOString().split('T')[0],
    purpose: 'Direct site installation for ongoing slab casting',
    referenceNumber: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: ''
  });
  const [issueFeedback, setIssueFeedback] = useState<string | null>(null);

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
    supplierMode: 'existing' as 'none' | 'existing' | 'new',
    supplierId: suppliers[0]?.id || 1,
    supplierName: suppliers[0]?.companyName || 'General Supplier Ltd',
    newSupplierName: '',
    newSupplierContact: '',
    newSupplierPhone: '',
    newSupplierEmail: '',
    newSupplierAddress: '',
    newSupplierCategory: 'Building Materials',
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
    if (!item) return false;
    const matchesCat = categoryFilter === 'All' || item.categoryName === categoryFilter;
    const itemLoc = (item.warehouseLocation || '').toLowerCase();
    const matchesWarehouse = warehouseFilter === 'All' || 
      itemLoc.includes((warehouseFilter || '').toLowerCase());
    
    let matchesStatus = true;
    if (stockStatusFilter === 'low_stock') {
      matchesStatus = item.currentStock <= item.minLevel && item.currentStock > 0;
    } else if (stockStatusFilter === 'out_of_stock') {
      matchesStatus = item.currentStock <= 0;
    } else if (stockStatusFilter === 'in_stock') {
      matchesStatus = item.currentStock > item.minLevel;
    }

    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = 
      !q ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(q)) ||
      itemLoc.includes(q) ||
      Boolean(item.supplierName && item.supplierName.toLowerCase().includes(q));

    return matchesCat && matchesWarehouse && matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setItemForm({
      itemCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      categoryId: inventoryCategories[0]?.id || 1,
      categoryName: inventoryCategories[0]?.name || 'Cement & Aggregates',
      unit: 'Bags',
      supplierMode: 'existing',
      supplierId: suppliers[0]?.id || 1,
      supplierName: suppliers[0]?.companyName || 'General Supplier Ltd',
      newSupplierName: '',
      newSupplierContact: '',
      newSupplierPhone: '',
      newSupplierEmail: '',
      newSupplierAddress: '',
      newSupplierCategory: 'Building Materials',
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

    let effectiveSupplierId: number | undefined = undefined;
    let effectiveSupplierName: string | undefined = undefined;
    let supplierContact: string | undefined = undefined;
    let supplierPhone: string | undefined = undefined;
    let supplierEmail: string | undefined = undefined;
    let supplierAddress: string | undefined = undefined;

    if (itemForm.supplierMode === 'existing') {
      const sup = suppliers.find(s => s.id === itemForm.supplierId);
      if (sup) {
        effectiveSupplierId = sup.id;
        effectiveSupplierName = sup.companyName;
        supplierContact = sup.contactPerson;
        supplierPhone = sup.phone;
        supplierEmail = sup.email;
        supplierAddress = sup.address;
      }
    } else if (itemForm.supplierMode === 'new' && itemForm.newSupplierName.trim()) {
      const existingSup = suppliers.find(
        s => s.companyName.trim().toLowerCase() === itemForm.newSupplierName.trim().toLowerCase()
      );

      if (existingSup) {
        effectiveSupplierId = existingSup.id;
        effectiveSupplierName = existingSup.companyName;
        supplierContact = existingSup.contactPerson;
        supplierPhone = existingSup.phone;
        supplierEmail = existingSup.email;
        supplierAddress = existingSup.address;
      } else {
        const createdSup = addSupplier({
          supplierCode: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
          companyName: itemForm.newSupplierName.trim(),
          contactPerson: itemForm.newSupplierContact.trim() || 'Purchasing Contact',
          phone: itemForm.newSupplierPhone.trim() || '+234 800 000 0000',
          email: itemForm.newSupplierEmail.trim() || 'sales@supplier.com',
          address: itemForm.newSupplierAddress.trim() || 'Industrial Estate',
          category: itemForm.newSupplierCategory || 'Building Materials',
          balance: 0,
          status: 'active'
        });
        effectiveSupplierId = createdSup.id;
        effectiveSupplierName = createdSup.companyName;
        supplierContact = createdSup.contactPerson;
        supplierPhone = createdSup.phone;
        supplierEmail = createdSup.email;
        supplierAddress = createdSup.address;
      }
    }

    addInventoryItem({
      itemCode: itemForm.itemCode,
      name: itemForm.name.trim(),
      categoryId: itemForm.categoryId,
      categoryName: cat?.name || itemForm.categoryName,
      unit: itemForm.unit,
      supplierId: effectiveSupplierId,
      supplierName: effectiveSupplierName,
      supplierContact,
      supplierPhone,
      supplierEmail,
      supplierAddress,
      warehouseId: itemForm.warehouseId,
      warehouseLocation: wh?.name || itemForm.warehouseLocation,
      costPrice: Number(itemForm.costPrice),
      sellingPrice: Number(itemForm.sellingPrice),
      openingStock: Number(itemForm.openingStock),
      currentStock: Number(itemForm.currentStock),
      minLevel: Number(itemForm.minLevel),
      description: itemForm.description
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
      supplierMode: item.supplierId ? 'existing' : 'none',
      supplierId: item.supplierId || suppliers[0]?.id || 1,
      supplierName: item.supplierName || '',
      newSupplierName: '',
      newSupplierContact: '',
      newSupplierPhone: '',
      newSupplierEmail: '',
      newSupplierAddress: '',
      newSupplierCategory: 'Building Materials',
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

  // Stock Adjustment Handler
  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    const delta = adjustType === 'add' ? adjustAmount : -adjustAmount;
    adjustStock(adjustItem.id, delta, adjustReason, adjustWarehouse);
    setAdjustItem(null);
  };

  // Receive Stock Handlers
  const handleOpenReceiveModal = () => {
    setReceiveFeedback(null);
    setReceiveForm({
      itemId: inventory[0]?.id || 1,
      quantity: 50,
      date: new Date().toISOString().split('T')[0],
      supplierMode: 'existing',
      supplierId: suppliers[0]?.id || 1,
      newSupplierName: '',
      newSupplierContact: '',
      newSupplierPhone: '',
      newSupplierEmail: '',
      newSupplierAddress: '',
      newSupplierCategory: 'Building Materials',
      warehouseId: warehouses[0]?.id || 1,
      warehouseName: warehouses[0]?.name || 'Main Yard Warehouse A',
      referenceNumber: `GRN-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'Direct vendor shipment delivery accepted after QC physical check'
    });
    setShowReceiveModal(true);
  };

  const handleOpenReceiveForItem = (item: InventoryItem) => {
    setReceiveFeedback(null);
    setReceiveForm({
      itemId: item.id,
      quantity: 50,
      date: new Date().toISOString().split('T')[0],
      supplierMode: item.supplierId ? 'existing' : 'none',
      supplierId: item.supplierId || suppliers[0]?.id || 1,
      newSupplierName: '',
      newSupplierContact: '',
      newSupplierPhone: '',
      newSupplierEmail: '',
      newSupplierAddress: '',
      newSupplierCategory: item.categoryName || 'Building Materials',
      warehouseId: item.warehouseId || warehouses[0]?.id || 1,
      warehouseName: item.warehouseLocation || warehouses[0]?.name || 'Main Yard Warehouse A',
      referenceNumber: `GRN-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Replenishment delivery of ${item.name}`
    });
    setShowReceiveModal(true);
  };

  const handleExecuteReceive = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiveFeedback(null);

    if (receiveForm.quantity <= 0) {
      setReceiveFeedback('Received quantity must be greater than zero.');
      return;
    }

    const wh = warehouses.find(w => w.id === receiveForm.warehouseId);
    let sName: string | undefined = undefined;
    if (receiveForm.supplierMode === 'existing') {
      const s = suppliers.find(sup => sup.id === receiveForm.supplierId);
      sName = s?.companyName;
    } else if (receiveForm.supplierMode === 'new') {
      sName = receiveForm.newSupplierName.trim();
    }

    const res = receiveStock({
      itemId: receiveForm.itemId,
      quantity: Number(receiveForm.quantity),
      date: receiveForm.date,
      supplierMode: receiveForm.supplierMode,
      supplierId: receiveForm.supplierId,
      supplierName: sName,
      newSupplier: receiveForm.supplierMode === 'new' ? {
        companyName: receiveForm.newSupplierName.trim(),
        contactPerson: receiveForm.newSupplierContact,
        phone: receiveForm.newSupplierPhone,
        email: receiveForm.newSupplierEmail,
        address: receiveForm.newSupplierAddress,
        category: receiveForm.newSupplierCategory
      } : undefined,
      warehouseId: receiveForm.warehouseId,
      warehouseName: wh?.name || receiveForm.warehouseName,
      referenceNumber: receiveForm.referenceNumber,
      notes: receiveForm.notes
    });

    if (res.success) {
      setShowReceiveModal(false);
    } else {
      setReceiveFeedback(res.error || 'Failed to record stock receipt.');
    }
  };

  // Issue Stock Handlers
  const handleOpenIssueModal = () => {
    setIssueFeedback(null);
    setIssueForm({
      itemId: inventory[0]?.id || 1,
      quantity: 10,
      destinationType: 'project',
      projectId: projects[0]?.id || 1,
      targetWarehouseId: warehouses[1]?.id || warehouses[0]?.id || 1,
      department: 'Civil Engineering & Construction',
      employeeId: employees[0]?.id || 1,
      recipientName: employees[0]?.name || currentUserName,
      destinationDetails: 'Zone B Pier Cap casting works',
      requisitionId: 'none',
      date: new Date().toISOString().split('T')[0],
      purpose: 'Mobilization of materials for planned site pour',
      referenceNumber: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'Store gate pass issued with delivery slip'
    });
    setShowIssueModal(true);
  };

  const handleOpenIssueForItem = (item: InventoryItem) => {
    setIssueFeedback(null);
    setIssueForm({
      itemId: item.id,
      quantity: Math.min(10, Math.max(1, item.currentStock)),
      destinationType: 'project',
      projectId: projects[0]?.id || 1,
      targetWarehouseId: warehouses[1]?.id || warehouses[0]?.id || 1,
      department: 'Civil Engineering & Construction',
      employeeId: employees[0]?.id || 1,
      recipientName: employees[0]?.name || currentUserName,
      destinationDetails: 'Active Site Works',
      requisitionId: 'none',
      date: new Date().toISOString().split('T')[0],
      purpose: `Site issuance of ${item.name}`,
      referenceNumber: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Direct store withdrawal of ${item.name}`
    });
    setShowIssueModal(true);
  };

  const handleExecuteIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueFeedback(null);

    const targetItem = inventory.find(i => i.id === issueForm.itemId);
    if (!targetItem) {
      setIssueFeedback('Selected item not found.');
      return;
    }

    if (issueForm.quantity <= 0) {
      setIssueFeedback('Issued quantity must be greater than zero.');
      return;
    }

    if (issueForm.quantity > targetItem.currentStock) {
      setIssueFeedback(`Cannot issue ${issueForm.quantity} ${targetItem.unit}. Only ${targetItem.currentStock} ${targetItem.unit} is available in stock.`);
      return;
    }

    const prj = projects.find(p => p.id === issueForm.projectId);
    const tgtWh = warehouses.find(w => w.id === issueForm.targetWarehouseId);
    const emp = employees.find(e => e.id === issueForm.employeeId);

    const linkedReq = issueForm.requisitionId !== 'none'
      ? requisitions.find(r => r.id === Number(issueForm.requisitionId))
      : undefined;

    const res = issueStock({
      itemId: issueForm.itemId,
      quantity: Number(issueForm.quantity),
      destinationType: issueForm.destinationType,
      projectId: issueForm.destinationType === 'project' || issueForm.destinationType === 'site' ? issueForm.projectId : undefined,
      projectName: prj?.name,
      targetWarehouseId: issueForm.destinationType === 'warehouse' ? issueForm.targetWarehouseId : undefined,
      targetWarehouseName: tgtWh?.name,
      department: issueForm.destinationType === 'department' ? issueForm.department : undefined,
      employeeId: issueForm.destinationType === 'employee' ? issueForm.employeeId : undefined,
      employeeName: emp?.name,
      destinationDetails: issueForm.destinationDetails,
      recipientName: issueForm.recipientName,
      date: issueForm.date,
      purpose: issueForm.purpose,
      referenceNumber: issueForm.referenceNumber,
      notes: issueForm.notes,
      requisitionId: linkedReq?.id,
      requisitionNo: linkedReq?.requisitionNo
    });

    if (res.success) {
      setShowIssueModal(false);
    } else {
      setIssueFeedback(res.error || 'Failed to issue stock.');
    }
  };

  // Selected item info for issue validation
  const currentItemForIssue = inventory.find(i => i.id === issueForm.itemId);
  const isIssueQtyExceeded = currentItemForIssue ? issueForm.quantity > currentItemForIssue.currentStock : false;

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

  // Approved requisitions for linking
  const approvedRequisitions = requisitions.filter(r =>
    r.status === 'Approved' || r.status === 'Partially Approved' || r.status === 'Ready for Dispatch'
  );

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ lg: 'center' }} gap={4}>
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
                  Warehouse stocking, stock receipts, issuance to projects, inter-store transfers, and inventory movements.
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Primary Operations Actions */}
          <Flex gap={2} flexWrap="wrap">
            <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#334155" onClick={handleExportCSV}>
              <Download size={15} /> Export CSV
            </Button>
            <Button size="sm" colorPalette="green" onClick={handleOpenReceiveModal} fontWeight="semibold">
              <ArrowDownLeft size={16} /> Receive Stock (GRN)
            </Button>
            <Button size="sm" colorPalette="blue" onClick={handleOpenIssueModal} fontWeight="semibold">
              <ArrowUpRight size={16} /> Issue Stock (Outward)
            </Button>
            <Button size="sm" colorPalette="purple" onClick={handleOpenAddModal} fontWeight="semibold">
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
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Urgent replenishment needed</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Storage Facilities</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <Building2 size={20} color="#2563eb" />
            <Text fontSize="xl" fontWeight="black" color="#2563eb">{warehouses.length} Active Yards</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>{suppliers.length} registered suppliers</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Tabs Navigation */}
      <Flex borderBottom="2px solid #e2e8f0" gap={4} overflowX="auto" pb="1px">
        {[
          { id: 'items', label: `Stock Catalog (${inventory.length})` },
          { id: 'warehouses', label: `Warehouses & Yards (${warehouses.length})` },
          { id: 'movements', label: 'Stock Movements Ledger' },
          { id: 'categories', label: `Categories (${inventoryCategories.length})` },
          { id: 'audit', label: 'Audit Trail' },
          { id: 'reports', label: 'Inventory Valuation' }
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

      {/* TAB 1: STOCK CATALOG */}
      {activeTab === 'items' && (
        <Stack gap={4}>
          {/* Search & Filter Toolbar */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Box maxW="380px" w="100%">
                <Flex align="center" bg="#f8fafc" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
                  <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input
                    placeholder="Search SKU code, material name, or supplier..."
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
                    >
                      <option value="All">All Categories</option>
                      {inventoryCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
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
                    >
                      <option value="All">All Warehouses</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.name}>{w.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>

                <Flex align="center" gap={1.5}>
                  <Text fontSize="xs" color="#64748b" fontWeight="medium">Threshold:</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={stockStatusFilter}
                      onChange={(e) => setStockStatusFilter(e.target.value as any)}
                      bg="white"
                    >
                      <option value="all">All Levels</option>
                      <option value="in_stock">Healthy Stock</option>
                      <option value="low_stock">Low Stock Alert</option>
                      <option value="out_of_stock">Depleted</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              </Flex>
            </Flex>
          </Card.Root>

          {/* Items Table */}
          <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
            <Box overflowX="auto">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">SKU Code</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Item Name & Preferred Supplier</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Category</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">In Stock</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Safety Buffer</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Unit Cost</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Total Valuation</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Storage Location</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredItems.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={9} textAlign="center" py={8} color="#64748b" fontSize="xs">
                        No materials found matching your current filter.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredItems.map((item) => {
                      const isLow = item.currentStock <= item.minLevel && item.currentStock > 0;
                      const isOut = item.currentStock <= 0;
                      const lineValuation = item.currentStock * item.costPrice;

                      return (
                        <Table.Row key={item.id} _hover={{ bg: '#f8fafc' }}>
                          <Table.Cell fontSize="xs">
                            <Badge size="xs" colorPalette="blue" fontFamily="mono">{item.itemCode}</Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Text fontWeight="semibold" color="#0f172a">{item.name}</Text>
                            {item.supplierName ? (
                              <Text fontSize="10px" color="#64748b">Supplier: {item.supplierName}</Text>
                            ) : (
                              <Text fontSize="10px" color="#94a3b8">No default supplier</Text>
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
                              <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="green"
                                onClick={() => handleOpenReceiveForItem(item)}
                                title="Receive stock into stores"
                              >
                                <ArrowDownLeft size={13} /> Receive
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="blue"
                                onClick={() => handleOpenIssueForItem(item)}
                                title="Issue stock to site, department or project"
                              >
                                <ArrowUpRight size={13} /> Issue
                              </Button>
                              <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setViewingItem(item)} title="View Item Details">
                                <Eye size={13} />
                              </Button>
                              <Button size="xs" variant="ghost" colorPalette="purple" onClick={() => { setAdjustItem(item); setAdjustAmount(10); }} title="Physical Adjust">
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

      {/* RECEIVE STOCK MODAL (GRN / INWARD) */}
      {showReceiveModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Box p={2} bg="#f0fdf4" color="#16a34a" borderRadius="8px">
                  <ArrowDownLeft size={20} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">Record Incoming Stock (GRN Receipt)</Heading>
                  <Text fontSize="xs" color="#64748b">
                    Log incoming delivery from vendor or yard. Balance updates automatically.
                  </Text>
                </Box>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setShowReceiveModal(false)}>
                <X size={16} />
              </Button>
            </Flex>

            {receiveFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {receiveFeedback}
              </Box>
            )}

            <form onSubmit={handleExecuteReceive}>
              <Stack gap={3} mt={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Material SKU *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={receiveForm.itemId}
                      onChange={(e) => setReceiveForm({ ...receiveForm, itemId: Number(e.target.value) })}
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.itemCode} - {inv.name} (Current: {inv.currentStock} {inv.unit} in {inv.warehouseLocation})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity Received *</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      value={receiveForm.quantity}
                      onChange={(e) => setReceiveForm({ ...receiveForm, quantity: Math.max(1, Number(e.target.value)) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Date Received *</Text>
                    <Input
                      type="date"
                      size="sm"
                      value={receiveForm.date}
                      onChange={(e) => setReceiveForm({ ...receiveForm, date: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Receiving Warehouse / Location *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={receiveForm.warehouseId}
                      onChange={(e) => {
                        const wh = warehouses.find(w => w.id === Number(e.target.value));
                        setReceiveForm({ ...receiveForm, warehouseId: Number(e.target.value), warehouseName: wh?.name || '' });
                      }}
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                {/* Source or Supplier Mode */}
                <Card.Root bg="#f8fafc" p={3.5} borderRadius="10px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={2}>Source / Supplier Origin</Text>
                  <SimpleGrid columns={3} gap={2} mb={3}>
                    <Button
                      type="button"
                      size="xs"
                      variant={receiveForm.supplierMode === 'existing' ? 'solid' : 'outline'}
                      colorPalette={receiveForm.supplierMode === 'existing' ? 'blue' : 'gray'}
                      onClick={() => setReceiveForm({ ...receiveForm, supplierMode: 'existing' })}
                    >
                      Existing Supplier
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={receiveForm.supplierMode === 'new' ? 'solid' : 'outline'}
                      colorPalette={receiveForm.supplierMode === 'new' ? 'blue' : 'gray'}
                      onClick={() => setReceiveForm({ ...receiveForm, supplierMode: 'new' })}
                    >
                      + New Supplier
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={receiveForm.supplierMode === 'none' ? 'solid' : 'outline'}
                      colorPalette={receiveForm.supplierMode === 'none' ? 'blue' : 'gray'}
                      onClick={() => setReceiveForm({ ...receiveForm, supplierMode: 'none' })}
                    >
                      Other / Yard Transfer
                    </Button>
                  </SimpleGrid>

                  {receiveForm.supplierMode === 'existing' && (
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={receiveForm.supplierId}
                        onChange={(e) => setReceiveForm({ ...receiveForm, supplierId: Number(e.target.value) })}
                      >
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.companyName} ({s.category})</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  )}

                  {receiveForm.supplierMode === 'new' && (
                    <Stack gap={2}>
                      <Input
                        size="sm"
                        placeholder="Supplier Company Name *"
                        value={receiveForm.newSupplierName}
                        onChange={(e) => setReceiveForm({ ...receiveForm, newSupplierName: e.target.value })}
                        required
                      />
                      <SimpleGrid columns={2} gap={2}>
                        <Input
                          size="xs"
                          placeholder="Contact Person (e.g. Sales Rep)"
                          value={receiveForm.newSupplierContact}
                          onChange={(e) => setReceiveForm({ ...receiveForm, newSupplierContact: e.target.value })}
                        />
                        <Input
                          size="xs"
                          placeholder="Phone Number"
                          value={receiveForm.newSupplierPhone}
                          onChange={(e) => setReceiveForm({ ...receiveForm, newSupplierPhone: e.target.value })}
                        />
                      </SimpleGrid>
                    </Stack>
                  )}
                </Card.Root>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Document / Waybill Ref</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. WB-9942 or INV-882"
                      value={receiveForm.referenceNumber}
                      onChange={(e) => setReceiveForm({ ...receiveForm, referenceNumber: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes / Inspection Remarks</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Bags intact, seal verified"
                      value={receiveForm.notes}
                      onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowReceiveModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="green" type="submit">
                    Post Stock Receipt
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* ISSUE STOCK MODAL (OUTWARD ALLOCATION) */}
      {showIssueModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="640px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                  <ArrowUpRight size={20} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">Issue Stock (Outward Allocation)</Heading>
                  <Text fontSize="xs" color="#64748b">
                    Allocate inventory to project, site, department, or staff with balance checks and ledger entry.
                  </Text>
                </Box>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setShowIssueModal(false)}>
                <X size={16} />
              </Button>
            </Flex>

            {issueFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {issueFeedback}
              </Box>
            )}

            <form onSubmit={handleExecuteIssue}>
              <Stack gap={3} mt={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Material SKU to Issue *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={issueForm.itemId}
                      onChange={(e) => setIssueForm({ ...issueForm, itemId: Number(e.target.value) })}
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.itemCode} - {inv.name} ({inv.currentStock} {inv.unit} in stock at {inv.warehouseLocation})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                {/* Stock Level Warning Strip */}
                {currentItemForIssue && (
                  <Flex justify="space-between" align="center" p={2.5} bg={isIssueQtyExceeded ? '#fef2f2' : '#f8fafc'} borderRadius="8px" border={`1px solid ${isIssueQtyExceeded ? '#fecaca' : '#e2e8f0'}`}>
                    <Box>
                      <Text fontSize="xs" color="#64748b">Available Store Balance:</Text>
                      <Text fontSize="sm" fontWeight="bold" color={currentItemForIssue.currentStock <= 0 ? '#dc2626' : '#0f172a'}>
                        {currentItemForIssue.currentStock} {currentItemForIssue.unit} ({currentItemForIssue.warehouseLocation})
                      </Text>
                    </Box>
                    {isIssueQtyExceeded && (
                      <Badge size="xs" colorPalette="red">
                        <AlertTriangle size={11} style={{ display: 'inline', marginRight: '3px' }} />
                        EXCEEDS AVAILABLE STOCK
                      </Badge>
                    )}
                  </Flex>
                )}

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity to Issue *</Text>
                    <Input
                      type="number"
                      size="sm"
                      min={1}
                      max={currentItemForIssue?.currentStock || 9999}
                      value={issueForm.quantity}
                      onChange={(e) => setIssueForm({ ...issueForm, quantity: Math.max(1, Number(e.target.value)) })}
                      borderColor={isIssueQtyExceeded ? '#dc2626' : undefined}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Issue Date *</Text>
                    <Input
                      type="date"
                      size="sm"
                      value={issueForm.date}
                      onChange={(e) => setIssueForm({ ...issueForm, date: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                {/* Destination / Allocation Type */}
                <Card.Root bg="#f8fafc" p={3.5} borderRadius="10px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>Destination / Allocation Type *</Text>
                  <NativeSelect.Root size="sm" mb={3}>
                    <NativeSelect.Field
                      value={issueForm.destinationType}
                      onChange={(e) => setIssueForm({ ...issueForm, destinationType: e.target.value as any })}
                    >
                      <option value="project">Construction Project Site</option>
                      <option value="warehouse">Another Warehouse / Site Yard</option>
                      <option value="department">Operational Department</option>
                      <option value="employee">Staff / Field Engineer Custody</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>

                  {/* Destination Specific Selector */}
                  {(issueForm.destinationType === 'project' || issueForm.destinationType === 'site') && (
                    <Box mb={2}>
                      <Text fontSize="11px" color="#64748b" mb={1}>Target Project Site *</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={issueForm.projectId}
                          onChange={(e) => setIssueForm({ ...issueForm, projectId: Number(e.target.value) })}
                        >
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.projectNumber} - {p.name}</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                  )}

                  {issueForm.destinationType === 'warehouse' && (
                    <Box mb={2}>
                      <Text fontSize="11px" color="#64748b" mb={1}>Destination Warehouse / Camp *</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={issueForm.targetWarehouseId}
                          onChange={(e) => setIssueForm({ ...issueForm, targetWarehouseId: Number(e.target.value) })}
                        >
                          {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                  )}

                  {issueForm.destinationType === 'department' && (
                    <Box mb={2}>
                      <Text fontSize="11px" color="#64748b" mb={1}>Receiving Department *</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={issueForm.department}
                          onChange={(e) => setIssueForm({ ...issueForm, department: e.target.value })}
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                  )}

                  {issueForm.destinationType === 'employee' && (
                    <Box mb={2}>
                      <Text fontSize="11px" color="#64748b" mb={1}>Staff Member in Custody *</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={issueForm.employeeId}
                          onChange={(e) => {
                            const emp = employees.find(ep => ep.id === Number(e.target.value));
                            setIssueForm({ ...issueForm, employeeId: Number(e.target.value), recipientName: emp?.name || '' });
                          }}
                        >
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} — {emp.department} ({emp.position})</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                  )}

                  <SimpleGrid columns={2} gap={2}>
                    <Box>
                      <Text fontSize="11px" color="#64748b" mb={1}>Recipient Person *</Text>
                      <Input
                        size="xs"
                        placeholder="Name of person receiving goods"
                        value={issueForm.recipientName}
                        onChange={(e) => setIssueForm({ ...issueForm, recipientName: e.target.value })}
                        required
                      />
                    </Box>
                    <Box>
                      <Text fontSize="11px" color="#64748b" mb={1}>Specific Zone / Sub-Location</Text>
                      <Input
                        size="xs"
                        placeholder="e.g. Block C Level 3 Pier"
                        value={issueForm.destinationDetails}
                        onChange={(e) => setIssueForm({ ...issueForm, destinationDetails: e.target.value })}
                      />
                    </Box>
                  </SimpleGrid>
                </Card.Root>

                {/* Link to Approved Requisition (Optional) */}
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                    Link to Approved Requisition (Optional)
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={issueForm.requisitionId}
                      onChange={(e) => setIssueForm({ ...issueForm, requisitionId: e.target.value })}
                    >
                      <option value="none">No Requisition Link (General Site Issuance)</option>
                      {approvedRequisitions.map(r => (
                        <option key={r.id} value={String(r.id)}>
                          {r.requisitionNo} - {r.projectName} ({r.title})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Issuance Purpose / Job Order *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Structural deck casting"
                      value={issueForm.purpose}
                      onChange={(e) => setIssueForm({ ...issueForm, purpose: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Gate Pass / Voucher #</Text>
                    <Input
                      size="sm"
                      value={issueForm.referenceNumber}
                      onChange={(e) => setIssueForm({ ...issueForm, referenceNumber: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowIssueModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="blue"
                    type="submit"
                    disabled={isIssueQtyExceeded}
                  >
                    Confirm Stock Issuance
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="680px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>Register New Material SKU</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define catalog item code, unit rate, safety buffer threshold, warehouse location, and optional supplier details.
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
                    placeholder="e.g. High-Yield Deformed Steel Rebar 16mm"
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
                        <option value="Trips">Trips</option>
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

                {/* Enhanced Supplier Details Selection (Requirement 4) */}
                <Card.Root bg="#f8fafc" p={3.5} borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a" mb={1}>
                    Supplier Specifications (Optional)
                  </Text>
                  <Text fontSize="11px" color="#64748b" mb={3}>
                    Associate with an existing supplier or enter new vendor credentials. Not required if in-house or not applicable.
                  </Text>

                  <SimpleGrid columns={3} gap={2} mb={3}>
                    <Button
                      type="button"
                      size="xs"
                      variant={itemForm.supplierMode === 'existing' ? 'solid' : 'outline'}
                      colorPalette={itemForm.supplierMode === 'existing' ? 'blue' : 'gray'}
                      onClick={() => setItemForm({ ...itemForm, supplierMode: 'existing' })}
                    >
                      Select Existing Supplier
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={itemForm.supplierMode === 'new' ? 'solid' : 'outline'}
                      colorPalette={itemForm.supplierMode === 'new' ? 'blue' : 'gray'}
                      onClick={() => setItemForm({ ...itemForm, supplierMode: 'new' })}
                    >
                      + Enter New Supplier
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={itemForm.supplierMode === 'none' ? 'solid' : 'outline'}
                      colorPalette={itemForm.supplierMode === 'none' ? 'blue' : 'gray'}
                      onClick={() => setItemForm({ ...itemForm, supplierMode: 'none' })}
                    >
                      No Supplier / N/A
                    </Button>
                  </SimpleGrid>

                  {itemForm.supplierMode === 'existing' && (
                    <Box>
                      <Text fontSize="11px" color="#64748b" mb={1}>Choose Existing Supplier</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={itemForm.supplierId}
                          onChange={(e) => setItemForm({ ...itemForm, supplierId: Number(e.target.value) })}
                        >
                          {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.companyName} ({s.category})</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                  )}

                  {itemForm.supplierMode === 'new' && (
                    <Stack gap={2}>
                      <SimpleGrid columns={2} gap={2}>
                        <Box>
                          <Text fontSize="10px" color="#64748b">Supplier Company Name *</Text>
                          <Input
                            size="xs"
                            placeholder="e.g. Apex Industrial Steel Corp"
                            value={itemForm.newSupplierName}
                            onChange={(e) => setItemForm({ ...itemForm, newSupplierName: e.target.value })}
                            required
                          />
                        </Box>
                        <Box>
                          <Text fontSize="10px" color="#64748b">Contact Person</Text>
                          <Input
                            size="xs"
                            placeholder="e.g. John Okon"
                            value={itemForm.newSupplierContact}
                            onChange={(e) => setItemForm({ ...itemForm, newSupplierContact: e.target.value })}
                          />
                        </Box>
                      </SimpleGrid>
                      <SimpleGrid columns={2} gap={2}>
                        <Box>
                          <Text fontSize="10px" color="#64748b">Phone Number</Text>
                          <Input
                            size="xs"
                            placeholder="+234 800 123 4567"
                            value={itemForm.newSupplierPhone}
                            onChange={(e) => setItemForm({ ...itemForm, newSupplierPhone: e.target.value })}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="10px" color="#64748b">Email Address</Text>
                          <Input
                            size="xs"
                            placeholder="sales@supplier.com"
                            value={itemForm.newSupplierEmail}
                            onChange={(e) => setItemForm({ ...itemForm, newSupplierEmail: e.target.value })}
                          />
                        </Box>
                      </SimpleGrid>
                      <Box>
                        <Text fontSize="10px" color="#64748b">Physical / Yard Address</Text>
                        <Input
                          size="xs"
                          placeholder="e.g. Plot 14 Trans-Amadi Industrial Layout, Port Harcourt"
                          value={itemForm.newSupplierAddress}
                          onChange={(e) => setItemForm({ ...itemForm, newSupplierAddress: e.target.value })}
                        />
                      </Box>
                    </Stack>
                  )}
                </Card.Root>

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
              {viewingItem.supplierContact && (
                <Flex justify="space-between">
                  <Text color="#64748b">Supplier Contact:</Text>
                  <Text fontWeight="semibold" color="#0f172a">{viewingItem.supplierContact} ({viewingItem.supplierPhone || ''})</Text>
                </Flex>
              )}
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
