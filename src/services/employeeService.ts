import { Employee, EmployeeArchiveRecord, EmployeeCustomField } from '../types';
import { erpStorage } from './erpStorage';

export const employeeService = {
  getEmployees: (filters?: {
    department?: string;
    status?: string;
    searchTerm?: string;
  }): Employee[] => {
    let list = erpStorage.getEmployees();

    if (!filters) return list;

    if (filters.department && filters.department !== 'All') {
      list = list.filter(e => e.department === filters.department);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(e => e.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        (e.nin && e.nin.toLowerCase().includes(q)) ||
        (e.tin && e.tin.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getEmployeeById: (id: number): Employee | undefined => {
    return erpStorage.getEmployees().find(e => e.id === id);
  },

  createEmployee: (data: Omit<Employee, 'id' | 'code'> & { code?: string }): Employee => {
    const list = erpStorage.getEmployees();
    const newId = list.length > 0 ? Math.max(...list.map(e => e.id)) + 1 : 1;
    const code = data.code || `EMP-${String(newId).padStart(3, '0')}`;
    const newEmployee: Employee = {
      ...data,
      id: newId,
      code,
      createdAt: new Date().toISOString()
    };
    list.unshift(newEmployee);
    erpStorage.saveEmployees(list);
    return newEmployee;
  },

  updateEmployee: (id: number, data: Partial<Employee>): Employee | null => {
    const list = erpStorage.getEmployees();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...data };
    erpStorage.saveEmployees(list);
    return list[index];
  },

  archiveEmployee: (id: number, reason: string, archivedBy: string): boolean => {
    const list = erpStorage.getEmployees();
    const employee = list.find(e => e.id === id);
    if (!employee) return false;

    // Update status to Archived
    employee.status = 'Archived';
    erpStorage.saveEmployees(list);

    // Save archive record (matching PHP employee_archive table)
    const archives = erpStorage.getEmployeeArchives();
    const archiveRecord: EmployeeArchiveRecord = {
      id: Date.now(),
      companyId: 1,
      employeeId: employee.id,
      employeeCode: employee.code,
      employeeName: employee.name,
      department: employee.department,
      position: employee.position,
      reason,
      employeeData: JSON.stringify(employee),
      deletedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      archivedBy
    };
    archives.unshift(archiveRecord);
    erpStorage.saveEmployeeArchives(archives);
    return true;
  },

  restoreEmployee: (id: number): boolean => {
    const list = erpStorage.getEmployees();
    const employee = list.find(e => e.id === id);
    if (!employee) return false;

    employee.status = 'Active';
    erpStorage.saveEmployees(list);
    return true;
  },

  deleteEmployeePermanently: (id: number): boolean => {
    const list = erpStorage.getEmployees();
    const updated = list.filter(e => e.id !== id);
    erpStorage.saveEmployees(updated);
    return true;
  },

  getArchives: (): EmployeeArchiveRecord[] => {
    return erpStorage.getEmployeeArchives();
  },

  getDisabledColumns: (): string[] => {
    return erpStorage.getEmployeeDisabledColumns();
  },

  saveDisabledColumns: (cols: string[]): void => {
    erpStorage.saveEmployeeDisabledColumns(cols);
  },

  getCustomFields: (): EmployeeCustomField[] => {
    return erpStorage.getEmployeeCustomFields();
  },

  addCustomField: (field: Omit<EmployeeCustomField, 'id'>): EmployeeCustomField => {
    const fields = erpStorage.getEmployeeCustomFields();
    const newField: EmployeeCustomField = {
      ...field,
      id: Date.now()
    };
    fields.push(newField);
    erpStorage.saveEmployeeCustomFields(fields);
    return newField;
  }
};
