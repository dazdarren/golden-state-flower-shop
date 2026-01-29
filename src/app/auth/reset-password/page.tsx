'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, updatePassword } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      if (!supabase) {
        setValidSession(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setValidSession(!!session);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-800/60">Loading...</div>
      </div>
    );
  }

  // Invalid or expired link
  if (!validSession) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col">
        <header className="py-6 border-b border-cream-200 bg-white">
          <div className="container-wide">
            <Link href="/ca/san-francisco" className="flex items-center gap-3">
              <svg
                className="w-10 h-10 text-sage-600"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-forest-900">
                  Golden State
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-sage-600 -mt-0.5">
                  Flower Shop
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-forest-900 mb-4">
                Invalid or Expired Link
              </h1>
              <p className="text-forest-800/60 mb-6">
                This password reset link is invalid or has expired.
                Please request a new one.
              </p>
              <Link
                href="/auth/forgot-password"
                className="inline-block py-3 px-6 bg-forest-900 text-cream-100 rounded-xl
                         font-medium transition-all duration-300
                         hover:bg-forest-800 hover:shadow-soft-lg"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col">
        <header className="py-6 border-b border-cream-200 bg-white">
          <div className="container-wide">
            <Link href="/ca/san-francisco" className="flex items-center gap-3">
              <svg
                className="w-10 h-10 text-sage-600"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-forest-900">
                  Golden State
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-sage-600 -mt-0.5">
                  Flower Shop
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-forest-900 mb-4">
                Password Updated!
              </h1>
              <p className="text-forest-800/60 mb-6">
                Your password has been successfully reset.
                Redirecting you to sign in...
              </p>
              <Link
                href="/auth/login"
                className="inline-block py-3 px-6 bg-forest-900 text-cream-100 rounded-xl
                         font-medium transition-all duration-300
                         hover:bg-forest-800 hover:shadow-soft-lg"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Header */}
      <header className="py-6 border-b border-cream-200 bg-white">
        <div className="container-wide">
          <Link href="/ca/san-francisco" className="flex items-center gap-3">
            <svg
              className="w-10 h-10 text-sage-600"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold text-forest-900">
                Golden State
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sage-600 -mt-0.5">
                Flower Shop
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-semibold text-forest-900">
                Set New Password
              </h1>
              <p className="text-forest-800/60 mt-2">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-forest-900 text-cream-100 rounded-xl
                         font-medium transition-all duration-300
                         hover:bg-forest-800 hover:shadow-soft-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
