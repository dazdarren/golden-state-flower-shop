'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Page error:', error);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-semibold text-forest-900 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-forest-800/60 mb-8 leading-relaxed">
          We encountered an unexpected error while loading this page.
          Our team has been notified and is working on a fix.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3.5 bg-sage-600 text-white font-semibold rounded-xl
                     hover:bg-sage-700 transition-colors shadow-soft"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 border-2 border-cream-300 text-forest-800 font-semibold rounded-xl
                     hover:bg-cream-50 hover:border-sage-300 transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Error digest for support */}
        {error.digest && (
          <p className="mt-8 text-xs text-forest-800/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
