'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-3">
              Something went wrong
            </h2>
            <p className="text-forest-800/60 mb-6">
              We apologize for the inconvenience. Please try again or contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-sage-600 text-white font-medium rounded-xl
                         hover:bg-sage-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-cream-300 text-forest-800 font-medium rounded-xl
                         hover:bg-cream-50 transition-colors"
              >
                Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left p-4 bg-cream-100 rounded-xl">
                <summary className="text-sm font-medium text-forest-800 cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
