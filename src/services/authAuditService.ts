import { AuthSessionLog, AuthEventType } from '../types';

const AUTH_LOGS_STORAGE_KEY = 'construction_erp_auth_audit_logs';

export const initialAuthLogs: AuthSessionLog[] = [
  {
    id: 1,
    userId: 1,
    userEmail: 'adebayo@juliusberger-demo.ng',
    userName: 'John Adebayo',
    userRole: 'Managing Director',
    eventType: 'successful_login',
    timestamp: '2026-10-15 08:14:22',
    sessionId: 'sess_corp_98a72b14',
    ipAddress: '102.89.44.18',
    deviceInfo: 'Chrome 128 / macOS Sequoia (14.5)',
    status: 'Success',
    notes: 'Authenticated via corporate email credentials'
  },
  {
    id: 2,
    userId: 2,
    userEmail: 'finance.lead@juliusberger-demo.ng',
    userName: 'Babatunde Adeleke',
    userRole: 'Finance Manager',
    eventType: 'successful_login',
    timestamp: '2026-10-15 08:32:05',
    sessionId: 'sess_fin_34b81c90',
    ipAddress: '197.210.226.74',
    deviceInfo: 'Firefox 129 / Windows 11 Enterprise',
    status: 'Success',
    notes: 'Authenticated for monthly treasury & payroll review'
  },
  {
    id: 3,
    userEmail: 'contractor.guest@external-audit.com',
    userName: 'Unknown Auditor',
    userRole: 'Staff',
    eventType: 'failed_login',
    timestamp: '2026-10-15 08:45:12',
    sessionId: 'sess_att_failed_01',
    ipAddress: '105.112.98.51',
    deviceInfo: 'Edge 127 / Windows 10',
    failureReason: 'Invalid password credentials provided (3rd attempt)',
    status: 'Failed',
    notes: 'Blocked password mismatch without logging sensitive payload'
  },
  {
    id: 4,
    userId: 3,
    userEmail: 'chioma.okon@juliusberger-demo.ng',
    userName: 'Chioma Okon',
    userRole: 'Site Engineer',
    eventType: 'successful_login',
    timestamp: '2026-10-15 09:02:18',
    sessionId: 'sess_site_55c12e87',
    ipAddress: '102.88.35.190',
    deviceInfo: 'Safari Mobile / iPadOS 17.6 (Site Terminal)',
    status: 'Success',
    notes: 'Site trailer biometric station authenticated'
  },
  {
    id: 5,
    userId: 4,
    userEmail: 'procurement@juliusberger-demo.ng',
    userName: 'Musa YarAdua',
    userRole: 'Procurement Officer',
    eventType: 'logout',
    timestamp: '2026-10-14 17:35:40',
    sessionId: 'sess_proc_88f90a21',
    ipAddress: '197.210.64.12',
    deviceInfo: 'Chrome 128 / Windows 11 Enterprise',
    status: 'Success',
    notes: 'Explicit user-initiated sign out from top navigation'
  },
  {
    id: 6,
    userId: 5,
    userEmail: 'amara.okafor@juliusberger-demo.ng',
    userName: 'Amara Okafor',
    userRole: 'HR Manager',
    eventType: 'session_expired',
    timestamp: '2026-10-14 20:00:00',
    sessionId: 'sess_hr_77d44c99',
    ipAddress: '102.89.45.60',
    deviceInfo: 'Chrome 128 / macOS Sonoma',
    status: 'Expired',
    notes: 'Inactivity session timeout (120 minutes TTL exceeded)'
  },
  {
    id: 7,
    userId: 6,
    userEmail: 'temp.site@juliusberger-demo.ng',
    userName: 'Junior Site Trainee',
    userRole: 'Staff',
    eventType: 'admin_terminated',
    timestamp: '2026-10-14 16:15:22',
    sessionId: 'sess_staff_12c34a55',
    ipAddress: '197.210.88.102',
    deviceInfo: 'Android Chrome / Samsung Galaxy Tab',
    status: 'Terminated',
    notes: 'Administrative termination by Super Admin for role reassignment'
  }
];

export const authAuditService = {
  getAuthLogs: (): AuthSessionLog[] => {
    try {
      const stored = localStorage.getItem(AUTH_LOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth audit logs:', e);
    }
    // Seed with realistic historical records
    localStorage.setItem(AUTH_LOGS_STORAGE_KEY, JSON.stringify(initialAuthLogs));
    return initialAuthLogs;
  },

  recordAuthEvent: (event: {
    userId?: number;
    userEmail?: string;
    userName?: string;
    userRole?: string;
    eventType: AuthEventType;
    failureReason?: string;
    ipAddress?: string;
    deviceInfo?: string;
    notes?: string;
  }): AuthSessionLog => {
    const logs = authAuditService.getAuthLogs();
    const newId = logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1;
    
    // Auto-detect browser/platform environment if not explicitly provided
    let detectedDevice = event.deviceInfo;
    if (!detectedDevice && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const isMobile = /mobile/i.test(ua);
      const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser';
      const os = ua.includes('Mac') ? 'macOS' : ua.includes('Win') ? 'Windows' : ua.includes('Linux') ? 'Linux' : 'OS';
      detectedDevice = `${browser} / ${os} ${isMobile ? '(Mobile)' : '(Workstation)'}`;
    }

    const newLog: AuthSessionLog = {
      id: newId,
      userId: event.userId,
      userEmail: event.userEmail || (event.userName ? `${event.userName.toLowerCase().replace(/\s+/g, '.')}@construction-erp.internal` : 'guest@erp.internal'),
      userName: event.userName || 'Unknown User',
      userRole: event.userRole || 'Staff',
      eventType: event.eventType,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sessionId: `sess_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString().slice(-4)}`,
      ipAddress: event.ipAddress || '197.210.64.12',
      deviceInfo: detectedDevice || 'Enterprise Secure Workstation',
      failureReason: event.failureReason,
      status: event.eventType === 'successful_login' ? 'Success' :
              event.eventType === 'failed_login' ? 'Failed' :
              event.eventType === 'logout' ? 'Success' :
              event.eventType === 'admin_terminated' ? 'Terminated' : 'Expired',
      notes: event.notes || (
        event.eventType === 'successful_login' ? 'User successfully authenticated session' :
        event.eventType === 'logout' ? 'Explicit user sign-out from ERP application' :
        event.eventType === 'failed_login' ? `Login failed: ${event.failureReason || 'Credentials rejected'}` :
        event.eventType === 'admin_terminated' ? 'Session terminated by security administrator' :
        'Session expired'
      )
    };

    // Append-only guarantee
    const updated = [newLog, ...logs];
    try {
      localStorage.setItem(AUTH_LOGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save auth audit log:', e);
    }
    return newLog;
  },

  filterLogs: (
    logs: AuthSessionLog[],
    filters: {
      searchTerm?: string;
      eventType?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): AuthSessionLog[] => {
    return logs.filter(log => {
      if (filters.eventType && filters.eventType !== 'all' && log.eventType !== filters.eventType) {
        return false;
      }
      if (filters.userId && filters.userId !== 'all' && String(log.userId) !== filters.userId) {
        return false;
      }
      if (filters.startDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate < filters.startDate) return false;
      }
      if (filters.endDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate > filters.endDate) return false;
      }
      if (filters.searchTerm) {
        const q = filters.searchTerm.toLowerCase();
        const matchUser = (log.userName || '').toLowerCase().includes(q);
        const matchEmail = (log.userEmail || '').toLowerCase().includes(q);
        const matchIp = (log.ipAddress || '').toLowerCase().includes(q);
        const matchSess = (log.sessionId || '').toLowerCase().includes(q);
        const matchReason = (log.failureReason || '').toLowerCase().includes(q);
        const matchNotes = (log.notes || '').toLowerCase().includes(q);
        if (!matchUser && !matchEmail && !matchIp && !matchSess && !matchReason && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }
};
