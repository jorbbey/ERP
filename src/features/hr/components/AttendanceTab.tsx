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
  Input,
  NativeSelect,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { AttendanceRecord } from '../../../types';
import {
  Clock,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  UserX,
  FileCheck
} from 'lucide-react';

export const AttendanceTab: React.FC = () => {
  const {
    attendance,
    employees,
    departments,
    clockIn,
    clockOut,
    recordManualAttendance,
    requestAttendanceCorrection,
    decideAttendanceCorrection,
    currentUserName,
    activeRole
  } = useERP();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Current user employee record
  const currentEmp = employees.find(e => e.name === currentUserName) || employees[0];
  const userTodayAttendance = attendance.find(
    a => a.employeeId === currentEmp?.id && a.attendanceDate === todayStr
  );

  // Filters
  const [dateFilter, setDateFilter] = useState(todayStr);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    employeeId: employees[0]?.id || 1,
    attendanceDate: todayStr,
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present' as AttendanceRecord['status'],
    notes: 'Approved site operations shift'
  });

  const [correctionTarget, setCorrectionTarget] = useState<AttendanceRecord | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'corrections'>('records');

  const filteredAttendance = attendance.filter(a => {
    const matchesDate = !dateFilter || dateFilter === 'All' || a.attendanceDate === dateFilter;
    const matchesDept = deptFilter === 'All' || a.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesDept && matchesStatus && matchesSearch;
  });

  // Pending corrections
  const pendingCorrections = attendance.filter(a => a.correctionRequested && a.correctionStatus === 'Pending');

  // Metrics for today
  const todayLogs = attendance.filter(a => a.attendanceDate === todayStr);
  const presentCount = todayLogs.filter(a => a.status === 'present').length;
  const lateCount = todayLogs.filter(a => a.status === 'late').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const absentCount = Math.max(0, employees.filter(e => e.status === 'Active').length - todayLogs.length);

  const handleClockIn = () => {
    const res = clockIn(currentEmp?.id);
    if (!res.success && res.error) {
      alert(res.error);
    }
  };

  const handleClockOut = () => {
    const res = clockOut(currentEmp?.id);
    if (!res.success && res.error) {
      alert(res.error);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordManualAttendance({
      employeeId: Number(manualForm.employeeId),
      attendanceDate: manualForm.attendanceDate,
      checkIn: manualForm.checkIn ? `${manualForm.checkIn}:00` : undefined,
      checkOut: manualForm.checkOut ? `${manualForm.checkOut}:00` : undefined,
      status: manualForm.status,
      notes: manualForm.notes
    });
    setShowManualModal(false);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget || !correctionReason.trim()) return;
    requestAttendanceCorrection(correctionTarget.id, correctionReason.trim());
    setCorrectionTarget(null);
    setCorrectionReason('');
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'green';
      case 'late': return 'yellow';
      case 'on_leave': return 'blue';
      case 'absent': return 'red';
      default: return 'gray';
    }
  };

  const canManageAttendance = ['Managing Director', 'HR Manager', 'Project Manager', 'Super Admin'].includes(activeRole);

  return (
    <Stack gap={6}>
      {/* Top Banner & Quick Clock-In Widget */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={4}>
        {/* Clock In / Out Terminal */}
        <Box gridColumn={{ base: 'span 12', lg: 'span 5' }}>
          <Card.Root bg="#0f172a" color="white" borderRadius="16px" p={5} border="1px solid #1e293b" boxShadow="md" h="100%">
            <Flex justify="space-between" align="center" mb={3}>
              <Flex align="center" gap={2}>
                <Clock size={18} color="#60a5fa" />
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#94a3b8">
                  Virtual Biometric Clock Terminal
                </Text>
              </Flex>
              <Badge colorPalette="blue" size="sm">
                Active Session
              </Badge>
            </Flex>

            <Flex justify="space-between" align="center" my={2}>
              <Box>
                <Heading size="xl" fontFamily="mono" color="white">
                  {currentTime}
                </Heading>
                <Text fontSize="xs" color="#94a3b8">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" fontWeight="bold" color="white">{currentUserName}</Text>
                <Text fontSize="11px" color="#60a5fa">{currentEmp?.code} • {activeRole}</Text>
              </Box>
            </Flex>

            {/* Current day status indicator */}
            <Box p={3} bg="#1e293b" borderRadius="10px" my={3} border="1px solid #334155">
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="#94a3b8">Today's Attendance Status:</Text>
                {userTodayAttendance ? (
                  <Badge colorPalette={getStatusColor(userTodayAttendance.status)} size="sm">
                    {userTodayAttendance.status.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge colorPalette="gray" size="sm">NOT CLOCKED IN</Badge>
                )}
              </Flex>
              {userTodayAttendance && (
                <SimpleGrid columns={3} gap={2} mt={2} pt={2} borderTop="1px solid #334155" fontSize="11px">
                  <Box>
                    <Text color="#64748b">In:</Text>
                    <Text fontWeight="mono" color="#4ade80">{userTodayAttendance.checkIn || '—'}</Text>
                  </Box>
                  <Box>
                    <Text color="#64748b">Out:</Text>
                    <Text fontWeight="mono" color="#f87171">{userTodayAttendance.checkOut || 'Active'}</Text>
                  </Box>
                  <Box>
                    <Text color="#64748b">Duration:</Text>
                    <Text fontWeight="bold" color="white">{userTodayAttendance.hoursWorked ? `${userTodayAttendance.hoursWorked} hrs` : 'Working...'}</Text>
                  </Box>
                </SimpleGrid>
              )}
            </Box>

            {/* Action Buttons */}
            <Flex gap={3}>
              <Button
                flex="1"
                size="sm"
                colorPalette="green"
                disabled={!!userTodayAttendance?.checkIn}
                onClick={handleClockIn}
                fontWeight="bold"
              >
                <Play size={14} /> Clock In (Start Shift)
              </Button>
              <Button
                flex="1"
                size="sm"
                colorPalette="red"
                disabled={!userTodayAttendance?.checkIn || !!userTodayAttendance?.checkOut}
                onClick={handleClockOut}
                fontWeight="bold"
              >
                <Square size={14} /> Clock Out (End Shift)
              </Button>
            </Flex>
          </Card.Root>
        </Box>

        {/* Attendance Daily KPIs */}
        <Box gridColumn={{ base: 'span 12', lg: 'span 7' }}>
          <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} gap={3} h="100%">
            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Present Today</Text>
              <Heading size="xl" color="#059669" mt={2}>{presentCount}</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>On-Time Arrivals</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Late Arrivals</Text>
              <Heading size="xl" color="#d97706" mt={2}>{lateCount}</Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>After 08:15 AM</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">On Leave</Text>
              <Heading size="xl" color="#2563eb" mt={2}>{onLeaveCount}</Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>Authorized Leave</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Unreported</Text>
              <Heading size="xl" color="#dc2626" mt={2}>{absentCount}</Heading>
              <Text fontSize="11px" color="#dc2626" mt={1}>Missing Punch</Text>
            </Card.Root>
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      {/* Navigation Sub-Tabs: Records vs Correction Requests */}
      <Flex borderBottom="2px solid #e2e8f0" gap={6}>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'records' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'records' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('records')}
        >
          Daily & Historical Attendance Records ({filteredAttendance.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'corrections' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'corrections' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('corrections')}
        >
          Correction Requests ({pendingCorrections.length})
        </Box>
      </Flex>

      {/* Sub-Tab 1: Records */}
      {activeSubTab === 'records' && (
        <Stack gap={4}>
          {/* Filter Bar */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Flex gap={2} wrap="wrap" align="center" flex="1">
                {/* Date Filter */}
                <Box minW="150px">
                  <Input
                    size="xs"
                    type="date"
                    value={dateFilter === 'All' ? '' : dateFilter}
                    onChange={e => setDateFilter(e.target.value || 'All')}
                  />
                </Box>
                <Button
                  size="xs"
                  variant={dateFilter === todayStr ? 'solid' : 'outline'}
                  colorPalette="blue"
                  onClick={() => setDateFilter(todayStr)}
                >
                  Today
                </Button>
                <Button
                  size="xs"
                  variant={dateFilter === 'All' ? 'solid' : 'outline'}
                  onClick={() => setDateFilter('All')}
                >
                  All Dates
                </Button>

                {/* Department Filter */}
                <Box minW="170px">
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

                {/* Status Filter */}
                <Box minW="130px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="on_leave">On Leave</option>
                      <option value="absent">Absent</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </Flex>

              <Flex gap={2} align="center">
                <Box position="relative" minW="220px">
                  <Input
                    size="xs"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    pl={7}
                  />
                  <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" color="#94a3b8">
                    <Search size={12} />
                  </Box>
                </Box>

                {canManageAttendance && (
                  <Button
                    size="xs"
                    colorPalette="blue"
                    onClick={() => setShowManualModal(true)}
                    fontWeight="bold"
                  >
                    <Plus size={12} /> Manual Entry
                  </Button>
                )}
              </Flex>
            </Flex>
          </Card.Root>

          {/* Records Table */}
          <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Staff Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Employee Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Department</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Clock In</Table.ColumnHeader>
                  <Table.ColumnHeader>Clock Out</Table.ColumnHeader>
                  <Table.ColumnHeader>Hours Worked</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Notes / Remarks</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredAttendance.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={10} textAlign="center" py={8} color="#94a3b8">
                      No attendance records found matching filters.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredAttendance.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell fontFamily="mono" fontWeight="bold" fontSize="xs" color="#2563eb">
                        {record.employeeCode}
                      </Table.Cell>
                      <Table.Cell fontWeight="bold" fontSize="xs">
                        {record.employeeName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#475569">
                        {record.department}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        {record.attendanceDate}
                      </Table.Cell>
                      <Table.Cell fontFamily="mono" fontSize="xs" color={record.status === 'late' ? '#dc2626' : '#059669'}>
                        {record.checkIn || '—'}
                      </Table.Cell>
                      <Table.Cell fontFamily="mono" fontSize="xs">
                        {record.checkOut || '—'}
                      </Table.Cell>
                      <Table.Cell fontWeight="bold" fontSize="xs">
                        {record.hoursWorked ? `${record.hoursWorked} hrs` : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="11px" color="#64748b" maxW="220px" truncate>
                        {record.notes || (record.correctionRequested ? `[Correction: ${record.correctionReason}]` : 'Regular roster punch')}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {!record.correctionRequested ? (
                          <Button
                            size="xs"
                            variant="ghost"
                            color="#2563eb"
                            onClick={() => setCorrectionTarget(record)}
                          >
                            Correct
                          </Button>
                        ) : (
                          <Badge size="xs" colorPalette={record.correctionStatus === 'Approved' ? 'green' : 'yellow'}>
                            {record.correctionStatus || 'Pending'}
                          </Badge>
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

      {/* Sub-Tab 2: Pending Correction Requests */}
      {activeSubTab === 'corrections' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Heading size="md" color="#0f172a" mb={1}>
            Attendance Discrepancy & Correction Requests
          </Heading>
          <Text fontSize="xs" color="#64748b" mb={4}>
            Biometric failure corrections, missed punches, and supervisor justifications requiring HR/Project Manager signoff.
          </Text>

          {pendingCorrections.length === 0 ? (
            <Box p={8} textAlign="center" color="#94a3b8" fontSize="xs">
              <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 8px auto' }} />
              No pending attendance correction requests. All records are verified!
            </Box>
          ) : (
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Employee</Table.ColumnHeader>
                  <Table.ColumnHeader>Shift Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Punch Logged</Table.ColumnHeader>
                  <Table.ColumnHeader>Correction Reason / Justification</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Manager Decisions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pendingCorrections.map(c => (
                  <Table.Row key={c.id}>
                    <Table.Cell>
                      <Text fontWeight="bold" fontSize="xs">{c.employeeName}</Text>
                      <Text fontSize="10px" color="#64748b">{c.employeeCode} • {c.department}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">{c.attendanceDate}</Table.Cell>
                    <Table.Cell fontFamily="mono" fontSize="xs">
                      {c.checkIn || 'None'} - {c.checkOut || 'None'} ({c.status})
                    </Table.Cell>
                    <Table.Cell fontSize="xs" maxW="300px">
                      {c.correctionReason}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="yellow" size="sm">Pending Approval</Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={2}>
                        <Button
                          size="xs"
                          colorPalette="green"
                          onClick={() => decideAttendanceCorrection(c.id, 'Approved', 'Approved by supervisor')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          colorPalette="red"
                          variant="outline"
                          onClick={() => decideAttendanceCorrection(c.id, 'Rejected', 'Insufficient verification')}
                        >
                          Reject
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

      {/* Manual Entry Modal */}
      {showManualModal && (
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
              Manual Attendance Entry
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Directly record shift attendance for personnel without digital biometric access.
            </Text>

            <form onSubmit={handleManualSubmit}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Employee *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={manualForm.employeeId}
                      onChange={e => setManualForm({ ...manualForm, employeeId: Number(e.target.value) })}
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
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Shift Date *</Text>
                  <Input
                    size="sm"
                    type="date"
                    value={manualForm.attendanceDate}
                    onChange={e => setManualForm({ ...manualForm, attendanceDate: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Check-In Time</Text>
                    <Input
                      size="sm"
                      type="time"
                      value={manualForm.checkIn}
                      onChange={e => setManualForm({ ...manualForm, checkIn: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Check-Out Time</Text>
                    <Input
                      size="sm"
                      type="time"
                      value={manualForm.checkOut}
                      onChange={e => setManualForm({ ...manualForm, checkOut: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Attendance Status</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={manualForm.status}
                      onChange={e => setManualForm({ ...manualForm, status: e.target.value as any })}
                    >
                      <option value="present">Present (Normal)</option>
                      <option value="late">Late Arrival</option>
                      <option value="on_leave">On Authorized Leave</option>
                      <option value="absent">Absent</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Operational Notes / Reason</Text>
                  <Input
                    size="sm"
                    value={manualForm.notes}
                    onChange={e => setManualForm({ ...manualForm, notes: e.target.value })}
                    placeholder="e.g. Field site bridge piling shift"
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowManualModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Save Record
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Correction Request Modal */}
      {correctionTarget && (
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
              Request Attendance Correction
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Submit justification for discrepancy on <strong>{correctionTarget.attendanceDate}</strong> for <strong>{correctionTarget.employeeName}</strong>.
            </Text>

            <form onSubmit={handleCorrectionSubmit}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reason / Incident Details *</Text>
                  <Textarea
                    size="sm"
                    rows={3}
                    value={correctionReason}
                    onChange={e => setCorrectionReason(e.target.value)}
                    placeholder="e.g. Gate biometric reader offline; arrived 07:50 AM witnessed by Chief Security Officer"
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setCorrectionTarget(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Submit Request
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
