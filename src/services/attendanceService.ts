import { AttendanceRecord } from '../types';
import { erpStorage } from './erpStorage';

export const attendanceService = {
  getAttendanceRecords: (filters?: {
    date?: string;
    department?: string;
    status?: string;
    searchTerm?: string;
  }): AttendanceRecord[] => {
    let list = erpStorage.getAttendance();

    if (!filters) return list;

    if (filters.date) {
      list = list.filter(a => a.attendanceDate === filters.date);
    }

    if (filters.department && filters.department !== 'All') {
      list = list.filter(a => a.department === filters.department);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(a => a.status === filters.status);
    }

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(a =>
        a.employeeName.toLowerCase().includes(q) ||
        a.employeeCode.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getTodayRecordForEmployee: (employeeId: number): AttendanceRecord | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return erpStorage.getAttendance().find(
      a => a.employeeId === employeeId && a.attendanceDate === today
    );
  },

  clockIn: (employeeId: number): { success: boolean; record?: AttendanceRecord; error?: string } => {
    const today = new Date().toISOString().split('T')[0];
    const list = erpStorage.getAttendance();
    const existing = list.find(a => a.employeeId === employeeId && a.attendanceDate === today);

    if (existing && existing.checkIn) {
      return { success: false, error: 'Employee has already clocked in for today.' };
    }

    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return { success: false, error: 'Employee not found.' };
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 15);
    const status: AttendanceRecord['status'] = isLate ? 'late' : 'present';

    if (existing) {
      existing.checkIn = timeStr;
      existing.status = status;
      erpStorage.saveAttendance(list);
      return { success: true, record: existing };
    }

    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const newRecord: AttendanceRecord = {
      id: newId,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.code,
      department: emp.department,
      attendanceDate: today,
      checkIn: timeStr,
      status,
      createdAt: now.toISOString()
    };

    list.unshift(newRecord);
    erpStorage.saveAttendance(list);
    return { success: true, record: newRecord };
  },

  clockOut: (employeeId: number): { success: boolean; record?: AttendanceRecord; error?: string } => {
    const today = new Date().toISOString().split('T')[0];
    const list = erpStorage.getAttendance();
    const existing = list.find(a => a.employeeId === employeeId && a.attendanceDate === today);

    if (!existing || !existing.checkIn) {
      return { success: false, error: 'Cannot clock out: No check-in record found for today.' };
    }

    if (existing.checkOut) {
      return { success: false, error: 'Employee has already clocked out for today.' };
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    existing.checkOut = timeStr;

    // Calculate hours worked
    const [inH, inM] = existing.checkIn.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);
    const hours = Math.max(0, (outH + outM / 60) - (inH + inM / 60));
    existing.hoursWorked = Number(hours.toFixed(1));

    erpStorage.saveAttendance(list);
    return { success: true, record: existing };
  },

  recordManualAttendance: (data: {
    employeeId: number;
    attendanceDate: string;
    checkIn?: string;
    checkOut?: string;
    status: AttendanceRecord['status'];
    notes?: string;
  }): AttendanceRecord => {
    const list = erpStorage.getAttendance();
    const employees = erpStorage.getEmployees();
    const emp = employees.find(e => e.id === data.employeeId);

    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;

    let hoursWorked: number | undefined;
    if (data.checkIn && data.checkOut) {
      const [inH, inM] = data.checkIn.split(':').map(Number);
      const [outH, outM] = data.checkOut.split(':').map(Number);
      const diff = (outH + outM / 60) - (inH + inM / 60);
      hoursWorked = Math.max(0, Number(diff.toFixed(1)));
    }

    const newRecord: AttendanceRecord = {
      id: newId,
      employeeId: data.employeeId,
      employeeName: emp?.name || 'Staff Member',
      employeeCode: emp?.code || 'EMP-GEN',
      department: emp?.department || 'Operations',
      attendanceDate: data.attendanceDate,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status,
      hoursWorked,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };

    list.unshift(newRecord);
    erpStorage.saveAttendance(list);
    return newRecord;
  },

  requestCorrection: (recordId: number, reason: string): boolean => {
    const list = erpStorage.getAttendance();
    const record = list.find(a => a.id === recordId);
    if (!record) return false;

    record.correctionRequested = true;
    record.correctionReason = reason;
    record.correctionStatus = 'Pending';
    erpStorage.saveAttendance(list);
    return true;
  },

  decideCorrection: (recordId: number, status: 'Approved' | 'Rejected', approverNotes?: string): boolean => {
    const list = erpStorage.getAttendance();
    const record = list.find(a => a.id === recordId);
    if (!record) return false;

    record.correctionStatus = status;
    if (status === 'Approved') {
      record.status = 'present';
      if (approverNotes) {
        record.notes = (record.notes ? record.notes + '; ' : '') + `Correction approved: ${approverNotes}`;
      }
    }
    erpStorage.saveAttendance(list);
    return true;
  }
};
