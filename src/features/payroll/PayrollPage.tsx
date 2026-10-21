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
import { Payslip, PayrollCalculationItem } from '../../types';
import { PayrollStructureTab } from './components/PayrollStructureTab';
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
  X,
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  AlertCircle,
  Save,
  Info,
  Edit2
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const {
    payrollRuns,
    payslips,
    payrollStructure,
    updatePayrollStructure,
    processPayrollMonth,
    finalizePayrollRun,
    markPayrollPaid,
    importPayrollCSV,
    bulkSendPayslips,
    accountsLedger,
    activeCompany,
    activeRole
  } = useERP();

  const [activeTab, setActiveTab] = useState<'payroll' | 'ledger' | 'structure'>('payroll');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Formula & Calculation Configuration Modal State
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [formulaItems, setFormulaItems] = useState<PayrollCalculationItem[]>(() => payrollStructure?.items || []);
  const [isEditingInRunModal, setIsEditingInRunModal] = useState(false);
  const [saveFormulaForFuture, setSaveFormulaForFuture] = useState(true);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'earning' | 'deduction'>('earning');
  const [newItemPct, setNewItemPct] = useState<number>(5);
  const [newItemBase, setNewItemBase] = useState<'basic' | 'gross'>('basic');

  React.useEffect(() => {
    if (payrollStructure?.items && payrollStructure.items.length > 0) {
      setFormulaItems(payrollStructure.items);
    }
  }, [payrollStructure]);

  const handleUpdateItemPct = (id: string, pct: number) => {
    setFormulaItems(prev => prev.map(item => item.id === id ? { ...item, percentage: Math.max(0, pct) } : item));
  };

  const handleToggleItemStatus = (id: string) => {
    setFormulaItems(prev => prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
  };

  const handleRemoveFormulaItem = (id: string) => {
    setFormulaItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddFormulaItem = () => {
    if (!newItemName.trim() || isNaN(newItemPct) || newItemPct <= 0) return;
    const created: PayrollCalculationItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemType,
      percentage: Number(newItemPct),
      basedOn: newItemBase,
      isActive: true,
      isSystem: false
    };
    const updated = [...formulaItems, created];
    setFormulaItems(updated);
    setNewItemName('');
    setNewItemPct(5);
  };

  const handleSaveFormula = () => {
    if (payrollStructure) {
      updatePayrollStructure({
        ...payrollStructure,
        items: formulaItems,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowFormulaModal(false);
    setPayrollToast({ message: 'Payroll calculation formula and percentages saved for current & future runs.', type: 'success' });
  };

  // CSV Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConfirmRunModal, setShowConfirmRunModal] = useState(false);
  const [payrollToast, setPayrollToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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
    setShowConfirmRunModal(true);
  };

  const handleConfirmRunPayroll = () => {
    if (saveFormulaForFuture && payrollStructure) {
      updatePayrollStructure({
        ...payrollStructure,
        items: formulaItems,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
    processPayrollMonth(selectedMonth, formulaItems);
    setShowConfirmRunModal(false);
    setIsEditingInRunModal(false);
    setPayrollToast({ message: `Automated payroll calculations completed for ${selectedMonth} using configured formula!`, type: 'success' });
  };

  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    const res = importPayrollCSV(csvContent);
    if (res.success) {
      setShowImportModal(false);
      setPayrollToast({ message: `Payroll successfully imported for ${res.run?.monthYear} with ${res.run?.employeeCount} employees!`, type: 'success' });
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

  const getPayslipMonth = (slip: Payslip) => {
    return payrollRuns.find(r => r.id === slip.payrollRunId)?.monthYear || selectedMonth || 'October 2026';
  };

  const generatePayslipPrintHtml = (slip: Payslip) => {
    const companyName = activeCompany?.name || 'Apex Construction & Civil Works Ltd';
    const currency = activeCompany?.currency || '₦';
    const month = getPayslipMonth(slip);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payslip - ${slip.employeeName} (${month})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 24px;
      font-size: 13px;
      line-height: 1.4;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .company-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.01em;
    }
    .sub-title {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .voucher-pill {
      font-size: 11px;
      font-weight: 700;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 16px;
      border-collapse: collapse;
    }
    .meta-table td {
      padding: 4px 0;
      font-size: 12px;
    }
    .meta-label {
      color: #64748b;
      width: 25%;
    }
    .meta-val {
      font-weight: 600;
      color: #0f172a;
      width: 25%;
    }
    .section-card {
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .earnings-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .deductions-card {
      background: #fff1f2;
      border: 1px solid #fecdd3;
    }
    .net-card {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
      font-size: 12px;
    }
    .row.total {
      margin-top: 6px;
      padding-top: 6px;
      font-weight: 700;
      font-size: 12.5px;
    }
    .signatures-block {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px dashed #94a3b8;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
    }
    .sig-line {
      border-bottom: 1.5px solid #0f172a;
      height: 38px;
      margin-bottom: 8px;
    }
    .sig-role {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 4px;
    }
    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-title">${companyName}</div>
      <div class="sub-title">Official Monthly Salary Payslip • ${month}</div>
    </div>
    <div class="voucher-pill">VOUCHER #${slip.id}</div>
  </div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">Staff Name:</td>
      <td class="meta-val">${slip.employeeName}</td>
      <td class="meta-label">Department:</td>
      <td class="meta-val">${slip.department}</td>
    </tr>
    <tr>
      <td class="meta-label">Staff Code:</td>
      <td class="meta-val" style="font-family: monospace;">${slip.employeeCode}</td>
      <td class="meta-label">Pay Period:</td>
      <td class="meta-val">${month}</td>
    </tr>
  </table>

  <div class="section-card earnings-card">
    <div class="card-title" style="color: #2563eb;">Earnings & Allowances</div>
    <div class="row">
      <span style="color: #64748b;">Basic Wage:</span>
      <span style="font-weight: 600;">${currency} ${slip.basicSalary.toLocaleString()}</span>
    </div>
    <div class="row">
      <span style="color: #64748b;">Housing & Transport Allowances:</span>
      <span style="font-weight: 600;">${currency} ${slip.allowances.toLocaleString()}</span>
    </div>
    <div class="row total" style="border-top: 1px solid #e2e8f0;">
      <span>Total Gross Pay:</span>
      <span>${currency} ${slip.grossPay.toLocaleString()}</span>
    </div>
  </div>

  <div class="section-card deductions-card">
    <div class="card-title" style="color: #e11d48;">Statutory & Payroll Deductions</div>
    <div class="row">
      <span style="color: #64748b;">PAYE Income Tax:</span>
      <span style="font-weight: 600; color: #e11d48;">-${currency} ${slip.tax.toLocaleString()}</span>
    </div>
    <div class="row">
      <span style="color: #64748b;">Pension Contribution (8%):</span>
      <span style="font-weight: 600; color: #e11d48;">-${currency} ${slip.pension.toLocaleString()}</span>
    </div>
    ${slip.loanDeduction > 0 ? `
    <div class="row">
      <span style="color: #64748b;">Advance / Loan Recovery:</span>
      <span style="font-weight: 600; color: #e11d48;">-${currency} ${slip.loanDeduction.toLocaleString()}</span>
    </div>` : ''}
    <div class="row total" style="border-top: 1px solid #fecdd3; color: #9f1239;">
      <span>Total Deductions:</span>
      <span>-${currency} ${slip.totalDeductions.toLocaleString()}</span>
    </div>
  </div>

  <div class="net-card">
    <span style="font-size: 13px; font-weight: 700; color: #065f46; text-transform: uppercase;">Net Take-Home Pay:</span>
    <span style="font-size: 17px; font-weight: 800; font-family: monospace; color: #047857;">${currency} ${slip.netPay.toLocaleString()}</span>
  </div>

  <!-- Space for Payroll Officer and Head of Finance Signing (Printed Slip Only) -->
  <div class="signatures-block">
    <div>
      <div class="sig-line"></div>
      <div class="sig-role">Payroll Officer Signature</div>
      <div class="sig-meta">Name: _______________________________</div>
      <div class="sig-meta">Date: _______________________________</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div class="sig-role">Head of Finance Signing</div>
      <div class="sig-meta">Name: _______________________________</div>
      <div class="sig-meta">Date: _______________________________</div>
    </div>
  </div>

  <div class="footer-note">
    Corporate Electronic Payroll Voucher • Authorized by Corporate Finance & Accounts
  </div>
</body>
</html>`;
  };

  const handlePrintPayslip = () => {
    if (!selectedPayslip) return;

    setPayrollToast({
      message: `Preparing print voucher for ${selectedPayslip.employeeName}...`,
      type: 'success'
    });

    const printHtml = generatePayslipPrintHtml(selectedPayslip);

    // Try isolated hidden iframe print
    try {
      let printFrame = document.getElementById('payslip-isolated-frame') as HTMLIFrameElement | null;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'payslip-isolated-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }
      const frameDoc = printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(printHtml);
        frameDoc.close();
        setTimeout(() => {
          try {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
          } catch (iframeErr) {
            console.warn('Iframe print intercepted, falling back to window.print():', iframeErr);
            window.print();
          }
        }, 150);
        return;
      }
    } catch (e) {
      console.warn('Error setting up print iframe:', e);
    }

    // Direct fallback
    try {
      window.print();
    } catch (err) {
      console.warn('Direct window.print() failed:', err);
    }
  };

  const handleDownloadPayslipDocument = () => {
    if (!selectedPayslip) return;
    const printHtml = generatePayslipPrintHtml(selectedPayslip);
    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const month = getPayslipMonth(selectedPayslip);
    link.href = url;
    link.download = `Payslip_${selectedPayslip.employeeCode}_${month.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setPayrollToast({
      message: `Payslip document downloaded for ${selectedPayslip.employeeName}. Open in any browser to print or save as PDF.`,
      type: 'success'
    });
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
      {payrollToast && (
        <Box p={3.5} borderRadius="10px" bg={payrollToast.type === 'error' ? '#fef2f2' : '#f0fdf4'} border={payrollToast.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0'} color={payrollToast.type === 'error' ? '#b91c1c' : '#166534'} fontSize="xs" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="medium">{payrollToast.message}</Text>
          <Button size="xs" variant="ghost" onClick={() => setPayrollToast(null)}>Dismiss</Button>
        </Box>
      )}

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
                  <Button size="sm" variant="outline" onClick={() => setShowFormulaModal(true)}>
                    <Sliders size={14} /> Formula & Rates
                  </Button>
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
      <Box overflowX="auto" borderBottom="2px solid #e2e8f0">
        <Flex gap={6} minW="max-content">
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
          <Box
            as="button"
            pb={3}
            fontSize="sm"
            fontWeight="bold"
            color={activeTab === 'structure' ? '#2563eb' : '#64748b'}
            borderBottom={activeTab === 'structure' ? '2px solid #2563eb' : 'none'}
            mb="-2px"
            cursor="pointer"
            onClick={() => setActiveTab('structure')}
          >
            Statutory Structure & Allowances
          </Box>
        </Flex>
      </Box>

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

                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={2} my={3} p={3} bg="#f8fafc" borderRadius="10px" fontSize="xs">
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

            <Box overflowX="auto" w="100%">
              <Table.Root size="sm" striped minW="750px">
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
            </Box>
          </Card.Root>
        </Stack>
      )}

      {/* Tab: Chart of Accounts */}
      {activeTab === 'ledger' && (
        <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
          <Box overflowX="auto">
            <Table.Root size="sm" striped minW="600px">
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
          </Box>
        </Card.Root>
      )}

      {/* Tab: Statutory Structure & Allowances */}
      {activeTab === 'structure' && <PayrollStructureTab />}

      {/* Modal: View Official Payslip */}
      {selectedPayslip && (
        <Box 
          id="printable-payslip-portal"
          className="payslip-modal-backdrop"
          position="fixed" 
          inset="0" 
          zIndex="1400" 
          bg="rgba(15, 23, 42, 0.65)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          p={{ base: 2, sm: 4 }}
        >
          <Box className="payslip-print-card" bg="white" borderRadius="16px" maxW="550px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
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
                <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>Earnings & Allowances</Text>
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

            {/* Space for Payroll Officer & Head of Finance signing - designated to show on printed slip */}
            <Box className="print-only" mt={8} pt={4} borderTop="1px dashed #94a3b8">
              <SimpleGrid columns={2} gap={8} pt={2}>
                <Box>
                  <Box borderBottom="1.5px solid #0f172a" h="38px" mb={2} />
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">Payroll Officer Signature</Text>
                  <Text fontSize="10px" color="#64748b" mt={1}>Name: _______________________________</Text>
                  <Text fontSize="10px" color="#64748b" mt={0.5}>Date: _______________________________</Text>
                </Box>
                <Box>
                  <Box borderBottom="1.5px solid #0f172a" h="38px" mb={2} />
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">Head of Finance Signing</Text>
                  <Text fontSize="10px" color="#64748b" mt={1}>Name: _______________________________</Text>
                  <Text fontSize="10px" color="#64748b" mt={0.5}>Date: _______________________________</Text>
                </Box>
              </SimpleGrid>
              <Text fontSize="9px" color="#94a3b8" textAlign="center" mt={4}>
                Corporate Electronic Payroll Voucher • Authorized by Corporate Finance & Accounts
              </Text>
            </Box>

            <Flex justify="space-between" align="center" gap={2} mt={5} className="no-print">
              <Button size="sm" variant="ghost" onClick={handleDownloadPayslipDocument}>
                <Download size={14} /> Download Slip
              </Button>
              <Flex gap={2}>
                <Button size="sm" variant="outline" onClick={() => setSelectedPayslip(null)}>
                  Close
                </Button>
                <Button size="sm" colorPalette="blue" onClick={handlePrintPayslip}>
                  <Printer size={14} /> Print Payslip
                </Button>
              </Flex>
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
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
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

              <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap={3}>
                <Button size="xs" variant="outline" onClick={handleDownloadTemplate} w={{ base: '100%', sm: 'auto' }}>
                  <Download size={12} /> Download Template
                </Button>
                <Flex gap={2} w={{ base: '100%', sm: 'auto' }} justify={{ base: 'flex-end', sm: 'flex-end' }}>
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
      {/* Automated Payroll Run Confirmation Modal */}
      {showConfirmRunModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1450"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW={isEditingInRunModal ? "680px" : "480px"} w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={2}>
              <Heading size="md" color="#0f172a">Run Monthly Payroll</Heading>
              <Badge colorPalette="green" size="sm">{selectedMonth}</Badge>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Calculates wages, allowances, statutory PAYE tax, pension, and creates payslips for all active personnel.
            </Text>

            {/* Active Formula Summary */}
            <Box p={3} mb={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
              <Flex justify="space-between" align="center" mb={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                  Active Calculation Formula ({formulaItems.filter(i => i.isActive).length} Components)
                </Text>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setIsEditingInRunModal(!isEditingInRunModal)}
                >
                  <Sliders size={12} /> {isEditingInRunModal ? 'Collapse Rates' : 'Edit Rates & Items'}
                </Button>
              </Flex>

              {!isEditingInRunModal ? (
                <Stack gap={1.5} fontSize="xs">
                  <Flex wrap="wrap" gap={1.5} pt={1}>
                    {formulaItems.filter(i => i.isActive).map(item => (
                      <Badge
                        key={item.id}
                        colorPalette={item.category === 'earning' ? 'green' : 'red'}
                        size="xs"
                        px={1.5}
                        py={0.5}
                      >
                        {item.name}: {item.percentage}% ({item.basedOn === 'gross' ? 'Gross' : 'Basic'})
                      </Badge>
                    ))}
                  </Flex>
                  <Text fontSize="10px" color="#94a3b8" mt={1}>
                    Calculation uses saved persistent formula. Click "Edit Rates & Items" if adjustments are needed.
                  </Text>
                </Stack>
              ) : (
                <Stack gap={2.5} pt={2}>
                  <Box overflowX="auto">
                    <Table.Root size="sm" striped>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader fontSize="10px">Item Name</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="10px">Type</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="10px">Rate (%)</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="10px">Active</Table.ColumnHeader>
                          <Table.ColumnHeader textAlign="right" fontSize="10px">Remove</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {formulaItems.map(item => (
                          <Table.Row key={item.id}>
                            <Table.Cell fontSize="xs" fontWeight="medium">{item.name}</Table.Cell>
                            <Table.Cell>
                              <Badge size="xs" colorPalette={item.category === 'earning' ? 'green' : 'red'}>
                                {item.category === 'earning' ? '+' : '-'} {item.category}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell>
                              <Input
                                size="xs"
                                type="number"
                                step="0.1"
                                min={0}
                                max={100}
                                w="70px"
                                value={item.percentage}
                                onChange={(e) => handleUpdateItemPct(item.id, Number(e.target.value))}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                size="xs"
                                variant={item.isActive ? 'solid' : 'outline'}
                                colorPalette={item.isActive ? 'green' : 'gray'}
                                onClick={() => handleToggleItemStatus(item.id)}
                              >
                                {item.isActive ? 'Active' : 'Off'}
                              </Button>
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              {!item.isSystem && (
                                <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleRemoveFormulaItem(item.id)}>
                                  <Trash2 size={12} />
                                </Button>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>

                  {/* Quick Add Row */}
                  <Flex gap={2} align="center" wrap="wrap" p={2} bg="white" borderRadius="8px" border="1px solid #e2e8f0">
                    <Input
                      size="xs"
                      placeholder="New allowance / deduction name"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      flex="2"
                      minW="140px"
                    />
                    <NativeSelect.Root size="xs" w="100px">
                      <NativeSelect.Field value={newItemType} onChange={e => setNewItemType(e.target.value as any)}>
                        <option value="earning">Allowance (+)</option>
                        <option value="deduction">Deduction (-)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                    <Input
                      size="xs"
                      type="number"
                      step="0.5"
                      placeholder="Rate %"
                      value={newItemPct}
                      onChange={e => setNewItemPct(Number(e.target.value))}
                      w="70px"
                    />
                    <Button size="xs" colorPalette="blue" onClick={handleAddFormulaItem}>
                      <Plus size={12} /> Add
                    </Button>
                  </Flex>
                </Stack>
              )}
            </Box>

            {isEditingInRunModal && (
              <Flex align="center" gap={2} mb={4} p={2} bg="#eff6ff" borderRadius="8px" fontSize="xs" color="#1d4ed8">
                <input
                  type="checkbox"
                  id="saveFutureCheck"
                  checked={saveFormulaForFuture}
                  onChange={e => setSaveFormulaForFuture(e.target.checked)}
                />
                <label htmlFor="saveFutureCheck" style={{ cursor: 'pointer' }}>
                  Save and use these updated percentages for future payroll calculations
                </label>
              </Flex>
            )}

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => { setShowConfirmRunModal(false); setIsEditingInRunModal(false); }}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="green" onClick={handleConfirmRunPayroll} fontWeight="bold">
                Run Calculations
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Standalone Formula & Rates Configuration Modal */}
      {showFormulaModal && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1450"
          bg="rgba(15, 23, 42, 0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 2, sm: 4 }}
        >
          <Box bg="white" borderRadius="16px" maxW="640px" w="100%" p={{ base: 4, sm: 6 }} border="1px solid #e2e8f0" boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={1}>
              <Flex align="center" gap={2}>
                <Sliders size={18} color="#2563eb" />
                <Heading size="md" color="#0f172a">Payroll Calculation Formula & Rates</Heading>
              </Flex>
              <Button size="xs" variant="ghost" onClick={() => setShowFormulaModal(false)}>
                <X size={16} />
              </Button>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Input and save the payroll items and respective percentages used when calculating monthly payroll. Saved rates are preserved and reused automatically.
            </Text>

            <Box overflowX="auto" mb={4}>
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader>Component Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Classification</Table.ColumnHeader>
                    <Table.ColumnHeader>Rate (%)</Table.ColumnHeader>
                    <Table.ColumnHeader>Base</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {formulaItems.map(item => (
                    <Table.Row key={item.id}>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">{item.name}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={item.category === 'earning' ? 'green' : 'red'}>
                          {item.category === 'earning' ? 'Allowance (+)' : 'Deduction (-)'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          size="xs"
                          type="number"
                          step="0.1"
                          min={0}
                          max={100}
                          w="75px"
                          value={item.percentage}
                          onChange={(e) => handleUpdateItemPct(item.id, Number(e.target.value))}
                        />
                      </Table.Cell>
                      <Table.Cell fontSize="11px" color="#64748b">
                        {item.basedOn === 'gross' ? 'Gross' : 'Basic'}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="xs"
                          variant={item.isActive ? 'solid' : 'outline'}
                          colorPalette={item.isActive ? 'green' : 'gray'}
                          onClick={() => handleToggleItemStatus(item.id)}
                        >
                          {item.isActive ? 'Active' : 'Off'}
                        </Button>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {!item.isSystem && (
                          <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleRemoveFormulaItem(item.id)}>
                            <Trash2 size={12} />
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Add New Item Section */}
            <Box p={3.5} mb={4} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={2}>Add New Payroll Item</Text>
              <SimpleGrid columns={{ base: 1, sm: 4 }} gap={2}>
                <Box gridColumn={{ sm: 'span 2' }}>
                  <Input
                    size="xs"
                    placeholder="e.g. Site Hazard Subsidy, Union Levy"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                  />
                </Box>
                <NativeSelect.Root size="xs">
                  <NativeSelect.Field value={newItemType} onChange={e => setNewItemType(e.target.value as any)}>
                    <option value="earning">Allowance (+)</option>
                    <option value="deduction">Deduction (-)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <Flex gap={1.5}>
                  <Input
                    size="xs"
                    type="number"
                    step="0.5"
                    placeholder="Rate %"
                    value={newItemPct}
                    onChange={e => setNewItemPct(Number(e.target.value))}
                    w="70px"
                  />
                  <Button size="xs" colorPalette="blue" onClick={handleAddFormulaItem}>
                    <Plus size={12} /> Add
                  </Button>
                </Flex>
              </SimpleGrid>
            </Box>

            <Flex justify="space-between" align="center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFormulaItems(payrollStructure?.items || []);
                  setShowFormulaModal(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" colorPalette="blue" onClick={handleSaveFormula} fontWeight="bold">
                <Save size={14} /> Save Formula for Future
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
