/**
 * Supabase Client Configuration
 *
 * This module provides the Supabase client for browser-side operations.
 * For server-side operations in Cloudflare Functions, use the functions/lib/supabase.ts client.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Auth features will be disabled.');
}

// Create client only if credentials are available
const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Export as potentially null for conditional checks
export const supabase = supabaseClient;

// Export typed client getter for use after null checks
export function getSupabase() {
  if (!supabaseClient) {
    throw new Error('Supabase not configured');
  }
  return supabaseClient;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabase;
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current session
 */
export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, metadata?: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.signOut();
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.updateUser({
    password: newPassword,
  });
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return supabase.auth.updateUser({
    data: metadata,
  });
}
