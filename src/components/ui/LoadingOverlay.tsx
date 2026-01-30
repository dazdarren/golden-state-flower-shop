'use client';

import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export function LoadingOverlay({
  message = 'Loading...',
  fullScreen = false,
  transparent = false,
}: LoadingOverlayProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-10';

  const backgroundClasses = transparent
    ? 'bg-white/60 backdrop-blur-sm'
    : 'bg-cream-100/95 backdrop-blur-md';

  return (
    <div className={`${containerClasses} ${backgroundClasses} flex items-center justify-center`}>
      <div className="text-center">
        <LoadingSpinner size="xl" color="sage" className="mx-auto" />
        {message && (
          <p className="mt-4 text-forest-800/60 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default LoadingOverlay;
