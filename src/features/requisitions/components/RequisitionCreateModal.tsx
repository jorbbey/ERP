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
import { RequisitionItem, RequisitionApprover } from '../../../types';
import {
  Plus,
  Trash2,
  AlertCircle,
  Search,
  Users,
  Check,
  X,
  Sparkles,
  Info,
  DollarSign,
  Package,
  Layers,
  Wrench,
  HelpCircle,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface RequisitionCreateModalProps {
  onClose: () => void;
}

interface EditableItemRow {
  inventoryItemId?: number;
  itemCode?: string;
  itemName: string;
  itemType: 'material' | 'service' | 'equipment' | 'other';
  description: string;
  unit: string;
  quantityRequired: number;
  quantityInStock: number;
  quantityToPurchase: number;
  price?: number | '';
  value?: number;
  isCustom: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
}

export const RequisitionCreateModal: React.FC<RequisitionCreateModalProps> = ({ onClose }) => {
  const {
    createRequisition,
    projects,
    inventory,
    suppliers,
    employees,
    activeCompany,
    currentUserName,
    activeRole,
    mandatoryRequisitionOffices,
    updateMandatoryRequisitionOffices
  } = useERP();

  const [projectId, setProjectId] = useState<number>(projects[0]?.id || 1);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('Reinforcement & Concrete Structures');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('none');
  const [customSupplierText, setCustomSupplierText] = useState('');
  const [remarks, setRemarks] = useState('');

  // Helper: check if an employee belongs to/occupies a given office/role
  const employeeMatchesOffice = (emp: typeof employees[0], office: string) => {
    if (!emp) return false;
    const off = office.toLowerCase().trim();
    const r = (emp.role || '').toLowerCase();
    const p = (emp.position || '').toLowerCase();
    const d = (emp.department || '').toLowerCase();
    return r === off || p === off || r.includes(off) || p.includes(off) || d.includes(off);
  };

  // Pre-tag staff for mandated offices on modal mount
  const [selectedApproverIds, setSelectedApproverIds] = useState<number[]>(() => {
    const ids: number[] = [];
    (mandatoryRequisitionOffices || ['Finance Manager', 'Project Manager']).forEach(office => {
      const match = employees.find(e => employeeMatchesOffice(e, office));
      if (match && !ids.includes(match.id)) {
        ids.push(match.id);
      }
    });
    if (ids.length === 0 && employees.length > 0) {
      ids.push(employees[0].id);
    }
    return ids;
  });

  const [approverSearch, setApproverSearch] = useState('');
  const [approverError, setApproverError] = useState('');
  const [showManageOfficesModal, setShowManageOfficesModal] = useState(false);
  const [editingMandatoryOffices, setEditingMandatoryOffices] = useState<string[]>(
    () => mandatoryRequisitionOffices || ['Finance Manager', 'Project Manager']
  );
  const [newCustomOffice, setNewCustomOffice] = useState('');

  const canManageMandatory = ['Super Admin', 'Managing Director'].includes(activeRole);

  // Missing mandatory offices verification
  const missingMandatoryOffices = (mandatoryRequisitionOffices || []).filter(office => {
    return !selectedApproverIds.some(id => {
      const emp = employees.find(e => e.id === id);
      return emp ? employeeMatchesOffice(emp, office) : false;
    });
  });

  // Dynamic search results across all staff
  const searchResults = approverSearch.trim() === ''
    ? []
    : employees.filter(emp => {
        const q = approverSearch.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          (emp.role && emp.role.toLowerCase().includes(q)) ||
          (emp.position && emp.position.toLowerCase().includes(q)) ||
          (emp.department && emp.department.toLowerCase().includes(q)) ||
          (emp.code && emp.code.toLowerCase().includes(q))
        );
      });

  // Line items state
  const [itemRows, setItemRows] = useState<EditableItemRow[]>([
    {
      inventoryItemId: inventory[0]?.id,
      itemCode: inventory[0]?.itemCode,
      itemName: inventory[0]?.name || 'Standard Requirement',
      itemType: 'material',
      description: '',
      unit: inventory[0]?.unit || 'Bags',
      quantityRequired: 20,
      quantityInStock: inventory[0]?.currentStock || 0,
      quantityToPurchase: Math.max(0, 20 - (inventory[0]?.currentStock || 0)),
      price: inventory[0]?.costPrice,
      value: (inventory[0]?.costPrice || 0) * 20,
      isCustom: false,
      searchQuery: inventory[0]?.name || '',
      isSearchOpen: false
    }
  ]);

  const handleAddItemRow = () => {
    setItemRows([
      ...itemRows,
      {
        inventoryItemId: undefined,
        itemCode: 'CUSTOM',
        itemName: '',
        itemType: 'material',
        description: '',
        unit: 'Units',
        quantityRequired: 10,
        quantityInStock: 0,
        quantityToPurchase: 10,
        price: '',
        value: undefined,
        isCustom: true,
        searchQuery: '',
        isSearchOpen: false
      }
    ]);
  };

  const handleSelectInventorySuggestion = (index: number, invItem: typeof inventory[0]) => {
    const updated = [...itemRows];
    const qty = updated[index].quantityRequired || 1;
    const unitPrice = invItem.costPrice;
    updated[index] = {
      ...updated[index],
      inventoryItemId: invItem.id,
      itemCode: invItem.itemCode,
      itemName: invItem.name,
      unit: invItem.unit,
      quantityInStock: invItem.currentStock,
      quantityToPurchase: Math.max(0, qty - invItem.currentStock),
      price: unitPrice,
      value: unitPrice ? unitPrice * qty : undefined,
      isCustom: false,
      searchQuery: invItem.name,
      isSearchOpen: false
    };
    setItemRows(updated);
  };

  const handleCustomItemNameChange = (index: number, name: string) => {
    const updated = [...itemRows];
    updated[index].searchQuery = name;
    updated[index].itemName = name;
    updated[index].isSearchOpen = true;

    // Check exact match
    const match = inventory.find(i => (i.name || '').toLowerCase() === (name || '').toLowerCase());
    if (match) {
      updated[index].inventoryItemId = match.id;
      updated[index].itemCode = match.itemCode;
      updated[index].unit = match.unit;
      updated[index].quantityInStock = match.currentStock;
      updated[index].isCustom = false;
    } else {
      updated[index].inventoryItemId = undefined;
      updated[index].itemCode = 'CUSTOM';
      updated[index].isCustom = true;
    }
    setItemRows(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...itemRows];
    const unitPrice = typeof updated[index].price === 'number' ? updated[index].price : 0;
    const inStock = updated[index].quantityInStock || 0;
    updated[index].quantityRequired = qty;
    updated[index].quantityToPurchase = Math.max(0, qty - inStock);
    updated[index].value = unitPrice > 0 ? qty * unitPrice : undefined;
    setItemRows(updated);
  };

  const handlePriceChange = (index: number, priceStr: string) => {
    const updated = [...itemRows];
    if (priceStr === '' || isNaN(Number(priceStr))) {
      updated[index].price = '';
      updated[index].value = undefined;
    } else {
      const num = Number(priceStr);
      updated[index].price = num;
      updated[index].value = num * (updated[index].quantityRequired || 0);
    }
    setItemRows(updated);
  };

  const handleRemoveRow = (index: number) => {
    if (itemRows.length <= 1) return;
    setItemRows(itemRows.filter((_, i) => i !== index));
  };

  const handleToggleApprover = (empId: number) => {
    setApproverError('');
    if (selectedApproverIds.includes(empId)) {
      if (selectedApproverIds.length === 1) return; // Keep at least one
      setSelectedApproverIds(prev => prev.filter(id => id !== empId));
    } else {
      setSelectedApproverIds(prev => [...prev, empId]);
      setApproverSearch('');
    }
  };

  const totalCalculated = itemRows.reduce((acc, i) => acc + (i.value || 0), 0);
  const hasAnyPricedItems = itemRows.some(i => typeof i.price === 'number' && i.price > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApproverError('');

    if (missingMandatoryOffices.length > 0) {
      setApproverError(`Mandatory Approval Offices Required: This requisition cannot be raised until staff occupying the compulsory office(s) [${missingMandatoryOffices.join(', ')}] are tagged.`);
      return;
    }

    const proj = projects.find(p => p.id === projectId);

    const formattedItems: RequisitionItem[] = itemRows.map((row, idx) => ({
      id: idx + 1,
      inventoryItemId: row.inventoryItemId,
      itemCode: row.itemCode || (row.isCustom ? 'CUSTOM' : undefined),
      itemName: row.itemName.trim() || 'Unspecified Requirement',
      itemType: row.itemType,
      description: row.description || undefined,
      unit: row.unit || 'Units',
      quantityRequired: Number(row.quantityRequired) || 1,
      quantityInStock: row.quantityInStock || 0,
      quantityToPurchase: row.quantityToPurchase || Number(row.quantityRequired) || 1,
      price: typeof row.price === 'number' ? row.price : undefined,
      value: row.value,
      isCustomItem: row.isCustom,
      status: 'pending'
    }));

    // Approvers details
    const approverObjects: RequisitionApprover[] = selectedApproverIds.map(id => {
      const emp = employees.find(e => e.id === id);
      return {
        id,
        name: emp?.name || `Approver #${id}`,
        role: emp?.role || emp?.position || 'Management Approver',
        email: emp?.email
      };
    });

    // Supplier details
    let supName: string | undefined = undefined;
    if (selectedSupplierId !== 'none' && selectedSupplierId !== 'custom') {
      const s = suppliers.find(sup => String(sup.id) === selectedSupplierId);
      supName = s?.companyName;
    } else if (selectedSupplierId === 'custom' && customSupplierText.trim()) {
      supName = customSupplierText.trim();
    }

    createRequisition({
      projectId,
      projectName: proj?.name || 'Site Project',
      requestedBy: currentUserName,
      department: 'Civil Engineering & Construction',
      priority,
      title: title.trim() || `Material & Works Requisition for ${proj?.name || 'Site'}`,
      trade,
      supplier: supName,
      items: formattedItems,
      totalEstimatedAmount: hasAnyPricedItems ? totalCalculated : undefined,
      approverIds: selectedApproverIds,
      approvers: approverObjects,
      remarks: remarks.trim()
    });

    onClose();
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={{ base: 2, sm: 4 }}>
      <Box bg="white" borderRadius="16px" maxW="880px" w="100%" p={{ base: 4, sm: 6 }} boxShadow="2xl" maxH="92vh" overflowY="auto">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb={3} borderBottom="1px solid #f1f5f9" pb={3}>
          <Box>
            <Flex align="center" gap={2}>
              <Badge size="xs" colorPalette="blue" px={2} py={0.5}>FLEXIBLE REQUISITION</Badge>
              <Badge size="xs" colorPalette="purple" px={2} py={0.5}>COLLABORATIVE APPROVAL</Badge>
            </Flex>
            <Heading size="md" color="#0f172a" mt={1}>
              Raise Project Requisition
            </Heading>
            <Text fontSize="xs" color="#64748b">
              Request materials, services, equipment, or site needs with optional pricing and collaborative approver group chat.
            </Text>
          </Box>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X size={16} />
          </Button>
        </Flex>

        {/* Informative Guidance Banner */}
        <Flex align="center" gap={2.5} p={3} mb={4} bg="#f0f9ff" border="1px solid #bae6fd" borderRadius="10px" fontSize="xs" color="#0369a1">
          <Info size={18} style={{ flexShrink: 0 }} />
          <Text>
            <Text as="span" fontWeight="bold">Procurement Independence:</Text> Submitting this requisition routes it for site technical and executive authorization only. It does <Text as="span" fontWeight="bold">not</Text> automatically generate a purchase order or financial commitment. Unit rates and suppliers are completely optional.
          </Text>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            {/* Project & Urgency */}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Allocated Project / Site *</Text>
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
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Urgency / Operational Priority *</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                  >
                    <option value="Normal">Normal Operational Schedule</option>
                    <option value="High">High (Required within 48 Hours)</option>
                    <option value="Urgent">Urgent / Site Stoppage Critical</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            </SimpleGrid>

            {/* Title & Trade */}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Requisition Title / Scope *</Text>
                <Input
                  size="sm"
                  placeholder="e.g. Steel rebar & ready-mix for Pier 3 footing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Trade / Work Package</Text>
                <Input
                  size="sm"
                  placeholder="e.g. Substructure Concrete & Piling"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                />
              </Box>
            </SimpleGrid>

            {/* Dynamic Approver Tagging with Mandatory Offices Gate */}
            <Card.Root bg="#f8fafc" borderRadius="12px" p={4} border="1px solid #e2e8f0">
              <Flex justify="space-between" align="center" mb={1} wrap="wrap" gap={2}>
                <Flex align="center" gap={2}>
                  <Users size={16} color="#2563eb" />
                  <Heading size="xs" color="#0f172a" textTransform="uppercase">
                    Designated Approvers & Workflow Routing *
                  </Heading>
                </Flex>
                <Flex align="center" gap={2}>
                  {canManageMandatory && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => setShowManageOfficesModal(true)}
                    >
                      <Sliders size={12} /> Mandated Offices Policy
                    </Button>
                  )}
                  <Badge size="xs" colorPalette="blue">
                    {selectedApproverIds.length} Staff Tagged
                  </Badge>
                </Flex>
              </Flex>

              <Text fontSize="11px" color="#64748b" mb={3}>
                Search any staff by name or office in the database. Mandatory approval offices set by management must be included before submission.
              </Text>

              {/* Mandatory Offices Gate Status */}
              <Box mb={3} p={2.5} bg="white" borderRadius="8px" border="1px solid #e2e8f0">
                <Flex align="center" justify="space-between" mb={1.5} wrap="wrap" gap={2}>
                  <Flex align="center" gap={1.5}>
                    <ShieldCheck size={14} color="#2563eb" />
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                      Compulsory Management Approval Offices:
                    </Text>
                  </Flex>
                  {missingMandatoryOffices.length === 0 ? (
                    <Badge colorPalette="green" size="xs">
                      All Mandatory Offices Tagged
                    </Badge>
                  ) : (
                    <Badge colorPalette="red" size="xs">
                      {missingMandatoryOffices.length} Office Required
                    </Badge>
                  )}
                </Flex>

                <Flex wrap="wrap" gap={1.5}>
                  {(mandatoryRequisitionOffices || []).map(office => {
                    const coveringEmp = employees.find(e => selectedApproverIds.includes(e.id) && employeeMatchesOffice(e, office));
                    if (coveringEmp) {
                      return (
                        <Badge key={office} colorPalette="green" size="xs" px={2} py={0.5}>
                          <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {office} ({coveringEmp.name.split(' ')[0]})
                        </Badge>
                      );
                    }
                    const availableEmp = employees.find(e => employeeMatchesOffice(e, office));
                    return (
                      <Box key={office} display="flex" alignItems="center" gap={1}>
                        <Badge colorPalette="red" size="xs" px={2} py={0.5}>
                          <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {office} (Required)
                        </Badge>
                        {availableEmp && (
                          <Button
                            size="xs"
                            variant="subtle"
                            colorPalette="blue"
                            onClick={() => handleToggleApprover(availableEmp.id)}
                            fontSize="10px"
                            h="20px"
                            px={1.5}
                          >
                            + Tag {availableEmp.name.split(' ')[0]}
                          </Button>
                        )}
                      </Box>
                    );
                  })}
                </Flex>
              </Box>

              {approverError && (
                <Box p={2.5} mb={3} bg="#fef2f2" border="1px solid #fecaca" borderRadius="8px" color="#991b1b" fontSize="xs" display="flex" alignItems="center" gap={2}>
                  <AlertCircle size={14} />
                  <Text fontWeight="medium">{approverError}</Text>
                </Box>
              )}

              {/* Dynamic Staff Search Input */}
              <Box position="relative" mb={3}>
                <Flex align="center" bg="white" borderRadius="8px" border="1px solid #cbd5e1" px={2.5} py={1}>
                  <Search size={14} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Search any staff by name or office (e.g. Babatunde, Finance, Site Engineer, Adebayo)..."
                    value={approverSearch}
                    onChange={e => {
                      setApproverSearch(e.target.value);
                      setApproverError('');
                    }}
                    style={{
                      width: '100%',
                      outline: 'none',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#0f172a'
                    }}
                  />
                  {approverSearch && (
                    <Box as="button" onClick={() => setApproverSearch('')} color="#94a3b8" cursor="pointer">
                      <X size={14} />
                    </Box>
                  )}
                </Flex>

                {/* Search Results Dropdown */}
                {approverSearch.trim() && (
                  <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    zIndex="50"
                    mt={1}
                    bg="white"
                    borderRadius="10px"
                    border="1px solid #cbd5e1"
                    boxShadow="lg"
                    maxH="220px"
                    overflowY="auto"
                    p={1.5}
                  >
                    {searchResults.length === 0 ? (
                      <Box p={3} textAlign="center" fontSize="xs" color="#64748b">
                        No staff member found matching "{approverSearch}". Try searching by another name or role.
                      </Box>
                    ) : (
                      searchResults.map(emp => {
                        const isAlreadySelected = selectedApproverIds.includes(emp.id);
                        const satisfiesMandatory = (mandatoryRequisitionOffices || []).find(off => employeeMatchesOffice(emp, off));
                        return (
                          <Flex
                            key={emp.id}
                            justify="space-between"
                            align="center"
                            p={2}
                            borderRadius="6px"
                            cursor="pointer"
                            bg={isAlreadySelected ? '#eff6ff' : 'transparent'}
                            _hover={{ bg: isAlreadySelected ? '#dbeafe' : '#f8fafc' }}
                            onClick={() => handleToggleApprover(emp.id)}
                          >
                            <Box>
                              <Flex align="center" gap={1.5}>
                                <Text fontSize="xs" fontWeight="bold" color="#0f172a">{emp.name}</Text>
                                <Badge size="xs" colorPalette="blue">{emp.role || emp.position}</Badge>
                                {satisfiesMandatory && (
                                  <Badge size="xs" colorPalette="purple">Mandated: {satisfiesMandatory}</Badge>
                                )}
                              </Flex>
                              <Text fontSize="10px" color="#64748b">
                                {emp.department} • Code: {emp.code}
                              </Text>
                            </Box>
                            <Button
                              size="xs"
                              variant={isAlreadySelected ? 'solid' : 'outline'}
                              colorPalette={isAlreadySelected ? 'green' : 'blue'}
                            >
                              {isAlreadySelected ? <Check size={12} /> : <Plus size={12} />}
                              {isAlreadySelected ? 'Tagged' : 'Tag'}
                            </Button>
                          </Flex>
                        );
                      })
                    )}
                  </Box>
                )}
              </Box>

              {/* Tagged Approvers List */}
              <Box>
                <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" mb={1.5}>
                  Currently Tagged Approvers ({selectedApproverIds.length})
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {selectedApproverIds.map((id) => {
                    const emp = employees.find(e => e.id === id);
                    if (!emp) return null;
                    const satisfiesMandatory = (mandatoryRequisitionOffices || []).find(off => employeeMatchesOffice(emp, off));
                    return (
                      <Box
                        key={emp.id}
                        px={2.5}
                        py={1.5}
                        borderRadius="8px"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        bg="#eff6ff"
                        border="1.5px solid #2563eb"
                        color="#1d4ed8"
                      >
                        <UserCheck size={13} color="#2563eb" />
                        <Text fontWeight="bold">{emp.name}</Text>
                        <Badge size="xs" colorPalette="blue">
                          {emp.role || emp.position}
                        </Badge>
                        {satisfiesMandatory && (
                          <Badge size="xs" colorPalette="purple">
                            Mandatory: {satisfiesMandatory}
                          </Badge>
                        )}
                        <Box
                          as="button"
                          onClick={() => handleToggleApprover(emp.id)}
                          ml={1}
                          color="#64748b"
                          _hover={{ color: '#dc2626' }}
                          cursor="pointer"
                          title="Remove Approver"
                        >
                          <X size={13} />
                        </Box>
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            </Card.Root>

            {/* Line Items Table */}
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Box>
                  <Heading size="xs" color="#0f172a" textTransform="uppercase">
                    Requested Items & Services ({itemRows.length})
                  </Heading>
                  <Text fontSize="11px" color="#64748b">
                    Search inventory for autocomplete prefilling, or type any custom material, equipment rental, or specialized subcontract.
                  </Text>
                </Box>
                <Button size="xs" variant="outline" colorPalette="blue" onClick={handleAddItemRow}>
                  <Plus size={13} /> Add Item / Service Line
                </Button>
              </Flex>

              <Stack gap={2.5}>
                {itemRows.map((row, idx) => {
                  const q = (row.searchQuery || '').trim().toLowerCase();
                  const matchingSuggestions = q
                    ? inventory.filter(i =>
                        (i.name || '').toLowerCase().includes(q) ||
                        (i.itemCode || '').toLowerCase().includes(q) ||
                        (i.categoryName || '').toLowerCase().includes(q)
                      ).slice(0, 5)
                    : inventory.slice(0, 4);

                  return (
                    <Card.Root key={idx} p={3} bg="white" borderRadius="10px" border="1px solid #e2e8f0" boxShadow="xs">
                      <Flex direction={{ base: 'column', md: 'row' }} gap={2.5} align={{ md: 'center' }}>
                        {/* Type & Item Name with Autocomplete */}
                        <Box flex="2" position="relative">
                          <Flex justify="space-between" align="center" mb={1}>
                            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">
                              Item or Service Name *
                            </Text>
                            <NativeSelect.Root size="xs" w="120px">
                              <NativeSelect.Field
                                value={row.itemType}
                                onChange={(e) => {
                                  const updated = [...itemRows];
                                  updated[idx].itemType = e.target.value as any;
                                  setItemRows(updated);
                                }}
                              >
                                <option value="material">Material SKU</option>
                                <option value="service">Service / Work</option>
                                <option value="equipment">Plant / Rental</option>
                                <option value="other">Other Need</option>
                              </NativeSelect.Field>
                            </NativeSelect.Root>
                          </Flex>

                          <Flex align="center" bg="#f8fafc" px={2.5} py={1} borderRadius="6px" border="1px solid #cbd5e1">
                            <Search size={14} color="#94a3b8" style={{ marginRight: '6px', flexShrink: 0 }} />
                            <input
                              placeholder="Type to search stores, or enter custom requirement..."
                              value={row.searchQuery}
                              onChange={(e) => handleCustomItemNameChange(idx, e.target.value)}
                              onFocus={() => {
                                const updated = [...itemRows];
                                updated[idx].isSearchOpen = true;
                                setItemRows(updated);
                              }}
                              style={{
                                width: '100%',
                                fontSize: '12px',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none'
                              }}
                              required
                            />
                            {row.isCustom ? (
                              <Badge size="xs" colorPalette="purple" ml={1}>CUSTOM</Badge>
                            ) : (
                              <Badge size="xs" colorPalette="green" ml={1}>INVENTORY</Badge>
                            )}
                          </Flex>

                          {/* Autocomplete Dropdown */}
                          {row.isSearchOpen && (
                            <Box
                              position="absolute"
                              top="100%"
                              left="0"
                              right="0"
                              zIndex="10"
                              bg="white"
                              border="1px solid #cbd5e1"
                              borderRadius="8px"
                              boxShadow="lg"
                              mt={1}
                              maxH="180px"
                              overflowY="auto"
                            >
                              <Flex justify="space-between" align="center" p={2} bg="#f8fafc" borderBottom="1px solid #e2e8f0">
                                <Text fontSize="10px" fontWeight="bold" color="#64748b">
                                  Select from Stores Catalog or Keep as Custom
                                </Text>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() => {
                                    const updated = [...itemRows];
                                    updated[idx].isSearchOpen = false;
                                    setItemRows(updated);
                                  }}
                                >
                                  Close
                                </Button>
                              </Flex>

                              {matchingSuggestions.map(inv => (
                                <Box
                                  key={inv.id}
                                  p={2}
                                  borderBottom="1px solid #f1f5f9"
                                  cursor="pointer"
                                  _hover={{ bg: '#eff6ff' }}
                                  onClick={() => handleSelectInventorySuggestion(idx, inv)}
                                >
                                  <Flex justify="space-between" align="center">
                                    <Box>
                                      <Text fontSize="xs" fontWeight="semibold" color="#0f172a">{inv.name}</Text>
                                      <Text fontSize="10px" color="#64748b">{inv.itemCode} • {inv.categoryName}</Text>
                                    </Box>
                                    <Box textAlign="right">
                                      <Badge size="xs" colorPalette="blue">{Number(inv.currentStock) || 0} {inv.unit} in store</Badge>
                                      <Text fontSize="10px" color="#16a34a">{activeCompany.currency} {(Number(inv.costPrice) || 0).toFixed(2)}</Text>
                                    </Box>
                                  </Flex>
                                </Box>
                              ))}

                              {row.searchQuery.trim() && (
                                <Box
                                  p={2}
                                  bg="#faf5ff"
                                  cursor="pointer"
                                  _hover={{ bg: '#f3e8ff' }}
                                  onClick={() => {
                                    const updated = [...itemRows];
                                    updated[idx].itemName = row.searchQuery.trim();
                                    updated[idx].isCustom = true;
                                    updated[idx].isSearchOpen = false;
                                    setItemRows(updated);
                                  }}
                                >
                                  <Text fontSize="xs" fontWeight="bold" color="#7c3aed">
                                    + Use "{row.searchQuery}" as Custom Non-Inventory Requirement
                                  </Text>
                                  <Text fontSize="10px" color="#6b21a8">
                                    Does not require existing warehouse SKU record.
                                  </Text>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>

                        {/* Unit & Quantity */}
                        <Box w={{ base: '100%', md: '90px' }}>
                          <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" mb={1}>
                            Unit *
                          </Text>
                          <Input
                            size="xs"
                            value={row.unit}
                            onChange={(e) => {
                              const updated = [...itemRows];
                              updated[idx].unit = e.target.value;
                              setItemRows(updated);
                            }}
                            placeholder="e.g. Bags, Tons, Hrs"
                            required
                          />
                        </Box>

                        <Box w={{ base: '100%', md: '80px' }}>
                          <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" mb={1}>
                            Req Qty *
                          </Text>
                          <Input
                            type="number"
                            size="xs"
                            min={1}
                            value={row.quantityRequired}
                            onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                            required
                          />
                        </Box>

                        {/* Unit Rate (Optional) */}
                        <Box w={{ base: '100%', md: '110px' }}>
                          <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" mb={1}>
                            Unit Rate ({activeCompany.currency})
                          </Text>
                          <Input
                            type="number"
                            step="any"
                            size="xs"
                            placeholder="Optional"
                            value={row.price}
                            onChange={(e) => handlePriceChange(idx, e.target.value)}
                          />
                        </Box>

                        {/* Line Total */}
                        <Box w={{ base: '100%', md: '100px' }} textAlign={{ md: 'right' }}>
                          <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" mb={1}>
                            Est. Total
                          </Text>
                          <Text fontSize="xs" fontWeight="bold" color={row.value ? '#16a34a' : '#94a3b8'}>
                            {row.value !== undefined
                              ? `${activeCompany.currency} ${row.value.toLocaleString()}`
                              : 'Unpriced'}
                          </Text>
                        </Box>

                        {/* Remove Action */}
                        <Box textAlign="right" pt={{ md: 4 }}>
                          {itemRows.length > 1 && (
                            <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleRemoveRow(idx)}>
                              <Trash2 size={13} />
                            </Button>
                          )}
                        </Box>
                      </Flex>

                      {/* Custom Description / Technical Specs */}
                      <Box mt={2}>
                        <Input
                          size="xs"
                          placeholder="Optional item specification or performance criteria (e.g. Grade 42.5N, 16mm High-Yield Deformed, etc.)"
                          value={row.description}
                          onChange={(e) => {
                            const updated = [...itemRows];
                            updated[idx].description = e.target.value;
                            setItemRows(updated);
                          }}
                        />
                      </Box>
                    </Card.Root>
                  );
                })}
              </Stack>
            </Box>

            {/* Optional Supplier Details */}
            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Heading size="xs" color="#0f172a" textTransform="uppercase" mb={2}>
                Preferred Supplier or Subcontractor (Optional)
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" color="#64748b" mb={1}>Select Known Supplier</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                      <option value="none">No specific supplier specified (Open Quotation)</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={String(s.id)}>{s.companyName} ({s.category})</option>
                      ))}
                      <option value="custom">Other / New Subcontractor</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                {selectedSupplierId === 'custom' && (
                  <Box>
                    <Text fontSize="xs" color="#64748b" mb={1}>Custom Supplier Name / Contact</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Apex Heavy Lift Services Ltd (0801234567)"
                      value={customSupplierText}
                      onChange={(e) => setCustomSupplierText(e.target.value)}
                    />
                  </Box>
                )}
              </SimpleGrid>
            </Card.Root>

            {/* Purpose & Technical Remarks */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                Purpose of Requirement & Technical Remarks *
              </Text>
              <Input
                size="sm"
                placeholder="e.g. Required for casting Level 4 structural deck slabs; concrete pour scheduled for Thursday."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </Box>

            {/* Financial Summary Strip */}
            <Flex justify="space-between" align="center" bg="#f8fafc" p={3.5} borderRadius="12px" border="1px solid #e2e8f0">
              <Box>
                <Text fontSize="11px" color="#64748b">
                  Requesting Staff: <Text as="span" fontWeight="bold" color="#0f172a">{currentUserName}</Text> ({activeRole})
                </Text>
                <Text fontSize="10px" color="#94a3b8">
                  Status on Submission: <Badge size="xs" colorPalette="orange">PENDING REVIEW</Badge>
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">
                  Total Requisition Estimate
                </Text>
                <Text fontSize="lg" fontWeight="black" color={hasAnyPricedItems ? '#16a34a' : '#64748b'}>
                  {hasAnyPricedItems
                    ? `${activeCompany.currency} ${totalCalculated.toLocaleString()}`
                    : 'Unpriced at Submission'}
                </Text>
              </Box>
            </Flex>

            {/* Modal Actions */}
            <Flex justify="flex-end" gap={2} pt={2}>
              <Button size="sm" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="blue" type="submit" fontWeight="semibold">
                Submit Requisition for Review
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>

      {/* Mandatory Offices Configuration Dialog */}
      {showManageOfficesModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1500"
          bg="rgba(15, 23, 42, 0.7)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Flex align="center" gap={2}>
                <ShieldCheck size={18} color="#2563eb" />
                <Heading size="md" color="#0f172a">Mandatory Approver Offices Policy</Heading>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setShowManageOfficesModal(false)}>
                <X size={16} />
              </Button>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Select the compulsory offices that must be tagged and review any requisition raised across the company.
            </Text>

            <Stack gap={2.5} mb={4}>
              {[
                'Finance Manager',
                'Project Manager',
                'Managing Director',
                'Department Head',
                'Site Quantity Surveyor',
                'Procurement Officer',
                ...editingMandatoryOffices.filter(o => ![
                  'Finance Manager',
                  'Project Manager',
                  'Managing Director',
                  'Department Head',
                  'Site Quantity Surveyor',
                  'Procurement Officer'
                ].includes(o))
              ].map(office => {
                const isMandatory = editingMandatoryOffices.includes(office);
                return (
                  <Flex
                    key={office}
                    justify="space-between"
                    align="center"
                    p={2.5}
                    borderRadius="8px"
                    border={`1.5px solid ${isMandatory ? '#2563eb' : '#e2e8f0'}`}
                    bg={isMandatory ? '#eff6ff' : 'white'}
                    cursor="pointer"
                    onClick={() => {
                      if (isMandatory) {
                        setEditingMandatoryOffices(prev => prev.filter(o => o !== office));
                      } else {
                        setEditingMandatoryOffices(prev => [...prev, office]);
                      }
                    }}
                  >
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{office}</Text>
                      <Text fontSize="10px" color="#64748b">
                        {isMandatory ? 'Compulsory Review Gate' : 'Optional Approver'}
                      </Text>
                    </Box>
                    <Badge colorPalette={isMandatory ? 'blue' : 'gray'} size="xs">
                      {isMandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                  </Flex>
                );
              })}
            </Stack>

            {/* Custom Office Input */}
            <Flex gap={2} mb={4}>
              <Input
                size="xs"
                placeholder="Add custom office (e.g. Internal Auditor, QA/QC Lead)"
                value={newCustomOffice}
                onChange={e => setNewCustomOffice(e.target.value)}
              />
              <Button
                size="xs"
                colorPalette="blue"
                onClick={() => {
                  if (newCustomOffice.trim() && !editingMandatoryOffices.includes(newCustomOffice.trim())) {
                    setEditingMandatoryOffices(prev => [...prev, newCustomOffice.trim()]);
                    setNewCustomOffice('');
                  }
                }}
              >
                + Add
              </Button>
            </Flex>

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setShowManageOfficesModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => {
                  updateMandatoryRequisitionOffices(editingMandatoryOffices);
                  setShowManageOfficesModal(false);
                }}
              >
                Save Approver Policy
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};
