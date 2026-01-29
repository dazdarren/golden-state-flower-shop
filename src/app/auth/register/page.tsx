'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUp } from '@/lib/supabase';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/ca/san-francisco';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }
      );

      if (signUpError) {
        setError(signUpError.message);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-forest-900 mb-4">
                Check Your Email
              </h1>
              <p className="text-forest-800/60 mb-6">
                We've sent a confirmation link to <strong>{formData.email}</strong>.
                Click the link to verify your account.
              </p>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
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
                Create Account
              </h1>
              <p className="text-forest-800/60 mt-2">
                Join us for exclusive offers and faster checkout
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-forest-800 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300
                             focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                             outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-forest-800 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300
                             focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                             outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  Phone Number <span className="text-forest-800/40">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-forest-800 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-cream-200 text-center">
              <p className="text-forest-800/60">
                Already have an account?{' '}
                <Link
                  href={`/auth/login${redirect !== '/ca/san-francisco' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-forest-800/50 mt-6">
            By creating an account, you agree to our{' '}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
