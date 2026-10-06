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
import { Project, ProjectMaterialBudget } from '../../../types';
import { Plus, Edit, Trash2, Package, DollarSign, Layers } from 'lucide-react';

interface MaterialBudgetTabProps {
  project: Project;
}

export const MaterialBudgetTab: React.FC<MaterialBudgetTabProps> = ({ project }) => {
  const { materialBudgets, addMaterialBudget, updateMaterialBudget, deleteMaterialBudget, activeCompany } = useERP();

  const currentMaterials = materialBudgets.filter(m => m.projectId === project.id);
  const totalMaterialCost = currentMaterials.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectMaterialBudget | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    materialName: '',
    category: 'Concrete & Cement',
    unit: 'Bags',
    quantity: 500,
    unitCost: 12.5,
    supplier: 'Dangote / Lafarge'
  });

  const [editForm, setEditForm] = useState<Partial<ProjectMaterialBudget>>({});

  const handleOpenAdd = () => {
    setForm({
      materialName: '',
      category: 'Concrete & Cement',
      unit: 'Bags',
      quantity: 500,
      unitCost: 12.5,
      supplier: 'Dangote / Lafarge'
    });
    setFeedback(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: ProjectMaterialBudget) => {
    setEditingItem(item);
    setEditForm({
      materialName: item.materialName,
      category: item.category || 'Concrete & Cement',
      unit: item.unit,
      quantity: item.quantity,
      unitCost: item.unitCost,
      supplier: item.supplier || ''
    });
    setFeedback(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.materialName.trim()) {
      setFeedback('Material description is required.');
      return;
    }
    const qty = Number(form.quantity);
    const rate = Number(form.unitCost);
    if (qty <= 0 || rate < 0) {
      setFeedback('Quantity must be > 0 and unit cost must be ≥ 0.');
      return;
    }

    addMaterialBudget({
      projectId: project.id,
      materialName: form.materialName.trim(),
      category: form.category,
      unit: form.unit.trim(),
      quantity: qty,
      unitCost: rate,
      totalCost: qty * rate,
      supplier: form.supplier.trim()
    });

    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editForm.materialName?.trim()) {
      setFeedback('Material description is required.');
      return;
    }
    const qty = Number(editForm.quantity);
    const rate = Number(editForm.unitCost);
    if (qty <= 0 || rate < 0) {
      setFeedback('Quantity must be > 0 and unit cost must be ≥ 0.');
      return;
    }

    updateMaterialBudget(editingItem.id, {
      materialName: editForm.materialName.trim(),
      category: editForm.category,
      unit: editForm.unit?.trim() || 'Unit',
      quantity: qty,
      unitCost: rate,
      totalCost: qty * rate,
      supplier: editForm.supplier?.trim()
    });

    setEditingItem(null);
  };

  return (
    <Stack gap={5}>
      {/* Top Banner & KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Material Budget
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {activeCompany.currency} {totalMaterialCost.toLocaleString()}
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <DollarSign size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            {currentMaterials.length} Budgeted Material Line Items
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Items Tracked
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {currentMaterials.length} Materials
              </Text>
            </Box>
            <Box p={2.5} bg="#faf5ff" color="#7c3aed" borderRadius="10px">
              <Package size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Bills of engineering materials
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Primary Material Category
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {currentMaterials[0]?.category || 'General Civil'}
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <Layers size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Key structural procurement package
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Main Material Budget Register */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Project Material Budget Schedule</Heading>
            <Text fontSize="xs" color="#64748b">
              Specified bulk building materials, unit measures, approved supply rates, and expected suppliers.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAdd}>
            <Plus size={15} /> Add Material Budget Item
          </Button>
        </Flex>

        {currentMaterials.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No material budget entries recorded for this project yet. Click "Add Material Budget Item" to begin.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Material Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Category</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Unit</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Quantity</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Unit Cost ({activeCompany.currency})</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Total Cost ({activeCompany.currency})</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Supplier</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentMaterials.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {item.materialName}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette="cyan" variant="subtle">
                      {item.category || 'General'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">
                    {item.unit}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" textAlign="right">
                    {item.quantity.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" textAlign="right">
                    {activeCompany.currency} {item.unitCost.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb" textAlign="right">
                    {activeCompany.currency} {(item.quantity * item.unitCost).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">
                    {item.supplier || 'Site Direct'}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={1.5}>
                      <Button size="xs" variant="subtle" onClick={() => handleOpenEdit(item)} title="Edit Material Item">
                        <Edit size={12} />
                      </Button>
                      <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteMaterialBudget(item.id)} title="Delete Material Item">
                        <Trash2 size={12} />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {/* Footer Total */}
        <Flex justify="space-between" align="center" p={3.5} mt={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
          <Text fontSize="xs" fontWeight="bold" color="#64748b">
            TOTAL MATERIAL BUDGET ALLOCATION ({currentMaterials.length} Items)
          </Text>
          <Text fontSize="base" fontWeight="black" color="#2563eb">
            {activeCompany.currency} {totalMaterialCost.toLocaleString()}
          </Text>
        </Flex>
      </Card.Root>

      {/* Modal: Add Material Budget */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Project Material Budget</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Specify material description, measure unit, rate, and estimated quantity.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAdd}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material Name / Description *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. High-Tensile TMT Steel Rebar 16mm"
                    value={form.materialName}
                    onChange={(e) => setForm({ ...form, materialName: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Concrete & Cement">Concrete & Cement</option>
                        <option value="Steel & Rebar">Steel & Rebar</option>
                        <option value="Aggregates & Sand">Aggregates & Sand</option>
                        <option value="Masonry & Blocks">Masonry & Blocks</option>
                        <option value="Timber & Formwork">Timber & Formwork</option>
                        <option value="Finishes & Tiles">Finishes & Tiles</option>
                        <option value="MEP & Piping">MEP & Piping</option>
                        <option value="Safety & Consumables">Safety & Consumables</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit of Measure *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Ton, Bag, m³, Pcs"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Cost ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      value={form.unitCost}
                      onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box p={3} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="#1e40af" fontWeight="medium">Calculated Line Total:</Text>
                    <Text fontSize="sm" fontWeight="bold" color="#1d4ed8">
                      {activeCompany.currency} {(Number(form.quantity || 0) * Number(form.unitCost || 0)).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supplier / Vendor</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Continental Steel Mills"
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Material Item
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit Material Budget */}
      {editingItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Material Budget Item</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update quantity, unit rate, supplier, or category.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveEdit}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Material Name / Description *</Text>
                  <Input
                    size="sm"
                    value={editForm.materialName || ''}
                    onChange={(e) => setEditForm({ ...editForm, materialName: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        <option value="Concrete & Cement">Concrete & Cement</option>
                        <option value="Steel & Rebar">Steel & Rebar</option>
                        <option value="Aggregates & Sand">Aggregates & Sand</option>
                        <option value="Masonry & Blocks">Masonry & Blocks</option>
                        <option value="Timber & Formwork">Timber & Formwork</option>
                        <option value="Finishes & Tiles">Finishes & Tiles</option>
                        <option value="MEP & Piping">MEP & Piping</option>
                        <option value="Safety & Consumables">Safety & Consumables</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit of Measure *</Text>
                    <Input
                      size="sm"
                      value={editForm.unit || ''}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      value={editForm.quantity ?? 1}
                      onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Cost ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      value={editForm.unitCost ?? 0}
                      onChange={(e) => setEditForm({ ...editForm, unitCost: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box p={3} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="#1e40af" fontWeight="medium">Calculated Line Total:</Text>
                    <Text fontSize="sm" fontWeight="bold" color="#1d4ed8">
                      {activeCompany.currency} {(Number(editForm.quantity || 0) * Number(editForm.unitCost || 0)).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supplier / Vendor</Text>
                  <Input
                    size="sm"
                    value={editForm.supplier || ''}
                    onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update Material Item
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
