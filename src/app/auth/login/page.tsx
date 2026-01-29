'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/ca/san-francisco';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(redirect);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                Welcome Back
              </h1>
              <p className="text-forest-800/60 mt-2">
                Sign in to your account to continue
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-forest-800"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-sage-600 hover:text-sage-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="Enter your password"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-cream-200 text-center">
              <p className="text-forest-800/60">
                Don't have an account?{' '}
                <Link
                  href={`/auth/register${redirect !== '/ca/san-francisco' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-forest-800/50 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/ca/san-francisco/terms" className="underline hover:text-forest-800/70">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/ca/san-francisco/privacy" className="underline hover:text-forest-800/70">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
