import { Department } from '../types';
import { erpStorage } from './erpStorage';

export const departmentService = {
  getDepartments: (): Department[] => {
    return erpStorage.getDepartments();
  },

  getDepartmentById: (id: number): Department | undefined => {
    return erpStorage.getDepartments().find(d => d.id === id);
  },

  createDepartment: (data: Omit<Department, 'id'>): Department => {
    const list = erpStorage.getDepartments();
    const newId = list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1;
    const newDept: Department = {
      ...data,
      id: newId
    };
    list.push(newDept);
    erpStorage.saveDepartments(list);
    return newDept;
  },

  updateDepartment: (id: number, data: Partial<Department>): Department | null => {
    const list = erpStorage.getDepartments();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...data };
    erpStorage.saveDepartments(list);
    return list[index];
  },

  deleteDepartment: (id: number): boolean => {
    const list = erpStorage.getDepartments();
    const updated = list.filter(d => d.id !== id);
    erpStorage.saveDepartments(updated);
    return true;
  },

  assignDepartmentHead: (departmentId: number, employeeId: number, headName: string, headTitle?: string): Department | null => {
    const list = erpStorage.getDepartments();
    const dept = list.find(d => d.id === departmentId);
    if (!dept) return null;

    dept.headEmployeeId = employeeId;
    dept.headName = headName;
    if (headTitle) {
      dept.headTitle = headTitle;
    }
    erpStorage.saveDepartments(list);
    return dept;
  }
};
