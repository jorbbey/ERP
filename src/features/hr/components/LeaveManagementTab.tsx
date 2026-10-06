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
import { LeaveRequest } from '../../../types';
import {
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  UserCheck,
  Building,
  AlertCircle
} from 'lucide-react';

export const LeaveManagementTab: React.FC = () => {
  const {
    leaves,
    leaveBalances,
    employees,
    departments,
    createLeaveRequest,
    decideLeaveRequest,
    cancelLeaveRequest,
    currentUserName,
    activeRole
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'balances'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // New Leave Request Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    employeeId: employees[0]?.id || 1,
    leaveType: 'Annual Leave' as LeaveRequest['leaveType'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    reason: ''
  });

  // Decision Modal State
  const [decisionRequest, setDecisionRequest] = useState<LeaveRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected'>('Approved');
  const [decisionComments, setDecisionComments] = useState('');

  const canApprove = ['Managing Director', 'HR Manager', 'Project Manager', 'Super Admin'].includes(activeRole);

  const filteredLeaves = leaves.filter(l => {
    const matchesSearch =
      !searchTerm ||
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesType = typeFilter === 'All' || l.leaveType === typeFilter;
    const matchesDept = deptFilter === 'All' || l.department === deptFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDept;
  });

  // Calculate days for modal
  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.reason.trim()) return;

    createLeaveRequest({
      employeeId: Number(applyForm.employeeId),
      leaveType: applyForm.leaveType,
      startDate: applyForm.startDate,
      endDate: applyForm.endDate,
      reason: applyForm.reason.trim()
    });

    setShowApplyModal(false);
    setApplyForm({
      employeeId: employees[0]?.id || 1,
      leaveType: 'Annual Leave',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      reason: ''
    });
  };

  const handleConfirmDecision = () => {
    if (!decisionRequest) return;
    decideLeaveRequest(
      decisionRequest.id,
      decisionType,
      decisionComments,
      decisionType === 'Rejected' ? decisionComments : undefined
    );
    setDecisionRequest(null);
    setDecisionComments('');
  };

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const totalDaysApproved = leaves
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + l.daysCount, 0);

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge colorPalette="green" size="sm"><CheckCircle2 size={12} /> Approved</Badge>;
      case 'Pending':
        return <Badge colorPalette="yellow" size="sm"><Clock size={12} /> Pending Review</Badge>;
      case 'Rejected':
        return <Badge colorPalette="red" size="sm"><XCircle size={12} /> Rejected</Badge>;
      case 'Cancelled':
        return <Badge colorPalette="gray" size="sm">Cancelled</Badge>;
    }
  };

  return (
    <Stack gap={6}>
      {/* Metric Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Pending Applications</Text>
              <Heading size="xl" color="#d97706" mt={1}>{pendingCount}</Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>Awaiting Line Manager</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <Clock size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Approved Leaves</Text>
              <Heading size="xl" color="#059669" mt={1}>{approvedCount}</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>Calendar Year 2026</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <CheckCircle2 size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Total Days Authorized</Text>
              <Heading size="xl" color="#2563eb" mt={1}>{totalDaysApproved} days</Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>Absence Utilization</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <Calendar size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Tracked Staff Quotas</Text>
              <Heading size="xl" color="#7c3aed" mt={1}>{leaveBalances.length}</Heading>
              <Text fontSize="11px" color="#7c3aed" mt={1}>Annual / Sick / Casual</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#f5f3ff" color="#7c3aed">
              <UserCheck size={22} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Navigation Sub-Tabs */}
      <Flex borderBottom="2px solid #e2e8f0" gap={6}>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'requests' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'requests' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('requests')}
        >
          Leave Applications Register ({leaves.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'balances' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'balances' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('balances')}
        >
          Staff Leave Balances & Quotas ({leaveBalances.length})
        </Box>
      </Flex>

      {/* Sub-Tab 1: Requests Register */}
      {activeSubTab === 'requests' && (
        <Stack gap={4}>
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Flex gap={2} wrap="wrap" align="center" flex="1">
                <Box position="relative" minW="220px">
                  <Input
                    size="xs"
                    placeholder="Search applicant or reason..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    pl={7}
                  />
                  <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" color="#94a3b8">
                    <Search size={12} />
                  </Box>
                </Box>

                <Box minW="130px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box minW="150px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={typeFilter}
                      onChange={e => setTypeFilter(e.target.value)}
                    >
                      <option value="All">All Leave Types</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual">Casual</option>
                      <option value="Maternity / Paternity">Maternity / Paternity</option>
                      <option value="Compassionate">Compassionate</option>
                      <option value="Study / Examination">Study / Examination</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box minW="160px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={deptFilter}
                      onChange={e => setDeptFilter(e.target.value)}
                    >
                      <option value="All">All Departments</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </Flex>

              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => setShowApplyModal(true)}
                fontWeight="bold"
              >
                <Plus size={14} /> Apply for Leave
              </Button>
            </Flex>
          </Card.Root>

          {/* Table */}
          <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Staff Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Employee</Table.ColumnHeader>
                  <Table.ColumnHeader>Department</Table.ColumnHeader>
                  <Table.ColumnHeader>Leave Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                  <Table.ColumnHeader>End Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Days</Table.ColumnHeader>
                  <Table.ColumnHeader>Reason</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Reviewed By</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredLeaves.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={11} textAlign="center" py={8} color="#94a3b8">
                      No leave applications found matching your criteria.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredLeaves.map(l => (
                    <Table.Row key={l.id}>
                      <Table.Cell fontFamily="mono" fontWeight="bold" fontSize="xs" color="#2563eb">
                        {l.employeeCode}
                      </Table.Cell>
                      <Table.Cell fontWeight="bold" fontSize="xs">
                        {l.employeeName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#475569">
                        {l.department}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette="purple" variant="subtle">
                          {l.leaveType}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">{l.startDate}</Table.Cell>
                      <Table.Cell fontSize="xs">{l.endDate}</Table.Cell>
                      <Table.Cell fontWeight="bold" fontSize="xs">
                        {l.daysCount} days
                      </Table.Cell>
                      <Table.Cell fontSize="xs" maxW="200px" truncate>
                        {l.reason}
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(l.status)}</Table.Cell>
                      <Table.Cell fontSize="11px" color="#64748b">
                        {l.approvedBy ? `${l.approvedBy}` : l.rejectionReason || '—'}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {l.status === 'Pending' && (
                          <Flex justify="flex-end" gap={1}>
                            {canApprove && (
                              <>
                                <Button
                                  size="xs"
                                  colorPalette="green"
                                  onClick={() => {
                                    setDecisionRequest(l);
                                    setDecisionType('Approved');
                                    setDecisionComments('Approved as per annual entitlement');
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="xs"
                                  colorPalette="red"
                                  variant="outline"
                                  onClick={() => {
                                    setDecisionRequest(l);
                                    setDecisionType('Rejected');
                                    setDecisionComments('Operational constraints on site');
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="xs"
                              variant="ghost"
                              color="#64748b"
                              onClick={() => cancelLeaveRequest(l.id)}
                            >
                              Cancel
                            </Button>
                          </Flex>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* Sub-Tab 2: Staff Leave Balances */}
      {activeSubTab === 'balances' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Heading size="md" color="#0f172a" mb={1}>
            Annual Statutory Leave Balances & Entitlements
          </Heading>
          <Text fontSize="xs" color="#64748b" mb={4}>
            Automated quota tracking deducting verified leaves upon approval.
          </Text>

          <Table.Root size="sm" variant="outline">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader>Staff Member</Table.ColumnHeader>
                <Table.ColumnHeader>Department</Table.ColumnHeader>
                <Table.ColumnHeader>Annual Entitled</Table.ColumnHeader>
                <Table.ColumnHeader>Annual Used</Table.ColumnHeader>
                <Table.ColumnHeader>Annual Balance</Table.ColumnHeader>
                <Table.ColumnHeader>Sick Leave Balance</Table.ColumnHeader>
                <Table.ColumnHeader>Casual Leave Balance</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Quick Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {leaveBalances.map(bal => {
                const emp = employees.find(e => e.id === bal.employeeId);
                if (!emp) return null;

                return (
                  <Table.Row key={bal.employeeId}>
                    <Table.Cell>
                      <Text fontWeight="bold" fontSize="xs">{emp.name}</Text>
                      <Text fontSize="10px" fontFamily="mono" color="#2563eb">{emp.code}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">{emp.department}</Table.Cell>
                    <Table.Cell fontWeight="semibold">{bal.annualAllocated} days</Table.Cell>
                    <Table.Cell color="#dc2626">-{bal.annualUsed} days</Table.Cell>
                    <Table.Cell>
                      <Badge size="sm" colorPalette={bal.annualRemaining > 5 ? 'green' : 'yellow'}>
                        {bal.annualRemaining} days left
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="xs">{bal.sickRemaining} of {bal.sickAllocated} days</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="xs">{bal.casualRemaining} of {bal.casualAllocated} days</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Button
                        size="xs"
                        variant="outline"
                        colorPalette="blue"
                        onClick={() => {
                          setApplyForm(prev => ({ ...prev, employeeId: emp.id }));
                          setShowApplyModal(true);
                        }}
                      >
                        Apply for Staff
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
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
              Apply for Leave of Absence
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Submit leave request for approval and balance deduction.
            </Text>

            <form onSubmit={handleApplyLeave}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Staff Member *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={applyForm.employeeId}
                      onChange={e => setApplyForm({ ...applyForm, employeeId: Number(e.target.value) })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.code} - {emp.department})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Leave Type *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={applyForm.leaveType}
                      onChange={e => setApplyForm({ ...applyForm, leaveType: e.target.value as any })}
                    >
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual">Casual Leave</option>
                      <option value="Maternity / Paternity">Maternity / Paternity</option>
                      <option value="Compassionate">Compassionate</option>
                      <option value="Study / Examination">Study / Examination</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Start Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={applyForm.startDate}
                      onChange={e => setApplyForm({ ...applyForm, startDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>End Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={applyForm.endDate}
                      onChange={e => setApplyForm({ ...applyForm, endDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box p={2.5} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe" fontSize="xs">
                  <Text color="#1e40af" fontWeight="bold">
                    Calculated Absence: {calcDays(applyForm.startDate, applyForm.endDate)} calendar days
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reason / Purpose of Leave *</Text>
                  <Textarea
                    size="sm"
                    rows={3}
                    value={applyForm.reason}
                    onChange={e => setApplyForm({ ...applyForm, reason: e.target.value })}
                    placeholder="Provide details on reason and handover arrangements..."
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Submit Leave Request
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Decision Modal */}
      {decisionRequest && (
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
              {decisionType === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              {decisionType === 'Approved'
                ? `Authorizing ${decisionRequest.daysCount} days of ${decisionRequest.leaveType} for ${decisionRequest.employeeName}.`
                : `Rejecting ${decisionRequest.leaveType} for ${decisionRequest.employeeName}.`}
            </Text>

            <Box mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>
                {decisionType === 'Approved' ? 'Approval Comments / Handover Notes' : 'Rejection Reason *'}
              </Text>
              <Textarea
                size="sm"
                rows={3}
                value={decisionComments}
                onChange={e => setDecisionComments(e.target.value)}
                placeholder="Enter comments..."
                required={decisionType === 'Rejected'}
              />
            </Box>

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setDecisionRequest(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette={decisionType === 'Approved' ? 'green' : 'red'}
                onClick={handleConfirmDecision}
                fontWeight="bold"
              >
                Confirm {decisionType}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
