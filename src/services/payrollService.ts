import { PayrollRun, Payslip } from '../types';
import { erpStorage } from './erpStorage';

export const payrollService = {
  getPayrollRuns: (): PayrollRun[] => {
    return erpStorage.getPayrollRuns();
  },

  getPayslips: (payrollRunId?: number): Payslip[] => {
    const list = erpStorage.getPayslips();
    if (payrollRunId) {
      return list.filter(p => p.payrollRunId === payrollRunId);
    }
    return list;
  },

  processPayrollMonth: (monthYear: string): PayrollRun => {
    const employees = erpStorage.getEmployees().filter(e => e.status === 'Active');
    const loans = erpStorage.getEmployeeLoans();
    const advances = erpStorage.getSalaryAdvances();

    const runs = erpStorage.getPayrollRuns();
    const newRunId = runs.length > 0 ? Math.max(...runs.map(r => r.id)) + 1 : 1;

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    const allPayslips = erpStorage.getPayslips();
    let nextSlipId = allPayslips.length > 0 ? Math.max(...allPayslips.map(s => s.id)) + 1 : 1;

    const newPayslips: Payslip[] = [];

    employees.forEach(emp => {
      const basic = emp.salary || 4000;
      const allowance = Math.round(basic * 0.12);
      const gross = basic + allowance;

      // Tax (approx. 18% PAYE)
      const tax = Math.round(gross * 0.18);
      // Pension (8% statutory employee pension)
      const pension = Math.round(basic * 0.08);

      // Check active loan deduction
      let loanDeduction = 0;
      const activeLoan = loans.find(l => l.employeeId === emp.id && l.status === 'Active');
      if (activeLoan) {
        const remaining = activeLoan.totalAmount - activeLoan.repaidAmount;
        loanDeduction = Math.min(activeLoan.monthlyDeduction, remaining);
      }

      // Check salary advance deduction for this month
      const activeAdvance = advances.find(
        a => a.employeeId === emp.id && a.status === 'Approved' && a.deductionMonth.toLowerCase() === monthYear.toLowerCase()
      );
      const advanceDeduction = activeAdvance ? activeAdvance.amount : 0;

      const deductions = tax + pension + loanDeduction + advanceDeduction;
      const net = gross - deductions;

      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;

      newPayslips.push({
        id: nextSlipId++,
        payrollRunId: newRunId,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.code,
        department: emp.department,
        basicSalary: basic,
        allowances: allowance,
        grossPay: gross,
        tax,
        pension,
        loanDeduction: loanDeduction + advanceDeduction,
        totalDeductions: deductions,
        netPay: net,
        sentToPortal: false
      });
    });

    const newRun: PayrollRun = {
      id: newRunId,
      monthYear,
      totalGross,
      totalDeductions,
      totalNet,
      employeeCount: employees.length,
      processedDate: new Date().toISOString().split('T')[0],
      status: 'Finalized'
    };

    runs.unshift(newRun);
    erpStorage.savePayrollRuns(runs);
    erpStorage.savePayslips([...newPayslips, ...allPayslips]);

    return newRun;
  },

  finalizePayrollRun: (runId: number): boolean => {
    const runs = erpStorage.getPayrollRuns();
    const run = runs.find(r => r.id === runId);
    if (!run) return false;

    run.status = 'Finalized';
    erpStorage.savePayrollRuns(runs);
    return true;
  },

  markPayrollPaid: (runId: number): boolean => {
    const runs = erpStorage.getPayrollRuns();
    const run = runs.find(r => r.id === runId);
    if (!run) return false;

    run.status = 'Paid';
    erpStorage.savePayrollRuns(runs);

    // Update payslips sentToPortal
    const slips = erpStorage.getPayslips();
    slips.forEach(s => {
      if (s.payrollRunId === runId) {
        s.sentToPortal = true;
      }
    });
    erpStorage.savePayslips(slips);

    return true;
  },

  importPayrollCSV: (csvContent: string): { success: boolean; run?: PayrollRun; error?: string } => {
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        return { success: false, error: 'CSV file contains no data rows.' };
      }

      // Expected format: employee_code,payroll_month,basic_salary,allowances,deductions
      const employees = erpStorage.getEmployees();
      const runs = erpStorage.getPayrollRuns();
      const allPayslips = erpStorage.getPayslips();

      const newRunId = runs.length > 0 ? Math.max(...runs.map(r => r.id)) + 1 : 1;
      let nextSlipId = allPayslips.length > 0 ? Math.max(...allPayslips.map(s => s.id)) + 1 : 1;

      let month = 'Imported Month';
      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;
      const importedPayslips: Payslip[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [code, pMonth, basicStr, allowStr, dedStr] = line.split(',').map(s => s?.trim());
        if (!code) continue;

        if (pMonth) month = pMonth;

        const basic = Number(basicStr) || 0;
        const allowance = Number(allowStr) || 0;
        const deductions = Number(dedStr) || 0;
        const gross = basic + allowance;
        const net = gross - deductions;

        const emp = employees.find(e => e.code.toLowerCase() === code.toLowerCase());

        totalGross += gross;
        totalDeductions += deductions;
        totalNet += net;

        importedPayslips.push({
          id: nextSlipId++,
          payrollRunId: newRunId,
          employeeId: emp?.id || 999,
          employeeName: emp?.name || `Employee (${code})`,
          employeeCode: code,
          department: emp?.department || 'Operations',
          basicSalary: basic,
          allowances: allowance,
          grossPay: gross,
          tax: Math.round(deductions * 0.6),
          pension: Math.round(deductions * 0.4),
          loanDeduction: 0,
          totalDeductions: deductions,
          netPay: net,
          sentToPortal: true
        });
      }

      const newRun: PayrollRun = {
        id: newRunId,
        monthYear: month,
        totalGross,
        totalDeductions,
        totalNet,
        employeeCount: importedPayslips.length,
        processedDate: new Date().toISOString().split('T')[0],
        status: 'Paid'
      };

      runs.unshift(newRun);
      erpStorage.savePayrollRuns(runs);
      erpStorage.savePayslips([...importedPayslips, ...allPayslips]);

      return { success: true, run: newRun };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse CSV file.' };
    }
  },

  calculateEmployeePay: (params: {
    employeeId: number;
    monthYear: string;
    customBasic?: number;
    customAllowances?: number;
  }) => {
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === params.employeeId);
    if (!emp) return null;

    const loans = erpStorage.getEmployeeLoans();
    const advances = erpStorage.getSalaryAdvances();

    const basic = params.customBasic !== undefined ? params.customBasic : (emp.salary || 4000);
    const allowances = params.customAllowances !== undefined ? params.customAllowances : Math.round(basic * 0.12);
    const gross = basic + allowances;

    const tax = Math.round(gross * 0.18);
    const pension = Math.round(basic * 0.08);

    let loanDeduction = 0;
    const activeLoan = loans.find(l => l.employeeId === emp.id && l.status === 'Active');
    if (activeLoan) {
      const remaining = activeLoan.totalAmount - activeLoan.repaidAmount;
      loanDeduction = Math.min(activeLoan.monthlyDeduction, remaining);
    }

    const activeAdvance = advances.find(
      a => a.employeeId === emp.id && a.status === 'Approved' && a.deductionMonth.toLowerCase() === params.monthYear.toLowerCase()
    );
    const advanceDeduction = activeAdvance ? activeAdvance.amount : 0;

    const statutoryDeductions = tax + pension;
    const otherDeductions = loanDeduction + advanceDeduction;
    const totalDeductions = statutoryDeductions + otherDeductions;
    const netPay = gross - totalDeductions;

    return {
      employee: emp,
      basicSalary: basic,
      allowances,
      grossPay: gross,
      tax,
      pension,
      loanDeduction: otherDeductions,
      statutoryDeductions,
      totalDeductions,
      netPay
    };
  },

  createIndividualPayrollEntry: (params: {
    employeeId: number;
    monthYear: string;
    basicSalary?: number;
    allowances?: number;
    createdBy?: string;
    notes?: string;
  }): { success: boolean; payslip?: Payslip; run?: PayrollRun; error?: string } => {
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === params.employeeId);
    if (!emp) {
      return { success: false, error: 'Employee not found.' };
    }

    const allPayslips = erpStorage.getPayslips();
    const runs = erpStorage.getPayrollRuns();

    // Check for duplicate entry for same employee in the same period
    const existingSlip = allPayslips.find(
      p => p.employeeId === emp.id &&
           runs.find(r => r.id === p.payrollRunId)?.monthYear.toLowerCase() === params.monthYear.toLowerCase()
    );

    if (existingSlip) {
      return {
        success: false,
        error: `A payroll entry for ${emp.name} (${emp.code}) already exists in period ${params.monthYear}. Duplicate pay entries are prohibited.`
      };
    }

    const calc = payrollService.calculateEmployeePay({
      employeeId: emp.id,
      monthYear: params.monthYear,
      customBasic: params.basicSalary,
      customAllowances: params.allowances
    });

    if (!calc) {
      return { success: false, error: 'Failed to calculate payroll deductions.' };
    }

    // Find or create payroll run for this monthYear
    let run = runs.find(r => r.monthYear.toLowerCase() === params.monthYear.toLowerCase());
    let runId: number;

    if (!run) {
      runId = runs.length > 0 ? Math.max(...runs.map(r => r.id)) + 1 : 1;
      run = {
        id: runId,
        monthYear: params.monthYear,
        totalGross: calc.grossPay,
        totalDeductions: calc.totalDeductions,
        totalNet: calc.netPay,
        employeeCount: 1,
        processedDate: new Date().toISOString().split('T')[0],
        status: 'Draft'
      };
      runs.unshift(run);
    } else {
      runId = run.id;
      run.totalGross += calc.grossPay;
      run.totalDeductions += calc.totalDeductions;
      run.totalNet += calc.netPay;
      run.employeeCount += 1;
    }

    const nextSlipId = allPayslips.length > 0 ? Math.max(...allPayslips.map(s => s.id)) + 1 : 1;
    const newPayslip: Payslip = {
      id: nextSlipId,
      payrollRunId: runId,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.code,
      department: emp.department,
      basicSalary: calc.basicSalary,
      allowances: calc.allowances,
      grossPay: calc.grossPay,
      tax: calc.tax,
      pension: calc.pension,
      loanDeduction: calc.loanDeduction,
      totalDeductions: calc.totalDeductions,
      netPay: calc.netPay,
      sentToPortal: false
    };

    allPayslips.unshift(newPayslip);
    erpStorage.savePayrollRuns(runs);
    erpStorage.savePayslips(allPayslips);

    return {
      success: true,
      payslip: newPayslip,
      run
    };
  }
};
