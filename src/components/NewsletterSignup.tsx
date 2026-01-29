'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  source?: string;
  className?: string;
}

export default function NewsletterSignup({
  variant = 'inline',
  source = 'website',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.data?.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  // Reset status after showing message
  const resetForm = () => {
    setStatus('idle');
    setMessage('');
  };

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="font-display text-lg font-semibold text-cream-100 mb-3">
          Stay in Bloom
        </h3>
        <p className="text-sm text-cream-200/70 mb-4">
          Get exclusive offers and flower care tips delivered to your inbox.
        </p>

        {status === 'success' ? (
          <div className="bg-sage-600/20 border border-sage-500/30 text-sage-300 px-4 py-3 rounded-xl text-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') resetForm();
                }}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl bg-forest-800/50 border border-forest-700
                         text-cream-100 placeholder:text-cream-200/50
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />
            </div>

            {status === 'error' && (
              <p className="text-rose-400 text-sm">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 px-4 bg-sage-600 text-white rounded-xl
                       font-medium transition-all duration-300
                       hover:bg-sage-500 hover:shadow-soft-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl p-8 border border-sage-100 ${className}`}
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-semibold text-forest-900 mb-2">
            Stay in Bloom
          </h3>
          <p className="text-forest-800/60 mb-6">
            Subscribe for exclusive offers, seasonal collections, and flower care tips.
          </p>

          {status === 'success' ? (
            <div className="bg-sage-100 border border-sage-200 text-sage-700 px-4 py-3 rounded-xl">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') resetForm();
                }}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />

              {status === 'error' && (
                <p className="text-rose-600 text-sm text-left">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 bg-forest-900 text-cream-100 rounded-xl
                         font-medium transition-all duration-300
                         hover:bg-forest-800 hover:shadow-soft-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              <p className="text-xs text-forest-800/50">
                No spam, unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Default: inline variant
  return (
    <div className={className}>
      {status === 'success' ? (
        <div className="bg-sage-100 border border-sage-200 text-sage-700 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') resetForm();
            }}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-cream-300
                     focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                     outline-none transition-all duration-200"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-forest-900 text-cream-100 rounded-xl
                     font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-rose-600 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
