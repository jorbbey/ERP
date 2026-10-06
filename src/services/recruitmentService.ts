import { RecruitmentApplication, JobVacancy, Employee, UserRole } from '../types';
import { erpStorage } from './erpStorage';
import { employeeService } from './employeeService';

export const recruitmentService = {
  getVacancies: (): JobVacancy[] => {
    return erpStorage.getJobVacancies();
  },

  createVacancy: (data: Omit<JobVacancy, 'id' | 'postedDate'>): JobVacancy => {
    const list = erpStorage.getJobVacancies();
    const newId = list.length > 0 ? Math.max(...list.map(v => v.id)) + 1 : 1;
    const newVac: JobVacancy = {
      ...data,
      id: newId,
      postedDate: new Date().toISOString().split('T')[0]
    };
    list.unshift(newVac);
    erpStorage.saveJobVacancies(list);
    return newVac;
  },

  updateVacancy: (id: number, data: Partial<JobVacancy>): JobVacancy | null => {
    const list = erpStorage.getJobVacancies();
    const index = list.findIndex(v => v.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...data };
    erpStorage.saveJobVacancies(list);
    return list[index];
  },

  getApplications: (filters?: {
    status?: string;
    position?: string;
    department?: string;
    searchTerm?: string;
  }): RecruitmentApplication[] => {
    let list = erpStorage.getRecruitmentApplications();

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter(a => a.status === filters.status);
    }

    if (filters.position && filters.position !== 'All') {
      list = list.filter(a => a.position === filters.position);
    }

    if (filters.department && filters.department !== 'All') {
      list = list.filter(a => a.department === filters.department);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(a =>
        a.applicantName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q)
      );
    }

    return list;
  },

  createApplication: (data: Omit<RecruitmentApplication, 'id' | 'appliedDate' | 'status'>): RecruitmentApplication => {
    const list = erpStorage.getRecruitmentApplications();
    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const newApp: RecruitmentApplication = {
      ...data,
      id: newId,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    list.unshift(newApp);
    erpStorage.saveRecruitmentApplications(list);
    return newApp;
  },

  updateApplicationStage: (
    id: number,
    status: RecruitmentApplication['status'],
    details?: {
      interviewDate?: string;
      interviewer?: string;
      rating?: number;
      notes?: string;
      rejectionReason?: string;
    }
  ): RecruitmentApplication | null => {
    const list = erpStorage.getRecruitmentApplications();
    const app = list.find(a => a.id === id);
    if (!app) return null;

    app.status = status;
    if (details) {
      if (details.interviewDate !== undefined) app.interviewDate = details.interviewDate;
      if (details.interviewer !== undefined) app.interviewer = details.interviewer;
      if (details.rating !== undefined) app.rating = details.rating;
      if (details.notes !== undefined) app.notes = details.notes;
      if (details.rejectionReason !== undefined) app.rejectionReason = details.rejectionReason;
    }

    erpStorage.saveRecruitmentApplications(list);
    return app;
  },

  hireCandidate: (params: {
    applicationId: number;
    salary: number;
    hireDate?: string;
    role?: UserRole;
  }): { success: boolean; employee?: Employee; error?: string } => {
    const list = erpStorage.getRecruitmentApplications();
    const app = list.find(a => a.id === params.applicationId);
    if (!app) return { success: false, error: 'Application not found.' };

    app.status = 'hired';
    erpStorage.saveRecruitmentApplications(list);

    // Split name into first and last name
    const parts = app.applicantName.trim().split(' ');
    const firstName = parts[0] || 'Staff';
    const lastName = parts.slice(1).join(' ') || 'Member';

    // Create employee record
    const newEmp = employeeService.createEmployee({
      firstName,
      lastName,
      name: app.applicantName,
      email: app.email,
      phone: app.phone,
      department: app.department || 'Civil Engineering & Construction',
      position: app.position,
      role: params.role || 'Staff',
      salary: params.salary,
      hireDate: params.hireDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      bankName: 'First Commercial Bank',
      pfa: 'Apex Pension Trust'
    });

    return { success: true, employee: newEmp };
  }
};
