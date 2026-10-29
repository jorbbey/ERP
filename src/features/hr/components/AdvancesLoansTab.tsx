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
import { SalaryAdvance, EmployeeLoan, LoanPaymentRecord } from '../../../types';
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
  AlertCircle,
  Receipt,
  Printer,
  Search,
  FileText,
  History,
  Building2,
  ExternalLink
} from 'lucide-react';

export const AdvancesLoansTab: React.FC = () => {
  const {
    salaryAdvances,
    requestSalaryAdvance,
    decideSalaryAdvance,
    employeeLoans,
    createEmployeeLoan,
    markLoanInstallmentPaid,
    loanPayments,
    recordLoanPayment,
    employees,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'advances' | 'loans' | 'history'>('advances');

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
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Payroll Deduction' | 'Direct Bank Transfer' | 'Cash Deposit' | 'Cheque'>('Direct Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Selected Loan for Historical Ledger View
  const [selectedLoanForHistory, setSelectedLoanForHistory] = useState<EmployeeLoan | null>(null);

  // Selected Payment Record for Printable Receipt Slip
  const [selectedReceipt, setSelectedReceipt] = useState<LoanPaymentRecord | null>(null);

  // History Tab Search & Filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyMethodFilter, setHistoryMethodFilter] = useState('All');

  // Direct Outside Payment Modal (from History tab)
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false);
  const [directPayForm, setDirectPayForm] = useState({
    loanId: employeeLoans[0]?.id || 1,
    amount: 500,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Direct Bank Transfer' as const,
    referenceNumber: `REC-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    notes: 'Direct recovery payment'
  });

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

    const ref = paymentReference.trim() || `REC-${Date.now().toString().slice(-6)}`;
    markLoanInstallmentPaid(payingLoan.id, Number(installmentAmount) || 0, {
      paymentMethod,
      referenceNumber: ref,
      notes: paymentNotes.trim() || `Outside loan repayment via ${paymentMethod}`
    });
    setPayingLoan(null);
  };

  const handleDirectPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLoan = employeeLoans.find(l => l.id === Number(directPayForm.loanId));
    if (!targetLoan) return;

    const remaining = Math.max(0, targetLoan.totalAmount - targetLoan.repaidAmount);
    const payAmt = Math.min(remaining, Math.max(1, Number(directPayForm.amount) || 0));

    markLoanInstallmentPaid(targetLoan.id, payAmt, {
      paymentMethod: directPayForm.paymentMethod,
      referenceNumber: directPayForm.referenceNumber.trim() || `REC-${Date.now().toString().slice(-6)}`,
      notes: directPayForm.notes.trim() || `Direct staff repayment`
    });

    setShowDirectPaymentModal(false);
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
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'history' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'history' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('history')}
        >
          Payment & Repayment History ({loanPayments.length})
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
            <Box overflowX="auto" mx={{ base: -5, sm: 0 }} px={{ base: 5, sm: 0 }}>
              <Table.Root size="sm" variant="outline" minW="750px">
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
            </Box>
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
            <Box overflowX="auto" mx={{ base: -5, sm: 0 }} px={{ base: 5, sm: 0 }}>
              <Table.Root size="sm" variant="outline" minW="850px">
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
                          <Flex justify="flex-end" gap={1.5}>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorPalette="blue"
                              onClick={() => setSelectedLoanForHistory(loan)}
                              title="View Payment Ledger"
                            >
                              <History size={13} /> History
                            </Button>
                            {loan.status === 'Active' && (
                              <Button
                                size="xs"
                                colorPalette="blue"
                                variant="outline"
                                onClick={() => {
                                  setPayingLoan(loan);
                                  setInstallmentAmount(Math.min(loan.monthlyDeduction, loan.totalAmount - loan.repaidAmount));
                                  setPaymentReference(`REC-LN-${Math.floor(100000 + Math.random() * 900000)}`);
                                  setPaymentMethod('Direct Bank Transfer');
                                  setPaymentNotes('Direct loan repayment');
                                }}
                              >
                                Record Payment
                              </Button>
                            )}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Root>
        </Stack>
      )}

      {/* Sub-Tab 3: Payment & Repayment History */}
      {activeSubTab === 'history' && (
        <Stack gap={4}>
          {/* Quick Metrics */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
            <Card.Root bg="white" p={3.5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Recovered To Date</Text>
              <Text fontSize="lg" fontWeight="black" color="#059669" mt={1}>
                {activeCompany.currency} {loanPayments.reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#64748b" mt={0.5}>{loanPayments.length} logged payment entries</Text>
            </Card.Root>

            <Card.Root bg="white" p={3.5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">Payroll Recoveries</Text>
              <Text fontSize="lg" fontWeight="black" color="#2563eb" mt={1}>
                {activeCompany.currency} {loanPayments.filter(p => p.paymentMethod === 'Payroll Deduction').reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#2563eb" mt={0.5}>Automated month-end runs</Text>
            </Card.Root>

            <Card.Root bg="white" p={3.5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">Direct / Cash Settlements</Text>
              <Text fontSize="lg" fontWeight="black" color="#7c3aed" mt={1}>
                {activeCompany.currency} {loanPayments.filter(p => p.paymentMethod !== 'Payroll Deduction').reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#7c3aed" mt={0.5}>Outside salary offsets</Text>
            </Card.Root>

            <Card.Root bg="white" p={3.5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">Current Open Loans</Text>
              <Text fontSize="lg" fontWeight="black" color="#d97706" mt={1}>
                {employeeLoans.filter(l => l.status === 'Active').length} Active
              </Text>
              <Text fontSize="10px" color="#d97706" mt={0.5}>{employeeLoans.filter(l => l.status === 'Settled').length} Fully Settled</Text>
            </Card.Root>
          </SimpleGrid>

          {/* Action & Filter Toolbar */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Flex gap={2} flex="1" maxW={{ md: '480px' }}>
                <Box flex="1">
                  <Flex align="center" bg="#f8fafc" px={3} py={1.5} borderRadius="8px" border="1px solid #cbd5e1">
                    <Search size={15} color="#94a3b8" style={{ marginRight: '8px' }} />
                    <input
                      placeholder="Search employee, receipt #, or narration..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      style={{ width: '100%', fontSize: '12px', background: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </Flex>
                </Box>
                <NativeSelect.Root size="sm" maxW="180px">
                  <NativeSelect.Field
                    value={historyMethodFilter}
                    onChange={(e) => setHistoryMethodFilter(e.target.value)}
                  >
                    <option value="All">All Methods</option>
                    <option value="Payroll Deduction">Payroll Deduction</option>
                    <option value="Direct Bank Transfer">Bank Transfer</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                    <option value="Cheque">Cheque</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => {
                  if (employeeLoans.length > 0) {
                    setDirectPayForm({
                      loanId: employeeLoans[0].id,
                      amount: employeeLoans[0].monthlyDeduction || 200,
                      paymentDate: new Date().toISOString().split('T')[0],
                      paymentMethod: 'Direct Bank Transfer',
                      referenceNumber: `REC-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                      notes: 'Direct staff loan repayment'
                    });
                    setShowDirectPaymentModal(true);
                  }
                }}
                disabled={employeeLoans.filter(l => l.status === 'Active').length === 0}
              >
                <Plus size={14} /> Record Direct Payment
              </Button>
            </Flex>
          </Card.Root>

          {/* Historical Repayments Table */}
          <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Box overflowX="auto" mx={{ base: -5, sm: 0 }} px={{ base: 5, sm: 0 }}>
              <Table.Root size="sm" variant="outline" minW="850px">
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
                    <Table.ColumnHeader>Receipt Ref #</Table.ColumnHeader>
                    <Table.ColumnHeader>Staff Member</Table.ColumnHeader>
                    <Table.ColumnHeader>Payment Method</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount Credited</Table.ColumnHeader>
                    <Table.ColumnHeader>Balance After</Table.ColumnHeader>
                    <Table.ColumnHeader>Narration / Notes</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Voucher Slip</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loanPayments
                    .filter(p => {
                      const matchesSearch =
                        p.employeeName.toLowerCase().includes(historySearch.toLowerCase()) ||
                        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(historySearch.toLowerCase())) ||
                        (p.notes && p.notes.toLowerCase().includes(historySearch.toLowerCase())) ||
                        p.id.toLowerCase().includes(historySearch.toLowerCase());
                      const matchesMethod = historyMethodFilter === 'All' || p.paymentMethod === historyMethodFilter;
                      return matchesSearch && matchesMethod;
                    })
                    .length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={8} textAlign="center" py={8} color="#94a3b8">
                        No loan payment or repayment records match your filter.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    loanPayments
                      .filter(p => {
                        const matchesSearch =
                          p.employeeName.toLowerCase().includes(historySearch.toLowerCase()) ||
                          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(historySearch.toLowerCase())) ||
                          (p.notes && p.notes.toLowerCase().includes(historySearch.toLowerCase())) ||
                          p.id.toLowerCase().includes(historySearch.toLowerCase());
                        const matchesMethod = historyMethodFilter === 'All' || p.paymentMethod === historyMethodFilter;
                        return matchesSearch && matchesMethod;
                      })
                      .map(record => (
                        <Table.Row key={record.id} _hover={{ bg: '#f8fafc' }}>
                          <Table.Cell fontSize="xs" color="#64748b">
                            {record.paymentDate || record.createdAt?.slice(0, 10)}
                          </Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Badge size="xs" colorPalette="blue" fontFamily="mono">
                              {record.referenceNumber || record.id}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell fontWeight="bold" fontSize="xs">
                            {record.employeeName}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              size="xs"
                              colorPalette={
                                record.paymentMethod === 'Payroll Deduction'
                                  ? 'green'
                                  : record.paymentMethod === 'Direct Bank Transfer'
                                  ? 'blue'
                                  : record.paymentMethod === 'Cash Deposit'
                                  ? 'purple'
                                  : 'orange'
                              }
                            >
                              {record.paymentMethod}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell fontWeight="bold" color="#059669" fontSize="xs">
                            {activeCompany.currency} {record.amount.toLocaleString()}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" fontWeight="semibold" color="#475569">
                            {activeCompany.currency} {(record.remainingBalanceAfter ?? 0).toLocaleString()}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="#64748b" maxW="220px" truncate>
                            {record.notes || 'Repayment logged'}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            <Button
                              size="xs"
                              variant="outline"
                              colorPalette="blue"
                              onClick={() => setSelectedReceipt(record)}
                              title="Print Official Payment Receipt"
                            >
                              <Receipt size={13} /> View Receipt
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
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

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
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

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="420px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>
              Record Loan Repayment
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Borrower: <strong>{payingLoan.employeeName}</strong> • Outstanding: {activeCompany.currency} {(payingLoan.totalAmount - payingLoan.repaidAmount).toLocaleString()}
            </Text>

            <form onSubmit={handlePayInstallment}>
              <Stack gap={3}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Installment Amount ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={installmentAmount}
                      onChange={e => setInstallmentAmount(Number(e.target.value))}
                      max={payingLoan.totalAmount - payingLoan.repaidAmount}
                      min={1}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Payment Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={paymentDate}
                      onChange={e => setPaymentDate(e.target.value)}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Payment Method *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value as any)}
                      >
                        <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                        <option value="Payroll Deduction">Payroll Deduction</option>
                        <option value="Cash Deposit">Cash Deposit (Cashier)</option>
                        <option value="Cheque">Cheque</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Reference / Receipt #</Text>
                    <Input
                      size="sm"
                      value={paymentReference}
                      onChange={e => setPaymentReference(e.target.value)}
                      placeholder="e.g. REC-892110"
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Narration / Notes</Text>
                  <Input
                    size="sm"
                    value={paymentNotes}
                    onChange={e => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Direct bank deposit clearance"
                  />
                  <Text fontSize="10px" color="#64748b" mt={1}>
                    Outside Salary Payment: Payments recorded here immediately credit the balance and generate a verifiable payment ledger entry.
                  </Text>
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

      {/* Direct Payment Modal (From History Tab) */}
      {showDirectPaymentModal && (
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="460px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>
              Record Direct Outside Repayment
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Direct bank transfer or cash deposit applied towards an active employee loan facility.
            </Text>

            <form onSubmit={handleDirectPaymentSubmit}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Select Active Staff Loan *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={directPayForm.loanId}
                      onChange={e => {
                        const targetL = employeeLoans.find(l => l.id === Number(e.target.value));
                        setDirectPayForm({
                          ...directPayForm,
                          loanId: Number(e.target.value),
                          amount: targetL ? Math.min(targetL.monthlyDeduction, targetL.totalAmount - targetL.repaidAmount) : 200
                        });
                      }}
                    >
                      {employeeLoans
                        .filter(l => l.status === 'Active')
                        .map(loan => (
                          <option key={loan.id} value={loan.id}>
                            {loan.employeeName} (Bal: {activeCompany.currency} {(loan.totalAmount - loan.repaidAmount).toLocaleString()})
                          </option>
                        ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Amount Credited ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={directPayForm.amount}
                      onChange={e => setDirectPayForm({ ...directPayForm, amount: Number(e.target.value) })}
                      min={1}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Payment Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={directPayForm.paymentDate}
                      onChange={e => setDirectPayForm({ ...directPayForm, paymentDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Payment Method *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={directPayForm.paymentMethod}
                        onChange={e => setDirectPayForm({ ...directPayForm, paymentMethod: e.target.value as any })}
                      >
                        <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                        <option value="Cash Deposit">Cash Deposit</option>
                        <option value="Payroll Deduction">Payroll Deduction</option>
                        <option value="Cheque">Cheque</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Receipt / Ref #</Text>
                    <Input
                      size="sm"
                      value={directPayForm.referenceNumber}
                      onChange={e => setDirectPayForm({ ...directPayForm, referenceNumber: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Notes / Purpose</Text>
                  <Input
                    size="sm"
                    value={directPayForm.notes}
                    onChange={e => setDirectPayForm({ ...directPayForm, notes: e.target.value })}
                    placeholder="e.g. Lump sum salary advance repayment"
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowDirectPaymentModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Confirm & Record Payment
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Loan History Ledger Modal */}
      {selectedLoanForHistory && (
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="720px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={3}>
              <Box>
                <Flex align="center" gap={2}>
                  <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                    <History size={18} />
                  </Box>
                  <Heading size="md" color="#0f172a">
                    Repayment Ledger: {selectedLoanForHistory.employeeName}
                  </Heading>
                </Flex>
                <Text fontSize="xs" color="#64748b" mt={1}>
                  Total Loan: {activeCompany.currency} {selectedLoanForHistory.totalAmount.toLocaleString()} • Monthly Target: {activeCompany.currency} {selectedLoanForHistory.monthlyDeduction.toLocaleString()}
                </Text>
              </Box>
              <Badge size="sm" colorPalette={selectedLoanForHistory.status === 'Settled' ? 'green' : 'blue'}>
                {selectedLoanForHistory.status}
              </Badge>
            </Flex>

            {/* Progress Bar & Balances */}
            <Card.Root bg="#f8fafc" p={3.5} borderRadius="10px" border="1px solid #e2e8f0" mb={4}>
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3} mb={3}>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Total Principal</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                    {activeCompany.currency} {selectedLoanForHistory.totalAmount.toLocaleString()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Repaid To Date</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#059669">
                    {activeCompany.currency} {selectedLoanForHistory.repaidAmount.toLocaleString()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="10px" color="#64748b" textTransform="uppercase" fontWeight="bold">Outstanding Balance</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#dc2626">
                    {activeCompany.currency} {Math.max(0, selectedLoanForHistory.totalAmount - selectedLoanForHistory.repaidAmount).toLocaleString()}
                  </Text>
                </Box>
              </SimpleGrid>
              <Progress.Root
                value={Math.min(100, Math.round((selectedLoanForHistory.repaidAmount / selectedLoanForHistory.totalAmount) * 100))}
                size="sm"
                colorPalette={selectedLoanForHistory.repaidAmount >= selectedLoanForHistory.totalAmount ? 'green' : 'blue'}
              >
                <Progress.Track bg="#e2e8f0">
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Card.Root>

            <Heading size="xs" color="#334155" mb={2}>
              Logged Repayment Transactions
            </Heading>

            <Box overflowX="auto" border="1px solid #e2e8f0" borderRadius="10px">
              <Table.Root size="sm" variant="outline">
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Ref #</Table.ColumnHeader>
                    <Table.ColumnHeader>Method</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount</Table.ColumnHeader>
                    <Table.ColumnHeader>Balance After</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Receipt</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loanPayments.filter(p => p.loanId === selectedLoanForHistory.id).length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6} textAlign="center" py={6} color="#94a3b8">
                        No repayment transactions recorded for this loan facility yet.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    loanPayments
                      .filter(p => p.loanId === selectedLoanForHistory.id)
                      .map(p => (
                        <Table.Row key={p.id}>
                          <Table.Cell fontSize="xs">{p.paymentDate || p.createdAt?.slice(0, 10)}</Table.Cell>
                          <Table.Cell fontSize="xs" fontFamily="mono">{p.referenceNumber || p.id}</Table.Cell>
                          <Table.Cell fontSize="xs">
                            <Badge size="xs" colorPalette="blue">{p.paymentMethod}</Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="xs" fontWeight="bold" color="#059669">
                            {activeCompany.currency} {p.amount.toLocaleString()}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" fontWeight="semibold">
                            {activeCompany.currency} {(p.remainingBalanceAfter ?? 0).toLocaleString()}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            <Button
                              size="xs"
                              variant="ghost"
                              colorPalette="blue"
                              onClick={() => setSelectedReceipt(p)}
                            >
                              <Receipt size={12} /> View
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                  )}
                </Table.Body>
              </Table.Root>
            </Box>

            <Flex justify="flex-end" mt={4}>
              <Button size="sm" variant="outline" onClick={() => setSelectedLoanForHistory(null)}>
                Close Ledger
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Printable Payment Voucher & Receipt Slip Modal */}
      {selectedReceipt && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.7)"
          zIndex={1500}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="580px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #cbd5e1" boxShadow="2xl" maxH="95vh" overflowY="auto">
            {/* Printable Receipt Body */}
            <Box id="loan-receipt-printable" p={4} border="1px dashed #cbd5e1" borderRadius="12px" bg="#fafafa">
              {/* Receipt Header */}
              <Flex justify="space-between" align="flex-start" borderBottom="2px solid #0f172a" pb={3} mb={3}>
                <Box>
                  <Text fontSize="sm" fontWeight="black" color="#0f172a" textTransform="uppercase" letterSpacing="wider">
                    {activeCompany.name}
                  </Text>
                  <Text fontSize="10px" color="#64748b">Human Resources & Corporate Treasury Department</Text>
                  <Text fontSize="10px" color="#64748b">{activeCompany.address || 'Corporate Headquarters'}</Text>
                </Box>
                <Box textAlign="right">
                  <Badge size="sm" colorPalette="green" fontWeight="bold">OFFICIAL RECEIPT</Badge>
                  <Text fontSize="11px" fontWeight="bold" fontFamily="mono" color="#0f172a" mt={1}>
                    {selectedReceipt.referenceNumber || selectedReceipt.id}
                  </Text>
                  <Text fontSize="10px" color="#64748b">{selectedReceipt.paymentDate || selectedReceipt.createdAt?.slice(0, 10)}</Text>
                </Box>
              </Flex>

              <Text fontSize="xs" fontWeight="bold" color="#1e293b" mb={3} textAlign="center" textTransform="uppercase">
                Staff Loan Repayment & Clearance Voucher
              </Text>

              {/* Staff Details */}
              <SimpleGrid columns={2} gap={2} fontSize="xs" bg="white" p={3} borderRadius="8px" border="1px solid #e2e8f0" mb={3}>
                <Box>
                  <Text color="#64748b" fontSize="10px">Staff Member Name:</Text>
                  <Text fontWeight="bold" color="#0f172a">{selectedReceipt.employeeName}</Text>
                </Box>
                <Box>
                  <Text color="#64748b" fontSize="10px">Staff Identifier:</Text>
                  <Text fontWeight="semibold" color="#0f172a">EMP-0{selectedReceipt.employeeId}</Text>
                </Box>
                <Box>
                  <Text color="#64748b" fontSize="10px">Payment Mechanism:</Text>
                  <Text fontWeight="bold" color="#2563eb">{selectedReceipt.paymentMethod}</Text>
                </Box>
                <Box>
                  <Text color="#64748b" fontSize="10px">Verification Reference:</Text>
                  <Text fontWeight="mono" color="#0f172a">{selectedReceipt.referenceNumber || 'N/A'}</Text>
                </Box>
              </SimpleGrid>

              {/* Amount Breakdown */}
              <Box bg="white" p={3} borderRadius="8px" border="1px solid #e2e8f0" mb={3}>
                <Flex justify="space-between" align="center" py={1.5} borderBottom="1px solid #f1f5f9">
                  <Text fontSize="xs" color="#64748b">Amount Repaid Today:</Text>
                  <Text fontSize="md" fontWeight="black" color="#059669">
                    {activeCompany.currency} {selectedReceipt.amount.toLocaleString()}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center" py={1.5} borderBottom="1px solid #f1f5f9">
                  <Text fontSize="xs" color="#64748b">Remaining Outstanding Balance:</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#dc2626">
                    {activeCompany.currency} {(selectedReceipt.remainingBalanceAfter ?? 0).toLocaleString()}
                  </Text>
                </Flex>
                {selectedReceipt.notes && (
                  <Flex justify="space-between" align="center" pt={1.5}>
                    <Text fontSize="xs" color="#64748b">Narration / Note:</Text>
                    <Text fontSize="xs" fontWeight="medium" color="#334155">{selectedReceipt.notes}</Text>
                  </Flex>
                )}
              </Box>

              {/* Signatures */}
              <SimpleGrid columns={2} gap={4} pt={4} mt={3} borderTop="1px solid #e2e8f0" fontSize="10px">
                <Box textAlign="center">
                  <Box h="28px" borderBottom="1px dashed #94a3b8" mb={1} />
                  <Text fontWeight="semibold" color="#334155">Authorized Finance / HR Signatory</Text>
                  <Text color="#94a3b8">Processed by {selectedReceipt.recordedBy || currentUserName}</Text>
                </Box>
                <Box textAlign="center">
                  <Box h="28px" borderBottom="1px dashed #94a3b8" mb={1} />
                  <Text fontWeight="semibold" color="#334155">Employee Acknowledgement</Text>
                  <Text color="#94a3b8">Beneficiary Signature</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Modal Controls */}
            <Flex justify="space-between" align="center" mt={4}>
              <Button size="sm" variant="outline" onClick={() => setSelectedReceipt(null)}>
                Close
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                fontWeight="bold"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={14} /> Print Receipt Voucher
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
