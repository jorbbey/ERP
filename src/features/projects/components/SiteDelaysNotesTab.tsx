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
import { Project, ProjectDelayLog, ProjectDelayNote } from '../../../types';
import { Plus, Edit, Trash2, AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SiteDelaysNotesTabProps {
  project: Project;
}

export const SiteDelaysNotesTab: React.FC<SiteDelaysNotesTabProps> = ({ project }) => {
  const {
    delayLogs,
    addDelayLog,
    delayNotes,
    addDelayNote,
    updateDelayNote,
    deleteDelayNote
  } = useERP();

  const currentDelays = delayLogs
    .filter(d => d.projectId === project.id)
    .sort((a, b) => new Date(b.delayDate).getTime() - new Date(a.delayDate).getTime());

  const currentDelayNotes = delayNotes
    .filter(n => n.projectId === project.id)
    .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());

  const totalDelayDays = currentDelays.reduce((sum, d) => sum + d.delayDays, 0);
  const openNotesCount = currentDelayNotes.filter(n => n.status === 'open').length;
  const monitoringCount = currentDelayNotes.filter(n => n.status === 'monitoring').length;

  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'notes'>('logs');

  // Delay Log Modal State
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [logFeedback, setLogFeedback] = useState<string | null>(null);

  const [logForm, setLogForm] = useState({
    delayDate: new Date().toISOString().split('T')[0],
    delayDays: 3,
    reason: 'Severe Monsoon Rain & Site Flash Flooding',
    details: 'Excavation trenches waterlogged; required 48 hours continuous diesel pumping to restore access.'
  });

  // Delay Note Modal State
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectDelayNote | null>(null);
  const [noteFeedback, setNoteFeedback] = useState<string | null>(null);

  const [noteForm, setNoteForm] = useState({
    logDate: new Date().toISOString().split('T')[0],
    issueSummary: '',
    impact: 'Reduced productivity on critical path',
    actionTaken: 'Deployed emergency mitigation measures',
    status: 'open' as ProjectDelayNote['status']
  });

  const [noteEditForm, setNoteEditForm] = useState<Partial<ProjectDelayNote>>({});

  // Handlers - Logs
  const handleOpenAddLog = () => {
    setLogForm({
      delayDate: new Date().toISOString().split('T')[0],
      delayDays: 3,
      reason: 'Severe Monsoon Rain & Site Flash Flooding',
      details: 'Excavation trenches waterlogged; required 48 hours continuous diesel pumping to restore access.'
    });
    setLogFeedback(null);
    setShowAddLogModal(true);
  };

  const handleSaveAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.reason.trim()) {
      setLogFeedback('Delay reason is required.');
      return;
    }
    const days = Number(logForm.delayDays);
    if (days <= 0) {
      setLogFeedback('Delay days impacted must be at least 1 day.');
      return;
    }

    addDelayLog({
      projectId: project.id,
      delayDate: logForm.delayDate,
      delayDays: days,
      reason: logForm.reason.trim(),
      details: logForm.details.trim()
    });

    setShowAddLogModal(false);
  };

  // Handlers - Notes
  const handleOpenAddNote = () => {
    setNoteForm({
      logDate: new Date().toISOString().split('T')[0],
      issueSummary: '',
      impact: 'Reduced productivity on critical path',
      actionTaken: 'Deployed emergency mitigation measures',
      status: 'open'
    });
    setNoteFeedback(null);
    setShowAddNoteModal(true);
  };

  const handleOpenEditNote = (n: ProjectDelayNote) => {
    setEditingNote(n);
    setNoteEditForm({
      logDate: n.logDate,
      issueSummary: n.issueSummary,
      impact: n.impact || '',
      actionTaken: n.actionTaken || '',
      status: n.status
    });
    setNoteFeedback(null);
  };

  const handleSaveAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.issueSummary.trim()) {
      setNoteFeedback('Delay issue summary is required.');
      return;
    }

    addDelayNote({
      projectId: project.id,
      logDate: noteForm.logDate,
      issueSummary: noteForm.issueSummary.trim(),
      impact: noteForm.impact.trim(),
      actionTaken: noteForm.actionTaken.trim(),
      status: noteForm.status
    });

    setShowAddNoteModal(false);
  };

  const handleSaveEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    if (!noteEditForm.issueSummary?.trim()) {
      setNoteFeedback('Delay issue summary is required.');
      return;
    }

    updateDelayNote(editingNote.id, {
      logDate: noteEditForm.logDate,
      issueSummary: noteEditForm.issueSummary.trim(),
      impact: noteEditForm.impact?.trim(),
      actionTaken: noteEditForm.actionTaken?.trim(),
      status: noteEditForm.status
    });

    setEditingNote(null);
  };

  return (
    <Stack gap={5}>
      {/* Top Banner KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Schedule Delay Days
              </Text>
              <Text fontSize="xl" fontWeight="black" color={totalDelayDays > 0 ? '#dc2626' : '#16a34a'} mt={1}>
                {totalDelayDays > 0 ? `+${totalDelayDays} Days Lost` : '0 Days (On Time)'}
              </Text>
            </Box>
            <Box p={2.5} bg={totalDelayDays > 0 ? '#fef2f2' : '#f0fdf4'} color={totalDelayDays > 0 ? '#dc2626' : '#16a34a'} borderRadius="10px">
              <Clock size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            {currentDelays.length} Documented delay events
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Open Site Delay Notes
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>
                {openNotesCount} Open Issues
              </Text>
            </Box>
            <Box p={2.5} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <AlertTriangle size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Requires active dispute/EOT mitigation
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Under Monitoring
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {monitoringCount} Under Review
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <ShieldAlert size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#2563eb" fontWeight="medium" mt={2}>
            Site weather & supply risk watch
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Sub-Tabs Toggle */}
      <Flex bg="#f1f5f9" p={1} borderRadius="10px" gap={1} maxW="380px">
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'logs' ? 'white' : 'transparent'}
          color={activeSubTab === 'logs' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'logs' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'logs' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('logs')}
        >
          <AlertTriangle size={14} /> Delay Logs & EOT ({currentDelays.length})
        </Button>
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'notes' ? 'white' : 'transparent'}
          color={activeSubTab === 'notes' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'notes' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'notes' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('notes')}
        >
          <Clock size={14} /> Delay Notes Register ({currentDelayNotes.length})
        </Button>
      </Flex>

      {/* VIEW 1: DELAY LOGS */}
      {activeSubTab === 'logs' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Extension of Time (EOT) & Schedule Delay Logs</Heading>
              <Text fontSize="xs" color="#64748b">
                Formal delay occurrences with certified impact days impacting target project completion.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAddLog}>
              <Plus size={15} /> Record Delay Event
            </Button>
          </Flex>

          {currentDelays.length === 0 ? (
            <Box py={8} textAlign="center" color="#16a34a" fontSize="xs" fontWeight="medium">
              Zero delays recorded for this project! Schedule execution is on track.
            </Box>
          ) : (
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Occurrence Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Days Lost</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Primary Reason / Trigger</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Detailed Impact Notes</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentDelays.map((d) => (
                  <Table.Row key={d.id}>
                    <Table.Cell fontSize="xs" color="#64748b" fontWeight="semibold">
                      {d.delayDate}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="red" size="xs">+{d.delayDays} Days</Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      {d.reason}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">
                      {d.details || 'N/A'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Card.Root>
      )}

      {/* VIEW 2: DELAY NOTES */}
      {activeSubTab === 'notes' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Site Delay Notes & Mitigation Register</Heading>
              <Text fontSize="xs" color="#64748b">
                Ongoing site delay notices with issue summaries, critical path impacts, and actions taken.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAddNote}>
              <Plus size={15} /> Add Delay Note
            </Button>
          </Flex>

          {currentDelayNotes.length === 0 ? (
            <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
              No delay notes recorded for this project yet.
            </Box>
          ) : (
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Issue Summary</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Critical Path Impact</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Action Taken / Mitigated</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentDelayNotes.map((n) => (
                  <Table.Row key={n.id}>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {n.logDate}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      {n.issueSummary}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">
                      {n.impact || 'Under assessment'}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#16a34a">
                      {n.actionTaken || 'None specified'}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="xs"
                        colorPalette={
                          n.status === 'resolved' ? 'green' :
                          n.status === 'monitoring' ? 'blue' : 'yellow'
                        }
                      >
                        {n.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={1.5}>
                        <Button size="xs" variant="subtle" onClick={() => handleOpenEditNote(n)} title="Edit Note">
                          <Edit size={12} />
                        </Button>
                        <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteDelayNote(n.id)} title="Delete Note">
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
      )}

      {/* Modal: Record Delay Event */}
      {showAddLogModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Record Site Delay Event</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Document certified delay event and days added to overall schedule.</Text>

            {logFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {logFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveAddLog}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Delay Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={logForm.delayDate}
                      onChange={(e) => setLogForm({ ...logForm, delayDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Days Lost *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      value={logForm.delayDays}
                      onChange={(e) => setLogForm({ ...logForm, delayDays: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Primary Reason / Trigger *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Uncharted Underground High-Voltage Cable Line"
                    value={logForm.reason}
                    onChange={(e) => setLogForm({ ...logForm, reason: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Detailed Impact & Remediation Notes</Text>
                  <Input
                    size="sm"
                    placeholder="Describe impact on critical path and actions taken..."
                    value={logForm.details}
                    onChange={(e) => setLogForm({ ...logForm, details: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddLogModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Record Delay
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Add Delay Note */}
      {showAddNoteModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Site Delay Note</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Document site delay issue and mitigation measures taken.</Text>

            {noteFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {noteFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveAddNote}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Log Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={noteForm.logDate}
                      onChange={(e) => setNoteForm({ ...noteForm, logDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={noteForm.status}
                        onChange={(e) => setNoteForm({ ...noteForm, status: e.target.value as any })}
                      >
                        <option value="open">Open</option>
                        <option value="monitoring">Monitoring</option>
                        <option value="resolved">Resolved</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Issue Summary *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Concrete supplier truck mixer breakdown during pour"
                    value={noteForm.issueSummary}
                    onChange={(e) => setNoteForm({ ...noteForm, issueSummary: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Critical Path Impact</Text>
                  <Input
                    size="sm"
                    placeholder="Describe impact on schedule..."
                    value={noteForm.impact}
                    onChange={(e) => setNoteForm({ ...noteForm, impact: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Action Taken / Mitigated</Text>
                  <Input
                    size="sm"
                    placeholder="Describe corrective actions taken..."
                    value={noteForm.actionTaken}
                    onChange={(e) => setNoteForm({ ...noteForm, actionTaken: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddNoteModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Delay Note
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit Delay Note */}
      {editingNote && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Site Delay Note</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update status, mitigation actions, or issue description.</Text>

            {noteFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {noteFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveEditNote}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Log Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={noteEditForm.logDate || ''}
                      onChange={(e) => setNoteEditForm({ ...noteEditForm, logDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={noteEditForm.status}
                        onChange={(e) => setNoteEditForm({ ...noteEditForm, status: e.target.value as any })}
                      >
                        <option value="open">Open</option>
                        <option value="monitoring">Monitoring</option>
                        <option value="resolved">Resolved</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Issue Summary *</Text>
                  <Input
                    size="sm"
                    value={noteEditForm.issueSummary || ''}
                    onChange={(e) => setNoteEditForm({ ...noteEditForm, issueSummary: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Critical Path Impact</Text>
                  <Input
                    size="sm"
                    value={noteEditForm.impact || ''}
                    onChange={(e) => setNoteEditForm({ ...noteEditForm, impact: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Action Taken / Mitigated</Text>
                  <Input
                    size="sm"
                    value={noteEditForm.actionTaken || ''}
                    onChange={(e) => setNoteEditForm({ ...noteEditForm, actionTaken: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update Delay Note
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
