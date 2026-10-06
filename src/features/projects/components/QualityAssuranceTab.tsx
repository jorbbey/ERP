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
import { Project, ProjectQualityAssurance } from '../../../types';
import { Plus, Edit, Trash2, CheckCircle2, AlertTriangle, FileCheck, ShieldCheck } from 'lucide-react';

interface QualityAssuranceTabProps {
  project: Project;
}

export const QualityAssuranceTab: React.FC<QualityAssuranceTabProps> = ({ project }) => {
  const { qualityAssurance, addQualityAssurance, updateQualityAssurance, deleteQualityAssurance, currentUserName } = useERP();

  const currentQA = qualityAssurance
    .filter(q => q.projectId === project.id)
    .sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime());

  const passedCount = currentQA.filter(q => q.result === 'Passed').length;
  const conditionalCount = currentQA.filter(q => q.result === 'Conditional Pass').length;
  const reworkCount = currentQA.filter(q => q.result === 'Failed' || q.result === 'Rework Required').length;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectQualityAssurance | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    inspectionDate: new Date().toISOString().split('T')[0],
    inspector: currentUserName,
    inspectionScope: '',
    result: 'Passed' as ProjectQualityAssurance['result'],
    defectsFound: '',
    correctiveAction: '',
    remarks: ''
  });

  const [editForm, setEditForm] = useState<Partial<ProjectQualityAssurance>>({});

  const handleOpenAdd = () => {
    setForm({
      inspectionDate: new Date().toISOString().split('T')[0],
      inspector: currentUserName,
      inspectionScope: '',
      result: 'Passed',
      defectsFound: '',
      correctiveAction: '',
      remarks: ''
    });
    setFeedback(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: ProjectQualityAssurance) => {
    setEditingItem(item);
    setEditForm({
      inspectionDate: item.inspectionDate,
      inspector: item.inspector,
      inspectionScope: item.inspectionScope,
      result: item.result,
      defectsFound: item.defectsFound || '',
      correctiveAction: item.correctiveAction || '',
      remarks: item.remarks || ''
    });
    setFeedback(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.inspectionScope.trim()) {
      setFeedback('Scope of inspection is required.');
      return;
    }

    addQualityAssurance({
      projectId: project.id,
      inspectionDate: form.inspectionDate,
      inspector: form.inspector.trim(),
      inspectionScope: form.inspectionScope.trim(),
      result: form.result,
      defectsFound: form.defectsFound.trim(),
      correctiveAction: form.correctiveAction.trim(),
      remarks: form.remarks.trim()
    });

    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editForm.inspectionScope?.trim()) {
      setFeedback('Scope of inspection is required.');
      return;
    }

    updateQualityAssurance(editingItem.id, {
      inspectionDate: editForm.inspectionDate,
      inspector: editForm.inspector?.trim(),
      inspectionScope: editForm.inspectionScope.trim(),
      result: editForm.result,
      defectsFound: editForm.defectsFound?.trim(),
      correctiveAction: editForm.correctiveAction?.trim(),
      remarks: editForm.remarks?.trim()
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
                Inspections Passed
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {passedCount} Passed
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <CheckCircle2 size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Full quality standard conformity
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Conditional Pass
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>
                {conditionalCount} Conditional
              </Text>
            </Box>
            <Box p={2.5} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <AlertTriangle size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Minor non-conformance tracked
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Rework / Remediation Required
              </Text>
              <Text fontSize="xl" fontWeight="black" color={reworkCount > 0 ? '#dc2626' : '#16a34a'} mt={1}>
                {reworkCount} Requiring Action
              </Text>
            </Box>
            <Box p={2.5} bg={reworkCount > 0 ? '#fef2f2' : '#f0fdf4'} color={reworkCount > 0 ? '#dc2626' : '#16a34a'} borderRadius="10px">
              <ShieldCheck size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Quality corrective action orders
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Main QA Register */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Quality Assurance (QA) & Materials Compliance</Heading>
            <Text fontSize="xs" color="#64748b">
              Inspections of structural rebar cover, concrete slump tests, cube breaks, and weld seams.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAdd}>
            <Plus size={15} /> Log QA Inspection
          </Button>
        </Flex>

        {currentQA.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No QA inspections recorded for this project yet. Click "Log QA Inspection" to document quality verification.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Inspection Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Inspector / Consulting Agency</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Inspection Scope / Element</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Result</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Findings / Action Taken</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentQA.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell fontSize="xs" color="#64748b" fontWeight="semibold">
                    {item.inspectionDate}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#0f172a" fontWeight="medium">
                    {item.inspector}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {item.inspectionScope}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="xs"
                      colorPalette={
                        item.result === 'Passed' ? 'green' :
                        item.result === 'Conditional Pass' ? 'yellow' : 'red'
                      }
                    >
                      {item.result}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">
                    {item.defectsFound ? (
                      <Box>
                        <Text color="#dc2626" fontSize="11px">Findings: {item.defectsFound}</Text>
                        {item.correctiveAction && (
                          <Text color="#16a34a" fontSize="11px">Action: {item.correctiveAction}</Text>
                        )}
                      </Box>
                    ) : (
                      <Text color="#16a34a">{item.remarks || 'Standard pass certificate signed.'}</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={1.5}>
                      <Button size="xs" variant="subtle" onClick={() => handleOpenEdit(item)} title="Edit QA Item">
                        <Edit size={12} />
                      </Button>
                      <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteQualityAssurance(item.id)} title="Delete QA Item">
                        <Trash2 size={12} />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card.Root>

      {/* Modal: Add QA Inspection */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Record Quality Assurance Inspection</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Document physical inspection parameters, testing results, and corrective actions.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAdd}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspection Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={form.inspectionDate}
                      onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspector / Agency *</Text>
                    <Input
                      size="sm"
                      value={form.inspector}
                      onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Scope of Inspection / Structural Element *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Pier 3 Concrete Reinforcement Rebar Cage Spacing & Cover Spacers"
                    value={form.inspectionScope}
                    onChange={(e) => setForm({ ...form, inspectionScope: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspection Result *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.result}
                      onChange={(e) => setForm({ ...form, result: e.target.value as any })}
                    >
                      <option value="Passed">Passed</option>
                      <option value="Conditional Pass">Conditional Pass</option>
                      <option value="Rework Required">Rework Required</option>
                      <option value="Failed">Failed</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Defects Found (if any)</Text>
                  <Input
                    size="sm"
                    placeholder="Describe any non-conformances observed..."
                    value={form.defectsFound}
                    onChange={(e) => setForm({ ...form, defectsFound: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Corrective Action / Remediation Required</Text>
                  <Input
                    size="sm"
                    placeholder="Describe required remediation or rectification..."
                    value={form.correctiveAction}
                    onChange={(e) => setForm({ ...form, correctiveAction: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Remarks / Notes</Text>
                  <Input
                    size="sm"
                    placeholder="Additional testing certificates or lab batch notes..."
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save QA Inspection
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit QA Inspection */}
      {editingItem && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit QA Inspection</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update inspection findings, result, or corrective actions.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveEdit}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspection Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={editForm.inspectionDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, inspectionDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspector / Agency *</Text>
                    <Input
                      size="sm"
                      value={editForm.inspector || ''}
                      onChange={(e) => setEditForm({ ...editForm, inspector: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Scope of Inspection / Element *</Text>
                  <Input
                    size="sm"
                    value={editForm.inspectionScope || ''}
                    onChange={(e) => setEditForm({ ...editForm, inspectionScope: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Inspection Result *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={editForm.result}
                      onChange={(e) => setEditForm({ ...editForm, result: e.target.value as any })}
                    >
                      <option value="Passed">Passed</option>
                      <option value="Conditional Pass">Conditional Pass</option>
                      <option value="Rework Required">Rework Required</option>
                      <option value="Failed">Failed</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Defects Found</Text>
                  <Input
                    size="sm"
                    value={editForm.defectsFound || ''}
                    onChange={(e) => setEditForm({ ...editForm, defectsFound: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Corrective Action Taken</Text>
                  <Input
                    size="sm"
                    value={editForm.correctiveAction || ''}
                    onChange={(e) => setEditForm({ ...editForm, correctiveAction: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Remarks</Text>
                  <Input
                    size="sm"
                    value={editForm.remarks || ''}
                    onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update QA Record
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
