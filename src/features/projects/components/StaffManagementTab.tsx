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
import { Project, ProjectStaffAssignment, ProjectStaffHistory } from '../../../types';
import { Plus, Users, UserCheck, UserX, Shield, Briefcase, History } from 'lucide-react';

interface StaffManagementTabProps {
  project: Project;
}

export const StaffManagementTab: React.FC<StaffManagementTabProps> = ({ project }) => {
  const {
    projectStaff,
    projectStaffHistory,
    assignProjectStaff,
    removeProjectStaff,
    employees
  } = useERP();

  const currentStaff = projectStaff.filter(s => s.projectId === project.id);
  const currentHistory = projectStaffHistory
    .filter(h => h.projectId === project.id)
    .sort((a, b) => b.id - a.id);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    employeeId: employees[0]?.id || 1,
    role: 'Resident Senior Site Engineer',
    assignedDate: new Date().toISOString().split('T')[0]
  });

  const handleOpenAssign = () => {
    setForm({
      employeeId: employees[0]?.id || 1,
      role: 'Resident Senior Site Engineer',
      assignedDate: new Date().toISOString().split('T')[0]
    });
    setFeedback(null);
    setShowAssignModal(true);
  };

  const handleSaveAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === Number(form.employeeId));
    if (!emp) {
      setFeedback('Selected employee not found.');
      return;
    }

    // Check if already actively assigned
    const alreadyAssigned = currentStaff.some(s => s.employeeId === emp.id && s.status === 'Active');
    if (alreadyAssigned) {
      setFeedback(`${emp.name} is already actively deployed to this project site.`);
      return;
    }

    assignProjectStaff({
      projectId: project.id,
      employeeId: emp.id,
      employeeName: emp.name,
      role: form.role,
      assignedDate: form.assignedDate,
      status: 'Active'
    });

    setShowAssignModal(false);
  };

  return (
    <Stack gap={6}>
      {/* Top Metric Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Active Site Staff
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {currentStaff.filter(s => s.status === 'Active').length} Personnel
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <UserCheck size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Resident engineers, surveyors, and field foremen
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Designated Lead Manager
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {project.manager}
              </Text>
            </Box>
            <Box p={2.5} bg="#faf5ff" color="#7c3aed" borderRadius="10px">
              <Shield size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Overall project site superintendent
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Personnel Deployments Logged
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {currentHistory.length} Recorded Actions
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <History size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Historical staff assignments & transfers
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Active Site Staff Table */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Active Project Staff Assignments</Heading>
            <Text fontSize="xs" color="#64748b">
              Qualified staff assigned to oversee site safety, quantity surveying, execution quality, and supervision.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAssign}>
            <Plus size={15} /> Assign Personnel to Site
          </Button>
        </Flex>

        {currentStaff.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No personnel assigned to this site yet. Click "Assign Personnel to Site" to mobilize engineers.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Employee Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Designated Role on Site</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Mobilization / Assigned Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentStaff.map((staff) => (
                <Table.Row key={staff.id}>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {staff.employeeName}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette="blue" variant="subtle">
                      {staff.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">
                    {staff.assignedDate}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette={staff.status === 'Active' ? 'green' : 'gray'}>
                      {staff.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button
                      size="xs"
                      variant="subtle"
                      colorPalette="red"
                      onClick={() => removeProjectStaff(staff.id)}
                      title="Relieve staff member from site"
                    >
                      <UserX size={12} /> Relieve from Site
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card.Root>

      {/* Staff Deployment History Audit Log */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
          <History size={18} color="#2563eb" /> Project Staff Assignment History
        </Heading>
        <Text fontSize="xs" color="#64748b" mb={4}>
          Chronological record of personnel deployed, promoted, or transferred off this construction project.
        </Text>

        {currentHistory.length === 0 ? (
          <Box py={6} textAlign="center" color="#94a3b8" fontSize="xs">
            Zero historical staff transfer actions on record.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Action Date / Time</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Action Type</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Employee Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Role / Position</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentHistory.map((hist) => (
                <Table.Row key={hist.id}>
                  <Table.Cell fontSize="xs" color="#64748b" fontFamily="mono">
                    {hist.changedAt}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="xs"
                      colorPalette={
                        hist.action === 'Assigned' ? 'green' :
                        hist.action === 'Promoted' ? 'purple' :
                        hist.action === 'Reassigned' ? 'blue' : 'gray'
                      }
                    >
                      {hist.action}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {hist.employeeName}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">
                    {hist.role}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card.Root>

      {/* Modal: Assign Staff Member */}
      {showAssignModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Assign Staff to Project Site</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Select an active employee and assign their operational site role.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAssign}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Employee *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.employeeId}
                      onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} — {emp.department} ({emp.position})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Site Role *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="Resident Senior Site Engineer">Resident Senior Site Engineer</option>
                      <option value="Site Quantity Surveyor & Cost Controller">Site Quantity Surveyor & Cost Controller</option>
                      <option value="General Field Works Foreman">General Field Works Foreman</option>
                      <option value="Site Logistics & Stores Officer">Site Logistics & Stores Officer</option>
                      <option value="HSE & Safety Officer">HSE & Safety Officer</option>
                      <option value="Quality Assurance & Materials Inspector">Quality Assurance & Materials Inspector</option>
                      <option value="MEP Site Coordinator">MEP Site Coordinator</option>
                      <option value="Assistant Resident Engineer">Assistant Resident Engineer</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Mobilization / Start Date *</Text>
                  <Input
                    size="sm"
                    type="date"
                    value={form.assignedDate}
                    onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAssignModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Mobilize Staff Member
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
