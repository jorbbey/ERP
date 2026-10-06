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
  NativeSelect,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Department } from '../../../types';
import {
  Building,
  Plus,
  Users,
  Edit2,
  Trash2,
  UserCheck,
  Search,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';

export const DepartmentsTab: React.FC = () => {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    assignDepartmentHead
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [headModalDept, setHeadModalDept] = useState<Department | null>(null);

  // Form states
  const [deptForm, setDeptForm] = useState({
    name: '',
    description: '',
    rolesStr: 'Site Engineer, Project Manager'
  });

  const [headForm, setHeadForm] = useState({
    employeeId: employees[0]?.id || 1,
    headTitle: 'Head of Department'
  });

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.headName && d.headName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedDepartment = departments.find(d => d.id === selectedDeptId);
  const deptEmployees = employees.filter(e => e.department === selectedDepartment?.name);

  const handleOpenAdd = () => {
    setDeptForm({
      name: '',
      description: '',
      rolesStr: 'Project Manager, Site Engineer, Staff'
    });
    setEditingDept(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (d: Department) => {
    setDeptForm({
      name: d.name,
      description: d.description || '',
      rolesStr: (d.roles || []).join(', ')
    });
    setEditingDept(d);
    setShowAddModal(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim()) return;

    const roles = deptForm.rolesStr
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    if (editingDept) {
      updateDepartment(editingDept.id, {
        name: deptForm.name.trim(),
        description: deptForm.description.trim(),
        roles
      });
    } else {
      addDepartment({
        name: deptForm.name.trim(),
        description: deptForm.description.trim(),
        roles
      });
    }

    setShowAddModal(false);
    setEditingDept(null);
  };

  const handleAssignHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headModalDept) return;
    const emp = employees.find(e => e.id === Number(headForm.employeeId));
    if (!emp) return;

    assignDepartmentHead(
      headModalDept.id,
      emp.id,
      emp.name,
      headForm.headTitle.trim() || 'Head of Department'
    );
    setHeadModalDept(null);
  };

  return (
    <Stack gap={6}>
      {/* Top Controls */}
      <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
          <Box position="relative" flex="1" maxW={{ md: '400px' }}>
            <Input
              size="sm"
              placeholder="Search departments, head of department..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              pl={8}
            />
            <Box position="absolute" left={2.5} top="50%" transform="translateY(-50%)" color="#94a3b8">
              <Search size={14} />
            </Box>
          </Box>

          <Button
            size="sm"
            colorPalette="blue"
            onClick={handleOpenAdd}
            fontWeight="bold"
          >
            <Plus size={14} /> Add New Department
          </Button>
        </Flex>
      </Card.Root>

      {/* Grid of Departments */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {filteredDepartments.map(dept => {
          const staffCount = employees.filter(e => e.department === dept.name).length;
          const isSelected = selectedDeptId === dept.id;

          return (
            <Card.Root
              key={dept.id}
              bg="white"
              borderRadius="16px"
              p={5}
              border="1px solid"
              borderColor={isSelected ? '#2563eb' : '#e2e8f0'}
              boxShadow={isSelected ? 'md' : 'xs'}
              position="relative"
              transition="all 0.2s"
            >
              <Flex justify="space-between" align="flex-start" mb={3}>
                <Box p={2.5} borderRadius="10px" bg="#eff6ff" color="#2563eb">
                  <Building size={20} />
                </Box>
                <Flex gap={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#475569"
                    onClick={() => handleOpenEdit(dept)}
                    title="Edit Department"
                  >
                    <Edit2 size={13} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#dc2626"
                    onClick={() => {
                      if (confirm(`Delete department "${dept.name}"?`)) {
                        deleteDepartment(dept.id);
                        if (selectedDeptId === dept.id) setSelectedDeptId(null);
                      }
                    }}
                    title="Delete Department"
                  >
                    <Trash2 size={13} />
                  </Button>
                </Flex>
              </Flex>

              <Heading size="md" color="#0f172a" mb={1}>
                {dept.name}
              </Heading>

              <Text fontSize="xs" color="#64748b" mb={3} minH="34px">
                {dept.description || 'Core engineering, operational, or administrative division.'}
              </Text>

              {/* Head of Department box */}
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mb={3}>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                    Head of Department (HOD)
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    fontSize="10px"
                    color="#2563eb"
                    onClick={() => {
                      setHeadModalDept(dept);
                      setHeadForm({
                        employeeId: dept.headEmployeeId || employees[0]?.id || 1,
                        headTitle: dept.headTitle || 'Head of Department'
                      });
                    }}
                  >
                    Assign / Change
                  </Button>
                </Flex>
                {dept.headName ? (
                  <Flex align="center" gap={1.5}>
                    <UserCheck size={14} color="#059669" />
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                      {dept.headName}
                    </Text>
                    <Text fontSize="10px" color="#64748b">
                      ({dept.headTitle || 'HOD'})
                    </Text>
                  </Flex>
                ) : (
                  <Text fontSize="xs" color="#94a3b8" fontStyle="italic">
                    No department head assigned
                  </Text>
                )}
              </Box>

              {/* Department Roles */}
              <Box mb={4}>
                <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b" mb={1.5}>
                  Assigned Workflow Roles:
                </Text>
                <Flex gap={1.5} wrap="wrap">
                  {dept.roles && dept.roles.length > 0 ? (
                    dept.roles.map((r, i) => (
                      <Badge key={i} size="xs" colorPalette="blue" variant="subtle">
                        {r}
                      </Badge>
                    ))
                  ) : (
                    <Text fontSize="11px" color="#94a3b8">Standard Department Roles</Text>
                  )}
                </Flex>
              </Box>

              {/* Footer */}
              <Flex justify="space-between" align="center" pt={3} borderTop="1px solid #f1f5f9">
                <Badge colorPalette="purple" size="sm">
                  <Users size={12} /> {staffCount} Staff Members
                </Badge>
                <Button
                  size="xs"
                  variant={isSelected ? 'solid' : 'outline'}
                  colorPalette="blue"
                  onClick={() => setSelectedDeptId(isSelected ? null : dept.id)}
                >
                  {isSelected ? 'Hide Roster' : 'View Staff'} <ChevronRight size={12} />
                </Button>
              </Flex>
            </Card.Root>
          );
        })}
      </SimpleGrid>

      {/* Selected Department Drilldown Roster */}
      {selectedDepartment && (
        <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #2563eb" boxShadow="sm">
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color="#0f172a">
                Personnel Assigned to: {selectedDepartment.name}
              </Heading>
              <Text fontSize="xs" color="#64748b">
                Head: {selectedDepartment.headName || 'Not Assigned'} • Total Roster: {deptEmployees.length} staff
              </Text>
            </Box>
            <Button size="xs" variant="ghost" onClick={() => setSelectedDeptId(null)}>
              <X size={14} /> Close Drilldown
            </Button>
          </Flex>

          {deptEmployees.length === 0 ? (
            <Box p={6} textAlign="center" color="#94a3b8" fontSize="xs">
              No staff members currently assigned to this department.
            </Box>
          ) : (
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Staff Member</Table.ColumnHeader>
                  <Table.ColumnHeader>Position</Table.ColumnHeader>
                  <Table.ColumnHeader>System Role</Table.ColumnHeader>
                  <Table.ColumnHeader>Contact</Table.ColumnHeader>
                  <Table.ColumnHeader>Date Joined</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {deptEmployees.map(e => (
                  <Table.Row key={e.id}>
                    <Table.Cell fontFamily="mono" fontWeight="bold" color="#2563eb">{e.code}</Table.Cell>
                    <Table.Cell fontWeight="bold">{e.name}</Table.Cell>
                    <Table.Cell>{e.position}</Table.Cell>
                    <Table.Cell><Badge size="xs" colorPalette="blue">{e.role}</Badge></Table.Cell>
                    <Table.Cell fontSize="xs">{e.phone} • {e.email}</Table.Cell>
                    <Table.Cell fontSize="xs">{e.hireDate}</Table.Cell>
                    <Table.Cell>
                      <Badge size="xs" colorPalette={e.status === 'Active' ? 'green' : 'yellow'}>
                        {e.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Card.Root>
      )}

      {/* Add / Edit Department Modal */}
      {showAddModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              {editingDept ? 'Edit Department' : 'Create Department'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Configure organizational departments and associated operational roles.
            </Text>

            <form onSubmit={handleSaveDept}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Department Name *</Text>
                  <Input
                    size="sm"
                    value={deptForm.name}
                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder="e.g. Quality Assurance & Geotechnical"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Description</Text>
                  <Textarea
                    size="sm"
                    rows={2}
                    value={deptForm.description}
                    onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                    placeholder="Brief description of department scope..."
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Associated Roles (comma-separated)</Text>
                  <Input
                    size="sm"
                    value={deptForm.rolesStr}
                    onChange={e => setDeptForm({ ...deptForm, rolesStr: e.target.value })}
                    placeholder="e.g. Project Manager, Site Engineer, QA Inspector"
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    {editingDept ? 'Save Changes' : 'Create Department'}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Assign Head Modal */}
      {headModalDept && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="450px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Assign Department Head
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Designate supervisor for <strong>{headModalDept.name}</strong>.
            </Text>

            <form onSubmit={handleAssignHead}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Select Head of Department *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={headForm.employeeId}
                      onChange={e => setHeadForm({ ...headForm, employeeId: Number(e.target.value) })}
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} ({e.code} - {e.department})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Designation Title *</Text>
                  <Input
                    size="sm"
                    value={headForm.headTitle}
                    onChange={e => setHeadForm({ ...headForm, headTitle: e.target.value })}
                    placeholder="e.g. Chief Construction Engineer, Head of Procurement"
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setHeadModalDept(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Confirm Assignment
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
