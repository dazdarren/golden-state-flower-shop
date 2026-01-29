'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

        {/* Success Message */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-forest-900 mb-4">
                Check Your Email
              </h1>
              <p className="text-forest-800/60 mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
                Click the link in the email to reset your password.
              </p>
              <Link
                href="/auth/login"
                className="inline-block py-3 px-6 bg-forest-900 text-cream-100 rounded-xl
                         font-medium transition-all duration-300
                         hover:bg-forest-800 hover:shadow-soft-lg"
              >
                Return to Sign In
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
                Forgot Password?
              </h1>
              <p className="text-forest-800/60 mt-2">
                No worries! Enter your email and we'll send you reset instructions.
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
                  htmlFor="email"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="you@example.com"
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-cream-200 text-center">
              <Link
                href="/auth/login"
                className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
