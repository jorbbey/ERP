import { Company, Employee, User, UserRole } from '../types';
import { erpStorage } from './erpStorage';
import { initialUsers } from '../mock/initialData';

export interface CompanyRegistrationData {
  companyName: string;
  companyEmail: string;
  contactPerson: string;
  contactPhone: string;
  country: string;
  businessAddress: string;
  industry?: string;
  currency?: string;
  password?: string;
  trialDays?: number;
}

export interface ProvisionAccountData {
  employeeId: number;
  loginEmail: string;
  loginRole: UserRole;
  tempPassword?: string;
  activationMethod: 'credentials' | 'invitation';
}

export const companyService = {
  // Check if company name or email already exists
  checkDuplicateCompany: (name: string, email: string): { isDuplicate: boolean; field?: string } => {
    const companies = erpStorage.getCompanies();
    const cleanName = name.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const nameExists = companies.some(c => (c.name || '').toLowerCase() === cleanName);
    if (nameExists) return { isDuplicate: true, field: 'Company Name' };

    const emailExists = companies.some(c => (c.email || '').toLowerCase() === cleanEmail);
    if (emailExists) return { isDuplicate: true, field: 'Company Email' };

    return { isDuplicate: false };
  },

  // Register a new company workspace with trial period
  registerCompany: (data: CompanyRegistrationData): { success: boolean; company?: Company; employee?: Employee; error?: string } => {
    const dupCheck = companyService.checkDuplicateCompany(data.companyName, data.companyEmail);
    if (dupCheck.isDuplicate) {
      return { success: false, error: `A company with this ${dupCheck.field} is already registered on the ERP platform.` };
    }

    const companies = erpStorage.getCompanies();
    const newCompanyId = Date.now();
    const cleanCode = data.companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CORP';

    const today = new Date();
    const trialDays = data.trialDays || 14;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + trialDays);

    const newCompany: Company = {
      id: newCompanyId,
      name: data.companyName.trim(),
      code: cleanCode,
      currency: data.currency || '₦',
      themeColor: '#2563eb',
      address: data.businessAddress.trim() || `${data.country} Headquarters`,
      taxNumber: `TIN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      phone: data.contactPhone.trim(),
      email: data.companyEmail.trim().toLowerCase(),
      country: data.country || 'Nigeria',
      industry: data.industry || 'General Civil Contracting',
      isActive: true,
      createdAt: today.toISOString().split('T')[0],
      trialStatus: 'active',
      trialStartDate: today.toISOString().split('T')[0],
      trialEndDate: endDate.toISOString().split('T')[0],
      subscriptionPlan: `${trialDays}-Day Enterprise Trial`,
      contactPerson: data.contactPerson.trim()
    };

    // Save company
    const updatedCompanies = [...companies, newCompany];
    erpStorage.saveCompanies(updatedCompanies);
    erpStorage.saveActiveCompanyId(newCompanyId);

    // Create primary company administrator employee
    const employees = erpStorage.getEmployees();
    const nameParts = data.contactPerson.trim().split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const newEmpId = Date.now() + 1;
    const adminEmployee: Employee = {
      id: newEmpId,
      companyId: newCompanyId,
      code: `EMP-${cleanCode}-001`,
      firstName,
      lastName,
      name: data.contactPerson.trim(),
      email: data.companyEmail.trim().toLowerCase(),
      phone: data.contactPhone.trim(),
      department: 'Executive Management',
      position: 'Managing Director',
      role: 'Managing Director',
      salary: 1200000,
      hireDate: today.toISOString().split('T')[0],
      status: 'Active',
      hasLoginAccount: true,
      loginStatus: 'Active',
      loginEmail: data.companyEmail.trim().toLowerCase(),
      loginRole: 'Managing Director',
      tempPassword: data.password || 'Admin@2026',
      accountCreatedAt: today.toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedEmployees = [adminEmployee, ...employees];
    erpStorage.saveEmployees(updatedEmployees);

    return { success: true, company: newCompany, employee: adminEmployee };
  },

  // Provision login account for an existing employee
  provisionEmployeeAccount: (data: ProvisionAccountData): { success: boolean; employee?: Employee; error?: string } => {
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === data.employeeId);
    if (!emp) {
      return { success: false, error: 'Employee record not found.' };
    }

    const cleanEmail = data.loginEmail.trim().toLowerCase();

    // Check if another employee already has this login email
    const emailConflict = employees.some(e => e.id !== data.employeeId && (e.loginEmail || '').toLowerCase() === cleanEmail);
    if (emailConflict) {
      return { success: false, error: 'Another staff account is already using this login email address.' };
    }

    const updatedEmp: Employee = {
      ...emp,
      hasLoginAccount: true,
      loginStatus: data.activationMethod === 'invitation' ? 'Pending Activation' : 'Active',
      loginEmail: cleanEmail,
      loginRole: data.loginRole,
      tempPassword: data.tempPassword || 'ChangeMe@2026',
      accountCreatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedList = employees.map(e => e.id === data.employeeId ? updatedEmp : e);
    erpStorage.saveEmployees(updatedList);

    return { success: true, employee: updatedEmp };
  },

  // Update employee login account status (Active, Suspended, Deactivated)
  updateLoginStatus: (employeeId: number, status: 'Active' | 'Suspended' | 'Deactivated'): { success: boolean; employee?: Employee } => {
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.hasLoginAccount) return { success: false };

    const updatedEmp: Employee = {
      ...emp,
      loginStatus: status
    };

    const updatedList = employees.map(e => e.id === employeeId ? updatedEmp : e);
    erpStorage.saveEmployees(updatedList);
    return { success: true, employee: updatedEmp };
  },

  // Revoke employee login credentials completely without deleting HR record
  revokeLoginAccess: (employeeId: number): { success: boolean; employee?: Employee } => {
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false };

    const updatedEmp: Employee = {
      ...emp,
      hasLoginAccount: false,
      loginStatus: undefined,
      loginEmail: undefined,
      loginRole: undefined,
      tempPassword: undefined
    };

    const updatedList = employees.map(e => e.id === employeeId ? updatedEmp : e);
    erpStorage.saveEmployees(updatedList);
    return { success: true, employee: updatedEmp };
  }
};
