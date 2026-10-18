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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Employee, UserRole } from '../../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Download,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Building,
  UserCheck,
  KeyRound,
  Lock,
  Unlock,
  UserMinus,
  Mail,
  FileSpreadsheet,
  AlertTriangle,
  X
} from 'lucide-react';
import { ExcelImportModal, TemplateColumn } from '../../../components/common/ExcelImportModal';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeProfileModal } from './EmployeeProfileModal';

const employeeTemplateColumns: TemplateColumn[] = [
  { key: 'name', label: 'Full Employee Name', required: true, type: 'string', description: 'Legal name of staff member', example: 'Engr. Emeka Obi' },
  { key: 'code', label: 'Staff Code', required: false, type: 'string', description: 'Unique payroll/staff code (e.g. EMP-001)', example: 'EMP-015' },
  { key: 'email', label: 'Company Email', required: true, type: 'email', description: 'Work email address (unique)', example: 'emeka.obi@company.com' },
  { key: 'phone', label: 'Phone Number', required: true, type: 'string', description: 'Contact telephone', example: '+234 802 345 6789' },
  { key: 'department', label: 'Department', required: true, type: 'string', description: 'Assigned operational department', example: 'Civil Engineering' },
  { key: 'position', label: 'Job Title / Position', required: true, type: 'string', description: 'Designation / job title', example: 'Senior Resident Engineer' },
  { key: 'role', label: 'ERP Role Designation', required: true, type: 'enum', validValues: ['Managing Director', 'Project Manager', 'Site Engineer', 'Finance Manager', 'Accountant', 'HR Manager', 'Procurement Officer', 'Storekeeper', 'Staff'], description: 'Assigned role archetype', example: 'Site Engineer' },
  { key: 'monthlySalary', label: 'Basic Monthly Salary', required: false, type: 'number', description: 'Monthly base pay amount', example: 450000 },
  { key: 'joinDate', label: 'Date Joined', required: false, type: 'date', description: 'Hire date (YYYY-MM-DD)', example: '2025-01-15' }
];

const sampleEmployeeData = [
  {
    name: 'Engr. Emeka Obi',
    code: 'EMP-015',
    email: 'emeka.obi@company.com',
    phone: '+234 802 345 6789',
    department: 'Civil Engineering',
    position: 'Senior Resident Engineer',
    role: 'Site Engineer',
    monthlySalary: 450000,
    joinDate: '2025-01-15'
  },
  {
    name: 'Fatima Garba',
    code: 'EMP-016',
    email: 'fatima.garba@company.com',
    phone: '+234 803 987 1122',
    department: 'Finance & Accounts',
    position: 'Senior Project Accountant',
    role: 'Accountant',
    monthlySalary: 380000,
    joinDate: '2025-02-01'
  }
];

export const EmployeeDirectoryTab: React.FC = () => {
  const {
    employees,
    departments,
    disabledColumns,
    toggleDisabledColumn,
    archiveEmployee,
    restoreEmployee,
    deleteEmployeePermanently,
    employeeCustomFields,
    addCustomField,
    activeCompany,
    loginAsEmployee,
    provisionEmployeeAccount,
    updateEmployeeLoginStatus,
    revokeEmployeeLoginAccess,
    bulkImportEmployees,
    activeRole
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [newCustomField, setNewCustomField] = useState({ fieldName: '', fieldLabel: '', fieldType: 'text' as const });
  const [showImportModal, setShowImportModal] = useState(false);

  // Administrator-Controlled Account Provisioning & Access Management
  const [provisioningEmp, setProvisioningEmp] = useState<Employee | null>(null);
  const [accessManageEmp, setAccessManageEmp] = useState<Employee | null>(null);
  const [provisionForm, setProvisionForm] = useState<{
    loginEmail: string;
    loginRole: UserRole;
    activationMethod: 'credentials' | 'invitation';
    tempPassword: string;
  }>({
    loginEmail: '',
    loginRole: 'Staff',
    activationMethod: 'credentials',
    tempPassword: 'Password@2026'
  });
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  // Archive prompt modal
  const [archivingEmp, setArchivingEmp] = useState<Employee | null>(null);
  const [archiveReason, setArchiveReason] = useState('End of contract / Resignation');

  // Filter employees
  const filteredEmployees = employees.filter(e => {
    const matchesSearch =
      !searchTerm ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.phone && e.phone.includes(searchTerm)) ||
      (e.nin && e.nin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.tin && e.tin.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || e.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    const matchesRole = selectedRole === 'All' || e.role === selectedRole;

    return matchesSearch && matchesDept && matchesStatus && matchesRole;
  });

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const archivedCount = employees.filter(e => e.status === 'Archived').length;

  const handleExportCSV = () => {
    const headers = ['Code', 'Name', 'Email', 'Phone', 'Department', 'Position', 'Role', 'Status', 'Salary', 'NIN', 'TIN', 'Bank', 'AccountNo', 'HireDate'];
    const rows = filteredEmployees.map(e => [
      e.code,
      `"${e.name}"`,
      e.email,
      `"${e.phone}"`,
      `"${e.department}"`,
      `"${e.position}"`,
      `"${e.role}"`,
      e.status,
      e.salary,
      e.nin || '',
      e.tin || '',
      `"${e.bankName || ''}"`,
      `"${e.accountNumber || ''}"`,
      e.hireDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_${activeCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmArchive = () => {
    if (!archivingEmp) return;
    archiveEmployee(archivingEmp.id, archiveReason);
    setArchivingEmp(null);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomField.fieldLabel.trim()) return;
    const fieldName = newCustomField.fieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    addCustomField({
      fieldName,
      fieldLabel: newCustomField.fieldLabel.trim(),
      fieldType: newCustomField.fieldType
    });
    setNewCustomField({ fieldName: '', fieldLabel: '', fieldType: 'text' });
    setShowCustomFieldModal(false);
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'green';
      case 'On Leave': return 'blue';
      case 'Archived': return 'yellow';
      case 'Terminated': return 'red';
      default: return 'gray';
    }
  };
  const handleOpenProvisionAccess = (emp: Employee) => {
    setProvisioningEmp(emp);
    setProvisionError(null);
    setProvisionSuccess(null);
    setProvisionForm({
      loginEmail: emp.email || `${emp.code.toLowerCase()}@${activeCompany.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      loginRole: emp.role || 'Staff',
      activationMethod: 'credentials',
      tempPassword: `Pass@${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  const handleOpenManageAccess = (emp: Employee) => {
    setAccessManageEmp(emp);
    setProvisionError(null);
    setProvisionSuccess(null);
  };

  const handleConfirmProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisioningEmp) return;
    if (!provisionForm.loginEmail.trim()) {
      setProvisionError('Login email is required.');
      return;
    }

    const res = provisionEmployeeAccount({
      employeeId: provisioningEmp.id,
      loginEmail: provisionForm.loginEmail.trim(),
      loginRole: provisionForm.loginRole,
      activationMethod: provisionForm.activationMethod,
      tempPassword: provisionForm.tempPassword
    });

    if (res.success) {
      setProvisionSuccess(`System login access provisioned for ${provisioningEmp.name}!`);
      setTimeout(() => {
        setProvisioningEmp(null);
        setProvisionSuccess(null);
      }, 1200);
    } else {
      setProvisionError(res.error || 'Failed to provision login credentials.');
    }
  };

  const handleChangeStatus = (status: 'Active' | 'Suspended' | 'Deactivated') => {
    if (!accessManageEmp) return;
    const ok = updateEmployeeLoginStatus(accessManageEmp.id, status);
    if (ok) {
      setAccessManageEmp({
        ...accessManageEmp,
        loginStatus: status
      });
    }
  };

  const handleRevokeAccess = () => {
    if (!accessManageEmp) return;
    const ok = revokeEmployeeLoginAccess(accessManageEmp.id);
    if (ok) {
      setAccessManageEmp(null);
    }
  };

  return (
    <Stack gap={6}>
      {/* Metrics Row */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Total Personnel</Text>
              <Heading size="xl" color="#0f172a" mt={1}>{employees.length}</Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>Company Roster</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <Users size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Active Workforce</Text>
              <Heading size="xl" color="#059669" mt={1}>{activeCount}</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>On Active Duty</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <UserCheck size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">On Approved Leave</Text>
              <Heading size="xl" color="#d97706" mt={1}>{onLeaveCount}</Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>Casual / Sick / Annual</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <Building size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Operational Departments</Text>
              <Heading size="xl" color="#7c3aed" mt={1}>{departments.length}</Heading>
              <Text fontSize="11px" color="#7c3aed" mt={1}>{archivedCount} Archived Records</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#f5f3ff" color="#7c3aed">
              <CheckCircle2 size={22} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Control & Filter Bar */}
      <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
          {/* Search */}
          <Flex gap={2} flex="1" maxW={{ md: '450px' }}>
            <Box position="relative" w="100%">
              <Input
                size="sm"
                placeholder="Search staff by name, code, NIN, TIN, position..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                pl={8}
              />
              <Box position="absolute" left={2.5} top="50%" transform="translateY(-50%)" color="#94a3b8">
                <Search size={14} />
              </Box>
            </Box>
          </Flex>

          {/* Action buttons */}
          <Flex gap={2} wrap="wrap" align="center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowColumnPicker(!showColumnPicker)}
            >
              <SlidersHorizontal size={14} /> Columns
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCustomFieldModal(true)}
            >
              + Custom Field
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
            >
              <Download size={14} /> Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              borderColor="#cbd5e1"
              color="#334155"
              onClick={() => setShowImportModal(true)}
              fontWeight="medium"
            >
              <FileSpreadsheet size={14} color="#16a34a" /> Import Staff (Excel)
            </Button>
            <Button
              size="sm"
              colorPalette="blue"
              onClick={() => {
                setEditingEmployee(null);
                setShowFormModal(true);
              }}
              fontWeight="bold"
            >
              <Plus size={14} /> New Employee
            </Button>
          </Flex>
        </Flex>

        {/* Filters Row */}
        <Flex gap={3} mt={3} pt={3} borderTop="1px solid #f1f5f9" wrap="wrap" align="center">
          <Flex align="center" gap={1.5} fontSize="xs" color="#64748b">
            <Filter size={12} /> Filters:
          </Flex>

          <Box minW="180px">
            <NativeSelect.Root size="xs">
              <NativeSelect.Field
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
              >
                <option value="All">All Departments ({employees.length})</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          <Box minW="140px">
            <NativeSelect.Root size="xs">
              <NativeSelect.Field
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Archived">Archived</option>
                <option value="Terminated">Terminated</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          <Box minW="150px">
            <NativeSelect.Root size="xs">
              <NativeSelect.Field
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                <option value="All">All System Roles</option>
                <option value="Managing Director">Managing Director</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Site Engineer">Site Engineer</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Procurement Officer">Procurement Officer</option>
                <option value="Storekeeper">Storekeeper</option>
                <option value="Staff">Staff</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          {(selectedDept !== 'All' || selectedStatus !== 'All' || selectedRole !== 'All' || searchTerm) && (
            <Button
              size="xs"
              variant="ghost"
              color="#dc2626"
              onClick={() => {
                setSelectedDept('All');
                setSelectedStatus('All');
                setSelectedRole('All');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </Button>
          )}
        </Flex>

        {/* Column Visibility Popover Panel */}
        {showColumnPicker && (
          <Box mt={3} p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                Configurable Table Columns (employee_disabled_columns)
              </Text>
              <Button size="xs" variant="ghost" onClick={() => setShowColumnPicker(false)}>Done</Button>
            </Flex>
            <Flex gap={2} wrap="wrap">
              {[
                { key: 'code', label: 'Employee Code' },
                { key: 'department', label: 'Department' },
                { key: 'position', label: 'Position / Designation' },
                { key: 'role', label: 'ERP Role' },
                { key: 'contact', label: 'Email & Phone' },
                { key: 'salary', label: 'Basic Salary' },
                { key: 'banking', label: 'Bank & Account' },
                { key: 'identifiers', label: 'NIN / TIN' },
                { key: 'hireDate', label: 'Date Joined' },
                { key: 'status', label: 'Status' }
              ].map(col => {
                const isHidden = disabledColumns.includes(col.key);
                return (
                  <Button
                    key={col.key}
                    size="xs"
                    variant={isHidden ? 'outline' : 'solid'}
                    colorPalette={isHidden ? 'gray' : 'blue'}
                    onClick={() => toggleDisabledColumn(col.key)}
                  >
                    {isHidden ? '○ Hide: ' : '● Show: '} {col.label}
                  </Button>
                );
              })}
            </Flex>
          </Box>
        )}
      </Card.Root>

      {/* Main Table */}
      <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
        <Table.Root size="sm" variant="outline">
          <Table.Header bg="#f8fafc">
            <Table.Row>
              {!disabledColumns.includes('code') && <Table.ColumnHeader>Code</Table.ColumnHeader>}
              <Table.ColumnHeader>Employee Name</Table.ColumnHeader>
              {!disabledColumns.includes('department') && <Table.ColumnHeader>Department</Table.ColumnHeader>}
              {!disabledColumns.includes('position') && <Table.ColumnHeader>Position / Designation</Table.ColumnHeader>}
              {!disabledColumns.includes('role') && <Table.ColumnHeader>Role</Table.ColumnHeader>}
              {!disabledColumns.includes('contact') && <Table.ColumnHeader>Contact</Table.ColumnHeader>}
              {!disabledColumns.includes('salary') && <Table.ColumnHeader>Base Salary</Table.ColumnHeader>}
              {!disabledColumns.includes('banking') && <Table.ColumnHeader>Bank / PFA</Table.ColumnHeader>}
              {!disabledColumns.includes('identifiers') && <Table.ColumnHeader>NIN / TIN</Table.ColumnHeader>}
              {!disabledColumns.includes('hireDate') && <Table.ColumnHeader>Hire Date</Table.ColumnHeader>}
              {!disabledColumns.includes('status') && <Table.ColumnHeader>Status</Table.ColumnHeader>}
              <Table.ColumnHeader>Access & Credentials</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredEmployees.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={12} textAlign="center" py={10} color="#94a3b8">
                  No staff members matched your current filter criteria.
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredEmployees.map(emp => (
                <Table.Row key={emp.id} _hover={{ bg: '#f8fafc' }}>
                  {!disabledColumns.includes('code') && (
                    <Table.Cell fontFamily="mono" fontWeight="bold" fontSize="xs" color="#2563eb">
                      {emp.code}
                    </Table.Cell>
                  )}

                  <Table.Cell>
                    <Flex align="center" gap={2}>
                      <Box
                        w="28px"
                        h="28px"
                        borderRadius="full"
                        bg="#eff6ff"
                        color="#2563eb"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="xs"
                          color="#0f172a"
                          cursor="pointer"
                          _hover={{ textDecoration: 'underline', color: '#2563eb' }}
                          onClick={() => setProfileEmployee(emp)}
                        >
                          {emp.name}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>

                  {!disabledColumns.includes('department') && (
                    <Table.Cell fontSize="xs" color="#334155" fontWeight="medium">
                      {emp.department}
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('position') && (
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="semibold" color="#0f172a">{emp.position}</Text>
                      {emp.designation && (
                        <Text fontSize="10px" color="#64748b">{emp.designation}</Text>
                      )}
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('role') && (
                    <Table.Cell>
                      <Badge colorPalette="blue" size="xs" variant="subtle">
                        {emp.role}
                      </Badge>
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('contact') && (
                    <Table.Cell fontSize="xs">
                      <Text color="#0f172a">{emp.phone}</Text>
                      <Text fontSize="10px" color="#64748b">{emp.email}</Text>
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('salary') && (
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#059669">
                      {activeCompany.currency} {emp.salary?.toLocaleString() || '0'}
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('banking') && (
                    <Table.Cell fontSize="xs">
                      <Text color="#0f172a">{emp.bankName || '—'}</Text>
                      <Text fontSize="10px" fontFamily="mono" color="#64748b">{emp.accountNumber || '—'}</Text>
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('identifiers') && (
                    <Table.Cell fontSize="xs" fontFamily="mono" color="#64748b">
                      {emp.nin || emp.tin || '—'}
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('hireDate') && (
                    <Table.Cell fontSize="xs" color="#64748b">
                      {emp.hireDate}
                    </Table.Cell>
                  )}

                  {!disabledColumns.includes('status') && (
                    <Table.Cell>
                      <Badge size="xs" colorPalette={getStatusColor(emp.status)}>
                        {emp.status}
                      </Badge>
                    </Table.Cell>
                  )}

                  <Table.Cell>
                    {emp.hasLoginAccount ? (
                      <Flex align="center" gap={1.5}>
                        <Badge
                          size="xs"
                          colorPalette={
                            emp.loginStatus === 'Active'
                              ? 'green'
                              : emp.loginStatus === 'Pending Activation'
                              ? 'orange'
                              : emp.loginStatus === 'Suspended'
                              ? 'red'
                              : 'gray'
                          }
                        >
                          {emp.loginStatus || 'Active'}
                        </Badge>
                        <Button
                          size="2xs"
                          variant="ghost"
                          color="#2563eb"
                          p={1}
                          h="20px"
                          onClick={() => handleOpenManageAccess(emp)}
                          title="Manage Login & Security Access"
                        >
                          <KeyRound size={12} />
                        </Button>
                      </Flex>
                    ) : (
                      <Button
                        size="2xs"
                        variant="outline"
                        borderColor="#cbd5e1"
                        color="#2563eb"
                        fontSize="10px"
                        h="22px"
                        px={1.5}
                        onClick={() => handleOpenProvisionAccess(emp)}
                        title="Administrator: Provision ERP Account"
                      >
                        <KeyRound size={11} style={{ marginRight: '3px' }} /> Provision Login
                      </Button>
                    )}
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={1}>
                      <Button
                        size="xs"
                        variant="ghost"
                        color={emp.hasLoginAccount ? '#2563eb' : '#d97706'}
                        onClick={() => emp.hasLoginAccount ? handleOpenManageAccess(emp) : handleOpenProvisionAccess(emp)}
                        title={emp.hasLoginAccount ? `Manage Access (${emp.loginStatus || 'Active'})` : 'Provision Login Account'}
                      >
                        <KeyRound size={13} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="#2563eb"
                        onClick={() => setProfileEmployee(emp)}
                        title="View Full Profile Dossier"
                      >
                        <Eye size={13} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="#475569"
                        onClick={() => {
                          setEditingEmployee(emp);
                          setShowFormModal(true);
                        }}
                        title="Edit Record"
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="#059669"
                        onClick={() => loginAsEmployee(emp)}
                        title="Impersonate / Switch Persona"
                      >
                        <ShieldCheck size={13} />
                      </Button>
                      {emp.status === 'Archived' ? (
                        <Button
                          size="xs"
                          variant="ghost"
                          color="#059669"
                          onClick={() => restoreEmployee(emp.id)}
                          title="Restore Employee"
                        >
                          <RotateCcw size={13} />
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="ghost"
                          color="#dc2626"
                          onClick={() => setArchivingEmp(emp)}
                          title="Archive Record"
                        >
                          <Archive size={13} />
                        </Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card.Root>

      {/* Employee Create / Edit Modal */}
      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />

      {/* Employee Profile Dossier Modal */}
      <EmployeeProfileModal
        isOpen={!!profileEmployee}
        onClose={() => setProfileEmployee(null)}
        employee={profileEmployee}
        onEdit={(emp) => {
          setProfileEmployee(null);
          setEditingEmployee(emp);
          setShowFormModal(true);
        }}
        onArchive={(emp) => {
          setProfileEmployee(null);
          setArchivingEmp(emp);
        }}
      />

      {/* Archive Reason Modal */}
      {archivingEmp && (
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
            <Heading size="md" color="#0f172a" mb={2}>
              Archive Staff Member
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Are you sure you want to archive <strong>{archivingEmp.name}</strong> ({archivingEmp.code})? Their record will be moved to the archive log and deactivated from active roster.
            </Text>

            <Box mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reason for Archiving *</Text>
              <Input
                size="sm"
                value={archiveReason}
                onChange={e => setArchiveReason(e.target.value)}
                placeholder="e.g. Voluntary resignation, contract completion"
              />
            </Box>

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setArchivingEmp(null)}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="red" onClick={handleConfirmArchive} fontWeight="bold">
                Confirm Archive
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Add Custom Field Modal */}
      {showCustomFieldModal && (
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
              Add Custom Attribute
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define a dynamic field for employee profiles (matching PHP employee_custom_fields).
            </Text>

            <form onSubmit={handleAddCustomField}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Attribute Label *</Text>
                  <Input
                    size="sm"
                    value={newCustomField.fieldLabel}
                    onChange={e => setNewCustomField({ ...newCustomField, fieldLabel: e.target.value })}
                    placeholder="e.g. Passport Expiry Date, Site Clearance ID"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Attribute Type</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={newCustomField.fieldType}
                      onChange={e => setNewCustomField({ ...newCustomField, fieldType: e.target.value as any })}
                    >
                      <option value="text">Text String</option>
                      <option value="number">Numeric Value</option>
                      <option value="date">Date</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowCustomFieldModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Create Attribute
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Excel Staff / Employee Master Import Modal */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        moduleTitle="HR Staff & Personnel Records"
        moduleKey="employees"
        templateColumns={employeeTemplateColumns}
        sampleData={sampleEmployeeData}
        existingRecords={employees}
        duplicateKeyField="email"
        guidanceNotes={[
          'Company Email is required and must be unique across all staff profiles.',
          'Security Rule: Importing staff creates HR personnel records. In accordance with zero-trust company policies, system login credentials are NEVER created automatically.',
          'An authorized company administrator must provision login access individually through the "Provision Login" button in the staff directory.',
          'Monthly salary and hire dates are validated for payroll calculations and tax deductions.'
        ]}
        onCommitImport={bulkImportEmployees}
      />

      {/* Administrator-Controlled Account Provisioning Modal */}
      {provisioningEmp && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1450}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="18px" maxW="520px" w="100%" p={6} border="1px solid #cbd5e1" boxShadow="2xl">
            <Flex justify="space-between" align="flex-start" mb={3}>
              <Flex align="center" gap={3}>
                <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="12px">
                  <KeyRound size={24} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">Provision ERP Login Account</Heading>
                  <Text fontSize="xs" color="#64748b">
                    {provisioningEmp.name} • {provisioningEmp.code} ({provisioningEmp.department})
                  </Text>
                </Box>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setProvisioningEmp(null)}>
                <X size={16} />
              </Button>
            </Flex>

            <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" mb={4}>
              <Text fontSize="11px" color="#475569">
                Staff accounts are strictly administrator-controlled and isolated to <strong>{activeCompany.name}</strong>. Ordinary employees cannot self-register.
              </Text>
            </Box>

            {provisionError && (
              <Box p={3} mb={3} bg="#fef2f2" borderRadius="8px" border="1px solid #fecaca" color="#dc2626" fontSize="xs">
                {provisionError}
              </Box>
            )}

            {provisionSuccess && (
              <Box p={3} mb={3} bg="#f0fdf4" borderRadius="8px" border="1px solid #bbf7d0" color="#16a34a" fontSize="xs">
                {provisionSuccess}
              </Box>
            )}

            <form onSubmit={handleConfirmProvision}>
              <Stack gap={3.5}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Login Email Address *</Text>
                  <Input
                    size="sm"
                    type="email"
                    value={provisionForm.loginEmail}
                    onChange={e => setProvisionForm({ ...provisionForm, loginEmail: e.target.value })}
                    required
                  />
                  <Text fontSize="10px" color="#64748b" mt={0.5}>Must be a unique login address for this employee.</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Assigned System Role *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={provisionForm.loginRole}
                      onChange={e => setProvisionForm({ ...provisionForm, loginRole: e.target.value as UserRole })}
                    >
                      <option value="Staff">Staff (Standard Jobsite Access)</option>
                      <option value="Site Engineer">Site Engineer</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Storekeeper">Storekeeper / Store Officer</option>
                      <option value="Procurement Officer">Procurement Officer</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Finance Manager">Finance Manager</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Managing Director">Managing Director (Company Admin)</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Activation Workflow</Text>
                  <Flex gap={2}>
                    <Button
                      type="button"
                      size="xs"
                      flex="1"
                      variant={provisionForm.activationMethod === 'credentials' ? 'solid' : 'outline'}
                      colorPalette={provisionForm.activationMethod === 'credentials' ? 'blue' : 'gray'}
                      onClick={() => setProvisionForm({ ...provisionForm, activationMethod: 'credentials' })}
                    >
                      Direct Credentials (Active)
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      flex="1"
                      variant={provisionForm.activationMethod === 'invitation' ? 'solid' : 'outline'}
                      colorPalette={provisionForm.activationMethod === 'invitation' ? 'blue' : 'gray'}
                      onClick={() => setProvisionForm({ ...provisionForm, activationMethod: 'invitation' })}
                    >
                      Email Invitation (Pending)
                    </Button>
                  </Flex>
                </Box>

                {provisionForm.activationMethod === 'credentials' && (
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Temporary Initial Password</Text>
                    <Input
                      size="sm"
                      value={provisionForm.tempPassword}
                      onChange={e => setProvisionForm({ ...provisionForm, tempPassword: e.target.value })}
                      required
                    />
                    <Text fontSize="10px" color="#64748b" mt={0.5}>Share securely with employee. Employee will be prompted to change password.</Text>
                  </Box>
                )}

                <Flex justify="flex-end" gap={2} mt={3} pt={2} borderTop="1px solid #f1f5f9">
                  <Button size="sm" variant="outline" onClick={() => setProvisioningEmp(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" _hover={{ bg: '#1d4ed8' }} type="submit" fontWeight="bold">
                    Provision Credentials
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Administrator-Controlled Manage Access Modal */}
      {accessManageEmp && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1450}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="18px" maxW="520px" w="100%" p={6} border="1px solid #cbd5e1" boxShadow="2xl">
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Flex align="center" gap={3}>
                <Box p={2.5} bg="#ecfdf5" color="#059669" borderRadius="12px">
                  <ShieldCheck size={24} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">Manage Staff Access Account</Heading>
                  <Text fontSize="xs" color="#64748b">
                    {accessManageEmp.name} • {accessManageEmp.code}
                  </Text>
                </Box>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setAccessManageEmp(null)}>
                <X size={16} />
              </Button>
            </Flex>

            <Stack gap={3.5}>
              <Box p={3.5} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="xs" color="#64748b">Account Status:</Text>
                  <Badge
                    size="sm"
                    colorPalette={
                      accessManageEmp.loginStatus === 'Active'
                        ? 'green'
                        : accessManageEmp.loginStatus === 'Pending Activation'
                        ? 'orange'
                        : accessManageEmp.loginStatus === 'Suspended'
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {accessManageEmp.loginStatus || 'Active'}
                  </Badge>
                </Flex>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="xs" color="#64748b">Login Username / Email:</Text>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {accessManageEmp.loginEmail || accessManageEmp.email}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="xs" color="#64748b">Assigned Role:</Text>
                  <Badge size="xs" colorPalette="blue">{accessManageEmp.loginRole || accessManageEmp.role}</Badge>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" color="#64748b">Provisioned Date:</Text>
                  <Text fontSize="xs" color="#64748b">{accessManageEmp.accountCreatedAt || 'System Managed'}</Text>
                </Flex>
              </Box>

              {/* Status Actions */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={2}>Account Status Controls:</Text>
                <Flex gap={2}>
                  {accessManageEmp.loginStatus === 'Active' ? (
                    <>
                      <Button
                        size="xs"
                        variant="outline"
                        colorPalette="orange"
                        onClick={() => handleChangeStatus('Suspended')}
                        flex="1"
                      >
                        <Lock size={12} /> Suspend Access
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        colorPalette="red"
                        onClick={() => handleChangeStatus('Deactivated')}
                        flex="1"
                      >
                        <UserMinus size={12} /> Deactivate Access
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="xs"
                      colorPalette="green"
                      onClick={() => handleChangeStatus('Active')}
                      w="100%"
                    >
                      <Unlock size={12} /> Reactivate Login Access
                    </Button>
                  )}
                </Flex>
              </Box>

              {/* Danger Zone: Revoke Access */}
              <Box p={3} bg="#fef2f2" borderRadius="10px" border="1px solid #fecaca" mt={2}>
                <Text fontSize="xs" fontWeight="bold" color="#991b1b" mb={1}>Revoke System Access:</Text>
                <Text fontSize="11px" color="#7f1d1d" mb={3}>
                  Permanently revokes this employee&apos;s login privileges. The HR employee record, salary history, bank accounts, and attendance logs are <strong>fully preserved</strong>.
                </Text>
                <Button
                  size="xs"
                  colorPalette="red"
                  onClick={handleRevokeAccess}
                >
                  <UserMinus size={13} /> Revoke Login Credentials
                </Button>
              </Box>

              <Flex justify="flex-end" pt={2}>
                <Button size="sm" variant="outline" onClick={() => setAccessManageEmp(null)}>
                  Close
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
