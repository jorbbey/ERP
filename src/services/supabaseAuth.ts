import { getSupabase } from './supabaseClient';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export const supabaseAuth = {
  // Sign Up with Email and Password (Instant, no OTP/confirmation needed)
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    const supabase = getSupabase();
    if (!supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured. Missing SUPABASE_URL or SUPABASE_ANON_KEY secrets.' 
      };
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const displayName = fullName?.trim() || trimmedEmail.split('@')[0];

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: displayName,
            name: displayName
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If Supabase has email confirmation turned off, session is returned immediately
      if (data.session) {
        return { success: true, user: data.user, session: data.session };
      }

      // If user was created, attempt immediate sign in
      const signInAttempt = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (signInAttempt.data?.session) {
        return { 
          success: true, 
          user: signInAttempt.data.user, 
          session: signInAttempt.data.session 
        };
      }

      // If Supabase project has default mandatory email verification enabled on its server
      if (data.user) {
        return {
          success: true,
          user: data.user,
          session: null,
          error: 'Account created! Note: Your Supabase project currently has "Confirm email" toggled ON. To log in instantly without email confirmation, go to Supabase Dashboard → Authentication → Providers → Email and toggle OFF "Confirm email".'
        };
      }

      return { success: true, user: data.user, session: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign up.' };
    }
  },

  // Sign In with Email and Password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const supabase = getSupabase();
    if (!supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured. Missing SUPABASE_URL or SUPABASE_ANON_KEY secrets.' 
      };
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user, session: data.session };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign in.' };
    }
  },

  // Sign Out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) return { success: true };

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sign out failed.' };
    }
  },

  // Get current active session
  async getSession(): Promise<Session | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  // Get current user
  async getUser(): Promise<User | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): { unsubscribe: () => void } {
    const supabase = getSupabase();
    if (!supabase) return { unsubscribe: () => {} };

    try {
      const { data } = supabase.auth.onAuthStateChange(callback);
      return data.subscription;
    } catch (err) {
      console.warn('Error subscribing to auth state change:', err);
      return { unsubscribe: () => {} };
    }
  }
};
