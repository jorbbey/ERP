import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_URL || (import.meta.env as any)?.SUPABASE_URL)) ||
    (typeof globalThis !== 'undefined' && ((globalThis as any).process?.env?.SUPABASE_URL || (globalThis as any).process?.env?.VITE_SUPABASE_URL)) ||
    ''
  ).trim();

  const envKey = (
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || (import.meta.env as any)?.SUPABASE_ANON_KEY)) ||
    (typeof globalThis !== 'undefined' && ((globalThis as any).process?.env?.SUPABASE_ANON_KEY || (globalThis as any).process?.env?.VITE_SUPABASE_ANON_KEY)) ||
    ''
  ).trim();

  const localUrl = (typeof localStorage !== 'undefined' ? localStorage.getItem('erp_supabase_url') || '' : '').trim();
  const localKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('erp_supabase_anon_key') || '' : '').trim();

  const url = envUrl || localUrl;
  const anonKey = envKey || localKey;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('http') &&
    anonKey.length > 10
  );

  return { url, anonKey, isConfigured };
}

let cachedClient: SupabaseClient | null = null;
let cachedClientUrl = '';
let cachedClientKey = '';

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && cachedClientUrl === url && cachedClientKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined
      }
    });
    cachedClientUrl = url;
    cachedClientKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  const trimmedUrl = url.trim();
  const trimmedKey = anonKey.trim();

  if (trimmedUrl) {
    localStorage.setItem('erp_supabase_url', trimmedUrl);
  } else {
    localStorage.removeItem('erp_supabase_url');
  }

  if (trimmedKey) {
    localStorage.setItem('erp_supabase_anon_key', trimmedKey);
  } else {
    localStorage.removeItem('erp_supabase_anon_key');
  }

  // Invalidate cached client
  cachedClient = null;
  cachedClientUrl = '';
  cachedClientKey = '';
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const targetUrl = url ? url.trim() : getSupabaseConfig().url;
    const targetKey = anonKey ? anonKey.trim() : getSupabaseConfig().anonKey;

    if (!targetUrl || !targetKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon API Key.' };
    }

    if (!targetUrl.startsWith('https://') || !targetUrl.includes('.supabase.co')) {
      return { success: false, message: 'Invalid Supabase URL format. Expected: https://<project-ref>.supabase.co' };
    }

    const testClient = createClient(targetUrl, targetKey);
    // Ping Supabase PostgREST endpoint
    const { error } = await testClient.from('companies').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, it means credentials are valid but schema hasn't been run
      if (error.code === '42P01' || error.message.includes('relation "companies" does not exist') || error.message.includes('not found')) {
        return {
          success: true,
          message: 'Connection successful! Note: The "companies" table was not found yet. Please run the provided SQL schema in your Supabase SQL editor.'
        };
      }
      return { success: false, message: `Supabase Error: ${error.message} (Code: ${error.code})` };
    }

    return { success: true, message: 'Connected to Supabase PostgreSQL database successfully!' };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err?.message || 'Network error'}` };
  }
}
