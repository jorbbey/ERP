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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Employee, Payslip, AttendanceRecord, LeaveRequest } from '../../../types';
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Building,
  CreditCard,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Archive,
  Download,
  Printer
} from 'lucide-react';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit?: (emp: Employee) => void;
  onArchive?: (emp: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onArchive
}) => {
  const {
    activeCompany,
    attendance,
    leaves,
    leaveBalances,
    payslips,
    salaryAdvances,
    employeeLoans,
    employeeArchives,
    loginAsEmployee
  } = useERP();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'leaves' | 'payroll' | 'finance' | 'permissions' | 'history'
  >('overview');

  const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);

  if (!isOpen || !employee) return null;

  // Filter employee specific records
  const empAttendance = attendance.filter(a => a.employeeId === employee.id);
  const empLeaves = leaves.filter(l => l.employeeId === employee.id);
  const empBalance = leaveBalances.find(b => b.employeeId === employee.id);
  const empPayslips = payslips.filter(p => p.employeeId === employee.id);
  const empAdvances = salaryAdvances.filter(a => a.employeeId === employee.id);
  const empLoans = employeeLoans.filter(l => l.employeeId === employee.id);
  const empArchiveHistory = employeeArchives.filter(a => a.employeeId === employee.id);

  // Status badge palette
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'green';
      case 'On Leave': return 'blue';
      case 'Archived': return 'yellow';
      case 'Terminated': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(15, 23, 42, 0.7)"
      backdropFilter="blur(4px)"
      zIndex={1300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="16px"
        maxW="1000px"
        w="100%"
        maxH="92vh"
        display="flex"
        flexDirection="column"
        boxShadow="2xl"
        border="1px solid #e2e8f0"
        overflow="hidden"
      >
        {/* Header */}
        <Box px={6} py={5} bg="#0f172a" color="white">
          <Flex justify="space-between" align="flex-start">
            <Flex gap={4} align="center">
              <Box
                w="60px"
                h="60px"
                borderRadius="14px"
                bg="#2563eb"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
                boxShadow="md"
              >
                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </Box>
              <Box>
                <Flex align="center" gap={2}>
                  <Heading size="lg" color="white" fontWeight="bold">
                    {employee.name}
                  </Heading>
                  <Badge colorPalette={getStatusColor(employee.status)} size="sm">
                    {employee.status}
                  </Badge>
                </Flex>
                <Text fontSize="xs" color="#94a3b8" mt={0.5}>
                  {employee.code} • {employee.position} ({employee.designation || employee.role})
                </Text>
                <Text fontSize="xs" color="#cbd5e1" mt={0.5}>
                  {employee.department} • Joined on {employee.hireDate}
                </Text>
              </Box>
            </Flex>

            <Flex gap={2}>
              <Button
                size="sm"
                bg="#1e293b"
                color="white"
                _hover={{ bg: '#334155' }}
                onClick={() => loginAsEmployee(employee)}
              >
                <ShieldCheck size={14} /> Impersonate
              </Button>
              {onEdit && (
                <Button
                  size="sm"
                  bg="#2563eb"
                  color="white"
                  _hover={{ bg: '#1d4ed8' }}
                  onClick={() => onEdit(employee)}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={onClose}
                aria-label="Close"
              >
                <X size={18} />
              </Button>
            </Flex>
          </Flex>

          {/* Navigation Tabs */}
          <Flex gap={4} mt={5} borderBottom="1px solid #334155" overflowX="auto" pb={1}>
            {[
              { id: 'overview', label: 'Dossier Overview', icon: Briefcase },
              { id: 'attendance', label: `Attendance (${empAttendance.length})`, icon: Clock },
              { id: 'leaves', label: `Leaves & Balance (${empLeaves.length})`, icon: Calendar },
              { id: 'payroll', label: `Payslips (${empPayslips.length})`, icon: FileText },
              { id: 'finance', label: `Advances & Loans (${empAdvances.length + empLoans.length})`, icon: DollarSign },
              { id: 'permissions', label: 'ERP Module Access', icon: ShieldCheck },
              { id: 'history', label: 'History & Archive', icon: Archive }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Flex
                  key={tab.id}
                  as="button"
                  align="center"
                  gap={1.5}
                  pb={2}
                  fontSize="xs"
                  fontWeight="bold"
                  color={isActive ? '#60a5fa' : '#94a3b8'}
                  borderBottom={isActive ? '2px solid #60a5fa' : 'none'}
                  mb="-1px"
                  cursor="pointer"
                  whiteSpace="nowrap"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* Tab Body */}
        <Box p={6} overflowY="auto" flex="1" bg="#f8fafc">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <Stack gap={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                {/* Personal & Employment Info */}
                <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Heading size="sm" color="#0f172a" mb={4} display="flex" alignItems="center" gap={2}>
                    <Briefcase size={16} color="#2563eb" /> Employment & Identification
                  </Heading>
                  <Stack gap={3} fontSize="xs">
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Official Code:</Text>
                      <Text fontWeight="bold" fontFamily="mono" color="#0f172a">{employee.code}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Assigned Department:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.department}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Position Title:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.position}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Designation:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.designation || 'Staff Officer'}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">ERP System Role:</Text>
                      <Badge colorPalette="blue" size="sm">{employee.role}</Badge>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Date Joined:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.hireDate}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">National ID (NIN):</Text>
                      <Text fontWeight="mono" color="#0f172a">{employee.nin || 'Unregistered'}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1}>
                      <Text color="#64748b">Tax ID (TIN):</Text>
                      <Text fontWeight="mono" color="#0f172a">{employee.tin || 'Pending Verification'}</Text>
                    </Flex>
                  </Stack>
                </Card.Root>

                {/* Contact & Banking Information */}
                <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Heading size="sm" color="#0f172a" mb={4} display="flex" alignItems="center" gap={2}>
                    <CreditCard size={16} color="#2563eb" /> Contact, Banking & Payroll Setup
                  </Heading>
                  <Stack gap={3} fontSize="xs">
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Email Address:</Text>
                      <Text fontWeight="semibold" color="#2563eb">{employee.email}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Direct Phone:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.phone}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Monthly Base Salary:</Text>
                      <Text fontWeight="bold" color="#059669" fontSize="sm">
                        {activeCompany.currency} {employee.salary?.toLocaleString() || '0'}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Salary Bank:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.bankName || 'Not Set'}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Bank Account Number:</Text>
                      <Text fontWeight="mono" color="#0f172a">{employee.accountNumber || '—'}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Account Beneficiary:</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.accountName || employee.name}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1} borderBottom="1px solid #f1f5f9">
                      <Text color="#64748b">Pension Fund (PFA):</Text>
                      <Text fontWeight="semibold" color="#0f172a">{employee.pfa || 'Apex Pension Trust'}</Text>
                    </Flex>
                    <Flex justify="space-between" py={1}>
                      <Text color="#64748b">Emergency Contact:</Text>
                      <Text fontWeight="semibold" color="#0f172a">
                        {employee.emergencyContactName ? `${employee.emergencyContactName} (${employee.emergencyContactPhone || '—'})` : 'None specified'}
                      </Text>
                    </Flex>
                  </Stack>
                </Card.Root>
              </SimpleGrid>

              {/* Qualifications & Certifications */}
              <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                <Heading size="sm" color="#0f172a" mb={3} display="flex" alignItems="center" gap={2}>
                  <Award size={16} color="#d97706" /> Professional Credentials & Qualifications
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} fontSize="xs">
                  <Box>
                    <Text color="#64748b" fontWeight="semibold" mb={1.5}>Academic Qualifications:</Text>
                    <Flex gap={2} wrap="wrap">
                      {employee.qualifications && employee.qualifications.length > 0 ? (
                        employee.qualifications.map((q, idx) => (
                          <Badge key={idx} colorPalette="purple" variant="subtle" size="sm">{q}</Badge>
                        ))
                      ) : (
                        <Text color="#94a3b8">B.Sc Civil & Construction Engineering</Text>
                      )}
                    </Flex>
                  </Box>
                  <Box>
                    <Text color="#64748b" fontWeight="semibold" mb={1.5}>Certifications & Memberships:</Text>
                    <Flex gap={2} wrap="wrap">
                      {employee.certifications && employee.certifications.length > 0 ? (
                        employee.certifications.map((c, idx) => (
                          <Badge key={idx} colorPalette="teal" variant="subtle" size="sm">{c}</Badge>
                        ))
                      ) : (
                        <Text color="#94a3b8">COREN Registered, NSE Associate</Text>
                      )}
                    </Flex>
                  </Box>
                </SimpleGrid>
              </Card.Root>
            </Stack>
          )}

          {/* TAB 2: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="center" mb={4}>
                <Box>
                  <Heading size="sm" color="#0f172a">Attendance & Time Logs</Heading>
                  <Text fontSize="xs" color="#64748b">Verified biometric and site supervisor punch history.</Text>
                </Box>
                <Badge colorPalette="blue" size="md">
                  Total Logs: {empAttendance.length}
                </Badge>
              </Flex>

              {empAttendance.length === 0 ? (
                <Box p={8} textAlign="center" color="#94a3b8" fontSize="xs">
                  No attendance records recorded for this employee yet.
                </Box>
              ) : (
                <Table.Root size="sm" variant="outline">
                  <Table.Header bg="#f8fafc">
                    <Table.Row>
                      <Table.ColumnHeader>Date</Table.ColumnHeader>
                      <Table.ColumnHeader>Check-In</Table.ColumnHeader>
                      <Table.ColumnHeader>Check-Out</Table.ColumnHeader>
                      <Table.ColumnHeader>Hours Worked</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Notes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {empAttendance.map(a => (
                      <Table.Row key={a.id}>
                        <Table.Cell fontWeight="semibold">{a.attendanceDate}</Table.Cell>
                        <Table.Cell fontFamily="mono" color={a.status === 'late' ? '#dc2626' : '#059669'}>
                          {a.checkIn || '—'}
                        </Table.Cell>
                        <Table.Cell fontFamily="mono">{a.checkOut || '—'}</Table.Cell>
                        <Table.Cell fontWeight="bold">{a.hoursWorked ? `${a.hoursWorked} hrs` : '—'}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            size="sm"
                            colorPalette={
                              a.status === 'present' ? 'green' :
                              a.status === 'late' ? 'yellow' :
                              a.status === 'on_leave' ? 'blue' : 'red'
                            }
                          >
                            {a.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell fontSize="11px" color="#64748b">
                          {a.notes || (a.correctionRequested ? `Correction: ${a.correctionReason}` : 'Regular shift')}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Root>
          )}

          {/* TAB 3: LEAVES & BALANCE */}
          {activeTab === 'leaves' && (
            <Stack gap={5}>
              {/* Leave Balances KPI */}
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" color="#64748b" fontWeight="semibold">Annual Leave Balance</Text>
                  <Flex align="baseline" gap={2} mt={1}>
                    <Heading size="lg" color="#2563eb">
                      {empBalance ? empBalance.annualRemaining : 21}
                    </Heading>
                    <Text fontSize="xs" color="#94a3b8">
                      of {empBalance ? empBalance.annualAllocated : 21} days left
                    </Text>
                  </Flex>
                  <Text fontSize="10px" color="#64748b" mt={1}>
                    Used: {empBalance ? empBalance.annualUsed : 0} days
                  </Text>
                </Card.Root>

                <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" color="#64748b" fontWeight="semibold">Sick Leave Balance</Text>
                  <Flex align="baseline" gap={2} mt={1}>
                    <Heading size="lg" color="#059669">
                      {empBalance ? empBalance.sickRemaining : 12}
                    </Heading>
                    <Text fontSize="xs" color="#94a3b8">
                      of {empBalance ? empBalance.sickAllocated : 12} days left
                    </Text>
                  </Flex>
                  <Text fontSize="10px" color="#64748b" mt={1}>
                    Used: {empBalance ? empBalance.sickUsed : 0} days
                  </Text>
                </Card.Root>

                <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" color="#64748b" fontWeight="semibold">Casual Leave Balance</Text>
                  <Flex align="baseline" gap={2} mt={1}>
                    <Heading size="lg" color="#d97706">
                      {empBalance ? empBalance.casualRemaining : 5}
                    </Heading>
                    <Text fontSize="xs" color="#94a3b8">
                      of {empBalance ? empBalance.casualAllocated : 5} days left
                    </Text>
                  </Flex>
                  <Text fontSize="10px" color="#64748b" mt={1}>
                    Used: {empBalance ? empBalance.casualUsed : 0} days
                  </Text>
                </Card.Root>
              </SimpleGrid>

              {/* Leave Applications History */}
              <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                <Heading size="sm" color="#0f172a" mb={4}>
                  Leave Applications History
                </Heading>
                {empLeaves.length === 0 ? (
                  <Box p={6} textAlign="center" color="#94a3b8" fontSize="xs">
                    No leave applications recorded for this staff member.
                  </Box>
                ) : (
                  <Table.Root size="sm" variant="outline">
                    <Table.Header bg="#f8fafc">
                      <Table.Row>
                        <Table.ColumnHeader>Leave Type</Table.ColumnHeader>
                        <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                        <Table.ColumnHeader>End Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Days</Table.ColumnHeader>
                        <Table.ColumnHeader>Reason</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader>Approval Details</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {empLeaves.map(l => (
                        <Table.Row key={l.id}>
                          <Table.Cell fontWeight="semibold">{l.leaveType}</Table.Cell>
                          <Table.Cell>{l.startDate}</Table.Cell>
                          <Table.Cell>{l.endDate}</Table.Cell>
                          <Table.Cell fontWeight="bold">{l.daysCount} days</Table.Cell>
                          <Table.Cell fontSize="xs" maxW="200px" truncate>{l.reason}</Table.Cell>
                          <Table.Cell>
                            <Badge
                              size="sm"
                              colorPalette={
                                l.status === 'Approved' ? 'green' :
                                l.status === 'Pending' ? 'yellow' :
                                l.status === 'Cancelled' ? 'gray' : 'red'
                              }
                            >
                              {l.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="11px" color="#64748b">
                            {l.approvedBy ? `${l.approvedBy} (${l.approvalDate || ''})` : l.rejectionReason || 'Pending Review'}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                )}
              </Card.Root>
            </Stack>
          )}

          {/* TAB 4: PAYROLL & PAYSLIPS */}
          {activeTab === 'payroll' && (
            <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
              <Heading size="sm" color="#0f172a" mb={4}>
                Historical Payslips & Remuneration
              </Heading>
              {empPayslips.length === 0 ? (
                <Box p={8} textAlign="center" color="#94a3b8" fontSize="xs">
                  No monthly payslips processed yet for this employee.
                </Box>
              ) : (
                <Table.Root size="sm" variant="outline">
                  <Table.Header bg="#f8fafc">
                    <Table.Row>
                      <Table.ColumnHeader>Slip #</Table.ColumnHeader>
                      <Table.ColumnHeader>Basic Wage</Table.ColumnHeader>
                      <Table.ColumnHeader>Allowances</Table.ColumnHeader>
                      <Table.ColumnHeader>Gross Pay</Table.ColumnHeader>
                      <Table.ColumnHeader>Statutory Tax</Table.ColumnHeader>
                      <Table.ColumnHeader>Pension</Table.ColumnHeader>
                      <Table.ColumnHeader>Loan/Advance Ded.</Table.ColumnHeader>
                      <Table.ColumnHeader>Net Take-Home</Table.ColumnHeader>
                      <Table.ColumnHeader>Action</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {empPayslips.map(slip => (
                      <Table.Row key={slip.id}>
                        <Table.Cell fontFamily="mono" fontWeight="bold">#{slip.id}</Table.Cell>
                        <Table.Cell>{activeCompany.currency} {slip.basicSalary.toLocaleString()}</Table.Cell>
                        <Table.Cell>{activeCompany.currency} {slip.allowances.toLocaleString()}</Table.Cell>
                        <Table.Cell fontWeight="semibold">{activeCompany.currency} {slip.grossPay.toLocaleString()}</Table.Cell>
                        <Table.Cell color="#dc2626">-{activeCompany.currency} {slip.tax.toLocaleString()}</Table.Cell>
                        <Table.Cell color="#dc2626">-{activeCompany.currency} {slip.pension.toLocaleString()}</Table.Cell>
                        <Table.Cell color="#dc2626">
                          {slip.loanDeduction > 0 ? `-${activeCompany.currency} ${slip.loanDeduction.toLocaleString()}` : '—'}
                        </Table.Cell>
                        <Table.Cell fontWeight="bold" color="#059669">
                          {activeCompany.currency} {slip.netPay.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setViewingPayslip(slip)}
                          >
                            <FileText size={12} /> View Slip
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Root>
          )}

          {/* TAB 5: ADVANCES & LOANS */}
          {activeTab === 'finance' && (
            <Stack gap={5}>
              {/* Salary Advances */}
              <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                <Heading size="sm" color="#0f172a" mb={3}>Salary Advances</Heading>
                {empAdvances.length === 0 ? (
                  <Text fontSize="xs" color="#94a3b8">No salary advances requested.</Text>
                ) : (
                  <Table.Root size="sm" variant="outline">
                    <Table.Header bg="#f8fafc">
                      <Table.Row>
                        <Table.ColumnHeader>Request Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Amount</Table.ColumnHeader>
                        <Table.ColumnHeader>Deduction Month</Table.ColumnHeader>
                        <Table.ColumnHeader>Reason</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {empAdvances.map(a => (
                        <Table.Row key={a.id}>
                          <Table.Cell>{a.requestDate}</Table.Cell>
                          <Table.Cell fontWeight="bold">{activeCompany.currency} {a.amount.toLocaleString()}</Table.Cell>
                          <Table.Cell>{a.deductionMonth}</Table.Cell>
                          <Table.Cell fontSize="xs">{a.reason}</Table.Cell>
                          <Table.Cell>
                            <Badge
                              size="sm"
                              colorPalette={a.status === 'Approved' ? 'green' : a.status === 'Pending' ? 'yellow' : 'red'}
                            >
                              {a.status}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                )}
              </Card.Root>

              {/* Staff Loans */}
              <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
                <Heading size="sm" color="#0f172a" mb={3}>Employee Loans</Heading>
                {empLoans.length === 0 ? (
                  <Text fontSize="xs" color="#94a3b8">No employee loans recorded.</Text>
                ) : (
                  <Table.Root size="sm" variant="outline">
                    <Table.Header bg="#f8fafc">
                      <Table.Row>
                        <Table.ColumnHeader>Total Principal</Table.ColumnHeader>
                        <Table.ColumnHeader>Monthly Deduction</Table.ColumnHeader>
                        <Table.ColumnHeader>Repaid</Table.ColumnHeader>
                        <Table.ColumnHeader>Remaining</Table.ColumnHeader>
                        <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {empLoans.map(l => (
                        <Table.Row key={l.id}>
                          <Table.Cell fontWeight="bold">{activeCompany.currency} {l.totalAmount.toLocaleString()}</Table.Cell>
                          <Table.Cell>{activeCompany.currency} {l.monthlyDeduction.toLocaleString()}/mo</Table.Cell>
                          <Table.Cell color="#059669">{activeCompany.currency} {l.repaidAmount.toLocaleString()}</Table.Cell>
                          <Table.Cell color="#dc2626" fontWeight="semibold">
                            {activeCompany.currency} {(l.totalAmount - l.repaidAmount).toLocaleString()}
                          </Table.Cell>
                          <Table.Cell>{l.startDate}</Table.Cell>
                          <Table.Cell>
                            <Badge size="sm" colorPalette={l.status === 'Settled' ? 'green' : 'blue'}>
                              {l.status}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                )}
              </Card.Root>
            </Stack>
          )}

          {/* TAB 6: ERP MODULE PERMISSIONS */}
          {activeTab === 'permissions' && (
            <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
              <Heading size="sm" color="#0f172a" mb={1}>
                Explicit Staff Module Access (employee_module_access)
              </Heading>
              <Text fontSize="xs" color="#64748b" mb={4}>
                Controls which ERP sub-modules this employee has authorization to access within company #{activeCompany.name}.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
                {[
                  { key: 'projects', label: 'Projects & Engineering', desc: 'Project budgets, delay notes, QA and tasks' },
                  { key: 'requisitions', label: 'Requisitions & Dispatch', desc: 'Material requests, multi-level approvals, waybills' },
                  { key: 'inventory', label: 'Inventory & Warehousing', desc: 'Store items, stock movements, adjustments' },
                  { key: 'procurement', label: 'Procurement & Suppliers', desc: 'Purchase orders, GRN inspection, vendor management' },
                  { key: 'hr', label: 'Human Resources & Directory', desc: 'Staff directory, onboarding, attendance, leave' },
                  { key: 'payroll', label: 'Payroll & Compensation', desc: 'Monthly payroll runs, statutory deductions, payslips' },
                  { key: 'rmc', label: 'Ready-Mix Concrete (RMC)', desc: 'Mix designs, batch tickets, slump quality' },
                  { key: 'contracts', label: 'Contract Administration', desc: 'Contract administration, bonds, events log' },
                  { key: 'accounting', label: 'General Accounting', desc: 'Chart of accounts, general ledger, journals' },
                  { key: 'portals', label: 'Subcontractor / Client Portals', desc: 'External stakeholder portal management' }
                ].map(mod => (
                  <Box
                    key={mod.key}
                    p={3.5}
                    borderRadius="10px"
                    border="1px solid #e2e8f0"
                    bg="#f8fafc"
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold" fontSize="xs" color="#0f172a">{mod.label}</Text>
                      <Badge colorPalette="green" size="sm">Granted</Badge>
                    </Flex>
                    <Text fontSize="11px" color="#64748b" mt={1}>{mod.desc}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Card.Root>
          )}

          {/* TAB 7: HISTORY & ARCHIVE */}
          {activeTab === 'history' && (
            <Card.Root bg="white" p={5} borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs">
              <Heading size="sm" color="#0f172a" mb={3}>
                Employment Status & Archive History
              </Heading>
              {empArchiveHistory.length === 0 ? (
                <Text fontSize="xs" color="#64748b">
                  No historical archiving records found for this employee. Current status is <Badge colorPalette={getStatusColor(employee.status)} size="sm">{employee.status}</Badge>.
                </Text>
              ) : (
                <Table.Root size="sm" variant="outline">
                  <Table.Header bg="#f8fafc">
                    <Table.Row>
                      <Table.ColumnHeader>Archive Date</Table.ColumnHeader>
                      <Table.ColumnHeader>Reason</Table.ColumnHeader>
                      <Table.ColumnHeader>Archived By</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {empArchiveHistory.map(a => (
                      <Table.Row key={a.id}>
                        <Table.Cell>{a.deletedAt}</Table.Cell>
                        <Table.Cell fontSize="xs">{a.reason}</Table.Cell>
                        <Table.Cell>{a.archivedBy}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Root>
          )}
        </Box>

        {/* Modal Footer */}
        <Flex px={6} py={3} borderTop="1px solid #e2e8f0" justify="space-between" align="center" bg="#f8fafc">
          <Text fontSize="xs" color="#64748b">
            Record ID: #{employee.id} • Registered {employee.hireDate}
          </Text>
          <Flex gap={2}>
            {employee.status === 'Active' && onArchive && (
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => onArchive(employee)}
              >
                Archive Record
              </Button>
            )}
            <Button size="sm" colorPalette="blue" onClick={onClose}>
              Close Dossier
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Payslip Voucher Preview Modal */}
      {viewingPayslip && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.75)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Flex justify="space-between" align="center" borderBottom="2px solid #0f172a" pb={3} mb={4}>
              <Box>
                <Heading size="md" color="#0f172a">{activeCompany.name}</Heading>
                <Text fontSize="xs" color="#64748b">OFFICIAL MONTHLY SALARY PAYSLIP</Text>
              </Box>
              <Badge colorPalette="green" size="md">VOUCHER #{viewingPayslip.id}</Badge>
            </Flex>

            <Stack gap={3} fontSize="xs">
              <Flex justify="space-between">
                <Text color="#64748b">Staff Name:</Text>
                <Text fontWeight="bold" color="#0f172a">{viewingPayslip.employeeName}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Employee Code:</Text>
                <Text fontFamily="mono" fontWeight="bold">{viewingPayslip.employeeCode}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Department:</Text>
                <Text fontWeight="semibold">{viewingPayslip.department}</Text>
              </Flex>

              <Box my={2} p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>Earnings</Text>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Basic Wage:</Text>
                  <Text fontWeight="semibold">{activeCompany.currency} {viewingPayslip.basicSalary.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Housing & Transport Allowances:</Text>
                  <Text fontWeight="semibold">{activeCompany.currency} {viewingPayslip.allowances.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={1} borderTop="1px solid #e2e8f0" mt={1}>
                  <Text fontWeight="bold">Total Gross Pay:</Text>
                  <Text fontWeight="bold">{activeCompany.currency} {viewingPayslip.grossPay.toLocaleString()}</Text>
                </Flex>
              </Box>

              <Box my={1} p={3} bg="#fff1f2" borderRadius="8px" border="1px solid #fecdd3">
                <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#e11d48" mb={2}>Statutory Deductions</Text>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">PAYE Income Tax:</Text>
                  <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {viewingPayslip.tax.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Pension Contribution (8%):</Text>
                  <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {viewingPayslip.pension.toLocaleString()}</Text>
                </Flex>
                {viewingPayslip.loanDeduction > 0 && (
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Advance / Loan Recovery:</Text>
                    <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {viewingPayslip.loanDeduction.toLocaleString()}</Text>
                  </Flex>
                )}
                <Flex justify="space-between" py={1} borderTop="1px solid #fecdd3" mt={1}>
                  <Text fontWeight="bold" color="#9f1239">Total Deductions:</Text>
                  <Text fontWeight="bold" color="#9f1239">-{activeCompany.currency} {viewingPayslip.totalDeductions.toLocaleString()}</Text>
                </Flex>
              </Box>

              <Flex justify="space-between" p={3} bg="#ecfdf5" borderRadius="8px" border="1px solid #a7f3d0" align="center">
                <Text fontWeight="bold" color="#065f46" fontSize="sm">NET TAKE-HOME PAY:</Text>
                <Text fontWeight="bold" color="#047857" fontSize="md" fontFamily="mono">
                  {activeCompany.currency} {viewingPayslip.netPay.toLocaleString()}
                </Text>
              </Flex>
            </Stack>

            <Flex justify="flex-end" gap={2} mt={5}>
              <Button size="sm" variant="outline" onClick={() => setViewingPayslip(null)}>
                Close
              </Button>
              <Button size="sm" colorPalette="blue" onClick={() => window.print()}>
                <Printer size={14} /> Print Payslip
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};
