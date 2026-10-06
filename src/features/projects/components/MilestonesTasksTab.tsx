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
  Progress,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Project, ProjectMilestone, ProjectTask } from '../../../types';
import { Plus, Edit, Trash2, CheckCircle2, Flag, CheckSquare, Clock } from 'lucide-react';

interface MilestonesTasksTabProps {
  project: Project;
}

export const MilestonesTasksTab: React.FC<MilestonesTasksTabProps> = ({ project }) => {
  const {
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    projectTasks,
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
    employees,
    currentUserName
  } = useERP();

  const currentMilestones = milestones.filter(m => m.projectId === project.id);
  const currentTasks = projectTasks.filter(t => t.projectId === project.id);

  const completedMilestones = currentMilestones.filter(m => m.status === 'completed').length;
  const completedTasks = currentTasks.filter(t => t.status === 'completed').length;

  const [activeSubTab, setActiveSubTab] = useState<'milestones' | 'tasks'>('milestones');

  // Milestone Modal State
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | null>(null);
  const [milestoneFeedback, setMilestoneFeedback] = useState<string | null>(null);

  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    status: 'pending' as ProjectMilestone['status'],
    progressPercent: 0,
    notes: ''
  });

  const [milestoneEditForm, setMilestoneEditForm] = useState<Partial<ProjectMilestone>>({});

  // Task Modal State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [taskFeedback, setTaskFeedback] = useState<string | null>(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: currentUserName,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    priority: 'Medium' as ProjectTask['priority'],
    status: 'pending' as ProjectTask['status'],
    progressPercent: 0
  });

  const [taskEditForm, setTaskEditForm] = useState<Partial<ProjectTask>>({});

  // Handlers - Milestones
  const handleOpenAddMilestone = () => {
    setMilestoneForm({
      name: '',
      dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      progressPercent: 0,
      notes: ''
    });
    setMilestoneFeedback(null);
    setShowAddMilestoneModal(true);
  };

  const handleOpenEditMilestone = (m: ProjectMilestone) => {
    setEditingMilestone(m);
    setMilestoneEditForm({
      name: m.name,
      dueDate: m.dueDate,
      status: m.status,
      progressPercent: m.progressPercent || 0,
      notes: m.notes || ''
    });
    setMilestoneFeedback(null);
  };

  const handleSaveAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.name.trim()) {
      setMilestoneFeedback('Milestone name is required.');
      return;
    }

    addMilestone({
      projectId: project.id,
      name: milestoneForm.name.trim(),
      dueDate: milestoneForm.dueDate,
      status: milestoneForm.status,
      progressPercent: Number(milestoneForm.progressPercent),
      notes: milestoneForm.notes.trim()
    });

    setShowAddMilestoneModal(false);
  };

  const handleSaveEditMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    if (!milestoneEditForm.name?.trim()) {
      setMilestoneFeedback('Milestone name is required.');
      return;
    }

    updateMilestone(editingMilestone.id, {
      name: milestoneEditForm.name.trim(),
      dueDate: milestoneEditForm.dueDate,
      status: milestoneEditForm.status,
      progressPercent: Number(milestoneEditForm.progressPercent),
      notes: milestoneEditForm.notes?.trim()
    });

    setEditingMilestone(null);
  };

  // Handlers - Tasks
  const handleOpenAddTask = () => {
    setTaskForm({
      title: '',
      description: '',
      assignedTo: currentUserName,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      priority: 'Medium',
      status: 'pending',
      progressPercent: 0
    });
    setTaskFeedback(null);
    setShowAddTaskModal(true);
  };

  const handleOpenEditTask = (t: ProjectTask) => {
    setEditingTask(t);
    setTaskEditForm({
      title: t.title,
      description: t.description || '',
      assignedTo: t.assignedTo,
      dueDate: t.dueDate,
      priority: t.priority || 'Medium',
      status: t.status,
      progressPercent: t.progressPercent || 0
    });
    setTaskFeedback(null);
  };

  const handleSaveAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      setTaskFeedback('Task title is required.');
      return;
    }

    addProjectTask({
      projectId: project.id,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      status: taskForm.status,
      progressPercent: Number(taskForm.progressPercent)
    });

    setShowAddTaskModal(false);
  };

  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!taskEditForm.title?.trim()) {
      setTaskFeedback('Task title is required.');
      return;
    }

    updateProjectTask(editingTask.id, {
      title: taskEditForm.title.trim(),
      description: taskEditForm.description?.trim(),
      assignedTo: taskEditForm.assignedTo,
      dueDate: taskEditForm.dueDate,
      priority: taskEditForm.priority,
      status: taskEditForm.status,
      progressPercent: Number(taskEditForm.progressPercent)
    });

    setEditingTask(null);
  };

  return (
    <Stack gap={5}>
      {/* Top Banner KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Milestones Target
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {completedMilestones} / {currentMilestones.length} Reached
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <Flag size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Key structural completion gates
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Field Tasks Completed
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {completedTasks} / {currentTasks.length} Completed
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <CheckSquare size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Detailed engineer punch-list items
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Active Pending Tasks
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>
                {currentTasks.filter(t => t.status !== 'completed').length} Pending
              </Text>
            </Box>
            <Box p={2.5} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <Clock size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#d97706" fontWeight="medium" mt={2}>
            Requires on-site execution
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Sub-Tabs Toggle */}
      <Flex bg="#f1f5f9" p={1} borderRadius="10px" gap={1} maxW="360px">
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'milestones' ? 'white' : 'transparent'}
          color={activeSubTab === 'milestones' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'milestones' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'milestones' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('milestones')}
        >
          <Flag size={14} /> Project Milestones ({currentMilestones.length})
        </Button>
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'tasks' ? 'white' : 'transparent'}
          color={activeSubTab === 'tasks' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'tasks' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'tasks' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('tasks')}
        >
          <CheckSquare size={14} /> Field Tasks ({currentTasks.length})
        </Button>
      </Flex>

      {/* VIEW 1: MILESTONES */}
      {activeSubTab === 'milestones' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Project Milestones Register</Heading>
              <Text fontSize="xs" color="#64748b">
                High-level structural deliverables and target hand-over phases.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAddMilestone}>
              <Plus size={15} /> Add Milestone
            </Button>
          </Flex>

          {currentMilestones.length === 0 ? (
            <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
              No milestones defined for this project yet.
            </Box>
          ) : (
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Milestone Name</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Target Due Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Physical Progress</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Notes / Scope</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentMilestones.map((m) => (
                  <Table.Row key={m.id}>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      {m.name}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {m.dueDate}
                    </Table.Cell>
                    <Table.Cell minW="110px">
                      <Flex justify="space-between" fontSize="10px" mb={1}>
                        <Text color="#64748b">{m.progressPercent || 0}%</Text>
                      </Flex>
                      <Progress.Root value={m.progressPercent || 0} size="xs" colorPalette="blue">
                        <Progress.Track bg="#e2e8f0" borderRadius="full">
                          <Progress.Range borderRadius="full" />
                        </Progress.Track>
                      </Progress.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size="xs" colorPalette={m.status === 'completed' ? 'green' : 'blue'}>
                        {m.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b" maxW="250px">
                      {m.notes || 'Deliverable milestone'}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={1.5}>
                        <Button size="xs" variant="subtle" onClick={() => handleOpenEditMilestone(m)} title="Edit Milestone">
                          <Edit size={12} />
                        </Button>
                        <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteMilestone(m.id)} title="Delete Milestone">
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

      {/* VIEW 2: FIELD TASKS */}
      {activeSubTab === 'tasks' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Field Construction Tasks & Punch-List</Heading>
              <Text fontSize="xs" color="#64748b">
                Daily field task assignments delegated to site engineers and foremen.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAddTask}>
              <Plus size={15} /> Create Field Task
            </Button>
          </Flex>

          {currentTasks.length === 0 ? (
            <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
              No field tasks assigned for this project yet. Click "Create Field Task" to delegate action items.
            </Box>
          ) : (
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Task Title</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Assigned Engineer</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Due Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Priority</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentTasks.map((t) => (
                  <Table.Row key={t.id}>
                    <Table.Cell>
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{t.title}</Text>
                      {t.description && <Text fontSize="10px" color="#64748b" mt={0.5}>{t.description}</Text>}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">{t.assignedTo}</Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">{t.dueDate}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="xs"
                        colorPalette={
                          t.priority === 'Critical' ? 'red' :
                          t.priority === 'High' ? 'orange' :
                          t.priority === 'Medium' ? 'blue' : 'gray'
                        }
                      >
                        {t.priority}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="xs"
                        colorPalette={
                          t.status === 'completed' ? 'green' :
                          t.status === 'in_progress' ? 'blue' : 'yellow'
                        }
                      >
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={1.5}>
                        <Button size="xs" variant="subtle" onClick={() => handleOpenEditTask(t)} title="Edit Task">
                          <Edit size={12} />
                        </Button>
                        <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteProjectTask(t.id)} title="Delete Task">
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

      {/* Modal: Add Milestone */}
      {showAddMilestoneModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Define Project Milestone</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Set critical completion milestone gate and target finish date.</Text>

            {milestoneFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {milestoneFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveAddMilestone}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Milestone Title *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Substructure Abutments & Pier Caps Complete"
                    value={milestoneForm.name}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Target Due Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={milestoneForm.dueDate}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={milestoneForm.status}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value as any })}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes / Verification Criteria</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Independent engineering certificate required"
                    value={milestoneForm.notes}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMilestoneModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Milestone
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit Milestone */}
      {editingMilestone && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Project Milestone</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update milestone deliverable, progress %, or due date.</Text>

            {milestoneFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {milestoneFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveEditMilestone}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Milestone Title *</Text>
                  <Input
                    size="sm"
                    value={milestoneEditForm.name || ''}
                    onChange={(e) => setMilestoneEditForm({ ...milestoneEditForm, name: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Target Due Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={milestoneEditForm.dueDate || ''}
                      onChange={(e) => setMilestoneEditForm({ ...milestoneEditForm, dueDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={milestoneEditForm.status}
                        onChange={(e) => setMilestoneEditForm({ ...milestoneEditForm, status: e.target.value as any })}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Progress %</Text>
                  <Input
                    size="sm"
                    type="number"
                    min={0}
                    max={100}
                    value={milestoneEditForm.progressPercent ?? 0}
                    onChange={(e) => setMilestoneEditForm({ ...milestoneEditForm, progressPercent: Number(e.target.value) })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes</Text>
                  <Input
                    size="sm"
                    value={milestoneEditForm.notes || ''}
                    onChange={(e) => setMilestoneEditForm({ ...milestoneEditForm, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingMilestone(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update Milestone
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Add Field Task */}
      {showAddTaskModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Create Field Task</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Assign site work item to an engineer or foreman.</Text>

            {taskFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {taskFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveAddTask}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Title *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Install temporary dewatering pumps in Pier pit"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned To *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskForm.assignedTo}
                        onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      >
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Due Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Priority</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskForm.status}
                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description / Work Instructions</Text>
                  <Input
                    size="sm"
                    placeholder="Specific engineering steps, precautions, or specs..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTaskModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Assign Task
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Edit Field Task */}
      {editingTask && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Field Task</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update status, assigned staff, priority, or due date.</Text>

            {taskFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {taskFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveEditTask}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Title *</Text>
                  <Input
                    size="sm"
                    value={taskEditForm.title || ''}
                    onChange={(e) => setTaskEditForm({ ...taskEditForm, title: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned To *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskEditForm.assignedTo}
                        onChange={(e) => setTaskEditForm({ ...taskEditForm, assignedTo: e.target.value })}
                      >
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Due Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={taskEditForm.dueDate || ''}
                      onChange={(e) => setTaskEditForm({ ...taskEditForm, dueDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Priority</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskEditForm.priority}
                        onChange={(e) => setTaskEditForm({ ...taskEditForm, priority: e.target.value as any })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={taskEditForm.status}
                        onChange={(e) => setTaskEditForm({ ...taskEditForm, status: e.target.value as any })}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description</Text>
                  <Input
                    size="sm"
                    value={taskEditForm.description || ''}
                    onChange={(e) => setTaskEditForm({ ...taskEditForm, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Update Field Task
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
