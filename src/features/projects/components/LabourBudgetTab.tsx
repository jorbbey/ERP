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
import { Project, ProjectLabourBudget } from '../../../types';
import { Plus, Edit, Trash2, Users, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

interface LabourBudgetTabProps {
  project: Project;
}

export const LabourBudgetTab: React.FC<LabourBudgetTabProps> = ({ project }) => {
  const { labourBudgets, addLabourBudget, updateLabourBudget, deleteLabourBudget, activeCompany } = useERP();

  const currentLabour = labourBudgets.filter(l => l.projectId === project.id);
  const totalLabourCost = currentLabour.reduce((sum, l) => sum + (l.quantity * l.unitRate), 0);
  const totalLabourDays = currentLabour.reduce((sum, l) => sum + l.quantity, 0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectLabourBudget | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    taskName: '',
    labourType: 'Formwork Carpenters',
    quantity: 30,
    unitRate: 85,
    notes: ''
  });

  const [editForm, setEditForm] = useState<Partial<ProjectLabourBudget>>({});

  const handleOpenAdd = () => {
    setForm({
      taskName: '',
      labourType: 'Formwork Carpenters',
      quantity: 30,
      unitRate: 85,
      notes: ''
    });
    setFeedback(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: ProjectLabourBudget) => {
    setEditingItem(item);
    setEditForm({
      taskName: item.taskName,
      labourType: item.labourType,
      quantity: item.quantity,
      unitRate: item.unitRate,
      notes: item.notes || ''
    });
    setFeedback(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.taskName.trim()) {
      setFeedback('Task / trade scope is required.');
      return;
    }
    const qty = Number(form.quantity);
    const rate = Number(form.unitRate);
    if (qty <= 0 || rate < 0) {
      setFeedback('Quantity must be > 0 and unit rate must be ≥ 0.');
      return;
    }

    addLabourBudget({
      projectId: project.id,
      taskName: form.taskName.trim(),
      labourType: form.labourType,
      quantity: qty,
      unitRate: rate,
      totalCost: qty * rate,
      notes: form.notes.trim()
    });

    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editForm.taskName?.trim()) {
      setFeedback('Task / trade scope is required.');
      return;
    }
    const qty = Number(editForm.quantity);
    const rate = Number(editForm.unitRate);
    if (qty <= 0 || rate < 0) {
      setFeedback('Quantity must be > 0 and unit rate must be ≥ 0.');
      return;
    }

    updateLabourBudget(editingItem.id, {
      taskName: editForm.taskName.trim(),
      labourType: editForm.labourType,
      quantity: qty,
      unitRate: rate,
      totalCost: qty * rate,
      notes: editForm.notes?.trim()
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
                Total Labour Budget
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {activeCompany.currency} {totalLabourCost.toLocaleString()}
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <DollarSign size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            {currentLabour.length} Allocated Trades / Tasks
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Budgeted Labour Units / Days
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {totalLabourDays.toLocaleString()} Man-Days
              </Text>
            </Box>
            <Box p={2.5} bg="#faf5ff" color="#7c3aed" borderRadius="10px">
              <Users size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Crew workforce allocation
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Avg. Daily Rate
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {activeCompany.currency} {totalLabourDays > 0 ? Math.round(totalLabourCost / totalLabourDays).toLocaleString() : '0'} / Day
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <Clock size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Weighted average trade rate
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Main Labour Budget Register */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Project Labour Budget & Crew Allocation</Heading>
            <Text fontSize="xs" color="#64748b">
              Detailed task-based labor rates, skill trades, estimated man-days, and total wage commitments.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAdd}>
            <Plus size={15} /> Add Labour Budget Item
          </Button>
        </Flex>

        {currentLabour.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No labour budget entries recorded for this project yet. Click "Add Labour Budget Item" to begin.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Task Scope</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Labour Trade / Category</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Man-Days / Qty</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Unit Rate ({activeCompany.currency})</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Total Cost ({activeCompany.currency})</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Notes</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentLabour.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {item.taskName}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette="blue" variant="subtle">
                      {item.labourType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" textAlign="right">
                    {item.quantity.toLocaleString()} Days
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" textAlign="right">
                    {activeCompany.currency} {item.unitRate.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb" textAlign="right">
                    {activeCompany.currency} {(item.quantity * item.unitRate).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">
                    {item.notes || 'Standard task staffing'}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={1.5}>
                      <Button size="xs" variant="subtle" onClick={() => handleOpenEdit(item)} title="Edit Labour Item">
                        <Edit size={12} />
                      </Button>
                      <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteLabourBudget(item.id)} title="Delete Labour Item">
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
            TOTAL LABOUR BUDGET ALLOCATION ({currentLabour.length} Items)
          </Text>
          <Text fontSize="base" fontWeight="black" color="#2563eb">
            {activeCompany.currency} {totalLabourCost.toLocaleString()}
          </Text>
        </Flex>
      </Card.Root>

      {/* Modal: Add Labour Budget */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Project Labour Budget</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Specify task scope, trade category, man-days, and rate per day.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAdd}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Name / Work Package *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Pier Cap Shuttering & Scaffolding"
                    value={form.taskName}
                    onChange={(e) => setForm({ ...form, taskName: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Labour Trade / Category *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.labourType}
                      onChange={(e) => setForm({ ...form, labourType: e.target.value })}
                    >
                      <option value="Formwork Carpenters">Formwork Carpenters</option>
                      <option value="Steel Fixers & Iron Benders">Steel Fixers & Iron Benders</option>
                      <option value="Concrete Masons & Vibrator Operators">Concrete Masons & Vibrator Operators</option>
                      <option value="Tower Crane Operators & Riggers">Tower Crane Operators & Riggers</option>
                      <option value="Bricklayers & Block Masons">Bricklayers & Block Masons</option>
                      <option value="Scaffold Erectors">Scaffold Erectors</option>
                      <option value="Welders & Structural Fitters">Welders & Structural Fitters</option>
                      <option value="General Field Labourers">General Field Labourers</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity (Man-Days) *</Text>
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
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Daily Rate ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      value={form.unitRate}
                      onChange={(e) => setForm({ ...form, unitRate: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box p={3} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="#1e40af" fontWeight="medium">Calculated Line Total:</Text>
                    <Text fontSize="sm" fontWeight="bold" color="#1d4ed8">
                      {activeCompany.currency} {(Number(form.quantity || 0) * Number(form.unitRate || 0)).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes / Specifications</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Overtime requirements or special certification notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Labour Item
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit Labour Budget */}
      {editingItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Labour Budget Item</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update trade, man-days, daily rate, or task scope.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveEdit}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Name / Work Package *</Text>
                  <Input
                    size="sm"
                    value={editForm.taskName || ''}
                    onChange={(e) => setEditForm({ ...editForm, taskName: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Labour Trade / Category *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={editForm.labourType}
                      onChange={(e) => setEditForm({ ...editForm, labourType: e.target.value })}
                    >
                      <option value="Formwork Carpenters">Formwork Carpenters</option>
                      <option value="Steel Fixers & Iron Benders">Steel Fixers & Iron Benders</option>
                      <option value="Concrete Masons & Vibrator Operators">Concrete Masons & Vibrator Operators</option>
                      <option value="Tower Crane Operators & Riggers">Tower Crane Operators & Riggers</option>
                      <option value="Bricklayers & Block Masons">Bricklayers & Block Masons</option>
                      <option value="Scaffold Erectors">Scaffold Erectors</option>
                      <option value="Welders & Structural Fitters">Welders & Structural Fitters</option>
                      <option value="General Field Labourers">General Field Labourers</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity (Man-Days) *</Text>
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
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Daily Rate ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      value={editForm.unitRate ?? 0}
                      onChange={(e) => setEditForm({ ...editForm, unitRate: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box p={3} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="#1e40af" fontWeight="medium">Calculated Line Total:</Text>
                    <Text fontSize="sm" fontWeight="bold" color="#1d4ed8">
                      {activeCompany.currency} {(Number(editForm.quantity || 0) * Number(editForm.unitRate || 0)).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes</Text>
                  <Input
                    size="sm"
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update Labour Item
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
