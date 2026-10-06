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
  Stack,
  NativeSelect,
  Input,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { Payslip } from '../../types';
import {
  Wallet,
  Play,
  FileText,
  Printer,
  CheckCircle2,
  Building2,
  Download,
  Upload,
  DollarSign,
  Search,
  Filter,
  Check,
  Send,
  X
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const {
    payrollRuns,
    payslips,
    processPayrollMonth,
    finalizePayrollRun,
    markPayrollPaid,
    importPayrollCSV,
    bulkSendPayslips,
    accountsLedger,
    activeCompany,
    activeRole
  } = useERP();

  const [activeTab, setActiveTab] = useState<'payroll' | 'ledger'>('payroll');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // CSV Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState(
`employee_code,payroll_month,basic_salary,allowances,deductions
EMP-001,2026-10,5000,600,1200
EMP-002,2026-10,4800,550,1100
EMP-003,2026-10,4200,500,950
EMP-004,2026-10,3800,450,850`
  );
  const [importError, setImportError] = useState('');

  const canRunPayroll = ['Managing Director', 'Finance Manager', 'Accountant', 'Super Admin'].includes(activeRole);

  const handleRunPayroll = () => {
    if (confirm(`Run automated payroll calculations for all active staff for ${selectedMonth}?`)) {
      processPayrollMonth(selectedMonth);
    }
  };

  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    const res = importPayrollCSV(csvContent);
    if (res.success) {
      setShowImportModal(false);
      alert(`Payroll successfully imported for ${res.run?.monthYear} with ${res.run?.employeeCount} employees!`);
    } else {
      setImportError(res.error || 'Failed to import payroll CSV.');
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'employee_code,payroll_month,basic_salary,allowances,deductions\nEMP-001,2026-10,5000,600,1200\nEMP-002,2026-10,4500,500,1050\n';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payroll_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBankSchedule = (runId: number) => {
    const runSlips = payslips.filter(p => p.payrollRunId === runId);
    const headers = ['StaffCode', 'StaffName', 'Department', 'GrossPay', 'Deductions', 'NetSalary', 'DisbursementStatus'];
    const rows = runSlips.map(s => [
      s.employeeCode,
      `"${s.employeeName}"`,
      `"${s.department}"`,
      s.grossPay,
      s.totalDeductions,
      s.netPay,
      'Direct Bank Transfer'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bank_payment_schedule_run_${runId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPayslips = payslips.filter(s => {
    const matchesSearch =
      !searchTerm ||
      s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getRunBadgeColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Finalized': return 'blue';
      case 'Draft': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={4}>
          <Box>
            <Heading size="lg" color="#0f172a" fontWeight="bold">
              Corporate Accounting & Monthly Payroll
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={1}>
              Statutory tax withholdings (PAYE), pension contributions, loan deductions, CSV batch import, and electronic payslips.
            </Text>
          </Box>

          <Flex gap={2} align="center" wrap="wrap">
            <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
              <Download size={14} /> CSV Template
            </Button>
            {canRunPayroll && (
              <>
                <Button size="sm" variant="outline" colorPalette="blue" onClick={() => setShowImportModal(true)}>
                  <Upload size={14} /> Import CSV
                </Button>
                <Flex gap={1} align="center">
                  <NativeSelect.Root size="sm" maxW="150px">
                    <NativeSelect.Field
                      aria-label="Payroll Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="October 2026">October 2026</option>
                      <option value="November 2026">November 2026</option>
                      <option value="December 2026">December 2026</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                  <Button size="sm" colorPalette="green" onClick={handleRunPayroll} fontWeight="bold">
                    <Play size={14} fill="currentColor" /> Run Payroll
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
      </Card.Root>

      {/* Tabs */}
      <Flex borderBottom="2px solid #e2e8f0" gap={6}>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeTab === 'payroll' ? '#2563eb' : '#64748b'}
          borderBottom={activeTab === 'payroll' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveTab('payroll')}
        >
          Payroll Runs & Employee Payslips ({payrollRuns.length} Runs)
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeTab === 'ledger' ? '#2563eb' : '#64748b'}
          borderBottom={activeTab === 'ledger' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveTab('ledger')}
        >
          Chart of Accounts & General Ledger ({accountsLedger.length})
        </Box>
      </Flex>

      {/* Tab: Payroll */}
      {activeTab === 'payroll' && (
        <Stack gap={6}>
          {/* Historical Runs */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {payrollRuns.map((run) => (
              <Card.Root key={run.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="md" color="#0f172a">{run.monthYear}</Heading>
                    <Text fontSize="11px" color="#94a3b8">Processed on {run.processedDate}</Text>
                  </Box>
                  <Badge colorPalette={getRunBadgeColor(run.status)} size="sm">
                    {run.status.toUpperCase()}
                  </Badge>
                </Flex>

                <SimpleGrid columns={3} gap={2} my={3} p={3} bg="#f8fafc" borderRadius="10px" fontSize="xs">
                  <Box>
                    <Text color="#64748b">Gross Wages:</Text>
                    <Text fontWeight="bold" fontFamily="mono">{activeCompany.currency} {run.totalGross.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text color="#64748b">Deductions:</Text>
                    <Text fontWeight="bold" color="#dc2626" fontFamily="mono">-{activeCompany.currency} {run.totalDeductions.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text color="#64748b">Net Disbursed:</Text>
                    <Text fontWeight="bold" color="#059669" fontFamily="mono">{activeCompany.currency} {run.totalNet.toLocaleString()}</Text>
                  </Box>
                </SimpleGrid>

                <Flex justify="space-between" align="center" mt={2} pt={2} borderTop="1px solid #f1f5f9" fontSize="xs" wrap="wrap" gap={2}>
                  <Text color="#64748b">{run.employeeCount} active staff paid</Text>
                  <Flex gap={2}>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleExportBankSchedule(run.id)}
                    >
                      <Download size={12} /> Bank Schedule
                    </Button>
                    {run.status !== 'Paid' && canRunPayroll && (
                      <Button
                        size="xs"
                        colorPalette="green"
                        onClick={() => markPayrollPaid(run.id)}
                        fontWeight="bold"
                      >
                        <Check size={12} /> Mark Paid
                      </Button>
                    )}
                    <Button
                      size="xs"
                      variant="subtle"
                      colorPalette="blue"
                      onClick={() => bulkSendPayslips(run.id)}
                    >
                      <Send size={12} /> Sync to Portals
                    </Button>
                  </Flex>
                </Flex>
              </Card.Root>
            ))}
          </SimpleGrid>

          {/* Payslips Table Header & Filters */}
          <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
            <Box p={4} borderBottom="1px solid #f1f5f9">
              <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
                <Heading size="sm" color="#0f172a">Individual Staff Payslips ({filteredPayslips.length})</Heading>

                <Flex gap={2} align="center">
                  <Box position="relative" minW="200px">
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

                  <NativeSelect.Root size="xs" minW="160px">
                    <NativeSelect.Field
                      value={deptFilter}
                      onChange={e => setDeptFilter(e.target.value)}
                    >
                      <option value="All">All Departments</option>
                      {Array.from(new Set(payslips.map(s => s.department))).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              </Flex>
            </Box>

            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold">Employee Name</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold">Department</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Basic Salary</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Allowances</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">PAYE & Pension</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Loan Deductions</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Net Salary</Table.ColumnHeader>
                  <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredPayslips.map((slip) => (
                  <Table.Row key={slip.id}>
                    <Table.Cell>
                      <Text fontWeight="bold" color="#0f172a">{slip.employeeName}</Text>
                      <Text fontSize="10px" color="#94a3b8" fontFamily="mono">{slip.employeeCode}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#475569">{slip.department}</Table.Cell>
                    <Table.Cell textAlign="right" fontSize="xs" fontFamily="mono">
                      {activeCompany.currency} {slip.basicSalary.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontSize="xs" fontFamily="mono" color="#059669">
                      +{activeCompany.currency} {slip.allowances.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontSize="xs" fontFamily="mono" color="#dc2626">
                      -{activeCompany.currency} {(slip.tax + slip.pension).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontSize="xs" fontFamily="mono" color="#dc2626">
                      {slip.loanDeduction > 0 ? `-${activeCompany.currency} ${slip.loanDeduction.toLocaleString()}` : '—'}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontSize="xs" fontFamily="mono" fontWeight="bold" color="#0f172a">
                      {activeCompany.currency} {slip.netPay.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Button size="xs" colorPalette="blue" variant="subtle" onClick={() => setSelectedPayslip(slip)}>
                        <FileText size={12} /> View Slip
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* Tab: Chart of Accounts */}
      {activeTab === 'ledger' && (
        <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">Account Code</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">Account Title</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">Classification</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="right">Current Balance</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {accountsLedger.map((acc) => (
                <Table.Row key={acc.id}>
                  <Table.Cell fontFamily="mono" fontWeight="bold" fontSize="xs">{acc.accountCode}</Table.Cell>
                  <Table.Cell fontWeight="bold" color="#0f172a">{acc.name}</Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette={acc.type === 'Asset' ? 'green' : acc.type === 'Liability' ? 'red' : 'blue'}>
                      {acc.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right" fontFamily="mono" fontWeight="bold" fontSize="xs">
                    {activeCompany.currency} {acc.balance.toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Modal: View Official Payslip */}
      {selectedPayslip && (
        <Box 
          position="fixed" 
          inset="0" 
          zIndex="1400" 
          bg="rgba(15, 23, 42, 0.65)" 
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
              <Badge colorPalette="green" size="md">VOUCHER #{selectedPayslip.id}</Badge>
            </Flex>

            <Stack gap={3} fontSize="xs">
              <Flex justify="space-between">
                <Text color="#64748b">Staff Name:</Text>
                <Text fontWeight="bold" color="#0f172a">{selectedPayslip.employeeName}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Employee Code:</Text>
                <Text fontFamily="mono" fontWeight="bold">{selectedPayslip.employeeCode}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#64748b">Department:</Text>
                <Text fontWeight="semibold">{selectedPayslip.department}</Text>
              </Flex>

              <Box my={2} p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>Earnings</Text>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Basic Wage:</Text>
                  <Text fontWeight="semibold">{activeCompany.currency} {selectedPayslip.basicSalary.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Housing & Transport Allowances:</Text>
                  <Text fontWeight="semibold">{activeCompany.currency} {selectedPayslip.allowances.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={1} borderTop="1px solid #e2e8f0" mt={1}>
                  <Text fontWeight="bold">Total Gross Pay:</Text>
                  <Text fontWeight="bold">{activeCompany.currency} {selectedPayslip.grossPay.toLocaleString()}</Text>
                </Flex>
              </Box>

              <Box my={1} p={3} bg="#fff1f2" borderRadius="8px" border="1px solid #fecdd3">
                <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#e11d48" mb={2}>Statutory Deductions</Text>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">PAYE Income Tax:</Text>
                  <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {selectedPayslip.tax.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" py={0.5}>
                  <Text color="#64748b">Pension Contribution (8%):</Text>
                  <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {selectedPayslip.pension.toLocaleString()}</Text>
                </Flex>
                {selectedPayslip.loanDeduction > 0 && (
                  <Flex justify="space-between" py={0.5}>
                    <Text color="#64748b">Advance / Loan Recovery:</Text>
                    <Text fontWeight="semibold" color="#e11d48">-{activeCompany.currency} {selectedPayslip.loanDeduction.toLocaleString()}</Text>
                  </Flex>
                )}
                <Flex justify="space-between" py={1} borderTop="1px solid #fecdd3" mt={1}>
                  <Text fontWeight="bold" color="#9f1239">Total Deductions:</Text>
                  <Text fontWeight="bold" color="#9f1239">-{activeCompany.currency} {selectedPayslip.totalDeductions.toLocaleString()}</Text>
                </Flex>
              </Box>

              <Flex justify="space-between" p={3} bg="#ecfdf5" borderRadius="8px" border="1px solid #a7f3d0" align="center">
                <Text fontWeight="bold" color="#065f46" fontSize="sm">NET TAKE-HOME PAY:</Text>
                <Text fontWeight="bold" color="#047857" fontSize="md" fontFamily="mono">
                  {activeCompany.currency} {selectedPayslip.netPay.toLocaleString()}
                </Text>
              </Flex>
            </Stack>

            <Flex justify="flex-end" gap={2} mt={5}>
              <Button size="sm" variant="outline" onClick={() => setSelectedPayslip(null)}>
                Close
              </Button>
              <Button size="sm" colorPalette="blue" onClick={() => window.print()}>
                <Printer size={14} /> Print Payslip
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1400"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={2}>
              <Heading size="md" color="#0f172a">
                Import Monthly Payroll CSV
              </Heading>
              <Button size="xs" variant="ghost" onClick={() => setShowImportModal(false)}>
                <X size={16} />
              </Button>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Format: <code>employee_code,payroll_month,basic_salary,allowances,deductions</code> (matching original PHP ERP schema & payroll_template.csv).
            </Text>

            {importError && (
              <Box p={3} mb={3} bg="#fef2f2" border="1px solid #fecaca" borderRadius="8px" color="#991b1b" fontSize="xs" fontWeight="semibold">
                {importError}
              </Box>
            )}

            <form onSubmit={handleImportCSVSubmit}>
              <Textarea
                rows={8}
                value={csvContent}
                onChange={e => setCsvContent(e.target.value)}
                fontFamily="mono"
                fontSize="xs"
                mb={4}
                required
              />

              <Flex justify="space-between" align="center">
                <Button size="xs" variant="outline" onClick={handleDownloadTemplate}>
                  <Download size={12} /> Download Template
                </Button>
                <Flex gap={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowImportModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Process & Import
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
