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
  Textarea,
  Progress
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { SalaryAdvance, EmployeeLoan } from '../../../types';
import {
  DollarSign,
  CreditCard,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdvancesLoansTab: React.FC = () => {
  const {
    salaryAdvances,
    requestSalaryAdvance,
    decideSalaryAdvance,
    employeeLoans,
    createEmployeeLoan,
    markLoanInstallmentPaid,
    employees,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'advances' | 'loans'>('advances');

  // Advances Form
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advanceForm, setAdvanceForm] = useState({
    employeeId: employees[0]?.id || 1,
    amount: 500,
    deductionMonth: 'November 2026',
    reason: 'Emergency medical support'
  });

  // Loans Form
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanForm, setLoanForm] = useState({
    employeeId: employees[0]?.id || 1,
    totalAmount: 3000,
    monthlyDeduction: 300,
    startDate: new Date().toISOString().split('T')[0]
  });

  // Pay Installment modal
  const [payingLoan, setPayingLoan] = useState<EmployeeLoan | null>(null);
  const [installmentAmount, setInstallmentAmount] = useState(300);

  const canApprove = ['Managing Director', 'HR Manager', 'Finance Manager', 'Super Admin'].includes(activeRole);

  const handleRequestAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === Number(advanceForm.employeeId));
    if (!emp) return;

    requestSalaryAdvance({
      employeeId: emp.id,
      employeeName: emp.name,
      amount: Number(advanceForm.amount) || 100,
      deductionMonth: advanceForm.deductionMonth,
      reason: advanceForm.reason.trim()
    });

    setShowAdvanceModal(false);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === Number(loanForm.employeeId));
    if (!emp) return;

    createEmployeeLoan({
      employeeId: emp.id,
      employeeName: emp.name,
      totalAmount: Number(loanForm.totalAmount) || 1000,
      monthlyDeduction: Number(loanForm.monthlyDeduction) || 100,
      startDate: loanForm.startDate
    });

    setShowLoanModal(false);
  };

  const handlePayInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingLoan) return;

    markLoanInstallmentPaid(payingLoan.id, Number(installmentAmount) || 0);
    setPayingLoan(null);
  };

  // Metrics
  const totalAdvancesSum = salaryAdvances.reduce((sum, a) => sum + a.amount, 0);
  const pendingAdvancesCount = salaryAdvances.filter(a => a.status === 'Pending').length;

  const totalLoansSum = employeeLoans.reduce((sum, l) => sum + l.totalAmount, 0);
  const totalRepaidSum = employeeLoans.reduce((sum, l) => sum + l.repaidAmount, 0);
  const totalOutstanding = Math.max(0, totalLoansSum - totalRepaidSum);

  return (
    <Stack gap={6}>
      {/* Metric Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Total Advances Disbursed</Text>
              <Heading size="xl" color="#0f172a" mt={1}>
                {activeCompany.currency} {totalAdvancesSum.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>{pendingAdvancesCount} Requests Pending</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <DollarSign size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Total Loan Principal</Text>
              <Heading size="xl" color="#2563eb" mt={1}>
                {activeCompany.currency} {totalLoansSum.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>{employeeLoans.length} Loans Granted</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <CreditCard size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Loan Principal Repaid</Text>
              <Heading size="xl" color="#059669" mt={1}>
                {activeCompany.currency} {totalRepaidSum.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#059669" mt={1}>Payroll Deductions</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <CheckCircle2 size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Outstanding Loan Balance</Text>
              <Heading size="xl" color="#dc2626" mt={1}>
                {activeCompany.currency} {totalOutstanding.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#dc2626" mt={1}>Receivable from Staff</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fef2f2" color="#dc2626">
              <Clock size={22} />
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
          color={activeSubTab === 'advances' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'advances' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('advances')}
        >
          Salary Advances Register ({salaryAdvances.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'loans' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'loans' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('loans')}
        >
          Staff Loan Portfolios & Repayments ({employeeLoans.length})
        </Box>
      </Flex>

      {/* Sub-Tab 1: Salary Advances */}
      {activeSubTab === 'advances' && (
        <Stack gap={4}>
          <Flex justify="flex-end">
            <Button
              size="sm"
              colorPalette="blue"
              onClick={() => setShowAdvanceModal(true)}
              fontWeight="bold"
            >
              <Plus size={14} /> Request Salary Advance
            </Button>
          </Flex>

          <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Staff Member</Table.ColumnHeader>
                  <Table.ColumnHeader>Request Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Requested Amount</Table.ColumnHeader>
                  <Table.ColumnHeader>Deduction Month</Table.ColumnHeader>
                  <Table.ColumnHeader>Reason / Purpose</Table.ColumnHeader>
                  <Table.ColumnHeader>Approval Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {salaryAdvances.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={7} textAlign="center" py={8} color="#94a3b8">
                      No salary advance applications on file.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  salaryAdvances.map(adv => (
                    <Table.Row key={adv.id}>
                      <Table.Cell fontWeight="bold">{adv.employeeName}</Table.Cell>
                      <Table.Cell fontSize="xs">{adv.requestDate}</Table.Cell>
                      <Table.Cell fontWeight="bold" color="#2563eb">
                        {activeCompany.currency} {adv.amount.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="semibold">{adv.deductionMonth}</Table.Cell>
                      <Table.Cell fontSize="xs" maxW="250px" truncate>{adv.reason}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          size="sm"
                          colorPalette={adv.status === 'Approved' ? 'green' : adv.status === 'Pending' ? 'yellow' : 'red'}
                        >
                          {adv.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {adv.status === 'Pending' && canApprove && (
                          <Flex justify="flex-end" gap={1}>
                            <Button
                              size="xs"
                              colorPalette="green"
                              onClick={() => decideSalaryAdvance(adv.id, 'Approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              colorPalette="red"
                              variant="outline"
                              onClick={() => decideSalaryAdvance(adv.id, 'Rejected')}
                            >
                              Reject
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

      {/* Sub-Tab 2: Staff Loans */}
      {activeSubTab === 'loans' && (
        <Stack gap={4}>
          <Flex justify="flex-end">
            <Button
              size="sm"
              colorPalette="blue"
              onClick={() => setShowLoanModal(true)}
              fontWeight="bold"
            >
              <Plus size={14} /> Grant Employee Loan
            </Button>
          </Flex>

          <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Staff Member</Table.ColumnHeader>
                  <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Total Principal</Table.ColumnHeader>
                  <Table.ColumnHeader>Monthly Deduction</Table.ColumnHeader>
                  <Table.ColumnHeader>Repaid</Table.ColumnHeader>
                  <Table.ColumnHeader>Remaining Balance</Table.ColumnHeader>
                  <Table.ColumnHeader>Progress</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Repayment Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {employeeLoans.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={9} textAlign="center" py={8} color="#94a3b8">
                      No staff loans recorded.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  employeeLoans.map(loan => {
                    const remaining = Math.max(0, loan.totalAmount - loan.repaidAmount);
                    const pct = Math.min(100, Math.round((loan.repaidAmount / loan.totalAmount) * 100));

                    return (
                      <Table.Row key={loan.id}>
                        <Table.Cell fontWeight="bold">{loan.employeeName}</Table.Cell>
                        <Table.Cell fontSize="xs">{loan.startDate}</Table.Cell>
                        <Table.Cell fontWeight="bold">
                          {activeCompany.currency} {loan.totalAmount.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          {activeCompany.currency} {loan.monthlyDeduction.toLocaleString()}/mo
                        </Table.Cell>
                        <Table.Cell color="#059669" fontWeight="semibold">
                          {activeCompany.currency} {loan.repaidAmount.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell color="#dc2626" fontWeight="bold">
                          {activeCompany.currency} {remaining.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell minW="120px">
                          <Flex align="center" gap={2}>
                            <Progress.Root value={pct} size="xs" colorPalette={pct === 100 ? 'green' : 'blue'} flex="1">
                              <Progress.Track bg="#e2e8f0">
                                <Progress.Range />
                              </Progress.Track>
                            </Progress.Root>
                            <Text fontSize="10px" color="#64748b">{pct}%</Text>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge size="sm" colorPalette={loan.status === 'Settled' ? 'green' : 'blue'}>
                            {loan.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          {loan.status === 'Active' && (
                            <Button
                              size="xs"
                              colorPalette="blue"
                              variant="outline"
                              onClick={() => {
                                setPayingLoan(loan);
                                setInstallmentAmount(loan.monthlyDeduction);
                              }}
                            >
                              Record Payment
                            </Button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* Request Advance Modal */}
      {showAdvanceModal && (
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
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Request Salary Advance
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Emergency salary advance to be deducted in full from next payroll run.
            </Text>

            <form onSubmit={handleRequestAdvance}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Beneficiary Staff Member *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={advanceForm.employeeId}
                      onChange={e => setAdvanceForm({ ...advanceForm, employeeId: Number(e.target.value) })}
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} (Salary: {activeCompany.currency} {e.salary?.toLocaleString()})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Advance Amount ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={advanceForm.amount}
                      onChange={e => setAdvanceForm({ ...advanceForm, amount: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Deduction Month *</Text>
                    <Input
                      size="sm"
                      value={advanceForm.deductionMonth}
                      onChange={e => setAdvanceForm({ ...advanceForm, deductionMonth: e.target.value })}
                      placeholder="e.g. November 2026"
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reason / Justification *</Text>
                  <Textarea
                    size="sm"
                    rows={3}
                    value={advanceForm.reason}
                    onChange={e => setAdvanceForm({ ...advanceForm, reason: e.target.value })}
                    placeholder="Provide details on advance reason..."
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAdvanceModal(false)}>
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

      {/* Grant Loan Modal */}
      {showLoanModal && (
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
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Grant Employee Loan Facility
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Long-term corporate loan with scheduled monthly payroll recovery installments.
            </Text>

            <form onSubmit={handleCreateLoan}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Borrower Employee *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={loanForm.employeeId}
                      onChange={e => setLoanForm({ ...loanForm, employeeId: Number(e.target.value) })}
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} (Salary: {activeCompany.currency} {e.salary?.toLocaleString()})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Total Principal ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={loanForm.totalAmount}
                      onChange={e => setLoanForm({ ...loanForm, totalAmount: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Monthly Deduction ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={loanForm.monthlyDeduction}
                      onChange={e => setLoanForm({ ...loanForm, monthlyDeduction: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Repayment Start Date *</Text>
                  <Input
                    size="sm"
                    type="date"
                    value={loanForm.startDate}
                    onChange={e => setLoanForm({ ...loanForm, startDate: e.target.value })}
                    required
                  />
                </Box>

                <Box p={2.5} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe" fontSize="xs" color="#1e40af">
                  Estimated Repayment Tenure: {Math.ceil(loanForm.totalAmount / (loanForm.monthlyDeduction || 1))} months
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowLoanModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Approve & Grant Loan
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Pay Installment Modal */}
      {payingLoan && (
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
          <Box bg="white" borderRadius="16px" maxW="420px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Record Loan Repayment
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Borrower: <strong>{payingLoan.employeeName}</strong> • Outstanding: {activeCompany.currency} {(payingLoan.totalAmount - payingLoan.repaidAmount).toLocaleString()}
            </Text>

            <form onSubmit={handlePayInstallment}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Installment Amount ({activeCompany.currency}) *</Text>
                  <Input
                    size="sm"
                    type="number"
                    value={installmentAmount}
                    onChange={e => setInstallmentAmount(Number(e.target.value))}
                    max={payingLoan.totalAmount - payingLoan.repaidAmount}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setPayingLoan(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="green" type="submit" fontWeight="bold">
                    Credit Repayment
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
