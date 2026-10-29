/**
 * Session Lifecycle & Inactivity Management Service
 *
 * Requirements:
 * 1. Tab / Page Closure Expiration: Session is stored in browser sessionStorage,
 *    so closing the tab or browser automatically terminates the session.
 * 2. 24-Hour Inactivity Expiration: If the site remains open but untouched
 *    for 24 hours (86,400,000 ms), the session automatically expires.
 * 3. Page Refresh (F5): Active sessions survive page reloads within the same tab.
 */

export interface StoredSessionPayload {
  user: any;
  session: any;
  userName: string;
  userRole: string;
  companyId?: number;
  loginAt: number;
  lastActivity: number;
}

const SESSION_ACTIVE_FLAG = 'erp_session_active';
const SESSION_DATA_KEY = 'erp_session_payload';
const SESSION_LAST_ACTIVITY = 'erp_session_last_activity';

// 24 Hours in Milliseconds
export const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000;

export const sessionManager = {
  /**
   * Purges persistent session tokens from localStorage (e.g. old Supabase auth tokens)
   * to guarantee that sessions never survive tab/browser closures.
   */
  cleanupLegacyLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sb-') || k.includes('-auth-token') || k === 'erp_active_session')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore storage access errors
    }
  },

  /**
   * Saves active session into sessionStorage
   */
  saveSession(payload: StoredSessionPayload): void {
    if (typeof window === 'undefined') return;
    try {
      const now = Date.now();
      sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
      sessionStorage.setItem(SESSION_LAST_ACTIVITY, String(now));
      sessionStorage.setItem(
        SESSION_DATA_KEY,
        JSON.stringify({
          ...payload,
          lastActivity: now,
          loginAt: payload.loginAt || now
        })
      );
    } catch (err) {
      console.warn('Failed to save session to sessionStorage', err);
    }
  },

  /**
   * Retrieves the active session payload from sessionStorage, verifying 24h activity
   */
  getActiveSession(): StoredSessionPayload | null {
    if (typeof window === 'undefined') return null;
    try {
      const isActive = sessionStorage.getItem(SESSION_ACTIVE_FLAG);
      if (!isActive) return null;

      const raw = sessionStorage.getItem(SESSION_DATA_KEY);
      if (!raw) return null;

      // Check 24-hour inactivity
      if (this.isExpired()) {
        this.clearSession();
        return null;
      }

      const parsed: StoredSessionPayload = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Records a user interaction timestamp into sessionStorage
   */
  recordActivity(): void {
    if (typeof window === 'undefined') return;
    try {
      if (!sessionStorage.getItem(SESSION_ACTIVE_FLAG)) return;
      sessionStorage.setItem(SESSION_LAST_ACTIVITY, String(Date.now()));
    } catch {
      // ignore
    }
  },

  /**
   * Checks whether the current session has exceeded 24 hours of inactivity
   */
  isExpired(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const isActive = sessionStorage.getItem(SESSION_ACTIVE_FLAG);
      if (!isActive) return false;

      const lastActivityStr = sessionStorage.getItem(SESSION_LAST_ACTIVITY);
      if (!lastActivityStr) return false;

      const lastActivity = Number(lastActivityStr);
      if (!lastActivity || isNaN(lastActivity)) return false;

      return Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS;
    } catch {
      return false;
    }
  },

  /**
   * Clears the current session from sessionStorage
   */
  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(SESSION_ACTIVE_FLAG);
      sessionStorage.removeItem(SESSION_DATA_KEY);
      sessionStorage.removeItem(SESSION_LAST_ACTIVITY);
    } catch {
      // ignore
    }
  }
};
