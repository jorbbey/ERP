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
  Stack,
  Input,
  NativeSelect
} from '@chakra-ui/react';
import {
  FileSpreadsheet,
  Plus,
  Percent,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Edit2,
  Trash2,
  Info,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';

export interface PayrollStructureItem {
  id: string;
  name: string;
  category: 'earning' | 'deduction';
  percentage: number;
  basedOn: 'basic' | 'gross';
  description: string;
  isActive: boolean;
  isSystem?: boolean;
}

const DEFAULT_STRUCTURE: PayrollStructureItem[] = [
  {
    id: 'paye',
    name: 'PAYE Personal Income Tax',
    category: 'deduction',
    percentage: 18.0,
    basedOn: 'gross',
    description: 'Statutory personal income tax withheld per state IRS regulations',
    isActive: true,
    isSystem: true
  },
  {
    id: 'pension',
    name: 'Statutory Pension Contribution',
    category: 'deduction',
    percentage: 8.0,
    basedOn: 'basic',
    description: 'Employee pension contribution under Pension Reform Act (PRA 2014)',
    isActive: true,
    isSystem: true
  },
  {
    id: 'nhf',
    name: 'National Housing Fund (NHF)',
    category: 'deduction',
    percentage: 2.5,
    basedOn: 'basic',
    description: 'Federal Mortgage Bank / National Housing Fund statutory deduction',
    isActive: true,
    isSystem: true
  },
  {
    id: 'housing',
    name: 'Housing Subsidy Allowance',
    category: 'earning',
    percentage: 15.0,
    basedOn: 'basic',
    description: 'Standard corporate accommodation & housing allowance',
    isActive: true,
    isSystem: false
  },
  {
    id: 'transport',
    name: 'Transport & Commute Allowance',
    category: 'earning',
    percentage: 10.0,
    basedOn: 'basic',
    description: 'Daily project site and head office transit stipend',
    isActive: true,
    isSystem: false
  },
  {
    id: 'utility',
    name: 'Utility & Meal Allowance',
    category: 'earning',
    percentage: 5.0,
    basedOn: 'basic',
    description: 'Monthly utility, electricity & communication subsidy',
    isActive: true,
    isSystem: false
  },
  {
    id: 'site_hazard',
    name: 'Site Hazard & Hardship Premium',
    category: 'earning',
    percentage: 7.5,
    basedOn: 'basic',
    description: 'High-risk construction zone and remote site deployment allowance',
    isActive: true,
    isSystem: false
  }
];

const STORAGE_KEY = 'erp_payroll_structure_formula';

export const PayrollStructureTab: React.FC = () => {
  const { activeRole, payrollStructure, updatePayrollStructure } = useERP();
  const canManage = ['Managing Director', 'Finance Manager', 'Accountant', 'Super Admin'].includes(activeRole);

  const [items, setItems] = useState<PayrollStructureItem[]>(() => {
    if (payrollStructure?.items && payrollStructure.items.length > 0) {
      return payrollStructure.items as PayrollStructureItem[];
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_STRUCTURE;
  });

  React.useEffect(() => {
    if (payrollStructure?.items && payrollStructure.items.length > 0) {
      setItems(payrollStructure.items as PayrollStructureItem[]);
    }
  }, [payrollStructure]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PayrollStructureItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<Omit<PayrollStructureItem, 'id' | 'isActive'>>({
    name: '',
    category: 'earning',
    percentage: 5.0,
    basedOn: 'basic',
    description: ''
  });

  const saveToStorage = (updated: PayrollStructureItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save payroll structure:', e);
    }
    if (payrollStructure) {
      updatePayrollStructure({
        ...payrollStructure,
        items: updated as any,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleActive = (item: PayrollStructureItem) => {
    if (!canManage) return;
    const updated = items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i);
    saveToStorage(updated);
    showNotification(`"${item.name}" has been ${!item.isActive ? 'activated' : 'disabled'}.`);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const created: PayrollStructureItem = {
      ...newItem,
      id: `custom_${Date.now()}`,
      isActive: true,
      isSystem: false
    };

    const updated = [...items, created];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'earning',
      percentage: 5.0,
      basedOn: 'basic',
      description: ''
    });
    showNotification(`New payroll component "${created.name}" created successfully.`);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = items.map(i => i.id === editingItem.id ? editingItem : i);
    saveToStorage(updated);
    setEditingItem(null);
    showNotification(`Updated "${editingItem.name}" calculation rate to ${editingItem.percentage}%.`);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (!canManage) return;
    const updated = items.filter(i => i.id !== id);
    saveToStorage(updated);
    showNotification(`Removed component "${name}".`);
  };

  const handleResetDefaults = () => {
    saveToStorage(DEFAULT_STRUCTURE);
    setShowResetConfirm(false);
    showNotification('Payroll calculation formula reset to standard statutory defaults.');
  };

  // Metrics
  const activeEarnings = items.filter(i => i.category === 'earning' && i.isActive);
  const activeDeductions = items.filter(i => i.category === 'deduction' && i.isActive);
  const totalEarningsPct = activeEarnings.reduce((acc, i) => acc + i.percentage, 0);
  const totalDeductionsPct = activeDeductions.reduce((acc, i) => acc + i.percentage, 0);

  return (
    <Stack gap={6}>
      {toastMessage && (
        <Box
          p={3.5}
          borderRadius="10px"
          bg="#f0fdf4"
          border="1px solid #bbf7d0"
          color="#166534"
          fontSize="xs"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex align="center" gap={2}>
            <CheckCircle2 size={16} color="#16a34a" />
            <Text fontWeight="medium">{toastMessage}</Text>
          </Flex>
          <Button size="xs" variant="ghost" onClick={() => setToastMessage(null)}>
            <X size={14} />
          </Button>
        </Box>
      )}

      {/* Overview Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="#64748b" fontWeight="medium">Configured Allowances</Text>
              <Heading size="lg" color="#16a34a" mt={1}>{activeEarnings.length} Active</Heading>
              <Text fontSize="11px" color="#15803d" mt={0.5}>+{totalEarningsPct.toFixed(1)}% total additions</Text>
            </Box>
            <Box p={2.5} bg="#dcfce7" color="#16a34a" borderRadius="10px">
              <Plus size={20} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="#64748b" fontWeight="medium">Statutory Deductions</Text>
              <Heading size="lg" color="#dc2626" mt={1}>{activeDeductions.length} Active</Heading>
              <Text fontSize="11px" color="#b91c1c" mt={0.5}>-{totalDeductionsPct.toFixed(1)}% total deductions</Text>
            </Box>
            <Box p={2.5} bg="#fee2e2" color="#dc2626" borderRadius="10px">
              <Percent size={20} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="#64748b" fontWeight="medium">PAYE Tax Withholding</Text>
              <Heading size="lg" color="#0f172a" mt={1}>
                {items.find(i => i.id === 'paye')?.percentage || 18}%
              </Heading>
              <Text fontSize="11px" color="#64748b" mt={0.5}>Based on Gross Pay</Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <ShieldCheck size={20} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="#64748b" fontWeight="medium">Pension Act (PRA 2014)</Text>
              <Heading size="lg" color="#0f172a" mt={1}>
                {items.find(i => i.id === 'pension')?.percentage || 8}%
              </Heading>
              <Text fontSize="11px" color="#64748b" mt={0.5}>Mandatory employee rate</Text>
            </Box>
            <Box p={2.5} bg="#f8fafc" color="#475569" borderRadius="10px" border="1px solid #e2e8f0">
              <Building2 size={20} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Main Table Card */}
      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Box p={5} borderBottom="1px solid #e2e8f0">
          <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={3}>
            <Box>
              <Heading size="md" color="#0f172a">Payroll Breakdown & Statutory Structure</Heading>
              <Text fontSize="xs" color="#64748b" mt={1}>
                Configure allowances, statutory tax withholdings (PAYE), pension calculations, and housing levies.
              </Text>
            </Box>
            {canManage && (
              <Flex gap={2} wrap="wrap">
                <Button size="sm" variant="outline" onClick={() => setShowResetConfirm(true)}>
                  <RotateCcw size={14} /> Restore Defaults
                </Button>
                <Button size="sm" colorPalette="blue" onClick={() => setShowAddModal(true)}>
                  <Plus size={14} /> Add Component
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>

        <Box overflowX="auto">
          <Table.Root size="sm" striped minW="750px">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader>Component Name</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Rate (%)</Table.ColumnHeader>
                <Table.ColumnHeader>Calculation Base</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Flex align="center" gap={2.5}>
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={item.isActive ? (item.category === 'earning' ? '#16a34a' : '#dc2626') : '#cbd5e1'}
                      />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text fontSize="10px" color="#64748b" mt={0.5}>
                            {item.description}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    {item.category === 'earning' ? (
                      <Badge colorPalette="green" size="xs">Allowance / Earning (+)</Badge>
                    ) : (
                      <Badge colorPalette="red" size="xs">Statutory Deduction (-)</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={item.category === 'earning' ? 'green' : 'red'}
                      fontSize="xs"
                      fontFamily="mono"
                      px={2}
                      py={0.5}
                    >
                      {item.percentage}%
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="outline" colorPalette="gray" size="xs">
                      {item.basedOn === 'gross' ? 'Gross Remuneration' : 'Basic Salary'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      variant={item.isActive ? 'solid' : 'outline'}
                      colorPalette={item.isActive ? 'green' : 'gray'}
                      onClick={() => handleToggleActive(item)}
                      disabled={!canManage}
                    >
                      {item.isActive ? 'Active' : 'Disabled'}
                    </Button>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setEditingItem({ ...item })}
                        disabled={!canManage}
                      >
                        <Edit2 size={12} /> Edit %
                      </Button>
                      {!item.isSystem && canManage && (
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <Box p={4} bg="#f8fafc" borderTop="1px solid #e2e8f0" fontSize="xs" color="#64748b">
          <Flex align="center" gap={2}>
            <Info size={14} color="#2563eb" />
            <Text>
              Any changes made to percentages or custom items apply immediately to active payroll cycles and are saved to persistent local database storage.
            </Text>
          </Flex>
        </Box>
      </Card.Root>

      {/* Add Component Modal */}
      {showAddModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1400"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box
            bg="white"
            borderRadius="16px"
            maxW="520px"
            w="100%"
            p={{ base: 4, sm: 6 }}
            border="1px solid #e2e8f0"
            boxShadow="2xl"
            maxH="90vh"
            overflowY="auto"
          >
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Add New Payroll Component</Heading>
              <Box as="button" onClick={() => setShowAddModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define an allowance or statutory deduction rule with its calculation percentage.
            </Text>

            <form onSubmit={handleAddItem}>
              <Stack gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Item Name *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Site Hazard Stipend, Overtime Premium, Welfare Levy"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Classification Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                      >
                        <option value="earning">Earning / Allowance (+)</option>
                        <option value="deduction">Statutory Deduction (-)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Percentage Rate (%) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      step="0.1"
                      min={0.1}
                      max={100}
                      value={newItem.percentage}
                      onChange={(e) => setNewItem({ ...newItem, percentage: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Computed Based On</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={newItem.basedOn}
                      onChange={(e) => setNewItem({ ...newItem, basedOn: e.target.value as any })}
                    >
                      <option value="basic">Basic Salary (Default for Allowances & Pension)</option>
                      <option value="gross">Total Gross Remuneration (Standard for PAYE Tax)</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description / Statutory Reference</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Construction site hazard subsidy per union collective agreement"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Save Component
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Edit Component Modal */}
      {editingItem && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1400"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box
            bg="white"
            borderRadius="16px"
            maxW="520px"
            w="100%"
            p={{ base: 4, sm: 6 }}
            border="1px solid #e2e8f0"
            boxShadow="2xl"
            maxH="90vh"
            overflowY="auto"
          >
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Edit Payroll Component</Heading>
              <Box as="button" onClick={() => setEditingItem(null)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Modify percentage rate or computation rule for <strong>{editingItem.name}</strong>.
            </Text>

            <form onSubmit={handleUpdateItem}>
              <Stack gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Item Name *</Text>
                  <Input
                    size="sm"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Percentage Rate (%) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      value={editingItem.percentage}
                      onChange={(e) => setEditingItem({ ...editingItem, percentage: Number(e.target.value) })}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Computation Base</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={editingItem.basedOn}
                        onChange={(e) => setEditingItem({ ...editingItem, basedOn: e.target.value as any })}
                      >
                        <option value="basic">Basic Salary</option>
                        <option value="gross">Total Gross Remuneration</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description</Text>
                  <Input
                    size="sm"
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    Update Component
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1450"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="460px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={2}>Reset Calculation Formula?</Heading>
            <Text fontSize="sm" color="#475569" mb={4}>
              This will restore standard statutory defaults: Housing 15%, Transport 10%, Utility 5%, Site Hazard 7.5%, PAYE 18%, Pension 8%, NHF 2.5%.
            </Text>
            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="red" onClick={handleResetDefaults}>
                Yes, Restore Defaults
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default PayrollStructureTab;
